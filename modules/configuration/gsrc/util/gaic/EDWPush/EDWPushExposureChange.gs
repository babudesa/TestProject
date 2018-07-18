package util.gaic.EDWPush
uses util.gaic.EDWPayloadGen.Conversionutil
uses gw.processes.BatchProcessBase
uses java.util.ArrayList
uses java.lang.Exception

uses gw.api.util.Logger
uses java.util.concurrent.Executors

uses gw.util.EDWConversionDTO

uses java.util.concurrent.Future
uses java.lang.InterruptedException
uses java.util.concurrent.ExecutionException
uses java.util.concurrent.Callable
uses java.text.SimpleDateFormat
uses java.util.Date
uses java.lang.Runtime
uses gw.api.database.Query
uses java.lang.Integer



/**
  * Author @HCL
  * Date:11-05-2015
  * EDWPushClaimADD implementation is a code implementation of the EDW Push conversion that allows the user to generate the payload
  * for the claims the claims and  it's sub objects. The generated apyloads are verified with SchemaClaimCenterToEDW.xsd.
  * When the payload is sucessful.
  * On sucessful generation of the payloads, each payload will be transaformmed to a Payload DTO and finally accumulated into 
  * a list. List of payload DTO objects' transferred to an integration layer, converted into  payloads xml and  finally submitted into
  * EDWMessageTransaction table with the help of DAO layer.
  * When the payload is not sucessful.
  * On failure of each payload constructed as an error xml object and stored into EDWMessageTrigger table. The failure records are 
  * When Processed=0
  * All the converted data will be loaded into EDWConversionTrigger add EDWMessageHolder tables. During the intial load, the 
  * EDWConversionwTrigger table is loaded with '0' by dault which means that the data is ready for EDW push conversion.
  * When processed=1.
  * When the payloads are sucessfully converted, it will be stored into EDWMessageTrasnaction table. The succesful converted claims
  * are stored into EDWConversionTrigger table with processed=1.
  * When processed=-1.
  * The failure of claim records will be stored into  EDWMessagetrigger table with the valie of -1 which mean the data is required 
  * either a code fix or data fix.
  * When Processed=2.
  * When all the payloads are successfully processed, the value of proceesed into 2 which means that the data is ready for downstream.

  */


class EDWPushExposureChange extends BatchProcessBase {

   construct() {
      super(BatchProcessType.TC_EDWPUSHEXPOSURECHANGE)
    }  
    override function requestTermination():boolean  {
           super.requestTermination() // set the TerminationRequested flag
           return true // return true to signal that we will attempt to terminate in our doWork method
    }
    public override function checkInitialConditions():boolean {
      return true
    }
    var logger = Logger.forCategory("EDWConversionLog") 
    var workerthread:int = EDWConversionDTO.Noofthreads 
    var claim_chunk_size:int = 500
    var from_claim_row:int =0
    var to_claim_row:int =0
    var alreadyProcessedClmCount:int = 0
    var total_no_of_claims:int = 0
    var isAlreadyClaimProcessed:boolean = false
    var clmSublist =  new  ArrayList<ClaimExcelDTO>()
    var conversionutil = new Conversionutil()
    var threadExecutor =new ExposureThreadExecutor()
    var readFromExcel = new  ReadClaimFromExcel()
    static var insertPayloadCount:int
    static var updatePayloadCount:int
    var claimreadCount=0
    override function doWork() {
          logger.info(" *********** EDWPUSH Feature close message conversion batch started ************ " )
          var  claimConversionStarts =  gw.api.util.DateUtil.currentDate()
          logger.info("Running with "+workerthread+" Thread Now.")
         threadExecutor.setBatchStartTime(claimConversionStarts)
          // A thread pool with a fixed number of threads assigned for payload generation
          if(workerthread == 0){
             workerthread =conversionutil.noofthreadcount
          }


          var convertedClaims =  readFromExcel.readDataFromExcel()
          if(convertedClaims.Count==0){
            throw new Exception("Read from excel return  0 records.")
          }
          logger.info(" No.of claims read from excel :" +convertedClaims.Count)
         
          try{
            //total_no_of_claims = conversionutil.getClaimCount()
            total_no_of_claims =convertedClaims.Count
            logger.info(" Total No. claims :  "+ total_no_of_claims + " ready for payload generation with chunk size : " +claim_chunk_size)
             if(total_no_of_claims > claim_chunk_size){ 
		to_claim_row = claim_chunk_size;
	      } else {
	        to_claim_row = total_no_of_claims;
	      }
             
            if(total_no_of_claims<claim_chunk_size){
                logger.info(" 11 Total No. claims :  "+ total_no_of_claims)
                logger.info(" 11 From  row :  "+ from_claim_row)
                logger.info(" 11  To  row  :  "+ to_claim_row)
                clmSublist  = new ArrayList<ClaimExcelDTO>()
                clmSublist.addAll(convertedClaims.subList(from_claim_row, to_claim_row))
                for(xx in clmSublist){
                  print(xx)
                }
                logger.info(" Starts reading claims  from : " + from_claim_row + " To :" + to_claim_row  + " Total climas :" + clmSublist.Count)
                processChunkOfClaim(clmSublist)
                calculateTotalTime(claimConversionStarts)
                logger.info(" Ends reading claims from : " + from_claim_row + " To :" + to_claim_row  + " Total climas :" + clmSublist.Count)   

            } else {
              
              while (total_no_of_claims>=claim_chunk_size) {
                logger.info(" 22 Total No. claims :  "+ total_no_of_claims)
                logger.info(" 22 From  row :  "+ from_claim_row)
                logger.info(" 22 To  row  :  "+ to_claim_row)
                logger.info(" 22 No.of claims processed till now :  "+ alreadyProcessedClmCount)
                 clmSublist = new  ArrayList<ClaimExcelDTO>()
                 clmSublist.addAll(convertedClaims.subList(from_claim_row, to_claim_row))
                 logger.info(" Starts reading claims  from : " + from_claim_row + " To :" + to_claim_row  + " Total climas :" + clmSublist.Count)
                  processChunkOfClaim(clmSublist)
                  logger.info(" Ends reading claims  from : " + from_claim_row + " To :" + to_claim_row  + " Total climas :" + clmSublist.Count)
                  
                   alreadyProcessedClmCount = alreadyProcessedClmCount + claim_chunk_size;
                   total_no_of_claims = total_no_of_claims - claim_chunk_size;
                   to_claim_row = to_claim_row + claim_chunk_size;
                   from_claim_row = alreadyProcessedClmCount;
                  if(total_no_of_claims < claim_chunk_size){
                      logger.info(" 33 Remaining Total No. claims :  "+ total_no_of_claims)
                      logger.info(" 33 Remaining From  row :  "+ from_claim_row)
                      logger.info(" 33 Remaining To  row  :  "+ to_claim_row)
                      logger.info(" 33 No.of claims processed till now :  "+ alreadyProcessedClmCount)
                      //TODO
                      //var remainingclms=conversionutil.retrieveClaims(from_claim_row, to_claim_row)
                     //if(remainingclms.Count > 0){
                       var remClmSublist : ArrayList<ClaimExcelDTO>
                       remClmSublist = new ArrayList<ClaimExcelDTO>()
                       remClmSublist.addAll(convertedClaims.subList(from_claim_row, from_claim_row+total_no_of_claims))
                       logger.info(" Starts reading claims  from : " + from_claim_row + " To :" + to_claim_row  + " Total climas :" + clmSublist.Count)
                       processChunkOfClaim(remClmSublist)
                       logger.info(" Ends reading claims  from : " + from_claim_row + " To :" + to_claim_row  + " Total climas :" + clmSublist.Count)
                       calculateTotalTime(claimConversionStarts)   
                   //} 
                }
     
              }
           //logger.info(" *********** sublist completed ************ "  +   sublist.Count)
            
           
          }
          }
          catch(ex:Exception)
          {
            ex.printStackTrace()
            logger.info("Error in Claim Processing,"+ex.Message)
          }finally {
            conversionutil = null
            threadExecutor=null
            clmSublist=null
            convertedClaims=null
                logger.info( " *************** EDW  push payload generation is completed ******************" )
          }
           
         logger.info( " ********* No. of feature close payloads inserted : " +   PayloadMessageDTO.payloadInsertedCount)            

    }
   
    function processChunkOfClaim(subList: java.util.ArrayList<ClaimExcelDTO>)  {
      if(TerminateRequested)
          {logger.info("JOB has been Terminated.")
            return
          }
      var avilableProcessor = Runtime.getRuntime().availableProcessors()
      logger.info(" No. of avilableProcessor "+ avilableProcessor )
      var executor = Executors.newFixedThreadPool(workerthread)
      var  elementsToCompute =new ArrayList<Future<String>>()
      var callList = new ArrayList<Callable<ExposureThreadExecutor>>()
      var future :List<Future<ExposureThreadExecutor>> =new ArrayList<Future<ExposureThreadExecutor> >()
      threadExecutor.setClaimCount(subList.Count)
      var  callable :ExposureCallable
      var claimThread : ExposureThreadExecutor
   
     try{
             if(subList.Count > 0){
                 var convertedClaims = subList.iterator().toList()
                //    var SchemaURL=conversionutil.getSchemaURL()
                    var SchemaURL="/workspace/Claims_To_EDW/Resources/Validation/SchemaClaimCenterToEDW.xsd"
                    logger.info("Hardcoded value of schema url " + SchemaURL)
                    
                      if(SchemaURL==null){
                         SchemaURL="/workspace/Claims_To_EDW/Resources/Validation/SchemaClaimCenterToEDW.xsd"
                         logger.info("schema was null, Hardcoded value of schema url " + SchemaURL)
                       }

                 logger.info("schema url is  " + SchemaURL)
                 for(excelData in convertedClaims index i) {
                 var  clm = Query.make(Claim)
                      .compare("ClaimNumber", Equals, excelData.ClaimNumber)
                      .compare("Publicid", Equals, excelData.ClaimPublicID)
                      .select()
                      .orderBy(\ c ->c.ClaimNumber ).AtMostOneRow
                       if(clm==null) {
                          logger.info("Claimnumber :" + excelData.ClaimNumber + "  is not available  in cc_claim table") 
                       }else {
                         logger.info("Claimnumber :" + clm.ClaimNumber + "  is available  in cc_claim table") 
                       }
                      if(clm!=null){
                      
                         var  exps = Query.make(Exposure)
                             .compare("Claim", Equals, clm.ID)
                             .compare("ClaimOrder", Equals, Integer.parseInt(excelData.ClaimOrder))
                             .compare("Publicid", Equals, excelData.FeaturePublicID)
                             .select()
                         if(exps.Count>0) {
                           for(exp in exps){
                               //logger.info(i +"  " + clm.ClaimNumber +"   " + exp.ClaimOrder +"   "+clm.PublicID + "   "+exp.PublicID)    
                               claimThread= new ExposureThreadExecutor(exp , SchemaURL,insertPayloadCount,updatePayloadCount)
                               callable = new ExposureCallable(claimThread)
                               callList.add(callable)
                           }
                         }
                       }
                       
                       
                   }
                   if(callList.Count>0) {
                     future = executor.invokeAll(callList)
                   }
                     
                }
               
                 executor.shutdown();
                 try {
                   var  count:int=0
                        while (!executor.isTerminated()) {
                          future.get(count).get()
                        }
                  } catch (ex:ExecutionException   ) {
                    logger.info( "**** ExecutionException****  "+ex.Message)
                 
                    } catch (ex: InterruptedException ) {
                      logger.info( "**** InterruptedException****  "+ex.Message)
                    
                  }
           
            }
           catch(e:Exception){
             e.printStackTrace()
             logger.info("Error in EDWPush Conversion : "+e.StackTrace+"--------- "+e.Message ) 
           }finally {
              //Release all created resources
              logger.info("Finally in EDWPush Conversion  " ) 
               callable =null
               elementsToCompute=null
               claimThread=null
                executor.shutdown();
               logger.info( " executor.isTerminated() : "+ executor.isTerminated() ) 
               
          }
         
          
    }
    
    
//   function  shutdownAndAwaitTermination( pool:ExecutorService) {
//    pool.shutdown(); // Disable new tasks from being submitted
//     try {
//   
//       // Wait a while for existing tasks to terminate
//       if (!pool.awaitTermination(getExecutionTimeInterval(startTime,endTime), TimeUnit.SECONDS)) {
//         pool.shutdownNow(); // Cancel currently executing tasks
//         // Wait a while for tasks to respond to being cancelled
//         if (!pool.awaitTermination(getExecutionTimeInterval(startTime,endTime), TimeUnit.SECONDS))
//              logger.info("Pool did not terminate")
//       }
//     } catch ( ie:InterruptedException) {
//       // (Re-)Cancel if current thread also interrupted
//       pool.shutdownNow();
//       // Preserve interrupt status
//       Thread.currentThread().interrupt();
//     }
// }

   public function setIsAlreadySentClaimProcessed(ThreadFlag:boolean ):void {
     isAlreadyClaimProcessed = ThreadFlag
     logger.info("Set:"+isAlreadyClaimProcessed)
   }
   public function getIsAlreadySentClaimProcessed():boolean {
     logger.info("Get:"+isAlreadyClaimProcessed)
     return isAlreadyClaimProcessed 
   }
   public function calculateTotalTime(claimConversionStart:Date):void
   {
     var  claimConversionEnds =  gw.api.util.DateUtil.currentDate()
                   
                   var edwImpl = new EDWPushConversionImpl()
                   var sf=new SimpleDateFormat("MM/dd/yyyy HH:mm:ss.SSS")
                   var stDat = sf.format(claimConversionStart)
                   var endDat = sf.format(claimConversionEnds)
                   logger.info("#####################################################################")
                   logger.info("Claim Batch Started At:"+stDat+" - Ended At:"+endDat)
                   logger.info("Claim, Execution Time :"+edwImpl.getExecutionTimeInterval(claimConversionStart, claimConversionEnds))
                   logger.info("#####################################################################")
                   edwImpl = null  
                   stDat = null
                   endDat = null 
   }
//   function getExecutionTimeInterval(start_time:Date , end_time:Date):long {
//                       var sf=new SimpleDateFormat("MM/dd/yyyy HH:mm:ss.SSS")
//                       var stDat = sf.format(start_time)
//                       var endDat =sf.format(end_time)
//                       var parseStartDate=sf.parse(stDat)
//                       var parseEndDate=sf.parse(endDat)
//                       //logger.info("Batch Started At:"+stDat+" - Ended At:"+endDat)
//                       var diff : long = parseEndDate.Time - parseStartDate.Time
//                       var tUnit = TimeUnit.SECONDS
//                       var seconds = tUnit.convert(diff,TimeUnit.MILLISECONDS)
//                       var days = seconds/(24*60*60)
//                       var rest= seconds-(days*24*60*60)
//                       var hrs = rest/(60*60)
//                       var rest1= rest - (hrs*60*60)
//                       var min=rest1/60
//                       var sec= seconds%60
//                       var miliseconds = (diff - (seconds * 1000)) 
//                       return sec 
//     }
}

