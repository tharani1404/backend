from flask import Flask
import threading
import schedule
import time
from script import job  # Assuming your original script is named script.py

app = Flask(__name__)

# Run job once at startup
job()

# Background thread to run scheduler
def run_scheduler():
    schedule.every(15).minutes.do(job)
    while True:
        schedule.run_pending()
        time.sleep(1)

threading.Thread(target=run_scheduler, daemon=True).start()

@app.route('/')
def home():
    return "RSS Fetcher is running!"

@app.route('/run-now')
def run_now():
    job()
    return "Job executed!"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=10000)
