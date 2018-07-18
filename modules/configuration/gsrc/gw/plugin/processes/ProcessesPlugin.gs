package gw.plugin.processes
uses gw.plugin.processing.IProcessesPlugin
uses gw.processes.BatchProcess
uses gw.util.ClaimHealthCalculatorBatch
uses gw.util.PurgeMessageHistory
uses gw.util.CatastropheClaimFinderBatch
uses gw.processes.EscheatableImpl
uses gw.processes.PopulateClaimUpdateTime
uses gaic.plugin.cc.iso.ISOProcessAndSendBatch
uses gw.processes.ActivityGeneratorProcess
uses gw.processes.ConversionActivityGeneratorProcess
uses gw.processes.ManualSync
uses gw.processes.ELDClaimsReporting
uses gw.processes.ELDClaimsCorrections
uses gw.processes.SHSDOClaimsReporting
uses gw.processes.SHSDOClaimsCorrections
uses gw.processes.PLDClaimsCorrections
uses gw.processes.PLDClaimsReporting
uses gw.processes.ClaimsConversion
uses gw.processes.ClaimsConvFeature
uses gaic.plugin.cc.contact.AutoSyncUpdateBatch
uses gaic.plugin.cc.admin.ActivityCleanupFBatch
uses gaic.plugin.cc.admin.ActivityCleanupNFBatch
uses gw.processes.claimexportnote.ClaimExportNoteGeneratorProcess
uses gaic.plugin.cc.businessunit.SyncGAIBusinessUnitsBatch
uses gw.processes.wconetimeload.WcOneTimeClaimPolicyLoad
//uses util.gaic.EDWPush.EDWPushClaimAdd
uses util.gaic.EDWPayloadGen.EDWPayloadGenClaimConversion
uses util.gaic.EDWPush.CorporateAccountPolicy
uses gw.processes.CheckStatusReportProcess
uses util.gaic.EDWPayloadGen.EDWPayloadGenNotesConversion
//uses gw.processes.RefreshPolicyProcess
uses gw.processes.RefreshPolicyParallelProcess
uses gw.processes.DocumentStatusReportProcess
uses gw.processes.MAClaimsCorrections
uses gw.processes.MAClaimsReporting
uses gw.processes.DuplicateAddressNotification
uses util.gaic.EDWPush.EDWPushExposureChange
uses gw.processes.CustomScriptRunningProcess
uses gaic.plugin.cc.security.SyncSecurityZonesBatch
uses gw.processes.LitAdvisorFailureReportProcess
@Export
class ProcessesPlugin implements IProcessesPlugin {

  construct() {
  }

  override function createBatchProcess(type : BatchProcessType, arguments : Object[]) : BatchProcess {
    switch(type) {
      case BatchProcessType.TC_CLAIMHEALTHCALC:
        return new ClaimHealthCalculatorBatch();
      case BatchProcessType.TC_PURGEMESSAGEHISTORY:
        return new PurgeMessageHistory(arguments);
      case BatchProcessType.TC_CATASTROPHECLAIMFINDER:
        return new CatastropheClaimFinderBatch();
      case BatchProcessType.TC_ESCHEATABLEPROCESS:
        return new EscheatableImpl();
      case BatchProcessType.TC_ELDCLAIMSRPTGPROCESS:
        return new ELDClaimsReporting();
      case BatchProcessType.TC_ELDCLAIMSRPTGCORRECTIONS:
      	return new ELDClaimsCorrections();
      case BatchProcessType.TC_PLDCLAIMSRPTGCORRECTIONS:
      	return new PLDClaimsCorrections();
      case BatchProcessType.TC_PLDCLAIMSRPTGPROCESS:
        return new PLDClaimsReporting();
      case BatchProcessType.TC_MACLAIMSRPTGCORRECTIONS:
      	return new MAClaimsCorrections();
      case BatchProcessType.TC_MACLAIMSRPTGPROCESS:
        return new MAClaimsReporting();
      case BatchProcessType.TC_SHSDOCLAIMSRPTGCORRECTIONS:
      	return new SHSDOClaimsCorrections();
      case BatchProcessType.TC_SHSDOCLAIMSRPTGPROCESS:
        return new SHSDOClaimsReporting();
      case BatchProcessType.TC_CLAIMSCONVERSION:
      	return new ClaimsConversion();
      case BatchProcessType.TC_CLAIMSCONVFEATURE:
      	return new ClaimsConvFeature();
      case BatchProcessType.TC_POPULATECLAIMUPDATETIME:
        return new PopulateClaimUpdateTime();
      case BatchProcessType.TC_ISOPROCESSANDSEND:
        return new ISOProcessAndSendBatch();
      case BatchProcessType.TC_ACTIVITYGENERATOR:
        return new ActivityGeneratorProcess();
      case BatchProcessType.TC_CONVERSIONACTIVITYGENERATOR:
        return new ConversionActivityGeneratorProcess(); 
      case BatchProcessType.TC_MANUALSYNC:
        return new ManualSync();
      case BatchProcessType.TC_UPDATEAUTOSYNC:
        return new AutoSyncUpdateBatch();
      case BatchProcessType.TC_ACTIVITYCLEANUPF:
        return new ActivityCleanupFBatch();
      case BatchProcessType.TC_ACTIVITYCLEANUPNF:
        return new ActivityCleanupNFBatch();
      case BatchProcessType.TC_WCCLAIMEXPORTNOTE:
        return new ClaimExportNoteGeneratorProcess();
      case BatchProcessType.TC_SYNCGAIBUSINESSUNITS:
        return new SyncGAIBusinessUnitsBatch();
      case BatchProcessType.TC_WCONETIMECLAIMPOLICYLOAD:
        return new WcOneTimeClaimPolicyLoad();
      case BatchProcessType.TC_EDWCLAIMSPAYLOADGENERATION:
        return new EDWPayloadGenClaimConversion();
      case BatchProcessType.TC_EDWPUSHEXPOSURECHANGE:
        return new EDWPushExposureChange();
      case BatchProcessType.TC_EDWNOTESPAYLOADGENERATION:
        return new EDWPayloadGenNotesConversion();
      case BatchProcessType.TC_CORPORATEACCOUNTPOLICY:
        return new CorporateAccountPolicy();
      case BatchProcessType.TC_CHECKSTATUSREPORT:
        return new CheckStatusReportProcess()
      case BatchProcessType.TC_DOCUMENTSTATUSREPORT:
        return new DocumentStatusReportProcess()
      case BatchProcessType.TC_REFRESHPOLICY:
       // return new RefreshPolicyProcess()
         return new RefreshPolicyParallelProcess();
      case BatchProcessType.TC_DUPLICATEADDRESSNOTIFICATION:
        return new DuplicateAddressNotification();
      case BatchProcessType.TC_CUSTOMSCRIPTRUNNING:
        return new CustomScriptRunningProcess();
      case BatchProcessType.TC_SYNCSECURITYZONES:
        return new SyncSecurityZonesBatch();  
      case BatchProcessType.TC_LITADVISORFAILUREREPORT:
        return new LitAdvisorFailureReportProcess();
      default:
        return null
    }
  }
}
