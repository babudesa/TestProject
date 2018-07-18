package libraries

/**
 * A utility class for Claim assignments.
 */
@Export
class Claimassignment
{

  private construct()
  {
    // Enforces static only access
  }

 /**
  * Given a LossType and a ClaimSegment, returns a two GroupType options for Claim assignment in order
  * of preference.
  */
  static function getGroupTypeBasedOnClaimSegment(losstype : LossType, segment : ClaimSegment) : GroupType[]
  {
    var primaryGroupType : GroupType
    var secondaryGroupType : GroupType
    if (losstype == "AUTO")
    {
      if (segment == "auto_high")
      {
        primaryGroupType = "autocomplex"
        secondaryGroupType = "autonormal"
      }

      if (segment == "auto_mid")
      {
        primaryGroupType = "autonormal"
        secondaryGroupType = "autocomplex"
      }
      if (segment == "auto_low")
      {
        primaryGroupType = "autofasttrack"
        secondaryGroupType = "autonormal"
      }
    }

    if (losstype == "pr")
    {
      if (segment == "prop_high")
      {
        primaryGroupType = "propcomplex"
        secondaryGroupType = "propnormal"
      }

      if (segment == "prop_mid")
      {
        primaryGroupType = "propnormal"
        secondaryGroupType = "propcomplex"
      }
      if (segment == "prop_low")
      {
        primaryGroupType = "propfasttrack"
        secondaryGroupType = "propnormal"
      } 
    }

    if (losstype == "gl")
    {
      if (segment == "liab_high")
      {
        primaryGroupType = "lbltycomplex"
        secondaryGroupType = "lbltynormal"
      }

      if (segment == "liab_mid")
      {
        primaryGroupType = "lbltynormal"
        secondaryGroupType = "lbltycomplex"
      }
      if (segment == "liab_low")
      {
        primaryGroupType = "lbltyfasttrack"
        secondaryGroupType = "lbltynormal"
      }
    }
    if (losstype == "WC")
    {
      if (segment == "wc_med_only")
      {
        primaryGroupType = "wc_med_only"
        secondaryGroupType = "wc_normal"
      }

      if (segment == "wc_lost_time")
      {
        primaryGroupType = "wc_lost_time"
        secondaryGroupType = "wc_normal"
      }
      if (segment == "wc_liability")
      {
        primaryGroupType = "wc_lost_time"
        secondaryGroupType = "wc_normal"
      }
    }
    if (losstype == "TRAV" )
    {
      if (segment == "travel_low")
      {
        primaryGroupType = "travel"
        secondaryGroupType = "travel"
      }

      if (segment == "travel_mid")
      {
        primaryGroupType = "travel"
        secondaryGroupType = "travel"
      }
      if (segment == "travel_high")
      {
        primaryGroupType = "travel"
        secondaryGroupType = "travel"
      }
    }
    return new GroupType[] {primaryGroupType, secondaryGroupType}
  }

}
