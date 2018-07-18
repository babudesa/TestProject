package libraries.Matter_Entity

enhancement MatterRoleFunctions : entity.Matter {
  
  
  
  public function mediatorsChanged():boolean{
    
    var originalMatter = this.OriginalVersion as Matter
    
    foreach(mediator in this.MediatorsExt){
      
      if(originalMatter.MediatorsExt.contains(mediator) == false){
        return true
      }else{
        return true
      }
    }
    return false
  }
   
}//end Enhancement
