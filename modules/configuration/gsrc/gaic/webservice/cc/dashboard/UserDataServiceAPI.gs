package gaic.webservice.cc.dashboard

uses gw.api.database.Query
uses net.sf.json.JSONObject

@WebService
class UserDataServiceAPI {

  construct() {

  }
  
  /*
  * Get user data for a given userID
  *
  * @Param userID - userID of the user in the database
  * @Return JSON response containing user data
  */
  function getUserData(userID:int) : String{
    var query = Query.make(User);
    var k:Key = new Key(User, userID);
    
    query.compare("ID", equals, k);
    var user:User = query.select().getAtMostOneRow();
    
    return buildJSON(user);
  }
  
  /*
  *  Build JSON response for userID lookup
  *
  */
  private function buildJSON(u : User) : String{
    
    var userJson : JSONObject = new JSONObject();    
    var address:Address = null;
    
    //Attempt to find the business address of the user
    for(var addy in u.Contact.AllAddresses){
      if(addy.AddressType=="business"){
        address=addy;
        break;
      }
    }
    if(address == null and u.Contact.PrimaryAddress != null){
      address=u.Contact.PrimaryAddress;
    }
    
    userJson.put("ID", u.ID.Value);
    userJson.put("BusinessUnit",u.getUserBusinessUnit());
    userJson.put("FirstName",u.Contact.FirstName)
    userJson.put("LastName",u.Contact.LastName);
    userJson.put("PhoneNumber",u.Contact.PrimaryPhoneValue);
    userJson.put("EmailAddress",u.Contact.EmailAddress1);
    
    if(address != null){
      userJson.put("AddressLine1",address.AddressLine1);
      userJson.put("AddressLine2",address.AddressLine2);
      userJson.put("City",address.City);
      userJson.put("State",address.State.Description);
      userJson.put("Zipcode",address.PostalCode);
    }
    else{
      userJson.put("AddressLine1","");
      userJson.put("AddressLine2","");
      userJson.put("City","");
      userJson.put("State","");
      userJson.put("Zipcode","");
    }
    
    return userJson.toString();
    
  }//end buildJSON
   
}
