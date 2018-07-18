package gaic.plugin.cc.database
uses java.util.List
uses gw.plugin.upgrade.IDatabaseUpgrade
uses java.lang.Iterable
uses gw.plugin.upgrade.IUpgradeContext
uses gw.api.archiving.upgrade.ArchivedDocumentUpgradeVersionTrigger
uses gw.plugin.upgrade.EdgeForeignKeyUpgradeInfo
uses gw.api.util.Logger //Added for logging in Debug - SR
uses java.io.FileInputStream;
uses java.io.IOException;
uses java.util.Properties;
uses gw.api.util.ConfigAccess
uses gw.api.database.Query
uses gw.api.database.Relop
uses java.io.FileOutputStream
uses java.lang.System
uses com.gaic.claims.util.db.DatabaseUtil

class DatabaseUpgradePluginImpl implements IDatabaseUpgrade {
  private var _toolName = "" 
  
  construct() {
    _toolName = System.getProperty("toolName")
  }
  
  override property get AfterUpgradeArchivedDocumentChanges() : List<ArchivedDocumentUpgradeVersionTrigger> {
    return {} //## todo: Implement me
  }

  override property get BeforeUpgradeArchivedDocumentChanges() : List<ArchivedDocumentUpgradeVersionTrigger> {
    return {} //## todo: Implement me
  }

  override property get EdgeForeignKeyUpgrades() : Iterable<EdgeForeignKeyUpgradeInfo> {
    return {} //## todo: Implement me
  }

  override function postUpgrade(upgradeContext : IUpgradeContext) {
    incrementExtensionVersion()
    
    if(!isDictionaryBuild) {
      Logger.logInfo("Update Queries to remove Database Inconsistencies Begins....")
       //Defect: 8350 - schandanam - below Queries removes the inconsistencies related to Activities, Documents & unassigned Objects. 
      // Removing mapping of claimcontact to Activity 
      upgradeContext.update("Removing Inconsistencies Related to Activities", "UPDATE cc_activity SET ClaimContactID = NULL WHERE ClaimContactID IS NOT NULL AND ExposureID IS NOT NULL");
     // Removing the mapping of Exposure to document for matter Related.
      upgradeContext.update("Removing Inconsistencies Related to Documents", "UPDATE cc_document SET ExposureID = NULL WHERE ExposureID IS NOT NULL AND MatterID IS NOT NULL");
     // Setting the Assignment Status to Assigned, where the status is incorrectly mapped as unassigned, even though they have assigned user and assigned group.
      upgradeContext.update("Removing Inconsistencies Related to Unassigned Objects", "UPDATE cc_userroleassign SET assignmentstatus = 1 WHERE assignmentstatus = 4 AND (assigneduserid IS NOT NULL AND assignedgroupid IS NOT NULL )");
      
      // *** Defect#8350 Irina Vorobyeva: Added April 11, 2017 ***
      if(gw.api.system.server.ServerUtil.getEnv()== "prod" || gw.api.system.server.ServerUtil.getEnv()== "dev7"){
      // Fixing activity inconsistencies where for documents moved from one claim to the other, the ExposureID should be from the new claim
        // to get the count of documents which should be changed
        var qryDoc = Query.make(Document)
        qryDoc.compare("Exposure", notEquals, NULL)
        var qryEx = gw.api.database.Query.make(Exposure)
        qryDoc.subselect("Exposure", CompareIn, qryEx, "ID")
        qryEx.compare("Claim", notEquals, qryDoc.getColumnRef("Claim"))
        var docs = qryDoc.select().orderBy(\ d -> d.Claim.ID)
        // fixing one document at a time
        for(d in docs){
          upgradeContext.update(("Removing Inconsistencies with wrong ExposureID on document: set ExposureType-DocID: "+d.ID+": "),"UPDATE doc SET doc.ex_ECFFeatureType = (SELECT extp.Name FROM cctl_exposuretype extp WHERE extp.ID=(SELECT TOP 1 ex.ExposureType FROM cc_exposure ex WHERE ex.ClaimID=(SELECT TOP 1 doc.ClaimID FROM cc_document doc, cc_exposure ex WHERE doc.ExposureID IS NOT NULL AND doc.ExposureID = ex.ID AND doc.ClaimID <> ex.ClaimID ORDER BY doc.ClaimID) ORDER BY ex.ID)) FROM cc_document doc WHERE doc.ID = (SELECT TOP 1 doc.ID FROM cc_document doc, cc_exposure ex WHERE doc.ExposureID IS NOT NULL AND doc.ExposureID = ex.ID AND doc.ClaimID <> ex.ClaimID ORDER BY doc.ClaimID)");
          upgradeContext.update(("Removing Inconsistencies with wrong ExposureID on document: set ExposureID-DocID: "+d.ID+": "),"UPDATE doc SET doc.ExposureID=(SELECT TOP 1 ex.ID FROM cc_exposure ex WHERE ex.ClaimID=(SELECT TOP 1 doc.ClaimID FROM cc_document doc, cc_exposure ex WHERE doc.ExposureID IS NOT NULL AND doc.ExposureID = ex.ID AND doc.ClaimID <> ex.ClaimID ORDER BY doc.ClaimID) ORDER BY ex.ID) FROM cc_document doc WHERE doc.ID = (SELECT TOP 1 doc.ID FROM cc_document doc, cc_exposure ex WHERE doc.ExposureID IS NOT NULL AND doc.ExposureID = ex.ID AND doc.ClaimID <> ex.ClaimID ORDER BY doc.ClaimID)");
        }
      }
      //Defect 9205: pdash2
     // Fix date-time ordering issue in cc_policy where EffectiveDate >= ExpirationDate
      upgradeContext.update("Removing Inconsistencies Related to EffectiveDate >= ExpirationDate on policy", "update p set p.ExpirationDate = (select top 1 p1.ExpirationDate from cc_policy p1 where p1.PolicyEBIExt = p.PolicyEBIExt  and p1.ID != p.ID and (p1.EffectiveDate != p.EffectiveDate or p1.ExpirationDate != p.ExpirationDate)) ,p.EffectiveDate = (select top 1 p1.EffectiveDate from cc_policy p1 where p1.PolicyEBIExt = p.PolicyEBIExt and p1.ID != p.ID and (p1.EffectiveDate != p.EffectiveDate or  p1.ExpirationDate != p.ExpirationDate)) from cc_policy p where p.EffectiveDate IS NOT NULL AND p.ExpirationDate IS NOT NULL AND NOT p.EffectiveDate <= p.ExpirationDate")
     
     // Fix date-time oredering issue in cc_policy where EffectiveDate >= ConcellationDate
      upgradeContext.update("Removing Inconsistencies Related to EffectiveDate >= CancellationDate on policy ", "update p set p.CancellationDate = (select top 1 p1.CancellationDate from cc_policy p1 where p1.PolicyEBIExt = p.PolicyEBIExt and p1.ID != p.ID and (p1.EffectiveDate != p.EffectiveDate or p1.CancellationDate != p.CancellationDate)) ,p.EffectiveDate = (select top 1 p1.EffectiveDate from cc_policy p1 where p1.PolicyEBIExt = p.PolicyEBIExt and p1.ID != p.ID and (p1.EffectiveDate != p.EffectiveDate or p1.CancellationDate != p.CancellationDate)) from cc_policy p where p.EffectiveDate IS NOT NULL AND p.CancellationDate IS NOT NULL AND NOT p.EffectiveDate <= p.CancellationDate")
    
      // ************************************************************
    }
    
    Logger.logInfo("Update Queries to remove Database Inconsistencies Ends....")    
  }
  
  private property get isDictionaryBuild() : boolean {
    return _toolName == "buildDictionary" || _toolName == "securityDictionary" 
  }
  
  // execute pre upgrade stored procedures
  override function preUpgrade(upgradeContext : IUpgradeContext) {
    var majorVersion = upgradeContext.SafeMajorVersion
    var extVersion = upgradeContext.SafeExtensionVersion;
    
    if ((majorVersion == 8 || majorVersion == -1) && extVersion < 2275 && extVersion != 0) {
      //this version number indicates work comp going live
      upgradeContext.update("Renaming old bu field on claim", "exec sp_rename '"+getDBName()+".dbo.cc_claim.BusinessUnitExt', 'NCWOnlyBusinessUnitExt', 'COLUMN' ");
      upgradeContext.update("Fixing datatype of taxstatuscode on the original version policy contact", "alter table ccx_origverpolcontactext alter column origcontex_taxstatuscode int");
    }  
  }
  /**
   * @author Travis Newcomb
   * Reads in the data model schema version from extensions.properties and cc_systemparameters. If the version in
   * the properties file is less than or equal to the version in the DB, then the properties file version will be
   * incremented by one. This is necessary after the 6.0.8 upgrade.
   */
  private function incrementExtensionVersion(){
    //auto-increment extensions.properties.version in local, only if datamodel is changed
    var shouldProceed = (gw.api.system.server.ServerUtil.getEnv() == "local" && !isDictionaryBuild);
    if (!shouldProceed) return;

    Logger.logInfo("DB Upgrade Plugin : checking if extensions.properties.version is obsolete...")
    
    var input : FileInputStream = null
    var output : FileOutputStream = null
    
    try{
      
      var file = ConfigAccess.getConfigFile("\\config\\extensions\\extensions.properties")
      var extensionProps = new Properties()
      
      input = new FileInputStream(file)
      extensionProps.load(input)
      
      var customSchemaVersion = (Query.make(SystemParameter)
                                      .compare("Name", Relop.Equals, "customschemaversion")
                                      .select()
                                      .FirstResult as com.guidewire.pl.system.entity.proxy.BeanProxy)
                                      .getFieldValue("Value") as int        
                                                                                                         
      var propFileVersionNum = extensionProps.get("version") as int
    
      Logger.logInfo("DB Upgrade Plugin: customSchemaVersion " + customSchemaVersion)
      Logger.logInfo("DB Upgrade Plugin: extensions.version in properties file " + propFileVersionNum)
      
      if(propFileVersionNum <= customSchemaVersion){
        Logger.logInfo("DB Upgrade Plugin: value in properties file is less than or equal to value in database -> incrementing extensions.version...")
        extensionProps.setProperty("version", (propFileVersionNum + 1) as String)    
        output = new FileOutputStream(file)
        extensionProps.store(output, null)
      }
      
    }catch(io : IOException){
      io.printStackTrace()  
    }finally{
      if(input != null)
      	input.close()
      if(output != null)
      	output.close()
    }
  }
  
  private function getDBName():String {
    var url = com.guidewire.pl.system.dependency.ServerDependencies.getSystemConfiguration().getDatabase().getJdbcUrl();
    var name = url.split(";").firstWhere(\ s -> s.startsWith("DatabaseName=")).substring("DatabaseName=".length());
    return name;
  }

}