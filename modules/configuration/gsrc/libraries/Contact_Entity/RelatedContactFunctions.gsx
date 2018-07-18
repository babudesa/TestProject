package libraries.Contact_Entity
uses java.util.ArrayList

enhancement RelatedContactFunctions : entity.Contact {
  /*
  *  Prevent certain relationships from displaying in Relationship drop down list.
  *  be updated by ClaimCenter and not replace these when an automated process updates, i.e. PRM nightly updates
  *  Sprint/Maintenance Release: EM 17 
  *  Author: Zach Thomas 
  *  Date: 12/29/09
  *  Two extra (Collection Agency , Third-Party Insurer) from relationship List .
  */
  function  getFilteredContactRelationships(cont : Contact):ContactBidiRel[] {
            var relationshipList:List = new ArrayList();    
            
            /* To Exclude those newly added Relationships in CC 6.0*/
            /* Add any entity from ContactBidiRel that needs excluded from a list*/
            var extraRelShipList = new ArrayList();
            extraRelShipList.add("Collection Agency");
            extraRelShipList.add("Third-Party Insurer");
            extraRelShipList.add("Assigned Case");
            extraRelShipList.add("Third-Party Insured"); 
            extraRelShipList.add("Spouse To");
            extraRelShipList.add("Sibling To");
            extraRelShipList.add("Primary Contact For");
            extraRelShipList.add("Other Related");
            extraRelShipList.add("Domestic Partner To");
                    
            for(rel in this.getPossibleBidiRelsToContact( cont ) index i){   
                if((rel != "morenamedinsured" and rel != "morenamedinsureddba") 
                    and ! extraRelShipList.contains(rel.Description)   
                    and !(cont.Subtype == "ex_Agency" and rel == "employer") 
                    and !(cont.Subtype == "Person" and rel == "employee")
                    and !(cont.Subtype== "ex_Agency" and rel == "guardian")
                    and !(cont.Subtype== "ex_Agency" and rel == "ward")
                    //and rel != "child" and rel != "guardianadlitem"
                    //and rel != "powerofattorney"and rel != "attorneymedicare"
                    //and rel != "principal"  and rel != "client"
                    and rel != "medicareguardian" and rel != "medicareward" 
                    and rel != "conservator" and rel != "conservatorward"
                    and rel != "other" and rel != "otherto" 
                    and !(getFilteredClaimantContactRelationship(cont).contains(rel))
                    and rel != "familytestator" and rel != "estatetestator" and rel != "othertestator"){      
                          
                    relationshipList.add(rel);
                }
                
                
            }
            if(cont.Subtype == "Person"){
                 relationshipList.add("employee") 
            }
            return (relationshipList as ContactBidiRel[]);
  }
  
  function getAllRelationships(cont : Contact) : ContactBidiRel[] {
    var relationshipList:List = new ArrayList(); 
    
       /* To Exclude those newly added Relationships in CC 6.0*/
       /* Add any entity from ContactBidiRel that needs excluded from a list*/
            var extraRelShipList = new ArrayList();
            extraRelShipList.add("Collection Agency");
            extraRelShipList.add("Third-Party Insurer");
            extraRelShipList.add("Assigned Case");
            extraRelShipList.add("Third-Party Insured"); 
            extraRelShipList.add("Spouse To");
            extraRelShipList.add("Sibling To");
            extraRelShipList.add("Primary Contact For");
            extraRelShipList.add("Other Related");
    
    for(rel in this.getPossibleBidiRelsToContact(null)) {
      if(!(cont.Subtype== "ex_Agency" and rel == "guardian")
                    and !(cont.Subtype== "ex_Agency" and rel == "ward")
                     and ! extraRelShipList.contains(rel.Description)   
                    and rel != "powerofattorney"and rel != "attorneymedicare" //and rel != "guardianadlitem"
                    and rel != "principal" and rel != "client" //and rel != "child"
                    and rel != "medicareguardian" and rel != "medicareward"
                    and rel != "other" and rel != "otherto"
                    and rel != "primarycontact" and rel != "primarycontactfor"
                    and rel != "morenamedinsured" and rel != "morenamedinsureddba"
                    and rel != "otherrelated" and rel != "otherrelatedto"
                    and rel != "employee" and rel != "employer"
                    and !(getFilteredClaimantContactRelationship(cont).contains(rel))
                    and rel != "familytestator" and rel != "estatetestator" and rel != "othertestator"){ 
                      relationshipList.add(rel) 
                    }
                    
    }
      
      relationshipList.add("employee")
      relationshipList.add("employer")
    
    return (relationshipList as ContactBidiRel[]);
  }
  
  function getFilteredMedicareContactRelationships(cont : Contact) : ContactBidiRel[]{
     
     var relationshipList: List = new ArrayList()
  
     relationshipList.add("powerofattorney") 
     relationshipList.add("medicareguardian")
     relationshipList.add("attorneymedicare")
     relationshipList.add("other")
     //relationshipList.add("guardianadlitem")

     return (relationshipList as ContactBidiRel[])
    
  }
  
  function getFilteredMedicareContactRepRelationships(cont : Contact) : ContactBidiRel[]{
     
     var relationshipList: List = new ArrayList()
  
     relationshipList.add("powerofattorney") 
     relationshipList.add("conservator")
     relationshipList.add("attorneymedicare")
     relationshipList.add("other")
     //relationshipList.add("guardianadlitem")

     return (relationshipList as ContactBidiRel[])
    
  }
  
  function getFilteredClaimantContactRelationship(cont: Contact) : ContactBidiRel[]{
    var relationshipList: List = new ArrayList()
    
    relationshipList.add("estateheir")
    relationshipList.add("familyheir")
    relationshipList.add("otherheir")
    return (relationshipList as ContactBidiRel[]) 
    
  }



  /*
  *  Validate that contact subtype is Company when creating a More Named Insured DBA Related Contact.
  *  Sprint/Maintenance Release: EM 17 
  *  Author: Zach Thomas
  *  Date: 12/29/09
  */
  function validateMNIDBARelatedContact(contCont:ContactContact):String {
    var validationMsg:String = null;
  
    if(contCont.getBidiRel( this ) == "morenamedinsureddba" and contCont.getOtherContact( this ).Subtype !=  "Company"){
      validationMsg = displaykey.Validator.MoreNamedInsuredDBA;
    }
    return validationMsg;
  }
}
