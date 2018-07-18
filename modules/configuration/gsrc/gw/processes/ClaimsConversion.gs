package gw.processes
uses java.math.BigDecimal

uses java.util.Calendar
uses java.util.Date
uses java.io.File
uses java.io.PrintWriter

uses com.gaic.integration.cc.plugins.policy.PolicySearchPlugin
uses com.gaic.claims.env.Environment
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
uses com.gaic.claims.dto.CCSTReserveBean
uses gw.api.util.DateUtil
uses gw.api.database.Query
uses gw.api.util.DateUtil
uses java.math.BigDecimal
uses gw.webservice.cc.financials.IClaimFinancialsAPI
uses com.gaic.claims.dto.CCSTExposureBean
uses gw.api.util.Logger
uses com.gaic.claims.dto.CCSTBodyPartBean
uses com.gaic.claims.dto.CCSTInjuryDiagnosisBean
uses com.gaic.claims.dto.CCSTContactISOMedicareExtBean
uses com.gaic.claims.dto.CCSTContactICDExtBean
uses gaic.webservice.cc.IScriptParametersAPI
uses java.lang.Exception
uses java.util.ArrayList

class ClaimsConversion extends BatchProcessBase 
{
  var env = Environment.getInstance()
  
  construct(batchProcessType : BatchProcessBase) {
    this(batchProcessType)
  }
  
  construct() {
    super(BatchProcessType.TC_CLAIMSCONVERSION)
    Logger.logInfo("ClaimsConversion.gs called")
  }

  override function doWork() 
  {
    Logger.logInfo("************OnDemand Batch Process Started**********************")
    var PROPERTY_PATH = ""
    if (env == Environment.LOCAL) 
    {
      PROPERTY_PATH = "modules//configuration//gsrc//gw//webservice//cc//claim"
    }
    else 
    {
      PROPERTY_PATH = "//app//tomcat//tomcat-cccore//apache-tomcat-6.0.30//webapps//cc//modules//configuration//gsrc//gw//webservice//cc//claim//"
    }
    var CC_STAGING_PROPERTIES = "CCStaging.properties"
    var EM_STAGING_PROPERTIES = "EDWMessageTransportImpl.properties"
    var date = new Date()
    date.getTime()
    var cal = new GregorianCalendar()
    var month = cal.get(GregorianCalendar.MONTH) + 1
    var year = cal.get(GregorianCalendar.YEAR)
    var day = cal.get(GregorianCalendar.DAY_OF_MONTH)
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
      convErrorFileName = "ClaimsConversionErrors" + String.valueOf(year) + monthStr + dayStr + ".txt"
    }
    else {
      convErrorFileName = "ClaimsConversionErrors" + env + String.valueOf(year) + monthStr + dayStr + ".txt"
    }
    Logger.logInfo(convErrorFileName)
    var convErrorFileNameIncPath = ""
    if (env == Environment.LOCAL) 
    {
      convErrorFileNameIncPath = "c:/work/ClaimsConversionErrors"
    }
    else if (env == Environment.DEV5) 
    {
      convErrorFileNameIncPath = "/app/hcl/logs/ccdev5/ClaimsConversionErrors"
    }
    else if (env == Environment.DEV4) 
    {
      convErrorFileNameIncPath = "/app/hcl/logs/ccdev4/ClaimsConversionErrors"
    }
    else if (env == Environment.DEV3) 
    {
      convErrorFileNameIncPath = "/app/tomcat/tomcat-ccdev3/apache-tomcat-6.0.30/temp/ClaimsConversionErrors"
    }
    else
    {
      convErrorFileNameIncPath = "/app/tomcat/tomcat-cccore/apache-tomcat-6.0.30/temp/ClaimsConversionErrors"
    }
    var errorFileNameFull = ""
    if (env == Environment.PROD or env == Environment.UAT) 
    {
      errorFileNameFull = convErrorFileNameIncPath + String.valueOf(year) + monthStr + dayStr + ".txt"
    }
    else 
    {
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
    var ccstClaim = _claimsDAO.getCCST_Claims_Group(propsCC)
    var loadCommand : LoadCommand = null 
    var paramName = "GOSULoadCommandID"
    var loadCommandID : int
    var aClaim : Claim
    var failedClaimMap = new HashMap<String, CCSTClaimBean>()
    var claimNbr = 0
    var exposureMap = new HashMap<String, Exposure>()
    var expAssignMap = new  HashMap<String, CCSTExposureBean>()   
    var groupNumber = 1
    var faultFlag = 0
    var scriptParameterAPI = new IScriptParametersAPI()
    while (not ccstClaim.Empty and !this.TerminateRequested)
    {
      gw.transaction.Transaction.runWithNewBundle(\ bundleLoadCommand -> 
      {
        bundleLoadCommand.add(loadCommand)
        loadCommand = new LoadCommand()
        var loadCommandCCST = _claimsDAO.getCCST_LoadCommand(propsCC).first()
        loadCommand.CallingUser = User (loadCommandCCST.CallingUserID)
        loadCommand.CommandType = LoadCommandType.TC_SOURCELOADED
        loadCommand.Description = loadCommandCCST.Description
        loadCommand.StartTime = java.util.Date.CurrentDate
        loadCommand.ErrorCount = 0
        bundleLoadCommand.commit()  
      }, "conversionuser")
      loadCommandID = loadCommand.ID.toString() as int
      scriptParameterAPI.setCurrentConversionLoadCommandID(paramName, loadCommandID as java.lang.String)
      Logger.logInfo("************LoadCommandid*"+loadCommandID)
      var _iter = ccstClaim.iterator()
      OperationsExpected = ccstClaim.Count + claimNbr
      while (_iter.hasNext()) 
      {
        var claimCCST = _iter.next()
        if(!this.TerminateRequested)
        {
          claimNbr++
          try 
          {
            exposureMap.clear()
            expAssignMap.clear()
            Logger.logInfo("Claim " + claimNbr + " of " + OperationsExpected)
            gw.transaction.Transaction.runWithNewBundle(\ bundle -> 
            {
              aClaim = processClaimAllRecs(claimCCST, propsCC, _claimsDAO, loadCommandID, exposureMap, expAssignMap)
            }, "conversionuser")
            
            closeFeatures(aClaim, claimCCST.State, expAssignMap)
              if (claimCCST.State == "closed" and !aClaim.Closed) 
              {
       	        Logger.logInfo("Claim is being closed")
      	        updateClaimState(aClaim, claimCCST)
      	      }
            incrementOperationsCompleted()
  	    faultFlag = 0
  	  }  
  	  catch(e1:Exception) 
  	  {
            Logger.logError(e1.Message)
            pwError.println(claimCCST.ClaimNumber + " " + claimCCST.LossDate + " " + e1)
            failedClaimMap.put(claimCCST.ClaimNumber, claimCCST)
            incrementOperationsFailed()
            faultFlag = 1
          }
  	  gw.transaction.Transaction.runWithNewBundle(\ bundle -> 
  	  {
      	    updateClaimProcStatus(claimCCST, faultFlag as java.lang.String, 
  	                              groupNumber as java.lang.String, propsCC, _claimsDAO)
          }, "su")
        }
        _iter.remove()
      }
      groupNumber++
      ccstClaim = _claimsDAO.getCCST_Claims_Group(propsCC)
    }
    gw.transaction.Transaction.runWithNewBundle(\ bundle -> 
    {
      removeEDWMessageTrans(failedClaimMap, propsEM, _EDWMsgDAO)
    }, "su")
    
    if (loadCommand != null)
    {
      gw.transaction.Transaction.runWithNewBundle(\ bundle -> 
      {
        bundle.add(loadCommand)
        loadCommand.EndTime = java.util.Date.CurrentDate
      }, "su")
    }
    
    gw.transaction.Transaction.runWithNewBundle(\ bundle -> 
    {
      _claimsDAO.resetAllPrevGrpIDForFailedClms(propsCC)
    }, "su")
    try 
    {
      pwError.flush();
      pwError.close();
    }
    catch (fe : FileNotFoundException) 
    {
      fe.printStackTrace();
    }
    var prop = System.getProperties();
    var ses1 = Session.getDefaultInstance(prop, null)
    var msg = new MimeMessage(ses1)
    msg.setFrom(new InternetAddress("ClaimCenter@gaig.com"))
    var to_address = DocumentConstants.TO
    if (env == Environment.PROD) 
    {
      to_address = "ClaimCenterSupport@gaig.com"
    }
    else
    {
      to_address = "ClaimCenterTesting@gaig.com"
    }
    msg.addRecipient(Message.RecipientType.TO, new InternetAddress(to_address));
    var messageBodyPart = new MimeBodyPart();
    Logger.logInfo(env.toString())
    if (env <> Environment.PROD) 
    {
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
    Logger.logInfo("msg=" + msg)
    Logger.logInfo("OnDemand Batch Process Executed Successfully")
    if (env <> Environment.LOCAL) 
    {
      Transport.send(msg)
    }
  }
  
  public function processClaimAllRecs(claimCCST : CCSTClaimBean, propsCC : HashMap,_claimsDAO : IClaimsConversionDAO,
                                      loadCommandID : Integer, exposureMap : HashMap < String, Exposure >, 
                                      expAssignMap : HashMap< String, CCSTExposureBean >) : Claim 
  {
    Logger.logInfo("Processing ClaimAllRecs: ClaimNumber"+claimCCST.ClaimNumber)	
    var policyID = ""
    var aClaim = new Claim()
    //The key will contain publicids for most contacts, but the roles for contacts from PSAR since publicids 
    //from EDW don't match what the ETLs are setting at all.
    var contactMap = new HashMap<String, Contact>() 
    var claimContactMap = new HashMap<String, ClaimContact>()
    var addressMap = new HashMap<String, Address>()
    try 
    {
      buildClaim(aClaim, claimCCST, propsCC, _claimsDAO, contactMap, loadCommandID, addressMap, claimContactMap)
    } 
    catch (e1) 
    {
      throw (e1)
    }
    policyID = claimCCST.PolicyID
    var policy : Policy
    try 
    {
      policy = buildPolicy(policyID, propsCC, _claimsDAO, contactMap, claimContactMap, aClaim, loadCommandID)
    } 
    catch (e2) 
    
    {
      throw (e2)
    }
    aClaim.Policy = policy 
        
    //Build CLEEExt call for Claim WC New Attribute
    if (claimCCST.CLEEExt <> null)
    {
      if (policy.CLEECodesExt.Count > 0)
      {
        var claimCLEEExt = _claimsDAO.getCCST_CLEEExt(claimCCST.CLEEExt, propsCC).first()
        for (var cleeExt in policy.CLEECodesExt)
        {
          if(cleeExt.CodeExt == claimCLEEExt.CodeExt)
          {
              aClaim.CLEEExt = cleeExt
              cleeExt.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
          }
        }
      }
      else
      {
        var CLEEExtID = claimCCST.CLEEExt 
        try 
        {
          buildCLEEExt(CLEEExtID, propsCC, _claimsDAO, aClaim)
        }
        catch (e6) 
        {
          throw (e6)
        }
      }
    }
		
   //Build ClaimWorkComp call for Claim WC New Attribute
    if (claimCCST.ClaimWorkCompID <> null)
    {
      var workCompID = claimCCST.ClaimWorkCompID
      var workComp : ClaimWorkComp
      try 
      {
        workComp = buildClaimWorkComp(workCompID, propsCC, _claimsDAO, aClaim)
      }
      catch (e7) 
      {
        throw (e7)
      }
    }
    
    //Build EmploymentData call for Claim WC New Attribute
    if (claimCCST.EmploymentDataID <> null)
    {
      var empDataID = claimCCST.EmploymentDataID
      var empData : EmploymentData
      try 
      {
        empData = buildEmploymentData(empDataID, propsCC, _claimsDAO, aClaim)
      }
      catch (e8) 
      {
        throw (e8)
      }
    }
    
    //LocationCodeID Mapping for Claim WC New Attribute
    var riskUnits = policy.RiskUnits
    for (riskUnit in riskUnits) 
    {
      if (riskUnit.Subtype == "PropertyRU")
      {
        var propertyRiskUnit = riskUnit as PropertyRU
        if ( propertyRiskUnit.PropertyNumberExt == claimCCST.PropertyNumberExt) 
        {
          aClaim.LocationCode = propertyRiskUnit.PolicyLocation
        }
      }
    }
        
    try 
    {
      callMigrateClaim(aClaim, claimCCST, propsCC, _claimsDAO, policy, contactMap, claimContactMap, 
	                   addressMap, exposureMap, expAssignMap)
    }
    catch (e9) 
    {
      throw (e9)
    }
    if (exposureMap <> null) 
    {
      try 
      {
        var rsvAmt = 0.0 
        for (exposureRec in exposureMap.entrySet()) 
	{
          var exposure = exposureRec.getValue()
          try 
          {
            rsvAmt = buildOriginalReserve("claimcost", exposure, aClaim, _claimsDAO, propsCC) as double
	        buildChecks(aClaim, rsvAmt, propsCC, _claimsDAO, exposure, contactMap, 
	                claimContactMap, addressMap)
            }
          catch (e10) 
          {
    	    throw (e10)
          }
	}
      } 
      catch (e11) 
      {
        throw (e11)
      }
      try 
      {
	buildRecoveries(aClaim, propsCC, _claimsDAO, exposureMap, contactMap, addressMap)
      } 
      catch (e12) 
      {
	throw (e12)
      }
    }
    Logger.logInfo("ClaimAllRecs for ClaimNumber"+claimCCST.ClaimNumber+ "is Processed Successfully")
    return aClaim
  }

  public function updateClaimState(aClaim : Claim, claimCCST : CCSTClaimBean) 
  {
    gw.transaction.Transaction.runWithNewBundle(\ bundle -> 
    {
      bundle.add(aClaim)
    var claimAPI = new IClaimAPI()
    try 
    {
      claimAPI.closeClaim(aClaim.PublicID, claimCCST.ClosedOutcome, "Closed")
      aClaim.CloseDate = claimCCST.CloseDate
    }
    catch (e8) 
    {
      throw (e8)
    }
    }, "conversionuser")
  }

  public function closeFeatures(aClaim : Claim, clmState : String, expAssignMap : HashMap<String, CCSTExposureBean>) 
  {
    try 
    {
      var exposures = aClaim.Exposures
      gw.transaction.Transaction.runWithNewBundle(\ bundle -> 
      {
        var activities = aClaim.Activities
        var claimAPI = new IClaimAPI()
        for (activity in activities) 
        {
          bundle.add(activity)
          var activityPublicID = activity.PublicID
          if (activity.CloseDate == null && 
              ((activity.Exposure == null and clmState == "closed") or 
                activity.Exposure.ClosedOutcome <> null )) 
          {
            claimAPI.completeActivity(activityPublicID)
          }
  }
      }, "conversionuser")

      for (exposure in exposures) 
      {
        gw.transaction.Transaction.runWithNewBundle(\ bundle -> 
        {
          bundle.add(exposure)
          var exposureCCST = expAssignMap.get(exposure.PublicID)
          var assignResult = exposure.assign(Group(exposureCCST.AssignedGroupID), 
                                             User(exposureCCST.AssignedUserID))
          if (assignResult <> true) 
          {
            Logger.logInfo("assignment failed for claim " + aClaim.ClaimNumber + " exposure " + exposure.PublicID)
          }
          if (exposure.ClosedOutcome <> null) 
          {
            if (!exposure.Closed) 
            {   
              try 
              {
                var exposureAPI = new gw.api.webservice.cc.exposure.ExposureAPIImpl()
                var closeDate = exposure.CloseDate
                exposure.SSDIEligible = exposureCCST.MedicareExposureExt
                exposureAPI.closeExposure(exposure.PublicID,    exposure.ClosedOutcome, "Legacy Claim Closed") 
                exposure.MedicareExposureExt = exposureCCST.MedicareExposureExt  
                exposure.CloseDate = closeDate
              } 
              catch (e9) 
              {
               Logger.logInfo("closed exposure")
               throw (e9)
             }
           }
         }
        }, "conversionuser")
      }
    }
    catch (e1)
    {
      throw e1
    }
  }

  public function updateClaimProcStatus(claimCCST : CCSTClaimBean, faultFlag : String, groupNumber : String, 
                                        propsCC : HashMap, _claimsDAO : IClaimsConversionDAO) 
  {
    _claimsDAO.updateFaultFlagOnClaim(claimCCST.ClaimNumber, faultFlag, groupNumber, propsCC)
  }

  public function removeEDWMessageTrans(failedClaimMap : HashMap<String, CCSTClaimBean>,  propsEM : HashMap,
                                        _EDWMsgDAO : IClaimsConversionDAO) 
  {
    for (failedClaimKey in failedClaimMap.keySet()) 
    {
      _EDWMsgDAO.deleteFromEDWMessageTransaction(failedClaimKey, propsEM)  
    }
  }

  public function buildChecks(aClaim : Claim, rsvAmt : BigDecimal, propsCC : HashMap, 
                              _claimsDAO : IClaimsConversionDAO, exposure : Exposure, 
                              contactMap : HashMap<String, Contact>,
                              claimContactMap : HashMap<String, ClaimContact>, addressMap : HashMap<String, Address>) 
  {
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
    while (_iter.hasNext()) 
    {
      var checkCCST = _iter.next()
      Logger.logInfo("Processing BuildChecks with PublicID " + checkCCST.PublicID)
      if(this.TerminateRequested)
      {
        break
      }
      if (checkCCST.CostType == "claimcost" and firstClaimCost) 
      {
        totRsvAmtRem = buildUpdatedReserve(checkCCST, exposure, aClaim, _claimsDAO, propsCC)
        firstClaimCost = false
      }
      else if (checkCCST.CostType == "expense" and firstExpense)
      {
        totRsvAmtRem = buildUpdatedReserve(checkCCST, exposure, aClaim, _claimsDAO, propsCC)
        firstExpense = false
        }
      var keyType = "PublicIDandRole"
      var payeeContact : Contact
      var payeeClaimContactRole : ClaimContactRole
      var payeeClaimContact = findClaimContact(aClaim, checkCCST.ClmContactCheckPayeeID, _claimsDAO, claimContactMap, propsCC)
      if (payeeClaimContact <> null) 
      {
        payeeContact = payeeClaimContact.Contact 
        var existingCheckPayee = payeeClaimContact.Roles.where(\ c -> c.Role == ContactRole.TC_CHECKPAYEE)
        if (existingCheckPayee.Count > 0)
        {
          payeeClaimContactRole = existingCheckPayee.first()
        }
        else
        {
          var ccrMap = buildClaimContactRoles(checkCCST.ClmContactCheckPayeeID, "checkpayee", payeeClaimContact, 
                                 aClaim.ClaimNumber, aClaim.LoadCommandID, propsCC, _claimsDAO, 
                                 aClaim, null)
          payeeClaimContactRole = ccrMap.get("checkpayee") 
        }
      }
      else 
      {
        var isPolicyRoleFound = checkPayeeType(checkCCST.PayeeType)
        if (isPolicyRoleFound) 
        {
          payeeClaimContact = claimContactMap.get(checkCCST.PayeeType)
          payeeContact = contactMap.get(checkCCST.PayeeType)
          var existingCheckPayee = payeeClaimContact.Roles.where(\ c -> c.Role == ContactRole.TC_CHECKPAYEE)
          if (existingCheckPayee.Count > 0)
          {
            payeeClaimContactRole = existingCheckPayee.first()
          }
          else
          {
            var ccrMap = buildClaimContactRoles(checkCCST.ClmContactCheckPayeeID, "checkpayee", payeeClaimContact, 
                                 aClaim.ClaimNumber, aClaim.LoadCommandID, propsCC, _claimsDAO, 
                                 aClaim, null)
            payeeClaimContactRole = ccrMap.get("checkpayee") 
          }
        }
        else 
        {
          payeeClaimContact = buildClaimContact(checkCCST.ClmContactCheckPayeeID, "checkpayee", aClaim, propsCC, 
                                                _claimsDAO, null, keyType, claimContactMap, null)
          payeeContact = buildContact(checkCCST.ClmContactCheckPayeeID, "checkpayee", aClaim, propsCC, 
                                      _claimsDAO, null, keyType, contactMap, addressMap, null)
          payeeClaimContact.Contact = payeeContact
          claimContactMap.put(payeeClaimContact.PublicID, payeeClaimContact)
          contactMap.put(payeeContact.PublicID, payeeContact)
          var ccrMap = buildClaimContactRoles(checkCCST.ClmContactCheckPayeeID, "checkpayee", payeeClaimContact, 
                                 aClaim.ClaimNumber, aClaim.LoadCommandID, propsCC, _claimsDAO, 
                                 aClaim, null)
          payeeClaimContactRole = ccrMap.get("checkpayee") 
        }
      }
                                
      var recipientClaimContact : ClaimContact
      recipientClaimContact = findClaimContact(aClaim, checkCCST.Ex_MailTo, _claimsDAO, claimContactMap, propsCC)
      var recipientContact : Contact
      if ( recipientClaimContact <> null)
      {
        recipientContact = recipientClaimContact.Contact
      }
      else
      {
        recipientContact = buildContact(checkCCST.Ex_MailTo, "checkpayee", aClaim, propsCC, _claimsDAO, null, 
                                          "PublicIDandRole", contactMap, addressMap, null)
      }
      var erodesReserves = true
      ccCheck  = exposure.CheckCreator.withPayTo(checkCCST.PayTo)
                                      .withReportabilityType(ReportabilityType.get(checkCCST.Reportability))
                                      .withCheckAmount(checkCCST.TransactionAmount)
                                      .withPayee(payeeContact)
                                      .withCostType(checkCCST.CostType)
                                      .withCostCategory(checkCCST.CostCategory)
                                      .withCheckCurrency(Currency.get(checkCCST.Currency.trim()))
                                      .withLineCategory(checkCCST.LineCategory)
                                      .withPaymentType(PaymentType.TC_PARTIAL)
                                      .withPayeeRole(payeeClaimContactRole.Role)
                                      .withMailToAddress(buildAddress(checkCCST.MailToAddress,  propsCC, _claimsDAO, aClaim, addressMap))
                                      .withErodesReserves(erodesReserves)
                                      .withRecipient(recipientContact)
      try 
      {
        check = ccCheck.create()
      } 
      catch (e1) 
      {
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
      for (payee in check.Payees) 
      {
        checkPayee = payee
      }
      checkPayee.Payee = payeeContact
      checkPayee.IsOriginalPayeeExt = checkCCST.IsOriginalPayeeExt
      checkPayee.PayeeDateAddedExt = checkCCST.PayeeDateAddedExt
      checkPayee.PayeeType = checkCCST.PayeeType
      checkPayee.PayeeDenorm = payeeContact
      //CheckPayee New Atrribute Mapping for WC
      checkPayee.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
      checkPayee.PublicID = checkCCST.PublicID
      checkPayee.Check = check
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
      check.PayToLine1Ext = checkCCST.PayToLine1Ext
      check.PrefixExt = checkCCST.PrefixExt
      check.Reportability = ReportabilityType.get(checkCCST.Reportability)
      issueDate = Calendar.getInstance()
      issueDate.setTime(checkCCST.IssueDate)
      check.TypeOfCheckExt = checkCCST.TypeOfCheckExt
      check.UpdateCheckHistoryExt = checkCCST.UpdateCheckHistoryExt
      check.ex_DateEndorsed = checkCCST.Ex_DateEndorsed
      check.ex_DatePrinted = checkCCST.Ex_DatePrinted
      check.ex_DraftRegion = checkCCST.Ex_DraftRegion
      check.ex_MailTo = buildContact(checkCCST.Ex_MailTo, "", aClaim, propsCC, _claimsDAO, null, "ContPublicID", contactMap, addressMap, null)
      check.MailToAddress = checkCCST.MailToAddress
      check.ex_MailToAddress = buildAddress(checkCCST.Ex_MailToAddress,  propsCC, _claimsDAO, aClaim, addressMap)
      check.ex_ManualPaymentMethod = checkCCST.Ex_ManualPaymentMethod
      check.ex_PayToAddress = buildAddress(checkCCST.Ex_PayToAddress,  propsCC, _claimsDAO, aClaim, addressMap)
      check.ex_ProducerCopy = checkCCST.Ex_ProducerCopy
      checkSet = check.CheckSet
      check.PendEscalationForBulk = checkCCST.PendEscalationForBulk
      check.Claim = aClaim
      check.PublicID = checkCCST.PublicID
      checkSet.ApprovalStatus =  ApprovalStatus.get(checkCCST.ApprovalStatus)
      var checkRequestor = User (checkCCST.RequestingUserID)
      checkSet.ApprovalDate = checkCCST.ApprovalDate
      checkSet.RequestingUser = checkRequestor
      checkSet.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
      payment = check.Payments.first()
      //payment.Status = TransactionStatus.get(checkCCST.StatusTran)
      payment.AccountingMonthExt = checkCCST.AccountingMonthExt
      payment.AccountingYearExt = checkCCST.AccountingYearExt
      payment.Claim = aClaim
      payment.CloseClaim = checkCCST.CloseClaim
      payment.CloseExposure = checkCCST.CloseExposure
      payment.DeductiblePaid = checkCCST.DeductiblePaid
      payment.DeductibleSubtracted = checkCCST.DeductibleSubtracted
      payment.ErodesReserves = true
      payment.RptCreateDateExt = checkCCST.RptCreateDateExt
      payment.SubmitDate = checkCCST.SubmitDate
      //New Attribute Transaction Mapping for WC
      payment.WCInjuryTypeExt = WCInjuryTypeExt.get(checkCCST.WCInjuryTypeExt)
      payment.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
      var transLineItem = payment.FirstLineItem
      transLineItem.IRS1099BoxNumberExt = checkCCST.IRS1099BoxNumberExt
      transLineItem.LineCategory = checkCCST.LineCategory
      transLineItem.VendorDescriptionExt = checkCCST.VendorDescriptionExt
      transLineItem.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
      transLineItem.Comments = checkCCST.Comments
      transLineItem.GrossAmountExt = checkCCST.GrossAmountExt
      transLineItem.Transaction = payment
      transLineItem.TransactionQualifierExt = checkCCST.TransactionQualifierExt
      transLineItem.ApplyDeductions = checkCCST.ApplyDeductions
      try 
      {
        var claimFinancialsAPI = new IClaimFinancialsAPI()
        claimFinancialsAPI.addClaimFinancialsWithValidation(check.CheckSet, false)
        if (checkCCST.Status == "cleared") 
        {
          var checkQuery = gw.api.database.Query.make(entity.Check)
          checkQuery.compare("CheckNumber", Equals, check.CheckNumber)
          var checkQueryResult = checkQuery.select()
          for (checkOcc in checkQueryResult) 
          {
            if (checkOcc.Claim == aClaim) 
            {
              claimFinancialsAPI.updateCheckStatus(checkOcc.PublicID, null, null, TransactionStatus.TC_CLEARED, null)
              checkOcc.Payments[0].Status = TransactionStatus.get(checkCCST.StatusTran)
              break
            }
          }
        }
      totRsvAmtRem = totRsvAmtRem - checkCCST.TransactionAmount
      } 
      catch (e2) 
      {
        throw (e2)
      }
      _iter.remove()
    }
    if (firstClaimCost) 
    {
      var found = buildCurrentReserve(aClaim, exposure, "claimcost", propsCC, _claimsDAO, rsvAmt)
      if (!found and exposure.ClosedOutcome <> null)
      {
        buildClosingReserve(aClaim, exposure, "claimcost", propsCC, _claimsDAO, rsvAmt)
      }
  }
  }

  public function buildRecoveries(aClaim : Claim, propsCC : HashMap, _claimsDAO : IClaimsConversionDAO, 
                                  exposureMap : HashMap<String, Exposure>, contactMap : HashMap<String, Contact>, 
                                  addressMap : HashMap<String, Address>) 
  {
    var recoveryRsvMap = new HashMap<String, RecoveryReserve>()
    var recoveries = _claimsDAO.getCCST_Recovery(aClaim.ClaimNumber, propsCC)
    var recovery : Recovery
    var recoveryReserve : RecoveryReserve
    for (recoveryCCST in recoveries) 
    {
      Logger.logInfo("Processing BuildRecoveries with Exposure PublicID " + recoveryCCST.PublicIDExp +" and Transaction PublicID "
                     +recoveryCCST.PublicIDTran+ "and TransactionLine Item PublicID "+recoveryCCST.PublicIDTranLnItem)
      var exposure = exposureMap.get(recoveryCCST.ExposureID)
      if (recoveryCCST.Subtype == "RecoveryReserve") 
      {
        recoveryReserve = exposure.setOpenRecoveryReserves(recoveryCCST.CostType, recoveryCCST.CostCategory, recoveryCCST.RecoveryCategory, recoveryCCST.TransactionAmount, User (recoveryCCST.RequestingUserID))
        recoveryReserve.AccountingMonthExt = recoveryCCST.AccountingMonthExt
        recoveryReserve.AccountingYearExt = recoveryCCST.AccountingYearExt
        recoveryReserve.RptCreateDateExt = recoveryCCST.RptCreateDateExt
        recoveryReserve.Status = TransactionStatus.get(recoveryCCST.StatusTran)
        recoveryReserve.SubmitDate = recoveryCCST.SubmitDate
        //New Attribute Transaction Mapping for WC
        recoveryReserve.WCInjuryTypeExt = WCInjuryTypeExt.get(recoveryCCST.WCInjuryTypeExt)
        recoveryReserve.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
        var recRsvTrans = recoveryReserve.TransactionSet.Transactions
        for (recoveryReserveTrans in recRsvTrans) 
        {
          if (recoveryReserveTrans typeis RecoveryReserve) 
          {
            recoveryReserveTrans.AccountingMonthExt = recoveryCCST.AccountingMonthExt
            recoveryReserveTrans.AccountingYearExt = recoveryCCST.AccountingYearExt
            recoveryReserveTrans.RptCreateDateExt = recoveryCCST.RptCreateDateExt
            recoveryReserveTrans.Status = TransactionStatus.get(recoveryCCST.StatusTran)
            //New Attribute Transaction Mapping for WC
            recoveryReserveTrans.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
            recoveryReserveTrans.WCInjuryTypeExt = WCInjuryTypeExt.get(recoveryCCST.WCInjuryTypeExt)
          }  
        }  
        recoveryReserve.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
        var transLineItems : TransactionLineItem[]
        transLineItems = recoveryReserve.TransactionSet.LineItems
        for (transLineItem in transLineItems) 
        {
          transLineItem.IRS1099BoxNumberExt = recoveryCCST.IRS1099BoxNumberExt
          transLineItem.LineCategory = recoveryCCST.LineCategory
          transLineItem.VendorDescriptionExt = recoveryCCST.VendorDescriptionExt
          transLineItem.TransactionQualifierExt = recoveryCCST.TransactionQualifierExt
          //New Attribute Transaction Mapping for WC
          transLineItem.ApplyDeductions = recoveryCCST.ApplyDeductions
          transLineItem.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
          transLineItem.Comments = recoveryCCST.Comments
        }
        var transSet : TransactionSet
        transSet = recoveryReserve.TransactionSet
        transSet.ApprovalDate = recoveryCCST.ApprovalDate
        transSet.ApprovalStatus = recoveryCCST.ApprovalStatus
        transSet.Claim = aClaim 
        transSet.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
        recoveryRsvMap.put(recoveryCCST.PublicIDTran, recoveryReserve)
        try 
        {
          var claimFinancialsAPI = new IClaimFinancialsAPI()
    	  var tsar = claimFinancialsAPI.addClaimFinancialsWithValidation(transSet, false)
    	  if (tsar.getValidationErrors().length > 0) 
    	  {
            Logger.logInfo("after call to add Financials; result: " + tsar.getValidationErrors()[0])
          }
        }
        catch (e1) 
        {
  	      Logger.logError(e1.Message)
  	      throw(e1)
        }
      }
      else 
      {
        var payer = buildContact(recoveryCCST.ClaimContactID, "payer", aClaim, propsCC, _claimsDAO, null, "ClmContPublicID", contactMap, addressMap, null)
        recovery = exposure.createRecovery(payer, recoveryCCST.CostType, recoveryCCST.CostCategory, recoveryCCST.RecoveryCategory, recoveryCCST.LineCategory, recoveryCCST.TransactionAmount, recoveryCCST.Comments, User (recoveryCCST.RequestingUserID))
        recovery.AccountingMonthExt = recoveryCCST.AccountingMonthExt
        recovery.AccountingYearExt = recoveryCCST.AccountingYearExt
        recovery.RptCreateDateExt = recoveryCCST.RptCreateDateExt
        //recovery.Status = recoveryCCST.StatusTran
        recovery.Status = TransactionStatus.get(recoveryCCST.StatusTran)
        recovery.ex_recoverycheckdate = recoveryCCST.Ex_recoverycheckdate
        recovery.ex_recoveryCheckNumber = recoveryCCST.Ex_recoveryCheckNumber
        recovery.ex_CashReceiptNumber = recoveryCCST.Ex_CashReceiptNumber
        recovery.SubmitDate = recoveryCCST.SubmitDate
        //New Attribute Transaction Mapping for WC
        recovery.WCInjuryTypeExt = WCInjuryTypeExt.get(recoveryCCST.WCInjuryTypeExt)
        recovery.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
        recovery.RecodeExt = false
        var recTrans = recovery.TransactionSet.Transactions
        for (recoveryTrans in recTrans) 
        {
          if (recoveryTrans typeis RecoveryReserve) 
          {
            recoveryTrans.AccountingMonthExt = recoveryCCST.AccountingMonthExt
            recoveryTrans.AccountingYearExt = recoveryCCST.AccountingYearExt
            recoveryTrans.RptCreateDateExt = recoveryCCST.RptCreateDateExt
            recoveryTrans.Status = TransactionStatus.get(recoveryCCST.StatusTran)
            //New Attribute Transaction Mapping for WC
            recoveryTrans.WCInjuryTypeExt = WCInjuryTypeExt.get(recoveryCCST.WCInjuryTypeExt)
            recoveryTrans.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
          }  
        }  
        var transLineItems : TransactionLineItem[]
        transLineItems = recovery.TransactionSet.LineItems
        for (transLineItem in transLineItems) 
        {
          transLineItem.IRS1099BoxNumberExt = recoveryCCST.IRS1099BoxNumberExt
          transLineItem.LineCategory = recoveryCCST.LineCategory
          transLineItem.VendorDescriptionExt = recoveryCCST.VendorDescriptionExt
          transLineItem.TransactionQualifierExt = recoveryCCST.TransactionQualifierExt
          //New Attribute Transaction Mapping for WC
          transLineItem.ApplyDeductions = recoveryCCST.ApplyDeductions
          transLineItem.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
          transLineItem.Comments = recoveryCCST.Comments
        }
        var transSet : TransactionSet
        transSet = recovery.TransactionSet
        transSet.ApprovalDate = recoveryCCST.ApprovalDate
        transSet.ApprovalStatus = recoveryCCST.ApprovalStatus
        transSet.Claim = aClaim     
        transSet.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
        var recToRecReserve = new RecToRecReserves()
        recToRecReserve.ForeignEntity = recoveryRsvMap.get(recoveryCCST.ForeignEntityID)
        recToRecReserve.Owner = recovery
        recToRecReserve.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
        try 
        {
          var claimFinancialsAPI = new IClaimFinancialsAPI()
  	      var tsar = claimFinancialsAPI.addClaimFinancialsWithValidation(transSet, false)
          if (tsar.getValidationErrors().length > 0) 
          {
            Logger.logInfo("after call to add Financials; result: " + tsar.getValidationErrors()[0]);
          }
        }
        catch (e1) 
        {
          Logger.logError(e1.Message)
          throw(e1)
        }
      }
    }
  }

  public function checkPayeeType(payeeType : String) :  boolean 
  {
    if (payeeType == "insured"or payeeType == "underwriter") 
    {
      return true
    }
    else 
    {
      return false
    }
  }
  
  public function buildCurrentReserve(aClaim : Claim, exposure : Exposure, costType : String, 
                                      propsCC : HashMap, _claimsDAO : IClaimsConversionDAO, 
                                      rsvAmt : BigDecimal) : boolean 
  {
    Logger.logInfo("Processing buildCurrentReserve with ExposurePublicID " + exposure.ID +" and Cost Type" + costType)
    var reserves : List<CCSTReserveBean>
    reserves = _claimsDAO.getCurrent_Reserve(aClaim.ClaimNumber, propsCC, exposure.PublicID, costType)
    var reserveSet : ReserveSet
    var found = false
    var reserve : Reserve
    for (reserveCCST in reserves) 
    {
      found = true
      var submittingUser : User
      if (reserveCCST.RequestingUserID == null) 
      {
        submittingUser = User ("user:50010")
      }
      else 
      {
        submittingUser = User (reserveCCST.RequestingUserID)
      }
      if (costType == "claimcost" and rsvAmt <> reserveCCST.TransactionAmount) 
      {
        reserve = exposure.setAvailableReserves(costType, reserveCCST.CostCategory, 
                                                reserveCCST.TransactionAmount, submittingUser)
      }
      if (reserve <> null) 
      {
        reserve.AccountingMonthExt = reserveCCST.AccountingMonthExt
        reserve.AccountingYearExt = reserveCCST.AccountingYearExt
        reserve.Status = TransactionStatus.get (reserveCCST.StatusTran)
        reserve.SubmitDate = reserveCCST.SubmitDate
        reserve.RptCreateDateExt.Time = reserveCCST.RptCreateDateExt.Time  + 1 
        reserve.Comments = reserveCCST.Comments
        //New Attribute Transaction Mapping for WC
        reserve.WCInjuryTypeExt = WCInjuryTypeExt.get(reserveCCST.WCInjuryTypeExt)
        reserve.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
        reserveSet = reserve.TransactionSet as ReserveSet
        reserveSet.RequestingUser = User ( reserveCCST.RequestingUserID )
        reserveSet.ApprovalDate = reserveCCST.ApprovalDate
        reserveSet.ApprovalStatus = reserveCCST.ApprovalStatus
        var reserveLineItem = reserve.LineItems[0]
        reserveLineItem.IRS1099BoxNumberExt = reserveCCST.IRS1099BoxNumberExt
        reserveLineItem.LineCategory = reserveCCST.LineCategory
        reserveLineItem.VendorDescriptionExt = reserveCCST.VendorDescriptionExt
        reserveLineItem.Comments = reserveCCST.Comments
        reserveLineItem.Transaction = reserve
        reserveLineItem.TransactionQualifierExt = reserveCCST.TransactionQualifierExt
        reserveLineItem.ApplyDeductions = reserveCCST.ApplyDeductions
        reserveLineItem.setFieldValue("LoadCommandID", aClaim.LoadCommandID) 
        try 
        {
          var claimFinancialsAPI = new IClaimFinancialsAPI()
	      claimFinancialsAPI.addClaimFinancials(reserveSet)
        } 
        catch (e1) 
        {
	  Logger.logError(e1.Message)
          throw(e1)
        }
      }
    }
    return found
  }

  public function buildClosingReserve(aClaim : Claim, exposure : Exposure, costType : String, propsCC : HashMap, 
                                      _claimsDAO : IClaimsConversionDAO, rsvAmt : BigDecimal) 
  {
    Logger.logInfo("Processing buildClosingReserve with ExposurePublicID " + exposure.ID +" and Cost Type" + costType)
    var reserves : List<CCSTReserveBean>
    var reserveType = "closing"
    reserves = _claimsDAO.getClosing_Reserve(aClaim.ClaimNumber, propsCC, exposure.PublicID, costType)
    if (reserves == null) 
    {
      reserves = _claimsDAO.getOriginal_Reserve(aClaim.ClaimNumber, propsCC, exposure.PublicID, costType)
      reserveType = "original"
    }
    var reserveSet : ReserveSet
    var reserve : Reserve
    for (reserveCCST in reserves) 
    {
      reserveCCST.TransactionAmount = 0
      var submittingUser : User
      if (reserveCCST.RequestingUserID == null) 
      {
        submittingUser = User ("user:50010")
      }
      else 
      {
        submittingUser = User (reserveCCST.RequestingUserID)
      }
      if (costType == "claimcost" and rsvAmt <> reserveCCST.TransactionAmount) 
      {
      reserve = exposure.setAvailableReserves(costType, reserveCCST.CostCategory, reserveCCST.TransactionAmount, submittingUser)
      }
      if (reserve <> null)
      {
        reserve.AccountingMonthExt = reserveCCST.AccountingMonthExt
        reserve.AccountingYearExt = reserveCCST.AccountingYearExt
        reserve.Status = TransactionStatus.get(reserveCCST.StatusTran)
        reserve.SubmitDate = reserveCCST.SubmitDate
        if (reserveType == "closing") 
        {
           reserve.RptCreateDateExt.Time = reserveCCST.RptCreateDateExt.Time  + 1 
        }
        else 
        {
           reserve.RptCreateDateExt = exposure.CloseDate
        }
        reserve.Comments = reserveCCST.Comments
        //New Attribute Transaction Mapping for WC
        reserve.WCInjuryTypeExt = WCInjuryTypeExt.get(reserveCCST.WCInjuryTypeExt)
        reserve.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
        reserveSet = reserve.TransactionSet as ReserveSet
        reserveSet.RequestingUser = submittingUser
        reserveSet.ApprovalDate = reserveCCST.ApprovalDate
        reserveSet.ApprovalStatus = ApprovalStatus.get(reserveCCST.ApprovalStatus)
        reserveSet.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
        var reserveLineItem = reserve.LineItems[0]
        reserveLineItem.IRS1099BoxNumberExt = reserveCCST.IRS1099BoxNumberExt
        reserveLineItem.LineCategory = reserveCCST.LineCategory
        reserveLineItem.VendorDescriptionExt = reserveCCST.VendorDescriptionExt
        reserveLineItem.Comments = reserveCCST.Comments
        reserveLineItem.Transaction = reserve
        reserveLineItem.TransactionQualifierExt = reserveCCST.TransactionQualifierExt
        reserveLineItem.ApplyDeductions = reserveCCST.ApplyDeductions
        reserveLineItem.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
      try 
      {
       var claimFinancialsAPI = new IClaimFinancialsAPI()
       claimFinancialsAPI.addClaimFinancials(reserveSet)
      } 
      catch (e1) 
      {
        Logger.logError(e1.Message)
      }
      }
    }
    
  }

  public function buildOriginalReserve(costType : String, exposure : Exposure, aClaim : Claim, 
                                      _claimsDAO : IClaimsConversionDAO, propsCC : HashMap) : BigDecimal 
  {
    Logger.logInfo("Processing buildOriginalReserve with ExposurePublicID " + exposure.ID +" and Cost Type" + costType)
    var reserves = _claimsDAO.getOriginal_Reserve(aClaim.ClaimNumber, propsCC, exposure.PublicID, costType)
    if (reserves <> null)
    {
      var reserve : Reserve
      var reserveSet : ReserveSet
      for (reserveCCST in reserves) 
      {
        var submittingUser : User
        if (reserveCCST.RequestingUserID == null) 
        {
          submittingUser = User ("user:50010")
        }
        else 
        {
          submittingUser = User (reserveCCST.RequestingUserID)
          if (submittingUser == null) 
          {
            submittingUser = User ("user:50010")
          }
        }
        reserve = exposure.setAvailableReserves(reserveCCST.CostType, reserveCCST.CostCategory, 
                                                reserveCCST.TransactionAmount, submittingUser)
        reserve.AccountingMonthExt = reserveCCST.AccountingMonthExt
        reserve.AccountingYearExt = reserveCCST.AccountingYearExt
        reserve.Status = TransactionStatus.get(reserveCCST.StatusTran)
        reserve.SubmitDate = reserveCCST.SubmitDate
        reserve.RptCreateDateExt = reserveCCST.RptCreateDateExt 
        reserve.Comments = reserveCCST.Comments
        //New Attribute Transaction Mapping for WC
        reserve.WCInjuryTypeExt = WCInjuryTypeExt.get(reserveCCST.WCInjuryTypeExt)
        reserve.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
        reserve.Claim = aClaim
        reserve.Exposure = exposure
        reserveSet = reserve.TransactionSet as ReserveSet
        reserveSet.RequestingUser = submittingUser
        reserveSet.ApprovalDate = reserveCCST.ApprovalDate
        reserveSet.ApprovalStatus = ApprovalStatus.get(reserveCCST.ApprovalStatus)
        reserveSet.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
        reserve.TransactionSet = reserveSet
        reserveSet.Claim = aClaim
        var reserveLineItem = reserve.LineItems[0]
        reserveLineItem.IRS1099BoxNumberExt = reserveCCST.IRS1099BoxNumberExt
        reserveLineItem.LineCategory = reserveCCST.LineCategory
        reserveLineItem.VendorDescriptionExt = reserveCCST.VendorDescriptionExt
        reserveLineItem.Comments = reserveCCST.Comments
        reserveLineItem.Transaction = reserve
        reserveLineItem.TransactionQualifierExt = reserveCCST.TransactionQualifierExt
        reserveLineItem.ApplyDeductions = reserveCCST.ApplyDeductions 
        reserveLineItem.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
        try 
        {
          var claimFinancialsAPI = new IClaimFinancialsAPI()
	      claimFinancialsAPI.addClaimFinancials(reserveSet)
        }
        catch (e1)
        {
          Logger.logError(e1.Message)
        }
        return reserveCCST.TransactionAmount
      }
    }
    return null
  }
  
  public function buildUpdatedReserve(checkCCST : CCSTCheckBean, exposure : Exposure, aClaim : Claim, 
                                      _claimsDAO : IClaimsConversionDAO, propsCC : HashMap) : BigDecimal 
  {
    Logger.logInfo("Processing buildUpdatedReserve with ExposurePublicID " + exposure.ID)
    var origReserves = _claimsDAO.getOriginal_Reserve(aClaim.ClaimNumber, propsCC, exposure.PublicID, checkCCST.CostType)
    var currReserves = _claimsDAO.getCurrent_Reserve(aClaim.ClaimNumber, propsCC, exposure.PublicID, checkCCST.CostType)
    var totalPymts = _claimsDAO.getTransTotalAmount(aClaim.ClaimNumber, exposure.PublicID, checkCCST.CostType, propsCC)
    var currRsvAmt = 0.0
    for (reserveCCST in currReserves) 
    {
      currRsvAmt = reserveCCST.TransactionAmount as double
    }
    var transTotalAmt = totalPymts + currRsvAmt
      var reserve : Reserve
      var reserveSet : ReserveSet
    if (transTotalAmt <> origReserves.first().TransactionAmount or origReserves.first().CostType == "expense" ) 
    {
      for (reserveCCST in origReserves) 
      {
      var submittingUser : User
  	if (reserveCCST.RequestingUserID == null) 
      {
        submittingUser = User ("user:50010")
      }
      else 
      {
  	  submittingUser = User (reserveCCST.RequestingUserID)
        if (submittingUser == null) 
        {
	    submittingUser = User ("user:50010")
        }  
      }
        reserve = exposure.setAvailableReserves(reserveCCST.CostType, reserveCCST.CostCategory, 
                                                transTotalAmt, submittingUser)
        reserve.AccountingMonthExt = reserveCCST.AccountingMonthExt
        reserve.AccountingYearExt = reserveCCST.AccountingYearExt
        reserve.Status = TransactionStatus.get(reserveCCST.StatusTran)
        reserve.SubmitDate = reserveCCST.SubmitDate
        reserve.RptCreateDateExt.Time = reserveCCST.RptCreateDateExt.Time  + 1  
        reserve.Comments = reserveCCST.Comments
      //New Attribute Transaction Mapping for WC
        reserve.WCInjuryTypeExt = WCInjuryTypeExt.get(reserveCCST.WCInjuryTypeExt)
      reserve.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
      reserve.Claim = aClaim
      reserve.Exposure = exposure
      reserveSet = reserve.TransactionSet as ReserveSet
      reserveSet.RequestingUser = submittingUser
        reserveSet.ApprovalDate = reserveCCST.ApprovalDate
        reserveSet.ApprovalStatus = ApprovalStatus.get(reserveCCST.ApprovalStatus)
      reserveSet.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
      reserveSet.Claim = aClaim
      reserve.TransactionSet = reserveSet
      var reserveLineItem = reserve.LineItems[0]
        reserveLineItem.IRS1099BoxNumberExt = reserveCCST.IRS1099BoxNumberExt
        reserveLineItem.LineCategory = reserveCCST.LineCategory
        reserveLineItem.VendorDescriptionExt = reserveCCST.VendorDescriptionExt
        reserveLineItem.Comments = reserveCCST.Comments
      reserveLineItem.Transaction = reserve
        reserveLineItem.TransactionQualifierExt = reserveCCST.TransactionQualifierExt
        reserveLineItem.ApplyDeductions = reserveCCST.ApplyDeductions  
      reserveLineItem.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
      try 
      {
        var claimFinancialsAPI = new IClaimFinancialsAPI()
        claimFinancialsAPI.addClaimFinancials(reserveSet)
      }
      catch (e1) 
      {
        Logger.logError(e1.Message)
        throw e1
      }
    }
  }
    return transTotalAmt
  }
  
  public function callMigrateClaim(aClaim : Claim, claimCCST : CCSTClaimBean, propsCC : HashMap, 
                                  _claimsDAO : IClaimsConversionDAO, policy : Policy, 
                                  contactMap : HashMap<String, Contact>, claimContactMap : HashMap<String, 
                                  ClaimContact>, addressMap : HashMap<String, Address>, 
                                  exposureMap : HashMap<String, Exposure>, expAssignMap : HashMap<String, CCSTExposureBean>) 
  {
    Logger.logInfo("Processing CallMigrateClaim")
    var errorList : String
    try 
    {
      var u:User = User( claimCCST.AssignedUserID) 
      var g:Group = Group( claimCCST.AssignedGroupID) 
      var claimAPI = new IClaimAPI()
      try 
      {
        Logger.logInfo("Processing IClaimsAPI")
        errorList = claimAPI.migrateClaim(aClaim, ClaimState.TC_OPEN, g.PublicID, u.PublicID, null)
      }
      catch (e1)
      {
        throw e1
      }
      var claimQuery = gw.api.database.Query.make(Claim)
      claimQuery.compare("ClaimNumber", Equals, aClaim.ClaimNumber)
      var claimQueryResult = claimQuery.select().FirstResult
      try 
      {
        gw.transaction.Transaction.runWithNewBundle(\ bundleAssign -> 
        {
	      bundleAssign.add(claimQueryResult)
	      claimQueryResult.RptCreateDateExt.Time = claimQueryResult.RptCreateDateExt.Time  + 1
	      claimQueryResult.assign(g, u)
	})  
      }
      catch(e2) 
      {
        throw e2
      }
      
      var incidents = aClaim.Incidents
      for (incident in incidents)
      {
        gw.transaction.Transaction.runWithNewBundle(\ bundle -> 
        {
	  bundle.add(incident)
	  incident.remove()
	  bundle.commit()
	}) 
      }
      
      try 
      {
        buildExposures(aClaim, propsCC, _claimsDAO, policy, contactMap, claimContactMap, addressMap, exposureMap, expAssignMap)
      } 
      catch(e3) 
      {
        throw e3 
      }
      try 
      {
        buildClaimContacts(aClaim, propsCC, _claimsDAO, contactMap, claimContactMap, addressMap)
      }
      catch (e3) 
      {
        throw (e3)
      }
      
      var activityMap : HashMap<String, Activity>
      try 
      {
        activityMap = buildActivities(aClaim, policy, propsCC, _claimsDAO, exposureMap, contactMap, 
                                      claimContactMap, addressMap)
      }
      catch(e4)
      {
        throw e4
      }
      try 
      {
        buildNotes(aClaim, policy, propsCC, _claimsDAO, exposureMap, activityMap, contactMap, claimContactMap, addressMap)
      } 
      catch(e5)
      {
        throw e5
      }
      
      try 
      {
        policy.insured = contactMap.get("insured")
        aClaim.Policy = policy
        for (exposureRec in exposureMap.entrySet()) 
        {
          var exposure = exposureRec.getValue()
          exposure.Claim = aClaim
          var closeDate  = exposure.CloseDate
          var claimOrder = exposure.ClaimOrder
          exposure.MetricLimitGeneration = exposure.ClaimOrder
          errorList = claimAPI.addExposure(aClaim.PublicID, exposure, null)
          exposure.ClaimOrder = claimOrder
          exposure.CloseDate = closeDate
        }
      }
      catch (e6)
      {
        throw e6
      }
   
      var exposures = aClaim.Exposures
      for (exposure in exposures) 
      {
        if (exposure.Coverage.CoverageEBIExt == claimCCST.CoverageEBIExt) 
        {
          aClaim.CoverageSelectedExt = exposure.Coverage
        }
      }     
      
    } 
    catch (e1) 
    {
      Logger.logError(e1.Message +"Error List"+ errorList)
      throw e1
    }
  }

  public function buildNotes(aClaim : Claim, policy : Policy, propsCC : HashMap, 
                             _claimsDAO : IClaimsConversionDAO, exposureMap : HashMap<String, Exposure>, 
                             activityMap : HashMap<String, Activity>, contactMap : HashMap<String, Contact>, 
                             claimContactMap : HashMap<String, ClaimContact>, addressMap : HashMap<String, Address>) 
  {
    var notes = _claimsDAO.getCCST_Note(aClaim.ClaimNumber, propsCC)
    if (not notes.Empty) 
    {
      var _iter = notes.iterator()
      while (_iter.hasNext()) 
      {
        var noteCCST = _iter.next()
        Logger.logInfo("Processing BuildNotes with PublicID " + noteCCST.PublicID)
        if(this.TerminateRequested)
        {
          break
        }
        var note = new Note()
        note.AllowExternalViewing = noteCCST.AllowExternalViewing
        note.Author = User(noteCCST.AuthorID) 
        if (util.StringUtils.getXMLValue(noteCCST.Body,false).length > 4000) 
        {
          note.Body = util.StringUtils.getXMLValue(noteCCST.Body,false).substring(4000)
        }
        else
        {
          note.Body = noteCCST.Body
        }
        if (noteCCST.ExposureID <> null) 
        {
          note.Exposure = exposureMap.get(noteCCST.ExposureID)
          note.Claimant = note.Exposure.Claimant
        }
        if (noteCCST.ActivityID <> null) 
        {
          note.Activity = activityMap.get(noteCCST.ActivityID)
        }
        note.Claim = aClaim
        note.Language = noteCCST.Language
        note.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
        note.AllowExternalViewing = noteCCST.AllowExternalViewing
        note.AuthoringDate = noteCCST.AuthoringDate
        note.Confidential = noteCCST.Confidential
        note.PublicID = noteCCST.PublicID
        var noteClaimContact : ClaimContact
        if (noteCCST.ClaimContactID <> null) 
        {
          noteClaimContact = findClaimContact(aClaim, noteCCST.ClaimContactID, _claimsDAO, claimContactMap, propsCC)
          if (noteClaimContact <> null) 
          {
            note.ClaimContact = noteClaimContact
            var exposure = exposureMap.get(noteCCST.ExposureID)
            if (exposure <> null) 
            {
              note.ClaimContact.Roles[0].Exposure = exposure
            }
            if (noteClaimContact.Policy <> null) 
            {
              note.ClaimContact.Policy = policy
            }
          }
          else 
          {
            note.ClaimContact = buildClaimContact(noteCCST.ClaimContactID, "",aClaim, propsCC, _claimsDAO, null, "ClmContPublicID", claimContactMap, null)
            var contact = buildContact(noteCCST.ClaimContactID, "", aClaim, propsCC, _claimsDAO, null, "ClmContPublicID", contactMap, addressMap, null)
            note.ClaimContact.Contact = contact
	        buildClaimContactRoles(noteCCST.ClaimContactID, null, note.ClaimContact, aClaim.ClaimNumber, aClaim.LoadCommandID, propsCC, _claimsDAO, aClaim, null)
            if (noteClaimContact.Policy <> null) 
            {
              note.ClaimContact.Policy = policy
            }
	        claimContactMap.put(note.ClaimContact.PublicID, note.ClaimContact)
	        contactMap.put(contact.PublicID, contact)
          }
        }
        note.SecurityType = noteCCST.SecurityType
        note.Subject = noteCCST.Subject
        note.Topic = noteCCST.Topic
        _iter.remove()
      }
    }
  }


  public function buildActivities(aClaim : Claim, policy : Policy, propsCC : HashMap, _claimsDAO : IClaimsConversionDAO, exposureMap : HashMap<String, Exposure>, 
                                  contactMap : HashMap<String, Contact>, claimContactMap : HashMap<String, ClaimContact>, 
                                  addressMap : HashMap<String, Address>)  : HashMap<String, Activity> 
  {
    var activities = _claimsDAO.getCCST_Activity(aClaim.ClaimNumber, propsCC)
    var activityMap = new HashMap<String, Activity>()
    if (not activities.Empty) 
    {
      for (activityCCST in activities) 
      {
        var activity = new Activity()
        Logger.logInfo("Processing BuildActivity with PublicID " + activityCCST.PublicID)
	    activity.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
	    activity.ActivityClass = activityCCST.ActivityClass
            activity.ApprovalIssue = activityCCST.ApprovalIssue
            activity.setFieldValue("assignmentDate",activityCCST.AssignmentDate)
	    activity.setFieldValue("assignmentStatus", AssignmentStatus.TC_ASSIGNED)
	    activity.Claim = aClaim
	    activity.ActivityClass = activityCCST.ActivityClass
	    activity.CloseDate = activityCCST.CloseDate
	    activity.PublicID = activityCCST.PublicID
	    if (activityCCST.ExposureID <> null) 
	    {
	      activity.Exposure = exposureMap.get(activityCCST.ExposureID)
	    }
	    var activityClaimContact : ClaimContact
	    if (activityCCST.ClaimContactID <> null) 
	    {
	      activityClaimContact = findClaimContact(aClaim, activityCCST.ClaimContactID, _claimsDAO, claimContactMap, propsCC)
	      if (activityClaimContact <> null) 
          {
            activity.ClaimContact = activityClaimContact
            var exposure = exposureMap.get(activityCCST.ExposureID)
            if (exposure <> null) 
            {
              activity.ClaimContact.Roles[0].Exposure = exposure
            }
            if (activityClaimContact.Policy <> null) 
            {
              activity.ClaimContact.Policy = policy
            }
          }
          else 
          {
            activity.ClaimContact = buildClaimContact(activityCCST.ClaimContactID, "",aClaim, propsCC, _claimsDAO, null, "ClmContPublicID", claimContactMap, null)
            var contact = buildContact(activityCCST.ClaimContactID, "", aClaim, propsCC, _claimsDAO, null, "ClmContPublicID", contactMap, addressMap, null)
            activity.ClaimContact.Contact = contact
	    buildClaimContactRoles(activityCCST.ClaimContactID, null, activity.ClaimContact, aClaim.ClaimNumber, aClaim.LoadCommandID, propsCC, _claimsDAO,  aClaim, null)
            if (activity.ClaimContact.Policy <> null) 
            {
	          activity.ClaimContact.Policy = policy
            }
	        claimContactMap.put(activity.ClaimContact.PublicID, activity.ClaimContact)
	        contactMap.put(contact.PublicID, contact)
          }
        }
        try 
        {
  	  activity.AssignedUser = User(activityCCST.AssignedUserID)
        } 
        catch(e2) 
        {
          Logger.logError("error stack trace " + e2.printStackTrace())
          throw e2
        }
        try 
        {
          activity.AssignedGroup = Group(activityCCST.AssignedGroupID)
        } 
        catch(e1) 
        {
          Logger.logError("error stack trace " + e1.printStackTrace())
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
        //Activity New Attribute Mapping fot WC
	activityMap.put(activityCCST.PublicID, activity)
      }
    }
    return activityMap
  }

  public function buildClaimContacts(aClaim : Claim, propsCC : HashMap, _claimsDAO : IClaimsConversionDAO, contactMap : HashMap<String, Contact>, claimContactMap : HashMap<String , ClaimContact>,  addressMap : HashMap<String, Address>) 
  {
    var claimContacts : List<CCSTClaimContactBean>
    claimContacts = _claimsDAO.getCCST_ClaimContactForClaim(aClaim.ClaimNumber, propsCC)
    if (not claimContacts.Empty) 
    {
      var _iter = claimContacts.iterator()
      while (_iter.hasNext()) 
      {
        var claimContactCCST = _iter.next()
         Logger.logInfo("Processing ClaimContacts with PublicID " + claimContactCCST.PublicID)
        if(this.TerminateRequested)
        {
          break
        }
        if (claimContactCCST.Role <> "claimant" && claimContactCCST.Role <> "insured" && claimContactCCST.Role <> "checkpayee" &&  
			!contactMap.containsKey(claimContactCCST.Role) && !contactMap.containsKey(claimContactCCST.PublicIDContact) && 
			claimContactCCST.PolicyID == null) 
        {
          var policyRole = checkClaimContactRoles(claimContactCCST.PublicID, aClaim.ClaimNumber, propsCC, _claimsDAO)
  	  if (policyRole == "") 
  	  {
            var claimContact = buildClaimContact(claimContactCCST.PublicID, "",aClaim, propsCC, _claimsDAO, claimContacts, "ClmContPublicID", claimContactMap, null)
  	    var contact = buildContact(claimContactCCST.PublicID, claimContactCCST.Role, aClaim, propsCC, _claimsDAO, claimContacts, "ClmContPublicID", contactMap, addressMap, null)
  	    claimContact.Claim = aClaim
  	    claimContact.setContact(contact)
            claimContact.Contact = contact
            claimContact.setFieldValue("LoadCommandID",aClaim.LoadCommandID)
            claimContactMap.put(claimContactCCST.PublicID, claimContact)
            contactMap.put(claimContactCCST.PublicID, contact)
            buildClaimContactRoles(claimContactCCST.PublicID, null, claimContact, aClaim.ClaimNumber, aClaim.LoadCommandID, propsCC, _claimsDAO, aClaim,null)
          }
  	  else 
  	  {
            buildClaimContactRoles(claimContactCCST.PublicID, null, claimContactMap.get(policyRole), aClaim.ClaimNumber, aClaim.LoadCommandID, propsCC, _claimsDAO, aClaim, null)
  	  }
        }
        _iter.remove()
      }  
    }
  }


  public function buildExposures(aClaim : Claim, propsCC : HashMap, _claimsDAO : IClaimsConversionDAO, policy : Policy, 
                                contactMap : HashMap<String, Contact>, claimContactMap : HashMap<String, ClaimContact>, 
                                addressMap : HashMap<String, Address>, exposureMap : HashMap<String, Exposure>, 
                                expAssignMap : HashMap<String, CCSTExposureBean>)  
  {
    var exposures = _claimsDAO.getCCST_Exposure(aClaim.ClaimNumber, propsCC)
    if (not exposures.Empty) 
    {
      for (exposureCCST in exposures) 
      {
        Logger.logInfo("Processing BuildExposure with PublicID " + exposureCCST.PublicID)
        var exposure = new Exposure()
        aClaim.addToExposures(exposure)
        Logger.logInfo("exposure CCST ebi: " + exposureCCST.CoverageEBIExt)
        var coverageList = policy.Coverages
        for (coverage in coverageList) 
        {
          Logger.logInfo("Pol Covg EBI: " + coverage.CoverageEBIExt)
          if (coverage.CoverageEBIExt == exposureCCST.CoverageEBIExt && exposure.Coverage == null) 
          {
            exposure.Coverage = coverage
            coverage.ClassCodeEBIExt = exposureCCST.ClassCodeEBIExt
            coverage.ClassCodeEBIInstExt = exposureCCST.ClassCodeEBIInstExt
          }          
        }   
        if (exposure.Coverage == null) 
        {
          throw("Coverage could not be found for the exposure on claim: " + aClaim.ClaimNumber) 
        }
        exposure.ExposureType = exposureCCST.ExposureType
        var claimantClaimContact = buildClaimContact(exposureCCST.PublicID, "claimant",aClaim, propsCC, _claimsDAO, null, "PublicIDandRole", claimContactMap, null)
        var claimantContact = buildContact(exposureCCST.PublicID, "claimant", aClaim, propsCC, _claimsDAO, null, "PublicIDandRole", contactMap, addressMap, null)
        claimantClaimContact.setContact(claimantContact)
        claimantClaimContact.Claim = aClaim
        var ccrMap = buildClaimContactRoles(exposureCCST.PublicID, "claimant", claimantClaimContact, aClaim.ClaimNumber, aClaim.LoadCommandID, propsCC, 
                                            _claimsDAO, aClaim, exposure)
        var claimantClaimContactRole = ccrMap.get("claimant")
        claimantClaimContactRole.ClaimContact = claimantClaimContact 
        claimantClaimContactRole.Policy = policy
        claimantClaimContactRole.Exposure = exposure
        exposure.PublicID = exposureCCST.PublicID		
        var expContactRoles = buildExpOtherContacts(exposure, aClaim, propsCC, _claimsDAO, contactMap, claimContactMap, addressMap)
        var expContactRolesArray : ClaimContactRole[]
        if (expContactRoles <> null)
        {
          expContactRoles.add(claimantClaimContactRole)
          expContactRolesArray = expContactRoles.toArray(new ClaimContactRole[expContactRoles.size()])
        }
        else
        {
          expContactRolesArray = new ClaimContactRole[]{claimantClaimContactRole}
        }
        exposure.Roles = expContactRolesArray
        claimantClaimContact.Policy = policy
        claimContactMap.put(claimantClaimContact.PublicID, claimantClaimContact)
        contactMap.put(claimantContact.PublicID, claimantContact)
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
        if (exposureCCST.ClaimantDenormID <> null) 
        {
          exposure.ClaimantDenorm = buildContact(exposureCCST.ClaimantDenormID, "", aClaim, propsCC, _claimsDAO, null, "ContPublicID", 
                                                 contactMap, addressMap, null)
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
        exposure.ISOKnown = exposureCCST.ISOKnown
        exposure.ISOStatus = exposureCCST.ISOStatus
        if (exposure.InsuranceCoExt <> null) 
        {
          exposure.InsuranceCoExt = buildContact(exposureCCST.InsuranceCoExt, "", aClaim, propsCC, _claimsDAO, null, "ContPublicID", 
                                                 contactMap, addressMap, null)
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
        for (coverage in coverageList) 
        {
          if (coverage.PublicID == exposureCCST.PreviousCoverageExt) 
          {
            exposure.PreviousCoverageExt = coverage
          }
        }
        exposure.PrimaryCoverage = exposureCCST.PrimaryCoverage
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
        exposure.LossDueToExt = exposureCCST.LossDueToExt
        exposure.PublicID = exposureCCST.PublicID
        expAssignMap.put(exposure.PublicID, exposureCCST)

        var incidents = _claimsDAO.getCCST_Incident(exposureCCST.IncidentID, propsCC)
        var subtype = ""
        for (incidentCCST in incidents) 
        {
          subtype = incidentCCST.Subtype.trim()
          if (subtype == "InjuryIncident") 
          {
            var incident = buildInjuryIncident(aClaim, incidentCCST)
            incident.Roles = expContactRolesArray
            exposure.Incident = incident
            incident.Claim = aClaim
            //BodyPart Attributes Mapping for WC LOB
            incident.setFieldValue("ClaimIncident", incidentCCST.ClaimIncident)
            var injuryIncidentPublicID = incident.PublicID
            var bodyPartsCCST = _claimsDAO.getCCST_BodyPart(injuryIncidentPublicID, propsCC)
            for (bodyPartCCST in bodyPartsCCST) 
            {
                var bodyPart = buildBodyPart(bodyPartCCST, aClaim)
              	bodyPart.Incident = incident
            }
            //InjuryDiagnosis Attributes Mapping for WC LOB
            var injuryDiagnosises = _claimsDAO.getCCST_InjuryDiagnosis(injuryIncidentPublicID, propsCC)
            for (injuryDiagnosisCCST in injuryDiagnosises) 
            {
              var injuryDiagnosis = buildInjuryDiagnosis(injuryDiagnosisCCST, contactMap, aClaim)
              injuryDiagnosis.InjuryIncident = incident
            }
         }
         else if (subtype == "Incident") 
         {
           var incident = buildIncident(aClaim, incidentCCST)
           incident.Roles = expContactRolesArray
           exposure.Incident = incident
           incident.Claim = aClaim	            
         }
         else 
         {
           var incident = buildFixedPropIncident(aClaim, incidentCCST, policy)
           incident.Roles = expContactRolesArray
           exposure.Incident = incident
           incident.Claim = aClaim	            
         }
      }

      claimantClaimContactRole.setContact(claimantContact)		
      exposure.ClaimantType  = exposureCCST.ClaimantType
      if (claimantContact typeis Person) 
      {
        exposure.setClaimant(claimantContact)
      }
      else if (claimantContact typeis Company) 
      {
        exposure.Claimant = claimantContact
      }
      else 
      {
        Logger.logInfo("No type for claimantcontact: " + claimantContact.PublicID  + " on claim: " + aClaim.ClaimNumber 
                                                       + "; exposure: " + exposure.PublicID)
      }
      if (exposure.Claimant typeis Person and exposure.ClosedOutcome<> null and 
         (exposure.ExposureType == "sp_medical_payment" or exposure.ExposureType == "sp_bodily_injury")) 
      {
        exposure.Claimant.MedicareEligibleExt = 0 as java.lang.Boolean
      }
      exposure.TypeOfLossMostExt = exposureCCST.TypeOfLossMostExt
      exposure.PolicyNumberExt = policy.PolicyNumber

      //Exposure Attributes Mapping for WC LOB
      exposure.BureauBenefitTypeExt = BureauBenefitExt.get(exposureCCST.BureauBenefitTypeExt)
      
      if (exposureCCST.NewEmpDataID <> null)
      {
        if(aClaim.EmploymentData <> null)
     	{
     	  exposure.NewEmpData = aClaim.EmploymentData
     	}
   	    else 
   	    {
          exposure.NewEmpData = buildEmploymentData(exposureCCST.NewEmpDataID, propsCC, _claimsDAO, aClaim)
   	    }
      }
      exposure.ISOReceiveDate = exposureCCST.ISOReceiveDate
      exposure.DetailedInjuryExt = exposureCCST.DetailedInjuryExt
      exposure.WCExpenseInjuryTypeExt = exposureCCST.WCExpenseInjuryTypeExt
      exposure.FuneralAmountExt = exposureCCST.FuneralAmountExt
      exposure.MMIDateExt = exposureCCST.MMIDateExt
      exposure.RemarriagePaymentExt = exposureCCST.RemarriagePaymentExt
      exposure.WCLossInjuryTypeExt = exposureCCST.WCLossInjuryTypeExt
      exposure.ReturnToWorkValidExt = exposureCCST.Returntoworkvalidext
      exposure.ReturnToWorkDateExt = exposureCCST.Returntoworkdateext
      exposure.ReturnToWorkActualExt = exposureCCST.ReturnToWorkActualExt
      exposure.ISOEnabledExt = exposureCCST.ISOEnabledExt	
      exposureMap.put(exposureCCST.PublicID, exposure)
      buildUserRoleAssign(exposure, aClaim, _claimsDAO, propsCC)
      }
    }
  }
 
  public function buildFixedPropIncident(aClaim : Claim, incidentCCST : CCSTIncidentBean, policy : Policy ) : FixedPropertyIncident 
  {
    Logger.logInfo("Processing BuildFixedPropIncident with PublicID "+incidentCCST.PublicID)
    var incident = new FixedPropertyIncident()
    incident.AlarmType = incidentCCST.AlarmType
    incident.Claim = aClaim
    incident.Description = incidentCCST.Description
    incident.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
    var polLocations = policy.PolicyLocations
    for (polLocation in polLocations) 
    {
      if (polLocation.PublicID == incidentCCST.PropertyID) 
      {
        incident.Property = polLocation
      }
      else if (polLocation.PublicID == incidentCCST.PreviousPropertyExt) 
      {
        incident.PreviousPropertyExt = polLocation
      }
    }
    incident.LossEstimate = incidentCCST.LossEstimate
    incident.Severity = incidentCCST.Severity
    return incident
  }

  public function buildInjuryIncident(aClaim : Claim, incidentCCST : CCSTIncidentBean) : InjuryIncident 
  {
    Logger.logInfo("Processing BuildInjuryIncident with PublicID "+incidentCCST.PublicID)
    var incident = new InjuryIncident()
    incident.Claim = aClaim
    incident.AmbulanceUsed = incidentCCST.AmbulanceUsed
    incident.Description = incidentCCST.Description
    incident.DetailedInjuryType = incidentCCST.DetailedInjuryType
    incident.GeneralInjuryType = incidentCCST.GeneralInjuryType
    incident.LossEstimate = incidentCCST.LossEstimate
    incident.Severity = incidentCCST.Severity
    //New Attribute Mapping for WC InjuryIncident
    incident.ReturnToWorkDate = incidentCCST.ReturnToWorkDate
    incident.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
    incident.PublicID= incidentCCST.PublicID
    return incident
  }

  public function buildIncident(aClaim : Claim, incidentCCST : CCSTIncidentBean) : Incident 
  {
    Logger.logInfo("Processing BuildIncident with PublicID "+incidentCCST.PublicID)
    var incident = new Incident()
    incident.Claim = aClaim
    incident.Severity = incidentCCST.Severity
    incident.Description = incidentCCST.Description
    incident.LossEstimate = incidentCCST.LossEstimate
    incident.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
    return incident
  }
  
  public function buildClaim(aClaim : Claim, claimCCST : CCSTClaimBean, propsCC : HashMap, _claimsDAO : IClaimsConversionDAO, contactMap : HashMap<String, Contact>, loadCommandID : Integer, addressMap : HashMap<String, Address>, claimContactMap : HashMap<String,ClaimContact>) 
  {
    Logger.logInfo("Processing BuildClaim: ClaimNumber"+claimCCST.ClaimNumber)
    aClaim.AccountingYearExt = claimCCST.AccountingYearExt
    aClaim.AccountingMonthExt = claimCCST.AccountingMonthExt
    aClaim.AgencyId = claimCCST.AgencyID
    aClaim.setFieldValue("assignmentDate",claimCCST.AssignmentDate)
    aClaim.setFieldValue("assignmentStatus", AssignmentStatus.TC_ASSIGNED)
    aClaim.StorageDate = claimCCST.AssignmentDate
    aClaim.setFieldValue("LoadCommandID", loadCommandID) 
    aClaim.BusinessLineExt = BusinessLineExt.get(claimCCST.BusinessLineExt.trim())
    aClaim.NCWOnlyBusinessUnitExt = claimCCST.NCWOnlyBusinessUnitExt
    var catastropheQuery = gw.api.database.Query.make(entity.Catastrophe)
    catastropheQuery.compare("PublicID", Equals, claimCCST.CatastropheID )
    var catastropheResult = catastropheQuery.select()
    for (catastrophe in catastropheResult) 
    {
      aClaim.Catastrophe = catastrophe
      gw.transaction.Transaction.runWithNewBundle(\ bundleCatastrophe -> 
      {
        bundleCatastrophe.add(catastrophe)
        catastrophe.setFieldValue("LoadCommandID", loadCommandID)
      })
    }
    aClaim.ClaimNumber = claimCCST.ClaimNumber
    aClaim.ClaimSource = claimCCST.ClaimSource
    aClaim.ClaimTypeExt = claimCCST.ClaimTypeExt
    aClaim.ClaimTypeDetailExt = claimCCST.ClaimTypeDetailExt
    aClaim.ClaimSource = claimCCST.ClaimSource
    aClaim.CloseDate = claimCCST.CloseDate
    aClaim.DateEligibleForArchive = aClaim.CloseDate
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
    if (claimCCST.IncidentClaimantExt <> null) 
    {
      aClaim.IncidentClaimantExt = buildContact(claimCCST.IncidentClaimantExt, "claimant", aClaim, propsCC, _claimsDAO, null, "ContPublicIDandRole", contactMap, addressMap, null)
    }
    aClaim.ISOEnabled = claimCCST.ISOEnabled
    if (claimCCST.InsuredDenormID <> null) 
    {
      aClaim.InsuredDenorm = buildContact(claimCCST.InsuredDenormID, "insured", aClaim, propsCC, _claimsDAO, null, "ContPublicIDandRole", contactMap, addressMap, null)
    }
    aClaim.IncidentReport = claimCCST.IncidentReport
    aClaim.JurisdictionState = claimCCST.JurisdictionState
    aClaim.LimitsInsuranceExt = claimCCST.LimitsInsuranceExt
    aClaim.LocationOfTheft = claimCCST.LocationOfTheft
    aClaim.LossCause = claimCCST.LossCause
    aClaim.LossDate = claimCCST.LossDate
    aClaim.LossType = LossType.get(claimCCST.LossType.trim())
    aClaim.LOBCode = claimCCST.LobCode
    aClaim.LossLocation = buildAddress(claimCCST.LossLocationID, propsCC, _claimsDAO, aClaim, addressMap)
    aClaim.LossLocationCode = claimCCST.LossLocationCode
    if (claimCCST.MainContactExt <> null) 
    {
      aClaim.MainContactExt = buildContact(claimCCST.MainContactExt, "", aClaim, propsCC, _claimsDAO, null, "ContPublicID", contactMap, addressMap, null)
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
    if (claimCCST.ReportedByExt <> null) 
    {
      aClaim.ReportedByExt =  buildContact(claimCCST.ReportedByExt, "", aClaim, propsCC, _claimsDAO, null, "ContPublicID", contactMap, addressMap, null)
    }
    aClaim.ReportedDate = claimCCST.ReportedDate
    if (claimCCST.ReporterExt <> null) 
    {
      aClaim.ReporterExt =  buildContact(claimCCST.ReporterExt, "", aClaim, propsCC, _claimsDAO, null, "ContPublicID", contactMap, addressMap, null)
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
    
    //Claims new Attributes Mapping for WC 
    aClaim.ControvertedExt = claimCCST.ControvertedExt
    aClaim.DateRptdToEmployer = claimCCST.DateRptdToEmployer
    aClaim.ClaimsMadeUsedExt = claimCCST.ClaimsMadeUsedExt
    aClaim.ISOEnabledAdminUpdated_Ext = claimCCST.ISOEnabledAdminUpdated_Ext
    aClaim.ExternalUserAdminExt = claimCCST.ExternalUserAdminExt
    aClaim.InsuredPremises = claimCCST.InsuredPremises
    aClaim.JurisClaimNumberExt = claimCCST.JurisClaimNumberExt
    aClaim.ReservedFileExt = claimCCST.ReservedFileExt
    aClaim.SpecClaimHandlingExt = claimCCST.SpecClaimHandlingExt
    aClaim.TypeOfLossMostExt = claimCCST.TypeOfLossMostExt
    var externalHandlingExtQuery = gw.api.database.Query.make(entity.TPAAdminExt)
    externalHandlingExtQuery.compare("PublicID", Equals, claimCCST.ExternalHandlingExt)
    var externalHandlingExt = externalHandlingExtQuery.select().FirstResult
    aClaim.ExternalHandlingExt = externalHandlingExt
    aClaim.ISOKnown = claimCCST.ISOKnown
        
    //Needs to be visited again  
    if(claimCCST.InjuredWorkerExtID <> null)
    {
      var keyType = "claimClaimant"
      var injWorkerClaimContact = buildClaimContact(claimCCST.InjuredWorkerExtID, "claimant",aClaim, propsCC, 
						_claimsDAO, null, keyType, claimContactMap, null)
      var injWorkerContact = buildContact(claimCCST.InjuredWorkerExtID, "claimant", aClaim, propsCC, 
			   _claimsDAO, null, keyType, contactMap, addressMap, null)
      injWorkerClaimContact.Contact = injWorkerContact
      claimContactMap.put(injWorkerClaimContact.PublicID, injWorkerClaimContact)
      contactMap.put(injWorkerContact.PublicID, injWorkerContact)
      var ccrMap = buildClaimContactRoles(injWorkerClaimContact.PublicID, "claimant", injWorkerClaimContact, 
                            aClaim.ClaimNumber, aClaim.LoadCommandID, propsCC, _claimsDAO, 
                           aClaim, null)
      var injWorkerClaimContactRole = ccrMap.get("claimant")
      injWorkerClaimContactRole.ClaimContact = injWorkerClaimContact 
      
      var injWorkerPerson = injWorkerContact as Person 
      aClaim.InjuredWorker = injWorkerPerson as InjuredWorkerExt
      buildISOMedicareExt(_claimsDAO, aClaim, injWorkerContact, propsCC)
    }
    if (claimCCST.ClaimantDenormID <> null) 
    {
      aClaim.ClaimantDenorm = buildContact(claimCCST.ClaimantDenormID, "claimant", aClaim, propsCC, _claimsDAO, null, "ContPublicID", 
                                           contactMap, addressMap, null)
    }
  }
  


  public function buildPolicy(policyID : String, propsCC : HashMap, _claimsDAO : IClaimsConversionDAO, contactMap : HashMap<String, Contact>, 
                              claimContactMap : HashMap<String, ClaimContact>, claim : Claim, loadCommandID : int) : Policy 
  {
    var ccstPolicy = _claimsDAO.getCCST_PolicyEBI(policyID, propsCC)
    Logger.logInfo("Processing BuildPolicy with PolicyID "+policyID)
    var policyType = ""
    var policyEBI = ""
    if (not ccstPolicy.Empty) 
    {
      for (policy in ccstPolicy) 
      {
        policyEBI = policy.PolicyEBIExt
        policyType = policy.PolicyType
      }
    }
    var polSrchPlugin = new PolicySearchPlugin()
    var policySummary = new PolicySummary()
    policySummary.PolicyCombEBIExt = policyEBI + ".1"
    policySummary.PolicyType = policyType
    policySummary.LossTypeExt = claim.LossType as java.lang.String
    Logger.logInfo("claim number  " + claim.ClaimNumber + " policyEBI " + policySummary.PolicyCombEBIExt + " policy type " 
                                    + policySummary.PolicyType + " loss type " + policySummary.LossTypeExt)
    var psarResult : PolicyRetrievalResultSet    
    try 
    {    
      psarResult = polSrchPlugin.retrievePolicyFromPolicySummary(policySummary)
    }
    catch (e1) 
    {
      throw(e1)
    }
    var policy = psarResult.Result
    policy.isPolicyInRefresh(0)
    policy.setFieldValue("LoadCommandID", claim.LoadCommandID)
    var claimContacts = policy.ClaimContactsForAllRoles
    for (claimContact in claimContacts) 
    {
      var roles = claimContact.Roles
      for (role in roles) 
      {
        claimContactMap.put(role.Role.Code, claimContact)
        contactMap.put(role.Role.Code, claimContact.Contact)
        if (role.Role.Code == "insured") 
        {
          policy.insured = claimContact.Contact  
        }
      }
      claimContact.setFieldValue("LoadCommandID", loadCommandID)
      claimContact.Contact.setFieldValue("LoadCommandID", loadCommandID)
    }
    
    for (coverage in policy.AllCoverages)
    {
      coverage.setFieldValue("LoadCommandID", loadCommandID)
    }
      
    policy.Verified = true
    return policy
  }


  public function buildUserRoleAssign(exposure : Exposure, aClaim : Claim, _claimsDAO : IClaimsConversionDAO, propsCC : HashMap) 
  {
    var userRoleAssign: UserRoleAssignment
    var userRoleAssigns = _claimsDAO.getCCST_UserRoleAssign(aClaim.ClaimNumber, exposure.PublicID, propsCC)
    Logger.logInfo("Processing BuildUserRoleAssign with ExposurePublicID "+exposure.PublicID)
    for (userRoleAssCCST in userRoleAssigns) 
    {
      userRoleAssign = new UserRoleAssignment()
      userRoleAssign.Active = userRoleAssCCST.Active
      if (userRoleAssCCST.AssignedByUserID <> null) 
      {
        userRoleAssign.AssignedByUser = User(userRoleAssCCST.AssignedByUserID)
      }
      if (userRoleAssCCST.AssignedGroupID <> null) 
      {
        userRoleAssign.AssignedGroup = Group(userRoleAssCCST.AssignedGroupID)
      }
      if (userRoleAssCCST.AssignedUserID <> null) 
      {
        userRoleAssign.AssignedUser = User(userRoleAssCCST.AssignedUserID)
      }
      userRoleAssign.Claim = aClaim
      userRoleAssign.CloseDate = userRoleAssCCST.CloseDate
      userRoleAssign.Comments = userRoleAssCCST.Comments
      userRoleAssign.Exposure = exposure
      userRoleAssign.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
      userRoleAssign.PublicID = userRoleAssCCST.PublicID
      userRoleAssign.Role = userRoleAssCCST.Role 
      userRoleAssign.RptCreateDateExt = userRoleAssCCST.RptCreateDateExt
      //New Attribute Mapping for WC UserRole
      userRoleAssign.RptInactiveDateExt = userRoleAssCCST.RptInactiveDateExt
    }
  }

  public function buildAddress(publicID : String, propsCC : HashMap, _claimsDAO : IClaimsConversionDAO, aClaim : Claim, 
                               addressMap : HashMap<String, Address>) : Address 
  {
    var address: Address
    var addresses = _claimsDAO.getCCST_Address(publicID, propsCC)
    Logger.logInfo("Processing BuildAddress")
    for (addressCCST in addresses) 
    {
      address = addressMap.get(publicID)
      if (address <> null) 
      {
        break
      }
      address = loadAddressData(addressCCST, aClaim)
    }
    addressMap.put(publicID, address)
    return address;
  }

  public function loadAddressData(addressCCST : CCSTAddressBean, aClaim : Claim) : Address
  {
    Logger.logInfo("Processing LoadAddress with AddressPublicID "+addressCCST.PublicID)
    var address = new Address()
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

  public function loadAddressData(addressCCST : CCSTContactAddressBean, aClaim : Claim) : Address
  {
    Logger.logInfo("Processing LoadAddress with ContactAddressPublicID "+addressCCST.PublicID)
    var address = new Address()
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

  public function findClaimContact(aClaim : Claim, publicID : String, _claimsDAO : IClaimsConversionDAO, claimContactMap : HashMap<String, ClaimContact>, 
                                   propsCC : HashMap) : ClaimContact 
  {
    var clmContact = claimContactMap.get(publicID)
    if (clmContact <> null) 
    {
       return clmContact
    }
    var claimContacts = _claimsDAO.getCCST_ClaimContactViaClmContPublicID(aClaim.ClaimNumber, publicID, propsCC)
    var role : String
    for (claimContact in claimContacts) 
    {
      if (claimContact.Role <> null) 
      {
        role = claimContact.Role
      }
    }
    clmContact = claimContactMap.get(role)
    if (clmContact <> null) 
    {
      return clmContact
    }   
    return clmContact
  }

  public function buildClaimContact(publicID : String, role : String, aClaim : Claim, propsCC : HashMap, _claimsDAO : IClaimsConversionDAO, 
                                    claimContacts : List<CCSTClaimContactBean>, keyType : String, claimContactMap : HashMap<String, 
                                    ClaimContact>, exposureID : String) : ClaimContact 
  {
    Logger.logInfo("Processing BuildClaimContact: PublicID "+publicID)
    var clmContact: ClaimContact
    if (keyType == "Role") 
    {
      claimContacts = _claimsDAO.getCCST_ClaimContact(aClaim.ClaimNumber, role, propsCC)
    }
    else if (keyType == "ContPublicID") 
    {
      claimContacts = _claimsDAO.getCCST_ClaimContactViaContPublicID(aClaim.ClaimNumber, publicID, propsCC)
    }
    else if (keyType == "ClmContPublicID") 
    {
      claimContacts = _claimsDAO.getCCST_ClaimContactViaClmContPublicID(aClaim.ClaimNumber, publicID, propsCC)
    }
    else if (keyType == "PublicIDandRole") 
    {
      claimContacts = _claimsDAO.getCCST_ClaimContactViaCCRPublicID(aClaim.ClaimNumber, publicID, role, propsCC)
    }
    else if (keyType == "claimClaimant")
    {
    	claimContacts = _claimsDAO.getCCST_ClaimantClaimContactForClaim(aClaim.ClaimNumber, propsCC)
    }
    else if (keyType == "ExpIDandPublicID")
    {
    	claimContacts = _claimsDAO.getCCST_ExposureClaimContactForClaim(aClaim.ClaimNumber, publicID, exposureID, propsCC)
    }
    
    for (clmContactCCST in claimContacts) 
    {
      clmContact = claimContactMap.get(clmContactCCST.PublicID)
      if (clmContact <> null) 
      {
        break
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
      clmContact.Claim = aClaim
      if (clmContactCCST.PolicyID <> null) 
      {
        clmContact.Policy = aClaim.Policy
      }
      clmContact.PublicID = clmContactCCST.PublicID
      break
    }
    return clmContact;
  }

  public function buildContact(publicID : String, role : String, aClaim : Claim, propsCC : HashMap, _claimsDAO : IClaimsConversionDAO, 
                               contacts : List<CCSTClaimContactBean>, keyType : String, contactMap : HashMap<String, Contact>, 
                               addressMap : HashMap<String, Address>, exposureID : String) : Contact 
  {
    Logger.logInfo("Processing BuildContact: PublicID "+publicID)
    var contact: Contact
    if (keyType == "Role") 
    {
      contacts = _claimsDAO.getCCST_ClaimContact(aClaim.ClaimNumber, role, propsCC)
    }
    else if (keyType == "ContPublicID") 
    {
      contacts = _claimsDAO.getCCST_ClaimContactViaContPublicID(aClaim.ClaimNumber, publicID, propsCC)
    }  
    else if (keyType == "ContPublicIDandRole") 
    {
      contacts = _claimsDAO.getCCST_ContactViaCCRPublicID(aClaim.ClaimNumber, publicID, role, propsCC)
    }  
    else if (keyType == "ClmContPublicID") 
    {
      contacts = _claimsDAO.getCCST_ClaimContactViaClmContPublicID(aClaim.ClaimNumber, publicID, propsCC)
    }
    else if (keyType == "PublicIDandRole") 
    {
      contacts = _claimsDAO.getCCST_ClaimContactViaCCRPublicID(aClaim.ClaimNumber, publicID, role, propsCC)
    }
    else if (keyType == "claimClaimant")
    {
      contacts = _claimsDAO.getCCST_ClaimantClaimContactForClaim(aClaim.ClaimNumber, propsCC)
    }
    else if (keyType == "ExpIDandPublicID")
    {
      contacts = _claimsDAO.getCCST_ExposureClaimContactForClaim(aClaim.ClaimNumber, publicID, exposureID, propsCC)
    }
    for (contactCCST in contacts) 
    {
      var existContact : Contact
      existContact = contactMap.get(contactCCST.PublicID)
      if (existContact <> null) 
      {
        return existContact
      }
      else 
      {
        existContact = contactMap.get(contactCCST.Role)
        if (existContact <> null) 
        {
          return existContact
        }
        existContact = contactMap.get(role)
        if (existContact <> null) 
        {
          return existContact
        }
      }
      if (contactCCST.Subtype == "Person" or contactCCST.Subtype == "Doctor" or 
          contactCCST.Subtype == "Attorney" or contactCCST.Subtype == "Adjudicator" or 
          contactCCST.Subtype == "PersonVendor" 
          //New Subtype for Contact Person WC
          or contactCCST.Subtype =="InjuredWorkerExt") 
      {
        contact = buildPerson(contactCCST)
      }
      else if (contactCCST.Subtype == "CompanyVendor") 
      {
        contact = buildCompanyVendor(contactCCST)
      }
      else if (contactCCST.Subtype == "LawFirm") 
      {
        contact = buildLawFirm(contactCCST)
      }
      else if (contactCCST.Subtype == "AutoRepairShop") 
      {
        contact = buildAutoRepairShop(contactCCST)
      }
      else if (contactCCST.Subtype == "LegalVenue") 
      {
        contact = buildLegalVenue(contactCCST)
      }
      else if (contactCCST.Subtype == "LegacyVendorCompanyExt") 
      {
        contact = buildLegacyVendorCompanyExt(contactCCST)
      }
      else if (contactCCST.Subtype == "MedicalCareOrg") 
      {
        contact = buildMedicalCareOrg(contactCCST)
      }
      else if (contactCCST.Subtype == "Ex_GAIVendor") 
      {
        contact = buildEx_GAIVendor(contactCCST)
      }
      //Contact new Subtype for WC
      else if (contactCCST.Subtype == " ex_Agency") 
      {
        contact = buildEx_Agency(contactCCST)
      }
      else 
      {
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
      for (addressCCST in addresses) 
      {
        if (addressCCST.PublicID <> contactCCST.PrimaryAddressID && addressCCST.Country <> null) 
        {
          contact.addAddress(loadAddressData(addressCCST, aClaim))
        }
      }
      contact.PrimaryPhone = contactCCST.PrimaryPhone
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
      contact.VerifiedPolicyContactExt = contactCCST.VerifiedPolicyContactExt
      contact.ex_CloseDate = contactCCST.Ex_CloseDate
      contact.Ex_TaxReportingName = contactCCST.Ex_TaxReportingName
      contact.Ex_TaxStatusCode = contactCCST.Ex_TaxStatusCode
      //Contact new Attributes Mapping for WC
      contact.W8ReceivedDateExt = contactCCST.W8ReceivedDateExt
      contact.W8ReceivedExt = contactCCST.W8ReceivedExt
      contact.PublicID = contactCCST.PublicID
      contactMap.put(contactCCST.PublicIDContact, contact)
    }
    return contact;
  }

  public function buildPerson(contactCCST : CCSTClaimContactBean) : Person 
  {
    Logger.logInfo("Processing buildPerson with publicID:"+contactCCST.PublicID)
    var person : Person
    if (contactCCST.Subtype == "Adjudicator") 
    {
      person = buildAdjudicator(contactCCST)
    }
    if (contactCCST.Subtype == "Doctor") 
    {
      person = buildDoctor(contactCCST)
    }
    else if (contactCCST.Subtype == "Attorney") 
    {
      person = buildAttorney(contactCCST)
    }
    else if (contactCCST.Subtype == "PersonVendor") 
    {
      person = buildPersonVendor(contactCCST)
    }
    //Contact- Person  new Subtype for WC 
    else if (contactCCST.Subtype =="InjuredWorkerExt") 
    {
      person = buildInjuredWorkerExt(contactCCST)
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
    //Contact_Person new Attributes Mapping for WC
    person.LegalFNameExt = contactCCST.LegalFNameExt
    person.LegalLNameExt = contactCCST.LegalLNameExt
    person.LegalMNameExt = contactCCST.LegalMNameExt
    person.HICNExt = contactCCST.HICNExt
    return person
  }

  public function buildDoctor(contactCCST : CCSTClaimContactBean) : Doctor 
  {
    var doctor = new Doctor()
    doctor.DoctorSpecialty = contactCCST.DoctorSpecialty
    doctor.MedicalLicense = contactCCST.MedicalLicense
    doctor.MedicareEligibleExt = contactCCST.MedicareEligibleExt
    doctor.LicenseNumber = contactCCST.LicenseNumber
    return doctor
  }

  public function buildAttorney(contactCCST : CCSTClaimContactBean) : Attorney 
  {
    var attorney = new Attorney()
    attorney.AttorneyLicense = contactCCST.AttorneyLicense
    attorney.AttorneySpecialty = contactCCST.AttorneySpecialty
    return attorney
  }

  public function buildAdjudicator(contactCCST : CCSTClaimContactBean) : Adjudicator 
  {
    var adjudicator = new Adjudicator()
    adjudicator.AdjudicativeDomain = contactCCST.AdjudicativeDomain
    adjudicator.AdjudicatorLicense = contactCCST.AdjudicatorLicense
    return adjudicator
  }

  public function buildAutoRepairShop(contactCCST : CCSTClaimContactBean) : AutoRepairShop 
  {
    var autoRepairShop = new AutoRepairShop()
    autoRepairShop.DMVFacilityNumberExt = contactCCST.DMVFacilityNumberExt
    autoRepairShop.AutoRepairLicense = contactCCST.AutoRepairLicense
    return autoRepairShop
  }

  public function buildAutoTowingAgcy(contactCCST : CCSTClaimContactBean) : AutoTowingAgcy 
  {
    var autoTowingAgcy = new AutoTowingAgcy()
    autoTowingAgcy.AutoTowingLicense = contactCCST.AutoTowingLicense
    return autoTowingAgcy   
  }

  public function buildCompany() : Company 
  {
    var company = new Company()
    return company
  }

  public function buildMedicalCareOrg(contactCCST: CCSTClaimContactBean) : MedicalCareOrg 
  {
    var medCareOrg = new MedicalCareOrg()
    medCareOrg.MedicalOrgSpecialty = contactCCST.MedicalOrgSpecialty
    return medCareOrg
  }

  public function buildLawFirm(contactCCST : CCSTClaimContactBean) : LawFirm 
  {
    var lawFirm = new LawFirm()
    lawFirm.PanelIndicatorExt = contactCCST.PanelIndicatorExt
    lawFirm.LawFirmSpecialty = contactCCST.LawFirmSpecialty
    return lawFirm
  }

  public function buildCompanyVendor(contactCCST: CCSTClaimContactBean) : CompanyVendor 
  {
    var vendor = new CompanyVendor()
    vendor.PayableExt = contactCCST.PayableExt
    vendor.Preferred = contactCCST.Preferred
    return vendor
  }

  public function buildEx_GAIVendor(contactCCST: CCSTClaimContactBean) : Ex_GAIVendor 
  {
    var vendor = new Ex_GAIVendor()
    vendor.PayableExt = contactCCST.PayableExt
    vendor.Preferred = contactCCST.Preferred
    return vendor
  }

  public function buildLegacyVendorCompanyExt(contactCCST: CCSTClaimContactBean) : LegacyVendorCompanyExt 
  {
    var legacyVendor = new LegacyVendorCompanyExt()
    legacyVendor.PayableExt = contactCCST.PayableExt
    legacyVendor.Preferred = contactCCST.Preferred
    return legacyVendor
  }

  public function buildPersonVendor(contactCCST: CCSTClaimContactBean) : PersonVendor 
  {
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
  
  public function buildLegalVenue(contactCCST : CCSTClaimContactBean) : LegalVenue 
  {
    var legalVenue = new LegalVenue()
    legalVenue.VenueType = contactCCST.VenueType
    return legalVenue
  }

  public function checkClaimContactRoles(publicID : String, claimNumber : String, propsCC : HashMap, _claimsDAO : IClaimsConversionDAO) : String 
  {
    var policyRole = ""
    var claimContactRoles : List<CCSTClaimContactBean>
    claimContactRoles = _claimsDAO.getCCST_ClaimContactViaClmContPublicID(claimNumber, publicID, propsCC)
    for (clmContactRoleCCST in claimContactRoles) 
    {
      if (clmContactRoleCCST.Role == "insured" or clmContactRoleCCST.Role == "underwriter") 
      {
        policyRole = clmContactRoleCCST.Role
      }
    }
    return policyRole
}

  public function buildClaimContactRoles(publicID : String, role : String, claimContact : ClaimContact, claimNumber : String, loadCommandID : int, 
                                         propsCC : HashMap, _claimsDAO : IClaimsConversionDAO, claim : Claim, exposure : Exposure) : HashMap<String, ClaimContactRole> 
                                         
  {
    Logger.logInfo("Processing BuildClaimContactRoles with PublicID "+publicID)
    var claimContactRoles : List<CCSTClaimContactBean>
    var ccrMap = new HashMap<String, ClaimContactRole>()
    
    if (role == "claimant" && exposure == null)
    {
       claimContactRoles = _claimsDAO.getCCST_ClaimantClaimContactForClaim(claimNumber, propsCC)
    }
    else if (exposure <> null)
    {
      if (role == "claimant")
      {
        claimContactRoles = _claimsDAO.getCCST_ClaimantClaimContactForExposure(claimNumber, publicID, propsCC)
      }else
      {
        claimContactRoles = _claimsDAO.getCCST_ExposureClaimContactForClaim(claimNumber, publicID, exposure.PublicID, propsCC)
      }
    }
    else if ( role <> null)
    {
      claimContactRoles = _claimsDAO.getCCST_ContactViaCCRPublicID(claimNumber, publicID, role, propsCC)
    }
    else
    {
      claimContactRoles = _claimsDAO.getCCST_OtherClaimContactForClaim(claimNumber, publicID, propsCC)
    }
    
    var clmContactRole : ClaimContactRole
    for (clmContactRoleCCST in claimContactRoles) 
    {
      clmContactRole = new ClaimContactRole()  
      clmContactRole.Active = clmContactRoleCCST.Active
      clmContactRole.Role = clmContactRoleCCST.Role
      clmContactRole.CoveredPartyType = clmContactRoleCCST.CoveredPartyType
      clmContactRole.setFieldValue("LoadCommandID", loadCommandID)
      clmContactRole.PartyNumber = clmContactRoleCCST.PartyNumber
      clmContactRole.RoleStatusExt = clmContactRoleCCST.RoleStatusExt
      clmContactRole.Comments = clmContactRoleCCST.Comments
      //ClaimContactRole New Attribute Mapping for WC
      clmContactRole.PublicID = clmContactRoleCCST.PublicIDCCR
      clmContactRole.setRoleOwner()

      if (clmContactRoleCCST.PolicyID <> null) 
      {
        clmContactRole.Policy = claim.Policy
      }
      
      if (clmContactRoleCCST.ExposureID <> null and exposure <> null) 
      {
        clmContactRole.Exposure = exposure
      }
     
      clmContactRole.ClaimContact = claimContact
      if (role <> null and role == clmContactRole.Role.Code) 
      {
        ccrMap = new HashMap<String, ClaimContactRole>()
        ccrMap.put(role, clmContactRole)
      }
    }
    return ccrMap
  }

  public function buildTransLineItem(checkCCST : CCSTCheckBean, aClaim : Claim) : TransactionLineItem 
  {
    var transLineItem : TransactionLineItem
    transLineItem = new TransactionLineItem()
    transLineItem.IRS1099BoxNumberExt = checkCCST.IRS1099BoxNumberExt
    transLineItem.LineCategory = checkCCST.LineCategory
    transLineItem.VendorDescriptionExt = checkCCST.VendorDescriptionExt
    transLineItem.GrossAmountExt = checkCCST.GrossAmountExt
    transLineItem.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
    return transLineItem
  }

  public function buildTransLineItem(recoveryCCST : CCSTRecoveryBean, aClaim : Claim) : TransactionLineItem 
  {
    var transLineItem : TransactionLineItem
    transLineItem = new TransactionLineItem()
    transLineItem.IRS1099BoxNumberExt = recoveryCCST.IRS1099BoxNumberExt
    transLineItem.LineCategory = recoveryCCST.LineCategory
    transLineItem.VendorDescriptionExt = recoveryCCST.VendorDescriptionExt
    transLineItem.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
    return transLineItem
  }
  
  /**
  * Maps the CLEEExt Attributes for WC LOB
  * 
  * @param publicID
  *             - CLEEExt ID
  * @param propsCC
  *             - HashMap Object
  * @param _claimsDAO
  *             - IClaimsConversionDAO object for fetching Staging data
  * @return cleeext
  *             - Returns CLEEExt object after mapping to Operational
  */ 
  public function buildCLEEExt(publicID : String, propsCC : HashMap, _claimsDAO : IClaimsConversionDAO, aClaim : Claim) : CLEEExt  
  {
    Logger.logInfo("Processing BuildCLEEExt with PublicID "+publicID)  
    var cleeexts = _claimsDAO.getCCST_CLEEExt(publicID, propsCC)
    var cleeext = new CLEEExt()
    if (not cleeexts.Empty) 
    {
      for (cleeextCCST in cleeexts) 
      { 
        cleeext.CodeExt = cleeextCCST.CodeExt
        cleeext.PublicID = cleeextCCST.PublicID
        cleeext.CLEELocationExt = cleeextCCST.CLEELocationExt
        cleeext.DescriptionOneExt = cleeextCCST.DescriptionOneExt
        cleeext.DescriptionThreeExt = cleeextCCST.DescriptionThreeExt
        cleeext.DescriptionTwoExt = cleeextCCST.DescriptionTwoExt
        cleeext.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
        aClaim.CLEEExt = cleeext
        cleeext.Policy = aClaim.Policy
      }
    }
    return cleeext
  }
  
  /**
  * Maps the ClaimWorkComp Attributes for WC LOB
  * 
  * @param publicID
  *             - ClaimWorkComp ID
  * @param propsCC
  *             - HashMap Object
  * @param _claimsDAO
  *             - IClaimsConversionDAO object for fetching Staging data
  * @return claimWorkComp
  *             - Returns ClaimWorkComp object after mapping to Operational
  */ 
  public function buildClaimWorkComp(publicID : String, propsCC : HashMap, _claimsDAO : IClaimsConversionDAO, aClaim : Claim) : ClaimWorkComp  
  {
    Logger.logInfo("Processing BuildClaimWorkComp with PublicID "+publicID)
    var claimworkcomps = _claimsDAO.getCCST_ClaimWorkComp(publicID,propsCC)
    var claimWorkComp : ClaimWorkComp = new ClaimWorkComp()
    if (not claimworkcomps.Empty) 
    {
      for (claimWorkCompCCST in claimworkcomps) 
      {
        claimWorkComp.MedicalReport = claimWorkCompCCST.MedicalReport
        claimWorkComp.PublicID = claimWorkCompCCST.PublicID
        claimWorkComp.TimeLossReport = claimWorkCompCCST.TimeLossReport
        claimWorkComp.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
        aClaim.ClaimWorkComp = claimWorkComp
      }
    }
    return claimWorkComp
  }
  
  /**
  * Maps the EmploymentData Attributes for WC LOB
  * 
  * @param publicID
  *             - EmploymentData ID
  * @param propsCC
  *             - HashMap Object
  * @param _claimsDAO
  *             - IClaimsConversionDAO object for fetching Staging data
  * @return employmentData
  *             - Returns Employment object after mapping to Operational
  */  
  public function buildEmploymentData(publicID : String, propsCC : HashMap, _claimsDAO : IClaimsConversionDAO, aClaim : Claim) : EmploymentData  
  {
    Logger.logInfo("Processing BuildEmploymentData with PublicID "+publicID)
    var employmentData = new EmploymentData()
    var employmentDatas = _claimsDAO.getCCST_EmploymentData(publicID,propsCC)
    if (not employmentDatas.Empty) 
    {
      for (employmentDataCCST in employmentDatas) 
      { 
        employmentData.WageAmount = employmentDataCCST.WageAmount
        employmentData.WageAmountPostInjury = employmentDataCCST.WageAmountPostInjury
        employmentData.EmploymentStatus = employmentDataCCST.EmploymentStatus
        employmentData.PublicID = employmentDataCCST.PublicID
        employmentData.Occupation = employmentDataCCST.Occupation
        employmentData.HireDate = employmentDataCCST.HireDate
        employmentData.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
        aClaim.EmploymentData = employmentData
      }
    }
    return employmentData
  }
  
  /**
  * Maps the InjuredWorkerExt Contact Attributes for WC LOB
  * 
  * @param contactCCST
  *             - ClaimContact Attributes Bean
  * @return injuredWorker
  *             - Returns InjuredWorkerContact object after mapping to Operational
  */ 
  public function buildInjuredWorkerExt(contactCCST: CCSTClaimContactBean) : InjuredWorkerExt 
  {
    Logger.logInfo("Processing BuildInjuredWorker with Contact PublicID "+contactCCST.PublicIDContact+ 
                   "and ClaimContact PublicID "+contactCCST.PublicID)
    var injuredWorker = new InjuredWorkerExt()
    injuredWorker.MinorWorkerExt = contactCCST.MinorWorkerExt
    return injuredWorker
  }
  
  /**
  * Maps the Contact ExAgency Attributes for WC LOB
  * 
  * @param contactCCST
  *             - ClaimContact Attributes Bean
  * @return vendor
  *             - Returns ex_Agency object after mapping to Operational
  */  
  public function buildEx_Agency(contactCCST: CCSTClaimContactBean) : ex_Agency 
  {
    Logger.logInfo("Processing BuildEx_Agency with Contact PublicID "+contactCCST.PublicIDContact+ 
                   "and ClaimContact PublicID "+contactCCST.PublicID)
    var vendor = new ex_Agency()
    vendor.AgencyProfitCenterNameExt = contactCCST.AgencyProfitCenterNameExt
    vendor.ex_FundedDeductible = contactCCST.Ex_FundedDeductible
    var producingBusinessUnitExtQuery = gw.api.database.Query.make(entity.GAIBusinessUnitExt)
    producingBusinessUnitExtQuery.compare("PublicID", Equals, contactCCST.ProducingBusinessUnitExt)
    var producingBusinessUnits = producingBusinessUnitExtQuery.select()
    for (producingBusinessUnit in producingBusinessUnits) 
    {
      vendor.ProducingBusinessUnitExt = producingBusinessUnit
    }
    return vendor
  }
  
  /**
  * Maps the BodyPart Attributes for WC LOB
  * 
  * @param bodyPartCCST
  *             - BodyPart Attributes Bean
  * @return bodyPart
  *             - Returns BodyPart object after mapping to Operational
  */ 
  public function buildBodyPart(bodyPartCCST : CCSTBodyPartBean, aClaim : Claim) : BodyPartDetails
  {
    Logger.logInfo("Processing BuildBodyPart with PublicID "+bodyPartCCST.PublicID)
    var bodyPart = new BodyPartDetails()
    bodyPart.PublicID = bodyPartCCST.PublicID
    bodyPart.PrimaryBodyPart = bodyPartCCST.PrimaryBodyPart
    bodyPart.DetailedBodyPart = bodyPartCCST.DetailedBodyPart
    bodyPart.PrimaryExt = bodyPartCCST.PrimaryExt
    bodyPart.Ordering = bodyPartCCST.Ordering
    bodyPart.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
    return bodyPart
  }
  
  /**
  * Maps the InjuryDiagnosis Attributes for WC LOB
  * 
  * @param injuryDiagnosisCCST
  *             - InjuryDiagnosis Attributes Bean
  * @param contactMap
  *             - Stored Contact details
  * @return injuryDiagnosis
  *             - Returns InjuryDiagnosis object after mapping to Operational
  */ 
   public function buildInjuryDiagnosis(injuryDiagnosisCCST : CCSTInjuryDiagnosisBean, contactMap : HashMap<String, 
                                        Contact>, aClaim : Claim) : InjuryDiagnosis
  {
    Logger.logInfo("Processing BuildInjuryDiagnosis with PublicID "+injuryDiagnosisCCST.PublicID)
    var injuryDiagnosis = new InjuryDiagnosis()
    injuryDiagnosis.PublicID = injuryDiagnosisCCST.PublicID
    if(injuryDiagnosisCCST.ContactID != null)
    {
      injuryDiagnosis.Contact = contactMap.get(injuryDiagnosisCCST.ContactID)
    }
    var ICDCodeQuery = gw.api.database.Query.make(entity.ICDCode)
    ICDCodeQuery.compare("PublicID", Equals, injuryDiagnosisCCST.ICDCode)
    var ICDCode = ICDCodeQuery.select().FirstResult
    if (ICDCode != null) 
    {
      injuryDiagnosis.ICDCode = ICDCode
    }
    injuryDiagnosis.ICDMedReportExt = injuryDiagnosisCCST.ICDMedReportExt
    injuryDiagnosis.IsPrimary = injuryDiagnosisCCST.IsPrimary
    injuryDiagnosis.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
    return injuryDiagnosis
  }
  
  /**
  * Maps the ContactISOMedicare Attributes for WC LOB
  * 
  * @param ContactISOMedicareExtCCST
  *             - ContactISOMedicare Attributes Bean
  * @return contactISOMedicareExt
  *             - Returns ContactISOMedicare object after mapping to Operational
  */ 
  public function buildContactISOMedicareExt(ContactISOMedicareExtCCST : CCSTContactISOMedicareExtBean, aClaim : Claim) : ContactISOMedicareExt
  {
    Logger.logInfo("Processing BuildContactISOMedicareExt with PublicID "+ContactISOMedicareExtCCST.PublicID)
    var contactISOMedicareExt = new ContactISOMedicareExt()
    contactISOMedicareExt.CMSIncidentDateExt = ContactISOMedicareExtCCST.CMSIncidentDateExt
    contactISOMedicareExt.ORMEndDateExt = ContactISOMedicareExtCCST.ORMEndDateExt
    contactISOMedicareExt.PublicID = ContactISOMedicareExtCCST.PublicID
    contactISOMedicareExt.ORMIndExt = ContactISOMedicareExtCCST.ORMIndExt
    contactISOMedicareExt.ProductLiabTypeExt = ContactISOMedicareExtCCST.ProductLiabTypeExt
    contactISOMedicareExt.StateOfVenueExt = ContactISOMedicareExtCCST.StateOfVenueExt
    contactISOMedicareExt.NFILLimitExt = ContactISOMedicareExtCCST.NFILLimitExt
    contactISOMedicareExt.setFieldValue("LoadCommandID", aClaim.LoadCommandID)
    return contactISOMedicareExt
  }
  
  /**
   * Maps the ContactICDExt Attributes for WC LOB
   * 
   * @param ContactICDExtCCST
   *             - ContactICDExt Attributes Bean
   * @return contactICDExt
   *             - Returns ContactICDExt object after mapping to Operational
   */ 
  public function buildContactICDExt(ContactICDExtCCST : CCSTContactICDExtBean) : ContactICDExt
  {
    Logger.logInfo("Processing BuildContactICDExt with PublicID "+ContactICDExtCCST.PublicID)
    var contactICDExt = new ContactICDExt()
    contactICDExt.PublicID = ContactICDExtCCST.PublicID
    //ICDCode Needs to be revisited
    var ICDCodeQuery = gw.api.database.Query.make(entity.ICDCode)
    ICDCodeQuery.compare("PublicID", Equals, ContactICDExtCCST.ICDCode)
    var ICDCodes = ICDCodeQuery.select()
    for (ICDCode in ICDCodes) 
    {
      contactICDExt.ICDCode = ICDCode
    }
    return contactICDExt
  }
  
   /**
   * Maps the Claim Contact for Exposure other than Claimant
   * 
   * @param aClaim
   *             - Claim Object
   * @param claimContactMap
   *             - Map of Claim Contact Object with its Public IDs
   * @param addressMap
   *             - Map of Addresses Object with its Public IDs
   * @param contactMap
   *             - Map of Contacts Object with its Public IDs
   * @param exposure
   *             - Exposure Object
   * @param propsCC
   *             - HashMap Object
   * @param _claimsDAO
   *             - IClaimsConversionDAO object for fetching Staging data
   */ 
  public function buildExpOtherContacts(exposure : Exposure, aClaim : Claim, propsCC : HashMap, 
                                        _claimsDAO : IClaimsConversionDAO , contactMap : HashMap<String, Contact>, claimContactMap : HashMap<String, ClaimContact>, 
                                        addressMap : HashMap<String, Address>) : ArrayList <ClaimContactRole>
  {
    Logger.logInfo("Processing Build Exposure Other Contacts with PublicID "+exposure.PublicID)
    var publicID = exposure.PublicID
    var exposureContacts = _claimsDAO.getCCST_ClaimContactForExp(aClaim.ClaimNumber, publicID, propsCC)
    var retValue = new ArrayList<ClaimContactRole>()
    for (var exposureContact in exposureContacts)
    {
      var claimContactID = exposureContact.PublicID
      var contactID = exposureContact.PublicIDContact
      var role = exposureContact.Role
      var keyType = "ExpIDandPublicID"
      var expClaimContact = buildClaimContact(claimContactID, role , aClaim, propsCC, _claimsDAO, null, keyType, claimContactMap, publicID)
      var expContact = buildContact(contactID, role, aClaim, propsCC, _claimsDAO, null, keyType, contactMap, addressMap, publicID)
      var ccrMap = buildClaimContactRoles(claimContactID, role, expClaimContact, aClaim.ClaimNumber, aClaim.LoadCommandID, propsCC, _claimsDAO, 
                             aClaim, exposure)
      retValue.add(ccrMap.get(role))                             
      expClaimContact.Contact = expContact
      claimContactMap.put(expClaimContact.PublicID, expClaimContact)
      contactMap.put(expContact.PublicID, expContact)
    }
    return retValue
  }
  
  /**
  * Maps the ContactICDExt Attributes for WC LOB
  * 
  * @param ContactICDExtCCST
  *             - ContactICDExt Attributes Bean
  * @return contactICDExt
  *             - Returns ContactICDExt object after mapping to Operational
  */ 
  function buildISOMedicareExt(_claimsDAO : IClaimsConversionDAO, aClaim : Claim, contact : Contact, propsCC : HashMap)
  {
    Logger.logInfo("Processing build ISOMedicareExt with PublicID for the Claim "+aClaim.ClaimNumber)
    var contactISOMediCareExt : ContactISOMedicareExt
    var ContactISOMedicareExtsCCST = _claimsDAO.getCCST_ContactISOMedicareExt(aClaim.ClaimNumber,propsCC)
    for(ContactISOMedicareExtCCST in ContactISOMedicareExtsCCST)
    {
      contactISOMediCareExt = buildContactISOMedicareExt(ContactISOMedicareExtCCST, aClaim)
      contactISOMediCareExt.Contact = contact
    }
    var ContactICDExtsCCST = _claimsDAO.getCCST_ContactICDExt(aClaim.ClaimNumber,propsCC)
    for(ContactICDExtCCST in ContactICDExtsCCST)
    {
      var contactICDExt = buildContactICDExt(ContactICDExtCCST)
      contactICDExt.ContactISOMedicareExt = contactISOMediCareExt
    }
  }
  
  override property get Progress() : String 
  {
    return ("Processed " + this.OperationsCompleted + " of " + OperationsExpected)}
  }