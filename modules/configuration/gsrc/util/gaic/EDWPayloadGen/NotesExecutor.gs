package util.gaic.EDWPayloadGen
uses entity.Claim
uses util.gaic.EDWPayloadGen.EDWPayloadGenConversionImpl
uses util.gaic.EDWPayloadGen.EDWMessagePayloadDTO
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

/** This Class is responsible for getting all the Notes related payloads,
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
 *  Also Deletes the processed payloads, if there are any missing/duplicate payloads 
 *  while inserting the payloads
 * 
 *  Updates the trigger table for the claim with no Notes Payload also to 3
 */
class NotesExecutor implements Runnable
{
  private var cc:Claim = null
  private var SchemaURL:String = null
  private var conversionutil:Conversionutil = null
  private var payloadList:ArrayList<EDWMessagePayloadDTO> = null
  private var linkedHahmap:LinkedHashMap<String,ArrayList<EDWMessagePayloadDTO>>  = new LinkedHashMap<String,ArrayList<EDWMessagePayloadDTO>> ()
  var logger = Logger.forCategory("EDWConversionLog") 
  private static var counter:int = 0
  private var endClaimCount:int =0
  private static var totalClaimCount:int = 0
  private static var _startTime:Date = null
  public static  var isAlreadySentClaimProcessed:boolean = true 
  var edwImpl : EDWPayloadGenConversionImpl

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
  override function run() {
  try
  {
    setIsAlreadySentClaimProcessed(false)
    logger.info("Claim:"+cc+"  Thread:"+Thread.currentThread().Name+"   State:"+Thread.currentThread().Alive)
    conversionutil = new Conversionutil()
    if(cc.LoadCommandID !=null)
    {
      var errMessage:StringBuffer = new StringBuffer()
      payloadList = new ArrayList<EDWMessagePayloadDTO>() 
      edwImpl = new EDWPayloadGenConversionImpl()
      try
      { 
        //Generate the payload for Transaction - Recovery , Reserve and RecoveryReserve  
        try 
        {
          payloadList = edwImpl.getNotesPayload(cc , payloadList)
        }
        catch(ee:Exception) 
        {
          if (null != ee.Message)
             errMessage.append(ee.Message)
        }
        //In case of any expcetion while generating the Notes Payloads, Trigger table is getting updated to -2 with error message. 
        if(!StringUtils.isEmpty(errMessage as java.lang.String))
        {
           try
           {
             logger.info("Exception while retrieving the notes payload from CC and updating trigger table with -2")
             conversionutil.updateTrigger(cc.ClaimNumber, errMessage as java.lang.String, -2)
           }
           catch (ee: Exception)
           {
             logger.info ("Exception caught while updating the trigger table to -2 for the Claim Number :"+cc.ClaimNumber)
             if(null != ee.Message)
             {
               errMessage.append(ee.Message)
               throw new Exception ((errMessage as java.lang.String))
             }
           }
        }
        if (StringUtils.isEmpty(errMessage as java.lang.String))
        {  
          //Updating the trigger table for the claim with no Notes Payload to 3
           if (payloadList.Count == 0)
           {
             try
             {
               logger.info("Updating the trigger table to 3 for Claim number "+ cc.ClaimNumber +" with no Notes Payload")
               conversionutil.updateTrigger(cc.ClaimNumber, null, 3)
             }
             catch (ee: Exception)
             {
               logger.info ("Exception caught while updating the trigger table to 3 for the Claim Number :"+cc.ClaimNumber)
               if(null != ee.Message)
               {
                 errMessage.append(ee.Message)
                 throw new Exception ((errMessage as java.lang.String))
               }
             }
           }
           //Processing the Notes Payload for the claims with Notes
           else if (payloadList.Count > 0) 
           {
             linkedHahmap.put("ClaimPayloads", payloadList)
             var validatePayload = false  
             var validator:JAXPValidator = null
             var insertedPayLoad = new ArrayList<EDWMessagePayloadDTO>() 
             if(linkedHahmap.entrySet().iterator().toList().Count>0)
             {
               for(xx in linkedHahmap.entrySet().iterator().toList()) 
               {
                 for(payload in xx.Value)  
                 {
                   //Validate all payload xml data with SchemaClaimCenterToEDW.xsd and assign validatePayload=true when the payload is sucessfully validated
                   try
                   {
                     validator = new JAXPValidator()
                     validatePayload = validator.validateEdwPayloadGen(SchemaURL, payload.payload, payload.publicIdVal, payload.eventName)
                     if(validatePayload == false) 
                     {
                       logger.info("Validation fails in JAXP Validator and updating trigger table with -2")
                       break
                     }
                   }
                   catch(ee:Exception) 
                   {
                    if(null != ee.Message)
                       errMessage.append(ee.Message)
                    break
                   }
                 }
                }
                //In case of any error in Payload creation or validating the Payload with JAXP Validator
                if (validatePayload == false && !StringUtils.isEmpty(errMessage as java.lang.String))
                {
                  try
                  {
                    logger.info("Validation fails in JAXP Validator and updating trigger table with -2")
                    conversionutil.updateTrigger(cc.ClaimNumber, errMessage as java.lang.String, -2)
                  }
                  catch (ee: Exception)
                  {
                    logger.info ("Exception caught while updating the trigger table to -2 for the Claim Number :"+cc.ClaimNumber)
                      if(null != ee.Message)
                      {
                        errMessage.append(ee.Message)
                        throw new Exception ((errMessage as java.lang.String))
                      }
                  }
                }
                if (validatePayload == true && StringUtils.isEmpty(errMessage as java.lang.String))
                {
            	  try
                  {
              	    //Updating the Trigger table to 1, as the claim notes payload is ready for processing
                    conversionutil.updateTrigger(cc.ClaimNumber, null, 1)
                    logger.info("Updating the Trigger table to 1, start the Notes Payload process")
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
                  for(xx in linkedHahmap.entrySet().iterator().toList()) 
                  {
                    for(validatedPayload in xx.Value)  
                    {
                       try
                       {
                         //Inserting the payloads in Transaction table
                         conversionutil.insertPayload(cc.ClaimNumber,validatedPayload.payload, validatedPayload.eventName,validatedPayload.publicIdVal, true)
                         insertedPayLoad.add(validatedPayload)
                         //Once after successful insertion, it sets the insertSuccessFlag to true
                         insertSuccessFlag = true
                       }
                       catch(e:Exception)
                       {
                         //If Payloads are failed to insert into EDWMessagetransaction table. update processed =-1 and errors to EDWConversiontrigger table
                         var error=e.StackTraceAsString
                         errMessage.append(error)
                         //Deleting the processed payloads and updating the trigger table, if there are any exceptions while inserting the payloads
                         try
                         {
                           logger.info("Deleting all the Notes Payloads inserted for the claim: "+cc.ClaimNumber)
                           conversionutil.deleteNotesPayload(cc.ClaimNumber)
                           logger.info("Insert of all the Notes Payload fails for Claim, updating Trigger table with -2")
                           conversionutil.updateTrigger(cc.ClaimNumber, error, -2)                    	        
                         }
                         catch (ee: Exception)
                         {
                    	   logger.info ("Exception caught while deleting the notes payloads and updating the trigger table for the Claim Number :"+cc.ClaimNumber)
                    	   if(null != ee.StackTraceAsString)
                    	   {
                    	     errMessage.append(ee.StackTraceAsString)
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
                    logger.info ("CC Notes Payload Count "+payloadList.Count +" and Notes Payload in EDW table count "+insertedPayLoad.Count +" for the claim #"+cc.ClaimNumber)
                    //Comparing the count of Payload fetched from CC with Payload inserted in EDW Message table.                        	
                    if (insertedPayLoad.Count == payloadList.Count && StringUtils.isEmpty(errMessage as java.lang.String))
              	    {
                      logger.info("EDW Insert of all Notes Payloads success for Claim "+cc.ClaimNumber +" updating Trigger table with 3")
                      //Payloads are sucessfully inserted into  EDWMessageTransaction table. update processed = 3 to EDWConversionTrigger table		
        	      conversionutil.updateTrigger(cc.ClaimNumber, null, 3)
              	    }
            	    else
                    {
                      var error = "Error while inserting Notes Payload for Claim" + cc.ClaimNumber
                      //Identifying the missing Payload for the Claim
                      if (insertedPayLoad.Count < payloadList.Count)
              	      {
                        var missingPayloads = conversionutil.comparePayload(payloadList, insertedPayLoad)
                        if (missingPayloads != null)
                        {
                          error += "Missing Notes Payload Counts: "+missingPayloads.Count
                          for (missingPayload in missingPayloads)
                          {
                            error += "Missing Notes Payload details: " +
                                     "Event Name: " + missingPayload.eventName +
                                     "publicID: " + missingPayload.publicIdVal +
                                     "Transaction Name: " + conversionutil.getTransactionName(missingPayload.payload)
                          }
                          logger.info("Missing Notes Payload Identified"+error)
                        }
              	      }
                      //Identifying the Duplicate Payload for the Claim
                      else if (insertedPayLoad.Count > payloadList.Count)
                      {
                        var duplicatePayloads = conversionutil.comparePayload(insertedPayLoad, payloadList)
                        if (duplicatePayloads != null)
                        {
                          error += "Duplicate Notes Payload Counts: "+duplicatePayloads.Count
                          for (duplicatePayload in duplicatePayloads)
                          {
                            error += "Duplicate Notes Payload details: " +
                                     "Event Name: " + duplicatePayload.eventName +
                                     "publicID: " + duplicatePayload.publicIdVal +
                                     "Transaction Name: " + conversionutil.getTransactionName(duplicatePayload.payload)
                          }
                          logger.info("Duplicate Notes Payload Identied"+error)
                        }
                      }
                      //Deleting the processed payloads and updating the trigger table, if there are any exceptions while inserting the payloads
                        try
                        {
                          logger.info("Deleting all the Notes Payloads inserted for the claim: "+cc.ClaimNumber)
                          conversionutil.deleteNotesPayload(cc.ClaimNumber)
                          logger.info("Insert of all the Notes Payload fails for Claim, updating Trigger table with -2")
                          conversionutil.updateTrigger(cc.ClaimNumber, error, -2)                    	        
                        }
                        catch (ee: Exception)
                        {
                          logger.info ("Exception caught while deleting the notes payloads for the Claim Number :"+cc.ClaimNumber)
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
          }
        }
        catch(ee:Exception)
        {
          //Deleting the processed payloads and updating the trigger table, if there are any exceptions in Payload process
          logger.info("Deleting all the Notes Payloads when the exception caught in Payload process for the claim: "+cc.ClaimNumber)
          conversionutil.deleteNotesPayload(cc.ClaimNumber)
          logger.info("Exception caught in Notes Payload Process, updating the trigger table to -1 for the claim number "+cc.ClaimNumber)
          var error=ee.StackTraceAsString
          if(error.contains("Exception")) {
            conversionutil.updateTrigger(cc.ClaimNumber, error, -2)
          }
          else {
            conversionutil.updateTrigger(cc.ClaimNumber, ee.Message, -2)
          }    
       }
       finally
       {
         errMessage = null
         conversionutil=null
       }
     }
     counter --
     if(counter == endClaimCount)
     {
       var _end_Time = gw.api.util.DateUtil.currentDate()
       totalClaimCount =0
       _startTime = null
       _end_Time = null
       edwImpl = null
       setIsAlreadySentClaimProcessed(true)
     }
     logger.info(" ******** "+  Thread.currentThread()+" is processed claim : "+ cc.ClaimNumber)
   }
   catch(ee:Exception)
   {
     logger.info(""+ee.printStackTrace())
     logger.info("Error in EDWPayloadGen Notes  Conversion : "+ee.StackTrace )
   }
   finally 
   {
     //Release all resources
     conversionutil = null
     payloadList = null
     if(linkedHahmap.Values.Count>0) 
     {
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
 * Sets the Batch Start Time
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
 }