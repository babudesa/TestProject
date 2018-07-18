REM 
REM For now we pass in the authentication info directly. In the future we should eliminate
REM the '-password cc' from here and force callers to provide the info. Probably the same
REM for the server param too.
REM
REM java -classpath .;soap.jar;servlet.jar;toolkit.jar;util.jar;GLUE-STD-4.0.1.jar;commons-cli-1.0.jar IRDocumentLinker -server http://localhost:8080/cc -user admin -password cc %1 %2 %3 %4 %5 %6 %7 %8 %9
REM

cd \imagewrt\ClaimCenterIntegration

java -classpath .;soap.jar;servlet.jar;toolkit.jar;util.jar;GLUE-STD-4.0.1.jar;commons-cli-1.0.jar IRDocumentLinker -server http://pacific:8080/cc -password cc %1 %2 %3 %4 %5 %6 %7 %8 %9