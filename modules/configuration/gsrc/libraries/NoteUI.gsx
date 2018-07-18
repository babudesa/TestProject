package libraries

@Export
enhancement NoteUI : entity.Note
{
  /*
   * Initialize any standard default values on a newly created Note. Used in the new
   * Note page
   */
  function setInitialValues(investigation : SIUInvestigationExt) {
    this.Confidential = false
    if(investigation!=null){
      this.Claim.addNoteToInvestigation( investigation, this )
      this.Topic = "siu"
      //disassociating SIUClaimant for notes it is not needed
      //Reason for disassociation is that a stack trace will happen
      //if the claimant changed while  a note is being created for SIU.  See CR 720 for more details
      //this.RelatedTo = investigation.SIUClaimant
      this.Subject = "SIU Claim Note"
      this.AllowExternalViewing = false
    }
  }

  function addBlankLine(){
    var noteBody: String = null;
    if (this.Body != null) {
      noteBody = this.Body + "\nDocLink: ";
    }
    else {
      noteBody = "\nDocLink: ";
    }
    this.Body = noteBody;
  }

  /* Defect 3387 - Function returns a validation expression message if the note body is over the 4000 character limit.  Returns null otherwise.
  *  Created: 5/20/2010 - Zach Thomas
  */
  function limitBodyLength():String{
    if((this.Claim.LossType == "EXECLIABDIV" or  this.Claim.LossType == "PROFLIABDIV" or this.Claim.LossType== LossType.TC_SPECIALHUMSERV) and this.Topic == "potdev" and this.Body != null and this.Body.length() > 400){
      return displaykey.Web.Note.NoteBody.OverLimit((new java.text.DecimalFormat("###,###,###").format(this.Body.length())), "400")
    }else{
    if(this.Body != null and util.StringUtils.getXMLValue(this.Body, false).length() > 4000){
      return displaykey.Web.Note.NoteBody.OverLimit((new java.text.DecimalFormat("###,###,###").format(util.StringUtils.getXMLValue(this.Body,false).length())), "4,000")
    }
    else {
      return null;
    }
  }
  }
  


}