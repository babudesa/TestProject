package gw.entity
uses gw.api.util.Logger

@Export
enhancement GWSubroNonFinancialClaimEnhancement : entity.Claim
{
  function AdversePartyLiabilityPercent() : Number{
    var   TotalExpLiability : Number = 0

    for (thisParty in this.SubrogationSummary.SubroAdverseParties) {
      if (thisParty.Fault != Null) {
        TotalExpLiability = TotalExpLiability +  thisParty.Fault as java.lang.Double
      }
    }


    return TotalExpLiability
  }

  function AdversePartyExpectedRecoveryPercent() : Number{
    var TotalExpectedRecovery : Number = 0
    com.guidewire.pl.system.gosu.GWEnvironmentLibrary.instance().getEnv()

    for (thisParty in this.SubrogationSummary.SubroAdverseParties) {
      if (thisParty.expectedrecovery != Null) {

        TotalExpectedRecovery = TotalExpectedRecovery + thisParty.expectedrecovery as java.lang.Double
      }
    }

    return TotalExpectedRecovery
  }

  function SubroIsGovernmentInvolved() : SubroGovernmentInvolved {

    if (Exists (aAdverseParty in this.SubrogationSummary.SubroAdverseParties where aAdverseParty.SubroGovernmentInvolved == "gov")) {
      return "gov"
    }
     return "nongov"

  }

   function ActivateSubroModule() : Boolean {
    var ActivateModule : Boolean = false 
    if (this.SubrogationStatus == "open" or this.SubrogationStatus == "review"
      or this.SubrogationSummary.SubroAdverseParties.length > 0
      or (this.FaultRating == "1" and (this.Fault != 100 and this.Fault != Null)) or this.FaultRating =="thirdparty") {
        ActivateModule = true
      }

    return ActivateModule 
  }

  function newSubroAdverseParty() : SubroAdverseParty {
    var newItem = new SubroAdverseParty(this) 
    this.SubrogationSummary.addToSubroAdverseParties(newItem)
    return newItem 
  }


  function getSubroNotes() :Note[] {
    var numberOfSubroNotes: int = 0
    var numberOfThisSubroNote: int = 0

    for (thisnote in this.Notes){
      if (thisnote.Topic =="subrogation") {
        numberOfSubroNotes = numberOfSubroNotes + 1
      }
    }

    var AllSubroNotes = new Note[numberOfSubroNotes]

    for (thisnote in this.Notes) {
      if (thisnote.Topic =="subrogation") {
        AllSubroNotes[numberOfThisSubroNote] = thisnote
        numberOfThisSubroNote = numberOfThisSubroNote + 1
      }
    }

    return AllSubroNotes
  }


  function getSubroMatters(): Matter[] {

    var numberOfSubroMatters: int = 0
    var numberOfThisSubroMatter: int = 0

    for (thisMatter in this.Matters) {
      if (thisMatter.SubroRelated == true) {
        numberOfSubroMatters = numberOfSubroMatters + 1
      }
    }

    var AllSubroMatters = new Matter[numberOfSubroMatters]

    for (thisMatter in this.Matters){
      if (thisMatter.SubroRelated == true) {
        AllSubroMatters[numberOfThisSubroMatter] = thisMatter
        numberOfThisSubroMatter = numberOfThisSubroMatter + 1
      }
    }

    return AllSubroMatters
  }


  function getPartiesInMatters() : String {
    // libraries.logger.logInfo( "Log Rule displaykey.DisplayName" + displaykey.Java.DisplayName.NewlyCreated)
    var PartiesInArbitration : String = "" 

    for (eachparty in this.SubrogationSummary.SubroAdverseParties)
      if (eachparty.Strategy =="arbitrate" or eachparty.Strategy == "lawsuit") {
        if  (PartiesInArbitration.length() > 0) {
          PartiesInArbitration = PartiesInArbitration + ", "
        }

        PartiesInArbitration = PartiesInArbitration + ((eachparty.AdverseParty.Thirdpartyinsurer == null ? "" : eachparty.AdverseParty.Thirdpartyinsurer + " on behalf of ") + eachparty.AdverseParty.DisplayName)
    }

    return PartiesInArbitration
  }


  function getAllAdversePartyRoles() :ClaimContactRole[] {

    //  libraries.logger.logInfo( "Log Rule Info sRule")
    //var AllAdverseRoles :	ClaimContactRole[]
    var numberOfAdverseRole: int = 0
    var ClaimAdverseRoles :	ClaimContactRole[]
    ClaimAdverseRoles = this.getClaimContactRolesByRole("adverseparty")
    //var ExpAdverseRoles :	ClaimContactRole[]
    var numRolesAdded : int

    //  Count the number of AdversePartyRoles on Claim
    if (ClaimAdverseRoles.length > 0) {
      Logger.logInfo( "ClaimAdverseRoles.Length" + ClaimAdverseRoles.length)
      numberOfAdverseRole = ClaimAdverseRoles.length
    }

    //  Count the number of AdversePartyRoles on Exposures

    for (exp in this.Exposures) {
      for (myrole in exp.getClaimContactRolesByRole("adverseparty")) {
        numberOfAdverseRole = numberOfAdverseRole + 1
      }
    }
    //  libraries.logger.logInfo( "ClaimAdverseRoles.Length" + numberOfAdverseRole)
    //  Add each claim-based AdversePartyRoles to the arrary

    var AllAdverseRoles = new ClaimContactRole[numberOfAdverseRole]
    for (myrole in this.getClaimContactRolesByRole("adverseparty") index i) {
      AllAdverseRoles[i] = myrole
    }

    if (ClaimAdverseRoles.length > 0) {
      numRolesAdded = ClaimAdverseRoles.length
    }

    //  Add exposure claim-based AdversePartyRoles to the arrary
    for (exp in this.Exposures) {
      for (myrole in exp.getClaimContactRolesByRole("adverseparty")) {
        AllAdverseRoles[numRolesAdded] = myrole
        numRolesAdded = numRolesAdded + 1
      }
    }

    return AllAdverseRoles
  }

}
