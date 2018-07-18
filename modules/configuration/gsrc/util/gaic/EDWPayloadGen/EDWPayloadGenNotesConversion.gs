package util.gaic.EDWPayloadGen
uses gw.lang.ScriptParameters
uses _proxy_.gw.processes.BatchProcessBase
uses entity.Claim
uses java.lang.String
uses typekey.BatchProcessType
uses util.gaic.EDWPayloadGen.NotesExecutor
uses util.gaic.EDWPayloadGen.NotesCallable
uses util.gaic.EDWPayloadGen.EDWPayloadGenConversionImpl
uses util.gaic.EDWPayloadGen.Conversionutil
uses gw.processes.BatchProcessBase
uses java.util.ArrayList
uses java.lang.Exception
uses gw.api.util.Logger
uses java.util.concurrent.Executors
uses gw.util.EDWConversionDTO
uses java.text.SimpleDateFormat
uses java.lang.Runtime
uses java.util.concurrent.Future
uses java.util.Date
uses gw.api.database.Query
uses java.util.concurrent.ExecutorService
class EDWPayloadGenNotesConversion extends BatchProcessBase{

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
  var threadExecutor =new NotesExecutor()
  var executor: ExecutorService
  
  /**
  * Override the Request Termination 
  */
  override function requestTermination():boolean  
  {
    // set the TerminationRequested flag 
    super.requestTermination() 
    // return true to signal that we will attempt to terminate in our doWork method
    return true
  }
  
  /**
  * Checking the initial conditions
  */
  public override function checkInitialConditions():boolean 
  {
    return true
  }
  
  /**
  * Default Constructor 
  */
  construct() 
  {
   super(BatchProcessType.TC_EDWNOTESPAYLOADGENERATION)
  }
  
  /**
   * Initial function to get called for EDWConversion Bath Process 
   */
  override function doWork() 
  {
    logger.info(" *********** EDWPAYLOADGEN CONVERSION NOTES BATCH JOB STARTED ************ " )
    var  claimConversionStarts =  gw.api.util.DateUtil.currentDate()
    var loadCmdID=ScriptParameters.EDWNotesConversionLoadCommandID
    var  claimsList = new  ArrayList<String>()
    var convertedClaims = conversionutil.retrieveClaimsForNotes(loadCmdID as java.lang.String)
    //Variable to track the execution count, in case of Chunk execution
    var chunkIndexCount = 0
    
    logger.info("loadcommandid :" +loadCmdID)
    logger.info(" No.  of converted claims :" +claimsList.Count)
    logger.info("Running with "+workerthread+" Thread Now.")
    
    threadExecutor.setBatchStartTime(claimConversionStarts)
    // A thread pool with a fixed number of threads assigned for payload generation
    if(workerthread == 0){
      workerthread =conversionutil.noofthreadcount
    }
    
    for(convertedClaim  in convertedClaims) 
    {
      claimsList.add(convertedClaim)
    }
    try
    {
      //total_no_of_claims = conversionutil.getClaimCount()
      total_no_of_claims =claimsList.Count
      logger.info(" Total no. claims :  "+ total_no_of_claims + 
                        " ready for notes payload generation with chunk size : " +claim_chunk_size)
      if(total_no_of_claims > claim_chunk_size)
      { 
        to_claim_row = claim_chunk_size
      } 
      else 
      {
        to_claim_row = total_no_of_claims
      }
     
      if(total_no_of_claims<claim_chunk_size && 
         isJobRunning())
      {
          clmSublist  = new ArrayList<String>()
          clmSublist.addAll(claimsList.subList(from_claim_row, to_claim_row))
          //Eg - When the converted claim < 500, there will be single and final run
          logger.info("Total no. of converted claims notes in Payload Process : "+ claimsList.Count)
          logger.info("No. of claims notes considered for the execution : "+clmSublist.Count +" for the single and final run ")
          logger.info("Claims are : "+clmSublist)
          processChunkOfClaim(loadCmdID,clmSublist)
          calculateTotalTime(claimConversionStarts)   
      } 
      else 
      {
        while (total_no_of_claims>=claim_chunk_size && 
               isJobRunning()) 
        {
          clmSublist = new  ArrayList<String>()
          clmSublist.addAll(claimsList.subList(from_claim_row, to_claim_row))
          chunkIndexCount++
          //Eg - For 5000 converted claim, there will be 10 runs, as the chunk size is 500
          logger.info("Total no. of converted claims in Notes Payload Process : "+ claimsList.Count)
          logger.info("No.of claims notes processed till now :  "+ alreadyProcessedClmCount)
          logger.info("No. of claims notes considered for the execution : "+clmSublist.Count +" in the "+chunkIndexCount+" run ")
          logger.info("Count from : "+ from_claim_row)
          logger.info("Count till : "+ to_claim_row)
          logger.info("Claims are : "+clmSublist)
          processChunkOfClaim(loadCmdID,clmSublist)
          alreadyProcessedClmCount = alreadyProcessedClmCount + claim_chunk_size
          total_no_of_claims = total_no_of_claims - claim_chunk_size
          to_claim_row = to_claim_row + claim_chunk_size
          from_claim_row = alreadyProcessedClmCount
          //Processing Payload when total claims count > 500 and remaining claim count < 500
          if(total_no_of_claims < claim_chunk_size &&
             total_no_of_claims > 0)
          {
            var remClmSublist = new  ArrayList<String>()
            chunkIndexCount++            
            remClmSublist.addAll(claimsList.subList(from_claim_row, from_claim_row+total_no_of_claims))
            //Eg - For 5250 converted claim, it will be executed for last 250 claim in last final run
            logger.info("Total no. of converted claims in Notes Payload Process : "+ claimsList.Count)
            logger.info("No.of claims notes processed till now : "+ alreadyProcessedClmCount)
            logger.info("No. of claims notes considered for the last execution : "+remClmSublist.Count +" in the last "+chunkIndexCount+" run ")
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
      logger.error("Error in Notes Processing,"+ex)
    }
    finally 
    {
      executor=null
      conversionutil = null
      threadExecutor=null
      clmSublist=null
      claimsList=null
      logger.info( " *************** EDW  push notes payload generation is completed ******************" )
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
      var elementsToCompute =new ArrayList<Future<String>>()
      var notesCallables = new ArrayList<NotesCallable>()
      var notesFutures = new ArrayList<Future<NotesExecutor>>()
      executor = Executors.newFixedThreadPool(workerthread)
      threadExecutor.setClaimCount(subList.Count)
      logger.info(" No. of availableProcessor "+ availableProcessor )
      logger.info(" No. of claims reads from EDWConversionTrigger table "+ subList.Count )

      try
      {
        var convertedClaims = subList.iterator().toList()
        var SchemaURL="/workspace/Claims_To_EDW/Resources/Validation/SchemaClaimCenterToEDW.xsd"
        var count=convertedClaims.Count
        
        //Create Notes Callable List with Converted Claims list
        for (var convertedClaim in convertedClaims)
        {
          var clm = Query.make(Claim)
                         .compare("loadcommandid", Equals, loadid)
                         .compare("ClaimNumber", Equals, convertedClaim).select()
                         .orderBy(\ c ->c.ClaimNumber ).AtMostOneRow
          var notesCallable = new NotesCallable(clm,SchemaURL)
          notesCallables.add(notesCallable)
          logger.info(" Claim : " + clm.ClaimNumber + " Notes Payload generated "+ " count= "+count )
          count--
        }
        
        //Call the Notes Callables with Notes Future
        for (var notesCallable in notesCallables)
        {
          if (isJobRunning())
          {
            var notesFuture = executor.submit(notesCallable)
            if (notesFuture.get() != null)
            {
              notesFutures.add(notesFuture)
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
        logger.error("Error in EDWPayloadGen Notes Conversion : "+e.StackTrace+"--------- "+e.Message )  
      }
      finally 
      {
        //Release all created resources
        elementsToCompute=null
        executor.shutdown()
        notesCallables = null
        notesFutures = null
        executor = null
        logger.info("Finally in EDWPayloadGen Notes Conversion  " )  
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
    logger.info("Set:"+isAlreadyClaimProcessed)
  }
  
  /**
   * Gets the Already Claim Processed flag
   */
  public function getIsAlreadySentClaimProcessed():boolean 
  {
    logger.info("Get:"+isAlreadyClaimProcessed)
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
