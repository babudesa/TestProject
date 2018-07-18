package gw.entity

@ReadOnly
enhancement GWClaimEnhancement : entity.Claim {
  
  /**
   * Returns all the contacts on any part of the claim that have the listed roles.  Different
   * from getClaimContactsByRoles which only searches the claim as the role owner.
   */
  function getAllContactsWithRoles(roles : List<ContactRole>) : ClaimContact[] {
    return this.Contacts.where( \ c -> c.Roles.hasMatch( \ ccr -> roles.contains(ccr.Role) ) ) 
  }
  
  // Valid topic values are in the NoteTopicType typelist
  function getAllNotesWithTopic( topic : NoteTopicType) : NoteQuery {
    return this.Notes.where( \ aNote -> aNote.Topic == topic ) as entity.NoteQuery
  }

  /**
   * Returns all notes with the specified note topic and subject.
   */
  function getAllNotesWithTopicAndSubject( topic : NoteTopicType, subject : String) : NoteQuery {
    return this.Notes.where( \ aNote -> aNote.Topic == topic and aNote.Subject == subject  ) as entity.NoteQuery
  }

  function getCompensableActivity() : Activity {
    return this.Activities.firstWhere(\ a -> a.ActivityPattern.Code == "claim_acceptance" and a.Status == "open")
  }

  function getCompensableDocument() : String {
    var docName : String = null;
    var dayOfLoss = this.LossDate.trimToMidnight()
    var denialPeriod = find (var DenialPeriodData in WCDenialPeriod
            where DenialPeriodData.JurisdictionState == this.JurisdictionState
              and (DenialPeriodData.EffectiveDate <= dayOfLoss or DenialPeriodData.EffectiveDate == null)
              and (DenialPeriodData.ExpiryDate >= dayOfLoss or DenialPeriodData.ExpiryDate == null))
            .getAtMostOneRow()
    if (denialPeriod != null) {
      if (this.Compensable == "accepted") {
        docName = denialPeriod.AcceptDocumentTemplate
      } else if (this.Compensable == "denied") {
        docName = denialPeriod.RejectDocumentTemplate;
      }
    }  
    return docName;
  }

  function getDeductibles() : Deductible[] {
    var coverages : Coverage[]
    var results = new java.util.ArrayList<Deductible>()
  
    //sorting the coverages by RiskUnit+CoverageType aphabetically
    coverages = this.Policy.Vehicles*.Coverages.sortBy( \ r -> r.DisplayName + r.Type )
    for (coverage in coverages) {
      if (coverage.ClaimDeductible != null) {
        results.add(coverage.ClaimDeductible)
      }
    }
    coverages = this.Policy.Coverages.sortBy( \ p -> p.DisplayName + p.Type  )
    for (coverage in coverages) {
      if (coverage.ClaimDeductible != null) {
        results.add(coverage.ClaimDeductible)
      }
    }
  
    return results.toTypedArray()
  }
  
  static function queryClaimByClaimNumber(claimNumber : String) : Claim {
    var cl = find(c in Claim where c.ClaimNumber==claimNumber).AtMostOneRow
    return cl 
  }
  
}