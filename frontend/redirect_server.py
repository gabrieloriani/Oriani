#!/usr/bin/env python3
"""
Simple redirect server that forwards all requests to the FastAPI backend.
This replaces the React frontend since we're now using Python full-stack.
"""
from http.server import HTTPServer, BaseHTTPRequestHandler
import http.client
import os

BACKEND_HOST = 'localhost'
BACKEND_PORT = 8001

class ProxyHandler(BaseHTTPRequestHandler):
    def do_request(self, method):
        """Forward request to backend"""
        try:
            # Read request body if present
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length) if content_length > 0 else None
            
            # Connect to backend
            conn = http.client.HTTPConnection(BACKEND_HOST, BACKEND_PORT)
            
            # Forward headers
            headers = {}
            for header, value in self.headers.items():
                if header.lower() not in ['host', 'connection']:
                    headers[header] = value
            
            # Make request to backend
            conn.request(method, self.path, body=body, headers=headers)
            response = conn.getresponse()
            
            # Send response back
            self.send_response(response.status)
            
            # Forward response headers
            for header, value in response.getheaders():
                if header.lower() not in ['transfer-encoding', 'connection']:
                    self.send_header(header, value)
            self.end_headers()
            
            # Send response body
            self.wfile.write(response.read())
            conn.close()
            
        except Exception as e:
            self.send_response(502)
            self.send_header('Content-Type', 'text/plain')
            self.end_headers()
            self.wfile.write(f'Proxy Error: {str(e)}'.encode())
    
    def do_GET(self):
        self.do_request('GET')
    
    def do_POST(self):
        self.do_request('POST')
    
    def do_PUT(self):
        self.do_request('PUT')
    
    def do_DELETE(self):
        self.do_request('DELETE')
    
    def do_PATCH(self):
        self.do_request('PATCH')
    
    def do_OPTIONS(self):
        self.do_request('OPTIONS')
    
    def log_message(self, format, *args):
        print(f"[Proxy] {self.address_string()} - {format % args}")

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 3000))
    server = HTTPServer(('0.0.0.0', port), ProxyHandler)
    print(f'Proxy server running on port {port}, forwarding to backend on port {BACKEND_PORT}')
    server.serve_forever()
