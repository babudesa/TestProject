package gw.entity
uses java.util.HashMap

@Export
enhancement GWExposureTierEnhancement : entity.Exposure {
  
  function setExposureTier() : void {
    switch (this.Claim.Policy.PolicyType) {
      case "auto_per":
      case "auto_comm":
      case "homeowners":
      case "prop_comm":
        setAutoPropertyExposureTier()
        break
       case "comp":
        setWCExposureTier()
        break  
       case "travel_per":
        setTravelExposureTier()
        break  
      default:
        setOtherPolicyTypesExposureTier()
    }
  }
  
  private function setWCExposureTier() : void {
    switch (this.CoverageSubType) {
      case "wm_wcid":
        this.ExposureTier = "medical"
        break
      case "wi_lw":
        this.ExposureTier = "indemnity"
        break
      case "wl_el":
        this.ExposureTier = "el"
        break
    }
  }

  private function setAutoPropertyExposureTier() : void {
    var tierByCoverageSubtype = new HashMap<CoverageSubtype,ExposureTier>() {
      "abi_bid" -> "3p_med_low",
      "ant_lud" -> "lossofuse",
      "apd_pd" -> "3p_pd_low",
      "apd_vd" -> "3p_pd_low",
      "bldg_pd" -> "1p_sd_low",
      "BUSLOSTINC_lud" -> "lossofuse",
      "coll_vd" -> "1p_pd_low",
      "comp_vd" -> "1p_pd_low",
      "cont_ppd" -> "1p_content_low",
      "ppd_ppd" -> "1p_content_low",
      "debrmv_lud" -> "lossofuse",
      "dwl_pd" -> "1p_sd_low",
      "erthqkcbldg_pd" -> "1p_sd_low",
      "erthqkccont_ppd" -> "1p_content_low",
      "erthqkdwl_pd" -> "1p_sd_low",
      "erthqkos_pd" -> "1p_sd_low",
      "erthqkppd_ppd" -> "1p_content_low",
      "EXTEXP_lud" -> "lossofuse",
      "fldcbldg_pd" -> "1p_sd_low",
      "fldccont_ppd" -> "1p_content_low",
      "flddwl_pd" -> "1p_sd_low",
      "fldos_pd" -> "1p_sd_low",
      "fldppd_ppd" -> "1p_content_low",
      "garkeeper_vd" -> "3p_pd_low",
      "hiredabi_bid" -> "3p_med_low",
      "hiredapd_pd" -> "3p_pd_low",
      "hiredapd_vd" -> "3p_pd_low",
      "hiredcoll_vd" -> "1p_pd_low",
      "hiredcomp_vd" -> "1p_pd_low",
      "hiredspecperil_vd" -> "1p_pd_low",
      "hiredudim_bid" -> "1p_med_low",
      "hiredum_bid" -> "1p_med_low",
      "hiredum_vd" -> "1p_pd_low",
      "LEASEINT_lud" -> "lossofuse",
      "lglliab_pd" -> "3p_pd_low",
      "lglliab_ppd" -> "3p_pd_low",
      "liabmp_mp" -> "3p_med_low",
      "lu_lud" -> "lossofuse",
      "mld_pd" -> "1p_sd_low",
      "mpay_mp" -> "1p_med_low",
      "nonownedabi_bid" -> "3p_med_low",
      "nonownedapd_pd" -> "3p_pd_low",
      "nonownedpd_vd" -> "3p_pd_low",
      "ordcovA_pd" -> "1p_sd_low",
      "ordcovB_pd" -> "1p_sd_low",
      "ordcovC_pd" -> "1p_sd_low",
      "os_pd" -> "1p_sd_low",
      "otdrplnts_lud" -> "lossofuse",
      "pip_med" -> "1p_med_low",
      "pip_pipd" -> "1p_med_low",
      "pipadd_pipd" -> "1p_med_low",
      "pipdth_pipd" -> "1p_med_low",
      "pipexmed_pipd" -> "1p_med_low",
      "pipfun_pipd" -> "1p_med_low",
      "pipil_pipd" -> "1p_med_low",
      "pipmed_pipd" -> "1p_med_low",
      "pipadd_pipd" -> "1p_med_low",
      "piprhb_pipd" -> "1p_med_low",
      "pli_pd" -> "3p_pd_low",
      "poll_bid" -> "3p_med_low",
      "poll_pd" -> "3p_pd_low",
      "rental_vd" -> "Rental",
      "sgn_pd" -> "1p_sd_low",
      "speccauseofloss_vd" -> "1p_pd_low",
      "spoil_ppd" -> "1p_content_low",
      "spp_ppd" -> "1p_content_low",
      "tbi_lud" -> "lossofuse",
      "towlabor_Towlabor" -> "Towing",
      "udim_bid" -> "1p_med_low",
      "udim_vd" -> "1p_pd_low",
      "uim_bid" -> "1p_med_low",
      "uim_vd" -> "1p_pd_low",
      "watercraft_gd"-> "3p_pd_low"
    }
    this.ExposureTier = tierByCoverageSubtype[this.CoverageSubType]

    if (this.InjuryIncident.ComplexInjury
            or this.VehicleIncident.TotalLoss
            or this.Claim.IsVeryComplexProperty
            or this.Claim.IsComplexProperty) {
      var lowToHigh = new HashMap<ExposureTier,ExposureTier>() {
        "1p_pd_low" -> "1p_pd_high",
        "1p_med_low" -> "1p_med_high",
        "1p_sd_low" -> "1p_sd_high",
        "1p_content_low" -> "1p_content_high",
        "3p_pd_low" -> "3p_pd_high",
        "3p_med_low" -> "3p_med_high"
      }
      if (lowToHigh.containsKey(this.ExposureTier)) {
        this.ExposureTier = lowToHigh[this.ExposureTier]
      }
    }
  }

  private function setTravelExposureTier() : void {
    if (this.ExposureType== "VehicleDamage"
            or this.ExposureType== "PropertyDamage"
            or this.ExposureType== "PersonalPropertyDamage"
            or this.ExposureType== "PIPDamages"
            or this.Incident.Severity == "severe-gen"
            or this.Incident.Severity == "major-gen"
            or this.InjuryIncident.Severity == "major-injury"
            or this.InjuryIncident.Severity == "severe-injury"
            or this.InjuryIncident.Severity == "fatal") {
      this.ExposureTier = "high"
    } else if (this.ExposureType =="MedPay"
            or this.Incident.Severity == "moderate-gen") {
      this.ExposureTier = "medium"
    } else {
      this.ExposureTier = "low"
    }
  }

  private function setOtherPolicyTypesExposureTier() : void {
    switch (this.CoverageSubType) {
      case "terr_gd":
      case "farm_bid":
      case "forgandalt_gd":
      case "acctrec_gd":
      case "pollliab_mp":
         this.ExposureTier = "high"
         break
      case "prdcompopr_mp":
      case "constbldrrisk_pd":
      case  "undstrg_bid":
      case  "constrinstltnrisk_pd":
          this.ExposureTier = "medium"
          break
      default:
          this.ExposureTier = "low"
          
    }
    if (this.ExposureTier != "high"
            and (this.InjuryIncident.ComplexInjury
                    or this.Claim.IsVeryComplexProperty
                    or (this.Incident.Subtype == "Incident" and (this.Incident.Severity == "severe-gen")))) {
      this.ExposureTier = "high"        
    }
    if (this.ExposureTier == "low"
            and ((this.Incident.Subtype == "Incident" and this.Incident.Severity =="major-gen")
                    or (this.LossParty =="third_party" and this.Claim.Policy.PolicyType == "businessowners")
                    or this.Claim.IsComplexProperty
                    or this.VehicleIncident.TotalLoss)) {
        this.ExposureTier = "medium"
    }  
  }
}
