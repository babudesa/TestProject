package gw.plugin.ccabintegration.impl;

uses gw.lang.reflect.IPropertyInfo

interface UpdateBatchTranslationContext {
  function getABEntityName(ccEntityName : String) : String
  /**
   * Find the publicID from a LinkID.
   * @throws ABObjectNotFoundException if PublicId not found.
   */
  function getABPublicId(type : Type, ccUid : String) : String

  function getABValue(ccProperty : IPropertyInfo, ccValue : String) : String

  function getEntityClass(ccUpdateOp : FieldChangeUpdateOp) : Type
}
