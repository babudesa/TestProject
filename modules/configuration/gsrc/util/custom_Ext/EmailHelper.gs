package util.custom_Ext

class EmailHelper {

  construct() {

  }

  /*3.14.14 - cmullin - Created this Helper class for Specialty E&S Development in order to send copies of
  * rule-generated emails to ECF. This functionality was added as an Enterprise requirement under
  * Defect 6604.
  * With help from Doug Dickerson and Naga Dasari, these functions were created to take the caller's pre-existing
  * sendEmailWithBody parameters and send a second, properly indexed email to ECF. The main difference between
  * the original sendEmailWithBody function and this function is that the initial "KeyableBean" parameter can not
  * be null and must now be a Claim entity.
  * These functions enhance the current email functionality by accepting multiple email address Strings
  * (which must be separated by commas) so that email can be sent to multiple recipients
  * (i.e. ScriptParameters.ClaimCenterDevEmail + ", test1@gaig.com, test2@gaig.com, test3@gaig.com").
  * All calls are passed through the first function, where an array is created, then the second function
  * is called to send the email.
  *
  * 6.16.14 - cmullin - Defects 6981/6976 - added code to send ClaimCenter DEV email to ECF DEV and all other
  * non-PROD test email (regardless of environment) to ECF CERT.
  */

  function sendEmailWithBodyEcf (claim : Claim, toEmailAddress : String, toName : String,
    fromEmailAddress : String, fromName : String, subject : String, body : String){

    var toEmailAddressArray : String[] = toEmailAddress.split(",")
    sendEmailWithBodyEcf(claim, toEmailAddressArray, toName, fromEmailAddress, fromName, subject, body)
  }


  function sendEmailWithBodyEcf (claim : Claim, toEmailAddressArray : String[], toName : String,
    fromEmailAddress : String, fromName : String, subject : String, body : String){

    var lob = getClaimOfficeCode(claim.LOBCode)
    var env = gw.api.system.server.ServerUtil.getEnv()
    var ecfIndexSubject = claim.ClaimNumber + ";Correspondence;Email Confirmation;" + subject + ";;;;" + lob + ";;;;Sent to File"
    var ecfToAddress : String

    if(env == "prod"){
      ecfToAddress = "claimdocument@gaig.com"
    }else if(env == "dev2" or env == "dev" or env == "dev3" or env == "dev4" or env == "dev5" or env == "dev6" or env == "dev7" or env == "dev8" or env == "dev9" or env == "local"){
      ecfToAddress = "claimdevdocument@gaig.com"
    }else if(env == "uat"){
      ecfToAddress = "claimuatdocument@gaig.com"
    }else{
      ecfToAddress = "claimtestdocument@gaig.com"
    }

    for (eachAddress in toEmailAddressArray){
      gw.api.email.EmailUtil.sendEmailWithBody(
	  null, eachAddress, toName, fromEmailAddress, fromName, subject, body)
    }

    gw.api.email.EmailUtil.sendEmailWithBody(
	null, ecfToAddress, "ECF", "ClaimCenterSupport@gaig.com", "ClaimCenterNotification", ecfIndexSubject, body)
  }


  /* 3/21/14 - cmullin - this function translates the ClaimCenter LOBCode (Division Name) into a Claim Office code which
  *  is readable (and displayable) in ECF.
  */
  function getClaimOfficeCode (lob : LOBCode) : String{
    var retStr = ""
    switch(lob){
      case "agriauto":
      case "agriliability":
      case "agriproperty":
      case "agrixsumbauto":
      case "agrixsumbliab":
	retStr = "AgriBusiness"
	break;
      case "commbonds":
	retStr = "Bond"
	break;
      case "excessliability":
      case "excessliabilityauto":
	retStr = "Excess Liability Claims"
	break;
      case "execliabdiv":
	retStr = "Executive Liability Division"
	break;
      case "profliabdiv":
	retStr = "Professional Liability Division"
	break;
      case "piminmarine":
	retStr = "Property & Inland Marine"
	break;
      case "specialtyes":
	retStr = "Great American Risk Solutions"
	break;
      case "envliab":
	retStr = "Environmental Division"
	break;
      case "omavalon":
        retStr = "Ocean Marine - Avalon"
        break;
      case "aviation":
        retStr = "Aviation"
        break; 
      case "mergacqu":
        retStr = "Mergers & Acquisitions"
        break;
      case "specialhumserv":
        retStr = "Specialty Human Services"
        break;
      case LOBCode.TC_SHSAUTO:
        retStr = "Specialty Human Services"
        break;
      case LOBCode.TC_ALTMARKETSAUTO:
        retStr = "Alternative Markets"
        break;
      case LOBCode.TC_TRUCKINGAUTO:
        retStr = "Trucking"
        break;    

      default:
	retStr = lob.DisplayName
    }
    return retStr
  }
}