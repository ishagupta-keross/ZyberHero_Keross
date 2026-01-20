import requests
import platform
import socket
import uuid
import sys
import json
import os
import ctypes
from ctypes import Structure, POINTER, c_ulong, c_char, c_uint, c_byte, byref

# --- CONFIGURATION ---
API_BASE_URL = " https://zyberhero.com/api"
BASE_TOKEN ="https://ikoncloud-dev.keross.com/ikon-api"

# --- LOGIN CREDENTIALS FOR TOKEN ---
LOGIN_USERNAME = "admin@platform"  # Replace with actual username
LOGIN_PASSWORD = "12345678"  # Replace with actual password
CREDENTIAL_TYPE = "PASSWORD"  # Credential type (PASSWORD, OAUTH, etc.)


# --- WINDOWS API DEFINITIONS (ctypes) ---
# Constants for GetAdaptersInfo
MAX_ADAPTER_DESCRIPTION_LENGTH = 128
MAX_ADAPTER_NAME_LENGTH = 256
MAX_ADAPTER_ADDRESS_LENGTH = 8

ERROR_BUFFER_OVERFLOW = 111
NO_ERROR = 0
MIB_IF_TYPE_ETHERNET = 6
IF_TYPE_IEEE80211 = 71

# ----- Structures -----

class IP_ADDR_STRING(ctypes.Structure):
    pass

IP_ADDR_STRING._fields_ = [
    ("Next", ctypes.POINTER(IP_ADDR_STRING)),
    ("IpAddress", ctypes.c_char * 16),
    ("IpMask", ctypes.c_char * 16),
    ("Context", ctypes.c_ulong),
]

class IP_ADAPTER_INFO(ctypes.Structure):
    pass

IP_ADAPTER_INFO._fields_ = [
    ("Next", ctypes.POINTER(IP_ADAPTER_INFO)),
    ("ComboIndex", ctypes.c_ulong),
    ("AdapterName", ctypes.c_char * (MAX_ADAPTER_NAME_LENGTH + 4)),
    ("Description", ctypes.c_char * (MAX_ADAPTER_DESCRIPTION_LENGTH + 4)),
    ("AddressLength", ctypes.c_uint),
    ("Address", ctypes.c_ubyte * MAX_ADAPTER_ADDRESS_LENGTH),  # MUST be c_ubyte
    ("Index", ctypes.c_ulong),
    ("Type", ctypes.c_uint),               # <-- THIS FIELD EXISTS
    ("DhcpEnabled", ctypes.c_uint),
    ("CurrentIpAddress", ctypes.POINTER(IP_ADDR_STRING)),
    ("IpAddressList", IP_ADDR_STRING),
    ("GatewayList", IP_ADDR_STRING),
    ("DhcpServer", IP_ADDR_STRING),
    ("HaveWins", ctypes.c_uint),
    ("PrimaryWinsServer", IP_ADDR_STRING),
    ("SecondaryWinsServer", IP_ADDR_STRING),
    ("LeaseObtained", ctypes.c_ulong),
    ("LeaseExpires", ctypes.c_ulong),
]

PIP_ADAPTER_INFO = ctypes.POINTER(IP_ADAPTER_INFO)

def get_mac_address():
    if os.name != 'nt':
        mac_num = uuid.getnode()
        return ':'.join(f"{(mac_num >> 8*i) & 0xff:02X}" for i in reversed(range(6)))

    # Windows: try to use GetAdaptersInfo for a stable MAC, but fall back to
    # uuid.getnode() if ctypes plumbing fails in any environment.
    try:
        iphlpapi = ctypes.windll.iphlpapi
    except Exception:
        mac_num = uuid.getnode()
        return ':'.join(f"{(mac_num >> 8*i) & 0xff:02X}" for i in reversed(range(6)))

    buflen = ctypes.c_ulong(15000)
    buff = (ctypes.c_byte * buflen.value)()

    try:
        ret = iphlpapi.GetAdaptersInfo(ctypes.byref(buff), ctypes.byref(buflen))
    except Exception:
        mac_num = uuid.getnode()
        return ':'.join(f"{(mac_num >> 8*i) & 0xff:02X}" for i in reversed(range(6)))

    if ret == ERROR_BUFFER_OVERFLOW:
        buff = (ctypes.c_byte * buflen.value)()
        ret = iphlpapi.GetAdaptersInfo(ctypes.byref(buff), ctypes.byref(buflen))

    if ret == NO_ERROR:
        adapter = ctypes.cast(buff, PIP_ADAPTER_INFO)

        while adapter:
            a = adapter.contents
            # Some environments may not populate all fields reliably; guard
            # against missing attributes.
            adapter_type = getattr(a, 'Type', None)
            if adapter_type in (MIB_IF_TYPE_ETHERNET, IF_TYPE_IEEE80211):
                mac = ":".join(f"{b:02X}" for b in a.Address[:a.AddressLength])
                return mac
            
            adapter = a.Next

    # Last resort fallback
    mac_num = uuid.getnode()
    return ':'.join(f"{(mac_num >> 8*i) & 0xff:02X}" for i in reversed(range(6)))

def get_system_details():
    """
    Captures local system information.
    """
    print("⚙️  Gathering system information...")
    
    try:
        # Get Hostname
        hostname = socket.gethostname()
        
        # Get OS
        os_info = f"{platform.system()} {platform.release()}"
        
        # Get User
        try:
            username = os.getlogin()
        except:
            username = "unknown_user"

        # Get MAC (Using the Windows API function)
        mac_address = get_mac_address()

        # Generate a deterministic Device UUID based on the MAC address
        device_uuid = str(uuid.uuid5(uuid.NAMESPACE_DNS, mac_address))

        return {
            "deviceUuid": device_uuid,
            "macAddress": mac_address,
            "machineName": hostname,
            "userName": username,
            "os": os_info
        }
    except Exception as e:
        print(f"❌ Failed to gather system info: {e}")
        return None

def get_access_token():
    """
    Retrieves an access token from the token endpoint.
    Returns the token string if successful, None otherwise.
    """
    print(f"\n🔐 Requesting access token...")
    
    try:
        # Prepare login payload with correct field names
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
                print(f"✅ Access Token Obtained Successfully")
                return token
            else:
                print(f"⚠️ Token not found in response")
                return None
        else:
            print(f"❌ Failed to get token. Status: {response.status_code}")
            print(f"Details: {response.text}")
            return None
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Error requesting token: {e}")
        return None

def verify_child(child_id, access_token):
    """
    Hits the GET /api/children/:id endpoint to check if child exists.
    Uses the provided access token for authentication.
    """
    print(f"\n🔍 Verifying Child ID: {child_id}...")
    
    try:
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {access_token}'
        }
        response = requests.get(
            f"{API_BASE_URL}/children/{child_id}",
            headers=headers
        )
        
        if response.status_code == 200:
            data = response.json()
            if 'child' in data:
                print(f"✅ Child Found: ID {data['child']['id']}")
                return True
        elif response.status_code == 404:
            print(f"❌ Child with ID {child_id} not found.")
        else:
            print(f"❌ Server Error: {response.status_code}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Error connecting to server: {e}")
    
    return False

def register_device(child_id, sys_info, access_token):
    """
    Hits the POST /api/devices/register endpoint.
    Uses the provided access token for authentication.
    Returns True if successful, False otherwise.
    """
    payload = sys_info.copy()
    payload['childId'] = int(child_id)

    print(f"🚀 Registering device with payload: {json.dumps(payload, indent=2)}")

    try:
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {access_token}'
        }
        response = requests.post(
            f"{API_BASE_URL}/devices/register", 
            data=json.dumps(payload), 
            headers=headers
        )

        if response.status_code in [200, 201]:
            data = response.json()
            print("\n========================================")
            print("🎉 SUCCESS! Device Registered.")
            print(f"🆔 Device ID: {data.get('deviceId')}")
            print(f"👶 Linked to Child ID: {data.get('childId')}")
            print("========================================")
            return True
        else:
            print(f"❌ Registration Failed. Status: {response.status_code}")
            print(f"Details: {response.text}")
            return False

    except requests.exceptions.RequestException as e:
        print(f"❌ Network Error during registration: {e}")
        return False

def main():
    try:
        # Get access token first
        access_token = get_access_token()
        if not access_token:
            print("\n❌ Cannot proceed without access token.")
            sys.exit(1) # Exit with error
        
        # Prompt user
        user_input = input("Enter the Child ID to link this device to: ")
        
        if not user_input.isdigit() or int(user_input) <= 0:
            print("❌ Please enter a valid positive number.")
            sys.exit(1) # Exit with error
            
        child_id = int(user_input)

        if not verify_child(child_id, access_token):
            sys.exit(1) # Exit with error

        sys_info = get_system_details()
        if not sys_info:
            sys.exit(1) # Exit with error

        # Capture success/fail from register_device
        success = register_device(child_id, sys_info, access_token)
        
        if success:
            sys.exit(0) # 0 means Success to Windows
        else:
            sys.exit(1) # 1 means Failure to Windows

    except KeyboardInterrupt:
        print("\n\n🚫 Operation cancelled by user.")
        sys.exit(1) # Treat cancellation as failure so setup doesn't run
    except Exception as e:
        print(f"❌ Unexpected Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
