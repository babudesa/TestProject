uses com.guidewire.commons.product.GWProduct
uses gw.api.soap.GWAuthenticationHandler
uses gw.cmdline.util.SystemToolsArgs
uses gw.cmdline.util.ToolkitUtils
uses gw.lang.cli.CommandLineAccess
uses gw.util.StreamUtil
uses java.io.File
uses java.util.Date
uses soap.ISystemToolsAPI.api.ISystemToolsAPI
uses soap.ISystemToolsAPI.entity.DBConsistencyCheckResult
uses soap.ISystemToolsAPI.enums.SystemRunlevel
uses soap.ISystemToolsAPI.enums.SystemRunlevel

GWProduct.CC.enableProduct()

//Initialize the args class for this program
CommandLineAccess.initialize( SystemToolsArgs )

print( "Running ${CommandLineAccess.getCurrentProgram().Name}" )

//New up a messaging soap service
var api = new ISystemToolsAPI( SystemToolsArgs.Server + "/soap/ISystemToolsAPI" );
api.addHandler( new GWAuthenticationHandler( SystemToolsArgs.User, SystemToolsArgs.Password ) )
print( "Using URL ${api.URL}" )

//Ping the server and print its current run level
if( SystemToolsArgs.Ping ) {
  var result = api.getRunlevel()
  var runLevelString = "unknown mode : " + result
  if( result == SystemRunlevel.GW_MULTIUSER) {
    runLevelString = "ready (multiuser mode)"
  } else if( result == SystemRunlevel.GW_STARTING ) {
    runLevelString = "starting up"
  } else if ( result == SystemRunlevel.GW_MAINTENANCE ) {
    runLevelString = "in maintenance mode"
  } else if ( result == SystemRunlevel.GW_DAEMONS ) {
    runLevelString = "in daemons mode"
  }
  print( "Server on '${SystemToolsArgs.Server}' is ${runLevelString}" )
} else if( SystemToolsArgs.CheckDBConsistency != null ) {
  //Perform DB consistency checks
  if (SystemToolsArgs.CheckDBConsistency.length == 0) {
    print("Checking consistency of all database tables from server at '${SystemToolsArgs.Server}'; this may take a few minutes")
    var results = api.checkDatabaseConsistency( false )
    printConsistencyResults( results )
  } else if( SystemToolsArgs.CheckDBConsistency.length != 2 ) {
    print( "Please specify both a table selection and a consistency check type selection" )
  } else {
    print( "Checking consistency of selected database tables from server at '${SystemToolsArgs.Server}'; this may take a few minutes");
    var tablesToCheckArray = convertCommandLineArg(SystemToolsArgs.CheckDBConsistency[0])
    var checksToRunArray = convertCommandLineArg(SystemToolsArgs.CheckDBConsistency[1])
    print("Running partial database consistency checks for tables: ")
    printCommandLineArgs(tablesToCheckArray)
    print(" and running checks of type: ")
    printCommandLineArgs( checksToRunArray )
    var results = api.checkPartialDatabaseConsistency(false, tablesToCheckArray, checksToRunArray)
    printConsistencyResults( results )
  }
} else if( SystemToolsArgs.CheckDBConsistencyAsBatch != null ) {
  //Perform DB consistency checks
  if (SystemToolsArgs.CheckDBConsistencyAsBatch.length == 0) {
    print( "Submitting DBCC batch job for all database tables from server at '${SystemToolsArgs.Server}'" )
    print( "View results on the Consistency Checks Server Tools Info Page." )
    var pid = api.submitDBCCBatchJob(null, null)
    print( "Database Consistency Checks batch job is being run with PID ${pid.Pid}" )
  } else if( SystemToolsArgs.CheckDBConsistencyAsBatch.length != 2 ) {
    print( "Please specify both a table selection and a consistency check type selection" )
  } else {
    var tablesToCheckArray = convertCommandLineArg(SystemToolsArgs.CheckDBConsistencyAsBatch[0])
    var checksToRunArray = convertCommandLineArg(SystemToolsArgs.CheckDBConsistencyAsBatch[1])
    print("Submitting DBCC batch job for tables: ")
    printCommandLineArgs(tablesToCheckArray)
    print(" and running checks of type: " )
    printCommandLineArgs( checksToRunArray )
    print("View results on the Consistency Checks Server Tools Info Page." )
    var pid = api.submitDBCCBatchJob(tablesToCheckArray, checksTorunArray)
    print( "Database Consistency Checks batch job is being run with PID ${pid.Pid}" )
  }
} else if( SystemToolsArgs.ReportDBStats != null ) {
  //Report DB Statistics
  var filePath =  SystemToolsArgs.FilePath == null ? "." : SystemToolsArgs.FilePath
  if ( SystemToolsArgs.ReportDBStats.length == 0 ) {
    print("Generating and reporting database statistics for all database tables from '${SystemToolsArgs.Server}'; this may take a while");
    printDBStatsCommandLineArgs(null, null, null)
    var bytes = api.reportPartialDatabaseCatalogStatistics(null, null, null)
    writeZipFile(bytes, "DBCatalogStatistics", filePath )
  } else if( SystemToolsArgs.ReportDBStats.length != 3 ) {
    print("Please specify a table selection, a staging table selection and a typelist table selection");
  } else {
    print("Generating and reporting database statistics for selected database tables from '${SystemToolsArgs.Server}'; this may take a while")
    var tables = convertCommandLineArg( SystemToolsArgs.ReportDBStats[0] )
    var stagingTables = convertCommandLineArg( SystemToolsArgs.ReportDBStats[1] )
    var typelistTables = convertCommandLineArg( SystemToolsArgs.ReportDBStats[2] )
    var bytes = api.reportPartialDatabaseCatalogStatistics(tables, stagingTables, typelistTables)
    writeZipFile(bytes, "DBCatalogStatistics", filePath );
  }
} else if( SystemToolsArgs.Version ) {
    var version = api.getVersion()
    if (version == null) {
      print("Server '${SystemToolsArgs.Server}' is not ready")
      return
    }
    print("")
    print("Server:                  ${api.URL}")
    print("Product version:         ${version.AppVersion}")
    print("Database schema version: ${version.SchemaVersion}")
    print( version.ConfigVersion )
    print("Config version:          ${version.ConfigVersion}")
} else if ( SystemToolsArgs.Maintenance ) {
  //Runlevel stuff
  try {
    api.setRunlevel( SystemRunlevel.GW_MAINTENANCE )
    print("Server in maintenance mode")
  } catch (e) {
    print( "Unable to switch server to maintenance mode.  Reason: ${e.Message}")
  }
} else if ( SystemToolsArgs.Daemons ) {
  try {
    api.setRunlevel( SystemRunlevel.GW_DAEMONS )
    print("Server in daemons mode")
  } catch (e) {
    print( "Unable to switch server to daemons mode.  Reason: ${e.Message}")
  }
} else if ( SystemToolsArgs.MultiUser ) {
  try {
    api.setRunlevel( SystemRunlevel.GW_MULTIUSER )
    print("Server in multiuser mode")
  } catch (e) {
    print( "Unable to switch server to multiuser mode.  Reason: ${e.Message}")
  }
} else if ( SystemToolsArgs.SessionInfo ) {
  //Show session information
  var activeSessionData = api.getActiveSessionData()

  //partition sessions on user name
  var userNameToSessions = activeSessionData.partition( \ s -> s.UserName == null ? "Temporary system user" : s.UserName   )

  //collapse to count of user names
  var userNameToCount = userNameToSessions.mapValues( \ l -> l.Count )

  //sort entries by count
  var entriesSortedByCount = userNameToCount.entrySet().toList().sortByDescending( \ m -> m.Value  )

  //print out each username and the number of sessions they have
  print( "${activeSessionData.length} active sessions:" )
  for( entry in entriesSortedByCount ) {
    print( "${entry.Key} - ${entry.Value}" )
  }
} else if( SystemToolsArgs.UpdateLoggingLevel != null ) {
  //Update the logging level of the server
  if( SystemToolsArgs.UpdateLoggingLevel.length != 2 ) {
    print( "Please specify both a logger and a new logging level")
  } else {
    api.updateLoggingLevel(SystemToolsArgs.UpdateLoggingLevel[0], SystemToolsArgs.UpdateLoggingLevel[1])
  }
} else if( SystemToolsArgs.LoggerCategories ) {
  //Show all logger categories on the server
  api.getLoggingCategories().each( \ s -> print( s )  )
} else if( SystemToolsArgs.ReloadLoggingConfig ) {
  //Reload the logging configuration
  print( "Reloading logging config..." )
  api.reloadLoggingConfig()
  print( "Logger configuration reloaded" )
} else if ( SystemToolsArgs.RecalculateChecksums ) {
  print("Attempting to recalculate file checksums . . .")
  if ( api.recalculateFileChecksums() ) {
    print("File checksums successfully recalculated")
  } else {
    print( "Cannot recalculate checksums as the server is running either with clustering disabled or with configuration verification disabled" )
  }
} else if ( SystemToolsArgs.VerifyDBSchema ) {
  print("Verify the data model matches the physical database of server at '${SystemToolsArgs.Server}'; this may take a few minutes");
  var diffs = api.verifyDatabaseSchema()
  if (diffs.length != 0) {
    print("Inconsistencies detected!");
    diffs.each( \ s -> print( s )  )
  } else {
    print("No inconsistencies found");
  }
} else {
  CommandLineAccess.showHelp( SystemToolsArgs )
}

print( "done" )

//==============================================================================
// Helper functions
//==============================================================================
function convertCommandLineArg( commandLineArg : String ) : String[]{
  var args : String[]
  if (commandLineArg.equalsIgnoreCase("all")) {
    // null is the return value
  } else if (commandLineArg.equalsIgnoreCase("none")) {
    args = {}
  } else if (not commandLineArg.startsWith("@")) { // single table
    args = {commandLineArg};
  } else { // file of table names
    var filename = commandLineArg.substring(1)
    args = ToolkitUtils.readSimpleCSV( filename )
  }
  return args;
}

function printCommandLineArgs( argsToCheck : String[] ) {
  if (argsToCheck == null) {
    print( "all" );
  } else if (argsToCheck.length == 0) {
    print( "none" );
  } else {
    print( argsToCheck.join( ", " ) )
  }
}

function printConsistencyResults( results : DBConsistencyCheckResult[] ) {
  if (results.length != 0) {
    print ("Inconsistencies detected!" )
    for (result in results) {
      print("Num inconsistencies: : ${result.NumInconsistencies}")
      print("Check type: ${result.CheckType}")
      print("Description of consistency check: ${result.ConsistencyCheckDescription}")
      print("SQL: ${result.SqlString}")
      print("Succeeded: ${result.Succeeded}")
      print("")
      print("Description of failure: ${result.FailureDescription}")
      if (result.QueryToIdentifyRows != null) {
        print("Query to identify violating rows: ${result.QueryToIdentifyRows}")
      }
    }
  } else {
    print("No inconsistencies found")
  }
  print ("Complete results can be viewed and downloaded from the Consistency Checks Info Page online in System Tools.")
  print ("Consistency checks can be run as a batch job from that page.")
}

function printDBStatsCommandLineArgs(tablesToCheckArray : String[] , stagingTablesToCheckArray : String[] , typeListTablesToCheckArray : String[] ) {
  print("Running partial database statistics for tables: ")
  printCommandLineArgs(tablesToCheckArray)
  print("  and staging tables: ")
  printCommandLineArgs(stagingTablesToCheckArray)
  print("  and typelist tables: ")
  printCommandLineArgs(typeListTablesToCheckArray)
  print("")
}

function writeZipFile( bytes : byte[] , fileName : String, filePath : String ) {
  if (filePath == null) {
    filePath = ".";
  }
  if (filePath.endsWith(File.Separator)) {
    filePath = filePath.substring(0, filePath.length() - 1);
  }
  var date = new Date()
  var dateString = date.toString().replace(" ", "_").replace(":", ".")
  var file = "${filePath}${File.Separator}${fileName}_${dateString}.zip"
  var zipFile = new File(file)
  print( "Writing zip file ${file}" )
  try {
    zipFile.writeBytes( bytes )
    print( "Done writing file ${file}" )
  } catch( e ) {
    print( "Could not write file ${file}" )
    print( e.Message )
    e.printStackTrace()
  }
}
