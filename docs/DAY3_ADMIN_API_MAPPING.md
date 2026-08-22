# RideEasy — Day 3 Admin API Mapping

**Module:** Admin + Mac/iOS

---

# 1. Admin Field-to-API Mapping

## 1.1 Dashboard / Analytics

**Endpoint:** `GET /admin/analytics`  
**Auth:** Admin JWT  
**Controller:** `adminController.getAnalytics`

| Admin Dashboard Field | Response Field | Source |
|---|---|---|
| Total Users | `totalUsers` | `User.countDocuments({})` |
| Total Drivers | `totalDrivers` | `Captain.countDocuments({})` |
| Total Rides | `totalRides` | `Ride.countDocuments({})` |
| Total Revenue | `totalRevenue` | Sum of completed ride `price` |
| Platform Income | `platformIncomeTotal` | Calculated platform fee |
| Active Drivers Online | `activeDriversOnline` | Active + subscribed + approved + not blocked |
| Completed Rides | `completedRideCount` | Completed rides count |
| Completed Rides With Driver | `completedWithCaptainCount` | Completed rides having `captain` |
| City Analytics | `cityAnalytics` | Ride + driver aggregation |

### City Analytics Fields

`cityAnalytics.<city>` contains:

| Field | Response Field |
|---|---|
| Rides | `rides` |
| Drivers | `drivers` |
| Revenue | `revenue` |

Known initial cities:

- `Kolhapur`
- `Ichalkaranji`
- `Sangli`

### Dashboard API Response Shape

```json
{
  "totalUsers": 0,
  "totalDrivers": 0,
  "totalRides": 0,
  "totalRevenue": 0,
  "platformIncomeTotal": 0,
  "activeDriversOnline": 0,
  "completedRideCount": 0,
  "completedWithCaptainCount": 0,
  "cityAnalytics": {
    "Kolhapur": {
      "rides": 0,
      "drivers": 0,
      "revenue": 0
    }
  }
}
---

## 1.2 Users

**Endpoint:** `GET /admin/users`  
**Auth:** Admin JWT  
**Controller:** `adminController.getUsers`

### Admin Users Field Mapping

| Admin Users Field | Response Field | Backend Source |
|---|---|---|
| Name | `name` | `User.name` |
| Email | `email` | `User.email` |
| Mobile | `phone` | `User.phone` |
| City | `city` | `User.city` |
| Created Date | `createdAt` | Mongoose timestamp |
| Blocked | `blocked` | `User.blocked` |

### Users API Behavior

| Item | Current Backend Behavior |
|---|---|
| Sort | `createdAt` descending |
| Maximum records | 500 |
| Pagination | Not currently provided |
| Authentication | Admin JWT |
| Response collection | `users` |

### Users API Response

```json
{
  "users": [
    {
      "name": "Example User",
      "email": "user@example.com",
      "phone": "XXXXXXXXXX",
      "city": "Kolhapur",
      "createdAt": "2026-08-21T00:00:00.000Z",
      "blocked": false
    }
  ]
}
---

## 1.3 Drivers

**Endpoint:** `GET /admin/drivers`  
**Auth:** Admin JWT  
**Controller:** `adminController.getDrivers`

### Admin Drivers Field Mapping

The Admin Drivers screen consumes the `drivers` array returned by the backend.

| Admin Drivers Field | Response Field | Backend Source / Meaning |
|---|---|---|
| Driver ID | `_id` | Driver document ID |
| Name | `name` | Driver name |
| Mobile | `phone` | Driver phone |
| Email | `email` | Driver email |
| City | `city` | Driver city |
| Status | `status` | Driver current status |
| Approval | `approved` | Driver approval state |
| Blocked | `blocked` | Driver blocked state |
| Verification Status | `verificationStatus` | Driver verification state |
| Vehicle | `vehicle` | Driver vehicle information if present |
| Vehicle Number | `vehicleNumber` | Registered vehicle number if present |
| Vehicle Type | `vehicleType` | Registered vehicle type if present |
| Subscription Status | `subscriptionStatus` | Stored subscription status |
| Effective Subscription Status | `effectiveSubscriptionStatus` | Calculated subscription status |
| Subscription Expiry | `subscriptionExpiresAt` | Subscription expiry date |
| Total Earnings | `totalEarnings` | Driver earnings ledger |
| Driver Income | `driverIncome` | Calculated completed-ride income or `totalEarnings` fallback |
| Completed Rides | `completedRides` | Count of completed rides linked to driver |
| Platform Share | `platformShare` | Platform fee calculated from driver's completed rides |
| Created Date | `createdAt` | Mongoose timestamp |

### Driver Earnings Calculation

The backend calculates earnings from completed rides.

For each completed ride:

```text
Driver Income =
captainNetEarning
OR
ride price - effective platform fee
---

## 1.4 Vehicles

### Current API Status

A dedicated Admin Vehicle API was not found in the current backend source.

The following searches were performed:

- `getVehicles`
- `/admin/vehicles`
- `admin.*vehicle`
- `Vehicle.find`
- `Vehicle.aggregate`

No matching Admin Vehicle controller/API was found.

### Admin Vehicle Fields Required

The current Admin UI is expected to require vehicle information such as:

| Admin Vehicle Field | Expected Backend Field | Status |
|---|---|---|
| Vehicle Number | `vehicleNumber` | Missing API mapping |
| Vehicle Type | `vehicleType` | Missing API mapping |
| Model | `model` | Missing API mapping |
| Color | `color` | Missing API mapping |
| Driver | Driver reference | Missing API mapping |
| Verification Status | `verificationStatus` | Missing API mapping |
| Vehicle Status | `status` | Missing API mapping |

> These fields are documented as Admin requirements only. The current backend search did not establish that all of these fields exist in a dedicated Vehicle collection.

### Vehicle API Dependency

| Required API | Status |
|---|---|
| `GET /admin/vehicles` | Missing |
| `GET /admin/vehicles/:id` | Missing |
| `POST /admin/vehicles` | Missing |
| `PATCH /admin/vehicles/:id` | Missing |
| Vehicle pagination | Missing |
| Vehicle verification mapping | Missing |

### Related Backend Finding

The backend contains:

```text
Backend/src/models/pricing.model.js
---

## 1.5 Driver Verification

### Verification Status

The current backend uses the driver's `approved` field for the Admin approval state.

| Admin Verification Field | Backend Field | Current Behavior |
|---|---|---|
| Driver Name | `name` | Returned from driver |
| Email | `email` | Returned from driver |
| Mobile | `phone` | Returned from driver |
| City | `city` | Returned from driver |
| Vehicle Type | `vehicleType` | Returned from driver |
| Vehicle Number | `vehicleNumber` | Returned from driver |
| Approval Status | `approved` | `true` = approved, `false` = not approved |
| Blocked | `blocked` | Driver blocked state |
| Subscription Status | `subscriptionStatus` | Driver subscription state |

### Approve Driver

**Method:** `PUT`

**Endpoint:**

```text
/admin/drivers/:id/approve
---

## 1.6 Rides

**Endpoint:** `GET /admin/rides`  
**Auth:** Admin JWT  
**Controller:** `adminController.getRides`

### Admin Rides Field Mapping

| Admin Rides Field | Response Field | Backend Source / Meaning |
|---|---|---|
| Ride ID | `_id` | Ride document ID |
| City | `city` | Ride city |
| Pickup | `pickupLocation` | Pickup location |
| Destination | `dropLocation` | Drop location |
| Fare | `price` | Ride price |
| Status | `status` | Current ride status |
| Created Date | `createdAt` | Ride creation time |
| Completed Date | `completedAt` | Ride completion time |
| Payment Method | `paymentMethod` | Ride payment method |
| Payment Status | `paymentStatus` | Ride payment status |
| User | `user` | Populated user information |
| User Name | `user.name` | User name |
| User Phone | `user.phone` | User phone |
| Driver | `captain` | Populated driver information |
| Driver Name | `captain.name` | Driver name |
| Driver Phone | `captain.phone` | Driver phone |
| Vehicle Number | `captain.vehicleNumber` | Driver vehicle number |

### Supported Ride Status Filters

The backend supports:

```text
searching
accepted
arrived
started
completed
cancelled
---

## 1.7 Payments

**Endpoint:** `GET /admin/payments`  
**Auth:** Admin JWT  
**Controller:** `adminController.getPayments`

### Admin Payments Field Mapping

| Admin Payments Field | Response Field | Backend Source / Meaning |
|---|---|---|
| Payment ID | `_id` | Completed ride ID |
| Type | `type` | Always `ride_fare` |
| Amount | `amount` | `chargedAmount`, otherwise `price` |
| Fare | `fare` | Ride `price` |
| Payment Mode | `paymentMode` | `paymentMethod` |
| Payment Status | `paymentStatus` | `paymentStatus`, defaults to `pending` |
| Platform Fee | `platformFee` | Ride platform fee |
| Driver Earnings | `captainNetEarning` | Driver net earning |
| Ride Status | `rideStatus` | Ride status |
| Trip Summary | `summary` | Pickup → destination |
| City | `city` | Ride city |
| Created Date | `createdAt` | Ride creation time |
| Completed Date | `completedAt` | Ride completion time |

### Payment Data Source

The backend reads:

```text
Ride
---

## 1.8 Subscriptions

**Endpoint:** `GET /admin/subscriptions`  
**Auth:** Admin JWT  
**Controller:** `adminController.getSubscriptions`

### Admin Subscription Field Mapping

| Admin Subscription Field | Response Field | Backend Source / Meaning |
|---|---|---|
| Subscription ID | `_id` | Driver document ID |
| Driver Name | `driverName` | `Captain.name` |
| Email | `email` | `Captain.email` |
| Vehicle Type | `vehicleType` | Driver vehicle type |
| Plan | `plan` | Driver `subscriptionStatus` |
| Weekly Charge Hint | `weeklyChargeHint` | Backend plan pricing hint |
| Status | `status` | Driver `subscriptionStatus` |
| Updated Date | `updatedAt` | Subscription/driver update timestamp |

### Subscription Source

The backend reads subscription information from:

```text
Captain
---

## 1.9 Safety / SOS

### Emergency Alerts

**Endpoint:** `GET /admin/safety/emergency-alerts`  
**Auth:** Admin JWT  
**Controller:** `adminController.getEmergencyAlerts`

### Admin Emergency Alert Field Mapping

| Admin Safety Field | Response Field | Backend Source / Meaning |
|---|---|---|
| Alert ID | `_id` | Emergency alert ID |
| Status | `status` | Current emergency status |
| City | `city` | Alert city |
| Location | `location` | Emergency location |
| Ride ID | `rideId` | Related ride ID if present |
| User/Driver | Related alert fields | Depends on alert object |

> The exact fields inside `EMERGENCY_ALERTS` are not defined by the inspected controller. The controller returns the existing alert objects directly.

### Emergency Alert Response

```json
{
  "alerts": [
    {
      "_id": "alert-id",
      "status": "pending",
      "city": "Kolhapur",
      "location": {
        "lat": 16.704987,
        "lng": 74.243257
      }
    }
  ]
}
---

## 1.10 Notifications

### Current Backend Status

**Status:** Partial — MongoDB model exists, but an Admin Notifications API/controller was not found during the backend search.

**Model:** `Backend/src/models/notification.model.js`

**MongoDB Collection:** `notifications`

### Notification Field Mapping

| Notification Field | Backend Field | Type / Meaning |
|---|---|---|
| Receiver ID | `receiverId` | MongoDB ObjectId |
| Receiver Type | `receiverType` | `user`, `captain`, or `admin` |
| Title | `title` | Required string, maximum 200 characters |
| Message | `message` | Required string, maximum 2000 characters |
| Type | `type` | `ride`, `payment`, `subscription`, `admin`, or `system` |
| Metadata | `meta` | Mixed / optional data |
| Read Status | `isRead` | Boolean, defaults to `false` |
| Created Date | `createdAt` | Mongoose timestamp |
| Updated Date | `updatedAt` | Mongoose timestamp |

### Notification Model Validation

Required fields:

```text
receiverId
receiverType
title
message
---

# 2. Admin Form-to-Request Mapping

## 2.1 Users

### Block / Unblock User

**Endpoint:**

`PATCH /admin/users/:id/block`

**Auth:** Admin JWT

### Request

The Admin sends only the `blocked` boolean.

#### Block User

```json
{
  "blocked": true
}
---

## 2.2 Drivers

### Approve Driver

**Endpoint:**

`PUT /admin/drivers/:id/approve`

**Auth:** Admin JWT

### Request

No request body is required.

The driver ID is supplied through the URL:

```text
/admin/drivers/:id/approve
---

## 2.3 Vehicles

### Current Backend Status

**Status:** Missing — No confirmed Admin Vehicle API was found in the inspected backend routes, controllers, or models.

The Admin UI may contain a Vehicles screen, but an Admin-specific Vehicle API could not be confirmed from the backend source.

### Expected Admin Vehicle Fields

The following fields are relevant to the current Admin Vehicle UI/domain, but are **not confirmed as an Admin API response contract**:

| Admin Vehicle Field | Expected Field | Status |
|---|---|---|
| Vehicle ID | `_id` | Not confirmed |
| Vehicle Number | `vehicleNumber` | Not confirmed |
| Vehicle Type | `vehicleType` | Not confirmed |
| Model | `model` | Not confirmed |
| Color | `color` | Not confirmed |
| Driver | `driver` / `captain` | Not confirmed |
| Status | `status` | Not confirmed |
| Created Date | `createdAt` | Not confirmed |

### Missing Admin Vehicle APIs

The following endpoints are not currently confirmed:

```text
GET    /admin/vehicles
GET    /admin/vehicles/:id
POST   /admin/vehicles
PUT    /admin/vehicles/:id
PATCH  /admin/vehicles/:id
DELETE /admin/vehicles/:id
---

## 2.4 Fare / Pricing

### Get Pricing

**Endpoint:**

`GET /admin/pricing`

**Auth:** Admin JWT

**Controller:** `adminController.getPricing`

### Response Fields

| Admin Pricing Field | Response Field | Backend Source |
|---|---|---|
| Vehicle Rates | `rates` | `pricingService.getRates()` |
| Driver Plans | `driverPlans` | `pricingService.getDriverPlansMerged()` |
| Service Areas | `serviceAreas` | `pricingService.getServiceAreas()` |
| Commission Percent | `commissionPercent` | Service configuration |
| Launch Trial Days | `launchTrialDays` | Service configuration |

### Response Shape

```json
{
  "rates": {},
  "driverPlans": {},
  "serviceAreas": [],
  "commissionPercent": 0,
  "launchTrialDays": 0
}
---
## 2.5 Services

### Get Services

**Endpoint:**

`GET /admin/services`

**Auth:** Admin JWT

**Controller:** `adminController.getServices`

### Response Field Mapping

| Admin Service Field | Response Field | Backend Source / Meaning |
|---|---|---|
| Service ID | `_id` | Service document ID |
| Service Key | `key` | Generated catalogue key |
| Service Name | `name` | Service name |
| Vehicle Type | `vehicleType` | `BIKE`, `AUTO`, or `CAR` |
| Base Fare | `baseFare` | Base fare |
| Per KM | `perKm` | Fare per kilometre |
| Platform Fee | `platformFee` | Platform fee |
| Active | `active` | Service availability |
| Created Date | `createdAt` | Mongoose timestamp |
| Updated Date | `updatedAt` | Mongoose timestamp |

The `global` service/pricing document is excluded from this API.

---

### Create Service

**Endpoint:**

`POST /admin/services`

**Auth:** Admin JWT

**Controller:** `adminController.createService`

### Request Fields

| Admin Form Field | Request Field | Required | Type |
|---|---|---|---|
| Service Name | `name` | Yes | String |
| Vehicle Type | `vehicleType` | Yes | Enum |
| Base Fare | `baseFare` | Yes | Non-negative Number |
| Per KM | `perKm` | Yes | Non-negative Number |
| Platform Fee | `platformFee` | Yes | Non-negative Number |
| Active | `active` | No | Boolean |

### Allowed Vehicle Types

```text
BIKE
AUTO
CAR

```
---

### Update Service

**Endpoint:** `PUT /admin/services/:id`

**Auth:** Admin JWT

**Controller:** `adminController.updateService`

The request uses the same fields as Create Service.

| Field | Request Field | Required | Type |
|---|---|---|---|
| Service Name | `name` | Yes | String |
| Vehicle Type | `vehicleType` | Yes | `BIKE`, `AUTO`, `CAR` |
| Base Fare | `baseFare` | Yes | Non-negative Number |
| Per KM | `perKm` | Yes | Non-negative Number |
| Platform Fee | `platformFee` | Yes | Non-negative Number |
| Active | `active` | No | Boolean |

**URL parameter:** `:id`

The service ID must be a valid MongoDB ObjectId.

The `global` service cannot be updated through this API.

**Success:** `200 OK`

Response:

```json
{
  "service": {}
}
---

### Delete Service

**Endpoint:** `DELETE /admin/services/:id`

**Auth:** Admin JWT

**Controller:** `adminController.deleteService`

No request body is required.

The service ID is supplied through `:id`.

The service ID must be a valid MongoDB ObjectId.

The `global` service cannot be deleted through this API.

**Success Response:**

```json
{
  "deletedId": "service-object-id"
}
---

### Service Validation / Errors

| Condition | Response |
|---|---|
| Missing service name | `400 — Service name is required` |
| Invalid vehicle type | `400 — vehicleType must be BIKE, AUTO,or CAR` |
| Invalid numeric value | `400 — <field> must be a non-negative number` |
| Invalid active value | `400 — active must be a boolean` |
| Invalid service ID | `400 — Invalid service id` |
| Service not found | `404 — Service not found` |

### Service API Status

**Status: Existing / Complete**

Confirmed Admin operations:

- `GET /admin/services`
- `POST /admin/services`
- `PUT /admin/services/:id`
- `DELETE /admin/services/:id`

No backend implementation was changed for this mapping.
---

# 3. Request/Response List

## 3.1 Confirmed Admin GET APIs

| Module | Method | Endpoint | Response Collection / Fields |
|---|---|---|---|
| Dashboard | GET | `/admin/analytics` | Analytics object |
| Users | GET | `/admin/users` | `users` |
| Drivers | GET | `/admin/drivers` | `drivers` |
| Rides | GET | `/admin/rides` | `rides`, `filter` |
| Payments | GET | `/admin/payments` | `payments` |
| Subscriptions | GET | `/admin/subscriptions` | `subscriptions` |
| Pricing | GET | `/admin/pricing` | `rates`, `driverPlans`, `serviceAreas`, `commissionPercent`, `launchTrialDays` |
| Services | GET | `/admin/services` | `services` |
| Emergency Alerts | GET | `/admin/safety/emergency-alerts` | `alerts` |
| Police Stations | GET | `/admin/safety/police-stations` | `stations`, `city`, `source` |

All confirmed Admin APIs require **Admin JWT authentication**.

---

## 3.2 Confirmed Admin Mutation APIs

| Module | Method | Endpoint | Request |
|---|---|---|---|
| User | PATCH | `/admin/users/:id/block` | `{ "blocked": true/false }` |
| Driver | PUT | `/admin/drivers/:id/approve` | No body required |
| Driver | PUT | `/admin/drivers/:id/reject` | No body required |
| Driver | PATCH | `/admin/drivers/:id/block` | `{ "blocked": true/false }` |
| Pricing | PUT | `/admin/pricing` | Pricing/update object |
| Service | POST | `/admin/services` | Service fields |
| Service | PUT | `/admin/services/:id` | Service fields |
| Service | DELETE | `/admin/services/:id` | No body required |
| Emergency Alert | POST | `/admin/safety/emergency-alerts/:id/acknowledge` | No body required |
| Emergency Alert | POST | `/admin/safety/emergency-alerts/:id/resolve` | No body required |

---

## 3.3 Delete APIs

| Module | Method | Endpoint | Response |
|---|---|---|---|
| User | DELETE | `/admin/users/:id` | `deletedId` |
| Driver | DELETE | `/admin/drivers/:id` | `deletedId` |
| Ride | DELETE | `/admin/rides/:id` | `deletedId` |
| Service | DELETE | `/admin/services/:id` | `deletedId` |

---

# 4. Missing Fields / APIs

## 4.1 Vehicles

**Status: Missing**

No confirmed Admin Vehicle API was found in the inspected backend routes, controllers, or models.

Expected Admin Vehicle information includes:

- Vehicle ID
- Driver ID
- Driver name
- Vehicle type
- Vehicle model
- Vehicle color
- Vehicle registration number
- Verification status
- Created date
- Updated date

These fields are currently documented as expected Admin requirements, not as a confirmed backend response contract.

### Missing Vehicle APIs

- `GET /admin/vehicles`
- Vehicle detail endpoint
- Vehicle create/update endpoint if required by Admin
- Vehicle verification/update endpoint if required by Admin

---

## 4.2 Notifications

**Status: Partial**

The MongoDB notification model exists:

`Backend/src/models/notification.model.js`

Collection:

`notifications`

The model contains:

- `receiverId`
- `receiverType`
- `title`
- `message`
- `type`
- `meta`
- `isRead`
- `createdAt`
- `updatedAt`

However, an Admin Notifications API/controller was not confirmed during the backend search.

### Missing Notification APIs

Potential Admin requirements to be confirmed:

- Notification list API
- Notification detail API
- Notification read/unread API
- Notification creation/send API if Admin needs to send notifications

---

## 4.3 Driver Documents

No dedicated `driverDocuments` Admin API was confirmed during the inspected backend search.

The current Driver Verification implementation uses the Driver `approved` field for the Admin approval state.

Dedicated document-level APIs for:

- RC
- Driving Licence
- Aadhaar
- PAN
- document status
- rejection reason
- re-upload request

were not confirmed.

---

# 5. API Dependencies

## 5.1 Admin Dependencies

| Admin Module | Required Backend Dependency | Status |
|---|---|---|
| Dashboard | Analytics API | Available |
| Users | Users list API | Available |
| Users | Block/unblock API | Available |
| Users | Delete API | Available |
| Drivers | Drivers list API | Available |
| Drivers | Approve/reject API | Available |
| Drivers | Block/unblock API | Available |
| Drivers | Delete API | Available |
| Vehicles | Vehicle API | Missing |
| Verification | Driver approval API | Available |
| Verification | Document APIs | Missing / Not confirmed |
| Rides | Rides list API | Available |
| Rides | Ride delete API | Available |
| Payments | Payments API | Available |
| Subscriptions | Subscriptions API | Available |
| Pricing | Pricing GET/PUT APIs | Available |
| Services | Service CRUD APIs | Available |
| Safety | Emergency alert APIs | Available |
| Safety | Police station API | Available |
| Notifications | Notification Admin API | Missing / Partial |

---

## 5.2 Frontend Dependency Rule

Admin UI should consume the confirmed response field names documented in Section 1.

Frontend actions should use the request contracts documented in Section 2.

The Admin frontend should not assume undocumented Vehicle, Notification, or Driver Document APIs exist.

---

# 6. Known API Issues

## 6.1 Users Pagination

The Users API currently:

- sorts by `createdAt` descending
- returns a maximum of 500 records
- does not provide pagination metadata

**Impact:** Admin pagination cannot be fully backend-driven.

---

## 6.2 Drivers Pagination

The Drivers API currently limits the aggregation result to 500 drivers.

No page/limit/cursor pagination contract was confirmed.

---

## 6.3 Rides Pagination

The Rides API currently limits results to 500 records.

The API supports a status filter but does not provide full pagination metadata.

Supported statuses:

```text
searching
accepted
arrived
started
completed
cancelled
