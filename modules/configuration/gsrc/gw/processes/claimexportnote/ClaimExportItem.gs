package gw.processes.claimexportnote
uses java.util.Date

class ClaimExportItem {

  private var _id:long as readonly ID
  private var _claimPublicId:String as ClaimPublicID
  private var _processedDate:Date as ProcessedDate
  private var _ccNoteProcessed:boolean as CCNoteProcessed
  private var _ccNoteProcessedDate:Date as CCNoteProcessedDate
  private var _ccNoteProcessingStatus: NoteProcessingStatus
  
  construct(uid:long, claimpubid : String, dateprocessed : Date, noteprocessed:boolean, noteprocesseddate:Date, status : NoteProcessingStatus) {
    _id = uid
    _claimPublicId = claimpubid
    _processedDate = dateprocessed
    _ccNoteProcessed = noteprocessed
    _ccNoteProcessedDate = noteprocesseddate
    _ccNoteProcessingStatus = status
  }
}
