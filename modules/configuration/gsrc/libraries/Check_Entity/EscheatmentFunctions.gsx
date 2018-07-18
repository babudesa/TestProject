package libraries.Check_Entity

enhancement EscheatmentFunctions : entity.Check {
  public function numEscheatNoticesSent():int{
    var numNotices:int = 0
    if(exists(histRecord in this.Claim.History where histRecord.Description != null and
      histRecord.Description.equalsIgnoreCase( "180 day escheatment document sent for check: " + this.CheckNumber) )){
        numNotices = numNotices + 1;
    }
    if(exists(histRecord in this.Claim.History where histRecord.Description != null and
      histRecord.Description.equalsIgnoreCase( "210 day escheatment document sent for check: " + this.CheckNumber) )){
        numNotices = numNotices + 1;
    }
    return numNotices;
  }

  public function escheatNotificationSent(){
    if(this.numEscheatNoticesSent() == 0){
      this.Claim.createCustomHistoryEvent( "DataChange", "180 day escheatment document sent for check: " + this.CheckNumber );
    }
    else if(this.numEscheatNoticesSent() == 1){
      this.Claim.createCustomHistoryEvent( "DataChange", "210 day escheatment document sent for check: " + this.CheckNumber );  
    }
  }
}
