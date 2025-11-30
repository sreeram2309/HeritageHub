@echo off
echo Starting HeritageHub...

:: 1. Start the Backend (Kitchen) in a new window
start "HeritageHub Backend" cmd /k "cd server && nodemon index.js"

:: 2. Wait 5 seconds for the backend to wake up
timeout /t 5

:: 3. Start the Frontend (Restaurant) in a new window
:: This will also automatically open your browser to the right URL
start "HeritageHub Frontend" cmd /k "cd client && npm start"

echo Done! App is launching...