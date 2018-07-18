package util.gaic.EDWPush
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

//uses java.text.SimpleDateFormat
class ExposureThreadExecutor implements Runnable
   {
      private var expos:Exposure = null
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
       var  _insertedPayloads : int as insertedPayloads
       var _updatedPayloads :int as updatedPayloads
     

      construct()
      {
        
      }
      construct(expData:Exposure, SmaURL:String,ins:int,upt:int)
      {
        this.expos = expData
        this.SchemaURL = SmaURL
        this.insertedPayloads=ins
        this.updatedPayloads=upt
        
      }
      override function run() {
        logger.info("Payload process starts with "+expos.Claim.ClaimNumber+"  " +expos.Claim.PublicID + "  " + expos.PublicID +"   "+ expos.ClaimOrder +"  "+Thread.currentThread().Name)
      try{
               //setIsAlreadySentClaimProcessed(false)
                setIsAlreadySentClaimProcessed(false)
                conversionutil = new Conversionutil()
                if(expos.LoadCommandID !=null){
                var errMessage:StringBuffer = new StringBuffer()
                payloadList = new ArrayList<EDWMessagePayloadDTO>() 
                var edwImpl = new EDWPayloadGenConversionImpl()
                try{ 
                      //Generate the payload for Claim
                
                      try {
                        payloadList = edwImpl.createtExposureChangedPayload(expos, payloadList)
                        logger.info ("payloadlist count  :: "+ payloadList.Count)
                        
                      }
                      catch(ee:Exception) {
                        ee.printStackTrace()
                        logger.info(" Error in Exposure Changed payloads " + ee.Message)
                           if(null != ee.Message)
                          errMessage.append(ee.Message)
                      } 
                      
                      
                        if(payloadList.Count>0) {
                          linkedHahmap.put("ClaimPayloads", payloadList)
                        }
                       
                        //Validate all payload xml data with SchemaClaimCenterToEDW.xsd and assign validatePayload=true when the payload is sucessfully validated
                      if(SchemaURL==null or SchemaURL.equals("")){
                        SchemaURL="/workspace/Claims_To_EDW/Resources/Validation/SchemaClaimCenterToEDW.xsd"
                      }
                       
                       var validatePayload=false;  
                       var validator:JAXPValidator = null
                      if(linkedHahmap!=null and linkedHahmap.size()>0){
                        for(xx in linkedHahmap.entrySet().iterator().toList()) {
                            for(payload in xx.Value)  {
                            try {
                               validator = new JAXPValidator();
                               logger.info(" ********************************** Starts Payload  details  **********************************************") 
                               logger.info(" Payload Schema URL: " + SchemaURL) 
                               logger.info(" Payload publicid : " + payload.publicIdVal)
                               logger.info(" Payload eventname : "+payload.eventName )
                               logger.info(" ********************************** Ends Payload  details  **********************************************") 
                               validatePayload = validator.validateEdwPayloadGen(SchemaURL, payload.payload, payload.publicIdVal, payload.eventName)
                               if(validator.ValidationMessage!=null) {
                                 logger.info(" validation messages : " + validator.ValidationMessage)
                               }
                               logger.info(" valid payloads true/false ? :" +  validatePayload + " payload.claimnumber ")
                               if(validatePayload == false) {
                                   validator = null
                                   break
                                }
                               
                                 validator = null
                                 

                             } catch(ee:Exception) {
                                ee.printStackTrace()
                               logger.info(" Error in payload schema validation  " + ee.Message + "  "+ ee)
                                  if(null != ee.Message)
                                       errMessage.append(ee.Message)
                                 break

                              }
                            }
                       
                         }
                    } else {
                      logger.info("*************** Payload list is  empty *******************")
                    }
                        //var validate_end_time =  gw.api.util.DateUtil.currentDate() 
                        //logger.info(cc.ClaimNumber+" No. of payloads  "+ payloadList.Count + " validated by schema "+edwImpl.getExecutionTimeInterval(validate_st_time, validate_end_time))

                        if(!StringUtils.isEmpty(errMessage as java.lang.String) || validatePayload == false){
                               throw new Exception((errMessage.toString()))
                        }
                          
                          if(validatePayload == true){
                             for(xx in linkedHahmap.entrySet().iterator().toList()) {
                                this.insertedPayloads= this.insertedPayloads+1
                                  for(payload in xx.Value)  { 
                                      conversionutil.insertPayload(payload.payload, payload.eventName,payload.publicIdVal)
                                  }
                              }
                               PayloadMessageDTO.payloadInsertedCount = PayloadMessageDTO.payloadInsertedCount +  this.insertedPayloads

                           }
                       }catch(e:Exception){
                         e.printStackTrace()
                         logger.info("Error :"+e.Message + "    "+ e);                     
                         
                      
                       }
                       finally
                       {
                         errMessage = null
                         
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
                  
                   
                   
               }catch(e:Exception){
                     e.printStackTrace()
                    logger.info("Error in EDWPush Conversion : "+e ) 
                }finally {
                      //Release all resources
               conversionutil = null
               payloadList = null
                insertedPayloads=0
                updatedPayloads=0
               if(linkedHahmap.Values.Count>0) {
                 linkedHahmap.clear()
               }
        }
        
       logger.info("Payload process ends with "+expos.Claim.ClaimNumber+"  " +expos.Claim.PublicID + "  " + expos.PublicID +"   "+ expos.ClaimOrder +"  "+Thread.currentThread().Name)
        
      } 
      public function setClaimCount(count:int)
      {
        counter = count
        totalClaimCount = count
      }
     public function setBatchStartTime(startTime:Date)
     {
       _startTime = startTime
     }
     
   public function setIsAlreadySentClaimProcessed(isAlreadySentClaimProcess:boolean ):void
   {
     isAlreadySentClaimProcessed = isAlreadySentClaimProcess
     //print("Set:"+isAlreadySentClaimProcessed)
   }
   public function getIsAlreadySentClaimProcessed():boolean
   {
     //print("Get:"+isAlreadySentClaimProcessed)
     return isAlreadySentClaimProcessed 
   }
}