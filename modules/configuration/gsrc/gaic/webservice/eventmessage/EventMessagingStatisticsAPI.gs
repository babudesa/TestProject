package gaic.webservice.eventmessage

uses java.lang.String
uses gw.lang.WebService
uses java.rmi.RemoteException
uses gw.api.admin.DestinationMessageStatisticsUtil

@WebService
class EventMessagingStatisticsAPI {

  construct() {}

  public function isFinished(id:String):boolean {
    var stats = DestinationMessageStatisticsUtil.getMessageStatistics();
    for (var s in stats) {
      if (s.Id == id) {
        if ((s.Inflight + s.Unsent) <= 0) {
          return true;
        }
        if (s.Status.equalsIgnoreCase("started") or s.Status.equalsIgnoreCase("retrying")) {
          return false;
        }
        throw new RemoteException("Message queue not started! Was: "+s.Status);
      }
    }
    throw new RemoteException("Message queue id not found in ClaimCenter!");
  }
  
  public function getStatus(id:String):String {
    var stats = DestinationMessageStatisticsUtil.getMessageStatistics();
    for (var s in stats) {
      if (s.Id == id) {
        return s.Status;
      }
    }
    throw new RemoteException("Message queue id not found in ClaimCenter!");
  }

}
