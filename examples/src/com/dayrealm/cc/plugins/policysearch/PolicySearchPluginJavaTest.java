package com.dayrealm.cc.plugins.policysearch;

import com.guidewire.cc.external.entity.*;
import com.guidewire.cc.external.typelist.*;
import com.guidewire.cc.plugin.policy.search.IPolicySearchAdapter;
import com.guidewire.external.entity.EntityFactory;
import com.guidewire.logging.LoggerCategory;

import external.gw.api.financials.CurrencyAmount;

import java.math.BigDecimal;
import java.util.Date;

/** QA test java plugin for IPolicySearchAdapter.
 *SUMMARY:
 *This plugin provides the following functionalities: (Note: Only support Auto claim for now)
 * 1. In New Claim wizard, search policy, and retrieve policy
 * 2. In existing claim, refresh policy
 * Usages:
 * 1. Login as an adjuster e.g. applegate
 * 2. Open up new claim wizard
 * 3. At step 1, select 'Policy Type' = 'Personal auto', hit  Search button
 * 4. At policy search page, ENTER 'policy #' = XXX OR DON'T ENTER ANYTHING, without other inputs (only policy # input is considered), hit search.
 *  This invokes searchPolicies method in plugin. The plugin provides one search result:
 * 1) One policy with 'policy #' = XXX (the same value as input of policy #)(when input of 'policy #' is XXX')
 * or
 * 2) One policy with 'policy #' = defaultPolicyNumber (When input of 'policy #' is null);
 * 5. Select the policy -> hit next (this invokes retrivePolicyFromPolicySummary method) -> hit back to step 2 and step 3, the plugin should provide most policy data.
 * 6. Finish the creation of this claim
 * 7. Open up the newly created claim, go to policy page, hit 'Edit', hit OK on the confirmation popup, make some changes, hit update
 * 8. Hit 'Refresh Policy' (This invokes retrivePolicy retrivePolicyFromPolicy method), hit OK on the confirmation popup.
 * All the changes made to policy disappear. 
 *
 * @author sshi
 */

 public class PolicySearchPluginJavaTest implements IPolicySearchAdapter {

  private LoggerCategory  _logger  = null;
  private PolicyType  policyType = PolicyType.AUTO_PER;
  private String   address = "Auto policy address";
  private String  city = "QA_city";
  private State state  = State.CA;
  private String insuredName  = "QA GSTest";
  private String  postalCode   = "94444";
  private Date effectiveDate  =  new Date(System.currentTimeMillis() - 1000*60*60*24);
  private Date  expireDate = new Date(System.currentTimeMillis() + 1000*60*60*24);
  private String defaultPolicyNumber  = "defaultPolicyNumber";
  private PolicyStatus policyStatus  = PolicyStatus.INFORCE;
  private Currency  policyCurrency  = Currency.GBP;

  public PolicySearchPluginJavaTest()
  {
    // For plugin, the logger configuration is automcatic because the server has
    // already instaniated and configured a logger factory.
    _logger = LoggerCategory.PLUGIN;
    _logger.info("*** PolicySearchPluginJavaTest is called . ***");
  }


  public PolicyRetrievalResultSet retrievePolicyFromPolicy(Policy policy) {

       _logger.info("*** retrievePolicyFromPolicy is called in PolicySearchPluginJavaTest. ***");
       PolicyRetrievalResultSet result= (PolicyRetrievalResultSet)EntityFactory.getInstance().newEntity(PolicyRetrievalResultSet.class);
       Policy  createdPolicy  = createBasicAuto(policy.getPolicyNumber(),  policyCurrency);
       result.setResult(createdPolicy);
       result.setNotUnique(false);
       return result;
  }
 public PolicyRetrievalResultSet retrievePolicyFromPolicySummary(PolicySummary policySummary) {

       _logger.info("*** retrievePolicyFromPolicySummary is called in PolicySearchPluginJavaTest. ***");
        PolicyRetrievalResultSet result= (PolicyRetrievalResultSet)EntityFactory.getInstance().newEntity(PolicyRetrievalResultSet.class);
        Policy createPolicy = createBasicAuto(policySummary.getPolicyNumber(),  policyCurrency);
        result.setResult(createPolicy);
        result.setNotUnique(false);
        return result;
  }

 public PolicySearchResultSet searchPolicies(PolicySearchCriteria criteria) {
         _logger.info("*** searchPolicies is called in PolicySearchPluginJavaTest. ***");
        PolicySearchResultSet policySet= (PolicySearchResultSet)EntityFactory.getInstance().newEntity(PolicySearchResultSet.class);
        PolicySummary policySummary= (PolicySummary)EntityFactory.getInstance().newEntity(PolicySummary.class);


        if (criteria.getPolicyNumber() != null)
            { policySummary.setPolicyNumber(criteria.getPolicyNumber());}
        else { policySummary.setPolicyNumber(defaultPolicyNumber);}

        policySummary.setPolicyType(policyType);
        policySummary.setAddress(address);
        policySummary.setCity(city);
        policySummary.setState(state);
        policySummary.setInsuredName(insuredName);
        policySummary.setPostalCode(postalCode);
        policySummary.setEffectiveDate(effectiveDate);
        policySummary.setExpirationDate(expireDate);
        policySummary.setStatus(policyStatus);
        policySet.setSummaries(new PolicySummary[] { policySummary });
        policySet.setUncappedResultCount(1);

        return policySet;
 }

  private Policy createBasicAuto(String policyNumber, Currency policyCurrency0 ){
        Policy policy = (Policy) EntityFactory.getInstance().newEntity(Policy.class);
        policy.setPolicyNumber(policyNumber);
        policy.setCurrency(policyCurrency0);
        policy.setPolicyType(policyType);
        policy.setStatus(policyStatus);
        policy.setVerified(true);
        policy.setEffectiveDate(effectiveDate);
        policy.setExpirationDate(expireDate);

        Person insured = (Person) EntityFactory.getInstance().newEntity(Person.class);
        insured.setFirstName("Insured_QA firstname");
        insured.setLastName("Insured_QA lastname");
        insured.setPrimaryPhone(PrimaryPhoneType.WORK);
        insured.setWorkPhone("408-222-2222");
        Address insuredAddress  = (Address) EntityFactory.getInstance().newEntity(Address.class);
        insuredAddress.setAddressLine1("QA plugin testing addressline 1");
        insuredAddress.setCity(city);
        insuredAddress.setState(state);
        insuredAddress.setPostalCode(postalCode);
        insuredAddress.setAddressType(AddressType.BUSINESS);
        insured.setPrimaryAddress(insuredAddress);

        ContactAddress contactAddress  = (ContactAddress)EntityFactory.getInstance().newEntity(ContactAddress.class);
        contactAddress.setAddress(insuredAddress);
        insured.setContactAddresses( new ContactAddress[] { contactAddress });

        ClaimContact insuredClaimContact = (ClaimContact) EntityFactory.getInstance().newEntity(ClaimContact.class);
        insuredClaimContact.setContact(insured);
        ClaimContactRole insuredContactRole   = (ClaimContactRole) EntityFactory.getInstance().newEntity(ClaimContactRole.class);
        insuredContactRole.setRole(ContactRole.INSURED);
        insuredContactRole.setPolicy(policy);
        ClaimContactRole policyHolderContactRole  = (ClaimContactRole)EntityFactory.getInstance().newEntity(ClaimContactRole.class);
        policyHolderContactRole.setRole(ContactRole.POLICYHOLDER);
        policyHolderContactRole.setPolicy(policy);
        insuredClaimContact.setRoles(new ClaimContactRole[] { insuredContactRole, policyHolderContactRole });
        insuredClaimContact.setPolicy(policy);

        PolicyCoverage coverage = (PolicyCoverage)EntityFactory.getInstance().newEntity(PolicyCoverage.class);
        coverage.setDeductible(CurrencyAmount.UTIL.getStrict(BigDecimal.valueOf(500), Currency.USD));
        coverage.setType(CoverageType.ABI);
        coverage.setExposureLimit(CurrencyAmount.UTIL.getStrict(BigDecimal.valueOf(1000), Currency.USD));
        coverage.setIncidentLimit(CurrencyAmount.UTIL.getStrict(BigDecimal.valueOf(2000), Currency.USD));
        policy.setCoverages (new PolicyCoverage[]{coverage });

        Vehicle  vehicle = (Vehicle)EntityFactory.getInstance().newEntity(Vehicle.class);
        vehicle.setMake("Make");
        vehicle.setModel("model");
        vehicle.setYear(1999);
        vehicle.setVin("vin1");
        vehicle.setState(state);
        VehicleRU policyVehicle = (VehicleRU)EntityFactory.getInstance().newEntity(VehicleRU.class);
        policyVehicle.setVehicle(vehicle);
        policyVehicle.setRUNumber(1);
        policy.setTotalVehicles(1);

       return policy;
    }
  }
