package libraries.Claim_Entity

enhancement DateFunctions : entity.Claim {
  function get6monthExpDate(): DateTime
  {
    return gw.api.util.DateUtil.addMonths( this.LossDate, 6 )
  }
}
