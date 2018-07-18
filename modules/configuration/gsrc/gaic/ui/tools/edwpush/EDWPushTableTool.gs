package gaic.ui.tools.edwpush
uses java.util.List
uses entity.User
uses entity.EDWPushHolderHistoryExt
uses java.lang.String
uses gaic.ui.tools.edwpush.HolderItem
uses java.sql.Connection
uses java.sql.Statement
uses java.sql.ResultSet
uses com.gaic.claims.util.db.DatabaseUtil
uses java.util.ArrayList
uses java.sql.PreparedStatement
uses java.lang.RuntimeException
uses gw.transaction.Transaction

class EDWPushTableTool {
  private static final var TOP = "<TOP>";
  private static final var SELECT = "select "+TOP+" h.uniqueid, isnull(t.message, h.message), h.transactionname, h.claimnumber, h.errormessage, h.ccupdatetime "
    +", case when t.id is null then 0 else 1 end as hasTransaction "
    +"from EDWMessageHolder as h "
    +"left join EDWMessageTransaction as t "
    +"on t.uniqueid = h.uniqueid "
    +"order by h.uniqueid desc";
  private static final var REMOVE = "delete from EDWMessageHolder where uniqueid = ?";
  private static final var UPDATE_HOLDER = "update EDWMessageHolder set message = ? where uniqueid = ?";
  private static final var UPDATE_TRANSACTION = "update EDWMessageTransaction set message = ? where uniqueid = ?";
  
  private var con:Connection = null;

  construct() {
    con = DatabaseUtil.openConnectionToExternalWithDefaultProperties();
    con.setAutoCommit(false);
  }
  
  public function getHolderItems(limit:int):List<HolderItem> {
    var sql:String;
    if (limit > 0) {
      sql = SELECT.replace(TOP, "TOP "+limit);
    } else {
      sql = SELECT.replace(TOP, "");
    }
    //print("CurrentSQL: "+sql);
    
    var st:Statement = null;
    var rs:ResultSet = null;
    try {
      var list = new ArrayList<HolderItem>();

      st = con.createStatement();
      rs = st.executeQuery(sql);
      
      while (rs.next()) {
        list.add(new HolderItem(
          rs.getLong(1),
          rs.getString(2),
          rs.getString(3),
          rs.getString(4),
          rs.getString(5),
          rs.getDate(6),
          rs.getBoolean(7)
        ));
      }
      
      return list;
    } finally {
      DatabaseUtil.closeDatabaseResources(null, st, rs);
    }
  }
  
  public function removeHolderItem(item:HolderItem, comment:String) {
    if (comment == null || comment.trim().length == 0) throw new RuntimeException("The comment cannot be empty");
    
    var st:PreparedStatement = null;
    try {
      st = con.prepareStatement(REMOVE);
      st.setLong(1, item.UniqueID);
      var rows = st.executeUpdate();
      if (rows != 1) throw new RuntimeException("Unable to remove row for uniqueid "+item.UniqueID);
      
      Transaction.runWithNewBundle(\ bundle -> {
        var hist = new EDWPushHolderHistoryExt(bundle);
        hist.ClaimNumber = item.ClaimNumber;
        hist.Comments = comment;
        hist.UniqueID = item.UniqueID;
        bundle.commit();
      }, User.util.CurrentUser);
      
      con.commit();
    } finally {
      DatabaseUtil.closeStatement(st);
    }
  }
  
  public function updateMessage(item:HolderItem, comment:String, original:String) {
    if (item.Message == null) throw new RuntimeException("Message cannot be null");
    if (comment == null || comment.trim().length == 0) throw new RuntimeException("The comment cannot be empty");
    
    con.setAutoCommit(false);
    var st:PreparedStatement = null;
    try {
      st = con.prepareStatement(UPDATE_HOLDER);
      st.setString(1, item.Message);
      st.setLong(2, item.UniqueID);
      var rows = st.executeUpdate();
      if (rows != 1) throw new RuntimeException("Unable to update holder row for uniqueid "+item.UniqueID);
    } finally {
      DatabaseUtil.closeStatement(st);
    }
    
    st = null;
    try {
      st = con.prepareStatement(UPDATE_TRANSACTION);
      st.setString(1, item.Message);
      st.setLong(2, item.UniqueID);
      var rows = st.executeUpdate();
      if (rows != 1) throw new RuntimeException("Unable to update transaction row for uniqueid "+item.UniqueID);
      
      Transaction.runWithNewBundle(\ bundle -> {
        var hist = new EDWPushTransactionHistoryExt(bundle);
        hist.ClaimNumber = item.ClaimNumber;
        hist.Comments = comment;
        hist.UniqueID = item.UniqueID;
        hist.OriginalMessage = original;
        bundle.commit();
      }, User.util.CurrentUser);
      
      con.commit();
    } finally {
      DatabaseUtil.closeStatement(st);
    }
  }
  
  public function close() {
    if (con != null) try {con.close();} catch (e){}
  }
  
  public static function getHolderItemsSimple(limit:int):List<HolderItem> {
    var h:EDWPushTableTool = null;
    try {
      h = new EDWPushTableTool();
      return h.getHolderItems(limit);
    } finally {
      if (h != null) h.close();
    }
  }
  
  public static function removeHolderItemSimple(item:HolderItem, comment:String) {
    var h:EDWPushTableTool = null;
    try {
      h = new EDWPushTableTool();
      h.removeHolderItem(item, comment);
    } finally {
      if (h != null) h.close();
    }
  }
  
  public static function updateMessageSimple(item:HolderItem, comment:String, original:String) {
    var h:EDWPushTableTool = null;
    try {
      h = new EDWPushTableTool();
      h.updateMessage(item, comment, original);
    } finally {
      if (h != null) h.close();
    }
  }

}
