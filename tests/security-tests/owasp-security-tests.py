"""
OWASP Security Tests - Pivori Studio
Comprehensive security testing suite
"""

import requests
import json
import time
from typing import Dict, List, Tuple
from urllib.parse import urljoin
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class OWASPSecurityTester:
    """OWASP Top 10 Security Tests"""

    def __init__(self, base_url: str, api_token: str = None):
        self.base_url = base_url
        self.api_token = api_token
        self.session = requests.Session()
        self.results = []

    def _make_request(self, method: str, endpoint: str, **kwargs) -> requests.Response:
        """Make HTTP request with error handling"""
        url = urljoin(self.base_url, endpoint)
        headers = kwargs.get('headers', {})
        if self.api_token:
            headers['Authorization'] = f'Bearer {self.api_token}'
        kwargs['headers'] = headers

        try:
            if method.upper() == 'GET':
                return self.session.get(url, **kwargs)
            elif method.upper() == 'POST':
                return self.session.post(url, **kwargs)
            elif method.upper() == 'PUT':
                return self.session.put(url, **kwargs)
            elif method.upper() == 'DELETE':
                return self.session.delete(url, **kwargs)
        except Exception as e:
            logger.error(f"Request failed: {e}")
            return None

    def test_injection_attacks(self) -> Dict:
        """Test 1: Injection Attacks (SQL, Command, etc.)"""
        logger.info("Testing Injection Attacks...")
        results = {
            'test': 'Injection Attacks',
            'passed': True,
            'issues': []
        }

        # SQL Injection Test
        sql_payloads = [
            "' OR '1'='1",
            "'; DROP TABLE users; --",
            "1 UNION SELECT NULL, NULL, NULL",
        ]

        for payload in sql_payloads:
            response = self._make_request('GET', f'/api/services?search={payload}')
            if response and response.status_code == 200:
                try:
                    data = response.json()
                    # Check if injection was successful (should not return unexpected data)
                    if len(data) > 0:
                        results['issues'].append(f"Potential SQL injection vulnerability: {payload}")
                        results['passed'] = False
                except:
                    pass

        # Command Injection Test
        cmd_payloads = [
            "; ls -la",
            "| cat /etc/passwd",
            "` whoami `",
        ]

        for payload in cmd_payloads:
            response = self._make_request('GET', f'/api/services?name={payload}')
            if response and response.status_code == 200:
                if 'root' in response.text or 'bin' in response.text:
                    results['issues'].append(f"Potential command injection vulnerability: {payload}")
                    results['passed'] = False

        return results

    def test_broken_authentication(self) -> Dict:
        """Test 2: Broken Authentication"""
        logger.info("Testing Broken Authentication...")
        results = {
            'test': 'Broken Authentication',
            'passed': True,
            'issues': []
        }

        # Test 1: Default credentials
        default_creds = [
            ('admin', 'admin'),
            ('admin', 'password'),
            ('admin', '12345'),
        ]

        for username, password in default_creds:
            response = self._make_request('POST', '/login', json={
                'username': username,
                'password': password
            })
            if response and response.status_code == 200:
                results['issues'].append(f"Default credentials work: {username}:{password}")
                results['passed'] = False

        # Test 2: Missing authentication
        response = self._make_request('GET', '/api/admin/users')
        if response and response.status_code == 200:
            results['issues'].append("Admin endpoint accessible without authentication")
            results['passed'] = False

        # Test 3: Weak password policy
        weak_passwords = ['1', '12', '123', 'password', 'admin']
        for pwd in weak_passwords:
            response = self._make_request('POST', '/api/users/register', json={
                'username': f'testuser_{int(time.time())}',
                'password': pwd
            })
            if response and response.status_code == 201:
                results['issues'].append(f"Weak password accepted: {pwd}")
                results['passed'] = False

        return results

    def test_sensitive_data_exposure(self) -> Dict:
        """Test 3: Sensitive Data Exposure"""
        logger.info("Testing Sensitive Data Exposure...")
        results = {
            'test': 'Sensitive Data Exposure',
            'passed': True,
            'issues': []
        }

        # Test 1: Check for HTTPS
        if self.base_url.startswith('http://'):
            results['issues'].append("Using HTTP instead of HTTPS")
            results['passed'] = False

        # Test 2: Check security headers
        response = self._make_request('GET', '/health')
        if response:
            headers = response.headers
            required_headers = [
                'Strict-Transport-Security',
                'X-Content-Type-Options',
                'X-Frame-Options',
                'X-XSS-Protection',
                'Content-Security-Policy'
            ]
            for header in required_headers:
                if header not in headers:
                    results['issues'].append(f"Missing security header: {header}")
                    results['passed'] = False

        # Test 3: Check for sensitive data in responses
        response = self._make_request('GET', '/api/users/profile')
        if response and response.status_code == 200:
            try:
                data = response.json()
                sensitive_fields = ['password', 'api_key', 'secret', 'token']
                for field in sensitive_fields:
                    if field in str(data).lower():
                        results['issues'].append(f"Sensitive field exposed in response: {field}")
                        results['passed'] = False
            except:
                pass

        return results

    def test_xml_external_entities(self) -> Dict:
        """Test 4: XML External Entities (XXE)"""
        logger.info("Testing XML External Entities...")
        results = {
            'test': 'XML External Entities',
            'passed': True,
            'issues': []
        }

        xxe_payload = '''<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>
<root>&xxe;</root>'''

        response = self._make_request('POST', '/api/upload', data=xxe_payload, headers={
            'Content-Type': 'application/xml'
        })

        if response and response.status_code == 200:
            if 'root:' in response.text:
                results['issues'].append("XXE vulnerability detected")
                results['passed'] = False

        return results

    def test_broken_access_control(self) -> Dict:
        """Test 5: Broken Access Control"""
        logger.info("Testing Broken Access Control...")
        results = {
            'test': 'Broken Access Control',
            'passed': True,
            'issues': []
        }

        # Test 1: Horizontal privilege escalation
        response = self._make_request('GET', '/api/users/1/profile')
        if response and response.status_code == 200:
            response2 = self._make_request('GET', '/api/users/2/profile')
            if response2 and response2.status_code == 200:
                results['issues'].append("Horizontal privilege escalation possible")
                results['passed'] = False

        # Test 2: Direct object reference
        response = self._make_request('GET', '/api/services/999')
        if response and response.status_code == 404:
            pass  # Good
        elif response and response.status_code == 200:
            results['issues'].append("Insecure Direct Object Reference (IDOR)")
            results['passed'] = False

        # Test 3: Admin access without authorization
        response = self._make_request('GET', '/api/admin/settings')
        if response and response.status_code == 200:
            results['issues'].append("Admin endpoint accessible without proper authorization")
            results['passed'] = False

        return results

    def test_security_misconfiguration(self) -> Dict:
        """Test 6: Security Misconfiguration"""
        logger.info("Testing Security Misconfiguration...")
        results = {
            'test': 'Security Misconfiguration',
            'passed': True,
            'issues': []
        }

        # Test 1: Debug mode enabled
        response = self._make_request('GET', '/health')
        if response and 'debug' in response.text.lower():
            results['issues'].append("Debug mode appears to be enabled")
            results['passed'] = False

        # Test 2: Default pages
        default_pages = ['/admin', '/administrator', '/wp-admin', '/phpmyadmin']
        for page in default_pages:
            response = self._make_request('GET', page)
            if response and response.status_code == 200:
                results['issues'].append(f"Default admin page accessible: {page}")
                results['passed'] = False

        # Test 3: Directory listing
        response = self._make_request('GET', '/uploads/')
        if response and response.status_code == 200 and '<title>Index of' in response.text:
            results['issues'].append("Directory listing enabled")
            results['passed'] = False

        return results

    def test_xss_attacks(self) -> Dict:
        """Test 7: Cross-Site Scripting (XSS)"""
        logger.info("Testing XSS Attacks...")
        results = {
            'test': 'XSS Attacks',
            'passed': True,
            'issues': []
        }

        xss_payloads = [
            '<script>alert("XSS")</script>',
            '"><script>alert("XSS")</script>',
            '<img src=x onerror="alert(\'XSS\')">',
            '<svg onload="alert(\'XSS\')">',
        ]

        for payload in xss_payloads:
            response = self._make_request('GET', f'/api/services?search={payload}')
            if response and response.status_code == 200:
                if payload in response.text:
                    results['issues'].append(f"Reflected XSS vulnerability: {payload}")
                    results['passed'] = False

        return results

    def test_csrf_protection(self) -> Dict:
        """Test 8: Cross-Site Request Forgery (CSRF)"""
        logger.info("Testing CSRF Protection...")
        results = {
            'test': 'CSRF Protection',
            'passed': True,
            'issues': []
        }

        # Test 1: Check for CSRF token
        response = self._make_request('GET', '/api/services')
        if response:
            headers = response.headers
            if 'X-CSRF-Token' not in headers:
                results['issues'].append("CSRF token not present in response headers")
                results['passed'] = False

        # Test 2: POST without CSRF token
        response = self._make_request('POST', '/api/services', json={
            'name': 'test'
        })
        if response and response.status_code == 201:
            results['issues'].append("POST request accepted without CSRF token")
            results['passed'] = False

        return results

    def test_using_components_with_known_vulnerabilities(self) -> Dict:
        """Test 9: Using Components with Known Vulnerabilities"""
        logger.info("Testing Components with Known Vulnerabilities...")
        results = {
            'test': 'Known Vulnerabilities',
            'passed': True,
            'issues': []
        }

        # Check response headers for version information
        response = self._make_request('GET', '/health')
        if response:
            headers = response.headers
            for header, value in headers.items():
                if any(x in str(value) for x in ['Apache', 'nginx', 'IIS']):
                    results['issues'].append(f"Server version exposed: {header}: {value}")
                    results['passed'] = False

        return results

    def test_insufficient_logging_monitoring(self) -> Dict:
        """Test 10: Insufficient Logging & Monitoring"""
        logger.info("Testing Logging & Monitoring...")
        results = {
            'test': 'Logging & Monitoring',
            'passed': True,
            'issues': []
        }

        # Test 1: Check for audit logs
        response = self._make_request('GET', '/api/audit-logs')
        if response and response.status_code == 404:
            results['issues'].append("Audit logs endpoint not found")
            results['passed'] = False

        # Test 2: Check for security events
        response = self._make_request('GET', '/api/security-events')
        if response and response.status_code == 404:
            results['issues'].append("Security events endpoint not found")
            results['passed'] = False

        return results

    def run_all_tests(self) -> List[Dict]:
        """Run all OWASP security tests"""
        logger.info("Starting OWASP Security Tests...")
        
        tests = [
            self.test_injection_attacks,
            self.test_broken_authentication,
            self.test_sensitive_data_exposure,
            self.test_xml_external_entities,
            self.test_broken_access_control,
            self.test_security_misconfiguration,
            self.test_xss_attacks,
            self.test_csrf_protection,
            self.test_using_components_with_known_vulnerabilities,
            self.test_insufficient_logging_monitoring,
        ]

        results = []
        for test in tests:
            try:
                result = test()
                results.append(result)
                logger.info(f"✓ {result['test']}: {'PASSED' if result['passed'] else 'FAILED'}")
            except Exception as e:
                logger.error(f"Test failed: {e}")

        return results

    def generate_report(self, results: List[Dict]) -> str:
        """Generate security test report"""
        report = "# OWASP Security Test Report\n\n"
        
        passed = sum(1 for r in results if r['passed'])
        total = len(results)
        
        report += f"## Summary\n"
        report += f"- Tests Passed: {passed}/{total}\n"
        report += f"- Pass Rate: {(passed/total)*100:.1f}%\n\n"

        report += "## Detailed Results\n\n"
        for result in results:
            status = "✓ PASSED" if result['passed'] else "✗ FAILED"
            report += f"### {result['test']}: {status}\n"
            if result['issues']:
                report += "Issues:\n"
                for issue in result['issues']:
                    report += f"- {issue}\n"
            report += "\n"

        return report


if __name__ == '__main__':
    import sys

    base_url = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:8000'
    api_token = sys.argv[2] if len(sys.argv) > 2 else None

    tester = OWASPSecurityTester(base_url, api_token)
    results = tester.run_all_tests()
    report = tester.generate_report(results)
    
    print(report)
    
    # Save report
    with open('security-test-report.md', 'w') as f:
        f.write(report)
    
    logger.info("Report saved to security-test-report.md")

