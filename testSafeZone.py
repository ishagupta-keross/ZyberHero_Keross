import requests
import json

# --- CONFIGURATION ---
API_BASE_URL = "https://zyberhero.com/api"
BASE_TOKEN = "https://ikoncloud-dev.keross.com/ikon-api"

# --- LOGIN CREDENTIALS ---
LOGIN_USERNAME = "admin@platform"
LOGIN_PASSWORD = "12345678"
CREDENTIAL_TYPE = "PASSWORD"

def get_access_token():
    """Get access token from auth endpoint"""
    print("🔐 Requesting access token...")
    
    login_payload = {
        "userlogin": LOGIN_USERNAME,
        "password": LOGIN_PASSWORD,
        "credentialType": CREDENTIAL_TYPE
    }
    
    response = requests.post(
        f"{BASE_TOKEN}/platform/auth/login",
        headers={'Content-Type': 'application/json'},
        data=json.dumps(login_payload)
    )
    
    if response.status_code == 200:
        data = response.json()
        token = data.get('accessToken') or data.get('token')
        if token:
            print("✅ Access Token Obtained\n")
            return token
    
    print(f"❌ Failed to get token. Status: {response.status_code}")
    return None

def create_safe_zone(access_token, child_id, device_uuid=None):
    """Create a new safe zone"""
    print(f"📍 Creating safe zone for Child ID: {child_id}...")
    
    payload = {
        "childId": child_id,
        "name": "Home",
        "latitude": 28.613939,
        "longitude": 77.209023,
        "radius": 500,
        "address": "Connaught Place, New Delhi, Delhi, India"
    }
    
    if device_uuid:
        payload["deviceUuid"] = device_uuid
    
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {access_token}'
    }
    
    response = requests.post(
        f"{API_BASE_URL}/safezones",
        headers=headers,
        data=json.dumps(payload)
    )
    
    if response.status_code in [200, 201]:
        data = response.json()
        print("\n========================================")
        print("🎉 SUCCESS! Safe Zone Created.")
        print(json.dumps(data, indent=2))
        print("========================================\n")
        return data.get('safeZone', {}).get('id')
    else:
        print(f"❌ Failed to create safe zone. Status: {response.status_code}")
        print(f"Response: {response.text}\n")
        return None

def list_safe_zones(access_token, child_id=None):
    """List all safe zones or filter by child ID"""
    print("📋 Listing safe zones...")
    
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {access_token}'
    }
    
    url = f"{API_BASE_URL}/safezones"
    if child_id:
        url += f"?childId={child_id}"
    
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Found {len(data)} safe zone(s)")
        print(json.dumps(data, indent=2))
        print()
        return data
    else:
        print(f"❌ Failed to list safe zones. Status: {response.status_code}\n")
        return []

def get_safe_zone(access_token, safe_zone_id):
    """Get a specific safe zone by ID"""
    print(f"🔍 Getting safe zone ID: {safe_zone_id}...")
    
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {access_token}'
    }
    
    response = requests.get(
        f"{API_BASE_URL}/safezones/{safe_zone_id}",
        headers=headers
    )
    
    if response.status_code == 200:
        data = response.json()
        print("✅ Safe Zone Retrieved")
        print(json.dumps(data, indent=2))
        print()
        return data
    else:
        print(f"❌ Failed to get safe zone. Status: {response.status_code}\n")
        return None

def delete_safe_zone(access_token, safe_zone_id):
    """Delete a safe zone"""
    print(f"🗑️  Deleting safe zone ID: {safe_zone_id}...")
    
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {access_token}'
    }
    
    response = requests.delete(
        f"{API_BASE_URL}/safezones/{safe_zone_id}",
        headers=headers
    )
    
    if response.status_code == 200:
        data = response.json()
        print("✅ Safe Zone Deleted")
        print(json.dumps(data, indent=2))
        print()
        return True
    else:
        print(f"❌ Failed to delete safe zone. Status: {response.status_code}\n")
        return False

def main():
    """Main function to test SafeZone API"""
    
    # Get access token
    access_token = get_access_token()
    if not access_token:
        return
    
    # Test 1: Create a safe zone
    child_id = 1
    device_uuid = "f30015e4-6518-559b-b726-30f1f7df8693"  # From device registration
    safe_zone_id = create_safe_zone(access_token, child_id, device_uuid)
    
    if safe_zone_id:
        # Test 2: Get the specific safe zone
        get_safe_zone(access_token, safe_zone_id)
        
        # Test 3: List all safe zones for child
        list_safe_zones(access_token, child_id)
        
        # Test 4: Delete the safe zone (optional - uncomment to test)
        # delete_safe_zone(access_token, safe_zone_id)

if __name__ == "__main__":
    main()
