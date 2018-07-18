package libraries.Contact_Entity

enhancement AgencyProfitCenter : entity.Contact {
  function setAgencyProfitCenter(Claim:Claim)
  {
    if(Claim.Policy.LossType == "EQUINE"){  //only set profit center for equine
      this.ex_Agency.ex_AgencyProfitCenter = "3550"
    }
  }
}
