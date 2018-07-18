package libraries.Exposure_Entity

enhancement PIPBenefitCollected : entity.Exposure {
  public function isSSBenefits () : String {
  // This function is used to return the condition that will either enable fields and make them required or disable fields.
  // Used in the Wage Benefits screen for PIP Damages
  return (this.SSBenefit == true) as java.lang.String
  }


  public function isWageBenefits () : String {
  // This function is used to return the condition that will either enable fields and make them required or disable fields.
  // Used in the Wage Benefits screen for PIP Damages
  return (this.WageBenefit == true) as java.lang.String
  }


  public function isWorkersCompBenefits () : String {
  // This function is used to return the condition that will either enable fields and make them required or disable fields.
  // Used in the Wage Benefits screen for PIP Damages
  return (this.WCBenefit == true) as java.lang.String
  }
}
