# Security Specification: Tindouf Tourism Platform

## 1. Data Invariants
- Public users (unauthenticated visitors and tourists) have read access to published documents across `tourism_routes`, `route_stops`, `hotels`, `travel_agencies`, `artisans`, `tourist_sites`, `site_categories`, `directorate_info`, and `homepage_settings`.
- Only authenticated administrators (whose UID is present in `/admins/{uid}`) have permission to create, update, or delete records in any collection.
- Administrators must be email-verified (`request.auth.token.email_verified == true`).
- The admin collection itself `/admins/{uid}` can only be read by authenticated users to verify their role, and cannot be modified by regular users.
- Bootstrapped admin email `aichasmbaoin@gmail.com` has automatic master administrative authority.
- All documents must satisfy strict string length boundaries to prevent resource exhaustion attacks.
- Document IDs must match standard safe identifier patterns `^[a-zA-Z0-9_-]+$`.

## 2. The Dirty Dozen Payloads (Designed to Break Identity, Integrity, and State)
1. **Unauthenticated Write Payload**: An anonymous visitor trying to delete a hotel.
2. **Ghost Field Poisoning**: Inserting extra unauthorized fields (e.g. `isAdmin: true` or `ghostField: 'overflow'`) into a hotel or route document.
3. **Admin Escalation**: A signed-in non-admin attempting to write their own UID into `/admins/{uid}` with `role: "superadmin"`.
4. **ID Injection Attack**: Using a 10KB string with special characters like `/hotels/../../evil` as the document ID.
5. **Route Stop Orphan**: Creating a route stop with an empty or non-existent routeId.
6. **Negative Distance**: Creating a route with distance `-500` km.
7. **Invalid Latitude/Longitude**: Latitude `95.0` or Longitude `200.0`.
8. **Script Injection in Name**: `<script>alert('hack')</script>` in hotel name.
9. **Unverified Email Claim**: User signing in with unverified email attempting administrative changes.
10. **Corrupted Boolean Toggle**: Setting `isPublished` to `"yes"` (string) instead of boolean.
11. **Excessive Gallery Array**: Pushing 20,000 URLs to cause denial of wallet.
12. **Null Values for Required Keys**: Creating a hotel without `phone` or `name`.

All 12 attacks must evaluate to `PERMISSION_DENIED`.
