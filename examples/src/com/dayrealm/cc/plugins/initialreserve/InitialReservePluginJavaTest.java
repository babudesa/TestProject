package com.dayrealm.cc.plugins.initialreserve;

import com.guidewire.cc.external.entity.Reserve;
import com.guidewire.cc.external.entity.TransactionLineItem;
import com.guidewire.cc.external.typelist.CostCategory;
import com.guidewire.cc.external.typelist.CostType;
import com.guidewire.cc.external.typelist.Currency;
import com.guidewire.cc.external.typelist.LineCategory;
import com.guidewire.cc.plugin.financials.IInitialReserveAdapter;
import com.guidewire.external.entity.EntityFactory;
import com.guidewire.logging.LoggerCategory;
import external.gw.api.financials.CurrencyAmount;
import gw.util.StreamUtil;

import java.math.BigDecimal;
import java.nio.charset.CharacterCodingException;
import java.util.Properties;

/**
 * QA test java plugin for IInitialReserveAdapter.
 * <p>
 * <b>Summary:</b>
 * <p>
 * This plugin provides the following functionalities
 * <ul>
 * <li> Sets up initial reserve, based on the information getting from template
 * <li> Information are written by GW's logger to console and log file, which is specified in logging.properties.
 * </ul>
 * <p>
 * <b>Setup:</b>
 * <p>
 * <ul>
 * <li> Compile this file, and put the class to appserver's \\config\plugins\QAPlugins\classes directory.
 * <li> In config.xml, add the following code to &lt;plugin-registry&gt; section:
 * <p>
 * <code>
 *   &lt;plugin-java javaclass="com.dayrealm.cc.plugins.java.financials.QAInitialReserveTestJavaPlugin" name="IInitialReserveAdapter" plugindir="QAPlugin"/&gt;
 * </code>
 * <li> Copy //templates/IInitialReserveAdapter_Exposure.gs to appserver's \\config\templates\plugins dirctory.
 * Note: There is No default plugin implementation out of box.
 * <p> If nothing is configured in the config.xml for this, then the InitialReserves ruleset is executed to determine the initial reserves for an exposure.
 * <p> Otherwise, if the customer has implemented the IInitialReservesAdapter external interface to produce a plugin, this plugin can be configured in the config.xml so that it gets executed instead of the ruleset.
 * </ul>
 * <b>Usage:</b>
 * <ul>
 * <li> Login as any adjuster e.g. aapplegate
 * <li> Open up an existing claim
 * <li> Create one exposure with 'primary coverage' is Comprehensive, or 'liablity - Auto bodily injury'. The plugin should set up initialReserve to $2,098
 * <li> Create an exposure with other primary coverage, the plugin should set up initialReserve to $288.
 * <li> Create one vehicle exposure in an auto claim, the plugin should set up initialReserve to $288 or $2,098, instead of the value set up by Initial Reserve sample ruleset
 * </ul>
 * <p>
 *
 * @author tlin
 */
public class InitialReservePluginJavaTest  implements IInitialReserveAdapter {
  private TransactionLineItem _lineItem1, _lineItem2;
  private Reserve _reserve1, _reserve2;
  private LoggerCategory _logger = null;

  public InitialReservePluginJavaTest()
  {
    // For plugin, the logger configuration is automcatic because the server has
    // already instaniated and configured a logger factory.
    _logger = LoggerCategory.PLUGIN;
    _logger.info("*** InitialReservePluginJavaTest is called ***");
  }

  /**
   * Set up initialReserve. If exposure's primary coverage is  Comprehensive, or 'liablity - Auto bodily injury'. The plugin should set up initialReserve to $2,098
   * If exposure's primary coverage is other type, set initialReserve to $388.
   * @param exposureData
   * @return Reserve -- Reserve array
   */

  public Reserve[] getInitialReserves(String exposureData)
  {
    _logger.info("** getInitialReserves() in InitialReservePluginJavaTest is called ** ");
    EntityFactory entityFactory = EntityFactory.getEntityFactory();
    _reserve1  = (Reserve)entityFactory.newEntity(Reserve.class);
    _reserve2  = (Reserve)entityFactory.newEntity(Reserve.class);
    _lineItem1 = (TransactionLineItem)entityFactory.newEntity(TransactionLineItem.class);
    _lineItem2 = (TransactionLineItem)entityFactory.newEntity(TransactionLineItem.class);


    Properties expoProp = null;
    try {
      expoProp = StreamUtil.toProperties(exposureData);
    } catch (CharacterCodingException e) {
      throw new RuntimeException(e);
    }

      _logger.info ("primaryCoverage"+ expoProp.getProperty("primaryCoverage"));

    if (expoProp != null && expoProp.getProperty("primaryCoverage").equals("Watercraft Liability")) {
      String coverageType = expoProp.getProperty("primaryCoverage");
      String claimNumber = expoProp.getProperty("claimNumber");

      _logger.info("** primaryCoverage is " + coverageType + " **");
      _logger.info("** claimNumber is " + claimNumber + " **");

       _reserve1.addToLineItems(_lineItem1);
       _reserve1.setComments("Initial reserve1 setted by InitialReservePluginJavaTest");
       _reserve1.setCostType(CostType.CLAIMCOST);
       _reserve1.setCostCategory(CostCategory.BODY);
       _reserve1.setCurrency(Currency.USD);
       _lineItem1.setAmount(CurrencyAmount.UTIL.get(new BigDecimal(1998), null));
       _lineItem1.setLineCategory(LineCategory.DIAGNOSTIC);

      _reserve2.addToLineItems(_lineItem2);
      _reserve2.setComments("Initial reserve2 setted by InitialReservePluginJavaTest");
      _reserve2.setCostType(CostType.CLAIMCOST);
      _reserve2.setCostCategory(CostCategory.INSPECTION);
      _reserve2.setCurrency(Currency.USD);
      _lineItem2.setAmount(CurrencyAmount.UTIL.get(new BigDecimal(98), null));
      _lineItem2.setLineCategory(LineCategory.MILEAGE);

      _logger.info("** In Claim: " + claimNumber + " ,set two reserves with amount $1998 and $98 **");
      return new Reserve[] {_reserve1, _reserve2};
    } else {

      _reserve1.addToLineItems(_lineItem1);
      _reserve1.setComments("Initial reserve1 setted by InitialReservePluginJavaTest");
      _reserve1.setCostType(CostType.AOEXPENSE);
      _reserve1.setCostCategory(CostCategory.OTHER);
      _reserve1.setCurrency(Currency.EUR);
      _lineItem1.setTransactionCurrencyAmount(CurrencyAmount.UTIL.get(288, Currency.EUR));
      _lineItem1.setLineCategory(LineCategory.OTHER);
      
      _logger.info("** set one reserve with amount \u20AC288 **");
      return new Reserve[] {_reserve1};
    }
  }
}

