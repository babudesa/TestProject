uses soap.IMaintenanceToolsAPI.api.IMaintenanceToolsAPI
uses soap.IMaintenanceToolsAPI.entity.ProcessID
uses gw.lang.cli.CommandLineAccess
uses gw.cmdline.util.MaintenanceToolsArgs
uses gw.cmdline.util.CCToolkitUtils
uses gw.api.soap.GWAuthenticationHandler
uses com.guidewire.util.webservices.SOAPOutboundHandler
uses com.guidewire.commons.product.GWProduct
uses java.util.HashSet
uses java.lang.Integer
uses java.io.File
uses java.lang.Integer
uses java.text.SimpleDateFormat
uses java.util.ArrayList
uses gw.cmdline.util.ToolkitUtils
uses java.lang.Throwable

final var DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss a")

GWProduct.CC.enableProduct()

print( "Running ${CommandLineAccess.getCurrentProgram().Name}" )

//Initialize the args class for this program
CommandLineAccess.initialize( MaintenanceToolsArgs )

//New up a maintenance soap service
var api = new IMaintenanceToolsAPI( MaintenanceToolsArgs.Server + "/soap/IMaintenanceToolsAPI" );
api.addHandler( new GWAuthenticationHandler( MaintenanceToolsArgs.User, MaintenanceToolsArgs.Password ) )
print( "Using URL ${api.URL}" )

//If start process was passed in, fire it off
if( MaintenanceToolsArgs.StartProcess != null ) {
  var process = MaintenanceToolsArgs.StartProcess
  print( "Running process '${process}'" )
  if( validateProcessName( process ) ) {
    var pid = api.startBatchProcess( process )
    print( "Process '${process}' is being run with PID ${pid.Pid}" )
  }

//if process status was passed in, fire it off
} else if( MaintenanceToolsArgs.ProcessStatus != null ) {
  var nameOrId = MaintenanceToolsArgs.ProcessStatus

  //number passed in
  if( nameOrId.matches( "\\b\\d+\\b" ) ) {
    var pid = new ProcessID()
    pid.Pid = Integer.parseInt( nameOrId )

    try {
      var status = api.batchProcessStatusByID( pid )

      print( "Process number ${nameOrId} (${status.Type}):" )

      if( status.Running ) {
        print( "Currently running, started at ${DATE_FORMAT.format(status.StartDate.Time)}, completed ${status.OpsCompleted} operation(s) with ${status.FailedOps} failure(s)" );
        if( status.DetailedStatus != null ) {
          print( "Detailed status: ${status.DetailedStatus}" )
        }
      } else {
        print("Started at ${DATE_FORMAT.format(status.StartDate.Time)}, completed at ${DATE_FORMAT.format(status.DateCompleted.Time)}")
        if (status.getSuccess()) {
          print("Ran to completion, completing ${status.OpsCompleted} operation(s) with ${status.FailedOps} failure(s)");
        } else {
          print( "Failed to run to completion: ${status.FailureReason}.  Completed ${status.OpsCompleted} operation(s) " +
                 "with ${status.FailedOps } failure(s) before terminating" )
        }
      }
    } catch ( e ) {
      print( "Failed to find process status : " + e.Message )
    }

  //name passed in
  } else {

    if ( validateProcessName (nameOrId ) ) {
      var status = api.batchProcessStatusByName(nameOrId)
      print("Process ${nameOrId}:");

      if (status.Running) {
        print("Process ${nameOrId} is currently running with ${status.OpsCompleted} operation(s) completed and ${status.FailedOps} failure(s) so far")
        if (status.DetailedStatus != null) {
          print( "Detailed status: ${status.DetailedStatus}" )
        }
      } else {
        print("Process ${nameOrId} is not currently running");
      }
    }
  }
} else if( MaintenanceToolsArgs.TerminateProcess != null ){
  var nameOrId = MaintenanceToolsArgs.TerminateProcess

  //number passed in
  if( nameOrId.matches( "\\b\\d+\\b" ) ) {
    var pid = new ProcessID()
    pid.Pid = Integer.parseInt( nameOrId )

    try {
      if( api.terminateBatchProcessByID( pid ) ) {
        print( "Terminated process number ${nameOrId}" );
      } else {
        print( "Process ${nameOrId} couldn't be terminated or isn't currently running." )
      }
    } catch ( e ) {
      print ("Failed to terminate process: ${e.LocalizedMessage}" )
    }

  //name passed in
  } else {
    if ( validateProcessName (nameOrId ) ) {
      if( api.terminateBatchProcessByName( nameOrId ) ) {
        print( "Terminated process ${nameOrId}" );
      } else {
        print( "Process ${nameOrId} couldn't be terminated or isn't currently running." )
      }
    }
  }

} else if( MaintenanceToolsArgs.GetDBStatisticsStatements ) {
  for( data in api.getUpdateTableStatisticsData() ) {
    var updateStmts = data.StatisticsUpdateStatements.join(";\n")
    print( "--<%=data.TableName%>\n ${updateStmts}\n" )
  }
} else if( MaintenanceToolsArgs.GetIncrementalDBStatisticsStatements ) {
    for( data in api.getIncrementalUpdateTableStatisticsData() ) {
      var updateStmts = data.StatisticsUpdateStatements.join(";\n")
      print( "--<%=data.TableName%>\n ${updateStmts}\n" )
    }
} else if( MaintenanceToolsArgs.WhenStats ) {
  var calcTime = api.whenStatsCalculated()
  var server = MaintenanceToolsArgs.Server
  if (calcTime == null) {
    print("Server on '${server}' has not calculated statistics")
  } else {
    print("Server on '${server}' calculated statistics at ${DATE_FORMAT.format(calcTime.Time)}")
  }
} else if( MaintenanceToolsArgs.MarkClaimForPurge != null ) {
  var claimNumber = MaintenanceToolsArgs.MarkClaimForPurge
  print( "Marking claim ${claimNumber} for purge" )
  print( api.markForPurge( { claimNumber  } ) )
} else if ( MaintenanceToolsArgs.MarkClaimsForPurge ) {
  if( MaintenanceToolsArgs.Claims != null ) {
    print( "Marking claims ${MaintenanceToolsArgs.Claims.join( ", " )} for purge" )
    print( api.markForPurge( MaintenanceToolsArgs.Claims ) )
  } else if( MaintenanceToolsArgs.File != null ) {
    print( "Marking claims from file ${MaintenanceToolsArgs.File} for purge" )
    print( api.markForPurge( ToolkitUtils.readSimpleCSV( MaintenanceToolsArgs.File ) ) )
  } else {
    print( "You must specify claim numbers via the -claims option or a CSV file to read via the -file option" )
  }
} else if( MaintenanceToolsArgs.RestoreClaim != null ) {
  var claimNumbers : String [] = null
  if( MaintenanceToolsArgs.Claims != null ) {
    print( "Restoring claims ${MaintenanceToolsArgs.Claims.join( ", " )} from archive" )
    claimNumbers = MaintenanceToolsArgs.Claims
  } else if( MaintenanceToolsArgs.File != null ) {
    print( "Restoring claims from file ${MaintenanceToolsArgs.File}" )
    claimNumbers = ToolkitUtils.readSimpleCSV( MaintenanceToolsArgs.File )
  }
  if(claimNumbers == null or claimNumbers.Count == 0) {
    print( "You must specify claim numbers via the -claims option or a CSV file to read via the -file option" )
  } else {
    claimNumbers = CCToolkitUtils.stripBlanks( claimNumbers )
    try {
      print( api.restore( claimNumbers, MaintenanceToolsArgs.RestoreClaim ) )
    } catch(t : Throwable) {
      print( "Error Processing Claims: ${t.LocalizedMessage}")
    }
  }
} else if( MaintenanceToolsArgs.ScheduleClaimForArchive ) {
  var claimNumbers : String [] = null
  if( MaintenanceToolsArgs.Claims != null ) {
    print( "Scheduling claims ${MaintenanceToolsArgs.Claims.join( ", " )} for archive" )
    claimNumbers = MaintenanceToolsArgs.Claims
  } else if( MaintenanceToolsArgs.File != null ) {
    print( "Scheduling claims from file ${MaintenanceToolsArgs.File} for archive" )
    claimNumbers = ToolkitUtils.readSimpleCSV( MaintenanceToolsArgs.File )
  }
  if(claimNumbers == null or claimNumbers.Count == 0) {
    print( "You must specify claim numbers via the -claims option or a CSV file to read via the -file option" )
  } else {
    claimNumbers = CCToolkitUtils.stripBlanks( claimNumbers )
    try {
      print( api.scheduleForArchive( claimNumbers ) )
    } catch(t : Throwable) {
      print( "Error Processing Claims: ${t.LocalizedMessage}")
    }
    print( "Any claims listed as processed successfully have been scheduled for archive. Check the Work Queue Info and Info Pages for Archive to check the status of these claims." )
  }
} else {
  print( "No valid command was passed in!" )
}


print( "done" )

function validateProcessName( process : String ) : boolean {
  var batchProcessNames = api.getValidBatchProcessNames()
  if( not batchProcessNames.contains( process.toLowerCase() ) ) {
    var validNames = batchProcessNames.toList().sort().join( ", " )
    print( "'${process}' is not a valid process name. Valid names are: ${validNames}" )
    return false
  }
  return true
}
