uses com.guidewire.commons.product.GWProduct
uses gw.lang.cli.CommandLineAccess
uses gw.api.soap.GWAuthenticationHandler
uses soap.ITableImportAPI.api.ITableImportAPI
uses java.lang.Integer
uses com.guidewire.util.webservices.SOAPOutboundHandler
uses gw.cmdline.util.TableImportArgs
uses soap.ISystemToolsAPI.api.ISystemToolsAPI
uses soap.ISystemToolsAPI.enums.SystemRunlevel
uses java.lang.System
uses java.lang.NumberFormatException
uses java.rmi.RemoteException
uses soap.ITableImportAPI.entity.TableImportResult

function printResults(tir : TableImportResult) {
  if(tir.NumErrors > 0) {
    print("Staging table integrity checking generated ${tir.NumErrors} load errors.")
  } else {
    print("Staging table integrity checking completed with no errors.")
  }
}

function getErrorMessage(e : RemoteException) : String {
  var msg = e.Message
  if(msg == null) {
    try {
        // Fix for CC-24600
        // This is a hack to get at a SOAPServerException message, which
        // more some strange reason is only stored in "message1" not "mesasge"?
      var getMsgMethod = e.Class.getMethod( "getMessage1", {} )
      msg = getMsgMethod.invoke(e, {})
    } catch (e1) {
      msg = null
    }
  }
  if(msg == null) {
    msg = e.toString()
  }
  return msg
}

function verifyRunLevelMaintenance() {
  var runlevel : SystemRunlevel
  var sysApi = new ISystemToolsAPI( TableImportArgs.Server + "/soap/ISystemToolsAPI" );
  sysApi.addHandler( new GWAuthenticationHandler(TableImportArgs.User, TableImportArgs.Password) )

  try {
    runlevel = sysApi.getRunlevel()
  } catch (e : java.net.ConnectException) {
    print("Problem determining current run level: ${e.Message}")
  }

  if(SystemRunlevel.GW_MAINTENANCE != runlevel) {
    if(!TableImportArgs.Encryptstagingtbls) {
      print("The server must be in maintenance mode to execute this staging table operation.")
      print("Please use \"system_tools.gsp -maintenance\" to change the server runlevel.")
      System.exit(-1)
    }
  }
}

GWProduct.CC.enableProduct()

print( "Running ${CommandLineAccess.getCurrentProgram().Name}" )

//Initialize the args class for this program
CommandLineAccess.initialize( TableImportArgs )

//New up a maintenance soap service
var api = new ITableImportAPI( TableImportArgs.Server + "/soap/ITableImportAPI" );
api.addHandler( new GWAuthenticationHandler(TableImportArgs.User, TableImportArgs.Password) )
print( "Using URL ${api.URL}" )

SOAPOutboundHandler.READ_TIMEOUT.set( Integer.MAX_VALUE )

if(TableImportArgs.Messagesinks != null) {
  print("WARNING: messagesinks is deprecated and has no effect")
}

if(TableImportArgs.Integritycheck || TableImportArgs.Integritycheckandload) {
  if(TableImportArgs.Integritycheck && TableImportArgs.Integritycheckandload) {
    print("Please specify either 'integritycheck' or 'integritycheckandload' but not both")
    System.exit(-1)
  }

  if(TableImportArgs.Zonedataonly && !TableImportArgs.Integritycheckandload) {
    print("'zonedataonly' only supported with 'integritycheckandload'")
    System.exit(-1)
  }

  if(TableImportArgs.Integritycheck) {
    verifyRunLevelMaintenance()

    if(TableImportArgs.Batch) {
      var pid = api.integrityCheckStagingTableContentsAsBatchProcess( TableImportArgs.Clearerror, TableImportArgs.Populateexclusion, TableImportArgs.Allreferencesallowed )
      print("Staging table integrity checking started as process ${pid.Pid}")
    } else {
      var tir = api.integrityCheckStagingTableContents( TableImportArgs.Clearerror, TableImportArgs.Populateexclusion, TableImportArgs.Allreferencesallowed )
      print("Staging table integrity checking completed...")
      printResults(tir)
    }
  } else if(TableImportArgs.Integritycheckandload) {    
    verifyRunLevelMaintenance()
    if(TableImportArgs.Batch) {
      if(TableImportArgs.Zonedataonly) {
        print("'zonedataonly' not supported with 'batch'")
        System.exit(-1)
      }

      var pid = api.integrityCheckStagingTableContentsAndLoadSourceTablesAsBatchProcess( TableImportArgs.Clearerror, TableImportArgs.Populateexclusion, TableImportArgs.Estimateorastats, TableImportArgs.Allreferencesallowed )
      print("Staging table integrity checking / source table load started as process ${pid.Pid}")
    } else {
      try {
        var tir : TableImportResult
        if(TableImportArgs.Zonedataonly) {
          tir = api.integrityCheckZoneStagingTableContentsAndLoadZoneSourceTables( TableImportArgs.Clearerror, TableImportArgs.Populateexclusion, TableImportArgs.Estimateorastats )
          print("Zone Staging table integrity checking / Zone source table load completed...")
        } else {
          tir = api.integrityCheckStagingTableContentsAndLoadSourceTables( TableImportArgs.Clearerror, TableImportArgs.Populateexclusion, TableImportArgs.Estimateorastats, TableImportArgs.Allreferencesallowed )
          print("Staging table integrity checking / source table load completed...")
        }
        printResults(tir)
      } catch (e : RemoteException) {
        print("Staging table integrity checking failed: ${getErrorMessage(e)}")
      }
    }
  }
} else if(TableImportArgs.Clearerror) {
  api.clearErrorTable()
  print("Error table cleared...")
} else if(TableImportArgs.Clearexclusion) {
  api.clearExclusionTable()
  print("Exclusion table cleared...")
} else if(TableImportArgs.Clearstaging) {
  api.clearStagingTables()
  print("Staging tables cleared...")
} else if(TableImportArgs.Deleteexcluded) {
  if(TableImportArgs.Batch) {
    var pid = api.deleteExcludedRowsFromStagingTablesAsBatchProcess()
    print("Excluded rows removal started as process ${pid.Pid}")
  } else {
    api.deleteExcludedRowsFromStagingTables()
    print("Excluded rows removed from staging tables...")
  }
} else if(TableImportArgs.Populateexclusion) {
  if(TableImportArgs.Batch) {
    var pid = api.populateExclusionTableAsBatchProcess()
    print("Exclusion table population started as process ${pid.Pid}")
  } else {
    api.populateExclusionTable()
    print("Exclusion table populated with rows to exclude...")
  }
} else if(TableImportArgs.Updatedatabasestatistics) {
  if(TableImportArgs.Batch) {
    var pid = api.updateStatisticsOnStagingTablesAsBatchProcess()
    print("Staging table database statistics update started as process ${pid.Pid}")
  } else {
    api.updateStatisticsOnStagingTables()
    print("Database statistics updated on the staging tables...")
  }
} else if(TableImportArgs.Encryptstagingtbls) {
    api.encryptDataOnStagingTables()
    print("Data encrypted on staging tables.")
} else {
  CommandLineAccess.showHelp( TableImportArgs )
}
print("done")
