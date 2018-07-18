package gw.cmdline.util

uses gw.lang.cli.*

class FNOLMapperArgs {

  /**
   * name of input XML file
   */
  @Required
  static var _input : String as Input

  /**
   * name of XML mapper class, default knows how to map from ACORD format
   */
  @DefaultValue("gw.fnolmapper.acord.AcordFNOLMapper")
  static var _mapper : String as Mapper

  /**
   * Name of file to dump xml output to - default is stdout
   */
  static var _resultFile : String as Resultfile

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

}