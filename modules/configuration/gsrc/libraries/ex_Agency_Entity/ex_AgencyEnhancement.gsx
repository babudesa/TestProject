package libraries.ex_Agency_Entity
uses gaic.plugin.cc.businessunit.SyncGAIBusinessUnitsBatch

enhancement ex_AgencyEnhancement : entity.ex_Agency {
  public function setBusinessUnitExtFromID(prmid:String, name:String):GAIBusinessUnitExt {
    var bu = find(var bu in GAIBusinessUnitExt where bu.PRM_ID == prmid).AtMostOneRow;
    if (bu == null) {
      bu = new GAIBusinessUnitExt(this);
      bu.PRM_ID = prmid;
      bu.Name = name;
      SyncGAIBusinessUnitsBatch.sendAddEmail(prmid+": "+name);
    }
    this.ProducingBusinessUnitExt = bu;
    return bu;
  }
}
