package gw.command

uses gw.api.util.DisplayableException

class CloseClaim extends BaseCommand {

  function withDefault() {
     var foundVar = TopLocation.getVariable("Claim")
     var claim = foundVar.Value
     if (claim typeis Claim) {
       if (!claim.Closed) {
           for (act in claim.Activities) {
             // print("found " + act.Status + " activity \"" + act.Subject + "\"")
             if (act.canSkip()) {
                act.skip()
             }
             else if (act.canComplete()) {
               act.complete()
             }
           }
           for (exp in claim.Exposures) {
             if (!exp.Closed) {
              exp.close("completed", "Forced close")
             }
           }
           for (matter in claim.Matters) {
             if (!matter.Closed) {
              matter.close("SO", "Forced close")
             }
           }
           if (claim.FaultRating == null || claim.FaultRating == "0") {
             claim.FaultRating = "nofault"
           }
           if (claim.SubrogationStatus == "open" or  claim.SubrogationStatus =="review") {
             claim.SubrogationStatus = "closed"
           }
           claim.close("completed", "Forced close")
           claim.Bundle.commit()
       }
     }
     else {
       throw new DisplayableException("Expected Claim but found " + typeof claim);
     }
  }

}
