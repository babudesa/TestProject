package util.gaic.EDWPayloadGen
uses java.util.Date
uses entity.Contact
uses typekey.PersonRelationType
uses entity.Policy
uses entity.ClaimContact
uses java.lang.String
uses util.gaic.EDWPayloadGen.EDWMessagePayloadDTO

uses templates.messaging.edw.PartyRelateDataEDW
uses templates.messaging.edw.PartyDataEDW
uses java.util.ArrayList
uses java.lang.Exception

/* This class is responsible for creating the Claim Contact
   payloads using the template PartyRelateDataEDW and PartyDataEDW*/
class EDWPayloadGenClaimContactFunction {

  construct() {
  }
  static function getInstance() : EDWPayloadGenClaimContactFunction {
    return new EDWPayloadGenClaimContactFunction();
  }
 
 // Process the Related To Insured Parties and returns the list of EDWMessagePayloadDTO objects
  public function processRelToInsuredParties(cc : Claim):ArrayList<EDWMessagePayloadDTO> {
     var list=new ArrayList<EDWMessagePayloadDTO> ()
     var tempData=""
      if (cc.Policy.insured !=null and cc.maincontact != null and cc.MainContactType != null) {
        
       try{  
         tempData=sendRelatedInsuredRoleChange( cc, cc.maincontact, cc.UpdateTime, cc.MainContactType as java.lang.String, "C", "A", "A" )
          if(tempData.size>0){
          var dto=new EDWMessagePayloadDTO()
                 dto.publicIdVal=cc.maincontact.PublicID
                 dto.eventName="MainContactTypeChanged"
                 dto.payload=tempData
                 list.add(dto) 
       }
       }catch(e:Exception){
         throw new Exception("<MainContactTypeChanged><PublicId>"+cc.maincontact.PublicID+"</PublicId><TransationName>Party</TransationName><ErrorMessage>Error while generating MainContactType payload</ErrorMessage></MainContactTypeChanged>")
       }
      }
        if (cc.Policy.insured !=null and cc.reporter != null) { 
        try{
        tempData=sendRelatedInsuredRoleChange(cc, cc.reporter, cc.UpdateTime, cc.ReportedByType as java.lang.String, "C", "A", "A" ); 
        if(tempData.size>0){
         var dto=new EDWMessagePayloadDTO()
                 dto.publicIdVal=cc.reporter.PublicID
                 dto.eventName="ReportedByTypeChanged"
                 dto.payload=tempData
                 list.add(dto) 
        }
        }catch(e:Exception){
         throw new Exception("<ReportedByTypeChanged><PublicId>"+cc.reporter.PublicID+"</PublicId><TransationName>Party</TransationName><ErrorMessage>Error while generating Reportedby payload</ErrorMessage></ReportedByTypeChanged>")
       }
         
    }
      return list 
    }
    
 // Creates the payload for RelatedInsuredRole based on the template PartyRelateDataEDW
  public function sendRelatedInsuredRoleChange(claim : Claim, kontact : Contact,theupdatetime : DateTime, relation : PersonRelationType, objstatus : String, parentrolestatus : String,
  relationstatus : String ) :String{
    var parentrole = "";
    var childrole = "";  
    var reltoparty ="";
    var publid = claim.Policy.PublicID;
    var reltotype = "Policy";
    var templateData:String=""

    if (!claim.Policy.Verified) {
      parentrole = "<Role><Code>insured</Code><Description>Insured</Description><ListName>ContactRole</ListName></Role>";
      childrole = "<Role><Code>"+relation.Code+"</Code><Description>"+relation.Description+"</Description><ListName>"+relation.ListName+"</ListName></Role>";
      reltoparty = "<PartyRelTo><PublicID>"+publid+"</PublicID><RelToType>"+reltotype+"</RelToType></PartyRelTo>";
     
      templateData = PartyRelateDataEDW.renderToString("", claim, parentrole, childrole, reltoparty, "E", objstatus, parentrolestatus, relationstatus, theupdatetime, claim.PublicID, claim.Policy.insured, kontact);
    }  else {
      publid = claim.PublicID;
      reltotype = "Claim";
      parentrole = "<Role><Code>insured</Code><Description>Insured</Description><ListName>ContactRole</ListName></Role>";
      childrole = "<Role><Code>"+relation.Code+"</Code><Description>"+relation.Description+"</Description><ListName>"+relation.ListName+"</ListName></Role>";
      reltoparty = "<PartyRelTo><PublicID>"+publid+"</PublicID><RelToType>"+reltotype+"</RelToType></PartyRelTo>";
      templateData = PartyRelateDataEDW.renderToString("", claim, parentrole, childrole, reltoparty, "E", objstatus, parentrolestatus, relationstatus, theupdatetime, claim.PublicID, claim.Policy.insured, kontact);
    }
    return templateData
  }

/**
   * Generates the payload for the ClaimContacts
   * @param contact
   *           Contacts for which the payload has to be generated
   * @return
   *           returns the list of payloads
   */ 
function createClaimContactAdded( ccontact : ClaimContact): ArrayList<String> {
      var payloadList :  ArrayList<String>
      var contactAddedPaylaod= createClaimContactPayload(ccontact, "A")
      if(contactAddedPaylaod.length>0) {
        payloadList =new  ArrayList<String>()
        payloadList.add(contactAddedPaylaod)
      }
      return payloadList
  } 
  
/**
   * Generates the payload for the ClaimContacts
   * @param contact
   *           Contacts for which the payload has to be generated
   * @return
   *           returns the dto object
   */ 
  function createClaimContactChanged(ccontact : ClaimContact):EDWMessagePayloadDTO {
    var dto :  EDWMessagePayloadDTO
      try{
            if(ccontact.Contact.LoadCommandID!=null){
              var payload= createClaimContactPayload( ccontact, "C")
                 dto=new EDWMessagePayloadDTO()
                dto.eventName="ClaimContactChanged"
                dto.publicIdVal=ccontact.PublicID
                dto.payload=payload
            }  
      }catch(e:Exception) {
        e.printStackTrace()
        throw new Exception("Error in ClaimContactChanged : " + e.Message)
    }
      return dto   
     
  }
  
/**
   * Creates the payload for the contacts based on PartyDataEDW template
   * @param ccontact
   *           contact for which the payload has to be generated
   * @param objStatus
   *            Object status of the payload
   * @return payload
   */  
  protected function createClaimContactPayload(ccontact : ClaimContact, objStatus : String):String {
    var templateData = PartyDataEDW.renderToString("", ccontact.Contact, objStatus, ccontact.Claim);
    return templateData
  }
  
 
}

