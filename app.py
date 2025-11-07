from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

DB = "database.db"

def init_db():
    with sqlite3.connect(DB) as conn:
        conn.execute('''CREATE TABLE IF NOT EXISTS requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            request_type TEXT,
            laptop_model TEXT,
            justification TEXT,
            accessories TEXT,
            needed_by TEXT,
            status TEXT DEFAULT "Pending Manager Approval"
        )''')

@app.route('/api/request', methods=['POST'])
def create_request():
    data = request.get_json()
    with sqlite3.connect(DB) as conn:
        cur = conn.cursor()
        cur.execute("INSERT INTO requests (name, request_type, laptop_model, justification, accessories, needed_by) VALUES (?, ?, ?, ?, ?, ?)",
                    (data['name'], data['request_type'], data['laptop_model'], data['justification'], ','.join(data['accessories']), data['needed_by']))
        conn.commit()
    return jsonify({"message": "Laptop request submitted successfully"}), 201

@app.route('/api/requests', methods=['GET'])
def list_requests():
    with sqlite3.connect(DB) as conn:
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()
        cur.execute("SELECT * FROM requests")
        rows = cur.fetchall()
        return jsonify([dict(row) for row in rows])

@app.route('/api/approve/<int:req_id>', methods=['POST'])
def approve_request(req_id):
    with sqlite3.connect(DB) as conn:
        conn.execute("UPDATE requests SET status = 'Approved - Sent to IT Fulfillment' WHERE id = ?", (req_id,))
        conn.commit()
    return jsonify({"message": "Request approved"}), 200

@app.route('/api/complete/<int:req_id>', methods=['POST'])
def complete_request(req_id):
    with sqlite3.connect(DB) as conn:
        conn.execute("UPDATE requests SET status = 'Completed' WHERE id = ?", (req_id,))
        conn.commit()
    return jsonify({"message": "Request marked as completed"}), 200

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
