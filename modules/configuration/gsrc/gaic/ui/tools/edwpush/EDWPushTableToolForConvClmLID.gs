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
 * cprakash - 6/6/2016 - This class performs retrieving values from the Conversion Trigger and Holder Tables
 * Also removes the selected list items from the Holder Table to make them applicable for EDW Push.
 * The functionality is developed alternative to existing functionality which used to perform the removal
 * at claim level, where as this new funcationality will perform removal at load command id level.
 */


class EDWPushTableToolForConvClmLID {

  private static final var TOP = "<TOP>";
  private static final var SELECT = "select "+TOP+" h.loadcommandid, COUNT(*) AS 'No of Claims'  "
                                   +"from EDWMessageHolder h "
                                   +"inner join EDWConversionTrigger c "
                                   +"on h.loadcommandid is not null and "
                                   +"c.claimnumber = h.claimnumber "
                                   +"group by h.loadcommandid"

  
  private static final var REMOVE = "delete from EDWMessageHolder where loadcommandid in (?)";
  private var con:Connection = null;

  construct() {
    con = DatabaseUtil.openConnectionToExternalWithDefaultProperties();
    con.setAutoCommit(false);
  }
  
  public function getHolderItems(limit:int):List<HolderConvClmItemLID> {
    var sql:String;
    if (limit > 0) {
      sql = SELECT.replace(TOP, "TOP "+limit);
    } else {
      sql = SELECT.replace(TOP, "");
   }
    var st:Statement = null;
    var rs:ResultSet = null;
    try {
      var list = new ArrayList<HolderConvClmItemLID>();
      st = con.createStatement();
      rs = st.executeQuery(sql);
      while (rs.next()) {
        list.add(new HolderConvClmItemLID(
          rs.getLong(1),
          rs.getInt(2)
        ));
      }
      
      return list;
    } finally {
      DatabaseUtil.closeDatabaseResources(null, st, rs);
    }
   }
  
  public function removeHolderItem(items:HolderConvClmItemLID[], comment:String) {
    if (comment == null || comment.trim().length == 0) throw new RuntimeException("The comment cannot be empty");
    var claimnumbers : java.lang.StringBuffer= null
    for(item in items){
    var st:PreparedStatement = null;
    try {
      st = con.prepareStatement(REMOVE);
      st.setString(1, item.LoadCommandID as java.lang.String)
      st.executeUpdate()
     
      var displayText = item.NoOfClaims+" Claims Associated with Load Command ID:"+item.LoadCommandID+" are removed \n" 
      if(claimnumbers == null) claimnumbers  = displayText as java.lang.StringBuffer
      else claimnumbers = claimnumbers + displayText as java.lang.StringBuffer 

      con.commit();
    }
    catch(e : java.lang.Exception)
    {
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
  
  public static function getHolderItemsSimple(limit:int):List<HolderConvClmItemLID> {
    var h:EDWPushTableToolForConvClmLID = null;
    try {
      h = new EDWPushTableToolForConvClmLID();
      return h.getHolderItems(limit);
    } finally {
      if (h != null) h.close();
    }
  }
  
  public static function removeHolderItemSimple(item:HolderConvClmItemLID[], comment:String) {
    var h:EDWPushTableToolForConvClmLID= null;
    try {
      h = new EDWPushTableToolForConvClmLID()
      h.removeHolderItem(item, comment)
    } finally {
      if (h != null) h.close();
    }
  }
}
