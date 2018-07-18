package gw.processes
uses java.math.BigDecimal

uses java.util.Calendar
uses java.util.Date
uses java.util.Properties
uses java.io.File
uses java.io.PrintWriter

uses com.gaic.integration.cc.plugins.policy.PolicySearchPlugin
uses com.gaic.claims.env.Environment
//uses com.guidewire.cc.external.typelist.LossCause
uses gw.webservice.cc.claim.IClaimAPI
uses java.lang.Integer
uses com.gaic.integration.cc.plugins.policy.bulkload.ClaimsConversion
uses java.util.HashMap
uses gw.api.financials.CheckCreator
uses com.gaic.claims.dao.IClaimsConversionDAO
uses com.gaic.claims.dto.CCSTCheckBean
uses com.gaic.claims.dto.CCSTClaimContactBean
uses com.gaic.claims.dto.CCSTClaimBean
uses gw.webservice.cc.financials.IClaimFinancialsAPI
uses java.lang.System
uses com.gaic.claims.dto.CCSTIncidentBean
uses com.gaic.claims.dto.CCSTAddressBean
uses com.gaic.claims.dto.CCSTContactAddressBean
uses com.gaic.claims.dto.CCSTRecoveryBean
uses java.util.GregorianCalendar

uses java.io.FileNotFoundException
uses javax.mail.Message
uses javax.mail.Session
uses javax.mail.Transport
uses javax.mail.internet.InternetAddress
uses javax.mail.internet.MimeBodyPart
uses javax.mail.internet.MimeMessage
uses javax.mail.internet.MimeMultipart
uses javax.activation.DataHandler
uses javax.activation.FileDataSource
uses gw.transaction.Bundle
uses com.gaic.claims.dto.CCSTReserveBean
uses gw.api.util.DateUtil
uses gw.api.database.Query
uses gw.api.util.DateUtil
uses java.math.BigDecimal
uses java.lang.Exception
uses gw.webservice.cc.financials.IClaimFinancialsAPI
uses com.gaic.claims.dto.CCSTExposureBean

class ClaimsConvFeature extends BatchProcessBase {
  var env = Environment.getInstance()
  
  construct(batchProcessType : BatchProcessBase) {
    this(batchProcessType)
  }
  
  construct() {
    super(BatchProcessType.TC_CLAIMSCONVFEATURE)
    gw.api.util.Logger.logInfo("ClaimsConvFeature.gs called")
  }


  override function doWork() {
       // var env = Environment.getInstance()
	var PROPERTY_PATH = ""
	if (env == Environment.LOCAL) {
	  PROPERTY_PATH = "modules//configuration//gsrc//gw//webservice//cc//claim"
	}
	else {
	  PROPERTY_PATH = "//app//tomcat//tomcat-cccore//apache-tomcat-6.0.30//webapps//cc//modules//configuration//gsrc//gw//webservice//cc//claim//"
	}
	//var PROPERTY_FILE_NAME = "policyconversion.properties"
	//var PROPERTY_FILE_NAME_EXT = "EDWMessageTransportImpl.properties"
	var CC_STAGING_PROPERTIES = "CCStaging.properties"
	var EM_STAGING_PROPERTIES = "EDWMessageTransportImpl.properties"

	/**
	 * Start the batch process.
	 * 
	 */
	//var scriptParmQuery = gw.api.database.Query.make(ScriptParameter)
        //scriptParmQuery.compare("ParameterName", Equals, "PreventRptDateUpdate");
        //scriptParmQuery.compare("ParameterName", Equals, "PreventRptDateUpdate");
        //var scriptParmQueryResult = scriptParmQuery.select().FirstResult 
        //System.out.println("script parm" + scriptParmQueryResult)
	//get current date time with Date()
	var date = new Date()
	date.getTime()

	var cal = new GregorianCalendar()
        var month = cal.get(cal.MONTH) + 1
        var year = cal.get(cal.YEAR)
        var day = cal.get(cal.DAY_OF_MONTH)

        var monthStr = String.valueOf(month)
        if (month < 10) {
          monthStr = "0" + monthStr
        }
     
        var dayStr = String.valueOf(day)
        if (day < 10) {
           dayStr = "0" + dayStr
         }
        var convErrorFileName = ""

        if (env == Environment.PROD or env == Environment.UAT) {
           convErrorFileName = "ClaimsConvFeatErrors" + String.valueOf(year) + monthStr + dayStr + ".txt"
        }
        else {
           convErrorFileName = "ClaimsConvFeatErrors" + env + String.valueOf(year) + monthStr + dayStr + ".txt"
        }
        // var summaryUniqueIDFileName = "ELDSummaryUniqueID.txt"
        // var summaryUniqueIDFileNamePath = ""
        System.out.print(convErrorFileName)
      //var excelSumFileNameIncPath = "c:/work/ELDClaimsSummary"
      //var excelTranFileNameIncPath = "c:/work/ELDClaimsTrans"
      //var summaryUniqueIDFileNameIncPath = "c:/work/"
        var convErrorFileNameIncPath = ""
        if (env == Environment.LOCAL) {
          convErrorFileNameIncPath = "c:/work/ClaimsConvFeatErrors"
        }
        else
        if (env <> Environment.DEV3) {
           convErrorFileNameIncPath = "/app/tomcat/tomcat-cccore/apache-tomcat-6.0.30/temp/ClaimsConvFeatErrors"
        }
        else
        {
           convErrorFileNameIncPath = "/app/tomcat/tomcat-ccdev3/apache-tomcat-6.0.30/temp/ClaimsConvFeatErrors"
        }
        var errorFileNameFull = ""
        if (env == Environment.PROD or env == Environment.UAT) {
           errorFileNameFull = convErrorFileNameIncPath + String.valueOf(year) + monthStr + dayStr + ".txt"
        }
        else {
           errorFileNameFull = convErrorFileNameIncPath + env + String.valueOf(year) + monthStr + dayStr + ".txt"
        }
        var outputErrorFile = new File(errorFileNameFull)
        outputErrorFile.createNewFile();
        var pwError = new PrintWriter(outputErrorFile);
        pwError.println("Claim Nbr  Loss Date  Error")
	var clmConv = new ClaimsConversion()
	var daoFactoryCC = clmConv.getDAOFactory(PROPERTY_PATH, CC_STAGING_PROPERTIES)
	var daoFactoryEM = clmConv.getDAOFactory(PROPERTY_PATH, EM_STAGING_PROPERTIES)
	var propsCC  = clmConv.getPropertiesOnly(PROPERTY_PATH, CC_STAGING_PROPERTIES) 
        var propsEM  = clmConv.getPropertiesOnly(PROPERTY_PATH, EM_STAGING_PROPERTIES) 
	var _claimsDAO = daoFactoryCC.createClaimsConversionDAO()
	var _EDWMsgDAO = daoFactoryEM.createClaimsConversionDAO()
	var ccstClaim : List<CCSTClaimBean>

        ccstClaim = _claimsDAO.getCCST_Claims_Group(propsCC)

	var loadCommand : LoadCommand
	var loadCommandID = 0
	gw.transaction.Transaction.runWithNewBundle(\ bundleLoadCommand -> {
	    bundleLoadCommand.add(loadCommand)
	    loadCommand = new LoadCommand()
            var loadCommands = _claimsDAO.getCCST_LoadCommand(propsCC)
            for (loadCommandCCST in loadCommands) {
              loadCommand.CallingUser = User (loadCommandCCST.CallingUserID)
              loadCommand.CommandType = LoadCommandType.TC_SOURCELOADED
              loadCommand.Description = loadCommandCCST.Description
              loadCommand.StartTime = Date.CurrentDate
              loadCommand.ErrorCount = 0
              loadCommandID = loadCommandCCST.ID.intValue() + 1
            }  
        }, "conversionuser")
	//var loadCmdRec = new LoadCommand()
	//loadCmdRec.
	//var loadCmdQuery = gw.api.database.Query.make(entity.LoadCommand)
	//loadCmdQuery.compare("PublicID", Equals, "ccd2u1:1")
	//var loadCmdRec = loadCmdQuery.select().FirstResult
	//var loadCmdID = loadCmdRec.ID
	//print("loadcmdid: " + loadCmdID)
        var aClaim : Claim
        var failedClaimMap = new HashMap<String, CCSTClaimBean>()
        var claimNbr = 0
        var exposureMap = new HashMap<String, Exposure>()
	var expAssignMap = new  HashMap<String, CCSTExposureBean>()
	var groupNumber = 1
	var faultFlag = 0
	while (not ccstClaim.Empty and !this.TerminateRequested){
	  var _iter = ccstClaim.iterator()
	  OperationsExpected = ccstClaim.Count + claimNbr
	  while (_iter.hasNext()) {
	    var claimCCST = _iter.next()
	    //if (scriptParmQueryResult.VarcharValue <> "true") {
              //print("Script parm PreventRptDateUpdate value must be true; aborting....")
              //break }
	     if(!this.TerminateRequested){
	       claimNbr++
	       //if (claimNbr < 7) {  claimCCST.ClaimNumber == "486513845" or
	       //if  (claimCCST.ClaimNumber == "486513845" or claimCCST.ClaimNumber == "486512199") {
	       try {
                 exposureMap.clear()

                 expAssignMap.clear()
                 
	         System.out.println("Claim " + claimNbr + " of " + OperationsExpected)

                 gw.transaction.Transaction.runWithNewBundle(\ bundle -> {aClaim = processClaimAllRecs(claimCCST, propsCC, _claimsDAO, loadCommandID, exposureMap, expAssignMap)}, "conversionuser")
                
	        closeFeatures(aClaim, propsCC, _claimsDAO, expAssignMap)
	  	if (claimCCST.State == "closed") {
           	   System.out.println("Claim is being closed")

            	   updateClaimState(aClaim, claimCCST)
          	}
          	incrementOperationsCompleted()
	         //if (env == Environment.CERT or env == Environment.PROD) {
                   //gw.transaction.Transaction.runWithNewBundle(\ bundle -> {_claimsDAO.deleteAllFromStaging(claimCCST.ClaimNumber, propsCC)}, "conversionuser")
	         //}
	         faultFlag = 0
	       }  catch(e1) {
	         System.out.println(e1)
	         e1.printStackTrace()
	         pwError.println(claimCCST.ClaimNumber + " " + claimCCST.LossDate + " " + e1)
                 failedClaimMap.put(claimCCST.ClaimNumber, claimCCST)
                 incrementOperationsFailed()
                 faultFlag = 1
	      }
	      gw.transaction.Transaction.runWithNewBundle(\ bundle -> {updateClaimProcStatus(claimCCST, faultFlag as java.lang.String, groupNumber as java.lang.String, propsCC, _claimsDAO, bundle)}, "su")
	     //}
	    }
	    _iter.remove()
	  }
	  groupNumber++
          ccstClaim = _claimsDAO.getCCST_Claims_Group(propsCC)
	}
	gw.transaction.Transaction.runWithNewBundle(\ bundle -> {removeEDWMessageTrans(failedClaimMap, propsEM, _EDWMsgDAO)}, "su")
	gw.transaction.Transaction.runWithNewBundle(\ bundle -> {
		bundle.add(loadCommand)
		loadCommand.EndTime = java.util.Date.CurrentDate
	}, "su")
        gw.transaction.Transaction.runWithNewBundle(\ bundle -> {_claimsDAO.resetAllPrevGrpIDForFailedClms(propsCC)}, "su")
	try {
          pwError.flush();
	        
        //Close the Print Writer
          pwError.close();

        } catch (fe : FileNotFoundException) {
		fe.printStackTrace();
        }
     	var prop = System.getProperties();

        var mailpropsCC : Properties = new Properties()

        var ses1 = Session.getDefaultInstance(prop, null)
        var msg = new MimeMessage(ses1)
     	msg.setFrom(new InternetAddress("ClaimCenter@gaig.com"))

     	var to_address = DocumentConstants.TO

     	if (env == Environment.PROD) {
     	    to_address = "ClaimCenterSupport@gaig.com"
     	}
     	else
     	{
     	    to_address = "ClaimCenterTesting@gaig.com"
     	}

	msg.addRecipient(Message.RecipientType.TO, new InternetAddress(to_address));

	var messageBodyPart = new MimeBodyPart();
	print(env.toString())
        if (env <> Environment.PROD) {
	    msg.setSubject("Claims Conversion Error File " + env);
        }
        else
        {
            msg.setSubject("Claims Conversion Error File ")
        }
     	var multipart = new MimeMultipart()
     		
        messageBodyPart.setText("Attached you'll find a file containing all claim/loss date combinations that failed during the Claims Conversion run")

	multipart.addBodyPart(messageBodyPart)
	messageBodyPart = new MimeBodyPart()
	var dataHandler = new DataHandler(new FileDataSource(outputErrorFile))
	messageBodyPart.setDisposition(MimeBodyPart.ATTACHMENT)
	messageBodyPart.setFileName(convErrorFileName)
	messageBodyPart.setDataHandler(dataHandler)
	messageBodyPart.setHeader("Content-Type", "text/plain")
	multipart.addBodyPart(messageBodyPart)

	msg.setContent(multipart)
	msg.setSentDate(new java.util.Date())

	gw.api.util.Logger.logInfo("msg=" + msg)
	if (env <> Environment.LOCAL) {
	    Transport.send(msg)
	}
  }
  
public function processClaimAllRecs(claimCCST : CCSTClaimBean, propsCC : HashMap, _claimsDAO : IClaimsConversionDAO, loadCommandID : Integer, exposureMap : HashMap < String, Exposure >, expAssignMap : HashMap< String, CCSTExposureBean >) : Claim{
  	var policyID = ""
        var contactMap = new HashMap<String, Contact>() //The key will contain publicids for most contacts, but the roles for contacts from PSAR since publicids from 
		                                                //EDW don't match what the ETLs are setting at all.
        var claimContactMap = new HashMap<String, ClaimContact>()
        var addressMap = new HashMap<String, Address>()

	var claimQuery = gw.api.database.Query.make(Claim)
        claimQuery.compare("ClaimNumber", Equals, claimCCST.ClaimNumber);
        var aClaim = claimQuery.select().FirstResult        
        var policy = aClaim.Policy
        var claimContacts = policy.ClaimContactsForAllRoles
        for (claimContact in claimContacts) {
          var roles = claimContact.Roles
          for (role in roles) {
            claimContactMap.put(role.Role.Code, claimContact)
            contactMap.put(role.Role.Code, claimContact.Contact)
          }
        }
        if (aClaim.State == "closed") {
           System.out.println("Claim is being reopened")
       	   reopenClaim(aClaim)
      	}
        try {
	  callMigrateClaim(aClaim, policy, claimCCST, propsCC, _claimsDAO, contactMap, claimContactMap, addressMap, exposureMap, expAssignMap)
        }catch (e4) {
          throw (e4)
        }
	if (exposureMap <> null) {
	  try {
	    var rsvAmt = 0.0 
	    for (exposureRec in exposureMap.entrySet()) {
              var exposure = exposureRec.getValue()

	          try {
	            rsvAmt = buildOriginalReserve("claimcost", exposure, aClaim, _claimsDAO, propsCC)
	            buildChecks(aClaim, rsvAmt, propsCC, _claimsDAO, exposure, exposureMap, contactMap, claimContactMap, addressMap)
	            //buildCurrentReserve(aClaim, exposure, "claimcost", propsCC, _claimsDAO)
	          } catch (e5) {
      	            throw (e5)
	          }
	    }
	   } catch (e6) {
      	     throw (e6)
	  }
	  try {
	    buildRecoveries(aClaim, propsCC, _claimsDAO, exposureMap, contactMap, addressMap)
	  } catch (e7) {
	    throw (e7)
	  }
	}
	return aClaim
}

public function reopenClaim(aClaim : Claim) {
	          var claimAPI = new IClaimAPI()
	          try {
                      //aClaim.ClosedOutcome = claimCCST.ClosedOutcome
	              claimAPI.reopenClaim(aClaim.PublicID, "other", "Open")
	              aClaim.ReOpenDate =  Date.CurrentDate
                  } catch (e8) {
                    throw (e8)
                  }
}

public function updateClaimState(aClaim : Claim, claimCCST : CCSTClaimBean) {
               	var exposures = aClaim.Exposures
               	var expNbr = 0

                gw.transaction.Transaction.runWithNewBundle(\ bundle -> {
                  bundle.add(aClaim)
	          var claimAPI = new IClaimAPI()
	          try {
                      //aClaim.ClosedOutcome = claimCCST.ClosedOutcome
	              claimAPI.closeClaim(aClaim.PublicID, claimCCST.ClosedOutcome, "Closed")
	              aClaim.CloseDate = claimCCST.CloseDate
                  } catch (e8) {
                    throw (e8)
                  }
                }, "conversionuser")

}

public function closeFeatures(aClaim : Claim, propsCC : HashMap, _claimsDAO : IClaimsConversionDAO, expAssignMap : HashMap<String, CCSTExposureBean>) {
            var exposures = aClaim.Exposures
            var reserve : Reserve

            gw.transaction.Transaction.runWithNewBundle(\ bundle -> {

              var activities = aClaim.Activities
              var claimAPI = new IClaimAPI()
              for (activity in activities) {
                bundle.add(activity)
                var activityPublicID = activity.PublicID
                   
                if (activity.CloseDate == null && ((activity.Exposure == null and aClaim.ClosedOutcome <> null) or activity.Exposure.ClosedOutcome <> null )) {
                   claimAPI.completeActivity(activityPublicID)
                }
              }  
            }, "conversionuser")

  	    for (exposure in exposures) {

               gw.transaction.Transaction.runWithNewBundle(\ bundle -> {
               bundle.add(exposure)
                 if (expAssignMap.get(exposure.PublicID) <> null) {
                   var exposureCCST = expAssignMap.get(exposure.PublicID)
  	           var assignResult = exposure.assign(Group(exposureCCST.AssignedGroupID), User(exposureCCST.AssignedUserID))
  	           if (assignResult <> true) {
                     print("assignment failed for claim " + aClaim.ClaimNumber + " exposure " + exposure.PublicID)
                   }
                   if (exposure.ClosedOutcome <> null) {
                     // var availRsv = exposure.getAvailableReserves(CostType.TC_EXPENSE, CostCategory.TC_UNSPECIFIED)
                      //if (exposure.getAvailableReserves("claimcost", "unspecified") <> 0) {
                      //reserve = exposure.setAvailableReserves("claimcost", "unspecified", 0, submittingUser)

                      //reserve = exposure.setAvailableReserves("expense", "unspecified", 0, submittingUser)
                      //}
                      if (!exposure.Closed) {   
                        try {
                         var exposureAPI = new gw.api.webservice.cc.exposure.ExposureAPIImpl()
                         var closeDate = exposure.CloseDate
                         exposure.SSDIEligible = exposureCCST.MedicareExposureExt

                         exposureAPI.closeExposure(exposure.PublicID,    exposure.ClosedOutcome, "Legacy Claim Closed") 
                         exposure.MedicareExposureExt = exposureCCST.MedicareExposureExt  
                         exposure.CloseDate = closeDate

                         //exposure.close(ExposureClosedOutcomeType.TC_COMPLETED, "Legacy Claim Closed")
                        } catch (e9) {
                  		print("closed exposure")
                  		throw (e9)
                        }
                      }
                   }
                 }
               }, "conversionuser")
  	    }
}

public function updateClaimProcStatus(claimCCST : CCSTClaimBean, faultFlag : String, groupNumber : String, propsCC : HashMap, _claimsDAO : IClaimsConversionDAO, bundle : Bundle) {
  _claimsDAO.updateFaultFlagOnClaim(claimCCST.ClaimNumber, faultFlag, groupNumber, propsCC)
}

public function removeEDWMessageTrans(failedClaimMap : HashMap<String, CCSTClaimBean>,  propsEM : HashMap,_EDWMsgDAO : IClaimsConversionDAO) {
  	for (failedClaimKey in failedClaimMap.keySet()) {
           _EDWMsgDAO.deleteFromEDWMessageTransaction(failedClaimKey, propsEM)  
        }
}

public function buildChecks(aClaim : Claim, rsvAmt : BigDecimal, propsCC : HashMap, _claimsDAO : IClaimsConversionDAO, exposure : Exposure, exposureMap : HashMap<String, Exposure>, contactMap : HashMap<String, Contact>, claimContactMap : HashMap<String, ClaimContact>, addressMap : HashMap<String, Address>) {
  
	var checks = _claimsDAO.getCCST_Checks(aClaim.ClaimNumber, exposure.PublicID, propsCC)

	var ccCheck : CheckCreator
	var checkSet : CheckSet
	var payment : Payment
	var check:Check 
	var firstClaimCost = true
	var issueDate : Calendar
	var firstExpense = true
	var totRsvAmtRem : BigDecimal
	var _iter = checks.iterator()
	while (_iter.hasNext()) {
	     var checkCCST = _iter.next()
	     if(this.TerminateRequested){break}
	     
              if (checkCCST.CostType == "claimcost" and firstClaimCost) {
                 totRsvAmtRem = buildUpdatedReserve(checkCCST, exposure, aClaim, _claimsDAO, propsCC)
                 firstClaimCost = false
              }
              else if (checkCCST.CostType == "expense" and firstExpense){
                 totRsvAmtRem = buildUpdatedReserve(checkCCST, exposure, aClaim, _claimsDAO, propsCC)
                 firstExpense = false
              }

	      var keyType = "ClmContPublicID"
	      var payeeContact : Contact
	      var payeeClaimContactRole : ClaimContactRole
	      var payeeClaimContact = findClaimContact(aClaim, checkCCST.ClmContactCheckPayeeID, _claimsDAO, claimContactMap, propsCC)
              if (payeeClaimContact <> null) {
                payeeContact = payeeClaimContact.Contact
	        //var claimContactRoles = payeeClaimContact.Roles
	        //for (claimContactRole in claimContactRoles) {
	         //   payeeClaimContactRole = claimContactRole
	         //   claimContactRole.Exposure = exposure
	        //}      
              }
              else {
                var isPolicyRoleFound = checkPayeeType(checkCCST.PayeeType)
	        if (isPolicyRoleFound) {
	          payeeClaimContact = claimContactMap.get(checkCCST.PayeeType)
	          payeeContact = contactMap.get(checkCCST.PayeeType)
	          //payeeClaimContactRole = payeeClaimContact.Roles[0]
	        }
	        else {
	          payeeClaimContact = buildClaimContact(checkCCST.ClmContactCheckPayeeID, "", aClaim, propsCC, _claimsDAO, null, keyType, claimContactMap)

	          payeeContact = buildContact(checkCCST.ClmContactCheckPayeeID, "payee", aClaim, propsCC, _claimsDAO, null, keyType, contactMap, addressMap)
	          buildClaimContactRoles(checkCCST.ClmContactCheckPayeeID, null, payeeClaimContact, aClaim.ClaimNumber, aClaim.LoadCommandID, propsCC, _claimsDAO, keyType, aClaim, exposureMap, payeeContact, null)
	          payeeClaimContact.Contact = payeeContact
	          payeeClaimContactRole.Contact = payeeContact
	          claimContactMap.put(payeeClaimContact.PublicID, payeeClaimContact)
	        }
              }
	      //payeeClaimContactRole.ClaimContact = payeeClaimContact
       	      var recipientContact = buildContact(checkCCST.Ex_MailTo, "", aClaim, propsCC, _claimsDAO, null, "ContPublicID", contactMap, addressMap)
                         
              var erodesReserves = true
              //if (checkCCST.DoesNotErodeReserves) {
              //  erodesReserves = false
              //}
              //else
              //{
              //  erodesReserves = true
              //}
              //var paymentType = ""
              //if (checkCCST.PaymentType == "final") {
              //  paymentType = "partial"
              //}
              //else {
              //  paymentType = "supplement"
              //}
              
	      ccCheck  = exposure.CheckCreator.withPayTo(checkCCST.PayTo).
	       		 withReportabilityType(checkCCST.Reportability).
			 withCheckAmount(checkCCST.TransactionAmount).
			 withPayee(payeeContact).
			 withCostType(checkCCST.CostType).
			 withCostCategory(checkCCST.CostCategory).
			 withCheckCurrency(checkCCST.Currency).
			 withLineCategory(checkCCST.LineCategory).
			 withPaymentType("partial").
			 withPayeeRole(payeeClaimContactRole.Role).
			 withMailToAddress(buildAddress(checkCCST.MailToAddress,  propsCC, _claimsDAO, aClaim, addressMap)).
			 withErodesReserves(erodesReserves).
			 withRecipient(recipientContact)
			 //withRequestingUser(User( "default_data:1" /* Super User */ )) -- transactionSetCCST.RequestingUser
     	      try {
	        check = ccCheck.create()
	      } catch (e1) {
	        throw (e1)
	      }
	      check.PaymentMethod = checkCCST.PaymentMethod
	      check.CheckNumber = checkCCST.CheckNumber
	      check.CheckCategoryExt = checkCCST.CheckCategoryExt
	      check.BankAccount = checkCCST.BankAccount
	      check.IssuedPayeeTypesExt = checkCCST.IssuedPayeeTypesExt
	      check.IssuedPayeesExt = checkCCST.IssuedPayeesExt
	      check.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
	      check.ClaimContact = claimContactMap.get(checkCCST.ClaimContactID)
	      check.ScheduledSendDate = checkCCST.Ex_DatePrinted
	      var checkPayee : CheckPayee
	      for (payee in check.Payees) {
	        checkPayee = payee
	      }
	      //checkPayee.ClaimContact = payeeClaimContact
	      checkPayee.Payee = payeeContact
	      checkPayee.IsOriginalPayeeExt = checkCCST.IsOriginalPayeeExt
	      checkPayee.PayeeDateAddedExt = checkCCST.PayeeDateAddedExt
	      checkPayee.PayeeType = checkCCST.PayeeType
	      checkPayee.PayeeDenorm = payeeContact
	      checkPayee.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
	      check.Payees = new CheckPayee[]{checkPayee}
	      check.CheckBatching = checkCCST.CheckBatching
	      check.CheckInstructions = checkCCST.CheckInstructions
	      check.CheckType = checkCCST.CheckType
	      check.Comments = checkCCST.Comments
	      check.DeliveryMethod = checkCCST.DeliveryMethod
	      check.EnteredTime = checkCCST.EnteredTime
	      check.EscheatStatusExt = checkCCST.EscheatStatusExt
	      check.IssueDate = checkCCST.IssueDate
	      check.IssuedClaimantExt = checkCCST.IssuedClaimantExt
	      check.IssuedPayToAddressExt = checkCCST.IssuedPayToAddressExt
	      check.IssuedPayToExt = checkCCST.IssuedPayToExt
	      check.IssuedPayeeTypesExt = checkCCST.IssuedPayeeTypesExt
	      check.MailTo = checkCCST.MailTo
	      check.Memo = checkCCST.Memo
	      check.PayTo = checkCCST.PayTo
	      check.PaymentMethod = checkCCST.PaymentMethod 
	      //check.PaymentMethod = PaymentMethod.TC_CHECK // it processed with this, but that isn't what we want
	      check.PayToLine1Ext = checkCCST.PayToLine1Ext
	      check.PrefixExt = checkCCST.PrefixExt
	      check.Reportability = checkCCST.Reportability
	      issueDate = Calendar.getInstance()
	      issueDate.setTime(checkCCST.IssueDate)
	      //check.updateCheckStatus(check.CheckNumber, issueDate, "issued")
	      check.TypeOfCheckExt = checkCCST.TypeOfCheckExt
	      check.UpdateCheckHistoryExt = checkCCST.UpdateCheckHistoryExt
	      check.ex_DateEndorsed = checkCCST.Ex_DateEndorsed
	      check.ex_DatePrinted = checkCCST.Ex_DatePrinted
	      check.ex_DraftRegion = checkCCST.Ex_DraftRegion
	      check.ex_MailTo = buildContact(checkCCST.Ex_MailTo, "", aClaim, propsCC, _claimsDAO, null, "ContPublicID", contactMap, addressMap)
	      check.MailToAddress = checkCCST.MailToAddress
	      check.ex_MailToAddress = buildAddress(checkCCST.Ex_MailToAddress,  propsCC, _claimsDAO, aClaim, addressMap)
	      check.ex_ManualPaymentMethod = checkCCST.Ex_ManualPaymentMethod
	      check.ex_PayToAddress = buildAddress(checkCCST.Ex_PayToAddress,  propsCC, _claimsDAO, aClaim, addressMap)
	      check.ex_ProducerCopy = checkCCST.Ex_ProducerCopy
	      //check.Status = checkCCST.Status
	      //check.Status = "issued"
	      //check.Status = TransactionStatus.TC_AWAITINGSUBMISSION // it processed ok with this, but again now what we want
	      checkPayee.Check = check

	      checkSet = check.CheckSet
              checkSet.ApprovalStatus = checkCCST.ApprovalStatus
	      checkSet.ApprovalDate = checkCCST.ApprovalDate
	      //aClaim.ExaminationDate = checkSet.ApprovalDate
	      checkSet.RequestingUser = User (checkCCST.RequestingUserID)
	      checkSet.setFieldValue("LoadCommandID", aClaim.LoadCommandID)

	     // var transDate = "1900-01-01 01:01:01.000" as java.util.Date
	     // var transIt = exposure.getTransactionsIterator(false)
	     // while (transIt.hasNext()) {
	     //   var trans = transIt.next() as Transaction
	     //   if (trans.RptCreateDateExt > transDate and trans.Subtype == "payment") {
	     //     payment = trans as Payment
	      //  }
	      //}	      

             //var paymentsIt = exposure.getPaymentsIterator(false)
	      //var currBundle = gw.transaction.Transaction.getCurrent()
	      //payment = currBundle.getInsertedBeansOfType(entity.Payment).last()
	     // var payments = currBundle.getInsertedBeansOfType(entity.Payment).iterator()
	     //var pymtDate = "1900-01-01 01:01:01.000" as java.util.Date
	     //if (paymentsIt <> null) {
               // while (paymentsIt.hasNext()) {
                 // var pymt = paymentsIt.next() as Transaction
                  //if (pymt.RptCreateDateExt == null && pymt typeis Payment) {
                    //payment = pymt
                   // pymtDate = pymt.RptCreateDateExt
                  //}
                //}
                payment = check.Payments.first()
              // gw.transaction.Transaction.runWithNewBundle(\ bundleReserve -> {
		//bundleReserve.add(payment)
                payment.AccountingMonthExt = checkCCST.AccountingMonthExt
    	        payment.AccountingYearExt = checkCCST.AccountingYearExt
	        payment.Claim = aClaim
	        payment.CloseClaim = checkCCST.CloseClaim
	        payment.CloseExposure = checkCCST.CloseExposure
	        payment.DeductiblePaid = checkCCST.DeductiblePaid
	        payment.DeductibleSubtracted = checkCCST.DeductibleSubtracted
	        payment.ErodesReserves = true
	        payment.RptCreateDateExt = checkCCST.RptCreateDateExt
  	        //payment.Status = checkCCST.StatusTran //it processed ok without this, but I'm not sure about not having this set
  	        payment.SubmitDate = checkCCST.SubmitDate
	        payment.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
	        //payment.Claim.ExaminationDate = checkSet.ApprovalDate
	        
	        var transLineItem = payment.FirstLineItem
	        transLineItem.IRS1099BoxNumberExt = checkCCST.IRS1099BoxNumberExt
	        transLineItem.LineCategory = checkCCST.LineCategory
                transLineItem.VendorDescriptionExt = checkCCST.VendorDescriptionExt
	        transLineItem.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
	        transLineItem.Comments = checkCCST.Comments
	        transLineItem.GrossAmountExt = checkCCST.GrossAmountExt
	        //payment.addToLineItems(transLineItem)
	        //})
	    // }
              try {

	    //    System.out.println("Before call to add Financials for transactions");
	        var claimFinancialsAPI = new IClaimFinancialsAPI()
	        claimFinancialsAPI.addClaimFinancialsWithValidation(check.CheckSet, false)
	        //if (checkCCST.Status == "cleared") {
	        if (checkCCST.Status == "cleared") {
	          var checkQuery = gw.api.database.Query.make(entity.Check)
		  checkQuery.compare("CheckNumber", Equals, check.CheckNumber)
                  var checkQueryResult = checkQuery.select()
                  for (checkOcc in checkQueryResult) {
                    if (checkOcc.Claim == aClaim) {
                      claimFinancialsAPI.updateCheckStatus(checkOcc.PublicID, null, null, TransactionStatus.TC_CLEARED, null)
                      break
                    }
                  }
	        }

                //if (tsar.getValidationErrors().length > 0) {
		//  print("after call to add Financials; result: " + tsar.getValidationErrors()[0]);
	       // }
	        totRsvAmtRem = totRsvAmtRem - checkCCST.TransactionAmount
	        //if (!erodesReserves) {
                //  buildCurrentReserve(aClaim, exposure, checkCCST.CostType, propsCC, _claimsDAO, totRsvAmtRem)
	        //}
	      } catch (e2) {
	        throw (e2)
	      }
	      _iter.remove()
	    }
	    if (firstClaimCost) {
	      var found = buildCurrentReserve(aClaim, exposure, "claimcost", propsCC, _claimsDAO, rsvAmt)
	      if (!found and exposure.ClosedOutcome <> null) {
	        buildClosingReserve(aClaim, exposure, "claimcost", propsCC, _claimsDAO, rsvAmt)
	      }
	    }


}

public function buildRecoveries(aClaim : Claim, propsCC : HashMap, _claimsDAO : IClaimsConversionDAO, exposureMap : HashMap<String, Exposure>, contactMap : HashMap<String, Contact>, addressMap : HashMap<String, Address>) {
  var recoveryRsvMap = new HashMap<String, RecoveryReserve>()
  var recoveries = _claimsDAO.getCCST_Recovery(aClaim.ClaimNumber, propsCC)
  var recovery : Recovery
  var recoveryReserve : RecoveryReserve
  for (recoveryCCST in recoveries) {
      var exposure = exposureMap.get(recoveryCCST.ExposureID)
      if (recoveryCCST.Subtype == "RecoveryReserve") {
        recoveryReserve = exposure.setOpenRecoveryReserves(recoveryCCST.CostType, recoveryCCST.CostCategory, recoveryCCST.RecoveryCategory, recoveryCCST.TransactionAmount, User (recoveryCCST.RequestingUserID))
        recoveryReserve.AccountingMonthExt = recoveryCCST.AccountingMonthExt
        recoveryReserve.AccountingYearExt = recoveryCCST.AccountingYearExt
        recoveryReserve.RptCreateDateExt = recoveryCCST.RptCreateDateExt
        recoveryReserve.Status = recoveryCCST.StatusTran
        recoveryReserve.SubmitDate = recoveryCCST.SubmitDate
        recoveryReserve.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
        //recoveryReserve.PublicID = recoveryCCST.PublicIDTran
        var recRsvTrans = recoveryReserve.TransactionSet.Transactions
        for (recoveryReserveTrans in recRsvTrans) {
          if (recoveryReserveTrans typeis RecoveryReserve) {
            recoveryReserveTrans.AccountingMonthExt = recoveryCCST.AccountingMonthExt
            recoveryReserveTrans.AccountingYearExt = recoveryCCST.AccountingYearExt
            recoveryReserveTrans.RptCreateDateExt = recoveryCCST.RptCreateDateExt
            recoveryReserveTrans.Status = recoveryCCST.StatusTran
            recoveryReserveTrans.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
          }  
        }  
        recoveryReserve.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
        var transLineItems : TransactionLineItem[]
        transLineItems = recoveryReserve.TransactionSet.LineItems
        //var currBundle = gw.transaction.Transaction.getCurrent()

	//transLineItem = currBundle.getInsertedBeansOfType(entity.TransactionLineItem).last()
	for (transLineItem in transLineItems) {
          transLineItem.IRS1099BoxNumberExt = recoveryCCST.IRS1099BoxNumberExt
          transLineItem.LineCategory = recoveryCCST.LineCategory
          transLineItem.VendorDescriptionExt = recoveryCCST.VendorDescriptionExt
          transLineItem.TransactionQualifierExt = recoveryCCST.TransactionQualifierExt
          transLineItem.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
          transLineItem.Comments = recoveryCCST.Comments
	}

        var transSet : TransactionSet
        transSet = recoveryReserve.TransactionSet
        transSet.ApprovalDate = recoveryCCST.ApprovalDate
        transSet.ApprovalStatus = recoveryCCST.ApprovalStatus
        transSet.Claim = aClaim        
        transSet.setFieldValue("LoadCommandID", aClaim.LoadCommandID)

        //gw.transaction.Transaction.runWithNewBundle(\ bundleRecToRecRsv -> {
	  //bundleRecToRecRsv.add(recToRecReserve)
	recoveryRsvMap.put(recoveryCCST.PublicIDTran, recoveryReserve)

        //}, "su")
        try {
	//    System.out.println("Before call to add Financials for transactions");
	    var claimFinancialsAPI = new IClaimFinancialsAPI()
	    var tsar = claimFinancialsAPI.addClaimFinancialsWithValidation(transSet, false)
		
	    if (tsar.getValidationErrors().length > 0) {
		System.out.println("after call to add Financials; result: " + tsar.getValidationErrors()[0]);
	    }
	} catch (e1) {
	    e1.printStackTrace();
	    throw(e1)
	}
      }
      else {
        var payer = buildContact(recoveryCCST.ClaimContactID, "payer", aClaim, propsCC, _claimsDAO, null, "ClmContPublicID", contactMap, addressMap)

        recovery = exposure.createRecovery(payer, recoveryCCST.CostType, recoveryCCST.CostCategory, recoveryCCST.RecoveryCategory, recoveryCCST.LineCategory, recoveryCCST.TransactionAmount, recoveryCCST.Comments, User (recoveryCCST.RequestingUserID))
        recovery.AccountingMonthExt = recoveryCCST.AccountingMonthExt
        recovery.AccountingYearExt = recoveryCCST.AccountingYearExt
        //recovery.PublicID = recoveryCCST.PublicIDTran
        recovery.RptCreateDateExt = recoveryCCST.RptCreateDateExt
        recovery.Status = recoveryCCST.StatusTran
        recovery.ex_recoverycheckdate = recoveryCCST.Ex_recoverycheckdate
        recovery.ex_recoveryCheckNumber = recoveryCCST.Ex_recoveryCheckNumber
        recovery.ex_CashReceiptNumber = recoveryCCST.Ex_CashReceiptNumber
        recovery.SubmitDate = recoveryCCST.SubmitDate
        recovery.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
        recovery.RecodeExt = false
        var recTrans = recovery.TransactionSet.Transactions
        for (recoveryTrans in recTrans) {
          if (recoveryTrans typeis RecoveryReserve) {
            recoveryTrans.AccountingMonthExt = recoveryCCST.AccountingMonthExt
            recoveryTrans.AccountingYearExt = recoveryCCST.AccountingYearExt
            recoveryTrans.RptCreateDateExt = recoveryCCST.RptCreateDateExt
            recoveryTrans.Status = recoveryCCST.StatusTran
            recoveryTrans.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
          }  
        }  
        var transLineItems : TransactionLineItem[]
        transLineItems = recovery.TransactionSet.LineItems
        //var currBundle = gw.transaction.Transaction.getCurrent()

	//transLineItem = currBundle.getInsertedBeansOfType(entity.TransactionLineItem).last()
	for (transLineItem in transLineItems) {
          transLineItem.IRS1099BoxNumberExt = recoveryCCST.IRS1099BoxNumberExt
          transLineItem.LineCategory = recoveryCCST.LineCategory
          transLineItem.VendorDescriptionExt = recoveryCCST.VendorDescriptionExt
          transLineItem.TransactionQualifierExt = recoveryCCST.TransactionQualifierExt
          transLineItem.PublicID = recoveryCCST.PublicIDTranLnItem
          transLineItem.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
          transLineItem.Comments = recoveryCCST.Comments
	}
        var transSet : TransactionSet
        transSet = recovery.TransactionSet
        transSet.ApprovalDate = recoveryCCST.ApprovalDate
        transSet.ApprovalStatus = recoveryCCST.ApprovalStatus
        transSet.Claim = aClaim        
        transSet.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
        var recToRecReserve : RecToRecReserves
        recToRecReserve = new RecToRecReserves()
        recToRecReserve.ForeignEntity = recoveryRsvMap.get(recoveryCCST.ForeignEntityID)
        recToRecReserve.Owner = recovery
        recToRecReserve.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
        try {
	//    System.out.println("Before call to add Financials for transactions");
	    var claimFinancialsAPI = new IClaimFinancialsAPI()
	    var tsar = claimFinancialsAPI.addClaimFinancialsWithValidation(transSet, false)
		
	    if (tsar.getValidationErrors().length > 0) {
		print("after call to add Financials; result: " + tsar.getValidationErrors()[0]);
	    }
	} catch (e1) {
	    e1.printStackTrace();
	    throw(e1)
	}
      }

  }
  
}

public function checkPayeeType(payeeType : String) :  boolean {

  if (payeeType == "insured"or payeeType == "underwriter") {
    return true
  }
  else {
    return false
  }
}

public function buildCurrentReserve(aClaim : Claim, exposure : Exposure, costType : String, propsCC : HashMap, _claimsDAO : IClaimsConversionDAO, rsvAmt : BigDecimal) : boolean {
        var reserves : List<CCSTReserveBean>
        reserves = _claimsDAO.getCurrent_Reserve(aClaim.ClaimNumber, propsCC, exposure.PublicID, costType)
        var found = false	
  	//var reserveSet : ReserveSet
  	var reserve : Reserve
  	for (reserveCCST in reserves) {
  	    found = true

  	    var submittingUser : User
  	    if (reserveCCST.RequestingUserID == null) {
  	      submittingUser = User ("user:50010")
  	    }
  	    else {
  	      submittingUser = User (reserveCCST.RequestingUserID)
  	    }
  	    //  for(reserve in (transactionSet as ReserveSet).Reserves){
              //  if(gw.api.web.Scopes.Request["AutoRes"] as boolean==true){
                //}
  	     // }

  	    if (costType == "claimcost" and rsvAmt <> reserveCCST.TransactionAmount) {
  	      reserve = exposure.setAvailableReserves(costType, reserveCCST.CostCategory, reserveCCST.TransactionAmount, submittingUser)
  	    }
            //var reservesIt = exposure.getReservesIterator(false)
            //print("reservesIt " + reservesIt.hasNext())
            //var rsvDate : Date
            //rsvDate = "1900-01-01 01:01:01.000" as java.util.Date
            //while (reservesIt.hasNext()) {
            //  var rsv = reservesIt.next() as Reserve
            //  print("reserve at 519: " + rsv)
            //  if (rsv.RptCreateDateExt > rsvDate) {
            //    print("reserve " + rsv)
            //    reserve = rsv
            //    rsvDate = rsv.RptCreateDateExt
            //  }
            //}
            //gw.transaction.Transaction.runWithNewBundle(\ bundleReserve -> {
		//    bundleReserve.add(reserve)
            if (reserve <> null) {
              reserve.AccountingMonthExt = reserveCCST.AccountingMonthExt
              reserve.AccountingYearExt = reserveCCST.AccountingYearExt
              reserve.Status = reserveCCST.StatusTran
              reserve.SubmitDate = reserveCCST.SubmitDate
              reserve.RptCreateDateExt.Time = reserveCCST.RptCreateDateExt.Time  + 1 
              reserve.Comments = reserveCCST.Comments
              reserve.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
              //var rsvLines = exposure.ReserveLines
  	      //for (rsvLine in rsvLines) {
  	       // rsvLine.
  	      //}
              //})
              var reserveSet = reserve.TransactionSet as ReserveSet
              reserveSet.RequestingUser = User ( reserveCCST.RequestingUserID )
              reserveSet.ApprovalDate = reserveCCST.ApprovalDate
              reserveSet.ApprovalStatus = reserveCCST.ApprovalStatus
              reserveSet.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
              try {
	        var claimFinancialsAPI = new IClaimFinancialsAPI()
	        claimFinancialsAPI.addClaimFinancials(reserveSet)
			
	      //if (tsar.getValidationErrors().length > 0) {
		//System.out.println("after call to add Financials; result: " + tsar.getValidationErrors()[0]);
	      //}
	      } catch (e1) {
	        e1.printStackTrace();
	        throw(e1)
	      }
            }
  	  }
  	  return found
}


public function buildClosingReserve(aClaim : Claim, exposure : Exposure, costType : String, propsCC : HashMap, _claimsDAO : IClaimsConversionDAO, rsvAmt : BigDecimal) {
        var reserves : List<CCSTReserveBean>
        var reserveType = "closing"
        reserves = _claimsDAO.getClosing_Reserve(aClaim.ClaimNumber, propsCC, exposure.PublicID, costType)
        if (reserves == null) {
          reserves = _claimsDAO.getOriginal_Reserve(aClaim.ClaimNumber, propsCC, exposure.PublicID, costType)
          reserveType = "original"
        }
	
  	//var reserveSet : ReserveSet
  	var reserve : Reserve
  	for (reserveCCST in reserves) {
  	    reserveCCST.TransactionAmount = 0

  	    var submittingUser : User
  	    if (reserveCCST.RequestingUserID == null) {
  	      submittingUser = User ("user:50010")
  	    }
  	    else {
  	      submittingUser = User (reserveCCST.RequestingUserID)
  	    }
  	    //  for(reserve in (transactionSet as ReserveSet).Reserves){
              //  if(gw.api.web.Scopes.Request["AutoRes"] as boolean==true){
                //}
  	     // }

  	    if (costType == "claimcost" and rsvAmt <> reserveCCST.TransactionAmount) {
  	      reserve = exposure.setAvailableReserves(costType, reserveCCST.CostCategory, reserveCCST.TransactionAmount, submittingUser)
  	    }
            //var reservesIt = exposure.getReservesIterator(false)
            //print("reservesIt " + reservesIt.hasNext())
            //var rsvDate : Date
            //rsvDate = "1900-01-01 01:01:01.000" as java.util.Date
            //while (reservesIt.hasNext()) {
            //  var rsv = reservesIt.next() as Reserve
            //  print("reserve at 519: " + rsv)
            //  if (rsv.RptCreateDateExt > rsvDate) {
            //    print("reserve " + rsv)
            //    reserve = rsv
            //    rsvDate = rsv.RptCreateDateExt
            //  }
            //}
            //gw.transaction.Transaction.runWithNewBundle(\ bundleReserve -> {
		//    bundleReserve.add(reserve)
            if (reserve <> null) {
              reserve.AccountingMonthExt = reserveCCST.AccountingMonthExt
              reserve.AccountingYearExt = reserveCCST.AccountingYearExt
              reserve.Status = reserveCCST.StatusTran
              reserve.SubmitDate = reserveCCST.SubmitDate
              if (reserveType == "closing") {
                reserve.RptCreateDateExt.Time = reserveCCST.RptCreateDateExt.Time  + 1 
              }
              else {
                reserve.RptCreateDateExt = exposure.CloseDate
              }
              reserve.Comments = reserveCCST.Comments
              reserve.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
              //var rsvLines = exposure.ReserveLines
  	      //for (rsvLine in rsvLines) {
  	       // rsvLine.
  	      //}
              //})
              var reserveSet = reserve.TransactionSet as ReserveSet
              reserveSet.RequestingUser = User ( reserveCCST.RequestingUserID )
              reserveSet.ApprovalDate = reserveCCST.ApprovalDate
              reserveSet.ApprovalStatus = reserveCCST.ApprovalStatus
              reserveSet.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
              try {
	        var claimFinancialsAPI = new IClaimFinancialsAPI()
	        claimFinancialsAPI.addClaimFinancials(reserveSet)
			
	      //if (tsar.getValidationErrors().length > 0) {
		//System.out.println("after call to add Financials; result: " + tsar.getValidationErrors()[0]);
	      //}
	      } catch (e1) {
	        e1.printStackTrace();
	      }
            }
  	  }
}

 // private function accountForReserve(reserve : Reserve) {
 //   if (reserve.TransactionSet.Approved) {
 //     if (reserve.isInitialReserve()) {
 //       Metric.InitialReserve = Metric.InitialReserve.add(reserve.Amount)
 //     } else {
 //       Metric.TotalReserveChange = (GosuObjectUtil.defaultIfNull(Metric.TotalReserveChange, BigDecimal.ZERO) as BigDecimal).add(reserve.Amount)
 //     }
 //   }
 // }

public function buildOriginalReserve(costType : String, exposure : Exposure, aClaim : Claim, _claimsDAO : IClaimsConversionDAO, propsCC : HashMap) : BigDecimal {
          var reserves = _claimsDAO.getOriginal_Reserve(aClaim.ClaimNumber, propsCC, exposure.PublicID, costType)
          var reserve : Reserve
          for (reserveCCST in reserves) {
    	    var submittingUser : User
  	    if (reserveCCST.RequestingUserID == null) {
  	      submittingUser = User ("user:50010")
  	    }
  	    else {
  	      submittingUser = User (reserveCCST.RequestingUserID)
  	      if (submittingUser == null) {
  	        submittingUser = User ("user:50010")
  	      }
  	    }
   	    //  for(reserve in (transactionSet as ReserveSet).Reserves){
              //  if(gw.api.web.Scopes.Request["AutoRes"] as boolean==true){
                //}
  	     // }

  	    reserve = exposure.setAvailableReserves(reserveCCST.CostType, reserveCCST.CostCategory, reserveCCST.TransactionAmount, submittingUser)

            //var reservesIt = exposure.getReservesIterator(false)
            //print("reservesIt " + reservesIt.hasNext())
            //var rsvDate : Date
            //rsvDate = "1900-01-01 01:01:01.000" as java.util.Date
            //while (reservesIt.hasNext()) {
            //  var rsv = reservesIt.next() as Reserve
            //  print("reserve at 519: " + rsv)
            //  if (rsv.RptCreateDateExt > rsvDate) {
            //    print("reserve " + rsv)
            //    reserve = rsv
            //    rsvDate = rsv.RptCreateDateExt
            //  }
            //}
            //gw.transaction.Transaction.runWithNewBundle(\ bundleReserve -> {
		//    bundleReserve.add(reserve)

            reserve.AccountingMonthExt = reserveCCST.AccountingMonthExt
            reserve.AccountingYearExt = reserveCCST.AccountingYearExt
            //reserve.Currency = reserveCCST.Currency
            reserve.Status = reserveCCST.StatusTran
            reserve.SubmitDate = reserveCCST.SubmitDate
            reserve.RptCreateDateExt = reserveCCST.RptCreateDateExt 
            reserve.Comments = reserveCCST.Comments
            reserve.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
            //var rsvLines = exposure.ReserveLines
  	    //for (rsvLine in rsvLines) {
  	     // rsvLine.
  	    //}
            //})
            var reserveSet = reserve.TransactionSet as ReserveSet
            reserveSet.RequestingUser = submittingUser
            reserveSet.ApprovalDate = reserveCCST.ApprovalDate
            reserveSet.ApprovalStatus = reserveCCST.ApprovalStatus
            reserveSet.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
            try {
	      var claimFinancialsAPI = new IClaimFinancialsAPI()
	      claimFinancialsAPI.addClaimFinancials(reserveSet)
			
	      //if (tsar.getValidationErrors().length > 0) {
		//System.out.println("after call to add Financials; result: " + tsar.getValidationErrors()[0]);
	      //}
	    } catch (e1) {
	      e1.printStackTrace();
	    }
	    return reserveCCST.TransactionAmount
          }
          return null
}


public function buildUpdatedReserve(checkCCST : CCSTCheckBean, exposure : Exposure, aClaim : Claim, _claimsDAO : IClaimsConversionDAO, propsCC : HashMap) : BigDecimal {
          var origReserves = _claimsDAO.getOriginal_Reserve(aClaim.ClaimNumber, propsCC, exposure.PublicID, checkCCST.CostType)
          var currReserves = _claimsDAO.getCurrent_Reserve(aClaim.ClaimNumber, propsCC, exposure.PublicID, checkCCST.CostType)
          var totalPymts = _claimsDAO.getTransTotalAmount(aClaim.ClaimNumber, exposure.PublicID, checkCCST.CostType, propsCC)
          var currRsvAmt = 0.0
          for (reserveCCST in currReserves) {
            currRsvAmt = reserveCCST.TransactionAmount as double
          }
          var transTotalAmt = totalPymts + currRsvAmt
          var reserve : Reserve
          if (transTotalAmt <> origReserves.first().TransactionAmount or origReserves.first().CostType == "expense" ) {
            for (reserveCCST in origReserves) {
    	      var submittingUser : User
  	      if (reserveCCST.RequestingUserID == null) {
  	        submittingUser = User ("user:50010")
  	      }
  	      else {
  	        submittingUser = User (reserveCCST.RequestingUserID)
  	        if (submittingUser == null) {
  	          submittingUser = User ("user:50010")
  	        }  
  	      }
   	      //  for(reserve in (transactionSet as ReserveSet).Reserves){
                //  if(gw.api.web.Scopes.Request["AutoRes"] as boolean==true){
                  //}
  	       // }

  	      reserve = exposure.setAvailableReserves(reserveCCST.CostType, reserveCCST.CostCategory, transTotalAmt, submittingUser)

              //var reservesIt = exposure.getReservesIterator(false)
              //print("reservesIt " + reservesIt.hasNext())
              //var rsvDate : Date
              //rsvDate = "1900-01-01 01:01:01.000" as java.util.Date
              //while (reservesIt.hasNext()) {
              //  var rsv = reservesIt.next() as Reserve
              //  print("reserve at 519: " + rsv)
              //  if (rsv.RptCreateDateExt > rsvDate) {
              //    print("reserve " + rsv)
              //    reserve = rsv
              //    rsvDate = rsv.RptCreateDateExt
              //  }
              //}
              //gw.transaction.Transaction.runWithNewBundle(\ bundleReserve -> {
		//    bundleReserve.add(reserve)

              reserve.AccountingMonthExt = reserveCCST.AccountingMonthExt
              reserve.AccountingYearExt = reserveCCST.AccountingYearExt
              //reserve.Currency = reserveCCST.Currency
              reserve.Status = reserveCCST.StatusTran
              reserve.SubmitDate = reserveCCST.SubmitDate
              reserve.RptCreateDateExt.Time = reserveCCST.RptCreateDateExt.Time  + 1  
              reserve.Comments = reserveCCST.Comments
              reserve.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
              //var rsvLines = exposure.ReserveLines
  	      //for (rsvLine in rsvLines) {
  	       // rsvLine.
  	      //}
              //})
              var reserveSet = reserve.TransactionSet as ReserveSet
              reserveSet.RequestingUser = submittingUser
              reserveSet.ApprovalDate = reserveCCST.ApprovalDate
              reserveSet.ApprovalStatus = reserveCCST.ApprovalStatus
              reserveSet.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
              try {
	        var claimFinancialsAPI = new IClaimFinancialsAPI()
	        claimFinancialsAPI.addClaimFinancials(reserveSet)
			
	      //if (tsar.getValidationErrors().length > 0) {
		//System.out.println("after call to add Financials; result: " + tsar.getValidationErrors()[0]);
	      //}
	      } catch (e1) {
	        e1.printStackTrace();
	        throw e1
	      }
            }
          }
          return transTotalAmt
}
public function callMigrateClaim(aClaim : Claim, policy : Policy, claimCCST : CCSTClaimBean, propsCC : HashMap, _claimsDAO : IClaimsConversionDAO, contactMap : HashMap<String, Contact>, claimContactMap : HashMap<String, ClaimContact>, addressMap : HashMap<String, Address>, exposureMap : HashMap<String, Exposure>, expAssignMap : HashMap<String, CCSTExposureBean>) {
        var errorList : String
	try {
  	        // print(userQueryResult.PublicID)
                //aClaim.Policy.validate()
                //aClaim.validate(true)

                //for (error in clmValResult.Errors) {
                  //print ("error " + error)
                    //var valQuery = gw.api.database.Query.make(gw.api.validation.GeneralValidation)
		    //valQuery.compare("ID", Equals, error)
		    //var valQueryResult = valQuery.select().FirstResult
		    
                    //print("clmValResult " + error.hashCode())
                //}
                var claimAPI = new IClaimAPI()
                try {
		   buildExposures(aClaim, propsCC, _claimsDAO, policy, contactMap, claimContactMap, addressMap, exposureMap, expAssignMap)
                } catch(e3) {
                  throw e3 
                }
                try {
		  for (exposureRec in exposureMap.entrySet()) {
                    var exposure = exposureRec.getValue()
                    exposure.Claim = aClaim
                    var closeDate  = exposure.CloseDate
                    var claimOrder = exposure.ClaimOrder
                    exposure.MetricLimitGeneration = exposure.ClaimOrder
                    errorList = claimAPI.addExposure(aClaim.PublicID, exposure, null)
                    exposure.ClaimOrder = claimOrder
                    exposure.CloseDate = closeDate
                  }
                } catch (e6) {
                  throw e6
                }
                try {
	           buildClaimContacts(aClaim, propsCC, _claimsDAO, contactMap, claimContactMap, exposureMap, addressMap)
    	        } catch (e3) {
    	          throw (e3)
    	        }
                //var activityMap : HashMap<String, Activity>
                //try {
		//  activityMap = buildActivities(aClaim, policy, propsCC, _claimsDAO, exposureMap, contactMap, claimContactMap, addressMap)
                //} catch(e4) {
                //  throw e4
                //}
                
                //try {
		//  buildNotes(aClaim, policy, propsCC, _claimsDAO, exposureMap, activityMap, contactMap, claimContactMap, addressMap)
                //} catch(e5) {
                //  throw e5
                //}

		//System.out.println("after call to migrateClaim publicid: " + claimPublicId)
	} catch (e1) {
		// TODO Auto-generated catch block
		print("error stack trace " + e1.printStackTrace())
		print("errorList " + errorList)
		throw e1
	}

}

public function buildNotes(aClaim : Claim, policy : Policy, propsCC : HashMap, _claimsDAO : IClaimsConversionDAO, exposureMap : HashMap<String, Exposure>, activityMap : HashMap<String, Activity>, contactMap : HashMap<String, Contact>, claimContactMap : HashMap<String, ClaimContact>, addressMap : HashMap<String, Address>) {
        var notes = _claimsDAO.getCCST_Note(aClaim.ClaimNumber, propsCC)
        
        if (not notes.Empty) {
          var _iter = notes.iterator()
          while (_iter.hasNext()) {
            var noteCCST = _iter.next()
            if(this.TerminateRequested){break}
            var note = new Note()
            note.AllowExternalViewing = noteCCST.AllowExternalViewing
            note.Author = User(noteCCST.AuthorID) 
            if (util.StringUtils.getXMLValue(noteCCST.Body,false).length > 4000) {
              note.Body = util.StringUtils.getXMLValue(noteCCST.Body,false).substring(4000)
            }
            else {
              note.Body = noteCCST.Body
            }

            if (noteCCST.ExposureID <> null) {
              note.Exposure = exposureMap.get(noteCCST.ExposureID)
              note.Claimant = note.Exposure.Claimant
            }
            if (noteCCST.ActivityID <> null) {
              note.Activity = activityMap.get(noteCCST.ActivityID)
            }
            note.Claim = aClaim
            note.Language = noteCCST.Language
            note.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
            note.AllowExternalViewing = noteCCST.AllowExternalViewing
            note.AuthoringDate = noteCCST.AuthoringDate
            note.Confidential = noteCCST.Confidential
            var noteClaimContactRole : ClaimContactRole
            var noteClaimContact : ClaimContact
            if (noteCCST.ClaimContactID <> null) {
              noteClaimContact = findClaimContact(aClaim, noteCCST.ClaimContactID, _claimsDAO, claimContactMap, propsCC)
              if (noteClaimContact <> null) {
                note.ClaimContact = noteClaimContact
                var exposure = exposureMap.get(noteCCST.ExposureID)
                if (exposure <> null) {
                  note.ClaimContact.Roles[0].Exposure = exposure
                }
               // noteClaimContact.Roles[0].Exposure = exposureMap.get(noteCCST.ExposureID)
               // note.ClaimContact.addToRoles(noteClaimContact.Roles[0])
               // note.ClaimContact.Contact = noteClaimContact.Contact
                if (noteClaimContact.Policy <> null) {
                  note.ClaimContact.Policy = policy
                }
              }
              else {
                note.ClaimContact = buildClaimContact(noteCCST.ClaimContactID, "",aClaim, propsCC, _claimsDAO, null, "ClmContPublicID", claimContactMap)
                var contact = buildContact(noteCCST.ClaimContactID, "", aClaim, propsCC, _claimsDAO, null, "ClmContPublicID", contactMap, addressMap)
                note.ClaimContact.Contact = contact
                var exposure = exposureMap.get(noteCCST.ExposureID)
	        buildClaimContactRoles(noteCCST.ClaimContactID, null, note.ClaimContact, aClaim.ClaimNumber, aClaim.LoadCommandID, propsCC, _claimsDAO, "ClmContPublicID", aClaim, exposureMap, contact, null)

                if (noteClaimContact.Policy <> null) {
                  note.ClaimContact.Policy = policy
                }
	        claimContactMap.put(note.ClaimContact.PublicID, note.ClaimContact)
	      //noteClaimContactRole.Contact = contact
              }
            }
            note.SecurityType = noteCCST.SecurityType
            note.Subject = noteCCST.Subject
            note.Topic = noteCCST.Topic
            _iter.remove()
          }
        }
}

public function buildActivities(aClaim : Claim, policy : Policy, propsCC : HashMap, _claimsDAO : IClaimsConversionDAO, exposureMap : HashMap<String, Exposure>, contactMap : HashMap<String, Contact>, claimContactMap : HashMap<String, ClaimContact>, addressMap : HashMap<String, Address>)  : HashMap<String, Activity> {
	var activities = _claimsDAO.getCCST_Activity(aClaim.ClaimNumber, propsCC)

	//var loadCmdQuery = gw.api.database.Query.make(entity.LoadCommand)
	//loadCmdQuery.compare("PublicID", Equals, "ccd2u1:1")
	//var loadCmdRec = loadCmdQuery.select().FirstResult
	//var loadCmdID = loadCmdRec.ID
	var activityMap = new HashMap<String, Activity>()
	if (not activities.Empty) {
	  for (activityCCST in activities) {
	    	var activity = new Activity()
	        activity.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
		activity.ActivityClass = activityCCST.ActivityClass
		//activity.ActivityPattern = activityCCST.ActivityPatternID
		activity.ApprovalIssue = activityCCST.ApprovalIssue

	        activity.setFieldValue("assignmentDate",activityCCST.AssignmentDate)
	        activity.setFieldValue("assignmentStatus", AssignmentStatus.TC_ASSIGNED)
		activity.Claim = aClaim
		activity.ActivityClass = activityCCST.ActivityClass
		activity.CloseDate = activityCCST.CloseDate
		if (activityCCST.ExposureID <> null) {
		  activity.Exposure = exposureMap.get(activityCCST.ExposureID)
		}
		var activityClaimContactRole : ClaimContactRole
                var activityClaimContact : ClaimContact
		if (activityCCST.ClaimContactID <> null) {

		  activityClaimContact = findClaimContact(aClaim, activityCCST.ClaimContactID, _claimsDAO, claimContactMap, propsCC)
                  if (activityClaimContact <> null) {
                    activity.ClaimContact = activityClaimContact
                    var exposure = exposureMap.get(activityCCST.ExposureID)
                    if (exposure <> null) {
                      activity.ClaimContact.Roles[0].Exposure = exposure
                    }
                    if (activityClaimContact.Policy <> null) {
                      activity.ClaimContact.Policy = policy
                    }
                  }
                  else {
                    activity.ClaimContact = buildClaimContact(activityCCST.ClaimContactID, "",aClaim, propsCC, _claimsDAO, null, "ClmContPublicID", claimContactMap)
                    var contact = buildContact(activityCCST.ClaimContactID, "", aClaim, propsCC, _claimsDAO, null, "ClmContPublicID", contactMap, addressMap)
                    activity.ClaimContact.Contact = contact
                    var exposure = exposureMap.get(activityCCST.ExposureID)
	            buildClaimContactRoles(activityCCST.ClaimContactID, null, activity.ClaimContact, aClaim.ClaimNumber, aClaim.LoadCommandID, propsCC, _claimsDAO,  "ClmContPublicID", aClaim, exposureMap, contact, null)

	            if (activity.ClaimContact.Policy <> null) {
	              activity.ClaimContact.Policy = policy
	            }
	            claimContactMap.put(activity.ClaimContact.PublicID, activity.ClaimContact)
                  }
		}
		try {
    		  activity.AssignedUser = User(activityCCST.AssignedUserID)
	
                } catch(e2) {
                  print("error stack trace " + e2.printStackTrace())
                  throw e2
                }
                try {
		  activity.AssignedGroup = Group(activityCCST.AssignedGroupID)
		} catch(e1) {
                  print("error stack trace " + e1.printStackTrace())
                  throw e1
                }
		activity.AssignedByUser = User(activityCCST.AssignedByUserID)
		activity.ExternallyOwned = activityCCST.ExternallyOwned
		activity.Importance = activityCCST.Importance
		activity.setClaimant(activity.Exposure.Claimant)
		activity.Mandatory = activityCCST.Mandatory
		activity.Status = activityCCST.Status
		activity.ApprovalRationale = activityCCST.ApprovalRationale
		activity.Approved = activityCCST.Approved
		activity.Description = activityCCST.Description
		activity.EndDate = activityCCST.EndDate
		activity.Priority = activityCCST.Priority
		activity.Recurring = activityCCST.Recurring
		activity.RptCreateDateExt = activityCCST.RptCreateDateExt
		activity.RptUpdateDateExt = activityCCST.RptUpdateDateExt
		activity.ShortSubject = activityCCST.ShortSubject
		activity.Subject = activityCCST.Subject
		activity.TargetDate = activityCCST.TargetDate
		activity.Type = activityCCST.Type
		activity.ValidationLevel = activityCCST.ValidationLevel
		activityMap.put(activityCCST.PublicID, activity)
	  }
	}
	return activityMap
}

public function buildClaimContacts(aClaim : Claim, propsCC : HashMap, _claimsDAO : IClaimsConversionDAO, contactMap : HashMap<String, Contact>, claimContactMap : HashMap<String , ClaimContact>, exposureMap : HashMap<String , Exposure>, addressMap : HashMap<String, Address>) {
        var claimContacts : List<CCSTClaimContactBean>
	claimContacts = _claimsDAO.getCCST_ClaimContactForClaim(aClaim.ClaimNumber, propsCC)
	if (not claimContacts.Empty) {
	  var _iter = claimContacts.iterator()
	  while (_iter.hasNext()) {
	    var claimContactCCST = _iter.next()
	    if(this.TerminateRequested){break}
	    if (claimContactCCST.Role <> "claimant" && claimContactCCST.Role <> "insured" && !contactMap.containsKey(claimContactCCST.Role) && !contactMap.containsKey(claimContactCCST.PublicIDContact) && claimContactCCST.PolicyID == null) {
	      var policyRole = checkClaimContactRoles(claimContactCCST.PublicID, aClaim.ClaimNumber, propsCC, _claimsDAO)
	      if (policyRole == "") {
	        var clmContactQuery = gw.api.database.Query.make(ClaimContact)
                clmContactQuery.compare("publicID", Equals, claimContactCCST.PublicID)
                var clmContactQueryResult = clmContactQuery.select().FirstResult   
                if (clmContactQueryResult.PublicID == null) {
	          var claimContact = buildClaimContact(claimContactCCST.PublicID, "",aClaim, propsCC, _claimsDAO, claimContacts, "ClmContPublicID", claimContactMap)
	          var contact = buildContact(claimContactCCST.PublicID, claimContactCCST.Role, aClaim, propsCC, _claimsDAO, claimContacts, "ClmContPublicID", contactMap, addressMap)
	          claimContact.Claim = aClaim
	          claimContact.setContact(contact)

	          claimContact.Contact = contact
	        //if (claimContactCCST.PolicyID <> null) {                 
	          //claimContact.Policy = aClaim.Policy
	        //}
	          claimContact.setFieldValue("LoadCommandID",aClaim.LoadCommandID)
	          claimContactMap.put(claimContactCCST.PublicID, claimContact)
	          buildClaimContactRoles(claimContactCCST.PublicID, null, claimContact, aClaim.ClaimNumber, aClaim.LoadCommandID, propsCC, _claimsDAO, "ClmContPublicID", aClaim, exposureMap, contact, null)
	        }
	        else {
                  buildClaimContactRoles(claimContactCCST.PublicID, null, clmContactQueryResult, aClaim.ClaimNumber, aClaim.LoadCommandID, propsCC, _claimsDAO, "ClmContPublicID", aClaim, exposureMap, clmContactQueryResult.Contact, null)
	        }
	      }
	    }
	    _iter.remove()
	  }  
	}
}

public function buildExposures(aClaim : Claim, propsCC : HashMap, _claimsDAO : IClaimsConversionDAO, policy : Policy, contactMap : HashMap<String, Contact>, claimContactMap : HashMap<String, ClaimContact>, addressMap : HashMap<String, Address>, exposureMap : HashMap<String, Exposure>, expAssignMap : HashMap<String, CCSTExposureBean> )  {
  
	//var claimantClaimContact = new ClaimContact()
	//var claimantClaimContactRole = new ClaimContactRole()
	var exposures = _claimsDAO.getCCST_Exposure(aClaim.ClaimNumber, propsCC)
	if (not exposures.Empty) {
	  for (exposureCCST in exposures) {
	    var exposureQuery = gw.api.database.Query.make(Exposure)
            exposureQuery.compare("publicID", Equals, exposureCCST.PublicID);
            var exposureQueryResult = exposureQuery.select().FirstResult   
            if (exposureQueryResult.PublicID == null) {
	      var exposure = new Exposure()
	      aClaim.addToExposures(exposure)
              print("exposure CCST ebi: " + exposureCCST.CoverageEBIExt)
	      var coverageList = policy.Coverages
	      for (coverage in coverageList) {
  	        print("Pol Covg EBI: " + coverage.CoverageEBIExt)
	        if (coverage.CoverageEBIExt == exposureCCST.CoverageEBIExt && exposure.Coverage == null) {
		  exposure.Coverage = coverage
		  coverage.ClassCodeEBIExt = exposureCCST.ClassCodeEBIExt
		  coverage.ClassCodeEBIInstExt = exposureCCST.ClassCodeEBIInstExt
	        }
	      }
	    
	      if (exposure.Coverage == null) {
	        throw("Coverage could not be found for the exposure on claim: " + aClaim.ClaimNumber) 
	      }
	    
	      exposure.ExposureType = exposureCCST.ExposureType
                
	      var claimantClaimContact = buildClaimContact(exposureCCST.PublicID, "claimant",aClaim, propsCC, _claimsDAO, null, "PublicIDandRole", claimContactMap)
	      var claimantContact = buildContact(exposureCCST.PublicID, "claimant", aClaim, propsCC, _claimsDAO, null, "PublicIDandRole", contactMap, addressMap)

	      claimantClaimContact.setContact(claimantContact)
	      claimantClaimContact.Claim = aClaim
	      var ccrMap = buildClaimContactRoles(exposureCCST.PublicID, "claimant", claimantClaimContact, aClaim.ClaimNumber, aClaim.LoadCommandID, propsCC, _claimsDAO, "ClmContPublicID", aClaim, exposureMap, claimantContact, exposure)
	      var claimantClaimContactRole = ccrMap.get("claimant")
	      claimantClaimContactRole.ClaimContact = claimantClaimContact 
	      claimantClaimContactRole.Contact = claimantContact
	      //claimantClaimContact.Roles = new ClaimContactRole[]{claimantClaimContactRole}
	      //claimantClaimContact.addToRoles(claimantClaimContactRole)
              claimantClaimContact.Policy = policy
	      claimantClaimContactRole.Policy = policy
	      claimantClaimContact.setFieldValue("LoadCommandID",aClaim.LoadCommandID)
	      claimContactMap.put(claimantClaimContact.PublicID, claimantClaimContact)
	    
              exposure.Claim = aClaim
	      exposure.AssignedGroup = Group(exposureCCST.AssignedGroupID)
	      exposure.AssignedUser = User(exposureCCST.AssignedUserID)
	      exposure.setFieldValue("assignmentStatus", AssignmentStatus.TC_ASSIGNED)
	      exposure.setFieldValue("assignmentDate",exposureCCST.AssignmentDate)
	      exposure.HospitalDate = exposureCCST.AssignmentDate
	      exposure.AttorneyRepExt = exposureCCST.AttorneyRepExt
              exposure.AverageWeeklyWages = exposureCCST.AverageWeeklyWages
              exposure.BasisOfPayExt = exposureCCST.BasisOfPayExt
	      exposure.BodyShopPaymentIndExt = exposureCCST.BodyShopPaymentIndExt
	      exposure.BreakIn = exposureCCST.BreakIn
	      exposure.AppliesToCertAggLimitExt = exposureCCST.AppliesToCertAggLimitExt
	      if (exposureCCST.ClaimantDenormID <> null) {
  	        exposure.ClaimantDenorm = buildContact(exposureCCST.ClaimantDenormID, "", aClaim, propsCC, _claimsDAO, null, "ContPublicID", contactMap, addressMap)
	      }
	      exposure.ClaimOrder = exposureCCST.ClaimOrder
	      exposure.CloseDate = exposureCCST.CloseDate
    	      exposure.ClosedOutcome = exposureCCST.ClosedOutcome
	      exposure.ContactPermitted = exposureCCST.ContactPermitted
	      exposure.ContribPotentialExt = exposureCCST.ContribPotentialExt
	      exposure.CourseOfEmployExt = exposureCCST.CourseOfEmployExt
	      exposure.DateOfBirthExt = exposureCCST.DateOfBirthExt
	      exposure.DateOfTotalLossExt = exposureCCST.DateOfTotalLossExt
	      exposure.DeductibleExistsExt = exposureCCST.DeductibleExistsExt
	      exposure.ExposureDetailsExt = exposureCCST.ExposureDetailsExt
	      exposure.ExposureLimitReached = exposureCCST.ExposureLimitReached
	      exposure.InjuryNatureDescExt = exposureCCST.InjuryNatureDescExt
	      //exposure.ISOEnabledExt = exposureCCST.ISOEnabledExt
	      exposure.ISOKnown = exposureCCST.ISOKnown
	      exposure.ISOStatus = exposureCCST.ISOStatus
	      if (exposure.InsuranceCoExt <> null) {
  	        exposure.InsuranceCoExt = buildContact(exposureCCST.InsuranceCoExt, "", aClaim, propsCC, _claimsDAO, null, "ContPublicID", contactMap, addressMap)
	      }
	      exposure.JurisdictionState = exposureCCST.JurisdictionState
	      exposure.JurisdictionCountryExt = exposureCCST.JurisdictionCountryExt
	      exposure.LegalExpenseExt = exposureCCST.LegalExpenseExt
	      exposure.LegalExpenseTrueDateExt = exposureCCST.LegalExpenseTrueDateExt
	      exposure.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
	      exposure.LossAppToExt = exposureCCST.LossAppToExt
	      exposure.LossCauseChangedExt = exposureCCST.LossCauseChangedExt
	      exposure.LossLocationExt = exposureCCST.LossLocationExt
	      exposure.LostPropertyType = exposureCCST.LostPropertyType
	      exposure.LostWagesExt = exposureCCST.LostWagesExt
	      exposure.MedicalTreatmentExt = exposureCCST.MedicalTreatmentExt
	      exposure.MedicareExposureExt = exposureCCST.MedicareExposureExt
	      exposure.MethodVerifyDamagesExt = exposureCCST.MethodVerifyDamagesExt
	      exposure.MethodOfSettlementExt = exposureCCST.MethodOfSettlementExt
	      exposure.MetricLimitGeneration = exposureCCST.MetricLimitGeneration
	      exposure.MinorChildExt = exposureCCST.MinorChildExt
	      exposure.NoLegalExpenseTypeExt = exposureCCST.NoLegalExpenseTypeExt
	    
      	      for (coverage in coverageList) {
	        if (coverage.PublicID == exposureCCST.PreviousCoverageExt) {
		  exposure.PreviousCoverageExt = coverage
	        }
	      }

	      exposure.PrimaryCoverage = exposureCCST.PrimaryCoverage
	      //exposure.ReOpenDate = exposureCCST.ReopenDate
	      //exposure.ReopenedReason = exposureCCST.ReopenedReason
	      exposure.ReservedFileExt = exposureCCST.ReservedFileExt
	      exposure.RptCreateDateExt = exposureCCST.RptCreateDateExt
	      exposure.RptUpdateDateExt = exposureCCST.RptUpdateDateExt
	      exposure.SalvagePotentialExt = exposureCCST.SalvagePotentialExt
	      exposure.SettleDate = exposureCCST.CloseDate
	      exposure.SettleMethod = exposureCCST.SettleMethod
	      exposure.State = exposureCCST.State
	      exposure.StatuteOfLimitationsExt = exposureCCST.StatuteOfLimitationsExt
	      exposure.Strategy = exposureCCST.Strategy
	      exposure.SubrogPotentialExt = exposureCCST.SubrogPotentialExt
	      exposure.ValidationLevel = exposureCCST.ValidationLevel
	      exposure.ex_InSuit = exposureCCST.Ex_InSuit
	      exposure.CoverageSubType = exposureCCST.CoverageSubType
	      exposure.ClaimantType = exposureCCST.ClaimantType
	      exposure.ExposureType = exposureCCST.ExposureType
	      exposure.LossParty = exposureCCST.LossParty
	      //exposure.Incident = exposureCCST.
	      exposure.LossDueToExt = exposureCCST.LossDueToExt
	      exposure.PublicID = exposureCCST.PublicID
              expAssignMap.put(exposure.PublicID, exposureCCST)
	      exposure.Roles = new ClaimContactRole[]{claimantClaimContactRole}
              var incidents = _claimsDAO.getCCST_Incident(exposureCCST.IncidentID, propsCC)
              var subtype = ""
              for (incidentCCST in incidents) {
                subtype = incidentCCST.Subtype
                if (subtype == "InjuryIncident") {
                  var incident = buildInjuryIncident(aClaim, incidentCCST)
                  incident.Roles = new ClaimContactRole[]{claimantClaimContactRole}
	          exposure.Incident = incident
                }
                else 
                if (subtype == "Incident") {
                  var incident = buildIncident(aClaim, incidentCCST)
                  incident.Roles = new ClaimContactRole[]{claimantClaimContactRole}
	          exposure.Incident = incident
                }
                else {
                  var incident = buildFixedPropIncident(aClaim, incidentCCST, policy)
                  incident.Roles = new ClaimContactRole[]{claimantClaimContactRole}
	          exposure.Incident = incident
                }
              }

	      //exposure.addRole("claimant", claimantContact)
	      claimantClaimContactRole.setContact(claimantContact)
	      exposure.ClaimantType  = exposureCCST.ClaimantType

    	      if (claimantContact typeis Person) {
	        exposure.setClaimant(claimantContact)
	      }  
	      else
	      if (claimantContact typeis Company) {
	        //print("before exposure claimant set " + claimantContact)
	        //exposure.addRole("claimant", claimantContact)
	        //exposure.setContactByRole("claimant", claimantContact)
	        exposure.Claimant = claimantContact
	      }
	      else {
	        print("No type for claimantcontact: " + claimantContact.PublicID  + " on claim: " + aClaim.ClaimNumber + "; exposure: " + exposure.PublicID)
	      }
	      if (exposure.Claimant typeis Person and exposure.ClosedOutcome<> null and (exposure.ExposureType == "sp_medical_payment" or exposure.ExposureType == "sp_bodily_injury")) {
                 exposure.Claimant.MedicareEligibleExt = 0
              }
              exposure.TypeOfLossMostExt = exposureCCST.TypeOfLossMostExt
	      exposure.PolicyNumberExt = policy.PolicyNumber
	      exposureMap.put(exposureCCST.PublicID, exposure)
	      buildUserRoleAssign(exposure, aClaim, _claimsDAO, propsCC)
	      claimantClaimContactRole.Exposure = exposure
            }
	  }
	}

}

public function buildFixedPropIncident(aClaim : Claim, incidentCCST : CCSTIncidentBean, policy : Policy ) : FixedPropertyIncident {

    var incident = new FixedPropertyIncident()
    //var policyLocs = _claimsDAO.getCCST_PolicyLocations(aClaim.ClaimNumber, propsCC)
    //var polLocation = new PolicyLocation()
    incident.AlarmType = incidentCCST.AlarmType
    incident.Claim = aClaim
    incident.Description = incidentCCST.Description
    incident.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
    var polLocations = policy.PolicyLocations
    var i = 0
    for (polLocation in polLocations) {
      if (policy.PolicyLocations[i].PublicID==incidentCCST.PropertyID) {
        incident.Property = policy.PolicyLocations[i]
      }
      else
      if (policy.PolicyLocations[i].PublicID==incidentCCST.PreviousPropertyExt) {
        incident.PreviousPropertyExt = policy.PolicyLocations[i]
      }
      i++
    }
    //for (polLocationCCST in policyLocs) {
    //    if (incidentCCST.PropertyID == polLocationCCST.PublicID) {
    //       address = buildAddress(polLocationCCST.AddressID, propsCC, _claimsDAO)
    //       polLocation.Address = address
    //       polLocation.PrimaryLocation = polLocationCCST.PrimaryLocation
    //       polLocation.RiskTypeExt = polLocationCCST.RiskTypeExt
    //       polLocation.RiskNumberExt = polLocationCCST.RiskNumberExt
    //       polLocation.PhyPropEffDateExt = polLocationCCST.PhyPropEffDateExt
    //       polLocation.PhyPropExpDateExt = polLocationCCST.PhyPropExpDateExt
    //       polLocation.BoardingExt = polLocationCCST.BoardingExt
    //       polLocation.BuildingNumberExt = polLocationCCST.BuildingNumberExt
    //       polLocation.ex_AmountofInsurance = polLocationCCST.Ex_AmountofInsurance
    //       polLocation.LocationNumber = polLocationCCST.LocationNumber
    //       polLocation.Notes = polLocationCCST.Notes
    //       polLocation.PhysicalPropertyEBIExt = polLocationCCST.PhysicalPropertyEBIExt
    //       polLocation.PhysicalPropertyEBIInstExt = polLocationCCST.PhysicalPropertyEBIInstExt
    //       polLocation.Policy = aClaim.Policy
    //       polLocation.VetBillsExt = polLocationCCST.VetBillsExt
    //       polLocation.YearBuiltExt = polLocationCCST.YearBuiltExt
    //    }
    //}
    incident.LossEstimate = incidentCCST.LossEstimate
    incident.Severity = incidentCCST.Severity
    return incident
}

public function buildInjuryIncident(aClaim : Claim, incidentCCST : CCSTIncidentBean) : InjuryIncident {

    var incident = new InjuryIncident()
    //if (incidentCCST.ClaimIncident == "1") {
      incident.Claim = aClaim
   // }
    incident.AmbulanceUsed = incidentCCST.AmbulanceUsed
    incident.Description = incidentCCST.Description
    incident.DetailedInjuryType = incidentCCST.DetailedInjuryType
    incident.GeneralInjuryType = incidentCCST.GeneralInjuryType
    incident.LossEstimate = incidentCCST.LossEstimate
    incident.Severity = incidentCCST.Severity
    incident.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
    return incident
}


public function buildIncident(aClaim : Claim, incidentCCST : CCSTIncidentBean) : Incident {

    var incident = new Incident()
   // if (incidentCCST.ClaimIncident == "1") {
      incident.Claim = aClaim
    //}
    incident.Severity = incidentCCST.Severity
    incident.Description = incidentCCST.Description
    incident.LossEstimate = incidentCCST.LossEstimate
    incident.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
    return incident
}

public function buildClaim(aClaim : Claim, claimCCST : CCSTClaimBean, propsCC : HashMap, _claimsDAO : IClaimsConversionDAO, contactMap : HashMap<String, Contact>, loadCommandID : Integer, addressMap : HashMap<String, Address>) {
    aClaim.AccountingYearExt = claimCCST.AccountingYearExt
    aClaim.AccountingMonthExt = claimCCST.AccountingMonthExt

    aClaim.AgencyId = claimCCST.AgencyID
    aClaim.setFieldValue("assignmentDate",claimCCST.AssignmentDate)
    aClaim.setFieldValue("assignmentStatus", AssignmentStatus.TC_ASSIGNED)
    aClaim.StorageDate = claimCCST.AssignmentDate
  //  aClaim.AssignmentDate.setYear(claimCCST.AssignmentDate.YearOfDate as int)
   // aClaim.AssignmentDate.setMonth(claimCCST.AssignmentDate.MonthOfYear as int)
   // aClaim.AssignmentDate.setDate(claimCCST.AssignmentDate.DayOfMonth as int)
   // print("Assign Date " + aClaim.AssignmentDate
    aClaim.setFieldValue("LoadCommandID", loadCommandID) 
    aClaim.BusinessLineExt = claimCCST.BusinessLineExt
    aClaim.NCWOnlyBusinessUnitExt = claimCCST.BusinessUnitExt
   
    var catastropheQuery = gw.api.database.Query.make(entity.Catastrophe)
    catastropheQuery.compare("PublicID", Equals, claimCCST.CatastropheID )

    var catastropheResult = catastropheQuery.select()
    for (catastrophe in catastropheResult) {
      aClaim.Catastrophe = catastrophe
    }
    aClaim.ClaimNumber = claimCCST.ClaimNumber
    aClaim.ClaimSource = claimCCST.ClaimSource
    aClaim.ClaimTypeExt = claimCCST.ClaimTypeExt
    aClaim.ClaimTypeDetailExt = claimCCST.ClaimTypeDetailExt
    aClaim.ClaimSource = claimCCST.ClaimSource
    aClaim.CloseDate = claimCCST.CloseDate
    aClaim.DateEligibleForArchive = aClaim.CloseDate
    //aClaim.ClosedOutcome = claimCCST.ClosedOutcome
    aClaim.CoverageInQuestion = claimCCST.CoverageInQuestion
    aClaim.DateRptdToInsured = claimCCST.DateRptdToInsured
    aClaim.DateCompDcsnDue = claimCCST.DateCompDcsnDue
    aClaim.DateCompDcsnMade = claimCCST.DateCompDcsnMade
    aClaim.DeathDate = claimCCST.DeathDate
    aClaim.DeductibleStatus = claimCCST.DeductibleStatus
    aClaim.Description = claimCCST.Description
    aClaim.ex_LossLocation = claimCCST.Ex_LossLocation
    aClaim.ex_DetailLossCause = claimCCST.Ex_DetailLossCause
    aClaim.EstimatedDamage_Ext = claimCCST.EstimatedDamage_Ext
    aClaim.Fault = claimCCST.Fault
    aClaim.FaultRating = claimCCST.FaultRating
    aClaim.FirstNoticeSuit = claimCCST.FirstNoticeSuit
    aClaim.Flagged = claimCCST.Flagged
    aClaim.FlaggedDate = claimCCST.FlaggedDate
    aClaim.FlaggedReason = claimCCST.FlaggedReason
    aClaim.HowReported = claimCCST.HowReported
    if (claimCCST.IncidentClaimantExt <> null) {
      aClaim.IncidentClaimantExt = buildContact(claimCCST.IncidentClaimantExt, "claimant", aClaim, propsCC, _claimsDAO, null, "ContPublicIDandRole", contactMap, addressMap)
    }
    aClaim.ISOEnabled = claimCCST.ISOEnabled
    if (claimCCST.InsuredDenormID <> null) {
      aClaim.InsuredDenorm = buildContact(claimCCST.InsuredDenormID, "insured", aClaim, propsCC, _claimsDAO, null, "ContPublicIDandRole", contactMap, addressMap)
    }
    aClaim.IncidentReport = claimCCST.IncidentReport
    aClaim.JurisdictionState = claimCCST.JurisdictionState

    aClaim.LimitsInsuranceExt = claimCCST.LimitsInsuranceExt
    aClaim.LocationOfTheft = claimCCST.LocationOfTheft
    aClaim.LossCause = claimCCST.LossCause
    aClaim.LossDate = claimCCST.LossDate
    aClaim.LossType = claimCCST.LossType
    aClaim.LOBCode = claimCCST.LobCode
    aClaim.LossLocation = buildAddress(claimCCST.LossLocationID, propsCC, _claimsDAO, aClaim, addressMap)
    aClaim.LossLocationCode = claimCCST.LossLocationCode
    if (aClaim.MainContactExt <> null) {
      aClaim.MainContactExt = buildContact(claimCCST.MainContactExt, "", aClaim, propsCC, _claimsDAO, null, "ContPublicID", contactMap, addressMap)
    }
    aClaim.MainContactType = claimCCST.MainContactType
    aClaim.ManifestationDate = claimCCST.ManifestationDate
    
    aClaim.NonReservedFile_Ext = claimCCST.NonReservedFile_Ext
    aClaim.NoticeDateExt = claimCCST.NoticeDateExt
    aClaim.OtherRecovStatus = claimCCST.OtherRecovStatus
    
    aClaim.PermissionRequired = claimCCST.PermissionRequired
    aClaim.PolicyRefreshedExt = false
    aClaim.PublicID = claimCCST.PublicID
    aClaim.ReinsuranceStatus = claimCCST.ReinsuranceStatus
    //aClaim.ReOpenDate = claimCCST.ReopenDate
    //aClaim.ReopenedReason = claimCCST.ReopenedReason
    if (aClaim.ReportedByExt <> null) {
      aClaim.ReportedByExt =  buildContact(claimCCST.ReportedByExt, "", aClaim, propsCC, _claimsDAO, null, "ContPublicID", contactMap, addressMap)
    }
    aClaim.ReportedDate = claimCCST.ReportedDate
    if (aClaim.ReporterExt <> null) {
      aClaim.ReporterExt =  buildContact(claimCCST.ReporterExt, "", aClaim, propsCC, _claimsDAO, null, "ContPublicID", contactMap, addressMap)
    }
    aClaim.RptCreateDateExt = claimCCST.RptCreateDateExt
    aClaim.RptUpdateDateExt = claimCCST.RptUpdateDateExt
    
    aClaim.SalvageStatus = claimCCST.SalvageStatus
    aClaim.Segment = claimCCST.Segment
    aClaim.ShowMedicalFirstInfo = claimCCST.ShowMedicalFirstInfo
    aClaim.SIEscalateSIU = claimCCST.SIEscalateSIU
    aClaim.SIEscalateSIUdate = claimCCST.SIEscalateSIUdate
    aClaim.SIScore = claimCCST.SIScore as java.lang.Integer
    aClaim.SIULifeCycleState = claimCCST.SIULifeCycleState
    aClaim.SIUStatus = claimCCST.SIUStatus
    aClaim.SpecialStateSelectedExt = claimCCST.SpecialStateSelectedExt as java.lang.Boolean
    aClaim.StatuteDate = claimCCST.StatuteDate
    aClaim.StorageBarCodeNum = claimCCST.StorageBarCodeNum
    aClaim.StorageBoxNum = claimCCST.StorageBoxNum
    aClaim.StorageCategory = claimCCST.StorageCategory
    aClaim.StorageLocationState = claimCCST.StorageLocationState
    aClaim.StorageType = claimCCST.StorageType
    aClaim.StorageVolumes = claimCCST.StorageVolumes
    aClaim.Strategy = claimCCST.Strategy
    
    aClaim.TreatedPatientBfr = claimCCST.TreatedPatientBfr as java.lang.Boolean
    aClaim.ValidationLevel = claimCCST.ValidationLevel
    aClaim.VendorFraudExt = claimCCST.VendorFraudExt as java.lang.Boolean
    //userQuery = gw.api.database.Query.make(entity.User)
    //userQuery.compare("PublicID", Equals, claim.AssignedUserID)
    //userQueryResult = userQuery.select().FirstResult
    //print("uqr pi: " + userQueryResult.PublicID)
    //aClaim.AssignedUser = userQueryResult
}

public function buildUserRoleAssign(exposure : Exposure, aClaim : Claim, _claimsDAO : IClaimsConversionDAO, propsCC : HashMap) {
    var userRoleAssign: UserRoleAssignment
    
    var userRoleAssigns = _claimsDAO.getCCST_UserRoleAssign(aClaim.ClaimNumber, exposure.PublicID, propsCC)
    for (userRoleAssCCST in userRoleAssigns) {
      userRoleAssign = new UserRoleAssignment()
      userRoleAssign.Active = userRoleAssCCST.Active
      if (userRoleAssCCST.AssignedByUserID <> null) {
        userRoleAssign.AssignedByUser = User(userRoleAssCCST.AssignedByUserID)
      }
      if (userRoleAssCCST.AssignedGroupID <> null) {
        userRoleAssign.AssignedGroup = Group(userRoleAssCCST.AssignedGroupID)
      }
      if (userRoleAssCCST.AssignedUserID <> null) {
        userRoleAssign.AssignedUser = User(userRoleAssCCST.AssignedUserID)
      }
      //userRoleAssign.setFieldValue("AssignmentStatus","Unassigned")
      userRoleAssign.Claim = aClaim
      userRoleAssign.CloseDate = userRoleAssCCST.CloseDate
      userRoleAssign.Comments = userRoleAssCCST.Comments
      userRoleAssign.Exposure = exposure
      userRoleAssign.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
      userRoleAssign.PublicID = userRoleAssCCST.PublicID
      userRoleAssign.Role = userRoleAssCCST.Role 
      userRoleAssign.RptCreateDateExt = userRoleAssCCST.RptCreateDateExt
    }
}

public function buildAddress(publicID : String, propsCC : HashMap, _claimsDAO : IClaimsConversionDAO, aClaim : Claim, addressMap : HashMap<String, Address>) : Address {
    var address: Address
    
    var addresses = _claimsDAO.getCCST_Address(publicID, propsCC)
    for (addressCCST in addresses) {
      address = addressMap.get(publicID)
      if (address <> null) {
        break
      }
      address = loadAddressData(addressCCST, aClaim) 
    }
    addressMap.put(publicID, address)
    return address;
}

public function loadAddressData(addressCCST : CCSTAddressBean, aClaim : Claim) : Address{
      var address = new Address()
//      address = loadAddressData(addressCCST, claim)
      address.AddressBookUID = addressCCST.AddressBookUID
      address.AddressLine1 = addressCCST.AddressLine1
      address.AddressLine2 = addressCCST.AddressLine2
      address.AddressLine3 = addressCCST.AddressLine3
      address.AddressType = addressCCST.AddressType
      address.City = addressCCST.City
      address.County = addressCCST.County
      address.Country = addressCCST.Country
      address.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
      address.PostalCode = addressCCST.PostalCode
      address.Description = addressCCST.Description
      address.StandardizedExt = addressCCST.StandardizedExt
      address.State = addressCCST.State
      address.UserAddedIndExt = addressCCST.UserAddedIndExt
      address.ValidUntil = addressCCST.ValidUntil
      address.setFieldValue("LoadCommandID",aClaim.LoadCommandID)
      return address
}


public function loadAddressData(addressCCST : CCSTContactAddressBean, aClaim : Claim) : Address{
      var address = new Address()
      //address = loadAddressData(addressCCST, claim)
      address.AddressBookUID = addressCCST.AddressBookUID
      address.AddressLine1 = addressCCST.AddressLine1
      address.AddressLine2 = addressCCST.AddressLine2
      address.AddressLine3 = addressCCST.AddressLine3
      address.AddressType = addressCCST.AddressType
      address.City = addressCCST.City
      address.County = addressCCST.County
      address.Country = addressCCST.Country
      address.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
      address.PostalCode = addressCCST.PostalCode
      address.Description = addressCCST.Description
      address.StandardizedExt = addressCCST.StandardizedExt
      address.State = addressCCST.State
      address.UserAddedIndExt = addressCCST.UserAddedIndExt
      address.ValidUntil = addressCCST.ValidUntil
      return address
}

public function findClaimContact(aClaim : Claim, publicID : String, _claimsDAO : IClaimsConversionDAO, claimContactMap : HashMap<String, ClaimContact>, propsCC : HashMap) : ClaimContact {
      var claimContacts = _claimsDAO.getCCST_ClaimContactViaClmContPublicID(aClaim.ClaimNumber, publicID, propsCC)
      var role : String
      for (claimContact in claimContacts) {
        if (claimContact.Role <> null) {
          role = claimContact.Role
        }
      }
      
      var clmContact = claimContactMap.get(role)
      
      if (clmContact <> null) {
        return clmContact
      }
      else 
      {
          clmContact = claimContactMap.get(publicID)
          if (clmContact <> null) {
            return clmContact
          }
      }
      return null
}

public function buildClaimContact(publicID : String, role : String, aClaim : Claim, propsCC : HashMap, _claimsDAO : IClaimsConversionDAO, claimContacts : List<CCSTClaimContactBean>, keyType : String, claimContactMap : HashMap<String, ClaimContact>) : ClaimContact {
    var clmContact: ClaimContact
    if (keyType == "Role") {
      claimContacts = _claimsDAO.getCCST_ClaimContact(aClaim.ClaimNumber, role, propsCC)
    }
    else if (keyType == "ContPublicID") {
      claimContacts = _claimsDAO.getCCST_ClaimContactViaContPublicID(aClaim.ClaimNumber, publicID, propsCC)
    }
    else if (keyType == "ClmContPublicID") {
      claimContacts = _claimsDAO.getCCST_ClaimContactViaClmContPublicID(aClaim.ClaimNumber, publicID, propsCC)
    }
    else if (keyType == "PublicIDandRole") {
      claimContacts = _claimsDAO.getCCST_ClaimContactViaCCRPublicID(aClaim.ClaimNumber, publicID, role, propsCC)
    }
    clmContact = claimContactMap.get(role)
      
    if (clmContact <> null) {
       return clmContact
    }

    for (clmContactCCST in claimContacts) {
      clmContact = claimContactMap.get(clmContactCCST.Role)
      if (clmContact <> null)  
      {
         break
      }
      else {
         clmContact = claimContactMap.get(clmContactCCST.PublicID)
         if (clmContact <> null) {
            break
         }
      }
      clmContact = new ClaimContact()
      clmContact.ClaimantFlag = clmContactCCST.ClaimantFlag
      clmContact.claimSpecificContactExt = clmContactCCST.ClaimSpecificContactExt
      clmContact.DependentType = clmContactCCST.DependentType
      clmContact.ContactProhibited = clmContactCCST.ContactProhibited
      clmContact.ProviderType = clmContactCCST.ProviderType
      clmContact.Service = clmContactCCST.Service
      clmContact.claimSpecificContactExt = clmContactCCST.ClaimSpecificContactExt
      clmContact.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
      if (clmContactCCST.PolicyID <> null) {
        clmContact.Policy = aClaim.Policy
      }
      clmContact.PublicID = clmContactCCST.PublicID
      break
    }
    return clmContact;
}

public function buildContact(publicID : String, role : String, aClaim : Claim, propsCC : HashMap, _claimsDAO : IClaimsConversionDAO, contacts : List<CCSTClaimContactBean>, keyType : String, contactMap : HashMap<String, Contact>, addressMap : HashMap<String, Address>) : Contact {
    var contact: Contact
    if (keyType == "Role") {
      contacts = _claimsDAO.getCCST_ClaimContact(aClaim.ClaimNumber, role, propsCC)
    }
    else if (keyType == "ContPublicID") {
      contacts = _claimsDAO.getCCST_ClaimContactViaContPublicID(aClaim.ClaimNumber, publicID, propsCC)
    }  
    else if (keyType == "ContPublicIDandRole") {
      contacts = _claimsDAO.getCCST_ContactViaCCRPublicID(aClaim.ClaimNumber, publicID, role, propsCC)
    }  
    else if (keyType == "ClmContPublicID") {
      contacts = _claimsDAO.getCCST_ClaimContactViaClmContPublicID(aClaim.ClaimNumber, publicID, propsCC)
    }
    else if (keyType == "PublicIDandRole") {
      contacts = _claimsDAO.getCCST_ClaimContactViaCCRPublicID(aClaim.ClaimNumber, publicID, role, propsCC)
    }
    for (contactCCST in contacts) {
      
      var existContact = contactMap.get(role)
      
      if (existContact <> null) {
        return existContact
      }
      else 
      {
        existContact = contactMap.get(contactCCST.Role)
        if (existContact <> null) {
          return existContact
        }
        else {
          existContact = contactMap.get(contactCCST.PublicID)
          if (existContact <> null) {
            return existContact
          }
        }
      }
      
      if (contactCCST.Subtype == "Person" or contactCCST.Subtype == "Doctor" or contactCCST.Subtype == "Attorney" or contactCCST.Subtype == "Adjudicator" 
        or contactCCST.Subtype == "PersonVendor") {
        contact = buildPerson(contactCCST)
      }
      else
      if (contactCCST.Subtype == "CompanyVendor") {
        contact = buildCompanyVendor(contactCCST)
      }
      else
      if (contactCCST.Subtype == "LawFirm") {
        contact = buildLawFirm(contactCCST)
      }
      else
      if (contactCCST.Subtype == "AutoRepairShop") {
        contact = buildAutoRepairShop(contactCCST)
      }
      else
      if (contactCCST.Subtype == "LegalVenue") {
        contact = buildLegalVenue(contactCCST)
      }
      else
      if (contactCCST.Subtype == "LegacyVendorCompanyExt") {
        contact = buildLegacyVendorCompanyExt(contactCCST)
      }
      else
      if (contactCCST.Subtype == "MedicalCareOrg") {
        contact = buildMedicalCareOrg(contactCCST)
      }
      else
      if (contactCCST.Subtype == "Ex_GAIVendor") {
        contact = buildEx_GAIVendor(contactCCST)
      }
      else {
        contact = buildCompany()
      }
      contact.CellPhoneExt = contactCCST.CellPhoneExt
      contact.CloseDateExt = contactCCST.CloseDateExt
      contact.ContactEBIInstExt = contactCCST.ContactEBIInstExt
      contact.DoingBusinessAsExt = contactCCST.DoingBusinessAsExt
      contact.EmailAddress1 = contactCCST.EmailAddress1
      contact.EmailAddress2 = contactCCST.EmailAddress2
      contact.Ex_TaxReportingName = contactCCST.Ex_TaxReportingName
      contact.Ex_TaxStatusCode = contactCCST.Ex_TaxStatusCode
      contact.FaxPhone = contactCCST.FaxPhone
      contact.HomePhone = contactCCST.HomePhone
      contact.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
      contact.Name = contactCCST.ContactName
      contact.Name2Ext = contactCCST.Name2Ext
      contact.Notes = contactCCST.Notes
      contact.TaxID = contactCCST.TaxID
      contact.Preferred = contactCCST.Preferred
      contact.PrimaryAddress = buildAddress(contactCCST.PrimaryAddressID, propsCC, _claimsDAO, aClaim, addressMap)
      var addresses = _claimsDAO.getCCST_ContactAddresses(contactCCST.PublicID, propsCC)
      for (addressCCST in addresses) {
        if (addressCCST.PublicID <> contactCCST.PrimaryAddressID && addressCCST.Country <> null) {
          contact.addAddress(loadAddressData(addressCCST, aClaim))
        }
      }
      contact.PrimaryPhone = contactCCST.PrimaryPhone
      //var conAddr : ContactAddress
      //if (contact.PrimaryAddress <> null) {
      //  conAddr = new ContactAddress()
      //  conAddr.Address = contact.PrimaryAddress
      //  conAddr.AddressBookUID = contactCCST.AddressBookUID
      //  conAddr.setFieldValue("LoadCommandID",aClaim.LoadCommandID)
     // }
      contact.AddressBookUID = contactCCST.AddressBookUID
      contact.AutoSync = contactCCST.AutoSync
      contact.CMFContactExt = contactCCST.CMFContactExt
      //NEED TO ADD A LOOP-Function Call-TO ADD ALL CONTACT ADDRESSES, NOT JUST PRIMARY
      contact.TaxID = contactCCST.TaxID
      contact.TaxStatus = contactCCST.TaxStatus
      contact.TollFreeNumberExt = contactCCST.TollFreeNumberExt
      contact.DoingBusinessAsExt = contactCCST.DoingBusinessAsExt
      contact.Preferred = contactCCST.Preferred
      contact.SpecialtyType = contactCCST.SpecialtyType
      contact.ValidationLevel = contactCCST.ValidationLevel
      contact.VendorNumber = contactCCST.VendorNumber
      contact.VendorType = contactCCST.VendorType
      contact.WorkPhone = contactCCST.WorkPhone
      contact.W9ForwardedExt = contactCCST.W9ForwardedExt
      contact.W9Received = contactCCST.W9Received
      contact.W9ReceivedDate = contactCCST.W9ReceivedDate
      contact.W9ValidFrom = contactCCST.W9ValidFrom
      contact.W9ValidTo = contactCCST.W9ValidTo
      contact.WithholdingRate = contactCCST.WithholdingRate
      //contact.VerifiedPolicyContactExt = contactCCST.VerifiedPolicyContactExt
      contact.VerifiedPolicyContactExt = 0
      contact.ex_CloseDate = contactCCST.Ex_CloseDate
      contact.Ex_TaxReportingName = contactCCST.Ex_TaxReportingName
      contact.Ex_TaxStatusCode = contactCCST.Ex_TaxStatusCode
      //if (conAddr <> null) {
      //  conAddr.Contact = contact
      //  contact.addAddress(conAddr.Address)
      //}
      contactMap.put(contactCCST.PublicIDContact, contact)
    }

    return contact;
}

public function buildPerson(contactCCST : CCSTClaimContactBean) : Person {
  var person : Person
  if (contactCCST.Subtype == "Adjudicator") {
    person = buildAdjudicator(contactCCST)
  }
  if (contactCCST.Subtype == "Doctor") {
    person = buildDoctor(contactCCST)
  }
  else
  if (contactCCST.Subtype == "Attorney") {
    person = buildAttorney(contactCCST)
  }
  else
  if (contactCCST.Subtype == "PersonVendor") {
    person = buildPersonVendor(contactCCST)
  }
  else
  {
    person = new Person()
  }
  person.CellPhone = contactCCST.CellPhone
  person.Prefix = contactCCST.Prefix
  person.FirstName = contactCCST.FirstName
  person.LastName = contactCCST.LastName
  person.FormerName = contactCCST.FormerName
  person.Gender = contactCCST.Gender
  person.ContactPersonExt = contactCCST.ContactPersonExt
  person.BelowThresholdExt = contactCCST.BelowThresholdExt
  person.RefuseProvideExt = contactCCST.RefuseProvideExt
  person.DateOfBirth = contactCCST.DateOfBirth
  person.DateOfDeathExt = contactCCST.DateOfDeathExt
  person.LicenseNumber = contactCCST.LicenseNumber
  person.LicenseState = contactCCST.LicenseState
  person.MaritalStatus = contactCCST.MaritalStatus
  person.MedicareEligibleExt = contactCCST.MedicareEligibleExt
  person.MiddleName = contactCCST.MiddleName
  person.Occupation = contactCCST.Occupation
  person.Suffix = contactCCST.Suffix
  person.StopSendPartyToCMSExt = contactCCST.StopSendPartyToCMSExt
  person.TaxFilingStatus = contactCCST.TaxFilingStatus
  person.DriverNumExt = contactCCST.DriverNumExt
  return person
}

public function buildDoctor(contactCCST : CCSTClaimContactBean) : Doctor {
  var doctor = new Doctor()
  doctor.DoctorSpecialty = contactCCST.DoctorSpecialty
  doctor.MedicalLicense = contactCCST.MedicalLicense
  doctor.MedicareEligibleExt = contactCCST.MedicareEligibleExt
  doctor.LicenseNumber = contactCCST.LicenseNumber
  return doctor
}

public function buildAttorney(contactCCST : CCSTClaimContactBean) : Attorney {
  var attorney = new Attorney()
  attorney.AttorneyLicense = contactCCST.AttorneyLicense
  attorney.AttorneySpecialty = contactCCST.AttorneySpecialty
  return attorney
}

public function buildAdjudicator(contactCCST : CCSTClaimContactBean) : Adjudicator {
  var adjudicator = new Adjudicator()
  adjudicator.AdjudicativeDomain = contactCCST.AdjudicativeDomain
  adjudicator.AdjudicatorLicense = contactCCST.AdjudicatorLicense
  return adjudicator
}

public function buildAutoRepairShop(contactCCST : CCSTClaimContactBean) : AutoRepairShop {
  var autoRepairShop = new AutoRepairShop()
  autoRepairShop.DMVFacilityNumberExt = contactCCST.DMVFacilityNumberExt
  autoRepairShop.AutoRepairLicense = contactCCST.AutoRepairLicense
  return autoRepairShop
}

public function buildAutoTowingAgcy(contactCCST : CCSTClaimContactBean) : AutoTowingAgcy {
  var autoTowingAgcy = new AutoTowingAgcy()
  autoTowingAgcy.AutoTowingLicense = contactCCST.AutoTowingLicense
  return autoTowingAgcy   
}

public function buildCompany() : Company {
  var company = new Company()
  return company
}

public function buildMedicalCareOrg(contactCCST: CCSTClaimContactBean) : MedicalCareOrg {
  var medCareOrg = new MedicalCareOrg()
  medCareOrg.MedicalOrgSpecialty = contactCCST.MedicalOrgSpecialty
  return medCareOrg
}

public function buildLawFirm(contactCCST : CCSTClaimContactBean) : LawFirm {
  var lawFirm = new LawFirm()
  lawFirm.PanelIndicatorExt = contactCCST.PanelIndicatorExt
  lawFirm.LawFirmSpecialty = contactCCST.LawFirmSpecialty
  return lawFirm
}

public function buildCompanyVendor(contactCCST: CCSTClaimContactBean) : CompanyVendor {
  var vendor = new CompanyVendor()
  vendor.PayableExt = contactCCST.PayableExt
  vendor.Preferred = contactCCST.Preferred
  return vendor
}

public function buildEx_GAIVendor(contactCCST: CCSTClaimContactBean) : Ex_GAIVendor {
  var vendor = new Ex_GAIVendor()
  vendor.PayableExt = contactCCST.PayableExt
  vendor.Preferred = contactCCST.Preferred
  return vendor
}


public function buildLegacyVendorCompanyExt(contactCCST: CCSTClaimContactBean) : LegacyVendorCompanyExt {
  var legacyVendor = new LegacyVendorCompanyExt()
  legacyVendor.PayableExt = contactCCST.PayableExt
  legacyVendor.Preferred = contactCCST.Preferred
  return legacyVendor
}

public function buildPersonVendor(contactCCST: CCSTClaimContactBean) : PersonVendor {
  var vendor = new PersonVendor()
  vendor.DateOfMedicareEligibleExt = contactCCST.DateOfMedicareEligibleExt
  vendor.LicenseNumber = contactCCST.LicenseNumber
  vendor.LicenseState = contactCCST.LicenseState
  vendor.PayableExt = contactCCST.PayableExt
  vendor.Preferred = contactCCST.Preferred
  vendor.RefuseProvideExt = contactCCST.RefuseProvideExt
  vendor.MedicareEligibleExt = contactCCST.MedicareEligibleExt
  return vendor
}

public function buildLegalVenue(contactCCST : CCSTClaimContactBean) : LegalVenue {
  var legalVenue = new LegalVenue()
  legalVenue.VenueType = contactCCST.VenueType

  return legalVenue
}

public function checkClaimContactRoles(publicID : String, claimNumber : String, propsCC : HashMap, _claimsDAO : IClaimsConversionDAO) : String {
    var policyRole = ""
     var claimContactRoles : List<CCSTClaimContactBean>
    claimContactRoles = _claimsDAO.getCCST_ClaimContactViaClmContPublicID(claimNumber, publicID, propsCC)

    var clmContactRole : ClaimContactRole
    //var saveClmContactRole = new ClaimContactRole()
    for (clmContactRoleCCST in claimContactRoles) {
      if (clmContactRoleCCST.Role == "insured" or clmContactRoleCCST.Role == "underwriter") {
        policyRole = clmContactRoleCCST.Role
      }
    }
    return policyRole
}

public function buildClaimContactRoles(publicID : String, role : String, claimContact : ClaimContact, claimNumber : String, loadCommandID : int, propsCC : HashMap, _claimsDAO : IClaimsConversionDAO, keyType : String, claim : Claim, exposureMap : HashMap<String, Exposure>, contact : Contact, exposure : Exposure) : HashMap<String, ClaimContactRole> {
    var claimContactRoles : List<CCSTClaimContactBean>
    var ccrMap : HashMap<String, ClaimContactRole>
    claimContactRoles = _claimsDAO.getCCST_ClaimContactViaClmContPublicID(claimNumber, publicID, propsCC)

    var clmContactRole : ClaimContactRole
    //var saveClmContactRole = new ClaimContactRole()
    var existingRoles = claimContact.Roles
    var skipRole = false
    for (clmContactRoleCCST in claimContactRoles) {
      skipRole = false
      for (existClmContactRole in existingRoles) {
        if (existClmContactRole.Role == clmContactRoleCCST.Role && (existClmContactRole.Exposure == null or exposureMap.get(clmContactRoleCCST.ExposureID) == null or existClmContactRole.Exposure.ClaimOrder == exposureMap.get(clmContactRoleCCST.ExposureID).ClaimOrder)) {
          skipRole = true
        }
      }
      if (!skipRole) {
        clmContactRole = new ClaimContactRole()  

        clmContactRole.Active = clmContactRoleCCST.Active
        clmContactRole.Role = clmContactRoleCCST.Role
        clmContactRole.CoveredPartyType = clmContactRoleCCST.CoveredPartyType
        clmContactRole.setFieldValue("LoadCommandID", loadCommandID)
        clmContactRole.PartyNumber = clmContactRoleCCST.PartyNumber
        clmContactRole.RoleStatusExt = clmContactRoleCCST.RoleStatusExt
        clmContactRole.Comments = clmContactRoleCCST.Comments 
        //clmContactRole.PartyNumber = 1
        //clmContactRole.RoleStatusExt = "active"
        clmContactRole.setRoleOwner()

        if (clmContactRoleCCST.PolicyID <> null) {
          clmContactRole.Policy = claim.Policy
        }
        if (role == "claimant") {
          if (clmContactRoleCCST.ExposureID <> null and exposure <> null) {
            clmContactRole.Exposure = exposure
          }
        }
        else 
        if (clmContactRoleCCST.ExposureID <> null and exposureMap.get(clmContactRoleCCST.ExposureID) <> null) {
          clmContactRole.Exposure = exposureMap.get(clmContactRoleCCST.ExposureID)
        }
      
        claimContact.addToRoles(clmContactRole)
        clmContactRole.ClaimContact = claimContact
        clmContactRole.setContact(contact)
        if (role <> null and role == clmContactRole.Role.Code) {
          ccrMap = new HashMap<String, ClaimContactRole>()
          ccrMap.put(role, clmContactRole)
        }
      
      }
     }
     return ccrMap
}

public function buildTransLineItem(checkCCST : CCSTCheckBean, aClaim : Claim) : TransactionLineItem {
    var transLineItem : TransactionLineItem
    transLineItem = new TransactionLineItem()
    transLineItem.IRS1099BoxNumberExt = checkCCST.IRS1099BoxNumberExt
    transLineItem.LineCategory = checkCCST.LineCategory
    transLineItem.VendorDescriptionExt = checkCCST.VendorDescriptionExt
    transLineItem.GrossAmountExt = checkCCST.GrossAmountExt
    transLineItem.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
    return transLineItem
}

public function buildTransLineItem(recoveryCCST : CCSTRecoveryBean, aClaim : Claim) : TransactionLineItem {
    var transLineItem : TransactionLineItem
    transLineItem = new TransactionLineItem()
    transLineItem.IRS1099BoxNumberExt = recoveryCCST.IRS1099BoxNumberExt
    transLineItem.LineCategory = recoveryCCST.LineCategory
    transLineItem.VendorDescriptionExt = recoveryCCST.VendorDescriptionExt
    transLineItem.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
    return transLineItem
}
override property get Progress() : String {
     return ("Processed " + this.OperationsCompleted + " of " + OperationsExpected)}
}