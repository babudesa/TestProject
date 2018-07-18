package gw.admin
uses java.util.HashSet
uses com.guidewire.pl.system.dependency.PLDependencies
class DecentralizedAdminUtil
{
  construct()
  {
  }
  
  
  
  public static function getOrgFromAddress(address : AddressBase): Organization{
    return getOrgFromZoneSet(getZonesForAddress(address));
  }

  public static function getOrgFromZone(zone1 : Zone) : Organization{
    var hashSet = new HashSet<Zone>();
    var returnZoneType = PLDependencies.getZoneConfiguration().getOrgZoneTypeForCountry( zone1.Country)
    var resultQP = Zone.finder.findZones( zone1.Country, zone1.ZoneType, zone1.Code, returnZoneType)
    if (resultQP.Count == 1) {
     hashSet.add(resultQP.FirstResult)
      return getOrgFromZoneSet(resultQP.FirstResult)
    }
    else {
      //Didn't resolve to one zone, so this zone isn't valid
      return null;
    }
  }
  
  private static function getOrgFromZoneSet(adminZone : Zone) : Organization{
    
    if (adminZone != null) {
      var queryProcessor = PLDependencies.getOrganizationFinder().findAllOrganizations()
      if (!queryProcessor.Empty) {
         var orgIterator = queryProcessor.iterator() 
         for (org in orgIterator) {
           var castOrg = org as Organization;
           if (!castOrg.MasterAdmin && castOrg.ZonesToAdmin.length > 0){
             for (adminZones in castOrg.ZonesToAdmin){
               if (adminZones.ZoneCode == adminZone.Code && 
                   adminZones.ZoneType == adminZone.ZoneType &&
                   adminZones.Country == adminZone.Country){
                     return castOrg;
               }
             }
           }
         }
     }
   }
    return null;
  }
  
  private static function getZonesForAddress(address : addressBase) : Zone{
    var country = address.getCountry();
    if (country != null) {
      var zoneType = PLDependencies.getZoneConfiguration().getOrgZoneTypeForCountry( country )          
      var zone = gw.api.contact.AddressAutocompleteUtil.lookupZone(address, zoneType, false)
      if (zone != null) {
        return zone
      }
    }
    return null
  }
  
}
