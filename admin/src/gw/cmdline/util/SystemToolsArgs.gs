package gw.cmdline.util

uses gw.lang.cli.*

class SystemToolsArgs {

  /**
   * The root server URL to access
   */
  @DefaultValue( "http://localhost:8080/cc" )
  @ShortName( "server" )
  @LongName( null )
  static var _server : String as Server

  /**
   * The user to log in as
   */
  @DefaultValue( "su" )
  @ShortName( "user" )
  @LongName( null )
  static var _user : String as User

  /**
   * The password to use
   */
  @ShortName( "password" )
  @LongName( null )
  @Required
  static var _password : String as Password

  /**
   * Print the runlevel of the server
   */
  static var _ping : Boolean as Ping

  /**
   * Run the database consistency checks and wait for the results.  See the Admin Guide page for details.
   */
  @ShortName( "checkdbconsistency" )
  @LongName( null )
  @ArgNames( {"tableselection", "checktypeselection"} )
  @ArgOptional
  static var _checkDBConsistency : String[] as CheckDBConsistency

  /**
   * Run the database consistency checks as a batch job.  See the Admin Guide page for details.
   */
  @ShortName( "checkdbconsistencyasbatch" )
  @LongName( null )
  @ArgNames( {"tableselection", "checktypeselection"} )
  @ArgOptional
  static var _checkDBConsistencyAsBatch : String[] as CheckDBConsistencyAsBatch

  /**
   * Download zip of database catalog statistics report, optionally on selected tables.  Has
   * optional arguments 'tables' 'stagingtables' 'typelisttables'.  Use the -filepath option
   * to specify a different directory to put the zip file in.
   */
  @ShortName( "dbcatstats" )
  @LongName( null )
  @ArgNames( {"tables", "stagingtables", "typelisttables"} )
  @ArgOptional
  static var _reportDBStats : String[] as ReportDBStats

  /**
   * Path for location of db stats report zip file (optional with dbcatstats)
   */
  @ShortName( "filepath" )
  @LongName( null )
  static var _filepath : String as FilePath

  /**
   * Return the version of the server
   */
  @ShortName( "version" )
  @LongName( null )
  static var _version : Boolean as Version

  /**
   * Set the server to maintenance mode
   */
  @ShortName( "maintenance" )
  @LongName( null )
  static var _maint : Boolean as Maintenance

  /**
   * Set the server to daemons mode
   */
  @ShortName( "daemons" )
  @LongName( null )
  @ArgOptional
  static var _daem : Boolean as Daemons

  /**
   * Set the server to multiuser mode
   */
  @ShortName( "multiuser" )
  @LongName( null )
  static var _multiUser : Boolean as MultiUser

  /**
   * Get the session information of the server
   */
  @ShortName( "sessioninfo" )
  @LongName( null )
  static var _sessionInfo : Boolean as SessionInfo

  /**
   * Update the logging level of logger with the given name. For root logger, use RootLogger as the name. Takes two arguments, loggerName and level
   */
  @ShortName( "updatelogginglevel" )
  @LongName( null )
  static var _updateLoggingLevel : String[] as UpdateLoggingLevel

  /**
   * Get the logger categories available in the system
   */
  @ShortName( "loggercats" )
  @LongName( null )
  static var _loggerCategories : Boolean as LoggerCategories

  /**
   * Tell the server to reload it's logging configuration file.
   */
  @ShortName( "reloadloggingconfig" )
  @LongName( null )
  static var _reloadLoggingConfig : Boolean as ReloadLoggingConfig

  /**
   * Recalculates file checksums used for clustered configuration verification.
   */
  @ShortName( "recalcchecksums" )
  @LongName( null )
  static var _recalcChecksums : Boolean as RecalculateChecksums

  /**
   * Verify the data model matches the underlying physical database
   */
  @ShortName( "verifydbschema" )
  @LongName( null )
  static var _verifyDBSchema : Boolean as VerifyDBSchema

}