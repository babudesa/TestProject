/**
 * Created by IntelliJ IDEA.
 * User: echeng
 * Date: May 10, 2006
 * Time: 11:10:52 AM
 * To change this template use File | Settings | File Templates.
 */


package com.dayrealm.cc.plugins.claimnumgen;

import com.guidewire.cc.plugin.claimnumbergen.IClaimNumGenAdapter;
import com.guidewire.cc.plugin.util.CurrentUserUtil;
import com.guidewire.logging.LoggerCategory;
import com.guidewire.pl.plugin.InitializablePlugin;
import com.guidewire.pl.plugin.util.SequenceUtil;

import gw.util.StreamUtil;

import java.nio.charset.CharacterCodingException;
import java.util.Map;
import java.util.Properties;

/**
 * Test java plugin for IClaimNumGenAdapter.
 * <p/>
 * <b>Summary:</b>
 * <p/>
 * This plugin provides the following functionalities
 * <ul>
 * <li> The plugin generates new claim number.
 * <li> The plugin generates temp claim number.
 * <li> Can place plugin to a custom directory, which is specified by <code>plugindir</code>
 * <li> Can define name/value parameters to a plugin in config.xml
 * <li> Can  use InitizlizablePlugin's setParameters() method to get 1) ROOT_DIR  2)TEMP_DIR 3)Parameters for plugin
 * <li> Uses CurrentUserUtil.getCurrentUser(),   CurrentUserUtil.getSequenceUtil()
 * <li> All the above information are written by GW's logger to console and 2 log files , which is specified in logging.properties.
 * </ul>
 * <p/>
 * <b>Setup:</b>
 * <p/>
 * <ul>
 * <li> Compile this file, and put the class to appserver's \\config\plugins\QAPlugins\classes directory.
 * <li> In config.xml, add the following code to &lt;plugin-registry&gt; section:
 * <p/>
 * <code>
 * &lt;plugin-java javaclass="com.guidewire.testplugins.cc.plugins.claimnumgen.ClaimNumGenJavaPluginTest" name="IClaimNumGenAdapter" plugindir="QAPlugin"&gt;
 * &lt;param name="prefixNewClaimNum" value="6"&gt;
 * &lt;param name="prefixTempClaimNum" value="8"&gt;
 * &lt;/plugin-java&gt;
 * </code>
 * <p/>
 * <li> In config.xml, comment out:
 * <p/>
 * &lt;adapter clazz="com.guidewire.cc.plugin.claimnumbergen.internal.ClaimNumGenDemoAdapter" name="IClaimNumGenAdapter"&gt;
 * </ul>
 * <li> Note: in appserver's \config\logging\logging.properties, by default, ClaimNumGen category is set up with the following codes:
 * <p> If not, should add these code
 * log4j.category.plugin.ClaimNumGen=INFO, ClaimNumGenLog
 * <p/>
 * log4j.additivity.ClaimNumGenLog=true
 * <p/>
 * log4j.appender.ClaimNumGenLog=org.apache.log4j.DailyRollingFileAppender
 * <p/>
 * log4j.appender.ClaimNumGenLog.File=C:/deployments/servers/tomcat-5.5.17/instances/11400/logs/cc400/claimnumgen.log
 * <p/>
 * log4j.appender.ClaimNumGenLog.DatePattern = .yyyy-MM-dd
 * <p/>
 * log4j.appender.ClaimNumGenLog.layout=org.apache.log4j.PatternLayout
 * <p/>
 * log4j.appender.ClaimNumGenLog.layout.ConversionPattern=%-10.10X{server} %-4.4X{user} %d{ISO8601} %p %m%n
 * <li> Note: in appserver's \config\logging\logging.properties, by default, Plugin category is set up with the following codes:
 * <p> If not, should add these code
 * log4j.category.plugin=INFO, PluginsLog
 * <p/>
 * log4j.additivity.PluginsLog=true
 * <p/>
 * log4j.appender.PluginsLog=org.apache.log4j.DailyRollingFileAppender
 * <p/>
 * log4j.appender.PluginsLog.File=C:/deployments/servers/tomcat-5.5.17/instances/11400/logs/cc400/plugins.log
 * <p/>
 * log4j.appender.PluginsLog.DatePattern = .yyyy-MM-dd
 * <p/>
 * log4j.appender.PluginsLog.layout=org.apache.log4j.PatternLayout
 * <p/>
 * log4j.appender.PluginsLog.layout.ConversionPattern=%-10.10X{server} %-4.4X{user} %d{ISO8601} %p %m%n
 * <p/>
 * <p/>
 * <b>Usage:</b>
 * <ul>
 * <li> Login as any adjuster e.g. aapplegate
 * <li> Open up new claim wizard, create a claim of any type, at wizard step 4, the plugin should generate a temp claim number.
 * See generateTempClaimNumber(String templateData) method for detail
 * <li> Finish the last step of new claim wizard, the plugin should generate a new claim number,
 * See generateNewClaimNumber(String templateData) method for detail
 * <li> All the above information are written by GW's logger to console and TWO log files, which are specified in logging.properties.
 * <p> By default, should be claimnumgen.log and plugins.log
 * </ul>
 * <p/>
 * <b>Future:</b>
 * <li> Create smoketest script
 *
 * @author echeng
 */

/* In config.xml, add the following code
<plugin-java javaclass="com.guidewire.testplugins.cc.plugins.claimnumgen.ClaimNumGenJavaPluginTest" name="IClaimNumGenAdapter" plugindir="QAPlugins">
                <param name="prefixNewClaimNum" value="6"/>
                <param name="prefixTempClaimNum" value="8"/>
          </plugin-java>
*/
public class ClaimNumGenPluginJavaTest implements IClaimNumGenAdapter, InitializablePlugin {
  private String _tmpDir;
  private String _rootDir;
  private String _prefixNew = "7";
  private String _prefixTemp = "3";
  private LoggerCategory _logger = null;
  private LoggerCategory _claimNumCategory = null;

  public ClaimNumGenPluginJavaTest() {
    // For plugin, the logger configuration is automcatic because the server has
    // already instaniated and configured a logger factory.
    _logger = LoggerCategory.PLUGIN;
    _claimNumCategory = new LoggerCategory(LoggerCategory.PLUGIN, "ClaimNumGen");
    logInfoToLogFiles("*** ClaimNumGenPluginJavaTest is called ***");
  }

  public void setParameters(Map params) {
    _tmpDir = (String) params.get(InitializablePlugin.TEMP_DIR);
    _rootDir = (String) params.get(InitializablePlugin.ROOT_DIR);
    logInfoToLogFiles("** The tmp dir: " + _tmpDir + "**\n");
    logInfoToLogFiles("** The root dir: " + _rootDir + "**\n");
    _claimNumCategory.info("** The tmp dir: " + _tmpDir + "**\n");

    if (params.containsKey("prefixNewClaimNum")) {
      _prefixNew = ((String) params.get("prefixNewClaimNum")).substring(0, 1);
    } else {
      logInfoToLogFiles("** Can't find param prefixNewClaimNum, and use the default prefix " + _prefixNew + "**\n");
    }

    if (params.containsKey("prefixTempClaimNum")) {
      _prefixTemp = ((String) params.get("prefixTempClaimNum")).substring(0, 1);
    } else {
      logInfoToLogFiles("** Can't find param prefixTempClaimNum, and use the default prefix " + _prefixTemp + "**\n");
    }
    logInfoToLogFiles("** prefix for new claim is: " + _prefixNew + "**\n");
    logInfoToLogFiles("** prefix for temp claim is: " + _prefixTemp + "**\n");
  }

  /**
   * Generate a new claim number,
   * which begins with X77-random two digits-100000, then increase by 1  (X - if no prefix is specified, use default value 7)
   *
   * @param templateData
   * @return a new claim number
   */

  public String generateNewClaimNumber(String templateData) {
    logInfoToLogFiles("The current user is : " + CurrentUserUtil.getCurrentUser().getUser());
    //  verify CC-27612  CC-27640
//    IScriptHost scriptHost = (IScriptHost) PluginRegistry.getPluginRegistry().getPluginByName("IScriptHost");
    // Object s = scriptHost.evaluate("3+4");
    // System.out.println("Using IScriptHost.evaluate: " + s.toString());
  //  System.out.println("IScriptHost toString: " + scriptHost.toString());
    return genClaimNum(templateData, true);
  }

  /**
   * Generate a temp claim number,
   * which begins with X77-random two digits-100000, then increase by 1  (X - if no prefix is specified, use default value 3)
   *
   * @param templateData
   * @return a temp claim number
   */
  public String generateTempClaimNumber(String templateData) {
    return genClaimNum(templateData, false);
  }

  public void cancelNewClaimNumber(String string, String string1) {
    // Based on JavaDoc, it is perfectly acceptable to leave the implementation of this method empty
  }

  // ---------------------------------------------- Private Methods --------------------------------------------
  private void logInfoToLogFiles(String info) {
    _claimNumCategory.info(info);
    _logger.info(info);
  }

  private String genClaimNum(String templateData, boolean isNewClaim) {
    Properties claimProperties;
    try {
      claimProperties = StreamUtil.toProperties(templateData);
    } catch (CharacterCodingException ex) {
      throw new RuntimeException(ex);
    }

    logInfoToLogFiles("**Claim Info:" + claimProperties + "**\n");
    java.util.Random generator = new java.util.Random(System.currentTimeMillis());
    int claimBody = generator.nextInt(100);
    if (claimBody < 10) {
      claimBody += 10;
    }

    String sequenceKey = (isNewClaim ? "TestClaimNumberGenJavaNew" : "TestClaimNumberGenJavaTemp");
    SequenceUtil sequenceUtil = SequenceUtil.getSequenceUtil();
    long sequence = sequenceUtil.next(100000, sequenceKey);
    String claimPostfix = String.valueOf(sequence);
    String prefix = (isNewClaim ? _prefixNew : _prefixTemp);
    String claimNumType = (isNewClaim ? "NEW" : "TEMP");
    String claimNumber = prefix + "77" + "-" + claimBody + "-" + claimPostfix;
    logInfoToLogFiles("ClaimNumGenPluginJavaTest returned " + claimNumType + " ClaimNumber:  " + claimNumber);
    return claimNumber;
  }
}

