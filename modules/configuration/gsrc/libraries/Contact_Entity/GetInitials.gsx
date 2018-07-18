package libraries.Contact_Entity

enhancement GetInitials : entity.Contact {
  function getContactInitials() : String{
    var initials = ""
    var p = this as Person
    if(p.FirstName != null){
      initials = p.FirstName.substring(0,1).toUpperCase();
    }
    if(this.Person.MiddleName != null){
      initials = initials + this.Person.MiddleName.substring(0, 1 ).toUpperCase(); 
    }
    if(this.Person.LastName != null){
      initials = initials + this.Person.LastName.substring( 0, 1 ).toUpperCase();
    }
  
    return initials;
  
  }
}
