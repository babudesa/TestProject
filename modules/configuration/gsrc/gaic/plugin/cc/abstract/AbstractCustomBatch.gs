package gaic.plugin.cc.abstract
uses gw.processes.BatchProcessBase
uses java.lang.Thread
uses java.lang.InterruptedException
uses java.lang.Exception
uses gw.api.util.Logger
uses com.gaic.claims.util.notification.MailNotification
uses java.io.StringWriter
uses java.io.PrintWriter
uses java.util.Properties
uses com.gaic.claims.env.Environment

abstract class AbstractCustomBatch extends BatchProcessBase {

  construct(_type:BatchProcessType) {
    super(_type);
  }
  
  /**
   * Like doWork is significantly better than doIt - it's not.
   * And it's helpful to keep the error handling generic, so we
   * don't repeat ourselves a bunch. Plus, you don't have to read 
   * all about custom batch processes, just implement this instead.
   */
  abstract public function doIt();

  override function doWork() {
    Logger.logInfo("Custom batch process started: "+Type);
    try {
      doIt();
    } catch (e:Exception) {
      var msg = "Fatal Exception in batch process "+Type;
      Logger.logError(msg, e);
      
      sendEmail("Fatal Exception in batch process "+Type, msg, e);
    }
    Logger.logInfo("Custom batch process finished: "+Type);
  }
  
  /**
   * Returns true if you need to abort. Also sends a message to the support box,
   * so you don't have to. It's best to be informed of when these things happen in prod.
   */
  public function checkIfINeedToStopAndSendNotify():boolean {
    if (TerminateRequested) {
      Logger.logInfo("Batch Process "+Type+" asked to terminate");
      
      sendEmail("Abort in batch process "+Type, "Batch process "+Type+" terminated early, all records may not have processed", null);
      
      return true;
    }
    return false;
  }
  
  /**
   * This is retarded, they're best practice is to override their own method to true.
   * Perhaps it should just default that way.
   * 
   * Anyway, true means you will check to see if you need to stop as frequentyly as possible, 
   * to help with things like server reboot. If you set it to false, it will still kill
   * your process eventually. Use the method above - checkIfINeedToStopAndSendNotify - to check.
   */
  override function requestTermination():boolean {
    super.requestTermination();
    return true; //true if it will be honored and you will check it
  }
  
  /**
   * Shared method for sleeping.
   */
  protected function sleep(milliseconds:long) {
    try {
      Thread.sleep(milliseconds); //let's not starve the system too much
    } catch (e:InterruptedException) {
      if (false) e.printStackTrace();
    }
  }
  
  /**
   * Shared method for notifications.
   */
  protected static function sendEmail(subject:String, msg:String, e:Exception) {
    try {
      var from = (java.lang.System.getProperty("gw.cc.env") == "prod" ? ScriptParameters.ClaimCenterProdEmail : ScriptParameters.ClaimCenterDevEmail);
      var to = from;
    
      if (e != null) {
        var sw = new StringWriter();
        e.printStackTrace(new PrintWriter(sw));
        msg = msg + "\r\n\r\n" + sw.toString();
      }
      
      var env = Environment.getInstance();
      subject = subject + " [" + env +"]";
    
      var props = new Properties();
      if (env == Environment.LOCAL) {
        props.setProperty(MailNotification.MAIL_HOST, "mgds.td.afg");
      } else {
        props.setProperty(MailNotification.MAIL_HOST, "localhost");
      }
    
      var mn = new MailNotification();
      mn.setProperties(props);
      mn.notifyFileAttachment(from, to, subject, msg, null);
    } catch (e2) {
      Logger.logError("Couldn't send email", e2);
    }
  }

}
