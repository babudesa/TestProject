package libraries

@Export
enhancement PolicyUI : entity.Policy
{
  /*
   * Used by the EditableVehicleCoveragesLV list view to decide whether PIP specific fields should
   * be available
   */
  function isPIPCoverageType(type : CoverageType) : boolean {
    return type == "PIP" 
      || type == "PIPMED"
      || type == "PIPIL" 
      || type == "PIPDTH"
      || type == "PIPFUN"
      || type == "PIPRHB"
      || type == "PIPEXMED"
      || type == "PIPADD"
  }
}