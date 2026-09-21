import os
import sys
import json
import mimetypes
import re
from datetime import datetime
from http.server import HTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

PORT = int(os.environ.get('PORT', 3000))
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

PROTOSEM_ROUTES = {
    '/price-protosem',
    '/price-protosem-0th-week',
    '/protosem-week-0',
    '/price-protosem-week-0',
    '/week-00-story'
}

SPRINGBOARD_ROUTES = {
    '/infosys-springboard-week-1',
    '/springboard-week-1',
    '/week-1-recap',
    '/infosys-week-1'
}

RESUME_ROUTES = {
    '/resume',
    '/assets/resume.html'
}

class PortfolioHandler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        try:
            sys.stderr.write(f"[{self.log_date_time_string()}] {format % args}\n")
        except Exception:
            sys.stderr.write(f"[{self.log_date_time_string()}] {format} {' '.join(str(a) for a in args)}\n")

    def send_file_response(self, file_path, status=200):
        if not os.path.exists(file_path) or os.path.isdir(file_path):
            self.send_error(404, "File not found")
            return

        ctype, _ = mimetypes.guess_type(file_path)
        if not ctype:
            ctype = 'application/octet-stream'
        if ctype.startswith('text/') or ctype in ['application/javascript', 'application/json']:
            ctype += '; charset=utf-8'

        try:
            with open(file_path, 'rb') as f:
                content = f.read()
            self.send_response(status)
            self.send_header('Content-Type', ctype)
            self.send_header('Content-Length', str(len(content)))
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(content)
        except Exception as e:
            self.send_error(500, f"Internal error: {str(e)}")

    def do_GET(self):
        parsed = urlparse(self.path)
        clean_path = parsed.path.rstrip('/')
        if not clean_path:
            clean_path = '/'

        # Route matches
        if clean_path == '/' or clean_path == '/index.html':
            return self.send_file_response(os.path.join(BASE_DIR, 'index.html'))

        if clean_path in RESUME_ROUTES:
            return self.send_file_response(os.path.join(BASE_DIR, 'assets', 'resume.html'))

        if clean_path in PROTOSEM_ROUTES:
            return self.send_file_response(os.path.join(BASE_DIR, 'price-protosem-0th-week.html'))

        if clean_path in SPRINGBOARD_ROUTES:
            return self.send_file_response(os.path.join(BASE_DIR, 'infosys-springboard-week-1.html'))

        rel_path = clean_path.lstrip('/')

        # Search candidates in order similar to Express static middleware
        search_candidates = []
        if rel_path.startswith('assets/'):
            sub_asset = rel_path[len('assets/'):]
            search_candidates.append(os.path.join(BASE_DIR, 'public', 'assets', sub_asset))
            search_candidates.append(os.path.join(BASE_DIR, 'assets', sub_asset))
        
        search_candidates.append(os.path.join(BASE_DIR, 'public', rel_path))
        search_candidates.append(os.path.join(BASE_DIR, rel_path))

        for candidate in search_candidates:
            if os.path.isfile(candidate):
                return self.send_file_response(candidate)

        # Fallback to index.html for SPA/HTML routes if no file extension
        _, ext = os.path.splitext(rel_path)
        if not ext:
            return self.send_file_response(os.path.join(BASE_DIR, 'index.html'))

        self.send_error(404, "File not found")

    def do_POST(self):
        parsed = urlparse(self.path)
        clean_path = parsed.path.rstrip('/')

        if clean_path == '/contact':
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length).decode('utf-8', errors='replace')

            content_type = self.headers.get('Content-Type', '')
            name, email, message = '', '', ''

            if 'application/json' in content_type:
                try:
                    data = json.loads(body)
                    name = data.get('name', '').strip()
                    email = data.get('email', '').strip()
                    message = data.get('message', '').strip()
                except Exception:
                    pass
            else:
                form_data = parse_qs(body)
                name = form_data.get('name', [''])[0].strip()
                email = form_data.get('email', [''])[0].strip()
                message = form_data.get('message', [''])[0].strip()

            if not name or not email or not message:
                self.send_json_response(400, {'message': 'All fields are required.'})
                return

            email_regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
            if not re.match(email_regex, email):
                self.send_json_response(400, {'message': 'Please provide a valid email address.'})
                return

            entry = (
                "---\n"
                f"Date   : {datetime.now().strftime('%d/%m/%Y, %I:%M:%S %p')}\n"
                f"Name   : {name}\n"
                f"Email  : {email}\n"
                f"Message: {message}\n\n"
            )

            messages_file = os.path.join(BASE_DIR, 'messages.txt')
            try:
                with open(messages_file, 'a', encoding='utf-8') as f:
                    f.write(entry)
                print(f"New message from {name} ({email})")
                self.send_json_response(200, {'message': 'Message received! I will get back to you soon.'})
            except Exception as e:
                self.send_json_response(500, {'message': 'Failed to save message. Please try again.'})
            return

        self.send_error(404, "Not found")

    def send_json_response(self, status, data):
        response_bytes = json.dumps(data).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(response_bytes)))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(response_bytes)

def run():
    server_address = ('', PORT)
    httpd = HTTPServer(server_address, PortfolioHandler)
    print(f"[OK] Server running at http://localhost:{PORT}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server...")
        httpd.server_close()

if __name__ == '__main__':
    run()
