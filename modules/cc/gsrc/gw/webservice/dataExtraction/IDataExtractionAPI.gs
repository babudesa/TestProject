package gw.webservice.dataExtraction;

uses gw.api.webservice.exception.SOAPException
uses gw.api.webservice.exception.PermissionException
uses gw.api.webservice.WSRunlevel;

uses gw.api.webservice.pl.dataExtraction.NVParam
uses gw.api.webservice.cc.dataExtraction.CCDataExtractionAPIImpl
uses java.util.Calendar;

/**
 * Guidewire Software
 * Data extraction API that uses Gosu to render the results
 */
@Deprecated("This web service is deprecated and should be replaced by custom web services, which can be tailored to take exactly the right parameters and to construct a string using Gosu code or templates")
@WebService(WSRunlevel.NODAEMONS)
@ReadOnly
class IDataExtractionAPI {

  /**
   * Finds the specified entity and evaluates the given template. The entity is available as "entityRoot" in the
   * evaluation context of the template. Also, the array of parameters is available in the context as a Map called
   * "parameters"
   * <p>
   * This legacy method is hidden for security reasons. It allows an external caller to run arbitrary Gosu code.
   * Do not use this in a production system.
   *
   * @param entityType  the name of the entity type, for example User or Activity
   * @param entityId    the public id of the entity to find
   * @param params      parameters (name value pairs) to be inserted into the template
   * @param template    the Gosu template, as a string
   * @return the result of executing the template with the given entity and parameters
   */
  @DoNotPublish  
  @Throws(SOAPException, "")
  @Throws(PermissionException, "If the user does not have SOAP Admin permissions.")
  public function findEntityAndRenderWithTemplate(entityType : String, entityId : String, params : NVParam[], template : String) : String {
    var delegate_ = new CCDataExtractionAPIImpl()
    return delegate_.findEntityAndRenderWithTemplate( entityType, entityId, params, template)
  }

  /**
   * Finds the specified entity and evaluates the given template, given by its name. The entity is available as
   * "entityRoot" in the evaluation context of the template. Also, the array of parameters is available in the
   * context as a Map called "parameters"
   *
   * @param entityType     the name of the entity type, for example User or Activity
   * @param entityPublicId the public id of the entity to find
   * @param params         parameters (name value pairs) to be inserted into the template
   * @param templateName   The name of the template file, which must be in config/templates/dataextraction
   * @return the result of executing the template with the given entity and parameters
   */   
  @Throws(SOAPException, "")
  @Throws(PermissionException, "If the user does not have SOAP Admin permissions.")
  public function findEntityAndRenderWithTemplateByName(entityType : String, entityPublicId : String, params : NVParam[], templateName : String) : String {
    var delegate_ = new CCDataExtractionAPIImpl()
    return delegate_.findEntityAndRenderWithTemplateByName(entityType, entityPublicId, params, templateName)
  }

  /**
   * Looks up a claim by number or public id and evaluates the given template. The claim is available as "claim"
   * in the evaluation context of the template. Also, the array of parameters is available in the context as a Map
   * called "parameters"
   * <p>
   * This legacy method is hidden for security reasons. It allows an external caller to run arbitrary Gosu code.
   * Do not use this in a production system.
   *
   * @param claimNumber the number of the claim. Either this or claimId should be non null
   * @param claimId     the public id of the claim. Either this or claimNumber should be non null.
   *   If both claimId and claimNumber are specified, claimNumber is ignored
   * @param params      parameters (name value pairs) to be inserted into the template
   * @param template    the Gosu template, as a string
   * @return the result of executing the template with the given claim and parameters
   */
  @DoNotPublish  
  @Throws(SOAPException, "")
  @Throws(PermissionException, "If the user does not have SOAP Admin permissions.")
  public function viewClaimAndRenderWithTemplate(claimNumber : String, claimId : String, params : NVParam[], template : String) : String {
    var delegate_ = new CCDataExtractionAPIImpl()
    return delegate_.viewClaimAndRenderWithTemplate( claimNumber, claimId, params, template )
  }
  
  /**
   * Looks up a claim by number or public id and evaluates the named template. The claim is available as "claim"
   * in the evaluation context of the template. Also, the array of parameters is available in the context as a Map
   * called "parameters"
   *
   * @param claimNumber      the number of the claim. Either this or claimId should be non null.
   *   If both claimId and claimNumber are specified, claimNumber is ignored
   * @param claimId          the public id of the claim. Either this or claimNumber should be non null
   * @param params           parameters (name value pairs) to be inserted into the template
   * @param templateFileName The name of the template file, which must be in config/templates/dataextraction
   * @return the result of executing the template with the given claim and parameters
   */
  @Throws(SOAPException, "")
  @Throws(PermissionException, "If the user does not have SOAP Admin permissions.")
  public function viewClaimAndRenderWithTemplateByName(claimNumber : String, claimId : String, params : NVParam[], templateFileName : String) : String {
    var delegate_ = new CCDataExtractionAPIImpl()
    return delegate_.viewClaimAndRenderWithTemplateByName( claimNumber, claimId, params, templateFileName )
  }

  /**
   * Finds the claims with the given policy number and then evaluates the given template. The list of matching claims
   * is available as "claim" in the evaluation context of the template. Also, the array of parameters is available in
   * the context as a Map called "parameters"
   * <p>
   * This legacy method is hidden for security reasons. It allows an external caller to run arbitrary Gosu code.
   * Do not use this in a production system.
   *
   * @param policyNumber the number of the policy. Either this or policyId should be non null
   * @param policyId     the public id of the policy. Either this or policyNumber should be non null.
   *   If both policyId and policyNumber are specified, policyNumber is ignored
   * @param params       parameters (name value pairs) to be inserted into the template
   * @param template     the Gosu template, as a string
   * @return the result of executing the template with the found claims and parameters
   */
  @DoNotPublish  
  @Throws(SOAPException, "")
  @Throws(PermissionException, "If the user does not have SOAP Admin permissions.")
  public function findClaimAndRenderWithTemplate(policyNumber : String, policyId : String, params : NVParam[], template : String) : String {
    var delegate_ = new CCDataExtractionAPIImpl()
    return delegate_.findClaimAndRenderWithTemplate( policyNumber, policyId, params, template )
  }
  
  /**
   * Finds the claims with the given policy number and then evaluates the named template. The list of matching claims
   * is available as "claim" in the evaluation context of the template. Also, the array of parameters is available in
   * the context as a Map called "parameters"
   *
   * @param policyNumber     the number of the policy. Either this or policyId should be non null
   * @param policyId         the public id of the policy. Either this or policyNumber should be non null.
   *   If both policyId and policyNumber are specified, policyNumber is ignored
   * @param params           parameters (name value pairs) to be inserted into the template
   * @param templateFileName The name of the template file, which must be in config/templates/dataextraction
   * @return the result of executing the template with the found claims and parameters
   */
  @Throws(SOAPException, "")
  @Throws(PermissionException, "If the user does not have SOAP Admin permissions.")
  public function findClaimAndRenderWithTemplateByName(policyNumber : String, policyId : String, params : NVParam[], templateFileName : String) : String {
    var delegate_ = new CCDataExtractionAPIImpl()
    return delegate_.findClaimAndRenderWithTemplateByName( policyNumber, policyId, params, templateFileName )
  }

  /**
   * Finds the user with the given user name and then evaluates the given template. The user is available as "user"
   * in the evaluation context of the template. Optionally also makes available the user's activities ("activities")
   * and claims ("claims"). The array of parameters is available in the context as a Map called "parameters"
   * <p>
   * This legacy method is hidden for security reasons. It allows an external caller to run arbitrary Gosu code.
   * Do not use this in a production system.
   *
   * @param userName      the user name of the user to be viewed
   * @param getActivities if true, the users activities will be available to the template as "activities".
   *        if false, "activities" will be null
   * @param getClaims     if true, the users claims will be available to the template as "claims".
   *        if false, "claims" will be null
   * @param params        parameters (name value pairs) to be inserted into the template
   * @param template      the Gosu template, as a string
   * @return the result of executing the template with the user, activities, claims and parameters
   */  
  @DoNotPublish  
  @Throws(SOAPException, "")
  @Throws(PermissionException, "If the user does not have SOAP Admin permissions.")
  public function viewUserAndRenderWithTemplate(userName : String, getActivities : boolean, getClaims : boolean, params : NVParam[], template : String) : String {
    var delegate_ = new CCDataExtractionAPIImpl()
    return delegate_.viewUserAndRenderWithTemplate( userName, getActivities, getClaims, params, template )
  }

  /**
   * Finds the user with the given user name and then evaluates the named template. The user is available as "user"
   * in the evaluation context of the template. Optionally also makes available the user's activities ("activities")
   * and claims ("claims"). The array of parameters is available in the context as a Map called "parameters"
   *
   * @param userName         the user name of the user to be viewed
   * @param getActivities    if true, the users activities will be available to the template as "activities".
   *        if false, "activities" will be null
   * @param getClaims        if true, the users claims will be available to the template as "claims".
   *        if false, "claims" will be null
   * @param params           parameters (name value pairs) to be inserted into the template
   * @param templateFileName The name of the template file, which must be in config/templates/dataextraction
   * @return the result of executing the template with the user, activities, claims and parameters
   */
  @Throws(SOAPException, "")
  @Throws(PermissionException, "If the user does not have SOAP Admin permissions.")
  public function viewUserAndRenderWithTemplateByName(userName : String, getActivities : boolean, getClaims : boolean, params : NVParam[], templateFileName : String) : String {
    var delegate_ = new CCDataExtractionAPIImpl()
    return delegate_.viewUserAndRenderWithTemplateByName( userName, getActivities, getClaims, params, templateFileName )
  }

  /**
   * Finds the exposures created in the given time period and then evaluates the given template. The list of exposures
   * is available as "exposures" in the evaluation context of the template. Also, the array of parameters is available
   * in the context as a Map called "parameters"
   * <p>
   * This legacy method is hidden for security reasons. It allows an external caller to run arbitrary Gosu code.
   * Do not use this in a production system.
   *
   * @param startDate The start of the desired time period. Can be null
   * @param endDate   The end of the desired time period. Can be null.
   * @param template  The Gosu template
   * @return Info for each exposure created in the given time period.
   */
  @DoNotPublish  
  @Throws(SOAPException, "")
  @Throws(PermissionException, "If the user does not have SOAP Admin permissions.")
  public function findCreatedExposuresAndRenderWithTemplate(startDate : Calendar, endDate : Calendar, template : String) : String {
    var delegate_ = new CCDataExtractionAPIImpl()
    return delegate_.findCreatedExposuresAndRenderWithTemplate( startDate, endDate, template )
  }

  /**
   * Finds the exposures created in the given time period and then evaluates the named template. The list of exposures
   * is available as "exposures" in the evaluation context of the template. Also, the array of parameters is available
   * in the context as a Map called "parameters"
   *
   * @param startDate        The start of the desired time period. Can be null
   * @param endDate          The end of the desired time period. Can be null
   * @param templateFileName The name of the template file, which must be in config/templates/dataextraction
   * @return Info for each exposure created in the given time period.
   */
  @Throws(SOAPException, "")
  @Throws(PermissionException, "If the user does not have SOAP Admin permissions.")
  public function findCreatedExposuresAndRenderWithTemplateByName(startDate : Calendar, endDate : Calendar, templateFileName : String) : String {
    var delegate_ = new CCDataExtractionAPIImpl()
    return delegate_.findCreatedExposuresAndRenderWithTemplateByName( startDate, endDate, templateFileName )
  }
}
