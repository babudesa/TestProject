package gw.plugin.ccabintegration.impl

uses java.util.ArrayList
uses java.util.HashSet
uses java.util.Set
uses gw.lang.reflect.IPropertyInfo
uses gw.api.util.DisplayableException
uses java.util.HashMap
uses gw.entity.IEntityType
uses java.lang.IllegalStateException
uses gw.api.util.mapping.GWObjectUtils
uses gw.lang.reflect.TypeSystem

/**
 * Maintains state required to translate a  ClaimCenter UpdateBatch into a
 * ContactCenter UpdateBatch.
 *
 * @author pdalbora
 */
class UpdateBatchTranslationContextImpl implements UpdateBatchTranslationContext {
  var _operation : UpdateOperation
  
  
// TODO this is a workaround for a gosu bug, take out when scott fix it
  override function getABEntityName( ccEntityName : String ) : String {
    return _operation.getCCToABConverter().getTranslator().translateEntityName(ccEntityName)
  }
  
  
  /**
   * Key: rootEntityName + ObjectUId
   * Value: PublicID for linked entities, or the temp ObjectUId for entities that are about to be added to addressbook.
   */
  var/*<String, String>*/ _abPublicIdByCCNameAndCCUid = new HashMap()

  /**
   * @throws ABObjectNotFoundException if a PublicID cannot be retrieved from addressbook
   * @throws IllegalStateException if an operation.getEntityTypeName() returns an unknown type. 
   */
  construct(operation : UpdateOperation, updateBatch : UpdateBatch) {
    _operation = operation
    buildPublicIdsCache(updateBatch)
  }

  /**
   * Extracting the PublicIDs of all ObjectUIds that are found in the UpdateBatch from the AddressBook.
   * We store those PublicIDs in the {@link #_abPublicIdByCCNameAndCCUid} map.
   */
  private function buildPublicIdsCache(updateBatch : UpdateBatch) {
    var linkIds : List = new ArrayList()
    var abEntityNames : List = new ArrayList()
    var ccTypeNameAndUIdKeys : List = new ArrayList()
    var alreadyFoundKeys : Set = new HashSet()

    // Map the temp objectUIds to themselves (entities that are about to be added to the addressbook don't yet have a publicID)
    var cuoa = updateBatch.CreateUpdateOps
    for (cuo in cuoa) {
      var ccTypeName = cuo.EntityTypeName
      var objectUId = cuo.ObjectUId
      var key = getNameAndCCUidKey(ccTypeName, objectUId)
      var prevValue = _abPublicIdByCCNameAndCCUid.put(key, objectUId)
      alreadyFoundKeys.add(key)
      if ( prevValue != null ) {
        throw new IllegalStateException("The UpdateBatch has the following entity in two CreateUpdateOps: \"" + key + "\".");
      }
    }

    // find the ObjectUIds in FieldChangeOps
    var fcuoa = updateBatch.getFieldChangeUpdateOps()
    for (op in fcuoa) {
      var objectUId = op.ObjectUId
      var ccEntityName = op.EntityTypeName
      registerKey(ccEntityName, objectUId, alreadyFoundKeys, linkIds, ccTypeNameAndUIdKeys, abEntityNames)
      //  If this is a reference to another entity, we need to get the ObjectID of the referred entity.
//      var propertyD = BeanInfoCache.INSTANCE.getPropertyByCaseInsensitiveName(getEntityClass(op), op.getField());
//      java.lang.Class propertyType = property.getPropertyType();
      var entityType = TypeSystem.getByFullName("entity." + ccEntityName)
      var propertyInfo = entityType.TypeInfo.getProperty( op.Field )
      if (GWObjectUtils.isGWClass(propertyInfo.Type)) {
        //IIntrinsicType intrinsicType = TypeSystem.get(propertyType);
        registerKey(propertyInfo.Type.RelativeName, op.Value, alreadyFoundKeys, linkIds, ccTypeNameAndUIdKeys, abEntityNames)
      }
    }
    // find the ObjectUIds in DeleteUpdateOps
    var duoa = updateBatch.getDeleteUpdateOps()
    for (op in duoa) {
      var ccEntityName = op.getEntityTypeName()
      var objectUId = op.getObjectUId()
      registerKey(ccEntityName, objectUId, alreadyFoundKeys, linkIds, ccTypeNameAndUIdKeys, abEntityNames)
    }

    // Now that we have all the ObjectUIds, we can get the PublicIds.
    var linkIdsArray = linkIds as String[]
    var abEntityNamesArray = abEntityNames as String[]
    var publicIds = _operation.getContactAPI().getPublicIdFromLinkIdArray(linkIdsArray, abEntityNamesArray)

    // Build the _abPublicIdByCCNameAndCCUid map
    for (publicId in publicIds index i) {
      var key = ccTypeNameAndUIdKeys.get(i) as String
      _abPublicIdByCCNameAndCCUid.put(key, publicId)
    }
  }

  private function registerKey(ccEntityName : String, 
                               objectUId : String, 
                               alreadyFoundKeys : Set, 
                               linkIds : List, 
                               ccTypeNameAndUIdKeys : List, 
                               abEntityNames : List) {
    var key = getNameAndCCUidKey(ccEntityName, objectUId)
    if (!alreadyFoundKeys.contains(key)) {
      var abEntityName = getABEntityName(ccEntityName)
      linkIds.add(objectUId)
      ccTypeNameAndUIdKeys.add(key)
      abEntityNames.add(abEntityName)
      alreadyFoundKeys.add(key)
    }
  }

  override function getABPublicId(ccType : Type, ccEntityUid : String) : String{
    var key = getNameAndCCUidKey(ccType, ccEntityUid)
    var abPublicId = _abPublicIdByCCNameAndCCUid.get(key) as String
    if (abPublicId == null) {
      throw new DisplayableException("Could not find entity with objectUId = '" + ccEntityUid + "' of type '" + ccType + "'")
    }
    return abPublicId
  }

  override function getABValue(ccProperty : IPropertyInfo, ccValue : String) : String{
    var abValue : String
    if (ccValue == null) {
      // Easy
      abValue = ccValue;
    } else {
      var propertyType = ccProperty.Type
      if (GWObjectUtils.isGWClass(propertyType)) {
        // It's a FK
        //var intrinsicType = TypeSystem.get(propertyType);
        abValue = getABPublicId(propertyType, ccValue)
      } else if (GWObjectUtils.isEnum(propertyType)) {
        // It's a typecode
        abValue = _operation.getCCToABConverter().getTranslator().translateTypeCode(propertyType.RelativeName, ccValue)
      } else {
        // It's some other scalar value that requires no special translation.
        abValue = ccValue
      }
    }
    return abValue
  }

  /**
   * gen key by entityName
   */
  private function getNameAndCCUidKey(entityTypeName : String, ccEntityUid : String) : String {
    var type : Type
    try {
      type = TypeSystem.getByFullName("entity." + entityTypeName)
    } catch (e) {      
      throw new IllegalStateException(e.getCause().getMessage())
    }
    var key = getNameAndCCUidKey(type, ccEntityUid)
    return key
  }

  // gen key by Type
  private function getNameAndCCUidKey(ccType : Type, ccEntityUid : String) : String {
    var rootType : Type
    if( ccType.Namespace == "entity") {
      rootType = (ccType as IEntityType).RootType
    } else {
      rootType = ccType
    }
    return rootType.RelativeName + ";" + ccEntityUid
  }

  override function getEntityClass(ccUpdateOp : FieldChangeUpdateOp) : Type {
    var ccEntityName = ccUpdateOp.EntityTypeName
    try {
      return TypeSystem.getByFullName("entity." + ccEntityName)
    } catch (e) {
      throw new DisplayableException("Trying to translate UpdateOperation " + ccUpdateOp, e.Cause)
    }
  }
}
