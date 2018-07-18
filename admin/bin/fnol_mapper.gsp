uses com.guidewire.commons.product.GWProduct
uses gw.cmdline.util.FNOLMapperArgs
uses gw.lang.cli.CommandLineAccess
uses gw.api.soap.GWAuthenticationHandler
uses soap.IClaimAPI.api.IClaimAPI
uses java.lang.Integer
uses java.util.ArrayList
uses com.guidewire.util.webservices.SOAPOutboundHandler
uses java.io.File


GWProduct.CC.enableProduct() 

print( "Running ${CommandLineAccess.getCurrentProgram().Name}" )

//Initialize the args class for this program
CommandLineAccess.initialize( FNOLMapperArgs )

//New up a maintenance soap service
var api = new IClaimAPI( FNOLMapperArgs.Server + "/soap/IClaimAPI" );
api.addHandler( new GWAuthenticationHandler(FNOLMapperArgs.User, FNOLMapperArgs.Password) )
print( "Using URL ${api.URL}" )

SOAPOutboundHandler.READ_TIMEOUT.set( Integer.MAX_VALUE )

var result = api.importClaimFromXML(new File(FNOLMapperArgs.Input).read(), FNOLMapperArgs.Mapper)

if(FNOLMapperArgs.Resultfile != null) {
  new File(FNOLMapperArgs.Resultfile).write(result)
} else {
  print(result)
}
