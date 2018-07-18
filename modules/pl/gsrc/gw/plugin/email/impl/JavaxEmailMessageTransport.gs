package gw.plugin.email.impl

uses gw.api.email.AbstractEmailMessageTransport
uses gw.api.email.Email
uses java.lang.Throwable
uses java.lang.Exception
uses javax.activation.DataHandler
uses javax.mail.internet.MimeBodyPart
uses javax.mail.internet.InternetAddress
uses javax.mail.internet.MimeMessage
uses javax.mail.internet.MimeMultipart
uses javax.mail.MessagingException
uses javax.mail.Session
uses javax.mail.SendFailedException
uses javax.mail.Transport
uses java.net.ConnectException
uses java.net.UnknownHostException
uses java.util.Properties
uses java.util.Map
uses gw.util.Base64Util
uses gw.api.system.PLLoggerCategories


/** This is a fully exposed javax mail implementation so that packages like JavaMail-Crypto can
 * be used to sign documents.
 * 
 * The maintaining of the key ring is left as an exercise for the user.
 */
@Export
class JavaxEmailMessageTransport extends AbstractEmailMessageTransport {

  public static final var DEBUG_PARAM : String = "Debug"
  var debug = false
  construct() {
  }

  override function setParameters(params : Map) {
    super.setParameters(params);
    var work = params.get(DEBUG_PARAM) as String;
    if (work != null) {
      debug = work as boolean
    }
    PLLoggerCategories.CONFIG.info("Starting JavaXEmailMessageTransport with emailHost=${smtpHost} port=${smtpPort} debug=${debug} ")
  }
  
  override function handleGeneralException(message : Message, email : Email, exception : Throwable) {
    message.ErrorDescription = exception.Message
    message.reportError()
  }

  override function handleMessageException(message : Message, email : Email, exception : MessagingException) : boolean {
    var retry = false
    // If the problem is with an email address, extract them from the exception, log the error, remove them from the message, and send again
    if (exception typeis SendFailedException) {
      var rootCause = getRootCause(exception)
      if (rootCause != null &&
              (rootCause typeis UnknownHostException 
              || rootCause typeis ConnectException)) {
        handleErrorConnectingToMailServer(message, exception)
      } else {
        var invalidAddresses = exception.InvalidAddresses;
        if (invalidAddresses != null) {
          retry = handleInvalidAddresses(email, invalidAddresses)
        } else {
          message.ErrorDescription = exception.Message
          message.skip() // skip in this case, to avoid having all of the messages held up by one bad address
        }
      }
    } else {
      message.ErrorDescription = exception.Message
      message.reportError()
    }
    return retry
  }

  /**
   * Handles the case where the message could not be send due to problem connecting to email server
   * @param message Message to send
   * @param exception Exception occurred.  Its cause wolud be either UnknownHostException or ConnectionException
   */
  function handleErrorConnectingToMailServer(message : MessageBase, exception : MessagingException) {
    message.ErrorDescription = exception.Message
    message.reportError()
  }

  function getRootCause(me : Exception) : Exception {
    var e = me
    while (e typeis MessagingException) {
      e = e.NextException
    }
    return e;
  }

  /**
   * Template method to handle sending the email.  This method does not need to do exception handling
   * @param wkSmtpHost SMTP host name
   * @param wkSmtpPort SMTP host port number
   * @param email email object
   * @throws MessagingException Any exception occurred during the operation
   */
  protected override function createHtmlEmailAndSend(wkSmtpHost : String, wkSmtpPort : String, email : Email) {
     //Set the host smtp address
     var props = new Properties();
     props.put("mail.smtp.host", wkSmtpHost);
     props.put("mail.smtp.port", wkSmtpPort);

    // create some properties and get the default Session
    var session = Session.getDefaultInstance(props, null);
    session.setDebug(debug);

    var out = new MimeMessage(session);
    populateEmail(out, email)

    // encrypt or sign via your own plugin    
    // out = EncryptionManager.getEncryptionUtils(EncryptionManager.SMIME).signMessage(session, out, cryptoKey)
    
    Transport.send(out);
  }

  /** This will create the actual email documents for this email.  There are many reasons why there maybe different
   * versions of an email from the same information.  However, locale is not one of them, since the email information was
   * localized prior to being written to the message queue.  A good example is if the documents exceed some maximum email
   * size, it might be split into multiple emails.  Or your could generate one email for internal users and another for external
   * users.
   *
   * @param email the email payload to send
   * @return the email object that can be sent
   * @throws MessagingException if there are problems create the out email
   */
  protected function populateEmail(out : MimeMessage, email : Email) {
    var emailBody = new MimeMultipart()
    out.setContent(emailBody)

    addSender(out, email)
    addHeaders(out, email)
    addRecipients(out, email)
    out.setSubject(email.Subject, "UTF-8")
    addDocuments(emailBody, email)
    addBody(emailBody, email)
  }

  protected function addSender(out : MimeMessage, email : Email) {
    var address = ""
    var name = ""
    if (email.Sender != null) {
      address = email.Sender.EmailAddress
      name = email.Sender.Name
    } else {
      address = _defaultSenderEmail
      name = _defaultSenderName
    }
    out.setFrom(new InternetAddress(address, name, "UTF-8"))
   
    if (email.ReplyTo != null) {
      address = email.Sender.EmailAddress
      name = email.Sender.Name
    }
    out.setReplyTo({new InternetAddress(address, name, "UTF-8")})
  }

  protected function addHeaders(out : MimeMessage, email : Email) {
    for (header in email.Headers) {
      var value = encode(header.Second)
      out.addHeader(header.First, value)
      // PLLoggerCategories.CONFIG.debug("Adding header ${header.First}=\"${value}\"")
    }
  }
 
  // headers can only be ascii - 7
  protected function encode(str : String) : String {
    for (ch in str.toCharArray()) {
      if (ch < 32 || ch > 127) {
        return Base64Util.encode(str.Bytes)
      }
    }
    return str;
  }

  /** This will add reciepients to the mime multipart document, and return true if all addresses were internal.
   *
   * @param out the create multipart mime document
   * @param email the email payload extracting information from
   * @return true if all recipients where internal
   * @throws MessagingException if there are problems adding recipients
   */
  protected function addRecipients(out : MimeMessage, email : Email) {
    for (contact in email.ToRecipients) {
      var emailAddress = contact.EmailAddress
      out.addRecipient(MimeMessage.RecipientType.TO, new InternetAddress(emailAddress, contact.getName(), "UTF-8"))
    }
    for (contact in email.CcRecipients) {
      var emailAddress = contact.getEmailAddress();
      out.addRecipient(MimeMessage.RecipientType.CC, new InternetAddress(emailAddress, contact.getName(), "UTF-8"))
    }
    for (contact in email.BccRecipients) {
      var emailAddress = contact.getEmailAddress();
      out.addRecipient(MimeMessage.RecipientType.BCC, new InternetAddress(emailAddress, contact.getName(), "UTF-8"))
    }
  }
  
   protected function addBody(multipart : MimeMultipart, email : Email) {
    var msgHtml = new MimeBodyPart()
    multipart.addBodyPart(msgHtml)
    msgHtml.setContent(email.Body, "text/html;charset=UTF-8")    
    // PLLoggerCategories.CONFIG.debug("Adding body \"${email.Body}\"")
   }


  /** This will add the attached documents to the email multipart packet, it uses IDocumentContentSource to retrieve
   * a documents internal or external image based on the internalOnly flag.
   *
   * @param out the resulting mime multipart document
   * @param email the email to sent the xml email payload
   * @param internalOnly whether all email addresses where internal
   * @throws MessagingException if there were errors adding parts to the mime document
   */
  protected function addDocuments(multipart : MimeMultipart, email : Email) {
    if (!email.Documents.Empty) {
      for (var doc in email.Documents) {
        var fileName = doc.Name + getFileExtensionForDocument(doc)
        var mbp = new MimeBodyPart()
        multipart.addBodyPart(mbp)
        mbp.Disposition = javax.mail.Part.ATTACHMENT
        mbp.FileName = fileName
        mbp.Description = doc.Description
       // PLLoggerCategories.CONFIG.debug("Adding document \"${doc}\"")
        mbp.DataHandler = new DataHandler(new gw.api.email.AbstractEmailMessageTransport.DocumentContentsDataSource(doc, false))
      }
    }
  }

}
