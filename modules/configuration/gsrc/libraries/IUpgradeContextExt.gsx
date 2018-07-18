package libraries

enhancement IUpgradeContextExt : gw.plugin.upgrade.IUpgradeContext {
  /**
   * Returns the major version, or -1 if it cannot be found (new database).
   */  
  property get SafeMajorVersion ():int {
    try {
      return this.CurrentMajorVersion;
    } catch (e) {
      return -1;
    }
  }
  
  /**
   * Returns the extensions version, or 0 if it cannot be found (new database).
   */
  property get SafeExtensionVersion ():int {
    try {
      return this.CurrentExtensionsVersion;
    } catch (e) {
      return 0;
    }
  }
}
