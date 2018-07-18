package libraries.Company_Entity

enhancement Company : entity.Company {
  //******************************************************************************************
  //Resets AAPAuthorityLimit to null if AAPAuthority is set to NO. 
  //******************************************************************************************
  public function resetAAPLimit(aap:boolean)
  {
    if(!aap)
    {
      this.ex_Agency.ex_AAPAuthorityLimit  = null   
    }
  }
}
