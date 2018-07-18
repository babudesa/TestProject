package util;

@Export
class Snapshot
{

  /**
   *  Used for static functionality only.
   */
  private construct()
  {
  }

  /**
   * Return a primary phone number for a given contact.
   */
  public static function getPrimaryPhone( contact : Bean ) : String {
    var primaryPhoneType = contact["PrimaryPhone"] as String;
    if( primaryPhoneType == null ) {
      return null;
    }
    if( primaryPhoneType.toLowerCase().startsWith( "h" ) ) {
      return contact["HomePhone"] as String;
    } else if( primaryPhoneType.toLowerCase().startsWith( "w" ) ) {
      return contact["WorkPhone"] as String;
    } else if( primaryPhoneType.toLowerCase().startsWith( "b" ) ) {
      return contact["WorkPhone"] as String;
    }
    return null;
  }


  /**
   * 300 only - get covered parties for policy
   */
  public static function getCoveredParties( claim : Bean, policy : Bean ) : Bean[] {
    var claimContacts = new java.util.ArrayList<Bean>();
    for( cc in claim["contacts"] as Bean[] ) {
      for( role in cc["roles"] as Bean[] ) {
        if( role["Role"] == "coveredparty" && role["CoveredPartyType"] == "addinsured" && role["Policy"] == policy ) {
          claimContacts.add( cc );
          break;
        }
      }
    }
    return claimContacts.toTypedArray();
  }

  /**
   * 300 only - get name of coverage, in 300 there is no Vehicle property on VehicleCoverage snapshot or
   * Property property on PropertyCoverage snapshot
   */
  public static function getCoverageName(claim : Bean, coverage : Bean) : String {
    var result = ""
    if (coverage == null) {
      // Leave result null
    } else if ((typeof coverage).RelativeName == "PropertyCoverage") {
      for (policyProperty in claim["Policy"]["Properties"] as Bean[]) {
        if (exists (propertyCoverage in policyProperty["Property"]["Coverages"] as Bean[] where propertyCoverage == coverage)) {
          result = getDisplayName(policyProperty)
          break
        }
      }
    } else if ((typeof coverage).RelativeName == "VehicleCoverage") {
      for (policyVehicle in claim["Policy"]["Vehicles"] as Bean[]) {
        if (exists (vehicleCoverage in policyVehicle["Vehicle"]["Coverages"] as Bean[] where vehicleCoverage == coverage)) {
          result = getDisplayName(policyVehicle)
          break
        }
      }
    } else {
       result = "Policy Level Coverage";
    }
    return result;
  }
  
  /**
   * Return an array of ClaimContactRoles corresponding with a given role name.
   */
  public static function getClaimContactRolesByRole( claim : Bean, strRole : String ) : Bean[] {
    var claimContactRoles = new java.util.ArrayList();
    for (cc in claim["contacts"] as Bean[]) {
      for (role in cc["roles"] as Bean[]) {
        if (role["Role"] != null and strRole.equalsIgnoreCase(role["Role"]["Code"] as String)) {
          claimContactRoles.add( role );
        }
      }
    }
    return claimContactRoles.toArray();
  }

  /**
   * Returns the claimant for a given exposure.
   */
  public static function getClaimant( claim : Bean, exposure : Bean ): Bean {
    var contacts = getClaimContactsByOwnerAndRole( claim, "Exposure", exposure, "Claimant" );
    if( contacts.length == 0 ) {
      contacts = getClaimContactsByRole( claim, "Claimant" );
    }
    return contacts.length > 0 ? contacts[0] : null;
  }

  /**
   * Returns an array of ClaimContacts for a given role name.
   */
  public static function getClaimContactsByRole( claim : Bean, strRole : String ) : Bean[] {
    return getClaimContactsByOwnerAndRole( claim, null, null, strRole );
  }
  
  /**
   * Returns the contact corresponding to an exclusive role on a Policy
   */
  public static function getPolicyClaimContact( claim : Bean, policy : Bean, strRole : String ) : Bean {
    var contacts = getClaimContactsByOwnerAndRole( claim, "Policy", policy, strRole );
    return contacts.length > 0 ? contacts[0]["Contact"] : null;
  }

  /**
   * Returns the contact corresponding to an exclusive role on an Exposure
   */
  public static function getExposureClaimContact( claim : Bean, exposure : Bean, strRole : String ) : Bean {
    var contacts = getClaimContactsByOwnerAndRole( claim, "Exposure", exposure, strRole );
    return contacts.length > 0 ? contacts[0]["Contact"] : null;
  }

  /**
   * Return an array of ClaimContacts for a given exposure and role name.
   */
  public static function getClaimContactsByOwnerAndRole( claim : Bean, ownerProperty : String, owner : Bean, strRole : String ) : Bean[] {
    var claimContacts = new java.util.ArrayList();
    for (cc in claim["contacts"] as Bean[]) {
      for (role in cc["roles"] as Bean[]) {
        if (role["Role"] != null and strRole.equalsIgnoreCase(role["Role"]["Code"] as String)) {
          if (owner == null || role[ownerProperty] == owner) {
            claimContacts.add( cc );
          }
        }
      }
    }
    return claimContacts as Bean[];
  }

  public static function getContactByRole( claim : Bean, strRole : String ) : Bean {
    var claimContacts = getClaimContactsByRole( claim, strRole );
    return (claimContacts != null and claimContacts.length > 0)
           ? claimContacts[0]["Contact"]
           : null;
  }

  /**
   * Return role owner for a given claim contact role. Note we can't use the
   * Owner domain property because it is not included in the snapshot data. So
   * we check each of the ClaimContactRole's related entities to find the owner.
   */
  public static function getRoleOwner( claimContactRole : Bean ): String {
    return (typeof claimContactRole).TypeInfo.getProperty( "Exposure" ) != null and claimContactRole["Exposure"] != null
           ? getDisplayName(claimContactRole["Exposure"])
           : (typeof claimContactRole).TypeInfo.getProperty( "Matter" ) != null and claimContactRole["Matter"] != null
             ? getDisplayName(claimContactRole["Matter"])
             : (typeof claimContactRole).TypeInfo.getProperty( "Policy" ) != null and claimContactRole["Policy"] != null
               ? getDisplayName(claimContactRole["Policy"])
               : (typeof claimContactRole).TypeInfo.getProperty( "ClaimContact" ) != null and claimContactRole["ClaimContact"] != null
                 ? getDisplayName(claimContactRole["ClaimContact"]["Claim"])
                 : "The Claim";
  }

  /**
   * Returns an array of distinct contact roles for a given array of
   * ClaimContactRoles.
   */
  public static function getDistinctContactRoles( claimContactRoles : Bean[] ) : String {
    var distinctRoles = new java.util.HashSet();
    for( role in claimContactRoles ) {
      distinctRoles.add( role["Role"] );
    }
    return renderValue(distinctRoles as Bean[]);
  }

  /**
   * Filters an array of beans, returning only those which have the named type
   */
  public static function filterBeansOfType(beans : Bean[], typeName : String) : Bean[] {
    var result = new java.util.ArrayList();
    var i = 0;
    while (i < beans.length) { // Foreach gives type error. Why?
      var bean = beans[i];
      if ((typeof bean).RelativeName == typeName) {
        result.add(bean);
      }
      i = i + 1;
    }
    return result as Bean[];
  }

  public static function getViewableNotes(Claim : Claim, notes : Bean[]) : Bean[] {
    var currentUser = User.util.CurrentUser;
    var canViewConfidential = perm.Claim.viewconfidentialnotes(Claim);
    var result = new java.util.ArrayList();
    for (note in notes) {
      if (!(note["Confidential"] as Boolean) or canViewConfidential
          or note["Author"]["PublicID"] == currentUser.PublicID) {
        result.add(note);
      }
    }
    return result as Bean[];    
  }
    
  /**
   * Renders a String value for a give Bean value using the following rules:
   * - Null              = empty string
   * - Boolean           = "Yes" or "No"
   * - DateTime          = "MM/dd/yyyy hh:mm a" (short format, as configured in localization file)
   * - Array             = Comma separated list of recursive calls to this method
   * - has a DisplayName = Renders the value's DisplayName
   * - Default           = Cast the value as a String using Gosu coercion
   */
  public static function renderValue( value : Bean ) : String {
    if( value == null ) {
      return "";
    }

    if( value typeis Boolean ) {
      return value ? displaykey.Java.NameValueView.Boolean.True : displaykey.Java.NameValueView.Boolean.False;
    }

    if( value typeis DateTime ) {
      return value.formatDateTime(SHORT, SHORT)
    }

    if( value typeis Array) {
      var strArray : String = "";
      for (elem in value index i ) {
        strArray = strArray + (i > 0 ? ", " : "") + renderValue( elem );
      }
      return strArray;
    }

    if( (typeof value).TypeInfo.getProperty( "DisplayName" ) != null ) {
      return value["DisplayName"] as String;
    }

    return getDisplayName(value);
  }

  /**
   * If given value is a non null date returns just the date (not the time part) formatted
   * using the short format given in localization.xml. Otherwise returns the empty string
   */
  public static function renderDate(value : Bean) : String {
    if (value == null || !(value typeis DateTime)) {
      return "";
    }
    return gw.api.util.StringUtil.formatDate(value as DateTime, "short");
  }

  /**
   * If given value is a non null date returns just the time (not the date part) formatted
   * using the short format given in localization.xml. Otherwise returns the empty string
   */
  public static function renderTime(value : Bean) : String {
    if (value == null || !(value typeis DateTime)) {
      return "";
    }
    return gw.api.util.StringUtil.formatTime(value as DateTime, "short");
  }

  public static function getPropertyValue( root : Bean, strProperty : String ) : Bean {
    if( root == null ) {
      return null;
    }
    return (typeof root).TypeInfo.getProperty( strProperty ) != null
           ? root[strProperty]
           : null;
  }


  public static function getDisplayName( bean : Bean ) : String
  {
    if( bean == null )
    {
      return "";
    }

    if( java.lang.Number.Type.isAssignableFrom( typeof bean ) )
    {
      return (bean as Number).isNaN() ? "" : bean as String;
    }

    if( bean typeis String )
    {
      return bean;
    }

    var strTypeName = (typeof bean).RelativeName;

    switch( strTypeName )
    {
      case "Person":
      {
        var strDisplayName = "" ;
        if ((bean["FirstName"] as String).HasContent) {
          strDisplayName = strDisplayName + bean["FirstName"] + " ";
        }
        if ((bean["LastName"] as String).HasContent) {
          strDisplayName = strDisplayName + bean["LastName"] + " ";
        }
        if (bean["Suffix"] != null) {
          strDisplayName = strDisplayName + bean["Suffix"] + " ";
        }
        return strDisplayName;
      }

      case "Claim":
        return bean["ClaimNumber"] as String;

      case "ActivityPattern":
        return bean["Code"] as String;

      case "Address":
      {
        var sb = new java.lang.StringBuffer();
        if ((bean["AddressLine1"] as String).HasContent) {
          sb.append(bean["AddressLine1"]).append(" ");
        }
        if ((bean["AddressLine2"] as String).HasContent) {
          sb.append(bean["AddressLine2"]).append(" ");
        }
        if ((bean["AddressLine3"] as String).HasContent) {
          sb.append(bean["AddressLine3"]).append(" ");
        }
        if ((bean["City"] as String).HasContent) {
          sb.append(bean["City"]).append(" ");
        }
        if (bean["State"] != null) {
          sb.append(bean["State"]).append(" ");
        }
        if ((bean["PostalCode"] as String).HasContent) {
          sb.append(bean["PostalCode"]).append(" ");
        }

        var retString = sb.toString();
        if (not retString.HasContent) {
          retString = displaykey.Java.DisplayName.NewlyCreated;
        }

        return retString;
      }

      case "Catastrophe":
        return bean["CatastropheNumber"] + " - " + bean["Name"];

      case "EmploymentClass":
      {
        var retString = bean["ClassCode"] as String;
        if ((bean["Description"] as String).HasContent) {
          retString = retString + " - " + bean["Description"];
        }
        return retString;
      }

      case "Policy":
        return bean["PolicyNumber"] as String;

      case "PhysicalProperty":
      case "PolicyLocation":
      case "Property":
      {
        var retString = "";
        if ((bean["location"] as String).HasContent) {
          retString = retString + bean["location"] + " ";
        }
        if ((bean["buildingNumber"] as String).HasContent) {
          retString = retString + "(building: " + bean["buildingNumber"] + ") ";
        }
        var strAddress = getDisplayName(bean["address"]);
        if (strAddress.HasContent) {
          var wrapAddress = retString.HasContent;
          if (wrapAddress) {
            retString = retString + "(";
          }
          retString = retString + strAddress;
          if (wrapAddress) {
            retString = retString + ")";
          }
        }

        if (not retString.HasContent) {
          retString = displaykey.Java.DisplayName.NewlyCreated;
        }

        return retString;
      }

      case "PolicyProperty":
        return getDisplayName(bean["Property"]);

      case "StatCode":
      {
        var sb = new java.lang.StringBuffer();

        sb.append(bean["lineNumber"]).append(". ").append(bean["InsuranceLine"]).append(" / ").append(bean["InsuranceSubLine"]).append(" (");
        if ((bean["BuildingNumber"] as String).HasContent) {
          sb.append(bean["BuildingNumber"]);
        } else
        if ((bean["VehicleNumber"] as String).HasContent) {
          sb.append(bean["VehicleNumber"]);
        } else
        if ((bean["LocationNumber"] as String).HasContent) {
          sb.append(bean["LocationNumber"]);
        } else
        if ((bean["ClassCode"] as String).HasContent) {
          sb.append(bean["ClassCode"]);
        }
        sb.append( ")");

        return sb.toString();
      }

      case "User":
        return getDisplayName( bean["Contact"] );

      case "Vehicle":
      {
        var sb = new java.lang.StringBuffer();
        if ((bean["year"] as String).HasContent) {
        var strYear = bean["year"] + " ";
          sb.append(strYear);
        }
        if ((bean["make"] as String).HasContent) {
          sb.append(bean["make"]).append(" ");
        }
        if ((bean["model"] as String).HasContent) {
          sb.append(bean["model"]).append(" ");
        }
        if ((bean["licensePlate"] as String).HasContent) {
          sb.append("(").append(bean["licensePlate"]);
          if (bean["state"] != null) {
            sb.append(" / ").append(bean["state"]);
          }
          sb.append(")");
        }

        var retString = sb.toString();
        if (not retString.HasContent) {
          retString = displaykey.Java.DisplayName.NewlyCreated;
        }

        return retString;
      }

      case "Exposure":
      {
        var retString = "(" + bean["ClaimOrder"] + ") " + bean["Subtype"] + " - ";
        if (bean["lossParty"] != null) {
          retString = retString + bean["lossParty"];
        }
        return retString;
      }

      case "Coverage":
      {
        var retString = "";
        if (getDisplayName(bean["subType"]) == "PropertyCoverage") {
          retString = getDisplayName(bean["property"]);
        }
        if (getDisplayName(bean["SubType"]) == "VehicleCoverage") {
          retString = getDisplayName(bean["vehicle"]);
        }
        if (getDisplayName(bean["SubType"]) == "PolicyCoverage") {
          retString = "Policy Level Coverage";
        }
        return retString;
      }

      case "PolicyCoverage":
        return "Policy Level Coverage";

      case "VehicleCoverage":
        return getDisplayName( bean["Vehicle"] );

      case "PropertyCoverage":
        return getDisplayName( bean["Property"] );

      case "PolicyVehicle":
        return getDisplayName( bean["Vehicle"] );

      case "Activity":
        return bean["Subject"] as String;

      case "PropertyOwner":
      case "VehicleOwner":
        return getDisplayName( bean["lienholder"] );

      case "UserRoleAssignment":
        return getDisplayName( bean["role"] );

      case "Catastrophe":
        return bean["CatastropheNumber"] + " - " + bean["Name"];

      default:
         if( (typeof bean).TypeInfo.getProperty( "Name" ) != null )
         {
           return (bean["Name"] as String).HasContent ? bean["Name"] as String : "";
         }
         return bean as String;
    }
  }

}