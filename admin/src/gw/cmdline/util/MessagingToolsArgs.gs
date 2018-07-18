package gw.cmdline.util

uses gw.lang.cli.*

class MessagingToolsArgs {

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
   * Purge completed messages before this date (in MM/dd/yyyy form)
   */
   static var _purge : String as Purge

  /**
   * Retry message with the given ID
   */
   static var _retry : java.lang.Integer as Retry

  /**
   * Skip message with the given ID
   */
   static var _skip : java.lang.Integer as Skip

  /**
   * Suspend the destination for the given destination ID
   */
   static var _suspend : java.lang.Integer as Suspend

  /**
   * Resume the destination for the given destination ID
   */
   static var _resume : java.lang.Integer as Resume

  /**
   * Retry all retryable messages for the given destination ID
   */
   @ShortName( "retrydest" )
   static var _retryAll : java.lang.Integer as RetryDest

  /**
   * Resync a claim against a destination (required the -claim and -destination options)
   */
   static var _resync : Boolean as Resync

  /**
   * The claim ID to resync
   */
   static var _claim : String as Claim

  /**
   * The destination ID to resync
   */
   static var _destination : java.lang.Integer as Destination

  /**
   * Print the statistics for the destination with the given destination ID
   */
   static var _statistics : java.lang.Integer as Statistics

}