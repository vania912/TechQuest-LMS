@echo off
echo Adding changes...
git add .

echo.
set /p msg=Enter commit message: 
git commit -m "%msg%"

echo.
echo Pushing to GitHub...
git push origin master

echo.
echo ✅ All done!
pause

