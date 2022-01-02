$PATH = Get-Location
invoke-expression 'cmd /c start powershell -Command { npm start /Frontend/App }'
python $PATH"/Backend/app.py" 

