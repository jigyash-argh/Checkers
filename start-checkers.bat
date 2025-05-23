@echo off
echo Starting CheckGate Checkers Game...

echo =========================================================
echo IMPORTANT: MongoDB is not required to run this application
echo The app will automatically run in Demo Mode without MongoDB
echo =========================================================

echo Starting backend server...
cd "C:\Users\jigyash.shukla\dev project\Checkers\CheckersEngine"
start powershell -NoExit -Command "cd server ; node server.js"

echo Starting frontend server...
start powershell -NoExit -Command "npm run dev"

echo Started! Please wait for both servers to initialize.
timeout /t 5

echo Opening application in browser...
start http://localhost:5173/

echo =======================================================================
echo Your CheckGate Checkers game is now running!
echo =======================================================================
echo - Frontend server: http://localhost:5173/
echo - Backend server: http://localhost:5000/
echo - MongoDB Status: Running in Demo Mode (no database needed)
echo - LOGIN INFO: Use any username/password to sign up or log in
echo =======================================================================
