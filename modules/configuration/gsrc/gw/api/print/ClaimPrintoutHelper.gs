package gw.api.print

/**
 *
 * Utility class for use exclusively with claim print out functionality. This class is
 * used in conjuction with ClaimPrintout.pcf, which defines and configures options available
 * for generating a claim file print.
 * 
 */
@Export
class ClaimPrintoutHelper
{
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////  
  // constants
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////  
  
  private static final var EXCLUDE_WIDGET_ID_LIST = { 
       "NoteSearchDV", 
       "ClaimDocumentSearchDV", 
       "ClaimNotesTitle", 
       "StatCodeFilterDV" 
  }
  
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////  
  // Members
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////  
  
  /**
   * Claim in context during claim printout operation
   */
  private var _claim : Claim

  // basic incidents
  private var _fixedPropIncidents : FixedPropertyIncident[]  
  private var _injuryIncidents : InjuryIncident[]

  // travel incidents
  private var _tripIncidents : TripIncident[]
  private var _baggageIncidents : BaggageIncident[]
  
  // homeowner-specific incidents
  private var _dwellingIncident : DwellingIncident
  private var _otherStructureIncident : OtherStructureIncident
  private var _livingExpenseIncident : LivingExpensesIncident
  private var _propContentIncident : PropertyContentsIncident
  
  
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////  
  // Construction
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////  
  construct(c  : Claim) {
    _claim = c    
  }
  
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////  
  // Methods
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////  
  
  function createPrintSettings() : PrintSettings {
    
    // new print settings object
    var newPrintSettings = new PrintSettings();
    
    // pretty print claim number 
    newPrintSettings.setHeaderLabel(displaykey.Web.PrintOut.ClaimNumber(Claim.ClaimNumber))
    
    // don't output these widgets/PCF elements in the claim print. These are specialized
    // objects that are unnecessary (e.g. the search criteria user values in a claim search)
    EXCLUDE_WIDGET_ID_LIST.each( \ wid -> newPrintSettings.InternalSettings.excludeWidget( wid ) )    
    
    return newPrintSettings;
  }

  function canPrintClaimSnapshot() : boolean {
    return gw.api.snapshot.ClaimSnapshotUtil.hasSnapshot(Claim)
      and 
        perm.Claim.view(Claim)
      and 
        perm.System.viewsnapshot
      and 
        (perm.System.viewclaimbasics
        or perm.System.viewclaimparties
        or perm.System.viewpolicy
        or perm.System.viewexposures
        or perm.System.viewclaimnotes
        or perm.System.viewdocs);
  }

  function isPropertyLossType() : boolean {
    return Claim.LossType == LossType.TC_PR
  }
     
  function isTravelClaim() : boolean {
    return 
        Claim.LossType == LossType.TC_TRAV
      and 
        Claim.Policy.PolicyType == PolicyType.TC_TRAVEL_PER
  }
    
  function isHomeownersClaim() : boolean {
    return 
        isPropertyLossType()
    and 
        Claim.Policy.PolicyType == PolicyType.TC_HOMEOWNERS
  }
  
  function isAutoClaim() : boolean {
    return (Claim.LossType == LossType.TC_AUTO);
  }

  // C. Mullin - 2/19/15 - Changed this OOTB function to use the new isWCorELLossType function. 
  function isWorkersCompClaim() : boolean {
    return (util.WCHelper.isWCorELLossType(Claim));
  }

  // Added function for Vocational Rehab section
  function getVocationalRehab() : Exposure {
    return Claim.Exposures.firstWhere(\ e -> e.CoverageSubType.Code.endsWithIgnoreCase("vr"))
  }
  
  function getMedicalDetails() : Exposure {
    return Claim.Exposures.firstWhere(\ e -> e.CoverageSubType.Code.endsWithIgnoreCase("md"))
    //return findExposureForCoverageSubtype(CoverageSubtype.TC_WM_WCID);
  }

  function getIndemityTimeLoss() : Exposure {
    return Claim.Exposures.firstWhere(\ e -> e.CoverageSubType.Code.endsWithIgnoreCase("in"))
    //return findExposureForCoverageSubtype(CoverageSubtype.TC_WI_LW);
  }

  function getEmployerLiability() : Exposure {
    return Claim.Exposures.firstWhere(\ e -> e.CoverageSubType.Code.endsWithIgnoreCase("em"))
    //return findExposureForCoverageSubtype(CoverageSubtype.TC_WL_EL);
  }

  function findExposureForCoverageSubtype(cst : CoverageSubtype) : Exposure {
    for (nextExposure in Claim.Exposures) {
      if (nextExposure.CoverageSubType == cst) {
        return nextExposure;
      }
    }
    return null;
  }  

  /**
   * Generates the title for printing the Claim - Financial Transactions section, depending upon
   * which filter is applied. 
   * 
   * The method is here on the helper class because the PCF cannot access functions embedded in the
   * code section of the same PCF from Page attributes.
   */  
  static function getTitleForFinancialTransactions( claim : Claim, mode : String ) : String {
    var titleMap = new java.util.HashMap<String, String>() {
      "default" -> displaykey.JSP.ClaimFinancials.Financials.Transactions,
      "payment" -> displaykey.Financials.Transaction.ViewPayments,
      "reserve" -> displaykey.Financials.Transaction.ViewReserves,
      "recovery" -> displaykey.Financials.Transaction.ViewRecoveries,
      "recoveryreserve" -> displaykey.Financials.Transaction.ViewRecoveryReserves
    }

    if (perm.Claim.viewnettotalincurred(claim)) {
      return displaykey.JSP.ClaimFinancials.Financials.Incurred(
       gw.api.util.CurrencyUtil.renderAsCurrency(gw.api.util.Math.Nz(gw.api.financials.FinancialsCalculationUtil.getTotalIncurredNet().getAmount(claim).Amount), claim.Currency),
       titleMap.get(mode))
    } else {
      return displaykey.JSP.ClaimFinancials.Financials.NoIncurred(titleMap.get(mode))
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////  
  // Properties
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////  
  
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////  
  // Common Incidents
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////  

  property get BaggageIncidents() : BaggageIncident[] {
    if (_baggageIncidents == null) {
      _baggageIncidents = Claim.BaggageIncidentsOnly
    }
    
    return _baggageIncidents
  }
  
  property get TripIncidents() : TripIncident[] {
    if (_tripIncidents == null) {
        _tripIncidents = claim.TripIncidentsOnly
    }
    
    return _tripIncidents
  }
  
  property get InjuryIncidents() : InjuryIncident[] {
    if (_injuryIncidents == null) {
      _injuryIncidents = Claim.InjuryIncidentsOnly
    }
    
    return _injuryIncidents
  }

  property get FixedPropertyIncidents() : FixedPropertyIncident[] {
    if (_fixedPropIncidents == null) {
      _fixedPropIncidents = Claim.FixedPropertyIncidentsOnly
    }
    return _fixedPropIncidents
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////  
  // Homeowner Claim Incidents
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////  

  property get DwellingIncident() : DwellingIncident {
    if (_dwellingIncident == null) {
      _dwellingIncident = Claim.DwellingIncidentsOnly.first()
    }
        
    return _dwellingIncident
  }

  property get PersonalPropertyIncident() : PropertyContentsIncident {
    if (_propContentIncident == null) {
      _propContentIncident = Claim.PropertyContentsIncidentsOnly.first()
    }
    return _propContentIncident
  }
  
  property get OtherStructureIncident() : OtherStructureIncident {
    if (_otherStructureIncident == null) {
      _otherStructureIncident = Claim.OtherStructureIncidentsOnly.first()
    }
    return _otherStructureIncident
  }
  
  property get LivingExpensesIncident() : LivingExpensesIncident {
    if (_livingExpenseIncident == null) {
      _livingExpenseIncident = Claim.LivingExpensesIncidentsOnly.first()
    }
    return _livingExpenseIncident
  }
    
  protected property get Claim() : Claim {    
    return _claim
  }
}
