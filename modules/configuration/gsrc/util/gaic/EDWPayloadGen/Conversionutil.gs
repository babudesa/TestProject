package util.gaic.EDWPayloadGen
uses java.lang.String
uses util.gaic.EDWPayloadGen.EDWMessagePayloadDTO

uses java.lang.Exception
uses com.gaic.integration.cc.edw.edwpayloadgen.EDWPayloadGenConversion
uses java.util.ArrayList
uses util.UniqueNumberGenerators
uses java.sql.SQLException
uses gw.api.util.Logger
uses java.util.Properties
uses java.lang.Thread
uses java.util.Date
uses java.util.HashSet
uses com.gaic.claims.xml.xpath.XPathProcessor
uses com.gaic.claims.xml.xpath.XPathProcessorFactory

/*This helper class is used to perform variious activities such as retrieve converted claims, insert paylods 
  retrieve existing publicids , update trigger table and update existing payloads */
class Conversionutil {
  
  var className = "[" + getClass().getName() + "]"
  var default_thread_count:int=10
  static private var _startTime:Date = null
  private static var logger = Logger.forCategory("EDWConversionLog") 
  
  /*
  * Gets the claim count
  * @result int, count of claim
  */
  function getClaimCount():int {
     var edwClmCount = new EDWPayloadGenConversion()
     var max_claim_count = edwClmCount.countMaxClaim()
     return max_claim_count
  }
  
  
  /*
  * Verifies the Claim processed
  */ 
  function checkClaimProcessed():void {
    var edwClmStatus = new EDWPayloadGenConversion()
    edwClmStatus.verifyProcessedClaim()
  }
  
  /*
  * Insert the generated Payload xml to EDWMEssageTransaction Table.
  *
  * @param claimNum, CC Claim Number
  * @param eventName, Payload Event Name
  * @param publicId, Public ID of the Payload
  * @param payload, Message Payload    
  * @param forNotes, Flag for denoting notes payload process
  */
  function insertPayload(claimNum:String, payload:String, eventName:String, publicId:String, forNotes:boolean)
  {
    logger.info( "Inserting Payload for the claim number: "+claimNum+" publicid: "+publicId+" evename: " +eventName)
    var edwInsert = new EDWPayloadGenConversion()
    try
    {        
       edwInsert.setForNotes(forNotes)
       edwInsert.setEDWConverted(true)
       edwInsert.processPayload(payload, eventName, publicId)
    }
    catch(e:Exception)
    {
      logger.info(className+" Exception caught in insertPayload function")
      throw new Exception(e) 
    }
    finally
    {
      edwInsert = null 
      payload = null 
      eventName=null 
      publicId = null
    }
  }
  
  /*
  * It will Update the Processed Status in Source Table(EDWMessageTrigger) as below 
  *  1 as ready for process payload,
  * -1 as failed for claims payload, 
  * -2 as failed for notes payload,
  *  2 as success for claim payload,
  *  3 as success for claim payload
  *
  * @param claimNum, CC Claim Number
  * @param error, Error Message, if any
  * @param proccessId, Process Flag for the specific claim  
  */
  function updateTrigger(claimNum:String,error:String,processId:int) 
  {
    var edwInsert = new  EDWPayloadGenConversion()
    try
    {
      logger.info("Updating EDWConversiontrigger for the claimNum: "+claimNum)
      edwInsert.updateTrigger(claimNum, error, processId)
    }
    catch(e:Exception)
    {
      logger.info(className+"  Exception caught in updateTrigger function ")
      throw new Exception(e.Message) 
    }
    finally
    { 
      edwInsert=null 
      claimNum=null
      processId=null
      error=null
    }
  }
  
  /*
  * Gets the Schema URL
  * @return String represent Schema URL
  */
  function getSchemaURL(): String
  {
    var props : Properties
    var schemaUrl=""
    
    try
    {
      props = new Properties()
      logger.info("Get context class Load:"+ Thread.currentThread().getContextClassLoader())
      props.load(Thread.currentThread().getContextClassLoader().getResourceAsStream("config/edwpush.properties"))
      logger.info("edwpush.properties is loaded")
      logger.info("read property scheme.file from  edwpush.properties :"+props.getProperty("schema.file")) 
      schemaUrl = "/"+props.getProperty("schema.file")
    }
    catch(e:Exception)
    {
      logger.error("error\n"+e.StackTraceAsString)
    }
    finally
      {if(props != null) props.clear()}
                              
     return  schemaUrl
  }
  function updatePayload(oldUniqueId:String)
  {
    var edwCon = new EDWPayloadGenConversion() 
    try{
      var newUniqueId=UniqueNumberGenerators.generateEDWUniqueID() 
      edwCon.updateTransation(oldUniqueId as java.lang.Long,newUniqueId as java.lang.Long)
      newUniqueId = null
    }catch(e:Exception){
       logger.error(className+" "+e.StackTraceAsString )
       throw new Exception(e.Message) 
    }
    finally
    {
      edwCon = null 
    }
  }
  
  /*
  * Gets the Unique ID list
  * @param claimNumber
  * @return Arraylist of Unique IDs of Claim
  */
  function uniqueIdList(claimNumber:String):ArrayList<String>
  {
    var list: ArrayList<String>
    try{
      var edwCon = new EDWPayloadGenConversion()
      var uniqueID=edwCon.getUniqueIds(claimNumber)
      if(uniqueID.Count>0){
        list= new ArrayList<String>()
        list.addAll(uniqueID)
      }
      if(list.Count>0) {
        logger.info("No. of uniqueids : " + list.Count + " exist for a claim : " + claimNumber)
      }
    }
    catch(e:Exception){
       logger.info(className+" Error in reading existing public id from EDWMessageTransaction:"+claimNumber )
       logger.error(className+" "+e.StackTraceAsString )
       throw new Exception(e.Message) 
    }
    return list
  }
  
  /*
  * Retrieves the claims from Trigger table
  * @param loadCmdID
  * @return Arraylist of Claim Numbers
  */
  static function  retrieveClaims(loadcommandid:String) : ArrayList<String>
  {
    var claimsList = new ArrayList<String>()
    try
    {
      var edwClaims= new EDWPayloadGenConversion()
      var triggerClaimsList=edwClaims.selectFromTrigger(loadcommandid)
      logger.info("No. of claims retrieved from   EDWConversionTrigger table"+triggerClaimsList.Count)
      for( triggerClaims  in triggerClaimsList){
        var claimNo  =triggerClaims.ClaimNumber 
        claimsList.add(claimNo)
      }
    }
    catch(ee:SQLException)
    {
      //if insertion will fail to Holder table or any other
      throw new Exception(ee.Message)
    }
    catch(ee:Exception)
    {
      //if insertion will fail to Holder table or any other
      throw new Exception(ee.Message)
    }
    finally
    {
    }
    return claimsList
  }

  /*
  * This is For Notes payload generation through batch job, To fetch claims from EDWMessageTrigger table
  * @param loadCmdID
  * @return Hash Set of Claim Numbers
  */
  static function retrieveClaimsForNotes(loadCmdID:String) : HashSet<String>
  {
    logger.info(" inside retrieveClaimsForNotes loadcommandid : " + loadCmdID)
    var edwClaimsForNotes : EDWPayloadGenConversion
    var claimsList : HashSet<String>
    try
    {
      edwClaimsForNotes = new EDWPayloadGenConversion()
      var claimsToProcess=edwClaimsForNotes.getClaimsFromTrigger(loadCmdID)
      logger.info(" inside retrieveClaimsForNotes claimsToProcess : " + claimsToProcess.Count)
      claimsList = new HashSet<String>()
      for(clmNum in claimsToProcess index indexVal){
        claimsList.add(clmNum.ClaimNumber)
      }
      logger.info(" inside retrieveClaimsForNotes claimsList : " + claimsList.Count)
      claimsToProcess=null 
     }
     catch(ee:SQLException)
     {
      throw new Exception(ee.Message)
     }
     catch(ee:Exception)
     {
      throw new Exception(ee.Message)
     }
     finally
     {
       edwClaimsForNotes=null
     }
     logger.info(" inside retrieveClaimsForNotes return claimsList : " + claimsList.Count)
     return claimsList
   }

   /*
    * If all Notes Processed to EDWMessageTransaction  Table, then make processed=3 in EDWCOnversionTrigger table.
    */
   static function checkClaimForFinalProcess()
   {
     var edwClmStatus = new EDWPayloadGenConversion()
     try
     {
         edwClmStatus.verifyNotesProcessed()
     }
     catch(exp:Exception)
     {
       logger.info("Failed to check claim status from EDWMEssageTrigger Table:"+exp.StackTrace)
     }
     finally
     {
       edwClmStatus = null
     }
   }
 
   /*
    * Gets the number of thread count
    * @return int
    */
   property get noofthreadcount():int
   {
     return default_thread_count
   }
   
   /*
    * Sets the Batch Start Time
    * @param Date 
    */
   public function setBatchStartTime(startTime:Date)
   {
     _startTime = startTime
   }
   
   /*
    * Gets the Batch Start Time
    * @return Date 
    */
   public function getBatchStartTime():Date
   {
     return _startTime
   }
  
  /*
  * #Cognizant# 
  * Deleting the processed Notes payloads if there are any exceptions while inserting the payloads.
  * @param ccClaimNumber
  *           - Claim Number of Payload message
  */ 
  function deleteNotesPayload(ccClaimNumber:String)
  {
    var edwDel = new  EDWPayloadGenConversion()
    logger.info("Inside deleteNotesPayload method in ConversionUtil.gs")
    try
    {
      edwDel.deleteNotesPayloads(ccClaimNumber)
    }
    catch(e:Exception)
    {
       logger.info(className+" Exception caught in deleteNotesPayload function")
       throw new Exception(e) 
    }
    finally
    {
      ccClaimNumber = null
    }
  }
  
    /*
  * #Cognizant# 
  * Deleting the processed Claim payloads if there are any exceptions while inserting the payloads.
  * @param claimNumber
  *           - Claim Number of the specific failed Payloads.
  */ 
  function deleteClaimPayloads(claimNumber:String)
  {
    var edwDel = new  EDWPayloadGenConversion()
    logger.info("Inside deleteNotesPayload method in ConversionUtil.gs")
    try
    {
      edwDel.deleteClaimPayloads(claimNumber)
    }
    catch(e:Exception)
    {
       logger.info(className+" Exception caught in deleteNotesPayload function")
       throw new Exception(e) 
    }
    finally
    {
      claimNumber = null
    }
  }
   
  /*
  * #Cognizant# 
  * Compare the payloads with Master and Child to identify the missing and duplicate payloads.
  * @param masterPayloads
  *            - List of Master Payloads.
  * @param childPayloads
  *            - List of Child Payloads.
  * @return ArrayList<EDWMessagePayloadDTO>
  *            - List of Payloads which got missed while inserted into Transaction table. 
  */
  public function comparePayload (masterPayloads : ArrayList<EDWMessagePayloadDTO>, 
             childPayloads : ArrayList<EDWMessagePayloadDTO>) : ArrayList<EDWMessagePayloadDTO>
  {
    logger.info("Finding the missing/duplicate Payload by comparing the inserted ad retrieved payloads") 
    var retValue = new ArrayList<EDWMessagePayloadDTO>()
    for (masterPayload in masterPayloads)
    {
      var matchFound = false
      var masterPayloadMsg = masterPayload.payload
      var masterPayloadEvent = masterPayload.eventName
      var masterPayloadXpath = getXPath(masterPayloadMsg)
      var masterPayloadTrnx = getTransactionName(masterPayloadMsg)
      var masterPayloadObjStat =  getXPathValue(masterPayloadXpath, masterPayloadTrnx,"ObjectStatus")
      var masterPayloadPublicID = getXPathValue(masterPayloadXpath, masterPayloadTrnx,"PublicID")
      for (childPayload in childPayloads)
      {
        var childPayloadMsg = childPayload.payload
        var childPayloadEvent = childPayload.eventName
        var childPayloadXpath = getXPath(childPayloadMsg)
        var childPayloadTrnx = getTransactionName(childPayloadMsg)
        var childPayloadObjStat =  getXPathValue(childPayloadXpath, childPayloadTrnx,"ObjectStatus")
        var childPayloadPublicID = getXPathValue(childPayloadXpath, childPayloadTrnx,"PublicID")
        if (masterPayloadTrnx.equals(childPayloadTrnx) &&
              masterPayloadEvent.equals(childPayloadEvent) &&
              masterPayloadObjStat.equals(childPayloadObjStat) &&
              masterPayloadPublicID.equals(childPayloadPublicID))
        {
          //Match found
          matchFound = true
          break
        }
      }
      if (matchFound == false)
      {
        //Found the missing Payload as the match condition fails
        retValue.add(masterPayload)
      }
    }
    return retValue
  }
  
  /*
  * #Cognizant# 
  * Gets the XPath Processor based on the Message
  * @param message
  *            - Payload Message.
  * @return XPathProcessor
  *            - XPath generated out of Payload Message. 
  */
  private function getXPath(message : String) : XPathProcessor
  {
    var xPath = XPathProcessorFactory.createXPathProcessor(message)
    return xPath
  }
  
  /*
  * Gets the XPath Values matches the XPath and attribute passed.
  * @param xpath
  *            - XPath Processor generated from Payload Message
  * @param attribute
  *           - Attribute for which Path value needs to be retrieved.
  * @return String
  *            - Relevant value matches the attribute in XPath.
  */
  private function getXPathValue(XPath : XPathProcessor, transactionName : String, attribute : String) : String
  {
    var retString : String = null
    if (attribute == "PublicID")
    {
      retString = XPath.getValue("/Transaction" + "/" + transactionName + "/PublicID")
    }
    else if (attribute == "ObjectStatus")
    {
      retString = XPath.getValue("/Transaction" + "/" + transactionName +  "/ObjectStatus")
    }
    return retString
  }
  
  /*
  * #Cognizant# 
  * Retrieve the transaction type of the message
  * @param xpath
  *            - the xpath of the transaction to be searched
  * @return transactionName
  */
  public function getTransactionName(message : String) : String 
  {
    var xpath = XPathProcessorFactory.createXPathProcessor(message)
    var transactionName = ""
    if (xpath.getNode("/Transaction/Activity") != null) {
      transactionName = "Activity"
    } else if (xpath.getNode("/Transaction/Association") != null) {
      transactionName = "Association"
    } else if (xpath.getNode("/Transaction/BulkInvoice") != null) {
      transactionName = "BulkInvoice"
    } else if (xpath.getNode("/Transaction/Catastrophe") != null) {
      transactionName = "Catastrophe"
    } else if (xpath.getNode("/Transaction/Check") != null) {
      transactionName = "Check"
    } else if (xpath.getNode("/Transaction/Claim") != null) {
      transactionName = "Claim"
    } else if (xpath.getNode("/Transaction/Evaluation") != null) {
      transactionName = "Evaluation"
    } else if (xpath.getNode("/Transaction/Exposure") != null) {
      transactionName = "Exposure"
    } else if (xpath.getNode("/Transaction/FinancialTransaction") != null) {
      transactionName = "FinancialTransaction"
    } else if (xpath.getNode("/Transaction/Negotiation") != null) {
      transactionName = "Negotiation"
    } else if (xpath.getNode("/Transaction/Note") != null) {
      transactionName = "Note"
    } else if (xpath.getNode("/Transaction/Occurrence") != null) {
      transactionName = "Occurrence"
    } else if (xpath.getNode("/Transaction/Party") != null) {
      transactionName = "Party"
    } else if (xpath.getNode("/Transaction/SpecialInvestigation") != null) {
      transactionName = "SpecialInvestigation"
    } else if (xpath.getNode("/Transaction/PaymentSchedule") != null) {
      transactionName = "PaymentSchedule"
    }
    return transactionName
  }
}