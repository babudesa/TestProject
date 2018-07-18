package util.gaic.subline;
uses com.gaic.integration.cc.plugins.gscript.subline.SublinePlugin;
uses org.omg.CosNaming._BindingIteratorImplBase
uses com.ibm.db2.jcc.c.tc

class Subline {

  public static function getSublineForCoverage(coverage: Coverage) : String {
    try { 
      if(coverage.State==null){
        return "0";
      } else {
        if (coverage.Policy.LossType == "EQUINE") {
          return "920";
         //Defect 7521: Crime Coverages
        }else if ( coverage.Policy.LossType == "EXECLIABDIV" or coverage.Policy.LossType == "PROFLIABDIV" or coverage.Policy.LossType == "SPECIALHUMSERV"){
            if(coverage.Type=="fc_EMPTHFTBKT"){
              return Subline.TC_965;
            } else if (coverage.Policy.PolicyType == PolicyType.TC_NLP or coverage.Policy.PolicyType ==  PolicyType.TC_NLX 
                or coverage.Policy.PolicyType == PolicyType.TC_CLP or coverage.Policy.PolicyType == PolicyType.TC_CLX) {
              return Subline.TC_325
            } else{
              return Subline.TC_317;
            }
        }else if ((coverage.Policy.LossType == LossType.TC_EXECLIABDIV or coverage.Policy.LossType == LossType.TC_PROFLIABDIV) and 
         coverage.Policy.PolicyType == PolicyType.TC_NLP or
         coverage.Policy.PolicyType == PolicyType.TC_CLP or
         coverage.Policy.PolicyType == PolicyType.TC_NLX or
         coverage.Policy.PolicyType == PolicyType.TC_CLX){
           return Subline.TC_325;
        }
        else if(coverage.Policy.LossType == LossType.TC_MERGACQU){
          if(coverage.Type == CoverageType.TC_EL_MISCLIAB or coverage.Type == CoverageType.TC_MA_BUYREPWARR or coverage.Type == CoverageType.TC_MA_SELLREPWARR or
             coverage.Type == CoverageType.TC_MA_SPECIFICLIT or coverage.Type == CoverageType.TC_MA_TAXCREDINDEM or coverage.Type == CoverageType.TC_MA_TAXINDEM){
               return Subline.TC_334;
          }else{
            return Subline.TC_325;
          }
        }
        else if (coverage.Policy.LossType == "ENVLIAB" and coverage.Policy.PolicyType != "EEL"){
          return Subline.TC_350;
        }
        else if (coverage.Policy.LossType == "ENVLIAB" and coverage.Policy.PolicyType == "EEL"){
          return Subline.TC_325;
        } 
        else if (coverage.Policy.LossType == "PIMINMARINE" and (coverage.Type == "im_IMMTC_truckcargo" or coverage.Type =="im_IMMTC_manu" or coverage.Type == CoverageType.TC_IM_IMCEUILOB or
                coverage.Type == CoverageType.TC_SP_MTPFLTUILOBMTPFLTR or coverage.Type == CoverageType.TC_SP_MTPFLTRMANU)){
          return Subline.TC_920;
        }
        else if ( coverage.Policy.Claim.LossType == "EXCESSLIABILITY" || coverage.Policy.Claim.LossType == "EXCESSLIABILITYAUTO"
          || coverage.Policy.Claim.LossType == "AGRIXSUMBAUTO" || coverage.Policy.Claim.LossType == "AGRIXSUMBLIAB"){
          return Subline.TC_496 as java.lang.String;
        } else if (coverage.Policy.Claim.LossType == LossType.TC_SPECIALTYES 
                    &&(coverage.Type == CoverageType.TC_EX_UMBRELLA || coverage.Type == CoverageType.TC_EX_LEADEXCESS
                      || coverage.Type == CoverageType.TC_EX_LAYEREDEXCESS || coverage.Policy.PolicyType == PolicyType.TC_PRX)){
           return Subline.TC_325             
        } else if (coverage.Policy.PolicyType == "CA" || coverage.Policy.PolicyType == "CS" || coverage.Policy.PolicyType == "MS" || coverage.Policy.PolicyType == "OMS"){
         return Subline.TC_002 as java.lang.String 
        }
        else if(coverage.Policy.PolicyType == "CRP"){
         return Subline.TC_001 as java.lang.String 
        }
        else if(coverage.Type == CoverageType.TC_FC_SAAFRAUDINDPW){
          return Subline.TC_001 as java.lang.String 
        }
        else if ( coverage.Policy.LossType == "PERSONALAUTO" || coverage.Policy.Claim.LossType == "AVIATION"){
          return Subline.TC_NR;
        }
        else if ( coverage.Policy.Claim.LossType == "AGRILIABILITY" and coverage.Type == CoverageType.TC_AB_FGL_ELECDATA){
          return Subline.TC_325
        }
        else if ( (coverage.Policy.Claim.LossType == "AGRILIABILITY" and coverage.Type == CoverageType.TC_AB_FGL_LTDPRODWD) || coverage.Policy.PolicyType == PolicyType.TC_PRC){
          return Subline.TC_365
        }
        else if ( coverage.Policy.Claim.LossType == "AGRILIABILITY" and coverage.Type == CoverageType.TC_AB_STOPGAP){
          return Subline.TC_337
        }
         else {
          return SublinePlugin.getInstance().searchSubline(coverage);
        }
      }
    } catch (e) {
      gw.api.util.Logger.logError( e as java.lang.String );
      throw e;
    }
  }
  
  public static function checkAFPLossCauseRequired(coverage: Coverage):boolean{
	var result : boolean;
	if(coverage.Type=="ab_FPA_quake" ||
	   coverage.Type=="ab_FPB_quake" ||
	   coverage.Type=="ab_FPC_quake" ||
	   coverage.Type=="ab_FPD_quake" ||
	   coverage.Type=="ab_FPE_quake" ||
	   coverage.Type=="ab_FPF_quake" ||
	   coverage.Type=="ab_FPG_quake" ||
	   coverage.Type=="ab_FPAD_mine" ||
	   coverage.Type=="ab_FPG_mine"  ||
	   coverage.Type=="ab_FPE_cab_gl" ||
	   coverage.Type=="ab_FPF_cab_gl" ||
	   coverage.Type=="ab_SCPROP_camera" ||
	   coverage.Type=="ab_SCPROP_coins" ||
	   coverage.Type=="ab_SCPROP_finearte" ||
	   coverage.Type=="ab_SCPROP_finearti" ||
	   coverage.Type=="ab_SCPROP_furs" ||
	   coverage.Type=="ab_SCPROP_golfequip" ||
	   coverage.Type=="ab_SCPROP_guns" ||
	   coverage.Type=="ab_SCPROP_jewelry" ||
	   coverage.Type=="ab_SCPROP_miscperprp" ||
	   coverage.Type=="ab_SCPROP_musicinst" ||
	   coverage.Type=="ab_SCPROP_silverware" ||
	   coverage.Type=="ab_SCPROP_sportequip" ||
	   coverage.Type=="ab_SCPROP_stamps" ||
	   coverage.Type=="ab_SPPER_scolrr" ||
	   coverage.Type=="ab_SPPER_llscol" ||
	   coverage.Type=="ab_SPPER_mhc" ||
	   coverage.Type=="ab_SPPER_collision" ||
	   coverage.Type=="ab_SPPER_ma" ||
	   coverage.Type=="ab_AQUA" ||
	   coverage.Type=="ab_FEB" ||
	   coverage.Type == "ab_poll_clnup_rmvl"||
	   coverage.Type=="ab_AGG_umb_liab" ||
	   coverage.Type==CoverageType.TC_AB_ORCHARDVINEYARD or
	   coverage.Policy.PolicyType != "AFP"){
	     result = false;
           } else {
	     result = true;
	   }
	return result;
  }
}