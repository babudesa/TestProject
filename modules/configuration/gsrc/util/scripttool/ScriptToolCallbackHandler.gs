package util.scripttool
uses gw.api.util.Logger //Added for logging in Debug - SR

class ScriptToolCallbackHandler implements gw.transaction.BundleTransactionCallback{
  
    var _bundle : gw.transaction.Bundle
    var _history : ScriptToolHistoryExt
    
    construct (publicID : String){
      _bundle = gw.transaction.Transaction.getCurrent()
      _history = _bundle.loadByPublicId(ScriptToolHistoryExt, publicID) as ScriptToolHistoryExt  
    }    
    
    override function beforeCommit() {
        _history.BundleAsString = audit()
    }

    override function afterPreUpdate() {}

    override function afterBeanCallbacks() {}
            
    override function afterValidation() {}

    override function afterSetIds() {}

    override function afterWriteToDatabase() {}

    override function afterCommit() {}                      

    override function afterBundleCallbacksCleared(p0 : boolean) {}

    override function onCommitException(p0 : java.lang.Exception) {
      //changed to logging in Debug - SR
      Logger.logDebug("An error has occurred while committing the script tool bundle... \r\n" + p0)
    }
    
  function audit() : String{    
    
    var xmlBundle = new ScriptToolAudit.Bundle()
    var xmlBean : ScriptToolAudit.Bean
    var xmlField : ScriptToolAudit.Field
    
    //inserted beans
    for(ib in _bundle.InsertedBeans){
      xmlBean = new ScriptToolAudit.Bean()
      xmlBean.type = (typeof ib) as String
      xmlBean.operation = ScriptToolAudit.enums.operationTypeEnum.Inserted
      xmlBean.publicID = ib.PublicID
      for(cf in ib.ChangedFields){
        xmlField = new ScriptToolAudit.Field()
        xmlField.name = cf
        xmlField.oldValue.Text = ib.getOriginalValue(cf) as String
        xmlField.newValue.Text = ib.getFieldValue(cf) as String
        xmlBean.fields.add(xmlField)
      }
      xmlBundle.ModifiedBeans.add(xmlBean)
    }
    
    //updated beans
    for(ub in _bundle.UpdatedBeans){
      xmlBean = new ScriptToolAudit.Bean()
      xmlBean.type = (typeof ub) as String
      xmlBean.operation = ScriptToolAudit.enums.operationTypeEnum.Updated     
      xmlBean.publicID = ub.PublicID
      for(cf in ub.ChangedFields){
        xmlField = new ScriptToolAudit.Field()
        xmlField.name = cf        
        xmlField.oldValue.Text = ub.getOriginalValue(cf) as String
        xmlField.newValue.Text = ub.getFieldValue(cf) as String
        xmlBean.fields.add(xmlField)
      }
      xmlBundle.ModifiedBeans.add(xmlBean)
    }
    
    //removed beans
    for(rb in _bundle.RemovedBeans){
      xmlBean = new ScriptToolAudit.Bean()
      xmlBean.type = (typeof rb) as String
      xmlBean.operation = ScriptToolAudit.enums.operationTypeEnum.Removed
      xmlBean.publicID = rb.PublicID  
      for(cf in rb.ChangedFields){
        xmlField = new ScriptToolAudit.Field()
        xmlField.name = cf        
        xmlField.oldValue.Text = rb.getOriginalValue(cf) as String
        xmlField.newValue.Text = rb.getFieldValue(cf) as String
        xmlBean.fields.add(xmlField)
      }
      xmlBundle.ModifiedBeans.add(xmlBean)
    }    
    
    return xmlBundle.asUTFString()

  }       
}

