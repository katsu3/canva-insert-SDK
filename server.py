#!/usr/bin/env python3
from http.server import HTTPServer, SimpleHTTPRequestHandler
import sys
import os
from pathlib import Path

class CORSRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # Canva用のCORSヘッダを追加
        self.send_header('Access-Control-Allow-Origin', 'https://www.canva.com')
        self.send_header('Access-Control-Allow-Credentials', 'true')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()
    
    def do_GET(self):
        # .envファイルの内容を読み込んでconfig.jsとして配信
        if self.path.startswith('/config.js'):
            self.send_response(200)
            self.send_header('Content-type', 'application/javascript')
            self.end_headers()
            
            # .envファイルを読み込み
            env_path = Path('configs/.env')
            api_key = ''
            if env_path.exists():
                with open(env_path, 'r') as f:
                    for line in f:
                        if line.startswith('GOOGLE_API_KEY='):
                            api_key = line.split('=', 1)[1].strip()
                            break
            
            # JavaScriptとして出力
            config_js = f'window.CONFIG = {{ GOOGLE_API_KEY: "{api_key}" }};'
            self.wfile.write(config_js.encode())
            return
        
        # 通常のファイル配信
        super().do_GET()

if __name__ == '__main__':
    port = 8080
    server_address = ('', port)
    httpd = HTTPServer(server_address, CORSRequestHandler)
    print(f'🚀 Server running at http://localhost:{port}/')
    print(f'✅ CORS enabled for https://www.canva.com')
    print('Press Ctrl+C to stop the server')
    httpd.serve_forever()
