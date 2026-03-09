#!/usr/bin/env python3
"""
Simple HTTP Server with JSON data storage
For multi-user auction demo (local network only)

Usage:
    python3 server.py

Then access from other computers:
    http://<YOUR_IP>:8000/
"""

import http.server
import socketserver
import json
import os
from urllib.parse import urlparse, parse_qs
from datetime import datetime

PORT = 8000
DATA_FILE = "shared-data.json"

# Initialize data file if not exists
if not os.path.exists(DATA_FILE):
    initial_data = {
        "items": [
            {
                "id": 1,
                "name": "Vintage Watch",
                "description": "A beautiful vintage timepiece from the 1960s.",
                "startingPrice": 100,
                "currentPrice": 120,
                "timeLeft": 5400,
                "image": "images/watch.jpg",
                "category": "Collectibles",
                "bidHistory": [
                    {"bidder": "1001", "amount": 120, "time": "2026-03-08 10:00"}
                ]
            },
            {
                "id": 2,
                "name": "Gaming Keyboard",
                "description": "Mechanical gaming keyboard with RGB lighting.",
                "startingPrice": 60,
                "currentPrice": 80,
                "timeLeft": 3600,
                "image": "images/keyboard.jpg",
                "category": "Electronics",
                "bidHistory": [
                    {"bidder": "1002", "amount": 80, "time": "2026-03-08 10:15"}
                ]
            },
            {
                "id": 3,
                "name": "Mountain Bike",
                "description": "High-quality mountain bike, suitable for trails.",
                "startingPrice": 250,
                "currentPrice": 300,
                "timeLeft": 7200,
                "image": "images/bike.jpg",
                "category": "Sports",
                "bidHistory": [
                    {"bidder": "1003", "amount": 300, "time": "2026-03-08 10:30"}
                ]
            },
            {
                "id": 4,
                "name": "Art Painting",
                "description": "Original abstract painting by a local artist.",
                "startingPrice": 400,
                "currentPrice": 450,
                "timeLeft": 10800,
                "image": "images/painting.jpg",
                "category": "Art",
                "bidHistory": [
                    {"bidder": "1001", "amount": 450, "time": "2026-03-08 10:45"}
                ]
            }
        ]
    }
    with open(DATA_FILE, 'w') as f:
        json.dump(initial_data, f, indent=2)

class AuctionHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed_path = urlparse(self.path)

        # API endpoint to get all items data
        if parsed_path.path == '/api/items':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()

            with open(DATA_FILE, 'r') as f:
                data = json.load(f)
            self.wfile.write(json.dumps(data).encode())
            return

        # Serve static files
        return http.server.SimpleHTTPRequestHandler.do_GET(self)

    def do_POST(self):
        parsed_path = urlparse(self.path)

        # API endpoint to place a bid
        if parsed_path.path == '/api/bid':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            bid_data = json.loads(post_data.decode())

            # Load current data
            with open(DATA_FILE, 'r') as f:
                data = json.load(f)

            # Find the item and update bid
            item_id = bid_data['itemId']
            bid_amount = bid_data['amount']
            bidder_name = bid_data['bidder']

            for item in data['items']:
                if item['id'] == item_id:
                    # Validate bid
                    if bid_amount > item['currentPrice']:
                        item['currentPrice'] = bid_amount
                        item['bidHistory'].insert(0, {
                            'bidder': bidder_name,
                            'amount': bid_amount,
                            'time': datetime.now().strftime('%Y-%m-%d %H:%M')
                        })

                        # Save data
                        with open(DATA_FILE, 'w') as f:
                            json.dump(data, f, indent=2)

                        # Send success response
                        self.send_response(200)
                        self.send_header('Content-type', 'application/json')
                        self.send_header('Access-Control-Allow-Origin', '*')
                        self.end_headers()
                        self.wfile.write(json.dumps({
                            'success': True,
                            'message': 'Bid placed successfully',
                            'currentPrice': bid_amount
                        }).encode())
                        return
                    else:
                        # Bid too low
                        self.send_response(400)
                        self.send_header('Content-type', 'application/json')
                        self.send_header('Access-Control-Allow-Origin', '*')
                        self.end_headers()
                        self.wfile.write(json.dumps({
                            'success': False,
                            'message': 'Bid must be higher than current price'
                        }).encode())
                        return

            # Item not found
            self.send_response(404)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({
                'success': False,
                'message': 'Item not found'
            }).encode())
            return

        # Default POST handler
        self.send_response(404)
        self.end_headers()

def get_local_ip():
    import socket
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('10.255.255.255', 1))
        ip = s.getsockname()[0]
    except Exception:
        ip = '127.0.0.1'
    finally:
        s.close()
    return ip

if __name__ == '__main__':
    with socketserver.TCPServer(("", PORT), AuctionHandler) as httpd:
        local_ip = get_local_ip()
        print("=" * 60)
        print(f"🚀 BidMaster Server Running!")
        print("=" * 60)
        print(f"📍 Local access:   http://localhost:{PORT}")
        print(f"🌐 Network access: http://{local_ip}:{PORT}")
        print("=" * 60)
        print(f"📊 Data file: {DATA_FILE}")
        print("🛑 Press Ctrl+C to stop")
        print("=" * 60)
        print()
        httpd.serve_forever()
