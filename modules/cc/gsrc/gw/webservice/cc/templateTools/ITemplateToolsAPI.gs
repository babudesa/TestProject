package gw.webservice.cc.templateTools;

uses gw.api.webservice.exception.SOAPException;
uses gw.api.webservice.WSRunlevel;
uses gw.api.webservice.templateTools.TemplateImportResults;

/**
 * ITemplateToolsAPI provides adminstrative and programmer support tools for document
 * templates.
 */
@WebService(WSRunlevel.NODAEMONS)
@ReadOnly
class ITemplateToolsAPI {
  
  construct()
  {
  }
  
  /**
   * Validate that the given template descriptor is in a valid format, and that all of the Gosu used in the descriptor
   * (for ContextObjects and FormFields) is valid given the current datamodel.
   * Current Validation includes the following items:
   * 1) Check that the Gosu expressions in the descriptor (including ContextObject default and possible
   *    value expressions, which must be defined in terms of the available objects, and FormField expressions, which
   *    must be defined in terms of those objects plus the ContestObjects).
   * 2) Check that the permissionRequired attribute, if specified, is a valid system permission code.
   * 3) Check that the default-security-type attribute, if specified, is a valid document security type code.
   * 4) Check that the type attribute, if specified, is a valid document type code.
   * 5) Check that the section attribute, if specified, is a valid section type code.
   *
   * @param templateID - The ID of the template (e.g. ReservationRights.doc)
   * @return A human-readable string detailing the operations performed and any errors encountered.
   */
  @Throws(SOAPException, "")
  public function validateTemplate(templateID : String) : String {
    return getDelegate().validateTemplate( templateID )
  }
  
  /**
   * Performs the validation done in validateTemplate for all of the template descriptors the server can find
   * @return A human-readable string detailing the operations performed and any errors encountered.
   */
  @Throws(SOAPException, "")
  public function validateAllTemplates() : String {
    return getDelegate().validateAllTemplates()    
  }
  
  /**
   * List the templates which the server currently knows about. Useful for sanity-checking arguments to
   * the validation commands.
   * @return A human-readable string detailing the templates available to the server.
   */
  @Throws(SOAPException, "")
  public function listTemplates() : String {
    return getDelegate().listTemplates()
  }

  /**
   * Imports context objects, field groups, and fields from the provided .csv file contents into the corresponding
   * template descriptor file.
   * @param contextObjectFileContents The contents of a file containing the context objects to be imported, in CSV format
   * @param fieldGroupFileContents The contents of a file contianing the field groups to be imported, in CSV format
   * @param fieldFileContents The contents of a file containing the fields to be imported, in CSV format.
   * @param descriptorFileContents The contents of the descriptor file.
   * @return A results object with fields for the new contents of the descriptor file, and a human-readable string detailing
   * the operations performed and any errors encountered.
   */
  @Throws(SOAPException, "")
  public function importFormFields(contextObjectFileContents : String, fieldGroupFileContents : String, fieldFileContents : String, descriptorFileContents : String) : TemplateImportResults {
    return getDelegate().importFormFields(contextObjectFileContents, fieldGroupFileContents, fieldFileContents, descriptorFileContents)
  }
  
  //----------------------------------------------------------------- private helpe methods
  
  private function getDelegate() : gw.api.webservice.cc.templateTools.CCTemplateToolsImpl {
    return new gw.api.webservice.cc.templateTools.CCTemplateToolsImpl()
  }
  
}
