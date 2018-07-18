package com.dayrealm.cc.plugins.deduction;

import com.guidewire.cc.external.entity.Deduction;
import com.guidewire.cc.external.typelist.DeductionType;
import com.guidewire.cc.external.typelist.Currency;
import com.guidewire.cc.plugin.financials.IDeductionAdapter;
import com.guidewire.external.entity.EntityFactory;
import com.guidewire.logging.LoggerCategory;
import gw.util.StreamUtil;


import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.CharacterCodingException;
import java.util.Properties;
import external.gw.api.financials.CurrencyAmount;

/**
 * QA test java plugin for QADeductionTestJavaPlugin
 * <p>
 * <b>Summary:</b>
 * <p>
 * This plugin provides the following functionalities
 * <ul>
  * <li> Setup creating deductions from a payment.
 * <li> Information are written by GW's logger to console and log file, which is specified in logging.properties.
 * </ul>
 * <p>
 * <b>Setup:</b>
 * <p>
 * <ul>
 * <li> Compile this file, and put the class to appserver's \\config\plugins\shared\classes directory.
 * <li> In config.xml, add the following code to &lt;plugin-registry&gt; section:
 * <p>
 * <code>
 *   &lt;plugin-java javaclass="com.dayrealm.cc.plugins.java.financials.QADeductionTestJavaPlugin" name="IDeductionAdapter"/&gt;
 *  </code>
 * <li> Copy \\template\IDeductionAdpater_check.gs to appserver's \\config\templates\plugins directory
 * <li> Out of box, there is No default demo plugin need to be commented out
 * <li> Note: Multiple Deduction adapters can be configured for a single system, and all will be executed any time a new payment is created.
 * <p>  But based on http://wiki/index.php/Plugin_Config_Changes#Adapter_sets, DeductionAdapter never had more than a single adapter associated with it.
 * </ul>
 * <b>Usage:</b>
 * <ol>
 * <li> Login as aapplegate
 * <li> Open up one claim e.g. 235-53-365870
 * <li> Hit 'New Transaction' side menu -> Check
 * <li> At step1 of 3: search and select one contact of 'vendor(company)' type as 'Primary Payee'
 * <p> ( In search page, put 'Type' = 'Vendor (Company)', State = 'California') , 'Type'='Vendor', 'Report As' = 'Reportable', fill out other required fields
 * <li> At step2 of 3, fill out required fields
 * <li> As step 3 of 3, check up the 'Deductions' field.
 * <p> This plugin will deduct one dollar from the check per each transaction (check created) (Plus there is a hidden deduction value set by StandardWithholdingRate param in config.xml, the total deduction is $28 + $1 = $29)
 * <li> Open up the newly created check, under 'Payment Details' -> Deductions section, there are 2 entries: 1 is  deduction type = 'Lawyer', Comments ='Comments by QADeductionTestJavaPlugin', Amount = '$1.00'
 * </ol>
 * <p>
 * 
 * @author tlin
 */
public class DeductionPlugin implements IDeductionAdapter {
  private LoggerCategory _logger = null;

  public DeductionPlugin()
  {
    // For plugin, the logger configuration is automcatic because the server has
    // already instaniated and configured a logger factory.
    _logger = LoggerCategory.PLUGIN;
    _logger.info("*** DeductionPlugin is called ***");
  }

  public Deduction[] getDeductions(String checkData) {
    _logger.info("*** DeductionPlugin getDeductions is called ***");
   Properties checkProperties = null;
    try {
      checkProperties = StreamUtil.toProperties(checkData);
    } catch (CharacterCodingException e) {
      throw new RuntimeException(e);
    }

   // log all incoming properties
    for ( Object key : checkProperties.keySet()) {
       _logger.info( key + ": " + checkProperties.getProperty((String)key));
    }
    EntityFactory entityFactory = EntityFactory.getInstance();
    String checkGrossAmountStr = checkProperties.getProperty("checkGrossAmount");
    BigDecimal checkGrossAmount = new BigDecimal(checkGrossAmountStr);
    Currency checkCurrency = Currency.getByCode(checkProperties.getProperty("checkCurrency"));
    BigDecimal transToClaimER = new BigDecimal(checkProperties.getProperty(("transToClaimExchangeRate")));
    Currency claimCurrency = Currency.getByCode(checkProperties.getProperty("claimCurrency"));
    Currency reportingCurrency = Currency.getByCode(checkProperties.getProperty("reportingCurrency"));

    BigDecimal deductTransAmount = checkGrossAmount.multiply(new BigDecimal(".1"));
    CurrencyAmount deductTransCA = CurrencyAmount.UTIL.get(deductTransAmount, checkCurrency);
    Deduction deduction1 = (Deduction) entityFactory.newEntity(Deduction.class);
    deduction1.setTransactionAmount(deductTransCA.getAmount());
    CurrencyAmount deductClaimCA = deductTransCA;
    if (!claimCurrency.equals(checkCurrency)) {
          deductClaimCA = deductTransCA.convert( claimCurrency, transToClaimER, RoundingMode.HALF_UP );
     }
     CurrencyAmount deductReportingCA = deductClaimCA;
     if (!reportingCurrency.equals(claimCurrency)) {
    BigDecimal claimToReportingER = new BigDecimal(checkProperties.getProperty(("claimToReportingExchangeRate")));
          deductReportingCA = deductClaimCA.convert( reportingCurrency, claimToReportingER, RoundingMode.HALF_UP );
     }

    deduction1.setClaimAmount(deductClaimCA);
      if (!reportingCurrency.equals(claimCurrency)) {
     deduction1.setReportingAmount(deductReportingCA.getAmount());
      }
    else{
    deduction1.setReportingAmount(deductClaimCA.getAmount());
      }
    deduction1.setComments("Comments by DeductionPlugin");
    deduction1.setDeductionType(DeductionType.LAWYER);

    return new Deduction[] {deduction1};

      }
  
}
