package libraries.Policy_Entity

enhancement AgencyChange : entity.Policy {
  function updateAgencyRoles(prevAgency : ex_Agency){
    if(prevAgency != null and prevAgency != this.ex_Agency){
   
      this.removeRole( "Agency", prevAgency )
    }
    if(this.ex_Agency != null and !exists(contact in this.Claim.Contacts where contact.Contact == this.ex_Agency)){
      this.addRole( "Agency", this.ex_Agency )
    }
  }
}
