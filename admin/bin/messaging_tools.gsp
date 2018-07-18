uses com.guidewire.commons.product.GWProduct
uses gw.cmdline.util.MessagingToolsArgs
uses gw.lang.cli.CommandLineAccess
uses gw.api.soap.GWAuthenticationHandler
uses soap.IMessagingToolsAPI.api.IMessagingToolsAPI
uses java.text.SimpleDateFormat
uses java.lang.Integer
uses soap.IMessagingToolsAPI.entity.MessageStatisticsData

GWProduct.CC.enableProduct()

print( "Running ${CommandLineAccess.getCurrentProgram().Name}" )

//Initialize the args class for this program
CommandLineAccess.initialize( MessagingToolsArgs )

//New up a messaging soap service 
var api = new IMessagingToolsAPI( MessagingToolsArgs.Server + "/soap/IMessagingToolsAPI" );
api.addHandler( new GWAuthenticationHandler( MessagingToolsArgs.User, MessagingToolsArgs.Password ) )
print( "Using URL ${api.URL }" )

if( MessagingToolsArgs.Purge != null ) {
  var format = new SimpleDateFormat("MM/dd/yyyy")
  var cutoff = format.parse( MessagingToolsArgs.Purge )
  print("Purging completed messages with cutoff ${format.format( cutoff )}" )
  api.purgeCompletedMessages( cutoff.toCalendar() )
  print("Message table purged")
}

if( MessagingToolsArgs.Retry != null ) {
  print("Retrying message ${MessagingToolsArgs.Retry}...")
  try {
    if( api.retryMessage( MessagingToolsArgs.Retry ) ) {
      print( "Message retried" )
    } else {
      print( "Message retry failed" )
    }
  } catch( e ) {
    print( "Message retry failed with exception: ${e.Message}" )
  }
}
 
if( MessagingToolsArgs.Skip != null ) {
  print("Skipping message ${MessagingToolsArgs.Skip}...")
  try { 
    if ( api.skipMessage( MessagingToolsArgs.Skip ) ) {
      print( "Message skipped" )
    } else {
      print( "Message skip failed" )
    }
  } catch( e ) {
    print( "Message skip failed with exception: ${e.Message}" )
  }
}

if( MessagingToolsArgs.RetryDest != null ) {
  print("Retrying retryable error messages for destination ${MessagingToolsArgs.RetryDest}...");
  if ( api.retryRetryableErrorMessages( MessagingToolsArgs.RetryDest ) ) {
    print( "Messages retried" )
  } else {
    print( "No messages retried" )
  }
}

if( MessagingToolsArgs.Suspend != null ) {
  api.suspendDestination( MessagingToolsArgs.Suspend )
  print("Destination ${MessagingToolsArgs.Suspend} suspended")
}

if( MessagingToolsArgs.Resume != null ) {
  api.resumeDestination( MessagingToolsArgs.Resume )
  print("Destination ${MessagingToolsArgs.Resume} resumed")
}

if( MessagingToolsArgs.Resync ) {
  var destination = MessagingToolsArgs.Destination
  var claimId = MessagingToolsArgs.Claim
  if( destination == null or claimId == null ) {
    print( "Please include a claim id and destination id via the -claim and -destination options." )
    return
  }
  try { 
    api.resyncClaim( destination, claimId )
    print( "Claim (${claimId}) resynced against destination ${destination}" )
  } catch ( e ) {
    print( "Claim resync failed: ${e.Message}" )
  }
}

if ( MessagingToolsArgs.Statistics != null ) {
  var stats = api.getTotalStatistics( MessagingToolsArgs.Statistics )
  print( "Destination ${MessagingToolsArgs.Statistics}: ${stats.Failed} failed, ${stats.Inflight} inflight, "  +
         "${stats.Retry} waiting retry, ${stats.Unsent} unsent" )
}

print( "done" )