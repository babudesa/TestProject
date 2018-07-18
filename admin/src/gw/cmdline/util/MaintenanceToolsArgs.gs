package gw.cmdline.util

uses gw.lang.cli.*

class MaintenanceToolsArgs {

  /**
   * The name of the process to start.
   */
  @ShortName( "startprocess" )
  static var _startProcess : String as StartProcess

  /**
   * A name or process number to return the process status of
   */
  @ShortName( "processstatus" )
  static var _processStatus : String as ProcessStatus

  /**
   * A name or process number to terminate
   */
  @ShortName( "terminateprocess" )
  static var _terminateProcess : String as TerminateProcess

  /**
   * Return the db stats for this server
   */
  @ShortName( "getdbstatisticsstatements" )
  static var _dbStats : boolean as GetDBStatisticsStatements

  /**
   * Return the incremental db stats for this server based in update threshold
   */
  @ShortName( "getincrementaldbstatisticsstatements" )
  static var _dbIncrementalStats : boolean as GetIncrementalDBStatisticsStatements

  /**
   * Return when db stats were last calcualted for this server
   */
  @ShortName( "whenstats" )
  static var _whenStats : boolean as WhenStats

  /**
   * The claim number to purge
   */
  @ShortName( "markclaimforpurge" )
  static var _claimForPurge : String as MarkClaimForPurge

  /**
   * The csv file filled with claims numbers to purge.  You must also use either -claims to specify claim numbers or
   * -file to specify a CSV file of claim numbers.
   */
  @ShortName( "markclaimsforpurge" )
  static var _claimsForPurge : Boolean as MarkClaimsForPurge

  /**
   * claims to mark, separated by commas
   */
  @Separator( "," )
  static var _claims : String[] as Claims

  /**
   * file to retrieve claim numbers from
   */
  static var _file : String as File

  /**
   * The root server URL to access
   */
  @DefaultValue( "http://localhost:8080/cc" )
  static var _server : String as Server

  /**
   * The user to log in as
   */
  @DefaultValue( "su" )
  static var _user : String as User

  /**
   * The password to use
   */
  @Required
  static var _password : String as Password

  /**
   * Schedule a claim for archive. You must also use either -claims to specify claim numbers or
   * -file to specify a CSV file of claim numbers.
   */
  @ShortName( "scheduleforarchive" )
  static var _scheduleClaimForArchive : boolean as ScheduleClaimForArchive

  /**
   * Restore a claim with the given comment.  You must also use either -claims to specify claim numbers or
   * -file to specify a CSV file of claim numbers.
   */
  @ShortName( "restore" )
  static var _resoreClaim : String as RestoreClaim

}