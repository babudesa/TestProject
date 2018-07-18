package com.dayrealm.cc.plugins.exchangerate;

import com.guidewire.cc.external.entity.ExchangeRate;
import com.guidewire.cc.external.entity.ExchangeRateSet;
import com.guidewire.cc.external.typelist.Currency;
import com.guidewire.cc.plugin.exchangerate.IExchangeRateSetPlugin;
import com.guidewire.external.entity.EntityFactory;
import com.guidewire.logging.LoggerCategory;

import com.google.common.base.Objects;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;


/**
 * QA test java plugin for IExchangeRateSetPlugin.
 * <p/>
 * <b>Summary:</b>
 * <p/>
 * This plugin provides the following functionalities
 * <ul>
 * <li> Sets up ExchangeRate.
 * <li> Information are written by GW's logger to console and log file, which is specified in logging.properties.
 * </ul>
 * <p/>
 * <b>Setup:</b>
 * <p/>
 * <ul>
 * <li> Compile this file, and put the class to appserver's \\config\plugins\shared\classes directory.
 * <li> In config\plugins\registry\IExchangeRateSetPlugin.xml, add the following code to &lt;plugin-registry&gt; section:
 * <p/>
 * <code>
 * &lt;plugin-java javaclass="com.dayrealm.cc.plugin.exchangerate.ExchangeRateSetPluginJavaTest" name="IExchangeRateSetPlugin"/&gt;
 * </code>
 * <li>  comment out the default plugin, which is a gosu plugin.
 * </ul>
 * <b>Usage:</b>
 * <ol>
 * <li> Login as an adjuster e.g. aapplegate
 * <li> Open up a claim
 * <li> Click 'Create New Reserve',
 * <li> Able to CreateNew Reserve with foreign currency
 */
public class ExchangeRateSetPluginJavaTest implements IExchangeRateSetPlugin {
    private LoggerCategory _logger = null;


    public ExchangeRateSetPluginJavaTest() {
        _logger = LoggerCategory.PLUGIN;
        _logger.info("*** QAExchangeRateSetPluginJavaTest is called ***");
    }

    public ExchangeRateSet createExchangeRateSet() {
        _logger.info("** createExchangeRateSet method is called **");

        Currency defaultCurrency = Currency.USD;
        List<ExchangeRate> exchangeRates = new ArrayList<ExchangeRate>();

     for (Currency currency : Currency.values()) {
        if (!Objects.equal(currency,defaultCurrency)) {
                        BigDecimal rate;
                        if (Objects.equal(currency,Currency.RUB)) {
                            rate = new BigDecimal(".0101");
                        } else {

                            if (Objects.equal(currency,Currency.EUR))
                                rate = new BigDecimal(".8202");

                            else
                                rate = new BigDecimal("10.2");
                        }

                        exchangeRates.add(createExchangeRate(currency, defaultCurrency, rate));
        }
        }

        return createMarketExchangeRateSet("Test ExchangeRateSet", "From SampleExchangeRateSetPlugin.",
                new Date(), null, exchangeRates);
    }

    private static ExchangeRate createExchangeRate(Currency baseCurrency, Currency priceCurrency, BigDecimal rate) {
        ExchangeRate rateEntity = (ExchangeRate) EntityFactory.getInstance().newEntity(ExchangeRate.class);
        rateEntity.setBaseCurrency(baseCurrency);
        rateEntity.setPriceCurrency(priceCurrency);
        rateEntity.setRate(rate);
        return rateEntity;
    }

    private static ExchangeRateSet createMarketExchangeRateSet(String name, String description, Date effectiveDate,
                                                               Date expireDate, List<ExchangeRate> rates) {
        ExchangeRateSet rateSet = (ExchangeRateSet) EntityFactory.getInstance().newEntity(ExchangeRateSet.class);
        rateSet.setName(name);
        rateSet.setDescription(description);
        rateSet.setEffectiveDate(effectiveDate);
        rateSet.setExpireDate(expireDate);
        rateSet.setMarketRates(true);
        for (ExchangeRate rate : rates) {
            rateSet.addToExchangeRates(rate);
        }
        return rateSet;
    }

}
