package gw.command
uses gw.api.util.DisplayableException

class SetClaimNumber extends BaseCommand {

  /**
   * To use: "Run SetClaimNumber to 123-45-678901"
   */
  function to() {
     var claim = TopLocation.getVariable("Claim").Value
     if (claim typeis Claim) {
       claim.ClaimNumber = Argument
       claim.ClaimInfo.ClaimNumber = Argument
       claim.Bundle.commit()
     } else {
       throw new DisplayableException("Expected Claim but found " + typeof claim);
     }
  }

}
