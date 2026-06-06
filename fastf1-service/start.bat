@echo off
echo Setting up FastF1 Service...
if not exist venv (
    python -m venv venv
)
call venv\Scripts\activate
pip install -r requirements.txt
echo Starting FastF1 Service on port 5001...
python app.py
