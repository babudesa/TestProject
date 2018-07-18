package gw.api.claim
uses gw.api.financials.CurrencyAmount

@Export
class FnolWizardHomeownersHelper extends HomeownersHelper {
  
  private var _emsServiceSelected : boolean as EMSServiceSelected
  private var _emsVendor : Company as EMSVendor
  private var _debrisRemovalServiceSelected : boolean as DebrisRemovalServiceSelected
  private var _debrisRemovalVendor : Company as DebrisRemovalVendor
  private var _lodgingProvider : Company as LodgingProvider

  construct(claim : Claim) {
    super(claim, new IncidentListUIHelper(claim, {
      IncidentUIHelpers.INJURY,
      IncidentUIHelpers.PROPERTY_LIABILITY
    }))

    if (DwellingIncidentPresent) {
      _emsVendor = DwellingIncident.ems
      _emsServiceSelected = DwellingIncident.EMSInd
      _debrisRemovalVendor = DwellingIncident.debrisremoval
      _debrisRemovalServiceSelected = DwellingIncident.DebrisRemovalInd
    } else {
      _emsVendor = _claim.ems.length > 0 ? _claim.ems[0] : null
      _emsServiceSelected = (_emsVendor != null)
      _debrisRemovalVendor = _claim.debrisremoval.length > 0 ? _claim.debrisremoval[0] : null
      _debrisRemovalServiceSelected = (_debrisRemovalVendor != null)
    }
  }
  
  property get DwellingIncidentPresent() : boolean {
    return _dwellingIncident != null
  }
  
  property set DwellingIncidentPresent(present : boolean) {
    if (present != DwellingIncidentPresent) {
      // remember the vendors so we can set them on the right object when we're done 
      // creating or deleting the incident
      var vendorState = deselectVendors()
      if (present) {
        _dwellingIncident = _claim.newIncident(entity.DwellingIncident) as DwellingIncident
      } else {
        _claim.removeFromIncidents(_dwellingIncident)
        _dwellingIncident = null
      }
      reselectVendors( vendorState )
    }
  }
  
  property get OtherStructureIncidentPresent() : boolean {
    return _otherStructureIncident != null
  }
  
  property set OtherStructureIncidentPresent(present : boolean) {
    if (present != OtherStructureIncidentPresent) {
      if (present) {
        _otherStructureIncident = _claim.newIncident(entity.OtherStructureIncident) as OtherStructureIncident
      } else {
        _claim.removeFromIncidents(_otherStructureIncident)
        _otherStructureIncident = null
      }
    }
  }
  
  property get PropertyContentsIncidentPresent() : boolean {
    return _propertyContentsIncident != null
  }
  
  property set PropertyContentsIncidentPresent(present : boolean) {
    if (present != PropertyContentsIncidentPresent) {
      if (present) {
        _propertyContentsIncident = _claim.newIncident(entity.PropertyContentsIncident) as PropertyContentsIncident
      } else {
        _claim.removeFromIncidents(_propertyContentsIncident)
        _propertyContentsIncident = null
      }
    }
  }
  
  property get LivingExpensesIncidentPresent() : boolean {
    return _livingExpensesIncident != null
  }
  
  property set LivingExpensesIncidentPresent(present : boolean) {
    if (present != LivingExpensesIncidentPresent) {
      if (present) {
        _livingExpensesIncident = _claim.newIncident(entity.LivingExpensesIncident) as LivingExpensesIncident
      } else {
          _claim.removeFromIncidents(_livingExpensesIncident)
          _livingExpensesIncident = null
          if(_lodgingProvider != null) {
            _claim.removeRole("lodgingprovider", _lodgingProvider)
            _lodgingProvider = null
          }
       }
     }
  }
  
  property get LodgingProvider() : Company {
    if (_lodgingProvider != null and !lodgingProviderIsSet()) {
      _lodgingProvider = null
    }
    return _lodgingProvider
  }
  
  property set LodgingProvider(vendor : Company) {
    if (LivingExpensesIncidentPresent) {
      LivingExpensesIncident.lodgingprovider = vendor
    } else {
      if (_lodgingProvider != null) {
        _claim.removeRole("lodgingprovider", _lodgingProvider)
      }
      _claim.addRole("lodgingprovider", vendor)
    }
    _lodgingProvider = vendor
  }

  private function lodgingProviderIsSet() : boolean {
    if (_lodgingProvider == null) {
      return false
    } else if (LivingExpensesIncidentPresent) {
      return LivingExpensesIncident.lodgingprovider == _lodgingProvider
    } else {
      return _claim.lodgingprovider.contains(_lodgingProvider)
    }
  }
  
  function getIncidentCoverageLimit(coverageType : CoverageType) : CurrencyAmount {
    var coverages = _claim.Policy.PrimaryLocationCoverages
    if (coverages != null) {
      var coverage = coverages.firstWhere(\ c -> c.Type == coverageType)
      return coverage.ExposureLimit
    } else {
      return null
    }
  }
    
  property set EMSServiceSelected(selected : boolean) {
    if (selected != _emsServiceSelected) {
      if (selected) {
        if (DwellingIncidentPresent) {
          DwellingIncident.EMSInd = true
        }
      } else {
        if (DwellingIncidentPresent) {
          DwellingIncident.EMSInd = false
          DwellingIncident.ems = null
        } else {
          removeClaimEMS()
        }
      }
      _emsServiceSelected = selected
      _emsVendor = null
    }
  }
  
  property get EMSVendor() : Company {
    if (_emsVendor != null and !emsVendorIsSet()) {
      _emsVendor = null
    }
    return _emsVendor
  }
  
  property set EMSVendor(vendor : Company) {
    if (DwellingIncidentPresent) {
      DwellingIncident.ems = vendor
    } else {
      removeClaimEMS()
      if(vendor!=null) {
        _claim.addRole("ems", vendor)
      }
    }
    _emsVendor = vendor
  }
  
  private function removeClaimEMS() {
    if (_emsVendor != null) {
      _claim.removeRole("ems", _emsVendor)
    }
  }
 
  private function emsVendorIsSet() : boolean {
    if (_emsVendor == null) {
      return false
    } else if (DwellingIncidentPresent) {
      return DwellingIncident.ems == _emsVendor
    } else {
      return _claim.ems.contains(_emsVendor)
    }
  }

  property set DebrisRemovalServiceSelected(selected : boolean) {
    if (selected != _debrisRemovalServiceSelected) {
      if (selected) {
        if (DwellingIncidentPresent) {
          DwellingIncident.DebrisRemovalInd = true
        }
      } else {
        if (DwellingIncidentPresent) {
          DwellingIncident.DebrisRemovalInd = false
          DwellingIncident.debrisremoval = null
        } else {
          removeClaimDebrisRemoval()
        }
      }
      _debrisRemovalServiceSelected = selected
      _debrisRemovalVendor = null
    }
  }
  
  property get DebrisRemovalVendor() : Company {
    if (_debrisRemovalVendor != null and !debrisRemovalVendorIsSet()) {
      _debrisRemovalVendor = null
    }
    return _debrisRemovalVendor
  }
  
  property set DebrisRemovalVendor(vendor : Company) {
    if (DwellingIncidentPresent) {
      DwellingIncident.debrisremoval = vendor
    } else {
      removeClaimDebrisRemoval()
      if(vendor!=null)
        _claim.addRole("debrisRemoval", vendor)
    }
    _debrisRemovalVendor = vendor
  }
  
  private function removeClaimDebrisRemoval() {
    if (_debrisRemovalVendor != null) {
      _claim.removeRole("debrisRemoval", _debrisRemovalVendor)
    }
  }
 
  private function debrisRemovalVendorIsSet() : boolean {
    if (_debrisRemovalVendor == null) {
      return false
    } else if (DwellingIncidentPresent) {
      return DwellingIncident.debrisremoval == _debrisRemovalVendor
    } else {
      return _claim.debrisremoval.contains(_debrisRemovalVendor)
    }
  }
  
  private function deselectVendors() : VendorSelectionState {
    var state = new VendorSelectionState()
    state.EMSWasSelected = EMSServiceSelected
    state.EMSFormerVendor = EMSVendor
    state.DRWasSelected = DebrisRemovalServiceSelected
    state.DRFormerVendor = DebrisRemovalVendor
    EMSServiceSelected = false
    DebrisRemovalServiceSelected = false
    return state
  }
  
  private function reselectVendors(state : VendorSelectionState) {
    EMSServiceSelected = state.EMSWasSelected
    DebrisRemovalServiceSelected = state.DRWasSelected
    if(EMSServiceSelected) {
      EMSVendor = state.EMSFormerVendor
    }
    if(DebrisRemovalServiceSelected) {
      DebrisRemovalVendor = state.DRFormerVendor
    }
  }
  
  private class VendorSelectionState {
    var _EMSWasSelected : boolean as EMSWasSelected
    var _EMSFormerVendor : Company as EMSFormerVendor
    var _DRWasSelected : boolean as DRWasSelected
    var _DRFormerVendor : Company as DRFormerVendor
  }
}
