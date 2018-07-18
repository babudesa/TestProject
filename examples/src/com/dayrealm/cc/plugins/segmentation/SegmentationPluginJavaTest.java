package com.dayrealm.cc.plugins.segmentation;

import com.guidewire.cc.plugin.segmentation.ISegmentationAdapter;
import com.guidewire.cc.external.typelist.*;
import com.guidewire.cc.external.entity.SegmentationResult;
import com.guidewire.logging.LoggerCategory;
import com.guidewire.external.entity.EntityFactory;

import java.util.Properties;
import java.io.ByteArrayInputStream;

/**
 * QA test java plugin for ISegmentationAdapter.
 * <p>
 * <b>Summary:</b><br />
 * <p/>
 * <ul>
 * <li>This plugin is responsible for determining the segmentation and strategy for a claim and exposure. </li>
 * </ul>
 * <br />
 * <b>Setup:</b><br />
 *
 * <ul>
 * <li>Compile QAISegmentationAdapterTest and put the class to <br />
 * appserver's \\config\plugins\segmentation\classes directory.</b><br /><br />
 * <li> In config.xml, comment out the default implementation of ISegmentationAdapter if existed.</li><br /><br />
 * <li> In config.xml, add the following code:  <br /><br />
 * &lt;plugin-java name="ISegmentationAdapter" plugindir="segmentation"<br />
 * javaclass="com.dayrealm.cc.plugins.java.segmentation.QAISegmentationAdapterTest"&gt;<br />
 * &lt;/plugin-java&gt;<br /><br />
 * <li> Copy ISegmentationAdapter_Claim.gs and ISegmentationAdapter_Exposure.gs from<br />
 * \\depot\dev\cc\qa\integration\plugin\templates, and put them under server's config\templates\plugins.</li><br /><br />
 * </p>
 * </ul>
 *
 * <b>Usage:</b><br />
 * <ul>
 * <li> Login as aapplegate</li>
 * <li> Open a Claim.</li>
 * <li> Select "New Exposure".</li>
 * <li> Create a "Towing and Labor" exposure.</li>
 * <li> Click on the just created "Towing and Labor" exposure.  Under "Detail" - "Coding" section you will see
 * "Segment Auto - high complexity" and "Handling Strategy Auto - Fast Track", which are purposely set to see our test is working.</li>
 * </ul>
 * <ul>
 * <li> Login as aapplegate</li>
 * <li> New an auto Claim.</li>
 * <li> Select "Quick Auto Claim".</li>
 * <li> Follow through creating steps.  After click "Finish" button. View the finished claim.  </li>
 * <li> Click on "Loss Detail".  Under "General" section you will see "Claim Segment Auto - low complexity" and
 * "Claim Strategy Auto - Investigate", which are set based on the logic in this plugin.  </li>
 * </ul>
 * <ul>
 * <li> Login as aapplegate</li>
 * <li> New an auto Claim.</li>
 * <li> Without select "Quick Auto Claim".</li>
 * <li> Follow through creating steps with adding a "Theft" exposure.</li>
 * <li> After click "Finish". View the finished claim.  </li>
 * <li> Click on "Loss Detail".  Under "General" section you will see "Claim Segment Auto - mid complexity" and
 * "Claim Strategy Auto - Investigate", which are set based on the logic in this plugin.  </li>
 * <li> Click on "Exposure" and then "Theft".  Under "Detail" - "Coding" section you will see
 * "Segment Auto - mid complexity " and "Handling Strategy Auto - Investigate ", which are set
 * based on the logic in this plugin.  </li>
 * </ul>
 * <b>Future:</b>
 * <ul>
 * <li> There are more test cases than the ones listed above.  Different "Loss Type" and different exposures.
 * Add more test cases as you desired. </li>
 * <li> Automate to QA default</li>
 * </ul>
 *
 * @author tlin
 */
/*
<plugin-java name="ISegmentationAdapter" plugindir="segmentation"
    javaclass="com.dayrealm.cc.plugins.java.segmentation.QAISegmentationAdapterTest">
</plugin-java>
*/
public class SegmentationPluginJavaTest implements ISegmentationAdapter {
  private LoggerCategory _logger = null;
  private static final String CLAIM_LOSS_TYPE = "ClaimLossType";
  private static final String EXPOSURE_SEGMENT = "ExposureSegment";
  private static final String EXPOSURE_TYPE = "ExposureType";
  private static final String EXPOSURE_SEVERITY = "ExposureSeverity";
  private static final String EXPOSURE_LOST_PARTY = "ExposureLostParty";
  private static final String EXPOSURE_VE_INCIDENT = "ExposureVEIncident";

  public SegmentationPluginJavaTest() {
    _logger = LoggerCategory.PLUGIN;
    _logger.info("*** ISegmentationAdapter is initialized in SegmentationPluginJavaTest. ***");
  }
  /**
  * Determine the segmentatation and strategy for a claim.
  *
  * @param templateData - Data to use to decide how to perform segmentation.
  * @return The non-null result of the segmentation.
  */
  public SegmentationResult segmentClaim(java.lang.String templateData) {
    _logger.info("** SegmentClaim method is called in SegmentationPluginJavaTest. **");
    Properties props = loadPropertiesFromTemplateData(templateData);
    String claimLossType = props.getProperty(CLAIM_LOSS_TYPE);
    String exposureSegment = props.getProperty(EXPOSURE_SEGMENT);
    if (!claimLossType.equals("null")) {
        if (claimLossType.equals(LossType.AUTO.getCode()))
          return getAutoClaimSegmentationResult(exposureSegment);
        else if (claimLossType.equals(LossType.PR.getCode()))
          return getPRClaimSegmentationResult(exposureSegment);
        else if (claimLossType.equals(LossType.WC.getCode()))
          return getWCClaimSegmentationResult(exposureSegment);
        else if (claimLossType.equals(LossType.GL.getCode()))
          return getGLClaimSegmentationResult(exposureSegment);
    }
    return null; //shouldn't happen
  }
  /**
  * Determine the segmentatation and strategy for an exposure.
  *
  * @param templateData - Data to use to decide how to perform segmentation.
  * @return The non-null result of the segmentation.
  */
  public SegmentationResult segmentExposure(java.lang.String templateData) {
    _logger.info("** SegmentExposure method is called in SegmentationPluginJavaTest. **");
    Properties props = loadPropertiesFromTemplateData(templateData);
    String claimLossType = props.getProperty(CLAIM_LOSS_TYPE);
    if (claimLossType.equals(LossType.AUTO.getCode()))
      return getAutoExposureSegmentationResult(props);
    else if (claimLossType.equals(LossType.PR.getCode()))
      return getPRExposureSegmentationResult(props);
    else if (claimLossType.equals(LossType.WC.getCode()))
      return getWCExposureSegmentationResult(props);
    else if (claimLossType.equals(LossType.GL.getCode()))
      return getGLExposureSegmentationResult(props);
    return null;//shouldn't happen
  }
  private Properties loadPropertiesFromTemplateData(String templateData) {
    Properties props = new Properties();
    try {
    	props.load(new ByteArrayInputStream(templateData.getBytes()));
    } catch (java.io.IOException IOE) {
    	_logger.error("ISegmentationTestAdapter:  Could not obtain the template data");
      throw new RuntimeException("ISegmentationTestAdapter:  Could not obtain the template data");
    }
    return props;
  }
  private SegmentationResult getAutoClaimSegmentationResult(String exposureSegment) {
    EntityFactory entityFactory = EntityFactory.getEntityFactory();
    SegmentationResult segmentationResult = (SegmentationResult)entityFactory.newEntity(SegmentationResult.class);
    //SegmentationResult segmentationResult = new SegmentationResult();
    ClaimStrategy claimStrategy = null;
    if (exposureSegment.equals("null"))
       exposureSegment = "auto_low";
    if (exposureSegment.equals("auto_high"))
      claimStrategy = ClaimStrategy.AUTO_FAST;
    else if (exposureSegment.equals("auto_mid") || exposureSegment.equals("auto_low"))
      claimStrategy = ClaimStrategy.AUTO_NORMAL;
    segmentationResult.setSegmentType(exposureSegment);
    segmentationResult.setStrategyType(claimStrategy == null ? ClaimStrategy.AUTO_NORMAL.getCode() : claimStrategy.getCode());
    _logger.info("* ClaimSegment = " + segmentationResult.getSegmentType() + " *");
    _logger.info("* ClaimStrategy = " + segmentationResult.getStrategyType() + " *");
    return segmentationResult;
  }
  private SegmentationResult getPRClaimSegmentationResult(String exposureSegment) {
    EntityFactory entityFactory = EntityFactory.getEntityFactory();
    SegmentationResult segmentationResult = (SegmentationResult)entityFactory.newEntity(SegmentationResult.class);
    ClaimStrategy claimStrategy = null;
    if (exposureSegment.equals("null"))
       exposureSegment = "prop_low";
    if (exposureSegment.equals("prop_high"))
      claimStrategy = ClaimStrategy.PROP_FAST;
    else if (exposureSegment.equals("prop_mid") || exposureSegment.equals("prop_low"))
      claimStrategy = ClaimStrategy.PROP_NORMAL;
    segmentationResult.setSegmentType(exposureSegment);
    segmentationResult.setStrategyType(claimStrategy == null ? ClaimStrategy.PROP_NORMAL.getCode() : claimStrategy.getCode());
    _logger.info("* ClaimSegment = " + segmentationResult.getSegmentType() + " *");
    _logger.info("* ClaimStrategy = " + segmentationResult.getStrategyType() + " *");
    return segmentationResult;
  }
  private SegmentationResult getWCClaimSegmentationResult(String exposureSegment) {
    EntityFactory entityFactory = EntityFactory.getEntityFactory();
    SegmentationResult segmentationResult = (SegmentationResult)entityFactory.newEntity(SegmentationResult.class);
    ClaimStrategy claimStrategy = null;
    if (exposureSegment.equals("null"))
       exposureSegment = "wc_liability";
    if (exposureSegment.equals("wc_med_only"))
      claimStrategy = ClaimStrategy.WC_FAST;
    else if (exposureSegment.equals("wc_lost_time"))
      claimStrategy = ClaimStrategy.WC_NORMAL;
    else if (exposureSegment.equals("wc_liability"))
      claimStrategy = ClaimStrategy.WC_INVESTIGATE;
    segmentationResult.setSegmentType(exposureSegment);
    segmentationResult.setStrategyType(claimStrategy == null ? ClaimStrategy.WC_INVESTIGATE.getCode() : claimStrategy.getCode());
    _logger.info("* ClaimSegment = " + segmentationResult.getSegmentType() + " *");
    _logger.info("* ClaimStrategy = " + segmentationResult.getStrategyType() + " *");
    return segmentationResult;
  }
  private SegmentationResult getGLClaimSegmentationResult(String exposureSegment) {
    EntityFactory entityFactory = EntityFactory.getEntityFactory();
    SegmentationResult segmentationResult = (SegmentationResult)entityFactory.newEntity(SegmentationResult.class);
    ClaimStrategy claimStrategy = null;
    if (exposureSegment.equals("null"))
       exposureSegment = "liab_low";
    if (exposureSegment.equals("liab_high"))
      claimStrategy = ClaimStrategy.LIAB_FAST;
    else if (exposureSegment.equals("liab_mid") || exposureSegment.equals("liab_low"))
      claimStrategy = ClaimStrategy.LIAB_NORMAL;
    segmentationResult.setSegmentType(exposureSegment);
    segmentationResult.setStrategyType(claimStrategy == null ? ClaimStrategy.LIAB_NORMAL.getCode() : claimStrategy.getCode());
    _logger.info("* ClaimSegment = " + segmentationResult.getSegmentType() + " *");
    _logger.info("* ClaimStrategy = " + segmentationResult.getStrategyType() + " *");
    return segmentationResult;
  }
  private SegmentationResult getAutoExposureSegmentationResult(Properties props) {
    String exposureType = props.getProperty(EXPOSURE_TYPE);
    String exposureSeverity = props.getProperty(EXPOSURE_SEVERITY);
    String exposureLostParty = props.getProperty(EXPOSURE_LOST_PARTY);
    String exposureVEIncident = props.getProperty(EXPOSURE_VE_INCIDENT);
    EntityFactory entityFactory = EntityFactory.getEntityFactory();
    SegmentationResult segmentationResult = (SegmentationResult)entityFactory.newEntity(SegmentationResult.class);
    if ((exposureType.equals(ExposureType.VEHICLEDAMAGE.getCode()) ||
        exposureType.equals(ExposureType.BODILYINJURYDAMAGE.getCode()) ||
        exposureType.equals(ExposureType.PIPDAMAGES.getCode()) ||
        exposureType.equals(ExposureType.PROPERTYDAMAGE.getCode()) ||
        exposureType.equals(ExposureType.TOWONLY.getCode())) &&
        (!exposureSeverity.equals("null") && (exposureSeverity.equals(SeverityType.MINOR.getCode()) ||
        exposureSeverity.equals(SeverityType.MODERATE_AUTO.getCode())))) {
      segmentationResult.setSegmentType(ClaimSegment.AUTO_LOW.getCode());
      segmentationResult.setStrategyType(ClaimStrategy.AUTO_NORMAL.getCode());
      _logger.info("* ExposureSegment = " + segmentationResult.getSegmentType() + " *");
      _logger.info("* ExposureStrategy = " + segmentationResult.getStrategyType() + " *");
    } else if
        (exposureType.equals(ExposureType.THEFT.getCode()) ||
        exposureType.equals(ExposureType.PIPDAMAGES.getCode()) ||
        exposureType.equals(ExposureType.PROPERTYDAMAGE.getCode()) ||
        (!exposureLostParty.equals("null") &&
            exposureLostParty.equals(LossPartyType.THIRD_PARTY.getCode()))) {
      segmentationResult.setSegmentType(ClaimSegment.AUTO_MID.getCode());
      segmentationResult.setStrategyType(ClaimStrategy.AUTO_NORMAL.getCode());
      _logger.info("* ExposureSegment = " + segmentationResult.getSegmentType() + " *");
      _logger.info("* ExposureStrategy = " + segmentationResult.getStrategyType() + " *");
    } else if ((!exposureSeverity.equals("null") && (exposureSeverity.equals(SeverityType.SEVERE_INJURY.getCode()) ||
        exposureSeverity.equals(SeverityType.MAJOR_INJURY.getCode()) ||
        exposureSeverity.equals(SeverityType.FATAL.getCode()))) ||
        (!exposureVEIncident.equals("null") && exposureVEIncident.equals("TRUE"))) {
      segmentationResult.setSegmentType(ClaimSegment.AUTO_HIGH.getCode());
      segmentationResult.setStrategyType(ClaimStrategy.AUTO_FAST.getCode());
      _logger.info("* ExposureSegment = " + segmentationResult.getSegmentType() + " *");
      _logger.info("* ExposureStrategy = " + segmentationResult.getStrategyType() + " *");
    } else {
//      segmentationResult.setSegmentType(ClaimSegment.AUTO_MID.getCode());
//      segmentationResult.setStrategyType(ClaimStrategy.AUTO_NORMAL.getCode());
      segmentationResult.setSegmentType(ClaimSegment.AUTO_HIGH.getCode());
      segmentationResult.setStrategyType(ClaimStrategy.AUTO_FAST.getCode());
      _logger.info("* ExposureSegment = " + segmentationResult.getSegmentType() + " *");
      _logger.info("* ExposureStrategy = " + segmentationResult.getStrategyType() + " *");
    }
    return segmentationResult;
  }
  private SegmentationResult getPRExposureSegmentationResult(Properties props) {
    String exposureType = props.getProperty(EXPOSURE_TYPE);
    String exposureSeverity = props.getProperty(EXPOSURE_SEVERITY);
    String exposureLostParty = props.getProperty(EXPOSURE_LOST_PARTY);
    EntityFactory entityFactory = EntityFactory.getEntityFactory();
    SegmentationResult segmentationResult = (SegmentationResult)entityFactory.newEntity(SegmentationResult.class);
    if ((exposureType.equals(ExposureType.PERSONALPROPERTYDAMAGE.getCode()) ||
        exposureType.equals(ExposureType.PROPERTYDAMAGE.getCode())) &&
        (!exposureSeverity.equals("null") && exposureSeverity.equals(SeverityType.MINOR.getCode()))) {
      segmentationResult.setSegmentType(ClaimSegment.PROP_LOW.getCode());
      segmentationResult.setStrategyType(ClaimStrategy.PROP_NORMAL.getCode());
      _logger.info("* ExposureSegment = " + segmentationResult.getSegmentType() + " *");
      _logger.info("* ExposureStrategy = " + segmentationResult.getStrategyType() + " *");
    } else if (exposureType.equals(ExposureType.LOSSOFUSEDAMAGE.getCode()) ||
        (!exposureSeverity.equals("null") &&
            exposureSeverity.equals(SeverityType.MODERATE_PROP.getCode())) ||
        (!exposureLostParty.equals("null") &&
            exposureLostParty.equals(LossPartyType.THIRD_PARTY.getCode()))) {
      segmentationResult.setSegmentType(ClaimSegment.PROP_MID.getCode());
      segmentationResult.setStrategyType(ClaimStrategy.PROP_NORMAL.getCode());
      _logger.info("* ExposureSegment = " + segmentationResult.getSegmentType() + " *");
      _logger.info("* ExposureStrategy = " + segmentationResult.getStrategyType() + " *");
    } else if ((!exposureSeverity.equals("null") && (exposureSeverity.equals(SeverityType.MAJOR_PROP.getCode()) ||
        exposureSeverity.equals(SeverityType.FATAL.getCode())) ||
        (!exposureLostParty.equals("null") && exposureLostParty.equals(LossPartyType.INSURED.getCode())))) {
      segmentationResult.setSegmentType(ClaimSegment.PROP_HIGH.getCode());
      segmentationResult.setStrategyType(ClaimStrategy.PROP_FAST.getCode());
      _logger.info("* ExposureSegment = " + segmentationResult.getSegmentType() + " *");
      _logger.info("* ExposureStrategy = " + segmentationResult.getStrategyType() + " *");
    } else {
      segmentationResult.setSegmentType(ClaimSegment.PROP_MID.getCode());
      segmentationResult.setStrategyType(ClaimStrategy.PROP_NORMAL.getCode());
      _logger.info("* ExposureSegment = " + segmentationResult.getSegmentType() + " *");
      _logger.info("* ExposureStrategy = " + segmentationResult.getStrategyType() + " *");
    }
    return segmentationResult;
  }
  private SegmentationResult getWCExposureSegmentationResult(Properties props) {
    String exposureType = props.getProperty(EXPOSURE_TYPE);
    EntityFactory entityFactory = EntityFactory.getEntityFactory();
    SegmentationResult segmentationResult = (SegmentationResult)entityFactory.newEntity(SegmentationResult.class);
    if (exposureType.equals(ExposureType.MEDPAY.getCode())) {
      segmentationResult.setSegmentType(ClaimSegment.WC_MED_ONLY.getCode());
      segmentationResult.setStrategyType(ClaimStrategy.WC_FAST.getCode());
      _logger.info("* ExposureSegment = " + segmentationResult.getSegmentType() + " *");
      _logger.info("* ExposureStrategy = " + segmentationResult.getStrategyType() + " *");
    } else if (exposureType.equals(ExposureType.LOSTWAGES.getCode())) {
      segmentationResult.setSegmentType(ClaimSegment.WC_LOST_TIME.getCode());
      segmentationResult.setStrategyType(ClaimStrategy.WC_INVESTIGATE.getCode());
      _logger.info("* ExposureSegment = " + segmentationResult.getSegmentType() + " *");
      _logger.info("* ExposureStrategy = " + segmentationResult.getStrategyType() + " *");
    } else {
      segmentationResult.setSegmentType(ClaimSegment.WC_LIABILITY.getCode());
      segmentationResult.setStrategyType(ClaimStrategy.WC_NORMAL.getCode());
      _logger.info("* ExposureSegment = " + segmentationResult.getSegmentType() + " *");
      _logger.info("* ExposureStrategy = " + segmentationResult.getStrategyType() + " *");
    }
    return segmentationResult;
  }
  private SegmentationResult getGLExposureSegmentationResult(Properties props) {
    String exposureType = props.getProperty(EXPOSURE_TYPE);
    String exposureSeverity = props.getProperty(EXPOSURE_SEVERITY);
    String exposureLostParty = props.getProperty(EXPOSURE_LOST_PARTY);
    EntityFactory entityFactory = EntityFactory.getEntityFactory();
    SegmentationResult segmentationResult = (SegmentationResult)entityFactory.newEntity(SegmentationResult.class);
    if ((exposureType.equals(ExposureType.GENERALDAMAGE.getCode()) ||
        exposureType.equals(ExposureType.LOSSOFUSEDAMAGE.getCode())) &&
        (!exposureSeverity.equals("null") && exposureSeverity.equals(SeverityType.MINOR.getCode()))) {
      segmentationResult.setSegmentType(ClaimSegment.LIAB_LOW.getCode());
      segmentationResult.setStrategyType(ClaimStrategy.LIAB_NORMAL.getCode());
      _logger.info("* ExposureSegment = " + segmentationResult.getSegmentType() + " *");
      _logger.info("* ExposureStrategy = " + segmentationResult.getStrategyType() + " *");
    } else if ((!exposureLostParty.equals("null") && exposureLostParty.equals(LossPartyType.THIRD_PARTY.getCode())) ||
        (!exposureSeverity.equals("null") && exposureSeverity.equals(SeverityType.MODERATE_GEN.getCode()))) {
      segmentationResult.setSegmentType(ClaimSegment.LIAB_MID.getCode());
      segmentationResult.setStrategyType(ClaimStrategy.LIAB_NORMAL.getCode());
      _logger.info("* ExposureSegment = " + segmentationResult.getSegmentType() + " *");
      _logger.info("* ExposureStrategy = " + segmentationResult.getStrategyType() + " *");
    } else if (!exposureSeverity.equals("null") && exposureSeverity.equals(SeverityType.SEVERE_GEN.getCode())) {
      segmentationResult.setSegmentType(ClaimSegment.LIAB_HIGH.getCode());
      segmentationResult.setStrategyType(ClaimStrategy.LIAB_FAST.getCode());
      _logger.info("* ExposureSegment = " + segmentationResult.getSegmentType() + " *");
      _logger.info("* ExposureStrategy = " + segmentationResult.getStrategyType() + " *");
    } else {
      segmentationResult.setSegmentType(ClaimSegment.LIAB_MID.getCode());
      segmentationResult.setStrategyType(ClaimStrategy.LIAB_NORMAL.getCode());
      _logger.info("* ExposureSegment = " + segmentationResult.getSegmentType() + " *");
      _logger.info("* ExposureStrategy = " + segmentationResult.getStrategyType() + " *");
    }
    return segmentationResult;
  }
}
