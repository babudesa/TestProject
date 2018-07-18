package util;

/*
Guidewire Class Utility

Purpose:  This class utility allows you to send an email using ClaimCenter's send email functionality 
via SMTP without having a Claim Object instantiated.  This function should only be called in the situations
where a Claim object is not available.

*/

uses com.guidewire.commons.util.StaticInt;
//uses com.guidewire.pl.system.dependency.ServerDependencies;
uses gw.plugin.email.HtmlEmail;
//uses com.guidewire.pl.system.server.config.PLParameterKeys;
uses javax.mail.*
uses javax.mail.internet.*
uses javax.activation.*

class Email
{
  construct()
  {
  }

  static function sendMail( recipient: String, subject : String, message : String ) 
  { 
    var smtpHost : String  = "localhost"; // ServerDependencies.getSystemConfiguration().getStringParameter(PLParameterKeys.SMTP_HOST);
    var smtpPort : int = 25; // ServerDependencies.getSystemConfiguration().getIntParameter(PLParameterKeys.SMTP_PORT);
    var fromEmail : String = "ClaimCenterSupport@gaig.com"; // ServerDependencies.getSystemConfiguration().getStringParameter(PLParameterKeys.EMAIL_MESSAGE_SINK_FROM_EMAIL_ADDRESS);
    var fromName : String = "ClaimCenter"; // ServerDependencies.getSystemConfiguration().getStringParameter(PLParameterKeys.EMAIL_MESSAGE_SINK_FROM_NAME);
    var email : HtmlEmail = new HtmlEmail(smtpHost, StaticInt.get(smtpPort).toString());
    //email.setFrom(fromName,fromEmail);
    email.setFrom( fromEmail, fromName)
    email.setSubject(subject);
    email.setHtmlMsg(message);
    email.addTo(recipient, recipient);
    email.send();
  }

  //overloaded to allow multiple recipients
  static function sendMail(recipients : String[], subject : String, message : String) {
    var smtpHost : String  = "localhost"; // ServerDependencies.getSystemConfiguration().getStringParameter(PLParameterKeys.SMTP_HOST);
    var smtpPort : int = 25; // ServerDependencies.getSystemConfiguration().getIntParameter(PLParameterKeys.SMTP_PORT);
    var fromEmail : String = "ClaimCenterSupport@gaig.com"; // ServerDependencies.getSystemConfiguration().getStringParameter(PLParameterKeys.EMAIL_MESSAGE_SINK_FROM_EMAIL_ADDRESS);
    var fromName : String = "ClaimCenter"; // ServerDependencies.getSystemConfiguration().getStringParameter(PLParameterKeys.EMAIL_MESSAGE_SINK_FROM_NAME);
    var email : HtmlEmail = new HtmlEmail(smtpHost, StaticInt.get(smtpPort).toString());
    email.setFrom( fromEmail, fromName)
    email.setSubject(subject);
    email.setHtmlMsg(message);
    for(recipient in recipients){
      email.addTo(recipient, recipient) 
    }
    email.send();    
  
  }
  
  static function sendMail(recipient : String, subject : String, message : String, 
                             attachmentPath : String, attachmentName : String, attachmentDesc : String){
    var smtpHost : String  = "localhost"; // ServerDependencies.getSystemConfiguration().getStringParameter(PLParameterKeys.SMTP_HOST);
    var smtpPort : int = 25; // ServerDependencies.getSystemConfiguration().getIntParameter(PLParameterKeys.SMTP_PORT);
    var fromEmail : String = "ClaimCenterSupport@gaig.com"; // ServerDependencies.getSystemConfiguration().getStringParameter(PLParameterKeys.EMAIL_MESSAGE_SINK_FROM_EMAIL_ADDRESS);
    var fromName : String = "ClaimCenter"; // ServerDependencies.getSystemConfiguration().getStringParameter(PLParameterKeys.EMAIL_MESSAGE_SINK_FROM_NAME);
    var email : HtmlEmail = new HtmlEmail(smtpHost, StaticInt.get(smtpPort).toString());
    email.setFrom( fromEmail, fromName)
    email.setSubject(subject);
    email.setHtmlMsg(message);
    email.addTo(recipient, recipient);
    var source : DataSource = new FileDataSource(attachmentPath)
    email.attach(source, attachmentName, attachmentDesc)
    email.send();    
  }
  
}

