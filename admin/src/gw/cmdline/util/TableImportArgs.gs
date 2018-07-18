package gw.cmdline.util

uses gw.lang.cli.*

class TableImportArgs {

  /**
   * allow references to existing rows in all source tables
   */
   @LongName( null )
   static var _allReferencesAllowed : Boolean as Allreferencesallowed

  /**
   * clear the error table
   */
   @LongName( null )
   static var _clearError : Boolean as Clearerror

  /**
   * clear the exclusion table
   */
   @LongName( null )
   static var _clearExclusion : Boolean as Clearexclusion

  /**
   * clear the staging tables
   */
   @LongName( null )
   static var _clearStaging : Boolean as Clearstaging

  /**
   * delete rows from staging tables based on contents of exclusion table
   */
   @LongName( null )
   static var _deleteExcluded : Boolean as Deleteexcluded

  /**
   * populate the exclusion table with rows to be excluded
   */
   @LongName( null )
   static var _populateExclusion : Boolean as Populateexclusion

  /**
   * check the integrity of the contents of the staging tables; can optionally specify 'clearerror', 'populateexclusion' and 'allreferencesallowed'
   */
   @LongName( null )
   static var _integrityCheck : Boolean as Integritycheck

  /**
   * check the integrity of the contents of the staging tables and load source tables if no errors; can optionally specify 'clearerror', 'populateexclusion', 'allreferencesallowed', 'estimateorastats' and 'zonedataonly'
   */
   @LongName( null )
   static var _integrityCheckAndLoad : Boolean as Integritycheckandload

  /**
   * use Zone data only in this import
   */
   @LongName( null )
   static var _zoneDataOnly : Boolean as Zonedataonly

  /**
   * deprecated, does not do anything.  Previously was comma separated list of message sinks for which imported claims/exposures should be marked as synced (only applicable if 'integritycheckandload' set)
   */
   @LongName( null )
   static var _messageSinks : String as Messagesinks

  /**
   * update database statistics on the staging tables
   */
   @LongName( null )
   static var _updateDatabaseStatistics : Boolean as Updatedatabasestatistics

  /**
   * encrypt columns configured to be encrypted in the staging tables
   */
   @LongName( null )
   static var _encryptStagingTables : Boolean as Encryptstagingtbls

  /**
   * update database statistics on the source tables with estimated row and block counts for the source tables and indexes at the beginning of load (integritycheckandload) when running against Oracle
   */
   @LongName( null )
   static var _estimateOraStats : Boolean as Estimateorastats

  /**
   * runs the command in a batch process (only applicable to integritycheck, integritycheckandload, populateexclusion, deleteexcluded, and updatedatabasestatistics options
   */
   @LongName( null )
   static var _batch : Boolean as Batch

  /**
   * The root server URL to access
   */
  @DefaultValue( "http://localhost:8080/cc" )
  @LongName( null )
  static var _server : String as Server

  /**
   * The user to log in as
   */
  @DefaultValue( "su" )
  @LongName( null )
  static var _user : String as User

  /**
   * The password to use
   */
  @LongName( null )
  @Required
  static var _password : String as Password

}