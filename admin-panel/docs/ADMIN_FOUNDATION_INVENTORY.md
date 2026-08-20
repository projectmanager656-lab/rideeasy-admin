# RideEasy Admin Panel Foundation Inventory

## Day 1 Objective

Define the Admin Web panel structure, navigation, page responsibilities,
UI requirements, permissions, backend dependencies, and operational states
before continuing feature development.

---

# 1. Admin Sitemap

```text
Dashboard
├── Users
├── Drivers
├── Vehicles
├── Verification
├── Rides
├── Live Operations
├── Finance
├── Payments
├── SOS
├── Support
├── Reports
├── Notifications
├── Services
├── Pricing
├── Roles / Permissions
└── Settings
# 2. Complete Page Inventory

| # | Page | Route / Tab | Current Status | Purpose |
|---|---|---|---|---|
| 1 | Dashboard | `/admin/dashboard` → `analytics` | ✅ Existing | Platform overview and key operational metrics |
| 2 | Users | `users` | ✅ Existing | Manage registered passengers/users |
| 3 | Drivers | `drivers` | ✅ Existing | Manage driver accounts, approval and status |
| 4 | Vehicles | `/admin/vehicles` | ✅ Existing | Manage registered vehicles and vehicle status |
| 5 | Verification | `verification` → Drivers | 🟡 Partial | Review driver verification/document status and approve or reject |
| 6 | Rides | `rides` | ✅ Existing | Monitor and manage ride records and ride status |
| 7 | Finance | `finance` | 🟡 Partial | View/manage platform financial and pricing-related information |
| 8 | Payments | `payments` | ✅ Existing | Monitor ride payments and payment status |
| 9 | SOS | `sos` → Safety | 🟡 Partial | Monitor and manage emergency/SOS alerts |
| 10 | Support | `support` → Complaints | 🟡 Partial | Review and manage user/driver complaints |
| 11 | Reports | `reports` | ✅ Existing | View operational and platform reports |
| 12 | Notifications | Admin Notifications | ✅ Existing | Manage/view admin notifications |
| 13 | Services | `services` | ✅ Existing | Manage available RideEasy services |
| 14 | Pricing | `pricing` | ✅ Existing | Configure and manage platform pricing |
| 15 | Settings | `settings` | ✅ Existing | Manage Admin configuration/settings |
# 3. Page Purpose and Fields

| Page | Purpose | Main Fields / Data |
|---|---|---|
| Dashboard | Provide an operational overview of the RideEasy platform. | Total Users, Total Drivers, Total Rides/Bookings, Total Revenue, Completed Rides, Top Driver, Pending Actions, Recent Activity |
| Users | Manage registered passengers/users. | User ID, Name, Email, Phone, City, Account Status, Block Status, Created Date |
| Drivers | Manage registered drivers and their account/approval status. | Driver ID, Name, Email, Phone, City, Vehicle, Approval Status, Online Status, Block Status, Completed Rides, Rating |
| Vehicles | Manage registered vehicles associated with drivers. | Vehicle Number, Vehicle Type, Vehicle Model, Driver, RC Status, Insurance Status, Registration Date, Vehicle Status |
| Verification | Review driver verification information and take approval/rejection actions. | Driver, Personal Details, RC, DL, Aadhaar, PAN, Document Status, Submission Date, Verification Status, Admin Remarks, Rejection Reason |
| Rides | Monitor and manage ride records. | Ride ID, User, Driver, Vehicle, Pickup, Destination, Ride Status, Booking Time, Status Timeline, Booked Fare, Final Fare, Payment Status |
| Finance | Provide platform-level financial information and financial configuration where applicable. | Revenue, Ride Revenue, Completed Rides, Pricing Information, Financial Summary |
| Payments | Monitor ride payment transactions and payment status. | Payment ID, Ride ID, User, Driver, Amount, Payment Method, Payment Status, Transaction ID, Created Date, Completed Date |
| SOS | Monitor and manage emergency/SOS alerts. | Alert ID, User, Driver, Ride ID, Location, Alert Type, Alert Status, Created Date, Acknowledged Date, Resolved Date |
| Support | Review and manage user/driver complaints and support issues. | Complaint ID, User, Driver, Ride ID, Complaint Type, Description, Status, Priority, Created Date, Resolution |
| Reports | Provide operational and platform reporting information. | Report Type, Date Range, Users, Drivers, Rides, Revenue, Payments, Operational Metrics |
| Notifications | View and manage Admin notifications and notification status. | Notification ID, Title, Message, Type, Recipient, Read Status, Created Date |
| Services | Manage services available on the RideEasy platform. | Service ID, Service Name, Description, Status, Base Price, Created Date, Updated Date |
| Pricing | Manage platform pricing configuration. | Base Fare, Per KM Rate, Per Minute Rate, Minimum Fare, Service Charges, Taxes, Effective Status, Updated Date |
| Settings | Manage Admin/platform configuration and administrative preferences. | Setting Name, Setting Value, Configuration Status, Updated By, Updated Date |
# 4. Page Buttons and Actions

| Page | Buttons / Actions |
|---|---|
| Dashboard | Refresh Dashboard, Open Pending Action, Navigate to Users, Drivers, Payments, Safety |
| Users | Search, Select User, Select All, Clear Selection, Block, Unblock, Delete, Bulk Delete |
| Drivers | Search, Select Driver, Select All, Clear Selection, Approve, Reject, Block, Unblock, Delete, Bulk Delete |
| Vehicles | Search, Filter by Status, View Vehicle Information, Navigate to Driver |
| Verification | Search Driver, Open Driver, View Documents, Approve, Reject, Request Re-upload, Add Admin Remarks |
| Rides | Search, Filter by Ride Status, Open Ride Details, Delete Ride |
| Finance | Filter by Date Range, View Financial Summary, View Revenue Details, Export Report |
| Payments | Search, Filter Payment Status, Open Payment Details, Refresh |
| SOS | View Alert, Acknowledge Alert, Resolve Alert, View Police Stations, Refresh |
| Support | Search Complaint, Filter Status, Open Complaint, Update Status, Resolve Complaint |
| Reports | Select Report Type, Select Date Range, Generate Report, View Report, Export Report |
| Notifications | View Notification, Mark as Read, Refresh, Filter Notifications |
| Services | Search, Add Service, Edit Service, Delete Service, Enable/Disable Service |
| Pricing | View Pricing, Edit Pricing, Save Pricing, Cancel Changes |
| Settings | View Settings, Edit Settings, Save Changes, Cancel Changes |
# 5. Page Filters

| Page | Filters |
|---|---|
| Dashboard | No primary filter; dashboard uses current platform data |
| Users | Search by name, email, phone, city; status filter |
| Drivers | Search by name, email, vehicle, city; approval/status filter |
| Vehicles | Search by vehicle number, type, model, driver; vehicle status filter |
| Verification | Search by driver; verification status; document status |
| Rides | Search by Ride ID, user, driver; ride status; date range |
| Finance | Date range; transaction/revenue type |
| Payments | Search by payment/ride/user; payment status; date range |
| SOS | Search by alert/user/driver; alert status; date range |
| Support | Search by complaint/user/driver; complaint status; date range |
| Reports | Report type; date range; status/category where applicable |
| Notifications | Notification type; read/unread status; date range |
| Services | Search by service name; active/inactive status |
| Pricing | Service/type/category where applicable |
| Settings | Settings category/section |
# 6. Permissions Matrix

| Page | Admin | Operations Admin | Finance Admin | Support Admin | Read Only |
|---|---|---|---|---|---|
| Dashboard | View | View | View | View | View |
| Users | View / Manage | View / Manage | View | View | View |
| Drivers | View / Manage | View / Manage | View | View | View |
| Vehicles | View / Manage | View / Manage | View | View | View |
| Verification | View / Approve / Reject | View / Approve / Reject | View | View | View |
| Rides | View / Manage | View / Manage | View | View | View |
| Finance | View / Manage | View | View / Manage | View | View |
| Payments | View / Manage | View | View / Manage | View | View |
| SOS | View / Manage | View / Manage | View | View / Manage | View |
| Support | View / Manage | View / Manage | View | View / Manage | View |
| Reports | View / Export | View / Export | View / Export | View / Export | View |
| Notifications | View / Manage | View / Manage | View | View / Manage | View |
| Services | View / Manage | View | View | View | View |
| Pricing | View / Manage | View | View / Manage | View | View |
| Settings | Full Access | View | View | View | View |
# 7. API Dependency Matrix

| Page | API Dependency | Operations | Current Status |
|---|---|---|---|
| Dashboard | `/admin/analytics` | GET | ✅ Implemented |
| Users | `/admin/users` | GET | ✅ Implemented |
| Users | `/admin/users/:id/block` | PATCH | ✅ Implemented |
| Users | `/admin/users/:id` | DELETE | ✅ Implemented |
| Drivers | `/admin/drivers` | GET | ✅ Implemented |
| Drivers | `/admin/drivers/:id/approve` | PUT | ✅ Implemented |
| Drivers | `/admin/drivers/:id/reject` | PUT | ✅ Implemented |
| Drivers | `/admin/drivers/:id/block` | PATCH | ✅ Implemented |
| Drivers | `/admin/drivers/:id` | DELETE | ✅ Implemented |
| Vehicles | `/admin/drivers` | GET | ⚠️ Vehicle data sourced from drivers |
| Verification | `/admin/drivers` | GET | ⚠️ Uses driver data |
| Verification | `/admin/drivers/:id/approve` | PUT | ✅ Implemented |
| Verification | `/admin/drivers/:id/reject` | PUT | ✅ Implemented |
| Rides | `/admin/rides` | GET | ✅ Implemented |
| Rides | `/admin/rides/:id` | DELETE | ✅ Implemented |
| Finance | `/admin/pricing` | GET / PUT | ⚠️ Partial |
| Payments | `/admin/payments` | GET | ✅ Implemented |
| SOS | `/admin/safety/emergency-alerts` | GET | ✅ Implemented |
| SOS | `/admin/safety/emergency-alerts/:id/acknowledge` | POST | ✅ Implemented |
| SOS | `/admin/safety/emergency-alerts/:id/resolve` | POST | ✅ Implemented |
| SOS | `/admin/safety/police-stations` | GET | ✅ Implemented |
| Support | Complaints API | GET / UPDATE | ⚠️ Verify backend dependency |
| Reports | Analytics / report APIs | GET | ⚠️ Verify backend dependency |
| Notifications | Admin notification API | GET / UPDATE | ⚠️ Verify backend dependency |
| Services | `/admin/services` | GET / POST / PUT / DELETE | ✅ Implemented |
| Pricing | `/admin/pricing` | GET / PUT | ✅ Implemented |
| Settings | Admin settings API | GET / UPDATE | ⚠️ Verify backend dependency |
# 8. Dashboard Metric → Backend Source Mapping

Dashboard metrics must come from backend responses. No hard-coded operational numbers
should be used for production dashboard cards.

| Dashboard Metric | Backend Source | Response Field | Current Status |
|---|---|---|---|
| Total Users | `/admin/analytics` | `totalUsers` | ✅ Mapped |
| Total Drivers | `/admin/analytics` | `totalDrivers` | ✅ Mapped |
| Total Bookings | `/admin/analytics` | `totalRides` | ✅ Mapped |
| Total Revenue | `/admin/analytics` | `totalRevenue` | ✅ Mapped |
| Completed Rides | `/admin/analytics` | `completedRideCount` | ✅ Mapped |
| Top Driver | `/admin/drivers` | `completedRides`, `rating` / `averageRating` | ⚠️ Derived in frontend |
| Driver Verification Pending | `/admin/drivers` | `approved` | ⚠️ Derived in frontend |
| Documents Pending | `/admin/drivers` | `documentsSubmitted`, `documentsStatus` / `documentStatus` | ⚠️ Derived in frontend |
| Failed Payments | `/admin/payments` | `paymentStatus` | ⚠️ Derived in frontend |
| Recent Driver Registration | `/admin/drivers` | `createdAt` | ⚠️ Derived in frontend |
| Recent Document Submission | `/admin/drivers` | `documentsSubmittedAt` / `documentSubmittedAt` | ⚠️ Depends on backend field |
| Recent Ride Completed | `/admin/rides` | `status`, `completedAt` | ⚠️ Derived in frontend |
| Recent Payment Received | `/admin/payments` | `completedAt` / `createdAt` | ⚠️ Derived in frontend |

## Dashboard Metric Rule

- Do not invent dashboard metrics.
- Every production metric must have a backend source.
- Backend-provided analytics values should be preferred over frontend-derived totals.
- Frontend-derived values must use actual API response fields.
- If a required metric has no backend field/API, mark it as a missing dependency.
# 9. Loading / Empty / Error State Audit

Every Admin page must explicitly handle loading, empty and error states.

| Page | Loading State | Empty State | Error State | Status |
|---|---|---|---|---|
| Dashboard | Dashboard loader | No activity / metric data message | Analytics error + retry | ✅ |
| Users | Users loading state | No users found | API error + retry | ✅ |
| Drivers | Drivers loading state | No drivers found | API error + retry | ✅ |
| Vehicles | Vehicles loading state | No vehicles found | API error message | ✅ |
| Verification | Driver/document loading state | No pending verification | API error + retry | 🟡 Partial |
| Rides | Rides loading state | No rides found | API error + retry | ✅ |
| Finance | Finance data loading state | No financial records | API error + retry | 🟡 Partial |
| Payments | Payments loading state | No payments found | API error + retry | ✅ |
| SOS | Emergency alerts loading state | No active alerts | API error + retry | 🟡 Partial |
| Support | Complaints loading state | No complaints found | API error + retry | 🟡 Partial |
| Reports | Report loading state | No report data | API error + retry | 🟡 Partial |
| Notifications | Notifications loading state | No notifications | API error + retry | 🟡 Partial |
| Services | Services loading state | No services configured | API error + retry | ✅ |
| Pricing | Pricing loading state | No pricing configuration | API error + retry | ✅ |
| Settings | Settings loading state | No configuration available | API error + retry | 🟡 Partial |

## State Standard

### Loading
Use the shared `Loader` component wherever possible.

### Empty
Use the shared `EmptyState` component with a useful message and, where
appropriate, a next action.

### Error
Use the shared `ErrorState` component with a retry action whenever the
operation can safely be retried.

### Rule
No Admin page should remain blank while data is loading, unavailable,
empty, or failed.
# 10. Driver Verification Backend Workflow

## Expected Workflow

```text
Pending Driver
→ Open Driver
→ View Driver Profile
→ View RC / DL / Aadhaar / PAN documents
→ Approve OR Reject
→ Backend verification status changes
→ Audit log created
→ Driver receives status notification
# 11. Ride Details Backend Fields

## Required Ride Details

| Field | Purpose | Backend Source | Current Status |
|---|---|---|---|
| Ride ID | Identify the ride | `/admin/rides` | 🟡 Verify field |
| User | Identify passenger | `/admin/rides` | 🟡 Verify field |
| Driver | Identify assigned driver | `/admin/rides` | 🟡 Verify field |
| Vehicle | Identify vehicle used | `/admin/rides` / driver data | 🟡 Verify field |
| Pickup | Show ride starting location | `/admin/rides` | 🟡 Verify field |
| Destination | Show ride destination | `/admin/rides` | 🟡 Verify field |
| Status | Current ride state | `/admin/rides` | 🟡 Verify field |
| Status Timeline | Show ride lifecycle | `/admin/rides` | ❌ Not proven |
| Booked Fare | Original fare | `/admin/rides` | 🟡 Verify field |
| Final Fare | Final charged fare | `/admin/rides` | 🟡 Verify field |
| Payment | Payment method/status/amount | `/admin/payments` | 🟡 Partial |
| SOS History | Emergency events for ride | Safety API | ❌ Not proven |
| Support History | Complaints/support events for ride | Support API | ❌ Not proven |

## Required Ride Detail Flow

```text
Ride List
→ Open Ride
→ Ride Details
→ User + Driver + Vehicle
→ Pickup + Destination
→ Status Timeline
→ Fare Details
→ Payment Details
→ SOS / Support History
# 12. Desktop / Laptop / Mobile Wireframe Notes

## Admin Shell

### Desktop — ≥ 1024px

```text
┌─────────────────────────────────────────────────────────────────────┐
│ Sidebar                 │ Topbar                                   │
│                         ├───────────────────────────────────────────┤
│ RideEasy Admin          │ Page Title          Search / Actions     │
│                         │                                           │
│ Dashboard               │ ┌─────────┐ ┌─────────┐ ┌─────────┐    │
│ Users                   │ │ Metric  │ │ Metric  │ │ Metric  │    │
│ Drivers                 │ └─────────┘ └─────────┘ └─────────┘    │
│ Vehicles                │                                           │
│ Verification            │ Main Page Content                         │
│ Rides                   │                                           │
│ Finance                 │ Tables / Cards / Forms                    │
│ Payments                │                                           │
│ SOS                     │                                           │
│ Support                 │                                           │
│ Reports                 │                                           │
│ Settings                │                                           │
└─────────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────┐
│ Sidebar │ Topbar                                         │
│         ├────────────────────────────────────────────────┤
│ Icons + │ Page Header                                    │
│ labels  │                                                │
│         │ Cards / Tables                                 │
│         │                                                │
│         │ Horizontal scrolling for wide tables           │
└──────────────────────────────────────────────────────────┘
┌──────────────────────────────┐
│ Topbar       Menu / Actions  │
├──────────────────────────────┤
│ Page Title                   │
│ Description                  │
│                              │
│ ┌──────────────────────────┐ │
│ │ Metric / Summary Card    │ │
│ └──────────────────────────┘ │
│                              │
│ Search                       │
│ Filter                       │
│                              │
│ ┌──────────────────────────┐ │
│ │ Record Card              │ │
│ │ Name                     │ │
│ │ Status                   │ │
│ │ Key fields               │ │
│ │ Actions                  │ │
│ └──────────────────────────┘ │
│                              │
├──────────────────────────────┤
│ Dashboard Users Drivers ...  │
└──────────────────────────────┘
# 15. Final API Missing-Dependency List

## Frontend API Coverage

The active Admin frontend has matching `adminApi` methods for all
`adminApi.*` calls found under `src/pages` and `src/admin`.

| API Method | Admin Area | Frontend Service | Status |
|---|---|---|---|
| `getAnalytics` | Dashboard | `/admin/analytics` | ✅ Defined |
| `getUsers` | Users | `/admin/users` | ✅ Defined |
| `getDrivers` | Drivers / Verification / Vehicles | `/admin/drivers` | ✅ Defined |
| `getRides` | Rides | `/admin/rides` | ✅ Defined |
| `getPayments` | Payments | `/admin/payments` | ✅ Defined |
| `getEmergencyAlerts` | SOS / Notifications | `/admin/safety/emergency-alerts` | ✅ Defined |
| `getPoliceStations` | SOS / Safety | `/admin/safety/police-stations` | ✅ Defined |
| `getServices` | Services | `/admin/services` | ✅ Defined |
| `createService` | Services | Admin service create endpoint | ✅ Defined |
| `updateService` | Services | Admin service update endpoint | ✅ Defined |
| `deleteService` | Services | Admin service delete endpoint | ✅ Defined |
| `getPricing` | Pricing | `/admin/pricing` | ✅ Defined |
| `putPricing` | Pricing | `/admin/pricing` | ✅ Defined |
| `approveDriver` | Driver Verification | `/admin/drivers/:id/approve` | ✅ Defined |
| `rejectDriver` | Driver Verification | `/admin/drivers/:id/reject` | ✅ Defined |
| `patchUserBlock` | Users | `/admin/users/:id/block` | ✅ Defined |
| `patchDriverBlock` | Drivers | `/admin/drivers/:id/block` | ✅ Defined |
| `deleteUser` | Users | `/admin/users/:id` | ✅ Defined |
| `deleteDriver` | Drivers | `/admin/drivers/:id` | ✅ Defined |
| `deleteRide` | Rides | `/admin/rides/:id` | ✅ Defined |
| `acknowledgeEmergencyAlert` | SOS | `/admin/safety/emergency-alerts/:id/acknowledge` | ✅ Defined |
| `resolveEmergencyAlert` | SOS | `/admin/safety/emergency-alerts/:id/resolve` | ✅ Defined |

## Confirmed Frontend Dependency Gap

No undefined `adminApi` method was found in the active Admin pages/components.

Therefore:

- Frontend service-method coverage: **Complete**
- Backend endpoint existence: **Not yet independently verified**
- Backend response-field compatibility: **Not yet independently verified**
- Backend audit-log workflow: **Not verified**
- Backend driver notification workflow: **Not verified**
- Backend ride-detail endpoint: **Not verified**
- Roles/permissions API: **Not identified in the current Admin API service**
- Admin audit-log API: **Not identified in the current Admin API service**

## Backend Verification Required

The following must be confirmed against the backend before calling
the Admin Foundation fully backend-verified:

1. Every endpoint above exists on the backend.
2. Every endpoint accepts the payload currently sent by the Admin frontend.
3. Every list endpoint returns the fields required by its Admin table/cards.
4. Driver approval/rejection changes backend verification status.
5. Driver approval/rejection creates the required audit log.
6. Driver approval/rejection triggers the required driver notification.
7. Ride details expose all required operational fields.
8. Roles and permissions are enforced by the backend.
9. Admin audit-log data is available if required by product scope.
10. Error responses have usable messages/status codes for Admin UI states.

## Current Conclusion

The Admin frontend API layer has no missing method references.

The remaining API dependency work is **backend contract verification**, not
adding arbitrary frontend endpoints.
