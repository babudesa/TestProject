package util.gaic.EDWPayloadGen
uses java.lang.String
uses util.gaic.EDWPayloadGen.EDWPayloadGenConversionImpl
uses entity.Claim
uses gw.lang.ScriptParameters
uses typekey.BatchProcessType
uses util.gaic.EDWPayloadGen.Conversionutil
uses util.gaic.EDWPayloadGen.ClaimThreadExecutor
uses util.gaic.EDWPayloadGen.ClaimCallable
uses gw.processes.BatchProcessBase
uses java.util.ArrayList
uses java.lang.Exception
uses gw.api.util.Logger
uses java.util.concurrent.Executors
uses gw.util.EDWConversionDTO
uses java.text.SimpleDateFormat
uses java.util.Date
uses java.lang.Runtime
uses java.util.concurrent.Future
uses gw.api.database.Query

/**
  * Author @HCL
  * Date:11-05-2015
  * EDWPayloadGenConversion implementation allows the user to generate the payload
  * for the claims and  it's associated objects. The generated apyloads are verified with SchemaClaimCenterToEDW.xsd.
  * once the payloads are validated with schema, it will be inserted to the EDWMessagetransaction table
  * if the payload is not sucessful, the errors will be logged into  EDWConversionTrigger table and update the processed=-1
  * 
  * All the converted data will be loaded into EDWConversionTrigger add EDWMessageHolder tables. During the intial load, the 
  * EDWConversionwTrigger table is loaded with '0' by dault which means that the data is ready for EDW push conversion.
  * 
  * usage of processed column in EDWConversiontrigger table
  * 
  * When processed=0
  * Claims are ready to generate paylods. When the payloads are sucessfully converted, it will be stored into EDWMessageTrasnaction table. 
    
  * When processed=-1.
  * The failure of claim records will be stored into  EDWConversionTrigger table with the valie of -1 which mean the data is required 
  * either a code fix or data fix.
  
  * When Processed=2.
  * When all the payloads are successfully processed, the value of proceesed into 2 which means that the data is ready for downstream.
*/

class EDWPayloadGenClaimConversion extends BatchProcessBase {
   
    construct(batchProcessType:BatchProcessBase) {    
      this(batchProcessType)
    }
    construct() {
      super(BatchProcessType.TC_EDWCLAIMSPAYLOADGENERATION)
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
    var clmSublist =  new  ArrayList<String>()
    var conversionutil = new Conversionutil()
    var threadExecutor =new ClaimThreadExecutor()
    
    /**
     * Initial function to get called for EDWConversion Bath Process 
     */
    override function doWork() 
    {
      logger.info(" *********** EDWPAYLOADGEN CONVERSION BATCH JOB STARTED ************ " )
      var  claimConversionStarts =  gw.api.util.DateUtil.currentDate()
      var loadCmdID=ScriptParameters.CurrentConversionLoadCommandID 
      var claimsList = new  ArrayList<String>()
      var convertedClaims = conversionutil.retrieveClaims(loadCmdID as java.lang.String)
      //Variable to track the execution count, in case of Chunk execution
      var chunkIndexCount = 0
      
      threadExecutor.setBatchStartTime(claimConversionStarts)
      // A thread pool with a fixed number of threads assigned for payload generation
      if(workerthread == 0)
      {
         workerthread =conversionutil.noofthreadcount
      }
      
      logger.info("Running with "+workerthread+" Thread Now.")
      logger.info(" No. of converted claims :" +convertedClaims.Count + " for the load command ID "+loadCmdID)
      
      //Process continues only for load commandID having converted claim with relevant process flag
      if (convertedClaims.Count > 0)
      {
        for(convertedClaim  in convertedClaims) 
        {
          claimsList.add(convertedClaim)
        }
        try
        {
          total_no_of_claims = convertedClaims.Count
          logger.info(" Total No. claims :  "+ total_no_of_claims +
                            " ready for payload generation with chunk size : " +claim_chunk_size)
        
          if(total_no_of_claims > claim_chunk_size)
          { 
	    to_claim_row = claim_chunk_size
	  } 
	  else 
	  {
	    to_claim_row = total_no_of_claims
	  }
          if(total_no_of_claims<claim_chunk_size)
          {
            clmSublist  = new ArrayList<String>()
            clmSublist.addAll(claimsList.subList(from_claim_row, to_claim_row))
            //Eg - When the converted claim < 500, there will be single and final run
            logger.info("Total no. of converted claims in Payload Process : "+ claimsList.Count)
            logger.info("No. of claims considered for the execution : "+clmSublist.Count +" for the single and final run ")
            logger.info("Claims are : "+clmSublist)
            processChunkOfClaim(loadCmdID,clmSublist)
            calculateTotalTime(claimConversionStarts)
          } 
          else
          {
            while (total_no_of_claims >= claim_chunk_size && 
                   isJobRunning()) 
            {
              clmSublist = new  ArrayList<String>()
              clmSublist.addAll(claimsList.subList(from_claim_row, to_claim_row))
              chunkIndexCount++
              //Eg - For 5000 converted claim, there will be 10 runs, as the chunk size is 500
              logger.info("Total no. of converted claims in Payload Process : "+ claimsList.Count)
              logger.info("No.of claims processed till now :  "+ alreadyProcessedClmCount)
              logger.info("No. of claims considered for the execution : "+clmSublist.Count +" in the "+chunkIndexCount+" run ")
              logger.info("Count from : "+ from_claim_row)
              logger.info("Count till  : "+ to_claim_row)
              logger.info("Claims are : "+clmSublist)
              processChunkOfClaim(loadCmdID,clmSublist)
              alreadyProcessedClmCount = alreadyProcessedClmCount + claim_chunk_size
              total_no_of_claims = total_no_of_claims - claim_chunk_size
              to_claim_row = to_claim_row + claim_chunk_size
              from_claim_row = alreadyProcessedClmCount
              //Processing Payload when total claims count > 500 and remaining claim count < 500
              if(total_no_of_claims < claim_chunk_size &&
                 total_no_of_claims > 0 && 
                 isJobRunning())
              {
                var remClmSublist = new ArrayList<String>()
                chunkIndexCount++
                remClmSublist.addAll(claimsList.subList(from_claim_row, from_claim_row+total_no_of_claims))
                //Eg - For 5250 converted claim, it will be executed for last 250 claim in last final run
                logger.info("Total no. of converted claims in Payload Process : "+ claimsList.Count)
                logger.info("No.of claims processed till now :  "+ alreadyProcessedClmCount)
                logger.info("No. of claims considered for the last execution : "+remClmSublist.Count +" in the last "+chunkIndexCount+" run ")
                logger.info("Count from : "+ from_claim_row)
                logger.info("Count till  : "+ to_claim_row)
                logger.info("Claims are : "+remClmSublist)
                processChunkOfClaim(loadCmdID,remClmSublist)
                calculateTotalTime(claimConversionStarts)   
              }
           }
         }
       }
       catch(ex:Exception)
       {
         logger.error("Error in Claim Processing,"+ex)
       }
       finally 
       {
         conversionutil = null
         threadExecutor=null
         clmSublist=null
         claimsList=null
         logger.info( " *************** EDW payload generation is completed ******************" )
       }
     }
   }
   
   /**
    * Process of List of Claims for inserting payload into transaction table and update Trigger table accordingly
    * @param loadid
    *           Load Command ID for the process
    * @param subList
    *           Arraylist of claims that has to be processed
    */
   function processChunkOfClaim(loadid:int,subList: java.util.ArrayList<String>)  
   {
      if(subList.Count > 0 &&
         isJobRunning())
      {
        var availableProcessor = Runtime.getRuntime().availableProcessors()
        var nThreads = Runtime.getRuntime().availableProcessors() 
        var executor = Executors.newFixedThreadPool(nThreads) // no. of threads will be created in a ThraedPool
        var claimCallables = new ArrayList<ClaimCallable>()
        var claimFutures = new ArrayList<Future<ClaimThreadExecutor>>()
        threadExecutor.setClaimCount(subList.Count)
        logger.info(" No. of availableProcessor "+ availableProcessor )
        logger.info(" No. of WorkerThreads "+ workerthread )
        logger.info(" No. of claims reads from EDWConversionTrigger table  "+ subList.Count )
        try
        {
          var convertedClaims = subList.iterator().toList()
          var SchemaURL="/workspace/Claims_To_EDW/Resources/Validation/SchemaClaimCenterToEDW.xsd"
          var count=convertedClaims.Count
          
          //Create Callable List with Converted Claims list
          for (var convertedClaim in convertedClaims)
          {
            var clm = Query.make(Claim)
                           .compare("loadcommandid", Equals, loadid)
                           .compare("ClaimNumber", Equals, convertedClaim).select()
                           .orderBy(\ c ->c.ClaimNumber ).AtMostOneRow
            var claimCallable = new ClaimCallable(clm,SchemaURL)
            claimCallables.add(claimCallable)
            logger.info(" Claim : " + clm.ClaimNumber + " Claims Payload generated "+ " count= "+count )
            count--
          }
          
          //Call the Callables with Future
          for (var claimCallable in claimCallables)
          {
            if (isJobRunning())
            {
              var claimFuture = executor.submit(claimCallable)
              if (claimFuture.get() != null)
              {
                claimFutures.add(claimFuture)
              }
            }
            else
            {
              logger.info ("Job is terminated intermediately after updating the final thread ")
              executor.shutdown()
              break
            }
          }
        }
        catch(e:Exception)
        {
          logger.error("Error in EDWPayloadGen Conversion : "+e.StackTrace+"--------- "+e.Message )
        }
        finally 
        {
          //Release all created resources
          logger.info("Finally in EDWPayloadGen Conversion  " ) 
          executor.shutdown()
          claimCallables = null
          claimFutures = null
          executor = null
        }
      }
    } 
   
   /**
    * Sets the Already Claim Processed flag
    * @param ThreadFlag
    *         Flag for isAlreadyClaimProcessed
    */
   public function setIsAlreadySentClaimProcessed(ThreadFlag:boolean ):void 
   {
     isAlreadyClaimProcessed = ThreadFlag
   }
   
   /**
    * Gets the Already Claim Processed flag
    */
   public function getIsAlreadySentClaimProcessed():boolean 
   {
     return isAlreadyClaimProcessed 
   }
   
   /**
    * Calculates the total time take for the process
    * @param claimConversionStart
    *         Start date for the process
    */
   public function calculateTotalTime(claimConversionStart:Date):void
   {
     var  claimConversionEnds =  gw.api.util.DateUtil.currentDate()
     var edwImpl = new EDWPayloadGenConversionImpl()
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
   
   /**
    * Checks whether the current batch job is running and returns false in case of terminated
    * @result boolean
    *         Flag for status of batch process
    */
   private function isJobRunning() : boolean
   {
     var retValue = true
     if (TerminateRequested)
     {
       retValue = false
     }
     return retValue
   }
   
}