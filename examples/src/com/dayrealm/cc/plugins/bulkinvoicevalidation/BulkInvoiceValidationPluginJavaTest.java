package com.dayrealm.cc.plugins.bulkinvoicevalidation;

import com.guidewire.logging.LoggerCategory;
import com.guidewire.cc.plugin.financials.IBulkInvoiceValidationPlugin;
import com.guidewire.cc.external.entity.BIValidationAlert;
import com.guidewire.cc.external.entity.BulkInvoice;
import com.guidewire.cc.external.typelist.BIValidationAlertType;
import com.guidewire.external.entity.EntityFactory;
/**
 * QA test java plugin for IBulkInvoiceValidationPlugin.
 * <p>
 * <b>Summary:</b>
 * <p>
 * This plugin provides the following functionalities
 * <ul>
  * <li> Sets up BulkInvoice validation.
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
 *   &lt;plugin-java javaclass="com.dayrealm.cc.plugins.java.financials.QABulkInvoiceValidationTestJavaPlugin" name="IBulkInvoiceValidationPlugin"/&gt;
 *  </code>
 * <li> In config.xml, comment out the default plugin, which is a gosu plugin.
 * </ul>
 * <b>Usage:</b>
 * <ol>
 * <li> Login as an adjuster e.g. aapplegate
 * <li> Click 'Bulk Invoices' side menu
 * <li> Click 'Create New',
 * <li> Enter 'Invoice#' with a string including 'FAIL'
 * <li> Fill out other required fields, Note: must Add 1 entry to the payment LV, otherwise won't invoke plugin
 * <li> Hit update
 * <li>  Open up the newly created invoice, hit validate
 * <li> The plugin sets the invoice to 'This BulkInvoice is not currently valid', and set two validation alerts with the following contents:
 * <p>
 * Altert Type = Unspecified, Alert Message = QABulkInvoiceValidationTestJavaPlugin set alert 1 b/c invoice number has FAIL
 * <p>
 * Altert Type = Unspecified, Alert Message = QABulkInvoiceValidationTestJavaPlugin set alert 2 b/c invoice number has FAIL
 * <li> Create another invoice but enter Invoice# with a string NOT including 'FAIL'
 * <li> This plugin change the invoice to 'This BulkInvoice is currently valid' and 'No alerts - validation was successful'
 * </ol>
 * <p>
 * @author tlin
 */
public class BulkInvoiceValidationPluginJavaTest implements IBulkInvoiceValidationPlugin {
  private LoggerCategory _logger = null;
  public BulkInvoiceValidationPluginJavaTest()
  {
    _logger = LoggerCategory.PLUGIN;
    _logger.info("*** QABulkInvoiceValidationTestJavaPlugin is called ***");
  }

  public BIValidationAlert[] validateBulkInvoice(BulkInvoice bulkInvoice) {

    EntityFactory entityFactory = EntityFactory.getEntityFactory();
    String invoiceNumber = bulkInvoice.getInvoiceNumber();
    if(invoiceNumber == null) {invoiceNumber = " ";}

    if((invoiceNumber.toUpperCase()).indexOf("FAIL") !=-1)
    {
      BIValidationAlert alert1 = (BIValidationAlert)entityFactory.newEntity(BIValidationAlert.class);
      BIValidationAlert alert2 = (BIValidationAlert)entityFactory.newEntity(BIValidationAlert.class);
      alert1.setAlertMsg("BulkInvoiceValidationPluginJavaTest set alert 1 b/c invoice number has FAIL");
      alert1.setAlertType(BIValidationAlertType.UNSPECIFIED);
      alert1.setBulkInvoice(bulkInvoice);

      alert2.setAlertMsg("BulkInvoiceValidationPluginJavaTest set alert 2 b/c invoice number has FAIL");
      alert2.setAlertType(BIValidationAlertType.UNSPECIFIED);
      alert2.setBulkInvoice(bulkInvoice);

      return new BIValidationAlert[] {alert1, alert2};
    }
    return null;
  }

}
