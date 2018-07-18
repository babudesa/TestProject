package gw.plugin.messaging.impl

class ConsoleMessageTransport extends ConsoleMessageTransportNoAck {

  override function send( message: Message, transformedPayload: String ) : void
  {
    super.send( message, transformedPayload )

    if (message.Description == "Failed") {
      message.reportNonRetryableError();
    }  else if (message.Description == "Retried") {
      message.Description = null
      message.reportError();
    } else {
      message.reportAck();
    }
  }

}