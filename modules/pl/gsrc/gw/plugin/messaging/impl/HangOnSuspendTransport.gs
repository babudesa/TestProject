package gw.plugin.messaging.impl
uses gw.util.ILogger
uses gw.plugin.messaging.MessageTransport
uses gw.api.system.PLLoggerCategories
uses java.lang.Thread

class HangOnSuspendTransport implements MessageTransport {
  var _logger : ILogger as readonly LOGGER = PLLoggerCategories.MESSAGING
  protected var _destinationID : int

  construct() {
    _logger.info("The HangOnSuspendTransport for destination " + _destinationID + " is initialized.")
  }

  override function send( message: Message, transformedPayload: String ) : void
  {
    _logger.info("\nDestination=" + message.DestinationID + " Msg ID=" + message.ID 
       + " Primary=" + encode(message.PrimaryObjectKey)
       + " Root=" + encode(message.MessageRoot.ID)
       + " Payload=\"" + transformedPayload + "\"");
  }

  private function encode(key : Key) : String {
    if (key == null) {
      return "null"
    }
    return key.Type.RelativeName + ":" + key.Value
  }
  override function resume() : void
  {
    _logger.info("HangOnSuspendTransport Destination " + _destinationID + " RESUME start sleep")
    Thread.sleep(60000)
    _logger.info("HangOnSuspendTransport Destination " + _destinationID + " RESUME finished sleep")
  }

  override function setDestinationID( destinationID: int ) : void
  {
    _destinationID = destinationID
  }

  override function shutdown() : void
  {
    _logger.info("HangOnSuspendTransport Destination " + _destinationID + " SHUTDOWN")
  }

  override function suspend() : void
  {
    _logger.info("HangOnSuspendTransport Destination " + _destinationID + " SUSPEND start sleep")
    Thread.sleep(60000)
    _logger.info("HangOnSuspendTransport Destination " + _destinationID + " SUSPEND finished sleep")
  }

}
