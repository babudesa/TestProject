package libraries.Coverage_Entity
uses java.util.ArrayList;

enhancement CoverageFilter : entity.Coverage {
  //Sprint 11 Eric Rawe - completely changed 2/25/08 by Stephanie Przygocki to add in risk level
  //CoverageType.xml has been changed to add in Loss Type and Risk Type
  //Sprint 11 Stephanie Przygocki 9/4/09 CoverageFilter rewrite
  //9/19/11 erawe - Defect 4581 turn off coverages's Contractors Equipment and IMCE-Equipment leased or Rented from others
  // for Prod, Cert, UAT until they are ready for deployment.
  function getCoverages():List{
    var coverages:List = new ArrayList()
    var currentRiskType : gw.entity.TypeKey
    if(this.Subtype=="PolicyCoverage"){
      currentRiskType = RiskType.TC_POLICY
    } else if(this.Subtype=="PropertyCoverage"){
      currentRiskType = RiskType.TC_PROPERTY
    } else {
      currentRiskType = RiskType.TC_VEHICLE
    }
  
    if(gw.api.system.server.ServerUtil.getEnv() == "prod"or gw.api.system.server.ServerUtil.getEnv() == "cert"
    or gw.api.system.server.ServerUtil.getEnv() == "uat"){
      for(key in CoverageType.getTypeKeys(false)){
        if(key.hasCategory( this.Policy.Claim.LossType ) and
           key.hasCategory( this.Policy.PolicyType ) and
           key.hasCategory( currentRiskType )){
           coverages.add( key )
           // Defect - 5356 Removing the below two coverages from AFL policy 
           if(this.Policy.PolicyType == "AFL" and (key == "ab_AGG_umb_liab" || key == "ab_EQCCC")){
             coverages.remove(key)
           }
          
        }
      }
    }else{
      for(key in CoverageType.getTypeKeys(false)){
        if(key.hasCategory( this.Policy.Claim.LossType ) and
           key.hasCategory( this.Policy.PolicyType ) and
           key.hasCategory( currentRiskType )){
           coverages.add( key )
           // Defect - 5356 Removing the below two coverages from AFL policy 
           if(this.Policy.PolicyType == "AFL" and (key == "ab_AGG_umb_liab" || key == "ab_EQCCC")){
             coverages.remove(key)
           }
        }
      }
    }
     return coverages
  }

  static function getEngineCoverages():List{
    var coverages:List = new ArrayList()
    for(key in CoverageType.getTypeKeys(false)){
      if(key.hasCategory( RiskType.TC_ENGINE )){
        coverages.add(key)
      }
    }
    return coverages
  }

  function getTrailerCoverages():List{
    var coverages:List = new ArrayList()
    for(key in CoverageType.getTypeKeys(false)){
      if(key.hasCategory( RiskType.TC_TRAILER )){
        coverages.add(key)
      }
    }
    return coverages
  }
  
  function unusedDeductibles(): Boolean{
    for(tk in DeductApplicationExt.getTypeKeys(false)){
      if(!this.DeductiblesExt*.DeductLimitAppExt.hasMatch(\ x -> x == tk))
        return true
    }
    return false
  }
  
  function filterDeductibles(ded: DeductApplicationExt): Boolean{
    if(this.DeductiblesExt*.DeductLimitAppExt.hasMatch(\ x -> x == ded)){
      return false
    }
    return true
  }  
  
  function filterAggLimitBasis(limit : LimitBasisExt): Boolean{
    var limitBasis = {"AGGOTHAUTO", "AGGPOLGEN", "AGGPERCO", "AGGPERACC", 
    "AGGPDAYPAC", "AGGPMOPACC", "AGGPOLIPCO", "APL", "AGGPOLXPCO"
    ,"ANNUALAGG" ,"MAXPERIOD" ,"POL" ,"SPECITEM", "AGGICLMEXP"}
    if(this.CovLimitAppExt == this.AggLimitAppExt && this.CovLimitBasisExt == limit)
      return false     
    if(limitBasis.hasMatch(\ x -> x == limit.Code))
      return true
    return false
  }

  function filterCovLimitBasis(limit : LimitBasisExt): Boolean{
    var limitBasis = {"ADDTLCOST", "EACHACIDNT", "EACHDISABL", 
    "EADISABLEM", "EACHEMP", "EACHPERSN", "PERDAY", "PDAYPACC",
    "PERITEM", "LAWSUIT", "PMONTHPACC", "OCCAUTO", "PEROCCBI", "PEROCCSL", "OCCOTHAUTO",
    "PEROCCPD", "OCCPERADV", "PEROCC", "PERPERSN", "PWEEKPACC", "SPECITEM", "PERCLM",
    "FRHOUSCLM", "FUNGI"}
    if(this.CovLimitAppExt == this.AggLimitAppExt && this.AggLimitBasisExt == limit)
      return false 
    if(limitBasis.hasMatch(\ x -> x == limit.Code))
      return true
    return false
  }

  function filterAggLimitAppliesTo(limit : LimitApplicationExt): Boolean{
    var limitAppliesTo = {"ALLCOVPPTY", "ALLEMPLS", "ALLITEMS", 
    "ALLOSS", "BLANKET", "BIANDORPD", "EACHAUTO",
    "EACHOCC", "EACHPER", "EXCESSOF", "GENAGG", "PERPOLICY",
    "MAXPRITM", "PERDINDEM", "RECALLEXP", "RESPEXP", "SPECITEMS",
    "CLMEXP", "DAMAGES"}
    if(this.AggLimitBasisExt == this.CovLimitBasisExt && this.CovLimitAppExt == limit)
      return false     
    if(limitAppliesTo.hasMatch(\ x -> x == limit.Code))
      return true
    return false
  }

  function filterCovLimitAppliesTo(limit : LimitApplicationExt): Boolean{
    var limitAppliesTo = {"ADDTLCOST", "ALLPERSONS", "ANYONEEMPL", "ANYONEITM", 
    "ANYITMACQD", "ANYONELOSS", "BLANKET", "BIANDORPD", "BIEAACDNT",
    "BIEAPERS", "BYACDNT", "BYDISEASE", "DLRNTLEXP", "EACHACIDNT", "EACHAN", "ANM", 
    "EACHAUTO", "ECHCOMCUSE", "EACHHULL", "EACHLOC", "EACHLOCPRJ", "EACHLOSS", "EACHMTR", 
    "EACHOCC", "EAOCC", "EACHPER", "EACHPRJ", "EACHTRALR", 
    "MAXPRITM", "ANYONEPRS" , "PERDAY", "PEREMP", "PERITEM", "PERLOC", 
    "PERLOSS", "PERVEH", "PERPOLICY", "PERSCHED", "PERSCHDAMT", "PERTOOLBOX", "DISABLE", 
    "PERSACC", "PERSONALFX", "PERSPROP", "PSTCLSCOST", "PDEAACDNT", "REHABEXPEP", "RELOCATE", 
    "REPATRIATE", "SALARY", "SPECITEMS", "SPECPPTY", "SRVVRLOSEP", "WKLOSSEP", "POLUTNCND","CLSCOST",
    "PSTCLSCOST","EACHAEO", "CLMEXP", "DAMAGES", "MEDEXPBNEP", "WKLOSSEP", "FUNEXPEP"}
    if(this.AggLimitBasisExt == this.CovLimitBasisExt && this.AggLimitAppExt == limit)
      return false 
    if(limitAppliesTo.hasMatch(\ x -> x == limit.Code))
      return true
    return false
  }
  
  function validateCoverageLimit(): String {
    if(this.IncidentLimit != null && this.CovLimitBasisExt == null && this.CovLimitAppExt == null)
      return "'Basis' or 'Applies To' must have a value if Coverage Limit has been entered"
    return null
}
  
  function validateAggreateLimit(): String {
    if(this.AggregateLimitExt != null && this.AggLimitBasisExt == null && this.AggLimitAppExt == null)
      return "'Basis' or 'Applies To' must have a value if Aggregate Limit has been entered"    
    return null
  }

  function getEquipmentCoverages():List{
    var coverages:List = new ArrayList()
    for(key in CoverageType.getTypeKeys(false)){
      if(key.hasCategory( RiskType.TC_EQUIPMENT )){
        coverages.add(key)
      }
    }
    return coverages
  }
  
}
