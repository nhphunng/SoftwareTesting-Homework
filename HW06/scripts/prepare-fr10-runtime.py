#!/usr/bin/env python3
"""Prepare reproducible FR10 runtime fixtures against the real local SUT.

Creates fresh timestamped User A/User B accounts through documented APIs, logs in
with the documented admin account, creates disposable pending orders through
POST /api/checkout, moves selected orders through documented admin state APIs,
verifies final states, updates the git-ignored private Postman environment, and
writes non-secret runtime metadata/manifest files.

This script intentionally does NOT run Newman.
"""

import base64
import json
import os
import secrets
import time
import urllib.error
import urllib.request
from pathlib import Path

BASE = "http://localhost:3000"
STUDENT_ID = "23127194"
ROOT = Path(__file__).resolve().parents[1]
PRIVATE_ENV = ROOT / "postman/environment/HW06-FR10-Local.private.postman_environment.json"
RUNTIME_DATA = ROOT / "postman/data/FR10-runtime-data.json"
MANIFEST = ROOT / "PoolB-FR-10-CancelOrder/postman/runtime-fixture-manifest.json"


def request(method, path, body=None, token=None):
    data = None if body is None else json.dumps(body).encode()
    headers = {"X-Student-Id": STUDENT_ID}
    if body is not None:
        headers["Content-Type"] = "application/json"
    if token:
        headers["Authorization"] = "Bearer " + token
    req = urllib.request.Request(BASE + path, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            raw = resp.read().decode()
            return resp.status, json.loads(raw) if raw else None
    except urllib.error.HTTPError as exc:
        raw = exc.read().decode()
        try:
            parsed = json.loads(raw) if raw else None
        except json.JSONDecodeError:
            parsed = raw
        return exc.code, parsed


def must(method, path, body=None, token=None, expected=(200,)):
    status, payload = request(method, path, body, token)
    if status not in expected:
        raise RuntimeError(f"{method} {path} -> {status} {payload}")
    return payload


def main():
    stamp = time.strftime("%Y%m%d%H%M%S")
    password = "Fr10Runtime!" + secrets.token_urlsafe(12)
    admin_password = os.environ.get("FR10_ADMIN_PASSWORD")
    if not admin_password:
        raise RuntimeError("Set FR10_ADMIN_PASSWORD to the documented local SUT admin password before preparing FR10 fixtures.")

    users = []
    for label in ("A", "B"):
        email = f"hw06.fr10.user{label.lower()}.{stamp}@example.test"
        must(
            "POST",
            "/api/register",
            {"name": f"HW06 FR10 User {label} {stamp}", "email": email, "password": password},
        )
        login = must("POST", "/api/login", {"email": email, "password": password})
        users.append({"label": label, "id": login["user"]["id"], "email": email, "token": login["token"]})

    admin = must("POST", "/api/login", {"email": "admin@eshop.com", "password": admin_password})
    admin_token = admin["token"]
    user_a, user_b = users

    def create_order(token, label):
        result = must(
            "POST",
            "/api/checkout",
            {"total_amount": 100000, "shipping_address": f"HW06 FR10 {label} {stamp}"},
            token,
        )
        return int(result["orderId"])

    def set_state(order_id, target):
        if target == "pending":
            return
        sequences = {
            "confirmed": ["confirmed"],
            "shipping": ["confirmed", "shipping"],
            "delivered": ["confirmed", "shipping", "delivered"],
            "canceled": ["canceled"],
        }
        for state in sequences[target]:
            must("PUT", f"/api/admin/orders/{order_id}/status", {"status": state}, admin_token)

    fixture_spec = {
        "pendingOrderId": ("A", "pending"),
        "canonicalRequestOrderId": ("A", "pending"),
        "confirmedOrderId": ("A", "confirmed"),
        "shippingOrderId": ("A", "shipping"),
        "deliveredOrderId": ("A", "delivered"),
        "canceledOrderId": ("A", "canceled"),
        "boundaryConfirmedOrderId": ("A", "confirmed"),
        "boundaryShippingOrderId": ("A", "shipping"),
        "pendingBodyEmptyOrderId": ("A", "pending"),
        "pendingMalformedBodyOrderId": ("A", "pending"),
        "pendingNullBodyOrderId": ("A", "pending"),
        "pendingArrayBodyOrderId": ("A", "pending"),
        "pendingLargeBodyOrderId": ("A", "pending"),
        "pendingBenignQueryOrderId": ("A", "pending"),
        "repeatPendingOrderId": ("A", "pending"),
        "repeatConfirmedOrderId": ("A", "confirmed"),
        "unauthPendingOrderId": ("A", "pending"),
        "tamperedConfirmedOrderId": ("A", "confirmed"),
        "statusBodyOrderId": ("A", "pending"),
        "statusQueryOrderId": ("A", "confirmed"),
        "missingAuthOrderId": ("A", "pending"),
        "emptyAuthOrderId": ("A", "pending"),
        "bearerOnlyOrderId": ("A", "pending"),
        "malformedJwtOrderId": ("A", "pending"),
        "invalidSigOrderId": ("A", "pending"),
        "basicAuthOrderId": ("A", "pending"),
        "userBPendingOrderId": ("B", "pending"),
        "userBConfirmedOrderId": ("B", "confirmed"),
        "userAOwnershipBodyOrderId": ("A", "pending"),
        "queryPathOwnOrderId": ("A", "pending"),
        "schemaSuccessOrderId": ("A", "pending"),
        "schemaShippingOrderId": ("A", "shipping"),
        "schemaAuthOrderId": ("A", "pending"),
        "headerEvidenceOrderId": ("A", "pending"),
        "human043UserBPendingOrderId": ("B", "pending"),
        "human044UserBPendingOrderId": ("B", "pending"),
        "human045UserBConfirmedOrderId": ("B", "confirmed"),
        "human046PendingOrderId": ("A", "pending"),
        "human047UserBPendingOrderId": ("B", "pending"),
        "human048PendingOrderId": ("A", "pending"),
    }

    ids = {}
    for variable, (owner, state) in fixture_spec.items():
        token = user_a["token"] if owner == "A" else user_b["token"]
        order_id = create_order(token, variable)
        set_state(order_id, state)
        status, order = request("GET", f"/api/orders/{order_id}", token=token)
        if status != 200 or order.get("status") != state:
            raise RuntimeError(f"Fixture verification failed for {variable}: {status} {order}")
        ids[variable] = order_id

    nonexistent = max(ids.values()) + 10000
    status, _ = request("GET", f"/api/orders/{nonexistent}", token=user_a["token"])
    if status != 404:
        raise RuntimeError(f"Chosen nonExistingOrderId unexpectedly exists: {nonexistent}")

    parts = user_a["token"].split(".")
    signature = parts[2]
    replacement = "A" if signature[-1] != "A" else "B"
    tampered_jwt = ".".join([parts[0], parts[1], signature[:-1] + replacement])
    basic_auth_value = base64.b64encode(f'{user_a["email"]}:{password}'.encode()).decode()

    env = json.loads(PRIVATE_ENV.read_text())
    values = {entry["key"]: entry for entry in env["values"]}
    updates = {
        "userAToken": user_a["token"],
        "userBToken": user_b["token"],
        "adminToken": admin_token,
        "userAId": str(user_a["id"]),
        "userBId": str(user_b["id"]),
        "tamperedJwt": tampered_jwt,
        "basicAuthValue": basic_auth_value,
        "nonExistingOrderId": str(nonexistent),
        **{key: str(value) for key, value in ids.items()},
    }
    for key, value in updates.items():
        if key not in values:
            raise RuntimeError(f"Private environment is missing required key: {key}")
        values[key]["value"] = value
    PRIVATE_ENV.write_text(json.dumps(env, indent=2, ensure_ascii=False) + "\n")

    RUNTIME_DATA.parent.mkdir(parents=True, exist_ok=True)
    RUNTIME_DATA.write_text(
        json.dumps(
            [
                {
                    "runtimeProfile": f"FR10-dedicated-fixtures-{stamp}",
                    "studentId": STUDENT_ID,
                    "fixtureCreatedAt": stamp,
                    "fixtureOrderCount": len(ids),
                    "nonExistingOrderId": nonexistent,
                }
            ],
            indent=2,
        )
        + "\n"
    )

    manifest = {
        "createdAt": stamp,
        "baseUrl": BASE,
        "userA": {"id": user_a["id"], "email": user_a["email"]},
        "userB": {"id": user_b["id"], "email": user_b["email"]},
        "adminEmail": "admin@eshop.com",
        "orders": {
            key: {"id": ids[key], "owner": fixture_spec[key][0], "state": fixture_spec[key][1]}
            for key in ids
        },
        "nonExistingOrderId": nonexistent,
        "setupMethod": "API register/login + POST /api/checkout + PUT /api/admin/orders/:id/status",
        "cleanupStrategy": "After official evidence is preserved, delete the dedicated fixture orders/users or rerun this script to create a fresh isolated fixture set before another official run.",
    }
    MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n")

    counts = {
        state: sum(1 for _, fixture_state in fixture_spec.values() if fixture_state == state)
        for state in ("pending", "confirmed", "shipping", "delivered", "canceled")
    }
    print(json.dumps({"createdUsers": [user_a["id"], user_b["id"]], "orders": len(ids), "stateCounts": counts, "nonExistingOrderId": nonexistent}, indent=2))


if __name__ == "__main__":
    main()
