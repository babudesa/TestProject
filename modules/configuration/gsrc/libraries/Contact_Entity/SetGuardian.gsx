//error on Guardian in this.Guardian and oldGuardian - neither can be seen as an entity.Person 
//file does not appear in use by any other file at this time so commenting out to test for perminant removal
//C.Mcdonald 9-9-13 Studio clean up
/*
package libraries.Contact_Entity

enhancement SetGuardian : entity.Contact {
  function updateGuardian(claim : Claim) : String{
    if(this typeis Person){    //Ensure that this function was called on a Person
      var guardian : Person = this.Guardian
      var oldGuardian = (this.OriginalVersion as Person).Guardian  //get the original guardian
  
      if(guardian != oldGuardian){  //compare the old guardian to the new guardian
        createGuardianClaimContact(claim, guardian)  //call function to add role to new guardian
        removeGuardianClaimContact(claim, oldGuardian) //call function to, possibly, remove the role from the old guardin 
      }
  
      return null //return null to successfully validate the change
    }
    else{ return "Contact must be of type Person." }  //send an error to let the dev know they tried to add a guardian on a contact that isn&apos;t a Person
  }

  function createGuardianClaimContact(claim : Claim, guardian : Person) {
    if(guardian != null){ claim.addRole( "Guardian", guardian ) } //add the &apos;Guardian&apos; role to the guardian
  }
 
  function removeGuardianClaimContact(claim : Claim, oldGuardian : Person){
    if(oldGuardian != null and oldGuardian.Wards.length <= 1){  //ensure the guardian isn&apos;t null andthe contact has 1 ward or none (value includes the ward being removed)
      claim.removeRole( "Guardian", oldGuardian )  //then remove the guardian role
    }
  }
}
*/