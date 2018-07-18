uses com.guidewire.commons.product.GWProduct
uses soap.IDataExtractionAPI.api.IDataExtractionAPI
uses gw.lang.cli.CommandLineAccess
uses gw.cmdline.util.UsageToolsArgs
uses gw.api.soap.GWAuthenticationHandler
uses java.text.SimpleDateFormat
uses java.io.File
uses gw.cmdline.util.ExposureCreationData
uses java.util.ArrayList
uses java.util.Date
uses java.lang.Long
uses org.apache.commons.collections.map.ListOrderedMap
uses java.lang.Integer
uses java.util.Map
uses java.io.StringReader
uses java.io.BufferedReader

GWProduct.CC.enableProduct() 

CommandLineAccess.initialize( UsageToolsArgs )

print( "Running ${CommandLineAccess.getCurrentProgram().Name}" )

var api = new IDataExtractionAPI( UsageToolsArgs.Server + "/soap/IDataExtractionAPI" )
api.addHandler( new GWAuthenticationHandler( UsageToolsArgs.User, UsageToolsArgs.Password ) )
print( "Using URL ${api.URL }" )

var formatter = new SimpleDateFormat( "MM/dd/yyyy" ) 
var startDate = UsageToolsArgs.StartDate == null ? null : 
                                            formatter.parse( UsageToolsArgs.StartDate ).toCalendar()
var endDate = UsageToolsArgs.EndDate == null ? null : 
                                        formatter.parse( UsageToolsArgs.EndDate ).toCalendar()

if( UsageToolsArgs.CountExposures ) {
  var val = api.findCreatedExposuresAndRenderWithTemplateByName( startDate, 
                                                                 endDate, 
                                                                 "countexposures.gs" )
  var results = new ArrayList<ExposureCreationData>()
  var reader = new BufferedReader(new StringReader(val))
  while ( reader.ready() ) {
    var data = new ExposureCreationData()
    //The data is in three-line sequences
    data.ClaimNumber = reader.readLine()
    if ( not data.ClaimNumber.HasContent ) break
    data.ExposureName = reader.readLine()
    if ( not data.ExposureName.HasContent ) break
    var createTime = reader.readLine()
    if ( not createTime.HasContent ) break
    data.CreateTime = new Date( Long.valueOf( createTime ) )
    results.add(data)
  }

  print( "Found ${results.size()} exposures." )
  if( UsageToolsArgs.IncludeExposureDetails and UsageToolsArgs.IncludeMonthlyDetails ) {
    print("Please specify only one detail option, not both")
  } else if( UsageToolsArgs.IncludeExposureDetails ) {
    if(  UsageToolsArgs.GenerateCSV != null ) { 
      var file = new File( UsageToolsArgs.GenerateCSV )
      var output = "Claim Number,Exposure,Creation Date\n"
      for( r in results ) {
        output += "${r.ClaimNumber}, ${r.ExposureName}, ${formatter.format( r.CreateTime )}\n"
      }
      file.write( output )
    } else {
      print("Claim Number,Exposure,Creation Date")
      //todo turn into each later
      results.each( \r -> print("${r.ClaimNumber}, ${r.ExposureName}, ${formatter.format( r.CreateTime )}") )
    }
  } else if ( UsageToolsArgs.IncludeMonthlyDetails ) {
    var yearMonthFormatter = new SimpleDateFormat( "MM/yyyy" ) 
    
    //key is the MM/yyyy string, value is the count in that month
    var counts  = new ListOrderedMap() as Map<String, Integer>
    counts = counts.toAutoMap( \ k -> Integer.valueOf(0) )
    
    //sort results by date so they all end up together and earliest dates are added first
    results.sortBy( \ r -> r.CreateTime )
    for( r in results ) {
      counts[ yearMonthFormatter.format( r.CreateTime ) ]++ //increment count for MM/yyyy
    }
    
    if(  UsageToolsArgs.GenerateCSV != null ) { 
      var file = new File( UsageToolsArgs.GenerateCSV )
      var output = "Month,# Exposures\n"
      for( key in counts.Keys ) {
        output += "${key}, ${counts[key]}\n"
      }
      file.write( output )
    } else {
      print("Month,# Exposures")
      for( key in counts.Keys ) {
        print( "${key}, ${counts[key]}" )
      }
    }
  } else {
    if(  UsageToolsArgs.GenerateCSV != null ) {
      print(" -include_exposure_details was not specified, so output file will not be created");
    }
  }
} else {
  print( "Unknown command.  Use the -help option to see available options." )
}




