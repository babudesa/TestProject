uses com.guidewire.commons.product.GWProduct
uses gw.cmdline.util.ZoneImportToolsArgs
uses gw.lang.cli.CommandLineAccess
uses gw.api.soap.GWAuthenticationHandler
uses soap.IZoneImportAPI.api.IZoneImportAPI
uses java.lang.Integer
uses com.guidewire.util.webservices.SOAPOutboundHandler
uses java.lang.System
uses java.io.File


GWProduct.CC.enableProduct() 

print( "Running ${CommandLineAccess.getCurrentProgram().Name}" )

//Initialize the args class for this program
CommandLineAccess.initialize( ZoneImportToolsArgs )

//New up a maintenance soap service
var api = new IZoneImportAPI( ZoneImportToolsArgs.Server + "/soap/IZoneImportAPI" );
api.addHandler( new GWAuthenticationHandler(ZoneImportToolsArgs.User, ZoneImportToolsArgs.Password) )
print( "Using URL ${api.URL}" )

SOAPOutboundHandler.READ_TIMEOUT.set( Integer.MAX_VALUE )

var charSetName = "UTF-8"

if(ZoneImportToolsArgs.Charset != null) {
  charSetName = ZoneImportToolsArgs.Charset
}

if(ZoneImportToolsArgs.Import != null) {
  if(ZoneImportToolsArgs.Country == null) {
    print("Please specify both a country and a file to import.")
    System.exit(-1)
  }

  print("Import data for country ${ZoneImportToolsArgs.Country} from file ${ZoneImportToolsArgs.Import}")

  try {
    var zoneData = new File(ZoneImportToolsArgs.Import).read()
    var rows = api.importToStaging( ZoneImportToolsArgs.Country, zoneData, ZoneImportToolsArgs.Clearstaging )
    if(rows < 1) {
      print("Zone data import failed: ${ZoneImportToolsArgs.Import} (The file does not contain any data)")
    } else {
      print("Zone data import succeeded: ${rows} rows imported.")
    }
  } catch (e) {
    print("Zone data import failed: ${e.Message}")
  }
} else if(ZoneImportToolsArgs.Clearproduction) {
  try {
    api.clearProductionTables( ZoneImportToolsArgs.Country )
    print("Clearing production tables succeeded")
  } catch (e) {
    print("Clearing production tables failed: ${e.Message}")
  }
} else if(ZoneImportToolsArgs.Clearstaging) {
  try {
    api.clearStagingTables( ZoneImportToolsArgs.Country )
    if(ZoneImportToolsArgs.Country != null) {
      print("Clearing staging tables for country=${ZoneImportToolsArgs.Country} succeeded")    
    } else {
      print("Clearing staging tables succeeded")
    }
  } catch (e) {
    print("Clearing staging tables failed: ${e.Message}")
  }
} else {
  CommandLineAccess.showHelp( ZoneImportToolsArgs )
}

