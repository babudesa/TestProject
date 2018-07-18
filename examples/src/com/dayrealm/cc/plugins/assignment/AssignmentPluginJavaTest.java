package com.dayrealm.cc.plugins.assignment;

import com.guidewire.cc.plugin.assignment.IAssignmentAdapter;
import com.guidewire.logging.LoggerCategory;
import gw.plugin.assignment.AssignmentCommand;
import gw.plugin.assignment.AssignmentResponse;
import gw.util.StreamUtil;

import java.util.Properties;
import java.nio.charset.CharacterCodingException;

/**
 * QA test java plugin for IAssignmentAdapter.
 * <p>
 * <b>Summary:</b>
 * <p>
 * This plugin provides the following functionalities
 * <ul>
 * <li> The plugin assigns activity based on templateData
 * <li> The plugin assigns exposure based on templateData
 * <li> The plugin assigns claim based on templateData
 * <li> All the above information are written by GW's logger to console and log file, which is specified in logging.properties.
 * </ul>
 * <p>
 * <b>Setup:</b>
 * <p>
 * <ul>
 * <li> Compile this file, and put the class to appserver's \\config\plugins\QAPlugins\classes directory.
 * <li> In config.xml, add the following code to &lt;plugin-registry&gt; section:
 * <p>
 * <code>
 * &lt;plugin-java javaclass="com.dayrealm.cc.plugins.java.Assignment.QAAssignmentTestJavaPlugin" name="IAssignmentAdapter" plugindir="QAPlugins"/&gt;
 * </code>
 * <p>
 *<li> In config.xml, comment out:
 * <p>
 * &lt;adapter name="IAssignmentAdapter"&gt; &lt;/adapter>&gt;
 * <li> Disable all sample rules in Assignment ruleset.
 * <p> //depot/dev/cc/smoketests/INTG/FNC/INTG_DisableAssignmentRuleSetForPluginTest.10.txt can be used to disable all sample assignment rules
 * <p> Should run //depot/dev/cc/smoketests/INTG/FNC/INTG_EnableAssignmentRuleSetAfterPluginTest.10.txt after testing to eanble all sample assignment rules
 * </ul>
 * <b>Usage:</b>
 * <ul>
 * <li> Create a claim with exposures
 * <ul>
 * <li> If can find information from template, this plugin assigns:
 * <p>
 *     a) Auto claim, its exposures to Betty Baker, its activities to Andy Applegate
 * <p>
 *     b) WC claim, its exposures, its activities to a user in 'Comp-Team A' group by round robin
 * <p>
 *     c) PR claim, its exposures, its activities to Paulette Benson
 * <p>
 *     d) GL claim, its exposures, its activities to Auto -Team C for manual assignment
 * <p>
 * <li> If can't find information from template, this plugin assigns claim / exposure / activity to default owner
 *  </ul>
 * <li> All the above information are written by GW's logger to console and log file, which is specified in logging.properties.
 * </ul>
 * <p>
 *
 * @author tlin
 */

/* In config.xml, add the following code
<plugin-java javaclass="com.dayrealm.cc.plugins.java.Assignment.QAAssignmentTestJavaPlugin" name="IAssignmentAdapter" plugindir="QAPlugins"/>
*/

public class AssignmentPluginJavaTest implements IAssignmentAdapter {
  private LoggerCategory _logger = null;

  public AssignmentPluginJavaTest()
  {
    _logger = LoggerCategory.PLUGIN;
    _logger.info("*** AssignmentPluginJavaTest is called ***");
  }

  /**
   * Assigns claim. See class level javadoc for details
   */
  public AssignmentResponse assignClaim(String templateData) {
    Properties props = null;
    try {
      props = StreamUtil.toProperties(templateData);
    } catch (CharacterCodingException e) {
      throw new RuntimeException(e);
    }
    if (props == null) return templateNotFound();
    _logger.info("**Claim Template properties:  " + props + "**");
    return assignItem("Claim", props.getProperty("LossType"), props.getProperty("ClaimNumber"));
  }
  /**
   * Assigns exposures.See class level javadoc for details
   */

  public AssignmentResponse assignExposure(String templateData) {
    Properties props = null;
    try {
      props = StreamUtil.toProperties(templateData);
    } catch (CharacterCodingException e) {
      throw new RuntimeException(e);
    }
    if (props == null) return templateNotFound();
    _logger.info("**Exposure template properties:  " + props + "**");
    return assignItem("Exposure", props.getProperty("LossType"), props.getProperty("ClaimNumber"));
  }

  /**
   * Assigns activities.See class level javadoc for details
   */

  public AssignmentResponse assignActivity(String templateData) {
    Properties props = null;
    try {
      props = StreamUtil.toProperties(templateData);
    } catch (CharacterCodingException e) {
      throw new RuntimeException(e);
    }
    if (props == null) return templateNotFound();
    _logger.info("**Acitivity template properties:  " + props + "**");
    return assignItem("Activity", props.getProperty("LossType"), props.getProperty("ClaimNumber"));
  }

  //--------------------------Private Methods ------------------------------------

  /**
   This method assigns:
   a) Auto claim, its exposures to Betty Baker, its activities to Andy Applegate
   b) WC claim, its exposures, its activities to a user in 'Comp-Team A' group by round robin
   c) PR claim, its exposures, its activities to Paulette Benson
   d) GL claim, its exposures, its activities to Auto -Team C for manual assignment

   */
  private AssignmentResponse assignItem(String itemType, String lossType, String claimNumber){
    AssignmentResponse response = new AssignmentResponse();
    String assignedAutoUserID1  = "demo_sample:8";      // sample user Betty Baker in auto1 - Team A
    String assignedAutoUserID2  = "demo_sample:1";      // sample user Andy Applegate in auto1 - Team A
    String assignedAutoGroupID = "demo_sample:31";     // Auto1 - TeamA  in Western Auto group / Auto -leval1
    String assignedWCGroupID   = "demo_sample:36";     // Comp - Team A in Western Comp Group
    String assignedPRGroupID   = "demo_sample:34";     // Property -Team A in Western Property Group
    String assignedPRUserID    = "demo_sample:124";     //Paulette Benson in Property -Team A
    String assignedOtherGroupID = "demo_sample:33";      // Auto1- Team C

    //Assign Auto claim to the specified Betty Baker without further interpretation
    if (lossType.equals("AUTO") && itemType.equals("Claim"))
    {
      response.setAssignmentCommand(AssignmentCommand.ASSIGN_VERBATIM);
      response.setUserID(assignedAutoUserID1);
      response.setGroupID(assignedAutoGroupID);
      _logger.info("** AssignmentPluginJavaTest should assign the claim " + claimNumber + " to userID: demo_sample:8, which is Betty Baker **");
    }
    // Assign exposure in Auto claim to issue owner
    else if (lossType.equals("AUTO") && itemType.equals("Exposure"))
    {
      response.setAssignmentCommand(AssignmentCommand.ASSIGN_VERBATIM);
      response.setUserID(assignedAutoUserID1);
      response.setGroupID(assignedAutoGroupID);
      _logger.info("** AssignmentPluginJavaTest should assign the exposure in claim " + claimNumber + " to issue owner, whose userID is demo_sample:8. She is Betty Baker **");
    }
    // Assign activity in Auto claim to Andy applegate
    else if (lossType.equals("AUTO") && itemType.equals("Activity"))
    {
      response.setAssignmentCommand(AssignmentCommand.ASSIGN_VERBATIM);
      response.setUserID(assignedAutoUserID2);
      response.setGroupID(assignedAutoGroupID);
      _logger.info("** AssignmentPluginJavaTest should assign the activity in claim " + claimNumber + " to userID: demo_sample:1. He is Andy Applegate **");

    }
    // Assign WC in round_robin
    else if (lossType.equals("WC"))
    {
      response.setAssignmentCommand(AssignmentCommand.ASSIGN_ROUND_ROBIN_USER);
      response.setGroupID(assignedWCGroupID);
      _logger.info("** AssignmentPluginJavaTest should assign the " + itemType + " in claim " + claimNumber + " to a user by round robein in group ID:demo_ample:36, which is Comp-Team A **");
    }
    //Assign PR
    else if (lossType.equals("PR")){
      response.setAssignmentCommand(AssignmentCommand.ASSIGN_VERBATIM);
      response.setGroupID(assignedPRGroupID);
      response.setUserID(assignedPRUserID);
      _logger.info("** AssignmentPluginJavaTest should assign the " + itemType + " in claim " + claimNumber +"  to userID : demo_sample:124, which is Paulette Benson **");
    }
    // Assign other type
    else
    {
      response.setAssignmentCommand(AssignmentCommand.ASSIGN_MANUALLY);
      response.setGroupID(assignedOtherGroupID);
      _logger.info("** AssignmentPluginJavaTest should assign the should assign the " + itemType + " in claim "  + claimNumber +" to group ID:demo_sample:33 manually, which is Auto -Team C **");

    }
    _logger.info("*** The " + itemType + " is actually assigned to userID: " + response.getUserID() + "in groupID: " + response.getGroupID()+ " ***\n\n");

    return response;
  }


  // Was unable to parse the properties from the template,
  // log this error and return "assignment not found", which will alert
  // ClaimCenter that a problem has occured in the assignment adapter.
  private AssignmentResponse  templateNotFound(){
    AssignmentResponse response1 = new AssignmentResponse();
    _logger.error("** CAN'T FIND TEMPLATE **");
    response1.setAssignmentCommand(AssignmentCommand.ASSIGN_NOT_FOUND);

    return response1;
  }
}