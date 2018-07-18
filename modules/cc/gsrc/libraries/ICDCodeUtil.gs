package libraries

class ICDCodeUtil
{
  construct()
  {
  }
  /*  This function is called by the ICD search screen to retrieve matching codes. The conditions match the possibilities of parameters. 
  */
   static function ICDSearch(findCode : String, findBodySystem : ICDBodySystem, adminSearch : boolean) : ICDCodeQuery 
  {
    // Current date
    var currDate = gw.api.util.DateUtil.currentDate()
    // Return variable of query type object
    var ICDCodeSearchResults : ICDCodeQuery 
    // Should only be called from admin screens. No dates are checked
    if(adminSearch == true)
    {
      // Return all records
      if(findCode == null and findBodySystem == null)
      {
        ICDCodeSearchResults = find(anICD in ICDCode where anICD.Code != null)
      }
      // Search with both criteria if both aren't null
      else if(findCode != null and findBodySystem != null)
      {
        ICDCodeSearchResults = find(anICD in ICDCode where anICD.Code contains findCode and anICD.BodySystem ==findBodySystem )
      }
      // Search with code only
      else if(findCode == null and findBodySystem != null)
      {
        ICDCodeSearchResults = find(anICD in ICDCode where anICD.BodySystem == findBodySystem )
      }
      // Search with bodysystem only
      else if(findCode != null and findBodySystem == null)
      {
        ICDCodeSearchResults = find(anICD in ICDCode where anICD.Code contains findCode )
      }
    }
    // Called from any non admin screens. Expiry and availability dates are checked. Unconstrained searches are not supported
    else
    {
      // Search with both criteria if both aren't null
      if(findCode != null and findBodySystem != null)
      {
        ICDCodeSearchResults = find(anICD in ICDCode where anICD.Code contains findCode and anICD.BodySystem ==findBodySystem and ((anICD.AvailabilityDate <= currDate or anICD.AvailabilityDate == null) and (anICD.ExpiryDate >= currDate or anICD.ExpiryDate == null)))
      }
      // Search with code only
      else if(findCode == null and findBodySystem != null)
      {
        ICDCodeSearchResults = find(anICD in ICDCode where anICD.BodySystem == findBodySystem and ((anICD.AvailabilityDate <= currDate or anICD.AvailabilityDate == null) and (anICD.ExpiryDate >= currDate or anICD.ExpiryDate == null)))
      }
      // Search with bodysysten only
      else if(findCode != null and findBodySystem == null)
      {
        ICDCodeSearchResults = find(anICD in ICDCode where anICD.Code contains findCode and ((anICD.AvailabilityDate <= currDate or anICD.AvailabilityDate == null) and (anICD.ExpiryDate >= currDate or anICD.ExpiryDate == null)))     
      }  
    }   
    return ICDCodeSearchResults
 }
}
