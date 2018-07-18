package gw.plugin.pcintegration.v2

uses gw.api.util.mapping.ObjectConverter
uses gw.plugin.pcintegration.v2.PCObjectConverterFactory
uses soap.pcintegrationV2.entity.CCPCSearchCriteria

uses java.util.Calendar
uses gw.plugin.pcintegration.v2.mapping.ProductCodeMapper
uses gw.api.util.CurrencyUtil

/**
 * Handles the conversion of the CC search criteria to a PC search criteria and the 
 * conversion of objects returned from PC.
 */
@Export
class PolicySearchConverter 
{
  public static var INSTANCE : PolicySearchConverter = new PolicySearchConverter()

  private var _pcToCC : ObjectConverter  
  
  public construct() 
  {
    var converterFactory = new PCObjectConverterFactory()
    _pcToCC = converterFactory.getPCToCC()
  }
  
  /**
   * Given a cc PolicySearchCriteria (as created in the policy search UI), translates
   * to the soap object which the policy service uses.
   */
  public function createPCSearchCriteria( ccCriteria : PolicySearchCriteria ) : CCPCSearchCriteria
  {
    var pcCriteria = new CCPCSearchCriteria()

    pcCriteria.PolicyNumber = ccCriteria.PolicyNumber

    if( ccCriteria.PolicyType != null )
    {
      var pcProduct = ProductCodeMapper.getProductCodeForPolicyType( ccCriteria.PolicyType.Code )
      pcCriteria.ProductCode = pcProduct
    }

    var lossDate = ccCriteria.LossDate
    if( lossDate != null )
    {
      var lossCalendar = Calendar.getInstance()
      lossCalendar.Time = lossDate
      pcCriteria.AsOfDate = lossCalendar
    }
    
    pcCriteria.CompanyName = ccCriteria.CompanyName
    pcCriteria.LastName = ccCriteria.LastName
    pcCriteria.FirstName = ccCriteria.FirstName
    pcCriteria.TaxID = ccCriteria.TaxIdString

    pcCriteria.State = ccCriteria.InsuredAddress.State.Code
    
    return pcCriteria
  }
  
  /**
   * Converts the policy object returned from PC into a CC policy entity (recursively converting
   * the entire object map).
   */
  public function convertPCPolicy(pcPolicy : soap.pcintegrationV2.entity.CCPolicy) : Policy 
  {
    var policy = _pcToCC.convert( pcPolicy, soap.pcintegrationV2.entity.CCPolicy ) as Policy
    if( policy.Currency == null ) {
      policy.Currency = CurrencyUtil.getDefaultCurrency()
    }
    return policy
  }
  
  /**
   * Converts the policysummary array returned from PC into an array of CC policysummary 
   * entities.
   */
  public function convertPCPolicySummary(pcSummaries : soap.pcintegrationV2.entity.CCPolicySummary[]) : PolicySummary[]
  {
    return _pcToCC.convert( pcSummaries, soap.pcintegrationV2.entity.CCPolicySummary[] ) as PolicySummary[]
  }
    
}
