setlocal
set FONTFORGE_PATH=c:\Program Files (x86)\FontForgeBuilds
call "%FONTFORGE_PATH%\fontforge.bat" -lang=py -script fontconvert.py ..\fonts-sfd\SchoolLight_UAwords-Regular.sfd -w
move /Y ..\fonts-sfd\SchoolLight_UAwords-Regular.woff  ..\css\fonts\school.woff
call "%FONTFORGE_PATH%\fontforge.bat" -lang=py -script fontconvert.py ..\fonts-sfd\SchoolLight_punktir.sfd -w
move /Y ..\fonts-sfd\SchoolLight_punktir.woff  ..\css\fonts\school-dash.woff
endlocal