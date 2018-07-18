package util.gaic.EDW;
uses templates.messaging.edw.PartyTemplate
uses soap.ContactsToEdw.api.ContactsToEdwAPI
uses gw.api.soap.GWAuthenticationHandler

class EDWPartyFunctions {
  
  construct() {
  }
 
  static function getInstance() : EDWPartyFunctions {
    return new EDWPartyFunctions();
  }
  
  protected function sendNewClaimParties(messageContext : MessageContext, claim : Claim) {
    var partycontact : Contact;
    var partygroup : Group;
    var partyrole = "";
    var addtnlinfo = "";
    var reltoclaim = "";
    var partyRelTo = "<PartyRelTo><PublicID>"+claim.PublicID+"</PublicID><RelToType>Claim</RelToType></PartyRelTo>"
    
    // Create messages for parties involved with claim as owner
    for( var thecontacts in claim.Contacts ) { 
      for( var thepartiesinvolved in thecontacts.Roles ) { 
        if (thepartiesinvolved.Owner == claim.ClaimNumber ) { 
          partyrole = "<Role><Code>"+thepartiesinvolved.Role.Code+"</Code><Description>"+thepartiesinvolved.Role.Description+"</Description><ListName>"+thepartiesinvolved.Role.ListName+"</ListName></Role>" ;
          createPartyPayload(messageContext, "A", thepartiesinvolved.Contact, addtnlinfo, partyrole, partyRelTo, null, "");
        }
      }
    }

    if (claim.AssignedUser != null) {
      partycontact = claim.AssignedUser.Contact;
      partyrole = "<Role><Code>assigneduser</Code><Description>AssignedUser</Description><ListName>AssignedUser</ListName></Role>";
      createPartyPayload(messageContext, "A", partycontact, addtnlinfo, partyrole,partyRelTo, null, "");
    }
      
    if (claim.AssignedByUser != null) {
      partycontact = claim.AssignedByUser.Contact;
      partyrole = "<Role><Code>assigneduser</Code><Description>AssignedUser</Description><ListName>AssignedUser</ListName></Role>";
      createPartyPayload(messageContext, "A", partycontact, addtnlinfo, partyrole, partyRelTo, null, "");
    }
      
    if (claim.PreviousUser != null) {
      partycontact = claim.PreviousUser.Contact;
      partyrole = "<Role><Code>previoususer</Code><Description>PreviousUser</Description><ListName>PreviousUser</ListName></Role>";
      createPartyPayload(messageContext, "A", partycontact, addtnlinfo, partyrole, partyRelTo, null, "");
    }
      
    if (claim.AssignedGroup != null) {
      partygroup = claim.AssignedGroup;
      partyrole = "<Role><Code>assignedgroup</Code><Description>Assigned Group</Description><ListName>Assigned Group</ListName></Role>";
      createPartyPayload(messageContext, "A", partycontact, addtnlinfo, partyrole, partyRelTo, null, "");
    }

    if (claim.getClaimOfficeBranchGroup() != null) {
      partygroup = claim.AssignedGroup;
      partyrole = "<Role><Code>businessunit</Code><Description>Business Unit</Description><ListName>Business Unit</ListName></Role>";
      createPartyPayload(messageContext, "A", partycontact, addtnlinfo, partyrole, partyRelTo, null, "");
    }

    partycontact = claim.CreateUser.Contact;
    partyrole = "<Role><Code>createuser</Code><Description>CreateUser</Description><ListName>CreateUser</ListName></Role>";
    reltoclaim = claim.PublicID;
    createPartyPayload(messageContext, "A", partycontact, addtnlinfo, partyrole, partyRelTo, null, "");
 
    partycontact = claim.UpdateUser.Contact;
    partyrole = "<Role><Code>updateuser</Code><Description>UpdateUser</Description><ListName>UpdateUser</ListName></Role>";
    reltoclaim = claim.PublicID;
    createPartyPayload(messageContext, "A", partycontact, addtnlinfo, partyrole, partyRelTo, null, "");
  }
  
  protected function sendNewPolicyParties(messageContext : MessageContext, policy : Policy) {
    var partycontact : Contact;
    var partyrole = "";
    var addtnlinfo = "";
    var partyRelTo = "<PartyRelTo><PublicID>"+policy.PublicID+"</PublicID><RelToType>Policy</RelToType></PartyRelTo>"
    
    // Create messages for parties involved with claim as owner
    for( var thecontacts in policy.Claim.Contacts ) { 
      for( var thepartiesinvolved in thecontacts.Roles ) { 
        if (thepartiesinvolved.Owner == policy.PolicyNumber ) { 
          partyrole = "<Role><Code>"+thepartiesinvolved.Role.Code+"</Code><Description>"+thepartiesinvolved.Role.Description+"</Description><ListName>"+thepartiesinvolved.Role.ListName+"</ListName></Role>" ;
          createPartyPayload(messageContext, "A", thepartiesinvolved.Contact, addtnlinfo, partyrole, partyRelTo, null, "");
        }
      }
    }

    if (policy.ex_Agency != null) {
      partycontact = policy.ex_Agency;
      partyrole = "<Role><Code>agency</Code><Description>Agency</Description><ListName>Agency</ListName></Role>";
      createPartyPayload(messageContext, "A", partycontact, addtnlinfo, partyrole, partyRelTo, null, "");
    }

    if (policy.CreateUser != null) {
      partycontact = policy.CreateUser.Contact;
      partyrole = "<Role><Code>createuser</Code><Description>CreateUser</Description><ListName>CreateUser</ListName></Role>";
      createPartyPayload(messageContext, "A", partycontact, addtnlinfo, partyrole, partyRelTo, null, "");
    }

    if (policy.UpdateUser != null) {
      partycontact = policy.UpdateUser.Contact;
      partyrole = "<Role><Code>updateuser</Code><Description>UpdateUser</Description><ListName>UpdateUser</ListName></Role>";
      createPartyPayload(messageContext,"A", partycontact, addtnlinfo, partyrole, partyRelTo, null, "");
    }
  }
  
  protected function sendNewNoteParties(messageContext : MessageContext, note : Note) {
    var partycontact : Contact;
    var partyrole = "";
    var addtnlinfo = "";
    var partyRelTo = "<PartyRelTo><PublicID>"+note.PublicID+"</PublicID><RelToType>Note</RelToType></PartyRelTo>"

    if (note.CreateUser != null) {
      partycontact = note.CreateUser.Contact;
      partyrole = "<Role><Code>createuser</Code><Description>CretaeUser</Description><ListName>CreateUser</ListName></Role>";
      createPartyPayload(messageContext, "A", partycontact, addtnlinfo, partyrole, partyRelTo, null, "");
    }

    if (note.UpdateUser != null) {
      partycontact = note.UpdateUser.Contact;
      partyrole = "<Role><Code>updateuser</Code><Description>UpdateUser</Description><ListName>UpdateUser</ListName></Role>";
      createPartyPayload(messageContext, "A", partycontact, addtnlinfo, partyrole, partyRelTo, null, "")
    }
  }
 
  /* kniese - 5/18/15 : This funciton is called in AddressBookContactDetailPopup : afterCommit = util.gaic.EDW.EDWPartyFunctions.getInstance().sendABParties(contact)
                              & NewAddressBookContact : afterCommit = util.gaic.EDW.EDWPartyFunctions.getInstance().sendABParties(contact) */                
  public function sendABParties(contact : Contact) {
    var api = new ContactsToEdwAPI()  
    //add authentication to access the api
    try{
      api.addHandler(new GWAuthenticationHandler("su", "gw"))
      var createTime : java.util.Date = api.getABContactCreateTime(contact.AddressBookUID) as java.util.Date
      contact.setCreateTime(createTime)
      if(contact.UpdateTime == null){
        contact.setUpdateTime(java.util.Date.CurrentDate) 
      }
      if(contact.UpdateUser == null){
        contact.setFieldValue("updateuser", gw.plugin.util.CurrentUserUtil.getCurrentUser().User)
      }
      if(contact.CreateUser == null){
        contact.setFieldValue("createuser", gw.plugin.util.CurrentUserUtil.getCurrentUser().User) 
      }
      contact.ABPartyIndExt = true
      
      var partyrole = ""
      //build a new destination message
      gw.transaction.Transaction.runWithNewBundle(\ innerBundle -> {
        var msg : Message = new Message();   
        msg.setFieldValue("EventName", "ABContactAdded");
        msg.setFieldValue("DestinationID", 3);
        msg.Payload = templates.messaging.edw.ABPartyEDW.renderToString(contact, "", "A", partyrole, "", "") //additional info, object status, role, partyRelTo
              //msg.MessageCode = myObject.MessageCode;
              //msg.MessageRoot = reportable;
           
            }, gw.plugin.util.CurrentUserUtil.getCurrentUser().User); 
    }
    catch(e){
      print(e + ": " + e.StackTraceAsString)
    }
  }
  
  protected function createPartyPayload(messageContext : MessageContext, objStatus : String, partycontact : Contact, addtnlinfo : String, partyrole : String, partyRelTo : String, thclaim: Claim, thetype : String) {
    var data = PartyTemplate.renderToString(partycontact, addtnlinfo, objStatus, partyrole, "", partyRelTo, thclaim, thetype, "")
    util.gaic.CommonFunctions.sendTemplateMessage(messageContext, data);
  }
  
}
