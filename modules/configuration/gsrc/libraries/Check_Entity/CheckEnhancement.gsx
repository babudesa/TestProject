package libraries.Check_Entity
uses util.custom_Ext.EmailHelper

enhancement CheckEnhancement : entity.Check {
  
  public property set MailToRole(role : ContactRole){
    this.Claim.addRole(role, this.ex_MailTo)
  }
    
  public property get MailToRole() : ContactRole { 
      
    if(this.Claim.getClaimContact(this.ex_MailTo).Roles.Count != 0){
      return this.Claim.getClaimContact(this.ex_MailTo).Roles[0].Role
    }else{
      return null
    }    
  }
  
  
  function sendBackupWithholdingTaxLevyEmail(){
    var env:String = gw.api.system.server.ServerUtil.getEnv()

    if (!this.Bulked){
    var emailsubject = ""
    var environmentInformation : String = util.custom_Ext.finders.getEnvironment()
    if(this.PaymentMethod == "check"){
      if (exists(payee in this.Payees where payee.Payee.Ex_TaxStatusCode == "B") || exists(payee in this.Payees where payee.Payee.Ex_TaxStatusCode == "T")) {
        
        if (exists(payee in this.Payees where payee.Payee.Ex_TaxStatusCode == "B")) {
          emailsubject = "Backup Withholding Payment"
        }
        if (exists(payee in this.Payees where payee.Payee.Ex_TaxStatusCode == "T")) {
          emailsubject = "Tax Levy Payment"
        }
        var unitManagerName = util.GlobalParameters.ParameterFinder.getUserParameter("unitmanager", this.Claim.LossType) as java.lang.String
        var unitManagerEmail = util.GlobalParameters.ParameterFinder.getUserParameter("unitmanager", this.Claim.LossType).Contact.EmailAddress1
    
        var emailBody = templates.email.WithholdingReport.renderToString(this) 
        var emailHelper=new EmailHelper()   
        if(env == "prod"){
          emailHelper.sendEmailWithBodyEcf( this.Claim, ScriptParameters.BackupTax_EmailList+","+unitManagerEmail, ScriptParameters.BackupTax_Name+";"+unitManagerName, "ClaimCenter@GAIG.com", "ClaimCenter Notification", emailsubject, emailBody )
          //gw.api.email.EmailUtil.sendEmailWithBody( null, unitManagerEmail, unitManagerName, "ClaimCenter@GAIG.com", "ClaimCenter Notification", emailsubject, emailBody )
        }else {      
          emailHelper.sendEmailWithBodyEcf( this.Claim, ScriptParameters.ClaimCenterDevEmail, ScriptParameters.BackupTax_Name,"ClaimCenter@GAIG.com", environmentInformation, emailsubject, emailBody)      
        }
      }
    }
  }
  }
  
function sendLargeLossNotfication():void{
    
   var emailHelper=new EmailHelper()
    var body : String = templates.email.LargePayment.renderToString(this)
var environmentInformation : String = util.custom_Ext.finders.getEnvironment();
//var user1 = util.GlobalParameters.ParameterFinder.getUserParameter( "ccproperty", this.Claim.LossType )
//var user2 = util.GlobalParameters.ParameterFinder.getUserParameter( "ccliability", this.Claim.LossType )
//var user3 = util.GlobalParameters.ParameterFinder.getUserParameter( "ccauto", this.Claim.LossType )

if(this.CheckSet.PrimaryCheck.GrossAmountExt >= 500000 ) {
  if(gw.api.system.server.ServerUtil.getEnv() == "prod" and (this.Claim.LossType == "EQUINE" or this.Claim.LossType == "AGRIPROPERTY" or 
      this.Claim.LossType == "FIDCRIME" or this.Claim.LossType == "PIMINMARINE"  or this.Claim.LossType == typekey.LossType.TC_COMMBONDS)){
      emailHelper.sendEmailWithBodyEcf(this.Claim, 
        ScriptParameters.PropertyLgLossEmail+","+ScriptParameters.Divisional_Accounting_Email,
         ScriptParameters.PropertyLgLoss+";"+ScriptParameters.Divisional_Accounting_Name, 
        "ClaimCenterSupport@gaig.com", "Claim Center Notification", 
        "Large Payment Notification", body)
      //Send email to Divisional Accounting
     /* gw.api.email.EmailUtil.sendEmailWithBody(null, 
        ScriptParameters.Divisional_Accounting_Email, ScriptParameters.Divisional_Accounting_Name, 
        "ClaimCenterSupport@gaig.com", "Claim Center Notification", 
        "Large Payment Notification", body)*/
  }
  else if(gw.api.system.server.ServerUtil.getEnv() == "prod" and (this.Claim.LossType == "AGRIAUTO" or this.Claim.LossType == "AGRILIABILITY" 
      or this.Claim.LossType == "EXECLIABDIV" or this.Claim.LossType == "EXCESSLIABILITY" or this.Claim.LossType == "EXCESSLIABILITYAUTO" or this.Claim.LossType =="PROFLIABDIV" or this.Claim.LossType ==LossType.TC_SPECIALHUMSERV
      or this.Claim.LossType ==LossType.TC_ALTMARKETSAUTO or this.Claim.LossType ==LossType.TC_SHSAUTO or this.Claim.LossType ==LossType.TC_TRUCKINGAUTO)) {
      emailHelper.sendEmailWithBodyEcf(this.Claim, 
        ScriptParameters.LiabilityLgLossEmail+","+ScriptParameters.Divisional_Accounting_Email, 
        ScriptParameters.LiabilityLgLoss+";"+ ScriptParameters.Divisional_Accounting_Name, 
        "ClaimCenterSupport@gaig.com", "Claim Center Notification", 
        "Large Payment Notification", body)
      //Send email to Divisional Accounting
      /*gw.api.email.EmailUtil.sendEmailWithBody(null, 
        ScriptParameters.Divisional_Accounting_Email, ScriptParameters.Divisional_Accounting_Name, 
        "ClaimCenterSupport@gaig.com", "Claim Center Notification", 
        "Large Payment Notification", body)*/
  }
  else if(gw.api.system.server.ServerUtil.getEnv() == "prod" and (util.WCHelper.isWCorELLossType(this.Claim))) {
      emailHelper.sendEmailWithBodyEcf(this.Claim, 
        ScriptParameters.WCLgLossEmail+","+ScriptParameters.Divisional_Accounting_Email, 
        ScriptParameters.WCLgLoss+";"+ ScriptParameters.Divisional_Accounting_Name, 
        "ClaimCenterSupport@gaig.com", "Claim Center Notification", 
        "Large Payment Notification", body)
  }
  else{
    emailHelper.sendEmailWithBodyEcf(this.Claim, 
        ScriptParameters.ClaimCenterDevEmail, ScriptParameters.Equine_CorporateClaims_Name, 
        "ClaimCenterSupport@gaig.com", environmentInformation, 
        "Large Payment Notification", body) 
  }
  this.Claim.createCustomHistoryEvent( "DataChange", "Large Loss Notification email sent on check "+this.CheckSet.PrimaryCheck.CheckNumber )
  var stringNoteBody: String  = "Large Loss Notification Email for Check " + this.CheckSet.PrimaryCheck.CheckNumber + " in the amount of $" + gw.api.util.StringUtil.formatNumber(this.CheckSet.PrimaryCheck.GrossAmountExt, "#,##0.00" )  + " has been sent."
  var note = this.Claim.addNote( "check", stringNoteBody );
  note.Subject =  "Large Payment Notification"
}

  }
}


