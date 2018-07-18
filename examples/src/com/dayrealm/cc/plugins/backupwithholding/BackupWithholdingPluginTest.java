package com.dayrealm.cc.plugins.backupwithholding;

import com.guidewire.cc.plugin.financials.IBackupWithholdingPlugin;
import com.guidewire.cc.external.entity.Deduction;
import com.guidewire.cc.external.entity.Check;
import com.guidewire.cc.external.entity.Contact;
import com.guidewire.cc.external.typelist.Currency;
import com.guidewire.cc.external.typelist.DeductionType;
import com.guidewire.cc.external.typelist.ReportabilityType;
import com.guidewire.logging.LoggerCategory;
import com.guidewire.external.entity.EntityFactory;
import external.gw.api.financials.CurrencyAmount;
import java.math.BigDecimal;
import java.math.RoundingMode;



/**
 * Class description...
 *
 * @author sshi
 */
public class BackupWithholdingPluginTest implements IBackupWithholdingPlugin {
  private LoggerCategory _logger = null;
  private String _standardWithholding = ".2";
  private DeductionType  _deductionType = DeductionType.DEPENDENT;
  private ReportabilityType _reportableTypes = ReportabilityType.REPORTABLE;

  public BackupWithholdingPluginTest()
  {
    // For plugin, the logger configuration is automcatic because the server has
    // already instaniated and configured a logger factory.
    _logger = LoggerCategory.PLUGIN;
    _logger.info("*** BackupWithholdingPlugin is called ***");
 
  }


  public Deduction[] getDeductions(Check check) {
       _logger.info("*** BackupWithholdingPlugin getDeductions is called ***");

      if (check == null || check.getReportableAmount() == null) {
      return new Deduction[0];
      }


      EntityFactory entityFactory = EntityFactory.getInstance();
      BigDecimal  withholdingRate = new BigDecimal(_standardWithholding);
    
     if (check.getReportability().equals(_reportableTypes))
     {
         Contact vendor = check.getVendor();
        if (vendor == null) {
        _logger.warn("Payee Type not a Vendor");
        withholdingRate = null;
        }
     }
 
    Currency claimCurrency = check.getClaim().getCurrency();
    Currency transCurrency = check.getCurrency();
    Currency reportingCurrency =  Currency.USD;



     if (withholdingRate != null) {
        Deduction withholding = (Deduction) entityFactory.newEntity(Deduction.class);
          
        
        withholding.setCheck(check);

        BigDecimal deductionTransAmount = withholdingRate.multiply(check.getReportableAmount().getAmount()).setScale(2);
        CurrencyAmount deductTransCA = CurrencyAmount.UTIL.get(deductionTransAmount , transCurrency);
        withholding.setTransactionAmount(deductionTransAmount);

        CurrencyAmount deductClaimCA = deductTransCA;
        if (!claimCurrency.equals(transCurrency)) {
          BigDecimal transToClaimER = check.getTransToClaimExchangeRateEntityRate();
          deductClaimCA = deductTransCA.convert( claimCurrency, transToClaimER, RoundingMode.HALF_UP );
        }
        CurrencyAmount deductReportingCA = deductClaimCA;
        if (!reportingCurrency.equals(claimCurrency)) {
          BigDecimal claimToReportingER = check.getClaimToReportingExchangeRateEntityRate();
          deductReportingCA = deductClaimCA.convert( reportingCurrency, claimToReportingER, RoundingMode.HALF_UP );
        }

         withholding.setClaimAmount(deductClaimCA);
         withholding.setReportingAmount(deductReportingCA.getAmount());

        withholding.setComments("Comments by Backupwithholding Plugin");
        withholding.setDeductionType(_deductionType);

         _logger.info("Backup withholding plugin is set to 20% of Reportable amount");
         return new Deduction[]{withholding};
    }
    return new Deduction[0];

  }
}





