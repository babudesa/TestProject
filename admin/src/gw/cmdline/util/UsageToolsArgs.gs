package gw.cmdline.util

uses gw.lang.cli.*

class UsageToolsArgs {

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
   * The date to start from in MM/dd/yyyy format
   */
  static var _startDate : String as StartDate

  /**
   * The date to end on in MM/dd/yyyy format
   */
  static var _endDate : String as EndDate

  /**
   * Count the number of exposures created in the indicated time period
   */
  static var _countExposures : Boolean as CountExposures

  /**
   * Include the details of the exposures found as well as the overall count
   */
  static var _inclExposureDetail : Boolean as IncludeExposureDetails

  /**
   * Include the details of the number of exposures per month as well as the overall count
   */
  static var _inclMonthlyDetail : Boolean as IncludeMonthlyDetails

  /**
   * Only takes effect when used with count_exposures; Generate a csv file with the results of
   * the count_exposures command. The file will be created with the specified name.
   */
  @ShortName( "generate_csv" )
  static var _genCSV : String as GenerateCSV

}