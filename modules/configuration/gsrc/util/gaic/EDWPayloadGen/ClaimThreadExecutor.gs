package util.gaic.EDWPayloadGen
uses entity.Claim
uses util.gaic.EDWPayloadGen.EDWMessagePayloadDTO
uses util.gaic.EDWPayloadGen.EDWPayloadGenConversionImpl
uses util.gaic.EDWPayloadGen.Conversionutil
uses java.util.ArrayList
uses java.lang.Exception
uses gw.api.util.Logger
uses java.lang.Thread
uses java.lang.Runnable
uses com.gaic.integration.cc.edw.validator.JAXPValidator
uses org.apache.commons.lang.StringUtils
uses java.lang.StringBuffer
uses java.util.LinkedHashMap
uses java.util.Date

/** This Class is responsible for getting all the claim related payloads,
 *  And validates the payload using JAXPValidator
 * 
 *  Once the payload validation is successful, it inserts the payload in
 *  Message Transaction table.
 * 
 *  If there are any issues while inserting the payloads for any particular claim,
 *  then all the inserted payloads will get deleted for that claim.
 *  
 *  Also included the logic to find out if there are any Missing or Duplicate
 *  payloads
 * 
 *  Deletes the processed payloads, if there are any missing/duplicate payloads 
 *  while inserting the payloads
 */
 
class ClaimThreadExecutor implements Runnable
{
  private  var running:boolean=true
  private var cc:Claim = null
  private var SchemaURL:String = null
  private var conversionutil:Conversionutil = null
  private var payloadList:ArrayList<EDWMessagePayloadDTO> = null
  private var linkedHahmap:LinkedHashMap<String,ArrayList<EDWMessagePayloadDTO>>  = new LinkedHashMap<String,ArrayList<EDWMessagePayloadDTO>> ()
  private static var counter:int = 0
  private var endClaimCount:int =0
  private static var totalClaimCount:int = 0
  private static var _startTime:Date = null
  var logger = Logger.forCategory("EDWConversionLog") 
  public static  var isAlreadySentClaimProcessed:boolean = true 
  
  construct()
  {
  }    
  construct(claimsData:Claim, SmaURL:String)
  {
    this.cc = claimsData
    this.SchemaURL = SmaURL
  }
  
  /**
   * Run method called for all the callables in Thread Executors
   */
  override function run() 
  {
    try
    {
      setIsAlreadySentClaimProcessed(false)
      logger.info("Claim:"+cc+"  Thread:"+Thread.currentThread().Name)
      conversionutil = new Conversionutil()
      if(cc.LoadCommandID !=null)
      {
        var errMessage:StringBuffer = new StringBuffer()
        payloadList = new ArrayList<EDWMessagePayloadDTO>() 
        var edwImpl = new EDWPayloadGenConversionImpl()
        try
        { 
          //Generate the payload for Claim, and adds the payload to payloadList
          try {
            payloadList = edwImpl.getClaimPayLoad(cc , payloadList)
          }
          catch(ee:Exception){
            if(null != ee.Message)
              errMessage.append(ee.Message)
          }
            
          //Generate the payload for Exposure, and adds the payload to payloadList
          try {
            payloadList = edwImpl.getExposureAddedPayload(cc, payloadList)
          }
          catch(ee:Exception){
            if(null != ee.Message)
              errMessage.append(ee.Message)
          }
            
          //Generate the payload for Activities, and adds the payload to payloadList
          try {
            payloadList = edwImpl.getActivitiesPayload(cc, payloadList)
          }
          catch(ee:Exception) {
            if(null != ee.Message)
              errMessage.append(ee.Message)
          }
            
          //Generating the Payload for MainContact and ReportedBy, and adds the payload to payloadList
          try {
            payloadList = edwImpl.getMainContAndReportByPayload(cc, payloadList)
          }
          catch(ee:Exception) {
            if(null != ee.Message)
              errMessage.append(ee.Message)
          }
            
         //Generate the payload for UserRoleAssignment , and adds the payload to payloadList  
          try {
            payloadList = edwImpl.getUserRoleAssignPayload(cc, payloadList)
          }
          catch(ee:Exception) {
              if(null != ee.Message)
              errMessage.append(ee.Message)
          }
          
          //Generate the payload for contacts , and adds the payload to payloadList
          try {
             payloadList = edwImpl.getContactPayload(cc, payloadList)
           }
          catch(ee:Exception){
              if(null != ee.Message)
              errMessage.append(ee.Message)
           }
           
          //Generate the payload for Associations , and adds the payload to payloadList
          try {
              payloadList = edwImpl.getAssociationPayload(cc, payloadList)
            }
            catch(ee:Exception){
               if(null != ee.Message)
              errMessage.append(ee.Message)
          }
          
          //Generate the payload for Check, and adds the payload to payloadList
          try {
            payloadList = edwImpl.getCheckPayload(cc, payloadList)
          }
          catch(ee:Exception)
          {
               if(null != ee.Message)
              errMessage.append(ee.Message)
          }
          
          //Generate the payload for Transaction - Recovery , Reserve and RecoveryReserve  , and adds the payload to payloadList
          try {
             payloadList = edwImpl.getTransactionPayload(cc, payloadList)
          }
          catch(ee:Exception) {
               if(null != ee.Message)
              errMessage.append(ee.Message)
          } 
          
          //Generate the payload for ActivitiesChanged, and adds the payload to payloadList
          try {
            payloadList = edwImpl.getActivitiesChangedPayload(cc, payloadList)
          }
          catch(ee:Exception) {
            if(null != ee.Message)
              errMessage.append(ee.Message)
          }
          
          //Generate the payload for ExposureChanged, and adds the payload to payloadList
          try {
            payloadList = edwImpl.getExposureChangedPayload(cc, payloadList)
          }
          catch(ee:Exception) {
            if(null != ee.Message)
              errMessage.append(ee.Message)
          } 
          
          //Generate the payload for ClaimChanged, and adds the payload to payloadList
           try {
            payloadList = edwImpl.getClaimChangedPayload(cc, payloadList)
          }                   
          catch(ee:Exception) {
               if(null != ee.Message)
              errMessage.append(ee.Message)
          }
          
          //In case of any expcetion while generating the Payloads for the specific claim, Trigger table is getting updated to -1 with error message.
          if(!StringUtils.isEmpty(errMessage as java.lang.String))
          {
             logger.info("Exception in generating the Payload from CC table for the Claim: "+cc.ClaimNumber)
             conversionutil.updateTrigger(cc.ClaimNumber, errMessage as java.lang.String, -1)
          }
          
          //If there are payloads and no exception while fetching Payload from CC, JAXP validation process begins.
          if(payloadList.Count > 0 && StringUtils.isEmpty(errMessage as java.lang.String)) 
          {
            linkedHahmap.put("ClaimPayloads", payloadList)
            var validatePayload : boolean = false  
            var validator:JAXPValidator = null
            var insertedPayLoad = new ArrayList<EDWMessagePayloadDTO>() 
            //Validate all payload xml data with SchemaClaimCenterToEDW.xsd and assign validatePayload=true when the payload is sucessfully validated
            for(xx in linkedHahmap.entrySet().iterator().toList()) 
            {
              for(payload in xx.Value)  
              {
                try 
                {
                   validator = new JAXPValidator()
                   validatePayload = validator.validateEdwPayloadGen(SchemaURL, payload.payload, payload.publicIdVal, payload.eventName)
                   if (validatePayload == false)
                   {
                     logger.info("Validation fails in JAXP Validator")
                     break
                   }
                } 
                catch(ee:Exception) 
                {
                  logger.info("Exception caught in validating the Payload with JAXP for the Payload Event"+payload.eventName)
                  if(null != ee.Message)
                     errMessage.append(ee.Message)
                   break
                }
              }
            }
            
            //In case of any error in Payload creation or validating the Payload with JAXP Validator
            if(!StringUtils.isEmpty(errMessage as java.lang.String) || validatePayload == false)
            {
               logger.info("Validation fails in JAXP Validator and updating trigger table with -1")
               conversionutil.updateTrigger(cc.ClaimNumber, errMessage as java.lang.String, -1)
            }
            
            //insert all the valid payloads to the EDWMessagetransaction table
            if (validatePayload == true && StringUtils.isEmpty(errMessage as java.lang.String))
            {
              //Identify and Retrieve publicids for a claim from the EDWMessagetransaction table
              /* if publicid's are already exitis in the EDWMessageTransaction table, do the following process for matched publidIDs record
                     1.update the unique of the record 
                     2.update the cctransactiontime & uniqueid of the payload xml
                */
              var idList = conversionutil.uniqueIdList(cc.ClaimNumber)
              if(idList.Count > 0)
              {
                for(uniqueId in idList)
                {
                   var conversnUtil = new Conversionutil()
                   conversnUtil.updatePayload(uniqueId)
                }
                idList.clear()
              }
              
              try
              {
              	//Updating the Trigger table to 1, as the claim payload is ready for processing
                conversionutil.updateTrigger(cc.ClaimNumber, null, 1)
                logger.info("Updating the Trigger table to 1, start the Payload process")
              }
              catch (ee: Exception)
              {
                logger.info ("Exception caught while updating the trigger table to 1 for the Claim Number :"+cc.ClaimNumber)
              	if(null != ee.Message)
              	{
              	  errMessage.append(ee.Message)
              	  throw new Exception ((errMessage as java.lang.String))
              	}
              }
                      
              var insertSuccessFlag = false
              for(list in linkedHahmap.entrySet().iterator().toList()) 
              {
                for(payload in list.Value)  
                {
                  try
                  {
                    //Inserting the payload in Transaction table
                    conversionutil.insertPayload(cc.ClaimNumber, payload.payload, payload.eventName,payload.publicIdVal, false)
                    insertedPayLoad.add(payload)
                    //Once after succesful insertion of payload, setting the insertSuccessFlag to true
                    insertSuccessFlag = true
                  }
                  catch(e:Exception)
                    {
                       //If Payloads are failed to insert into EDWMessagetransaction table. update processed =-1 and errors to EDWConversiontrigger table
                       logger.info("Exception caught while inserting the payload into EDWMessageTransaction table for the claim "+cc.ClaimNumber)
                       var error=e.StackTraceAsString
                       errMessage.append(error)
                       
                       //Deleting the processed payloads, if there are any exceptions while inserting the payloads and updating the trigger table to -1
                       try
                       {
                         logger.info("Deleting all the Claims Payloads inserted for the claim: "+cc.ClaimNumber)
                      	 conversionutil.deleteClaimPayloads(cc.ClaimNumber)
                      	 logger.info("Updating Trigger table with processed =-1 for the claim number " + cc.ClaimNumber)
                           conversionutil.updateTrigger(cc.ClaimNumber, errMessage as java.lang.String, -1)
                       }
                       catch (ee: Exception)
                       {
                      	 logger.info ("Exception caught while deleting the claim payloads and updating the trigger table for the Claim Number :"+cc.ClaimNumber)
                      	 if(null != ee.Message)
                      	 {
                      	   errMessage.append(ee.Message)
                      	   throw new Exception ((errMessage as java.lang.String))
                      	 }
                       }
                       insertSuccessFlag=false
                       break
                     }
                   }
                 }
                 
                 //In case all of the inserts are success without any exception                      
                 if (insertSuccessFlag)
                 {
                   logger.info ("CC Payload Count "+payloadList.Count +" and Payload in EDW table count "+insertedPayLoad.Count +" for the claim #"+cc.ClaimNumber)
                   
                   //Comparing the count of Payload fetched from CC with Payload inserted in EDW Message table.
                   if (insertedPayLoad.Count == payloadList.Count)
                   {
                     logger.info("EDW Insert of all Payloads success for Claim "+cc.ClaimNumber +" updating Trigger table with 2")
                     //Payloads are sucessfully inserted into  EDWMessageTransaction table. update processed =2 to EDWConversionTrigger table  
                     conversionutil.updateTrigger(cc.ClaimNumber, null, 2)
                   }
                   else
                   {
                     var error = "Error while inserting Payload for Claim " + cc.ClaimNumber
                     
                     //Identifying the missing Payload for the Claim
                     if (insertedPayLoad.Count < payloadList.Count)
                     {
                       var missingPayloads = conversionutil.comparePayload(payloadList, insertedPayLoad)
                       if (missingPayloads.Count > 0)
                       {
                         error += "Missing Payload Counts: "+missingPayloads.Count
                         for (missingPayload in missingPayloads)
                         {
                           error += "Missing Payload details: " +
                                    "Event Name: " + missingPayload.eventName +
                                    "publicID: " + missingPayload.publicIdVal +
                                    "Transaction Name: " + conversionutil.getTransactionName(missingPayload.payload)
                         }
                         logger.info("Missing Payload Identied"+error)
                        }
                      }
                      
                      //Identifying the Duplicate Payload for the Claim
                      else if (insertedPayLoad.Count > payloadList.Count)
              	      {
                        var duplicatePayloads = conversionutil.comparePayload(insertedPayLoad, payloadList)
                        if (duplicatePayloads.Count > 0)
                        {
                          error += "Duplicate Payload Counts: "+duplicatePayloads.Count
                          for (duplicatePayload in duplicatePayloads)
                          {
                            error += "Duplicate Payload details: " +
                                     "Event Name: " + duplicatePayload.eventName +
                                     "publicID: " + duplicatePayload.publicIdVal +
                                     "Transaction Name: " + conversionutil.getTransactionName(duplicatePayload.payload)
                          }
                          logger.info("DuplicatePayload Payload Identied"+error)
                        }
              	      }
              	      
              	      //Deleting the processed payloads, if there are any missing/duplicate payloads while inserting the payloads
                      try
                      {
                        logger.info("Deleting all the Claims Payloads inserted for the claim: "+cc.ClaimNumber)
                        conversionutil.deleteClaimPayloads(cc.ClaimNumber)
                        //updating the trigger table = -1 in case of missing/duplicate payloads
                        logger.info("EDW Insert of all Payload fails for Claim "+ cc.ClaimNumber +" updating Trigger table with -1")
                        conversionutil.updateTrigger(cc.ClaimNumber, error, -1)
                      }
                      catch (ee: Exception)
                      {
                        logger.info ("Exception caught while deleting the claim payloads and updating the trigger table for the Claim Number :"+cc.ClaimNumber)
                        if(null != ee.Message)
                        {
                          errMessage.append(ee.Message)
                          throw new Exception ((errMessage as java.lang.String))
                        }
                      }
                    }
                  }
                }
              }
            }
            catch(e:Exception)
            {
               //Deleting the processed payloads, if there are any issue while processing the payloads
               logger.info("Deleting all the Claims Payloads inserted for the claim: "+cc.ClaimNumber)
               conversionutil.deleteClaimPayloads(cc.ClaimNumber)    
               
               //If Payloads are failed to insert into EDWMessagetransaction table. update processed =-1 and errors to EDWConversiontrigger table
               var error=e.StackTraceAsString
               logger.info(error+ "== Error  console ==" +e.printStackTrace())
               if(error.contains("Exception")) 
               {
                 conversionutil.updateTrigger(cc.ClaimNumber, error, -1)
               }
               else 
               {
                 conversionutil.updateTrigger(cc.ClaimNumber, e.Message, -1)
               }
               logger.info("Error :"+e.Message + "====" + e.Cause)                     
               logger.info(cc.ClaimNumber +" updated processed =-1 " + cc.ClaimNumber)
             }
             finally
             {
               errMessage = null
               conversionutil=null
             }
           }
            counter --
            if(counter == endClaimCount){
              var _end_Time = gw.api.util.DateUtil.currentDate()
              var edwImpl = new EDWPayloadGenConversionImpl()
              totalClaimCount =0
              _startTime = null
              _end_Time = null
              edwImpl = null
              setIsAlreadySentClaimProcessed(true)
            }
            logger.info(" ******** "+  Thread.currentThread()+" is processed claim : "+ cc.ClaimNumber)
          }
          catch(e:Exception)
          {
            logger.info("Error in EDWPayload Gen Conversion : "+e.StackTrace ) 
          }
          finally {
           //Release all resources
           conversionutil = null
           payloadList = null
           if(linkedHahmap.Values.Count>0) {
             linkedHahmap.clear()
           }
        }
      }
      
     /**
     * Sets the Claim Count
     * 
     * @param count
     */
     public function setClaimCount(count:int)
     {
       counter = count
       totalClaimCount = count
     }

     /**
     * Sets the Batch process start time
     * 
     * @param startTime
     */      
     public function setBatchStartTime(startTime:Date)
     {
       _startTime = startTime
     }
     
     /**
     * Sets the Flag for Already Sent Claim Process
     * 
     * @param isAlreadySentClaimProcess
     */ 
     public function setIsAlreadySentClaimProcessed(isAlreadySentClaimProcess:boolean ):void
     {
       isAlreadySentClaimProcessed = isAlreadySentClaimProcess
     }
     
     /**
     * Gets the Flag for Already Sent Claim Process
     */ 
     public function getIsAlreadySentClaimProcessed():boolean
     {
       return isAlreadySentClaimProcessed 
     }
     
     /**
     * Shutdown the process by setting the running to false
     */   
     function shutdown()
     {
       this.running=false
     }
   }