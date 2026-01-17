#!/usr/bin/env python3
"""
Backend Test Suite for Oriani Full-Stack Application
Tests FastAPI + Jinja2 templates, authentication, CRUD operations, and REST APIs
"""

import requests
import json
import base64
import io
from PIL import Image
import time

# Configuration
BASE_URL = "https://python-image-flow.preview.emergentagent.com"
ADMIN_EMAIL = "eletricista@oriani.com.br"
ADMIN_PASSWORD = "15pras7Hora$"

class BackendTester:
    def __init__(self):
        self.session = requests.Session()
        self.access_token = None
        self.test_results = []
        
    def log_result(self, test_name, success, message=""):
        result = {
            "test": test_name,
            "success": success,
            "message": message
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name}")
        if message:
            print(f"   {message}")
    
    def create_test_image(self):
        """Create a small test image in memory"""
        img = Image.new('RGB', (100, 100), color='red')
        img_bytes = io.BytesIO()
        img.save(img_bytes, format='JPEG')
        img_bytes.seek(0)
        return img_bytes
    
    def test_html_pages(self):
        """Test HTML page endpoints"""
        print("\n=== Testing HTML Pages ===")
        
        pages = [
            ("/", "Homepage"),
            ("/galeria", "Gallery"),
            ("/galeria/Elétrica", "Gallery filtered by category"),
            ("/servicos/Elétrica", "Service page"),
            ("/orcamento", "Budget page"),
            ("/login", "Login page")
        ]
        
        for endpoint, description in pages:
            try:
                response = self.session.get(f"{BASE_URL}{endpoint}")
                if response.status_code == 200 and "html" in response.headers.get("content-type", "").lower():
                    self.log_result(f"GET {endpoint} ({description})", True, f"Status: {response.status_code}")
                else:
                    self.log_result(f"GET {endpoint} ({description})", False, f"Status: {response.status_code}, Content-Type: {response.headers.get('content-type')}")
            except Exception as e:
                self.log_result(f"GET {endpoint} ({description})", False, f"Error: {str(e)}")
    
    def test_admin_redirect(self):
        """Test that /admin redirects to /login when not authenticated"""
        print("\n=== Testing Admin Access Control ===")
        
        try:
            # Clear any existing cookies
            self.session.cookies.clear()
            response = self.session.get(f"{BASE_URL}/admin", allow_redirects=False)
            
            if response.status_code == 302 and "/login" in response.headers.get("location", ""):
                self.log_result("Admin redirect when not authenticated", True, "Correctly redirects to /login")
            else:
                self.log_result("Admin redirect when not authenticated", False, f"Status: {response.status_code}, Location: {response.headers.get('location')}")
        except Exception as e:
            self.log_result("Admin redirect when not authenticated", False, f"Error: {str(e)}")
    
    def test_login_flow(self):
        """Test login with form data and cookie handling"""
        print("\n=== Testing Login Flow ===")
        
        try:
            # Test login with correct credentials
            login_data = {
                "email": ADMIN_EMAIL,
                "password": ADMIN_PASSWORD
            }
            
            response = self.session.post(f"{BASE_URL}/login", data=login_data, allow_redirects=False)
            
            if response.status_code == 302 and "/admin" in response.headers.get("location", ""):
                # Check if access_token cookie was set
                if "access_token" in self.session.cookies:
                    self.log_result("Login with correct credentials", True, "Successfully logged in and cookie set")
                    
                    # Test accessing admin page with cookie
                    admin_response = self.session.get(f"{BASE_URL}/admin")
                    if admin_response.status_code == 200:
                        self.log_result("Access admin with valid cookie", True, "Admin page accessible")
                    else:
                        self.log_result("Access admin with valid cookie", False, f"Status: {admin_response.status_code}")
                else:
                    self.log_result("Login with correct credentials", False, "No access_token cookie set")
            else:
                self.log_result("Login with correct credentials", False, f"Status: {response.status_code}, Location: {response.headers.get('location')}")
                
        except Exception as e:
            self.log_result("Login with correct credentials", False, f"Error: {str(e)}")
        
        # Test login with incorrect credentials
        try:
            wrong_login_data = {
                "email": "wrong@email.com",
                "password": "wrongpassword"
            }
            
            response = self.session.post(f"{BASE_URL}/login", data=wrong_login_data)
            
            if response.status_code == 200 and "incorretos" in response.text.lower():
                self.log_result("Login with incorrect credentials", True, "Correctly shows error message")
            else:
                self.log_result("Login with incorrect credentials", False, f"Status: {response.status_code}")
                
        except Exception as e:
            self.log_result("Login with incorrect credentials", False, f"Error: {str(e)}")
    
    def test_logout(self):
        """Test logout functionality"""
        print("\n=== Testing Logout ===")
        
        try:
            response = self.session.get(f"{BASE_URL}/logout", allow_redirects=False)
            
            if response.status_code == 302 and "/" in response.headers.get("location", ""):
                # Check if cookie was cleared
                if "access_token" not in self.session.cookies or not self.session.cookies["access_token"]:
                    self.log_result("Logout functionality", True, "Successfully logged out and cookie cleared")
                else:
                    self.log_result("Logout functionality", False, "Cookie not properly cleared")
            else:
                self.log_result("Logout functionality", False, f"Status: {response.status_code}")
                
        except Exception as e:
            self.log_result("Logout functionality", False, f"Error: {str(e)}")
    
    def test_album_crud(self):
        """Test album CRUD operations via HTML forms"""
        print("\n=== Testing Album CRUD Operations ===")
        
        # First login again
        login_data = {"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        self.session.post(f"{BASE_URL}/login", data=login_data)
        
        album_id = None
        
        # Test create album
        try:
            album_data = {
                "name": "Test Album Backend",
                "description": "Album criado durante teste automatizado",
                "category": "Alvenaria e Drywall"
            }
            
            response = self.session.post(f"{BASE_URL}/admin/album/create", data=album_data, allow_redirects=False)
            
            if response.status_code == 302 and "/admin" in response.headers.get("location", ""):
                self.log_result("Create album via form", True, "Album created successfully")
                
                # Get the created album ID by checking the admin page
                admin_response = self.session.get(f"{BASE_URL}/admin")
                if "Test Album Backend" in admin_response.text:
                    self.log_result("Verify album creation", True, "Album appears in admin panel")
                else:
                    self.log_result("Verify album creation", False, "Album not found in admin panel")
            else:
                self.log_result("Create album via form", False, f"Status: {response.status_code}")
                
        except Exception as e:
            self.log_result("Create album via form", False, f"Error: {str(e)}")
        
        # Get album ID for further tests
        try:
            albums_response = self.session.get(f"{BASE_URL}/api/albums")
            if albums_response.status_code == 200:
                albums = albums_response.json()
                test_album = next((a for a in albums if a["name"] == "Test Album Backend"), None)
                if test_album:
                    album_id = test_album["id"]
                    self.log_result("Get album ID for testing", True, f"Album ID: {album_id}")
                else:
                    self.log_result("Get album ID for testing", False, "Test album not found")
        except Exception as e:
            self.log_result("Get album ID for testing", False, f"Error: {str(e)}")
        
        # Test edit album
        if album_id:
            try:
                edit_data = {
                    "name": "Test Album Backend Editado",
                    "description": "Descrição editada durante teste",
                    "category": "Elétrica"
                }
                
                response = self.session.post(f"{BASE_URL}/admin/album/edit/{album_id}", data=edit_data, allow_redirects=False)
                
                if response.status_code == 302:
                    self.log_result("Edit album via form", True, "Album edited successfully")
                else:
                    self.log_result("Edit album via form", False, f"Status: {response.status_code}")
                    
            except Exception as e:
                self.log_result("Edit album via form", False, f"Error: {str(e)}")
        
        # Test delete album (cleanup)
        if album_id:
            try:
                response = self.session.post(f"{BASE_URL}/admin/album/delete/{album_id}", allow_redirects=False)
                
                if response.status_code == 302:
                    self.log_result("Delete album via form", True, "Album deleted successfully")
                else:
                    self.log_result("Delete album via form", False, f"Status: {response.status_code}")
                    
            except Exception as e:
                self.log_result("Delete album via form", False, f"Error: {str(e)}")
    
    def test_photo_upload(self):
        """Test photo upload via HTML forms"""
        print("\n=== Testing Photo Upload ===")
        
        # First create a test album
        album_data = {
            "name": "Test Photo Album",
            "description": "Album para teste de upload",
            "category": "Elétrica"
        }
        self.session.post(f"{BASE_URL}/admin/album/create", data=album_data)
        
        # Get album ID
        album_id = None
        try:
            albums_response = self.session.get(f"{BASE_URL}/api/albums")
            if albums_response.status_code == 200:
                albums = albums_response.json()
                test_album = next((a for a in albums if a["name"] == "Test Photo Album"), None)
                if test_album:
                    album_id = test_album["id"]
        except Exception as e:
            self.log_result("Get album for photo test", False, f"Error: {str(e)}")
            return
        
        if not album_id:
            self.log_result("Photo upload test", False, "Could not create test album")
            return
        
        # Test photo upload
        try:
            test_image = self.create_test_image()
            
            files = {
                'file': ('test_image.jpg', test_image, 'image/jpeg')
            }
            data = {
                'album_id': album_id,
                'title': 'Foto de Teste Backend',
                'description': 'Foto enviada durante teste automatizado'
            }
            
            response = self.session.post(f"{BASE_URL}/admin/photo/upload", files=files, data=data, allow_redirects=False)
            
            if response.status_code == 302:
                self.log_result("Upload photo via form", True, "Photo uploaded successfully")
                
                # Verify photo appears in API
                photos_response = self.session.get(f"{BASE_URL}/api/photos?album_id={album_id}")
                if photos_response.status_code == 200:
                    photos = photos_response.json()
                    if any(p["title"] == "Foto de Teste Backend" for p in photos):
                        self.log_result("Verify photo upload", True, "Photo found in API")
                    else:
                        self.log_result("Verify photo upload", False, "Photo not found in API")
                else:
                    self.log_result("Verify photo upload", False, f"API Status: {photos_response.status_code}")
            else:
                self.log_result("Upload photo via form", False, f"Status: {response.status_code}")
                
        except Exception as e:
            self.log_result("Upload photo via form", False, f"Error: {str(e)}")
        
        # Cleanup - delete test album
        try:
            self.session.post(f"{BASE_URL}/admin/album/delete/{album_id}")
        except:
            pass
    
    def test_rest_apis(self):
        """Test REST API endpoints for compatibility"""
        print("\n=== Testing REST APIs ===")
        
        # Test categories API
        try:
            response = self.session.get(f"{BASE_URL}/api/categories")
            if response.status_code == 200:
                data = response.json()
                if "categories" in data and "Alvenaria e Drywall" in data["categories"]:
                    self.log_result("GET /api/categories", True, f"Categories: {len(data['categories'])}")
                else:
                    self.log_result("GET /api/categories", False, "Missing categories or 'Alvenaria e Drywall'")
            else:
                self.log_result("GET /api/categories", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_result("GET /api/categories", False, f"Error: {str(e)}")
        
        # Test albums API
        try:
            response = self.session.get(f"{BASE_URL}/api/albums")
            if response.status_code == 200:
                albums = response.json()
                self.log_result("GET /api/albums", True, f"Albums count: {len(albums)}")
            else:
                self.log_result("GET /api/albums", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_result("GET /api/albums", False, f"Error: {str(e)}")
        
        # Test photos API
        try:
            response = self.session.get(f"{BASE_URL}/api/photos")
            if response.status_code == 200:
                photos = response.json()
                self.log_result("GET /api/photos", True, f"Photos count: {len(photos)}")
            else:
                self.log_result("GET /api/photos", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_result("GET /api/photos", False, f"Error: {str(e)}")
        
        # Test JWT login API
        try:
            login_data = {
                "email": ADMIN_EMAIL,
                "password": ADMIN_PASSWORD
            }
            response = self.session.post(f"{BASE_URL}/api/auth/login", json=login_data)
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data and "token_type" in data:
                    self.access_token = data["access_token"]
                    self.log_result("POST /api/auth/login", True, "JWT token received")
                else:
                    self.log_result("POST /api/auth/login", False, "Missing token fields")
            else:
                self.log_result("POST /api/auth/login", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_result("POST /api/auth/login", False, f"Error: {str(e)}")
        
        # Test authenticated API endpoints
        if self.access_token:
            headers = {"Authorization": f"Bearer {self.access_token}"}
            
            # Test create album via API
            try:
                album_data = {
                    "name": "API Test Album",
                    "description": "Created via REST API",
                    "category": "Hidráulica"
                }
                response = self.session.post(f"{BASE_URL}/api/albums", json=album_data, headers=headers)
                if response.status_code == 200:
                    album = response.json()
                    self.log_result("POST /api/albums (authenticated)", True, f"Album ID: {album['id']}")
                    
                    # Cleanup
                    self.session.delete(f"{BASE_URL}/api/albums/{album['id']}", headers=headers)
                else:
                    self.log_result("POST /api/albums (authenticated)", False, f"Status: {response.status_code}")
            except Exception as e:
                self.log_result("POST /api/albums (authenticated)", False, f"Error: {str(e)}")
    
    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting Backend Test Suite for Oriani Full-Stack Application")
        print(f"Testing against: {BASE_URL}")
        print("=" * 60)
        
        self.test_html_pages()
        self.test_admin_redirect()
        self.test_login_flow()
        self.test_logout()
        self.test_album_crud()
        self.test_photo_upload()
        self.test_rest_apis()
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for r in self.test_results if r["success"])
        failed = sum(1 for r in self.test_results if not r["success"])
        
        print(f"Total Tests: {len(self.test_results)}")
        print(f"✅ Passed: {passed}")
        print(f"❌ Failed: {failed}")
        
        if failed > 0:
            print("\n🔍 FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"   ❌ {result['test']}: {result['message']}")
        
        return failed == 0

if __name__ == "__main__":
    tester = BackendTester()
    success = tester.run_all_tests()
    
    if success:
        print("\n🎉 All tests passed!")
    else:
        print("\n⚠️  Some tests failed. Check the details above.")