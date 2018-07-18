package libraries.Contact_Entity

enhancement LinkedSyncedLibrary : entity.Contact {
  public function gaic_LinkedAndSynced() : Boolean
  {
    var linksync = this.gaic_linked() and this.gaic_synced()
    return linksync
  }
 
 
  public function gaic_linked() : Boolean
  {
    var linkStatusValue = this.generateLinkStatus().LinkStatusValue
    var linked = (linkStatusValue == "broken" or linkStatusValue == "notsynced" or linkStatusValue == "syncedremote" or linkStatusValue == "synced")
    return linked
  }
 
  public function gaic_synced() : Boolean
  {
    var linkStatusValue = this.generateLinkStatus().LinkStatusValue;
    var synced = (linkStatusValue == "synced");
    return synced
  }
}
