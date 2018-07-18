package gaic.plugin.cc.iso;
uses gw.processes.BatchProcessBase;
uses gw.api.iso.ISOProperties;
uses com.gaic.claims.iso.batch.ISOBatchPlugin
uses com.gaic.claims.dto.IsoDTO
uses com.gaic.claims.env.Environment
uses java.lang.Exception
uses java.lang.Throwable

class ISOProcessAndSendBatch extends BatchProcessBase{
  
  var _logger = ISOProperties.LOGGER
  
  construct() {
    super("ISOProcessAndSend");
  }
  
  override function requestTermination() : boolean {
    super.requestTermination()
    return true
  }
  
  override function doWork() : void {
    var isoBatchPlugin = new ISOBatchPlugin()
    var objectKeysToProcess : List<String> = isoBatchPlugin.ListToProcess //just a list of publicIDs or object keys
    var isoErrored : boolean
    
    for(objectKey in objectKeysToProcess) {
      var isoDailyMessages : List <IsoDTO> = isoBatchPlugin.getISOMessages(objectKey) //gets the actual rows from ISODailyMessages
      isoErrored = false;
      for(idm in isoDailyMessages) {
        var reportable : ISOReportable = null;
        if (idm.FeatureLevel) {
          reportable = find(e in Exposure where e.PublicID == idm.ObjectKey).getAtMostOneRow();
        } else {
          reportable = find(c in Claim where c.PublicID == idm.ObjectKey).getAtMostOneRow();
        }
        
        try {
          //Add note. This is done first due to some issues with Retired claims. Do not add a note for KeyFieldUpdates or Repair messages
          if(idm.MessageCode == "ClaimSearch"){
            addNote(reportable) 
          }

          //build a new destination message
          send(idm, reportable)
          
        }catch(ex){
          isoErrored = true
          sendErrorEmail(ex)                        
          break                             
        }
        
        if(!isoErrored) {
          isoBatchPlugin.setProcessed(idm.ID);
        }
      }
      if(!isoErrored) {
        isoBatchPlugin.setNotProcessed(objectKey);
      }
    }
  } 

  private property get EmailRecipient() : String{
    return (Environment.getInstance() == Environment.PROD) ? "ClaimCenterSupport@gaig.com" : "ClaimCenterTesting@gaig.com";    
  }
  
  private function send(idm : IsoDTO, reportable : ISOReportable){
    gw.transaction.Transaction.runWithNewBundle(\ bundle -> {
      var msg : Message = new Message()
      msg.setFieldValue("EventName", idm.EventName)
      msg.setFieldValue("DestinationID", 10)
      msg.Payload = idm.Payload
      msg.MessageCode = idm.MessageCode
      msg.MessageRoot = reportable

      if (_logger.isDebugEnabled()) {
        _logger.debug(displaykey.Java.Logger.ISO.Message.Transport.SendMessage(msg.DisplayName));
      }
    }, "su")    
  }
  
  
  private function addNote(reportable : ISOReportable){
    gw.transaction.Transaction.runWithNewBundle(\ bundle -> {
      bundle.add(reportable);
      var sendNote = libraries.ISO.getISONoteBody(getExposureByReportable(reportable));
      var subject = displaykey.ISO.SentToISO;
      var note = getClaimByReportable(reportable).addNote(NoteTopicType.TC_INVESTIGATION, sendNote);
      note.Subject = subject;
    }, "su");    
  }
  
  
  private function sendErrorEmail(ex : Throwable){
    util.Email.sendMail(EmailRecipient, displaykey.Java.Error.ISO.EmailSubject(Environment.getInstance()), displaykey.Java.Error.ISO.EmailMessage(ex.Message));    
  }
  
  
  private function getClaimByReportable(argReportable : ISOReportable) : Claim {
    var isoClaim : Claim;
    if (argReportable typeis Claim) { 
      isoClaim = argReportable;
    } else if (argReportable typeis Exposure) {
      isoClaim = argReportable.Claim;
    }
    return isoClaim;
  }

 private function getExposureByReportable(argReportable : ISOReportable) : Exposure {
    var isoExposure : Exposure;
    if (argReportable typeis Claim) { 
      isoExposure = argReportable.Exposures.first();
    } else if (argReportable typeis Exposure) {
      isoExposure = argReportable;
    }
    return isoExposure;
  }  
}
