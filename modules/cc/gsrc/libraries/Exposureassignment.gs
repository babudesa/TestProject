package libraries

/**
 * A utility class for Exposure assignments.
 */
@Export
class Exposureassignment
{
  private construct()
  {
    // Enforces static only access
  }

 /**
  * Given a LossType and a ClaimSegment, returns a two GroupType options for Exposure assignment
  * in order of preference.
  */
  static function getGroupTypeBasedOnExpSegment(lossType : LossType, segment : ClaimSegment) : GroupType[]
  {
    var primaryGroupType : GroupType
    var secondaryGroupType : GroupType
    if (lossType == "AUTO")
    {
      if (segment == "auto_high")
      {
        primaryGroupType = "lbltycomplex"
        secondaryGroupType = "lbltynormal"
      }

      if (segment == "auto_mid")
      {
        primaryGroupType = "lbltynormal"
        secondaryGroupType = "lbltycomplex"
      }
      if (segment == "auto_low")
      {
        primaryGroupType = "lbltyfasttrack"
        secondaryGroupType = "lbltynormal"
      }
    }
    return new GroupType[] {primaryGroupType, secondaryGroupType}
  }
}
