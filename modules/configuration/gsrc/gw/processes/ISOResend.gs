package gw.processes
uses gw.api.database.Query
uses gw.api.database.Relop
uses java.util.ArrayList
uses java.io.BufferedWriter
uses java.io.FileWriter
uses java.sql.Timestamp
uses java.util.Date

class ISOResend extends BatchProcessBase{

  var _batchSize : int
  var _iter : java.util.Iterator<Exposure>
  
  var _logger = com.guidewire.cc.system.logging.CCLoggerCategory.SERVER_BATCHPROCESS.Logger
  var _desiredLevel = org.apache.log4j.Level.INFO
  var _previousLevel : org.apache.log4j.Level
  var _reportData : List<String>
  
  construct() {
    super(BatchProcessType.TC_ISORESEND)
    _batchSize = ScriptParameters.SendISOCloseDateBatchSize
    configLogger(false)
    _logger.info("Constructing ISOResend batch process - batch size is: " + _batchSize + "...")
  }
  
  /**
   * Additional setup
   */
  override function checkInitialConditions() : boolean {
    _logger.info("ISOResend - checkInitialConditions()...")
    
    var query = Query.make(Exposure)
    query.compare("ISOKnown", Relop.Equals, null)
    query.compare("ISOSendDate", Relop.NotEquals, null)
    query.compare("ISOSendDate", Relop.LessThan, ScriptParameters.SendISOCloseDateBefore)
    var exposures = query.select().toList()
    
    _logger.info("ISOResend - process has " + exposures.Count + " candidate exposures to process...")
    
    var upperLimit = exposures.Count > _batchSize ? _batchSize : exposures.Count
    exposures = exposures.subList(0, upperLimit)
    this.OperationsExpected = exposures.Count
    _iter = exposures.iterator()
    
    _reportData = new ArrayList<String>(upperLimit + 1)
    _reportData.add("Claim: Feature,ISO Send Date")
        
    return this.OperationsExpected  > 0
  }

  /**
   * Where most of the action happens
   */
  override function doWork() {
    _logger.info("ISOResend - doWork(): job has " + OperationsExpected + " Operations Expected...")
    var exposure : Exposure
    
    while(_iter.hasNext()){
      try{
        if(!this.TerminateRequested){
          exposure = _iter.next()
      
          gw.transaction.Transaction.runWithNewBundle(\ bundle -> {
            //_logger.info("ISOResend- Adding " + exposure.Claim.ClaimNumber + ": " +  exposure.DisplayName + " to the bundle...")
            bundle.add(exposure)
            exposure.ISOStatus = ISOStatus.TC_RESENDPENDING
          }, "batchsu") 
        }else{
          _logger.info("ISOResend - Terminate Requested...")
          break
        }
        _reportData.add(exposure.Claim.ClaimNumber + ": " + exposure.DisplayName + "," + exposure.ISOSendDate.toString())
        incrementOperationsCompleted()
      
      }catch(e){
        incrementOperationsFailed()
        _logger.error("ISOResend - failed to set status for " + exposure.Claim + ":" + exposure)
        _logger.error(e.StackTraceAsString) 
      }
      //remove processed elements from the iterator to decrease memory profile?
      _iter.remove()
    }
    
    printSummary()
    report()
    //reset logger level    
    configLogger(true)
  }
  
  /**
   * Sets the log level before and after doWork() to ensure output
   */
  private function configLogger(workCompleted : boolean){
    if(workCompleted == false){
      _previousLevel = _logger.Level == null ? org.apache.log4j.Level.OFF : _logger.Level  
    }
    
    _logger.setLevel(workCompleted ? _previousLevel : _desiredLevel)
  }
  
  private function printSummary(){
    _logger.info("ISOResend - batch process is complete.")
    _logger.info(OperationsCompleted + " of " + OperationsExpected + " operations completed successfully.")
    _logger.info(OperationsFailed + " of " + OperationsExpected + " operations failed.")    
  }
  
  private function report(){
    var filePath = "/tmp/"   
    var fileName = "ISOResend Report " + (new Timestamp(new Date().getTime()).toString()) + ".csv"
    fileName = fileName.replaceAll(":", "_")
    try{
      var bw = new BufferedWriter(new FileWriter(filePath+fileName))
    
      for(each in _reportData){
        bw.write(each)
        bw.newLine() 
      }
      
      bw.close()
      
      util.Email.sendMail("tnewcomb@gaig.com", "ISOResend Report", "Please review the attached report.", filePath+fileName, fileName, "ISOResend Report")
      
    }catch(e){
      _logger.error(e.StackTraceAsString) 
    }    
  }

}
