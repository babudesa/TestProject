package gw.util

/**
 * 
 */
class AddressUtil {

  construct() {

  }
  
  
   //Created for the purpose of Defect : 8385 
   /* if (US or CA) condition. Erawe added so AC foreign address would show in the manual check location screen. erawe - 10/3/16*/
   static function getOwnerAddresses(addresses : Address[]): Address[]
  {
    if(addresses!=null and addresses.Count>0 and addresses*.Country=="US" or addresses*.Country=="CA")
      return sortAddresses(addresses.toList())
    else
    return addresses
  }

  /*
  * Defect 8385 - cprakash - 3/9/2016 
  * Below function is used to sort the Addresses By State First and Numerically by Address then
  */
  static function sortAddresses(addressList : java.util.List) : Address[]
  {
    var addressList2 : List = new java.util.ArrayList();
    var addressList3 : List = new java.util.ArrayList();
    
    if(addressList!=null and addressList.Count >0)
    {
     //Sort By State First
     addressList.sortBy(\ address -> (address as Address).State)
    
     for(state in State.getTypeKeys(false))
     {
       addressList2 = addressList.copy().where(\ address -> (address as Address).State == state)
       if(addressList2.Count > 0)
       {
        //Sort by Address Line1
        addressList2.sortBy(\ o -> (o as Address).AddressLine1 )
        addressList3.addAll(addressList2)
       }
      }
      return addressList3.toArray() as Address[]
    }
    return addressList as entity.Address[]
   }

}
