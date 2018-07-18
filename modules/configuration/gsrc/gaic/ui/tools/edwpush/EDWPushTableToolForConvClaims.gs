package gaic.ui.tools.edwpush
uses java.util.List
uses entity.User
uses entity.EDWPushCovClaimHolHistory
uses java.lang.String
uses java.sql.Connection
uses java.sql.Statement
uses java.sql.ResultSet
uses com.gaic.claims.util.db.DatabaseUtil
uses java.util.ArrayList
uses java.sql.PreparedStatement
uses java.lang.RuntimeException
uses gw.transaction.Transaction

/**
 * cprakash - 4/4/2016 - This class performs retrieving values from the Coversion Trigger, Holder and Transaction Tables
 * Also removes the selected list items from the Holder Table to make them applicable for EDW Push.
 */

class EDWPushTableToolForConvClaims {
  private static final var TOP = "<TOP>";
  private static final var SELECT = "select "+TOP+" h.claimnumber, h.transactionname, h.loadcommandid,c.processed  "
    +"from EDWMessageHolder h "
    +"inner join EDWConversionTrigger c "
    +"on h.loadcommandid is not null and "
    +"c.claimnumber = h.claimnumber "
  
                 
  private static final var REMOVE = "delete from EDWMessageHolder where claimnumber = ?";

  private var con:Connection = null;

  construct() {
    con = DatabaseUtil.openConnectionToExternalWithDefaultProperties();
    con.setAutoCommit(false);
  }
  
  public function getHolderItems(limit:int):List<HolderConvClmItem> {
    var sql:String;
    if (limit > 0) {
      sql = SELECT.replace(TOP, "TOP "+limit);
    } else {
      sql = SELECT.replace(TOP, "");
    }
  
    
    var st:Statement = null;
    var rs:ResultSet = null;
    try {
      var list = new ArrayList<HolderConvClmItem>();

      st = con.createStatement();
      rs = st.executeQuery(sql);
      
      while (rs.next()) {
        list.add(new HolderConvClmItem(
          rs.getString(1),
          rs.getString(2),
          rs.getLong(3),
          rs.getInt(4)
        ));
      }
      
      return list;
    } finally {
      DatabaseUtil.closeDatabaseResources(null, st, rs);
    }
  }
  
  public function removeHolderItem(items:HolderConvClmItem[], comment:String) {
    if (comment == null || comment.trim().length == 0) throw new RuntimeException("The comment cannot be empty");
    var claimnumbers : java.lang.StringBuffer= null 
    for(item in items){
    var st:PreparedStatement = null;
    try {
      st = con.prepareStatement(REMOVE);
      st.setString(1, item.ClaimNumber)
      st.executeUpdate();
     
      if(claimnumbers==null) claimnumbers  = item.ClaimNumber as java.lang.StringBuffer
      else claimnumbers = claimnumbers+","+ item.ClaimNumber as java.lang.StringBuffer
      con.commit();
    } finally {
      DatabaseUtil.closeStatement(st);
    }
    }
        Transaction.runWithNewBundle(\ bundle -> {
        var hist = new EDWPushCovClaimHolHistory(bundle);
        hist.ClaimNumbers = claimnumbers as java.lang.String
        hist.Comments = comment
        bundle.commit();
      }, User.util.CurrentUser);
    
  }
  

  
  public function close() {
    if (con != null) try {con.close();} catch (e){}
  }
  
  public static function getHolderItemsSimple(limit:int):List<HolderConvClmItem> {
    var h:EDWPushTableToolForConvClaims = null;
    try {
      h = new EDWPushTableToolForConvClaims();
      return h.getHolderItems(limit);
    } finally {
      if (h != null) h.close();
    }
  }
  
  public static function removeHolderItemSimple(item:HolderConvClmItem[], comment:String) {
    var h:EDWPushTableToolForConvClaims= null;
    try {
      h = new EDWPushTableToolForConvClaims();
      h.removeHolderItem(item, comment);
    } finally {
      if (h != null) h.close();
    }
  }
  


}
