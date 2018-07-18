package gw.processes.claimexportnote

uses java.sql.Connection
uses java.util.ArrayList
uses com.gaic.claims.util.db.DatabaseUtil
uses java.sql.Statement
uses java.sql.ResultSet
uses gw.processes.BatchProcessBase
uses com.gaic.claims.env.Environment
uses java.sql.PreparedStatement
uses java.text.SimpleDateFormat
uses java.sql.Date
uses java.sql.Timestamp


/**
 * Batch Process checks ClaimExportTransaction external tables for claims that
 * were processed and sent to Mitchell,OCCM,and HCS.  
 * 
 * If the claim was sent then this process uses the ClaimPublicID stored in the
 * external table in order to retrieve the ClaimCenter claim and then add the 
 * note to the Claim.
 */
class ClaimExportNoteGeneratorProcess extends BatchProcessBase {
  var _iter : java.util.Iterator<ClaimExportItem>
  private var con:Connection = null
  var _emailRecipient = (Environment.getInstance() == Environment.PROD) ? "ClaimCenterSupport@gaic.com" : "ClaimCenterTesting@gaic.com";
  private static final var TOP = "<TOP>"
  private static final var SELECT_CLAIMS_TO_PROCESS_NOTES = "select "+ TOP + " ct.ID, ct.ClaimPublicID, ct.ProcessedDate"
                                                         + " from ClaimExportTransaction ct"
                                                         + " where ct.Processed = 1"
                                                         + " and ct.ProcessingStage = 'COMPLETED'"
                                                         + " and ct.CCNoteProcessed IS NULL or ct.CCNoteProcessed = 0"  
                               
  private static final var UPDATE_TRANSACTION = "update ClaimExportTransaction "
                                             + " set CCNoteProcessed = ?, CCNoteProcessedDate = ?, CCNoteProcessingStatus = ?"
                                             + " where ID = ?"
                                                         
  
  construct(batchProcessType:BatchProcessBase) {    
    this(batchProcessType)
  }
  
  construct() {
    super(BatchProcessType.TC_WCCLAIMEXPORTNOTE)
    con = DatabaseUtil.openConnectionToExternalWithDefaultProperties();
    con.setAutoCommit(false);
  }
  
  
  override function doWork() {
     
    
     var list = new ArrayList<ClaimExportItem>()
     var errored: boolean
     var noteAdded: boolean
     list = this.getListToProcess(null)
     OperationsExpected = list.Count
      gw.api.util.Logger.logInfo("ClaimExportNoteGeneratorProcess.doWork() - Job has " + OperationsExpected + " records to process...")
     _iter = list.iterator()
     var item : ClaimExportItem
     //create claim export note for each claim 
      while(_iter.hasNext()){
       errored = false
       noteAdded = false
       item = _iter.next()

       //find the claim in claimcenter
       var claim : Claim = find(c in Claim where c.PublicID == item.ClaimPublicID).AtMostOneRow
       var isConverted : boolean
       isConverted = claim.PublicID.contains("L")
       
       if(!this.TerminateRequested){
         //if the note has never been added then added the initial send note to the Claim
         if(!isConverted && !exists(note in claim.Notes where note.Body != null && note.Body.contains(claim.ClaimNumber) && note.Topic == NoteTopicType.TC_MEDCASEMGMT)) {
          try {
            //create and add the note to the claim
            gw.transaction.Transaction.runWithNewBundle(\ bundle -> {
              bundle.add(claim)
              var dateFormat : SimpleDateFormat = new SimpleDateFormat("MM/dd/yyyy")
              var noteBody = displaykey.ClaimExport.NoteBody(claim.ClaimNumber)
              var subject = displaykey.ClaimExport.NoteSubject(dateFormat.format(item.ProcessedDate))
              var note = claim.addNote(NoteTopicType.TC_MEDCASEMGMT, noteBody)
              note.Subject = subject;
            }, "su")
            noteAdded = true
            gw.api.util.Logger.logInfo("Note added to Claim: " + claim.ClaimNumber)
            incrementOperationsCompleted()
       
          } catch (ex) {
            //send email with error so we know it's erroring and can fix issue
            errored = true
            gw.api.util.Logger.logInfo("No Note was added. Error on Claim: " + claim.ClaimNumber + " " + ex.Message)
            util.Email.sendMail(_emailRecipient, 
                                displaykey.Java.Error.ClaimExport.EmailSubject(claim.ClaimNumber, Environment.getInstance()), 
                                displaykey.Java.Error.ClaimExport.EmailMessage(ex.Message))
            //stop processing this Claim,it has an error
            //and move on to the next one       
            incrementOperationsFailed()                       
            _iter.remove()                             
          }
         } else {
           gw.api.util.Logger.logInfo("No Note was added. Note aleady exists for Claim: " + claim.ClaimNumber)
           incrementOperationsCompleted()
         }
        
        //if not errored and a note was added then
        //set the note processed to cc flag and store in external
         if(!errored && noteAdded) {
           this.updateItem(item, true, NoteProcessingStatus.NOTE_ADDED_TO_CLAIM)
         }else if(!isConverted && !noteAdded && !errored){
           this.updateItem(item, true, NoteProcessingStatus.NOTE_EXISTS_NOT_ADDED)
         }else if(isConverted && !noteAdded && !errored) {
           this.updateItem(item, true, NoteProcessingStatus.NOT_ADDED_IS_CONVERTED_CLAIM)
         }else if(errored){
           this.updateItem(item, false, NoteProcessingStatus.NOT_PROCESSED_ERROR)
         }
       }
       else {       
         gw.api.util.Logger.logError("ClaimExportNoteGeneratorProcess - Terminate Requested...")
         break
       }
     }      
      printSummary()      
  }
  
    
  /**
   * Get the list of claims that were sent out to the vendors but haven't 
   * had a note processed onto the claim
   */
  private function getListToProcess(limit:int) : ArrayList<ClaimExportItem> {

    var sql:String
    if (limit > 0) {
      sql = SELECT_CLAIMS_TO_PROCESS_NOTES.replace(TOP, "TOP "+limit)
    } else {
      sql = SELECT_CLAIMS_TO_PROCESS_NOTES.replace(TOP, "")
    }
    var st:Statement = null
    var rs:ResultSet = null
    
     try {
      var list = new ArrayList<ClaimExportItem>()

      st = con.createStatement()
      rs = st.executeQuery(sql)
      
      while (rs.next()) {
        list.add(new ClaimExportItem(
          rs.getLong(1),
          rs.getString(2),
          rs.getDate(3),
          null,null,null))
      }
      
      return list
    } finally {
      DatabaseUtil.closeDatabaseResources(null, st, rs)
    }
  }
  
  /**
   * Update the claim export transaction to set the ccnoteprocessed = true
   */
  private function updateItem(claimItem : ClaimExportItem, processed : boolean, processingStatus : NoteProcessingStatus) {
    con.setAutoCommit(false);
    var processedDate : Date = null
    if(processed) {
      processedDate = new Date(Date.CurrentDate.Time)
    }
    var st:PreparedStatement = null;
    try {
      st = con.prepareStatement(UPDATE_TRANSACTION); 
      st.setBoolean(1, processed)     
      //st.setDate(2, processedDate) 
      st.setTimestamp(2, new Timestamp(Timestamp.CurrentDate.Time))
      st.setString(3, processingStatus.Code)
      st.setLong(4, claimItem.ID);
      var rows = st.executeUpdate();
      if (rows != 1) {
        gw.api.util.Logger.logError("Unable to update the ClaimExportTransaction in CC External for ID: " + claimItem.ID)
      } 
      con.commit()
      gw.api.util.Logger.logInfo("External Record Updated, CCNoteProcessed = true for ID: "+ claimItem.ID)
    } finally {
      DatabaseUtil.closeStatement(st);
    }
  }
  
  
  override property get Progress() : String {
     return ("Processed " + this.OperationsCompleted + " of " + OperationsExpected)
  }
  
  
  
  private function printSummary(){
    gw.api.util.Logger.logInfo("Claim Export Note Generator Process is Complete.")
    gw.api.util.Logger.logInfo(OperationsCompleted + " of " + OperationsExpected + " operations completed successfully.")
    gw.api.util.Logger.logInfo(OperationsFailed + " of " + OperationsExpected + " operations failed.")  
    
    if(OperationsFailed > 0) {
      util.Email.sendMail(_emailRecipient, 
                                "Claim Export Note Generation Failed Operations", 
                                OperationsFailed + " operations failed to generate claim export notes.  Check logs for details.")
    }
  } 
  
  
}//end ClaimExportNoteGeneratorProcess
