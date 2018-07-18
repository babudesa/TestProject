set JAVA_HOME=C:\Program Files\Java\jdk1.6.0_45
set JER_HOME=C:\Program Files\Java\jre6
set ANT_HOME=C:\ant171
set PATH=%PATH%;%JAVA_HOME%\bin;%JER_HOME%\bin;%ANT_HOME%\bin

@echo off
call ant -f "%~dp0\modules\ant\build.xml" studio
