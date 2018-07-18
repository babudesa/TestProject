package gw.plugin.ccabintegration.impl
uses soap.abintegration.api.IContactAPI
uses soap.abintegration.entity.ABContactUpdateResult
uses soap.abintegration.enums.ABContactUpdateResultType
uses gw.api.util.DisplayableException
uses java.util.ArrayList
uses java.lang.Integer
uses gw.plugin.integration.utils.ErrorGenerator
uses gw.api.util.mapping.ObjectConverter
uses gw.lang.reflect.TypeSystem

class UpdateOperation extends AddressBookOperation {

  construct(converterFactory : ObjectConverterFactory, api : IContactAPI) {
    super(converterFactory, api)
  }

  function updateBatch(updateBatch : UpdateBatch, generator : ErrorGenerator) : ContactUpdateResult {
    var contactUpdateResult = new ContactUpdateResult()
    try {
      var abUpdateBatch = translateUpdateBatch(updateBatch)
      var abContactUpdateResult = getContactAPI().submitUpdates(abUpdateBatch)
      var abToCC = getABToCCConverter()
      var abValidationResult = abContactUpdateResult.getValidationResult()
      contactUpdateResult.ContactValidationResult = abToCC.convert(abValidationResult, typeof abValidationResult) as ValidationResult
      var abTempToPermEntries = abContactUpdateResult.getTempToPermEntries()
      var tempToPermEntries = abToCC.convert(abTempToPermEntries, typeof abTempToPermEntries) as TempToPermEntry[]
      if (tempToPermEntries != null) {
        // TODO: Can't set NULL array on bean, could change to empty array in convert if passed in type?
        contactUpdateResult.TempToPermEntrys = tempToPermEntries
      }
      if (ABContactUpdateResultType.GW_SUCCESS.equals(abContactUpdateResult.getResultType())) {
        var abContact = abContactUpdateResult.getABContact()
        contactUpdateResult.Contact = abToCC.convert(abContact, typeof abContact) as Contact
      } else {
        contactUpdateResult.ContactValidationResult = createValidationResult(abContactUpdateResult, abToCC, generator)
      }
    }
    catch (e) {
      LOGGER.warn(e.getMessage(), e.Cause)
      contactUpdateResult.ContactValidationResult = generator.createGeneralError("Update.Error.General", new Object[0])
      throw e
    }
    return contactUpdateResult
  }

  private function createValidationResult(abContactUpdateResult : ABContactUpdateResult, abToCC : ObjectConverter, generator : ErrorGenerator) : ValidationResult {
    var vr : ValidationResult
    if (ABContactUpdateResultType.GW_ERROR_VALIDATION_MESSAGES.equals(abContactUpdateResult.getResultType())) {
      var abValidationResult = abContactUpdateResult.getValidationResult()
      vr = abToCC.convert(abValidationResult, typeof abValidationResult) as ValidationResult
    } else if (ABContactUpdateResultType.GW_ERROR_MISSING_MATCH_SET_FIELDS.equals(abContactUpdateResult.getResultType())) {
      vr = generator.createGeneralError(abContactUpdateResult.getErrorMessage() )
    } else if (ABContactUpdateResultType.GW_ERROR_DUPLICATE_MATCH_SET_FIELDS.equals(abContactUpdateResult.getResultType())) {
      vr = generator.createGeneralError("Create.Error.DuplicateMatchSetFields", null)
    } else {
      throw new DisplayableException("Unexpected result type: " + abContactUpdateResult.getResultType());
    }
    // Todo: This is a work around to resolve CC-24806
    // Todo: We need a permanent fix, maybe as described in CC-24805
    // when entityID exists, there is no need to set it again.  otherwise, set it to index i to avoid illegalargumentexception
    // see ValidationResult.addToEntityValidations()
    var entityValidations = vr.EntityValidations
    for (entityValidation in entityValidations index i) {
      if( entityValidation.EntityId == null ) {
        entityValidation.EntityId = new Integer(i)
      }
    }
    
    return vr
  }

  /**
   * Translate each of the operations in the update batch from CC to AB
   */
  private function translateUpdateBatch(updateBatch : UpdateBatch) : soap.abintegration.entity.UpdateBatch {
    var result = new soap.abintegration.entity.UpdateBatch()
    var translationContext = new UpdateBatchTranslationContextImpl(this, updateBatch)
    var createUpdateOps = updateBatch.getCreateUpdateOps()
    var abUpdateOps = new ArrayList(createUpdateOps.length)
    for (ccUpdateOp in createUpdateOps) {
      var abCreateOp = translateInsertOperation(translationContext, ccUpdateOp)
      abUpdateOps.add(abCreateOp);
    }
    result.CreateUpdateOps = abUpdateOps as soap.abintegration.entity.CreateUpdateOp[]
    var fieldChangeUpdateOps = updateBatch.getFieldChangeUpdateOps()
    abUpdateOps = new ArrayList(fieldChangeUpdateOps.length)
    for(ccUpdateOp in fieldChangeUpdateOps) {
      var fieldChangeUpdateOp = translateUpdateOperation(translationContext, ccUpdateOp)
      if (fieldChangeUpdateOp != null) {
        abUpdateOps.add(fieldChangeUpdateOp)
      }
    }
    result.FieldChangeUpdateOps = abUpdateOps as soap.abintegration.entity.FieldChangeUpdateOp[]
    var deleteUpdateOps = updateBatch.getDeleteUpdateOps()
    abUpdateOps = new ArrayList(deleteUpdateOps.length)
    for (ccUpdateOp in deleteUpdateOps) {
      var abRemoveOp = translateRemoveOperation(translationContext, ccUpdateOp)
      abUpdateOps.add(abRemoveOp)
    }
    result.DeleteUpdateOps = abUpdateOps as soap.abintegration.entity.DeleteUpdateOp[]
    var abValidationWarnings = new ArrayList<soap.abintegration.entity.ValidationWarning>();
    for (validationWarning in updateBatch.ValidationWarningsToIgnore) {
      abValidationWarnings.add(translateValidationWarning(validationWarning))
    }
    result.ValidationWarningsToIgnore = abValidationWarnings as soap.abintegration.entity.ValidationWarning[]
    return result
  }

  /**
   * Translate a CC delete operation into an AB delete operation
   * @param translationContext
   * @param ccRemoveOp
   * @return
   */
   /* Ptam: While it is okay to have the CC-to-AB specific semantics here, we are forcing the
   *       field mapper to have the same semantic (By inventing getABEntityName()) which is
   *       definitely not desirable. We should rethink about this.
   */
  private function translateRemoveOperation(
          translationContext : UpdateBatchTranslationContext,
          ccRemoveOp : DeleteUpdateOp) : soap.abintegration.entity.DeleteUpdateOp {
    var abRemoveOp = new soap.abintegration.entity.DeleteUpdateOp()
    var ccEntityName = ccRemoveOp.getEntityTypeName()
    abRemoveOp.EntityTypeName = translationContext.getABEntityName(ccEntityName)
    var type = TypeSystem.getByFullName("entity." + ccEntityName)
    abRemoveOp.ObjectUId = translationContext.getABPublicId(type, ccRemoveOp.getObjectUId())
    return abRemoveOp
  }

  /**
   * Translate a CC update operation into an AB update operation.
   * @param translationContext
   * @param ccUpdateOp
   * @return
   */
   /* Ptam: While it is okay to have the CC-to-AB specific semantics here, we are forcing the
   *       field mapper to have the same semantic (By inventing mapUpdateOperation()) which is
   *       definitely not desirable. We should rethink about this.
   */
  private function translateUpdateOperation(
          translationContext : UpdateBatchTranslationContext,
          ccUpdateOp : FieldChangeUpdateOp) : soap.abintegration.entity.FieldChangeUpdateOp {
    var ccType= translationContext.getEntityClass(ccUpdateOp)
    var propName = ccUpdateOp.Field
    var propertyInfo = ccType.TypeInfo.getProperty( propName )
    var fieldMapper = getCCToABConverter().getTranslator().getFieldMapper(ccType, propertyInfo)
    // This is for backward compatibility to avoid upgrade
    // However having gw.plugin.integration.mapping.FieldMapperBase extending the other one confuses Gosu
    // parser
    if (fieldMapper typeis gw.plugin.integration.mapping.FieldMapperBase) {
      var abUpdateOp = new soap.abintegration.entity.FieldChangeUpdateOp()
      abUpdateOp.EntityTypeName = translationContext.getABEntityName(ccUpdateOp.EntityTypeName) 
      abUpdateOp.ObjectUId = translationContext.getABPublicId(ccType, ccUpdateOp.ObjectUId)
      abUpdateOp.Field = fieldMapper.getTargetFieldName( propertyInfo)
      abUpdateOp.Value = translationContext.getABValue(propertyInfo, ccUpdateOp.Value)
      return abUpdateOp
    } else if (fieldMapper typeis gw.api.util.mapping.FieldMapperBase) {
      var abUpdateOp = new soap.abintegration.entity.FieldChangeUpdateOp()
      abUpdateOp.EntityTypeName = translationContext.getABEntityName(ccUpdateOp.EntityTypeName) 
      abUpdateOp.ObjectUId = translationContext.getABPublicId(ccType, ccUpdateOp.ObjectUId)
      abUpdateOp.Field = fieldMapper.getTargetFieldName( propertyInfo)
      abUpdateOp.Value = translationContext.getABValue(propertyInfo, ccUpdateOp.Value)
      return abUpdateOp
    }
    return null
  }
 
  /**
   * Translate a CC insert operation into an AB insert operation
   * @param translationContext
   * @param ccInsertOp
   * @return
   */
   /* Ptam: While it is okay to have the CC-to-AB specific semantics here, we are forcing the
   *       field mapper to have the same semantic (By inventing getABEntityName()) which is
   *       definitely not desirable. We should rethink about this.
   */
  private function translateInsertOperation(
          translationContext : UpdateBatchTranslationContext,
          ccInsertOp : CreateUpdateOp) : soap.abintegration.entity.CreateUpdateOp {
    var ccEntityTypeName = ccInsertOp.getEntityTypeName()
    var abInsertOp = new soap.abintegration.entity.CreateUpdateOp()
    abInsertOp.EntityTypeName = translationContext.getABEntityName(ccEntityTypeName)
    abInsertOp.ObjectUId = ccInsertOp.getObjectUId() // This is a CreateUpdateOp so we know that this is a temporary id so it needs no translation.
    return abInsertOp
  }

  /**
   * Translate a CC validation warning into an AB validation warning
   * @param ccWarning the warning to be translated
   * @return the translated warning
   */
  private function translateValidationWarning(ccWarning : ValidationWarning) : soap.abintegration.entity.ValidationWarning {
      var abWarning = new soap.abintegration.entity.ValidationWarning()
      abWarning.Warning = ccWarning.Warning
      return abWarning
  }
}

