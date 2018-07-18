package libraries

@Export
enhancement PolicySearchCriteria : entity.PolicySearchCriteria
{
  /**this method resets the fields on PolicySearchCriteria, add/remove fields for customization
    */
  function resetPolicySearchCriteria()
  {
    this.PolicyNumber = null;
    this.FirstName = null;
    this.LastName = null;
    this.CompanyName = null;
    this.PolicyType = User.util.getCurrentUser().PolicyType;
    this.LossDate = null;
    this.ClaimsMadeDateExt = null;
    this.TaxIdString = null;
    //this.City = null;
    this.InsuredAddress.City = null;
    this.InsuredAddress.State = null;
    this.InsuredAddress.PostalCode = null;
    this.InsuredAddress.Country = null;
    this.Vin = null;
  }

}