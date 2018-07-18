package libraries.Coverage_Entity

enhancement CoverageUtil : entity.Coverage {

   public function setClassDefaults() {
    if(!this.Policy.Verified) {
      switch(this.Policy.Claim.LossType) {
        case "AGRIPROPERTY":
          this.ClassCodeExt = "0687"
          this.ClassCodeDescExt = "Property - Claims Unverified Policy" 
          break;
        case "AGRILIABILITY": case "EXCESSLIABILITY": case "EXCESSLIABILITYAUTO": case "AGRIXSUMBAUTO": case "AGRIXSUMBLIAB":
          this.ClassCodeExt = "88442"
          this.ClassCodeDescExt = "Liability - Claims Unverified Policy" 
          break;
        case "AGRIAUTO": case "PERSONALAUTO" : case LossType.TC_ALTMARKETSAUTO : case LossType.TC_SHSAUTO : case LossType.TC_TRUCKINGAUTO :
          this.ClassCodeExt = "739130"
          this.ClassCodeDescExt = "Automobile - Claims Unverified Policy" 
          break;
        case "EQUINE":
          this.ClassCodeExt = "953"
          this.ClassCodeDescExt = "Equine - Claims Unverified Policy"
          break;
        case "FIDCRIME":
          this.ClassCodeExt = "802"
          this.ClassCodeDescExt = "Fidelity and Crime - Claims Unverified Policy"
          break;
        case "PIMINMARINE":
          if (this.SublineExt=="010" || this.SublineExt=="090") {
            this.ClassCodeExt = "0687"
            this.ClassCodeDescExt = "Property - Claims Unverified Policy" 
          } else if (this.SublineExt=="920" || this.SublineExt=="930") {
            this.ClassCodeExt = "836"
            this.ClassCodeDescExt = "Inland Marine - Claims Unverified Policy"
          } else if (this.SublineExt == "970") {
            this.ClassCodeExt = "020"
            this.ClassCodeDescExt = "Equipment Breakdown - Claims Unverified Policy"
          } else if (this.SublineExt == "0") {
            this.ClassCodeExt = ""
            this.ClassCodeDescExt = ""
          } else {  
            this.ClassCodeExt = "(none)"
            this.ClassCodeDescExt = "(none)"
          }
          break;
        case "EXECLIABDIV": case "PROFLIABDIV": case "ENVLIAB":
          if(this.Type==CoverageType.TC_FC_EMPDISHBLK){
            this.ClassCodeExt = "802"
            this.ClassCodeDescExt = "Fidelity - Claims Unverified Policy" 
          } else {  
            this.ClassCodeExt = "88442"
            this.ClassCodeDescExt = " Liability - Claims Unverified Policy"
          }
          break;
        case "MERGACQU" :
            this.ClassCodeExt = "44444"
            this.ClassCodeDescExt = "All Others - NOC"
            break;
        case "SPECIALHUMSERV" :
            this.ClassCodeExt = "88442"
            this.ClassCodeDescExt = " Liability - Claims Unverified Policy"
            break
        case "SPECIALTYES" :
          if(this.Type == CoverageType.TC_SP_MTPFLTUILOBMTPFLTR or this.Type == CoverageType.TC_SP_MTPFLTRMANU){
            this.ClassCodeExt = "798"
            this.ClassCodeDescExt = "Miscellaneous - N.O.C."
          } else{
            this.ClassCodeExt = "88442"
            this.ClassCodeDescExt = " Liability - Claims Unverified Policy"
          }
            break
        case "COMMBONDS": case "OMAVALON":
            this.ClassCodeExt = "802"
            this.ClassCodeDescExt = "Surety - Claims Unverified Policy"
            break
        case "KIDNAPRANSOM":
            this.ClassCodeExt = "0559"
            this.ClassCodeDescExt = "Fidelity and Crime - Claims Unverified Policy"
            break;
        case "PIMINMARINEWC": case "PIMINMARINEEL": case "SPECIALTYESWC": case "SPECIALTYESEL": 
        case "STRATEGICCOMPWC": case "STRATEGICCOMPEL": case "TRUCKINGWC": case "TRUCKINGEL": 
        case "ALTMARKETSWC": case "ALTMARKETSEL": case "AGRIWC": case "AGRIEL": 
        case "OMWC": case "OMEL": case "ECUWC": case "ECUEL":
            this.ClassCodeExt = "5959"
            this.ClassCodeDescExt = "Workers' Compensation - Claims Unverified Policy"
            //11.6.15 - cmullin - Subline will default to 810 for all WC coverages.
            this.SublineExt = "810"
            break;
        case "AVIATION" :
            this.ClassCodeExt = "0"
            this.ClassCodeDescExt = "None"
            break;
        default:
          this.ClassCodeExt = "0000"
          this.ClassCodeDescExt = "Claims Unverified Policy"
          break;
      }
    }
  }


 
  public function isLegalForReconnect(exp : Exposure) : boolean{
    var legalValueFlag = false;
    if(exp.FixedPropertyIncident.Property == null){
      legalValueFlag = true;
    }
    else if(this.Subtype == "PropertyCoverage" and exp.FixedPropertyIncident.Property == ((this as PropertyCoverage).RiskUnit as LocationBasedRU).Property
      or this.Subtype == "PolicyCoverage"){
        legalValueFlag = true;
    }

    return legalValueFlag;
  }


  // 3/23/2009 - zjthomas - Defect 1422, Only set risk state to insured&apos;s primary address state 
  // if insured primary address country is United States.
  public function setRiskState(){
    if(this.Policy.insured.PrimaryAddress.Country == "US" || this.Policy.insured.PrimaryAddress.Country == "CA"){
      if(this.Subtype=="PolicyCoverage"){
        this.State = this.Policy.insured.PrimaryAddress.State
      } else if(this.Subtype=="PropertyCoverage"){
        if(((this as PropertyCoverage).RiskUnit as LocationBasedRU).Property.Address.State!=null and
           ((this as PropertyCoverage).RiskUnit as LocationBasedRU).Property.Address.State.hasCategory(Country.TC_US) ){
          this.State=((this as PropertyCoverage).RiskUnit as LocationBasedRU).Property.Address.State
        } else {
          this.State = this.Policy.insured.PrimaryAddress.State
        }
      } else if(this.Subtype=="VehicleCoverage"){
        if(((this as VehicleCoverage).RiskUnit as VehicleRU).Vehicle.State!=null and
           ((this as VehicleCoverage).RiskUnit as VehicleRU).Vehicle.State.hasCategory(Country.TC_US)){
          this.State=((this as VehicleCoverage).RiskUnit as VehicleRU).Vehicle.State
        } else {
          this.State = this.Policy.insured.PrimaryAddress.State
        }
      }
    } else {
      if(this.Subtype=="PolicyCoverage"){
        this.State = null
      } else if(this.Subtype=="PropertyCoverage"){
        if(((this as PropertyCoverage).RiskUnit as LocationBasedRU).Property.Address.State!=null and
           ((this as PropertyCoverage).RiskUnit as LocationBasedRU).Property.Address.State.hasCategory(Country.TC_US)){
          this.State=((this as PropertyCoverage).RiskUnit as LocationBasedRU).Property.Address.State
        } else {
          this.State = null
        }
      } else if(this.Subtype=="VehicleCoverage"){
        if(((this as VehicleCoverage).RiskUnit as VehicleRU).Vehicle.State!=null and
           ((this as VehicleCoverage).RiskUnit as VehicleRU).Vehicle.State.hasCategory(Country.TC_US)){
          this.State=((this as VehicleCoverage).RiskUnit as VehicleRU).Vehicle.State
        } else {
          this.State = null
        }
      }
    }
  }
}
