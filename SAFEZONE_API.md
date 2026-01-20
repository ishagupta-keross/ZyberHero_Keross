# SafeZone API Documentation

## Overview
The SafeZone API allows you to create, retrieve, list, and delete safe zones for children. Safe zones are geographical areas where children are expected to be, and can be used for monitoring and alerting purposes.

## Endpoints

### 1. Create SafeZone
**POST** `/api/safezones`

Creates a new safe zone for a child.

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "childId": 1,
  "name": "Home",
  "latitude": 28.613939,
  "longitude": 77.209023,
  "radius": 500,
  "address": "Connaught Place, New Delhi, Delhi, India",
  "deviceUuid": "f30015e4-6518-559b-b726-30f1f7df8693"  // Optional
}
```

**Fields:**
- `childId` (Long, optional): Child ID - required if deviceUuid/deviceId not provided
- `name` (String, required): Name of the safe zone
- `latitude` (Double, required): Latitude coordinate
- `longitude` (Double, required): Longitude coordinate
- `radius` (Integer, optional): Radius in meters (default: 500)
- `address` (String, optional): Human-readable address
- `deviceUuid` (String, optional): Device UUID to link
- `deviceId` (Long, optional): Device ID to link

**Response (201 Created):**
```json
{
  "success": true,
  "safeZone": {
    "id": 1,
    "childId": 1,
    "name": "Home",
    "latitude": 28.613939,
    "longitude": 77.209023,
    "radius": 500,
    "address": "Connaught Place, New Delhi, Delhi, India",
    "createdAt": "2026-01-19T10:12:45.321Z"
  }
}
```

---

### 2. List SafeZones
**GET** `/api/safezones?childId={childId}`

Lists all safe zones, optionally filtered by child ID.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `childId` (Long, optional): Filter by child ID

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "childId": 1,
    "name": "Home",
    "latitude": 28.613939,
    "longitude": 77.209023,
    "radius": 500,
    "address": "Connaught Place, New Delhi, Delhi, India",
    "createdAt": "2026-01-19T10:12:45.321Z"
  },
  {
    "id": 2,
    "childId": 1,
    "name": "School",
    "latitude": 28.704060,
    "longitude": 77.102493,
    "radius": 300,
    "address": "Delhi Public School, New Delhi",
    "createdAt": "2026-01-19T11:30:22.123Z"
  }
]
```

---

### 3. Get SafeZone by ID
**GET** `/api/safezones/{id}`

Retrieves a specific safe zone by its ID.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Path Parameters:**
- `id` (Long, required): SafeZone ID

**Response (200 OK):**
```json
{
  "success": true,
  "safeZone": {
    "id": 1,
    "childId": 1,
    "name": "Home",
    "latitude": 28.613939,
    "longitude": 77.209023,
    "radius": 500,
    "address": "Connaught Place, New Delhi, Delhi, India",
    "createdAt": "2026-01-19T10:12:45.321Z"
  }
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "error": "SafeZone not found"
}
```

---

### 4. Delete SafeZone
**DELETE** `/api/safezones/{id}`

Deletes a safe zone by its ID.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Path Parameters:**
- `id` (Long, required): SafeZone ID

**Response (200 OK):**
```json
{
  "success": true,
  "message": "SafeZone deleted successfully"
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "error": "SafeZone not found"
}
```

---

## Device Integration

Like the Activity API, SafeZones support device-based creation:

### Option 1: Using childId directly
```json
{
  "childId": 1,
  "name": "Home",
  "latitude": 28.613939,
  "longitude": 77.209023,
  "radius": 500
}
```

### Option 2: Using deviceUuid (will resolve childId from device)
```json
{
  "deviceUuid": "f30015e4-6518-559b-b726-30f1f7df8693",
  "name": "Home",
  "latitude": 28.613939,
  "longitude": 77.209023,
  "radius": 500
}
```

### Option 3: Using deviceId
```json
{
  "deviceId": 1,
  "name": "Home",
  "latitude": 28.613939,
  "longitude": 77.209023,
  "radius": 500
}
```

---

## Error Responses

**400 Bad Request:**
```json
{
  "success": false,
  "error": "Missing required field: name"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "error": "Failed to create safe zone"
}
```

---

## Testing

Run the test script:
```bash
python testSafeZone.py
```

This will:
1. Obtain an access token
2. Create a safe zone for child ID 1
3. Retrieve the created safe zone
4. List all safe zones for the child

---

## Database Schema

The `safe_zones` table:
```sql
CREATE TABLE safe_zones (
    id BIGSERIAL PRIMARY KEY,
    child_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    radius INTEGER NOT NULL,
    address VARCHAR(500),
    device_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_safe_zones_child_id ON safe_zones(child_id);
CREATE INDEX idx_safe_zones_device_id ON safe_zones(device_id);
```

---

## Implementation Files

Following the Activity API structure:

### DTO (Client Module)
- `SafeZoneCreateRequestDto.java` - Request DTO
- `SafeZoneResponseDto.java` - Response DTO
- `SafeZoneApi.java` - API interface

### Server Module
- `SafeZone.java` - Entity
- `SafeZoneRepository.java` - JPA Repository
- `SafeZoneMapper.java` - DTO/Entity mapper
- `SafeZoneService.java` - Business logic
- `SafeZoneController.java` - REST controller
- `V4__update_safe_zones.sql` - Database migration

---

## Usage Example (Python)

```python
import requests
import json

# Get token
token = get_access_token()

# Create safe zone
payload = {
    "childId": 1,
    "name": "Home",
    "latitude": 28.613939,
    "longitude": 77.209023,
    "radius": 500,
    "address": "Connaught Place, New Delhi, Delhi, India"
}

response = requests.post(
    "https://zyberhero.com/api/safezones",
    headers={
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    },
    data=json.dumps(payload)
)

print(response.json())
```
