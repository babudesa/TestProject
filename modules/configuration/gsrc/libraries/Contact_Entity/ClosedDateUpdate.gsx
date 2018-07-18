package libraries.Contact_Entity

//Previously checkClosedDateUpdate
enhancement ClosedDateUpdate : entity.Contact {
  function checkClosedDateUpdate(): String{
  
  if (exists(field in this.ChangedFields where field== "this.CloseDateExt")){
        for (role in User.util.getCurrentUser().Roles){          
             if ( role.Role ==Role( "compliance_account")){
               return null
            }
          }
          
      }
      return ("Must have a role of Compliance Accounting to update/change Close Date.")
  }
}
