package libraries.Contact_Entity

enhancement ABContactEnhancement : soap.abintegration.entity.ABContact {
   function updateCloseIndicator() {
    if(this.CloseDateExt == null){
      this.CloseIndicatorExt = "0000-00-00 00:00:00:000"
    }
    else{
      // Add the calander year
     this.CloseIndicatorExt = this.CloseDateExt.toString()
      
    }
    
  }
}
