uses gw.cmdline.util.WorkflowToolsArgs
uses gw.lang.cli.CommandLineAccess
uses com.guidewire.commons.product.GWProduct
uses gw.api.soap.GWAuthenticationHandler
uses soap.IWorkflowAPI.api.IWorkflowAPI
uses java.lang.Integer
uses com.guidewire.util.webservices.SOAPOutboundHandler
uses soap.IWorkflowAPI.fault.BadIdentifierException
uses soap.IWorkflowAPI.fault.SOAPException
uses soap.IWorkflowAPI.fault.EntityStateException
uses soap.IWorkflowAPI.fault.RequiredFieldException


GWProduct.CC.enableProduct()

print( "Running ${CommandLineAccess.getCurrentProgram().Name}" )

//Initialize the args class for this program
CommandLineAccess.initialize( WorkflowToolsArgs )

//New up a maintenance soap service
var api = new IWorkflowAPI( WorkflowToolsArgs.Server + "/soap/IWorkflowAPI" );
api.addHandler( new GWAuthenticationHandler(WorkflowToolsArgs.User, WorkflowToolsArgs.Password) )
print( "Using URL ${api.URL}" )

SOAPOutboundHandler.READ_TIMEOUT.set( Integer.MAX_VALUE )

try {
  if(WorkflowToolsArgs.ResumeAll) {
    api.resumeAllWorkflows()
  } else if(WorkflowToolsArgs.Resume != null) {
    api.resumeWorkflow( WorkflowToolsArgs.Resume )
  } else if(WorkflowToolsArgs.Complete != null) {
    api.complete( WorkflowToolsArgs.Complete )
  } else if(WorkflowToolsArgs.Suspend != null) {
    api.suspend( WorkflowToolsArgs.Suspend )
  } else {
    CommandLineAccess.showHelp( WorkflowToolsArgs )
  }
} catch (e : BadIdentifierException) {
  print("BadId: " + e.Message)
} catch (e : EntityStateException) {
  print("Workflow invalid state: " + e.Message)
} catch (e : RequiredFieldException) {
  print("Required field: " + e.Message)
} catch (e) { 
  e.printStackTrace()
}

print("done")