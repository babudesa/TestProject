package gw.api.sree;

uses gw.api.sree.SimpleReportInfo
uses gw.api.util.Logger
uses java.util.ArrayList
uses soap.sree.entity.RepositoryEntryStruct
uses gw.api.util.DisplayableException

/*
 *
 */
@Export
class StyleReportAPI {
  private static var API = new soap.sree.api.SoapRepositoryPortType()
  private static var TICKET_USER = "GWTICKETUSER";
  
  
  public static final var REPLET: String = "REPLET"
  public static final var VERSIONED_ARCHIVE: String = "VERSIONED_ARCHIVE"
  public static final var NO_ARCHIVE: String = "NO_ARCHIVE"
  public static final var DEFAULT_ARCHIVE: String = "DEFAULT_ARCHIVE"
  public static final var TEMPLATE: String = "TEMPLATE"
  public static final var GENERATED_FORMAT: String = "GENERATED_FORMAT"
  public static final var REPORT: String = "REPORT"
  public static final var SVG: String = "SVG"
  public static final var CSV: String = "CSV"
  public static final var PDF: String = "PDF"
  public static final var EXCEL: String = "EXCEL"
  public static final var EXCEL_DATA: String = "EXCEL_DATA"
  public static final var EXCEL_SHEET: String = "EXCEL_SHEET"
  public static final var RTF: String = "RTF"
  public static final var RTF_LAYOUT: String = "RTF_LAYOUT"
  public static final var HTML_BUNDLE: String = "HTML_BUNDLE"
  public static final var HTML: String = "HTML"
  public static final var HTML_BUNDLE_NO_PAGINATION: String = "HTML_BUNDLE_NO_PAGINATION"
  public static final var POSTSCRIPT: String = "POSTSCRIPT"
  public static final var DAY_OF_MONTH: String = "DAY_OF_MONTH"
  public static final var DAY_OF_WEEK: String = "DAY_OF_WEEK"
  public static final var WEEK_OF_YEAR: String = "WEEK_OF_YEAR"
  public static final var WEEK_OF_MONTH: String = "WEEK_OF_MONTH"
  public static final var EVERY_DAY: String = "EVERY_DAY"
  public static final var LAST_DAY_OF_MONTH: String = "LAST_DAY_OF_MONTH"
  public static final var AT: String = "AT"
  public static final var DateArchiveRule: String = "DateArchiveRule"
  public static final var VersionArchiveRule: String = "VersionArchiveRule"
  public static final var AgeArchiveRule: String = "AgeArchiveRule"

  construct() {
  }

  /**
   * This method is used in the case when a user clicks the "Sync" button on the Reports Admin page in CC
   * Here we pass in a sentinel username and the sessionID as the password, so that we can recognize this on the
   * InetSoft side and re-direct the login attempt to validate using the sessionID.
   */
  public static function ticketLogin(ticket : String) : String {
    return API.login( TICKET_USER, ticket, /* locale */ null )
  }
  
  public static function getReplets(user : User) : SimpleReportInfo[] {
    var list = new ArrayList<SimpleReportInfo>()
    if (gw.api.sree.SREEUtil.isRunning()) {
      try {
        Logger.logInfo("getting replets from StyleReport web service as ${user}")
        var ticket = ticketLogin(gw.api.sree.SREEUtil.getSessionID());
        var folders = API.getFolders(ticket, null) as java.util.List<RepositoryEntryStruct>
        var replets = API.getReplets(ticket, null) as java.util.List<RepositoryEntryStruct>
        API.getRepositoryEntries( ticket, "Report Archive", null, 1 )

        list.addAll(folders.map(\ folder -> newReportInfo(folder, true)))
        list.addAll(replets.map(\ aReplet -> newReportInfo(aReplet, false)))
      } catch (e) {
        Logger.logError(e.toString(), e)
        throw new DisplayableException("Error retrieving replets from report server", e.Cause)
      }
    }
    return list as SimpleReportInfo[]
  }

  private static function newReportInfo(struct : RepositoryEntryStruct, folder : boolean) : SimpleReportInfo {
    var path = struct.path
    var desc = struct.description
    var visible = struct.visible
    // hack to coerce InetSoft's string for the "root" folder into the correct representation
    if (folder and path == "/") path = ""
    if( folder ) visible = true

    return new SimpleReportInfo(path, desc, folder, visible)
  }
}
