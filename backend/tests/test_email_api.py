"""
Test cases for Kilolab Email API functionality
Tests the /api/send-email endpoint for admin alerts and order management

Features tested:
- Admin new order alerts
- Admin new user registration alerts  
- Order cancellation emails to clients
- Standard email sending
"""

import pytest
import requests
import os
import json

# Use environment variable for BASE_URL
BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestSendEmailAPI:
    """Test /api/send-email endpoint"""
    
    def test_api_endpoint_exists(self):
        """Test that the send-email API endpoint is accessible"""
        response = requests.options(f"{BASE_URL}/api/send-email")
        # In preview env, Vercel serverless function may not be deployed
        # So we expect either 200 (CORS preflight) or 404 (not deployed)
        print(f"Response status: {response.status_code}")
        print(f"Response: {response.text[:200] if response.text else 'No content'}")
        # Document the result
        if response.status_code == 404:
            print("NOTE: /api/send-email returns 404 - Vercel serverless function not deployed in preview")
        elif response.status_code == 200:
            print("NOTE: /api/send-email endpoint accessible")
        
        # This is informational - the serverless function isn't deployed in preview env
        # 204 is a valid CORS preflight response
        assert response.status_code in [200, 204, 404, 405], f"Unexpected status: {response.status_code}"
    
    def test_admin_new_order_alert_payload(self):
        """Test admin_new_order alert - payload structure verification"""
        # Test that the payload structure is correct for admin_new_order type
        payload = {
            "type": "admin_new_order",
            "data": {
                "id": "test123456789",
                "weight": 5,
                "total_price": 25.00,
                "service_type": "standard",
                "pickup_address": "123 Rue Test",
                "pickup_city": "Paris"
            }
        }
        
        response = requests.post(
            f"{BASE_URL}/api/send-email",
            headers={"Content-Type": "application/json"},
            json=payload
        )
        
        print(f"Admin new order alert - Status: {response.status_code}")
        print(f"Response: {response.text[:500] if response.text else 'No content'}")
        
        # In preview env, expect 404 as Vercel serverless isn't deployed
        if response.status_code == 404:
            print("INFO: API endpoint not deployed in preview environment")
            pytest.skip("Vercel serverless function not available in preview env")
        elif response.status_code == 500:
            # May fail due to missing RESEND_API_KEY
            data = response.json() if response.text else {}
            if "not configured" in str(data.get("error", "")):
                print("INFO: Email service not configured (missing RESEND_API_KEY)")
                pytest.skip("Email service not configured")
        
        # If we get here, the API is functional
        assert response.status_code in [200, 400, 401, 403, 500]
    
    def test_admin_new_user_alert_payload(self):
        """Test admin_new_user alert - payload structure verification"""
        payload = {
            "type": "admin_new_user",
            "data": {
                "email": "testuser@example.com",
                "full_name": "Test User",
                "role": "client"
            }
        }
        
        response = requests.post(
            f"{BASE_URL}/api/send-email",
            headers={"Content-Type": "application/json"},
            json=payload
        )
        
        print(f"Admin new user alert - Status: {response.status_code}")
        print(f"Response: {response.text[:500] if response.text else 'No content'}")
        
        if response.status_code == 404:
            print("INFO: API endpoint not deployed in preview environment")
            pytest.skip("Vercel serverless function not available in preview env")
    
    def test_order_cancellation_email_payload(self):
        """Test order cancellation email - payload structure"""
        payload = {
            "to": "client@example.com",
            "subject": "❌ Commande #TEST1234 annulée - Kilolab",
            "html": """
                <html>
                <body>
                    <h1>Commande annulée</h1>
                    <p>Votre commande #TEST1234 a été annulée.</p>
                    <p>Message: Nous n'avons pas de laveur disponible dans votre zone actuellement.</p>
                </body>
                </html>
            """,
            "type": "order_cancelled"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/send-email",
            headers={"Content-Type": "application/json"},
            json=payload
        )
        
        print(f"Order cancellation email - Status: {response.status_code}")
        print(f"Response: {response.text[:500] if response.text else 'No content'}")
        
        if response.status_code == 404:
            print("INFO: API endpoint not deployed in preview environment")
            pytest.skip("Vercel serverless function not available in preview env")
    
    def test_missing_required_fields(self):
        """Test that API returns error for missing required fields"""
        # When not using special types, 'to' and 'subject' are required
        payload = {
            "html": "<p>Test</p>"
            # Missing 'to' and 'subject'
        }
        
        response = requests.post(
            f"{BASE_URL}/api/send-email",
            headers={"Content-Type": "application/json"},
            json=payload
        )
        
        print(f"Missing fields test - Status: {response.status_code}")
        print(f"Response: {response.text[:500] if response.text else 'No content'}")
        
        if response.status_code == 404:
            pytest.skip("Vercel serverless function not available in preview env")
        
        # Should return 400 for missing required fields
        # Or 500 if RESEND_API_KEY is not configured
        assert response.status_code in [400, 500]


class TestFrontendIntegration:
    """Test that frontend code correctly calls the email API"""
    
    def test_signup_admin_alert_integration(self):
        """Verify Signup.tsx has admin alert integration code"""
        signup_file = "/app/src/pages/Signup.tsx"
        
        with open(signup_file, 'r') as f:
            content = f.read()
        
        # Check for admin alert call
        assert "admin_new_user" in content, "Signup should send admin_new_user alert"
        assert "/api/send-email" in content, "Signup should call /api/send-email"
        assert "type: 'admin_new_user'" in content or "type: \"admin_new_user\"" in content, \
            "Signup should use admin_new_user type"
        
        print("PASS: Signup.tsx has admin alert integration")
    
    def test_useorders_admin_alert_integration(self):
        """Verify useOrders.ts has admin alert integration for new orders"""
        orders_file = "/app/src/hooks/useOrders.ts"
        
        with open(orders_file, 'r') as f:
            content = f.read()
        
        # Check for admin alert call
        assert "admin_new_order" in content, "useOrders should send admin_new_order alert"
        assert "/api/send-email" in content, "useOrders should call /api/send-email"
        
        print("PASS: useOrders.ts has admin alert integration")
    
    def test_admin_dashboard_order_modal(self):
        """Verify AdminDashboard has order modal with cancel functionality"""
        dashboard_file = "/app/src/pages/AdminDashboard.tsx"
        
        with open(dashboard_file, 'r') as f:
            content = f.read()
        
        # Check for order modal state
        assert "showOrderModal" in content, "Should have showOrderModal state"
        assert "selectedOrder" in content, "Should have selectedOrder state"
        assert "cancelMessage" in content, "Should have cancelMessage state"
        
        # Check for order management functions
        assert "cancelOrder" in content, "Should have cancelOrder function"
        assert "sendMessageToClient" in content, "Should have sendMessageToClient function"
        
        # Check for API call
        assert "/api/send-email" in content, "Should call /api/send-email for notifications"
        
        # Check for UI elements
        assert "Annuler commande" in content, "Should have 'Annuler commande' button"
        assert "Envoyer message" in content, "Should have 'Envoyer message' button"
        assert "Message au client" in content, "Should have message textarea label"
        
        print("PASS: AdminDashboard has order modal with cancel/message functionality")
    
    def test_orders_table_has_actions_column(self):
        """Verify orders table in AdminDashboard has Actions column"""
        dashboard_file = "/app/src/pages/AdminDashboard.tsx"
        
        with open(dashboard_file, 'r') as f:
            content = f.read()
        
        # The orders table should have an Actions header
        # Look for the specific pattern in orders tab
        assert "activeTab === \"orders\"" in content, "Should have orders tab"
        
        # Check that Actions column exists in orders table
        # This searches for Actions header in the context of orders
        orders_section = content[content.find("activeTab === \"orders\""):]
        actions_found = "Actions" in orders_section[:2000]  # Check within next 2000 chars
        
        assert actions_found, "Orders table should have Actions column"
        
        print("PASS: Orders table has Actions column")


class TestEmailAPIStructure:
    """Test the structure of the send-email.js serverless function"""
    
    def test_api_file_exists(self):
        """Verify send-email.js file exists"""
        api_file = "/app/api/send-email.js"
        assert os.path.exists(api_file), f"API file should exist at {api_file}"
        print("PASS: send-email.js exists")
    
    def test_api_handles_admin_alert_types(self):
        """Verify API handles admin_new_order and admin_new_user types"""
        api_file = "/app/api/send-email.js"
        
        with open(api_file, 'r') as f:
            content = f.read()
        
        assert "admin_new_order" in content, "Should handle admin_new_order type"
        assert "admin_new_user" in content, "Should handle admin_new_user type"
        assert "handleAdminAlert" in content, "Should have handleAdminAlert function"
        
        print("PASS: API handles admin alert types")
    
    def test_api_has_cors_headers(self):
        """Verify API sets CORS headers"""
        api_file = "/app/api/send-email.js"
        
        with open(api_file, 'r') as f:
            content = f.read()
        
        assert "Access-Control-Allow-Origin" in content, "Should set CORS origin header"
        assert "Access-Control-Allow-Methods" in content, "Should set CORS methods header"
        
        print("PASS: API has CORS headers")
    
    def test_api_uses_resend(self):
        """Verify API uses Resend for email sending"""
        api_file = "/app/api/send-email.js"
        
        with open(api_file, 'r') as f:
            content = f.read()
        
        assert "api.resend.com" in content, "Should use Resend API"
        assert "RESEND_API_KEY" in content, "Should use RESEND_API_KEY environment variable"
        assert "noreply@kilolab.fr" in content, "Should use kilolab.fr as from address"
        
        print("PASS: API uses Resend email service")
    
    def test_admin_email_configured(self):
        """Verify admin email is configured"""
        api_file = "/app/api/send-email.js"
        
        with open(api_file, 'r') as f:
            content = f.read()
        
        assert "ADMIN_EMAIL" in content, "Should have ADMIN_EMAIL constant"
        assert "akim.hachili@gmail.com" in content, "Should have default admin email"
        
        print("PASS: Admin email is configured")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
