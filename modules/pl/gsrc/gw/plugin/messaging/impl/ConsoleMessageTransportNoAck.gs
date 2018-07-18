package gw.plugin.messaging.impl

uses gw.plugin.messaging.MessageTransport
uses gw.api.system.PLLoggerCategories
uses gw.util.ILogger

class ConsoleMessageTransportNoAck implements MessageTransport {
  var _logger : ILogger as readonly LOGGER = PLLoggerCategories.MESSAGING
  protected var _destinationID : int

  construct()
  {
    _logger.info("The ConsoleMessageTransport for destination " + _destinationID + " is initialized.");
  }

  override function send( message: Message, transformedPayload: String ) : void
  {
    _logger.info("MessageTransport Destination " + _destinationID + " SEND (Msg ID = " + message.getID() + " Payload = \"" + transformedPayload + "\")");
  }

  override function resume() : void
  {
    _logger.info("MessageTransport Destination " + _destinationID + " RESUME");
  }

  override function setDestinationID( destinationID: int ) : void
  {
    _destinationID = destinationID;
  }

  override function shutdown() : void
  {
    _logger.info("MessageTransport Destination " + _destinationID + " SHUTDOWN");
  }

  override function suspend() : void
  {
    _logger.info("MessageTransport Destination " + _destinationID + " SUSPEND");
  }

}