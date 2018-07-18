/*
 *   Title: TopicUtils-JavaScript.js
 *   
 *  JavaScript related to the TopicUtils code. This file gets COPIED into the output webworks files to support
 *  the link to this page code.
 */

 
// extracts the src=myfilename from the URL
function Guidewire_ExtractSrcFromURL() {
	var VarDocumentURL = window.WWHFrame.location;
	var TheParametersArray = VarDocumentURL.hash.split("&");
	var thisParam;
	var FMSourceFile = "UNKNOWN_FRAMEMAKER_SOURCE_FILE";

	k = TheParametersArray.length;
	for (i= 0 ; i < k; i++) {
	   thisParam = unescape(TheParametersArray[i]);
	   if (thisParam.search(/^src=/) != -1) {
		  FMSourceFile = thisParam.substring(4); // strip off the "src=" at the beginning
		}
	 }
	return FMSourceFile;
}

// takes a file name of format "myfilename.4.3" and gets the beginning part and returns "myfilename" only
function Guidewire_FMSourceFileExtract(FullFileName)
{
  var VarSplitURL= FullFileName.split(".");
  return VarSplitURL[0];
}

// is the src=myfile arg from the URL (which means it was from myfile.fm) match the desired file
// generally speaking we do not care since we just want it unique per book
// so we just say yes, but we say false if it's a special file that allows duplicates in one book
function Guidewire_FMSourceFileMatch(FROM_URL,LOCAL_FILENAME) {
	var varFileURL = FROM_URL.toLowerCase();
	var varFileActual = LOCAL_FILENAME.toLowerCase();

	// SPECIAL CASE FOR UPGRADE GUIDE PROCEDURES -- BASICALLY 
	if (varFileURL.search(/^procedure-/) != -1) {
	  if  (varFileActual.search(/^procedure-/) != -1)  { 
		  return (varFileURL == Guidewire_FMSourceFileExtract(varFileActual)); 
		} else { 
		 return false; 
	   }
	 }
	else {
	   // basically, the default is to say they match... 
	   // if it's one of these specially-handled files, just let it work  
	   return true; 
	}
}


// this function takes a topic Name and converts it to a simpler string, such as underscores instead of space chars
// This is also important because FrameMaker + ePubs's  native handling of topic alias names mirror this behavior
//
// IMPORTANT: IF YOU CHANGE THIS CODE IN CONTROLS.JS (IN TEMPLATE OVERRIDES), ALSO CHANGE THE MIRROR FUNCTION IN TOPICUTILS-JAVASCRIPT.JS
// IMPORTANT: IF YOU CHANGE THIS CODE IN TOPICUTILS.FSL, ALSO CHANGE THE MIRROR FUNCTION IN CONTROLS.JS (IN TEMPLATE OVERRIDES)
// THE CONTROLS.JS FUNCTION ENCODES THE URL, AND THIS FUNCTION ENCODES it and compares against the input string with the full name for each topic (potentially with funny characters)
function Guidewire_SafeTopicName(theTitle) {
theTitle = theTitle.replace(/ /g, "_");  // converts space char
theTitle = theTitle.replace(/\u00a0/g, "_");  // converts nbsp char
// censor (remove) characters that mess up epublisher in URLs: forward slash, backslash, question mark, &amp;
theTitle= theTitle.replace(/[\\\/\?]/g, "");
theTitle = theTitle.replace(/&/g, "");
theTitle = theTitle.replace(/\u201c/g, ""); // double quote smart L
theTitle = theTitle.replace(/\u201d/g, "");// double quote smart R
theTitle = theTitle.replace(/\u2018/g, "");// single quote smart L
theTitle = theTitle.replace(/\u2019/g, "");// single quote smart R
theTitle = theTitle.replace(/\u2022/g, "");// trademark
theTitle = theTitle.replace(/'/g, "");// apparently a dumb single quote gets stripped by webworks
theTitle = theTitle.replace(/"/g, "");// to be safe let us strip double quotes too
theTitle = theTitle.replace(/\</g, "(");  // open bracket
theTitle = theTitle.replace(/\>/g, ")");   // close bracket
theTitle = theTitle.replace(/:/g, "_");    // colon
theTitle = theTitle.replace(/&/g, "");
return (theTitle);  }




function Guidewire_TopicMatch(FROMEPUB,WHATTOMATCH) {
var varLower1 = FROMEPUB.toLowerCase();
var varLower2 = WHATTOMATCH.toLowerCase();
var varLower2Safe = Guidewire_SafeTopicName(varLower2)

// match positively if they naturally match, or they match the safe version (convert spaces to underscores...)
var varMatches = (varLower1 == varLower2 || varLower1 == Guidewire_SafeTopicName(varLower2))

// console.log(Guidewire_TopicMatch, varLower1, varLower2, varLower2Safe, varMatches)
return varMatches
}
function GUIDEWIRE_TOPIC_TO_FILE(TOPIC, SRCFILE) { 
if (Guidewire_TopicMatch(TOPIC,"cover")) return "index.html"

else if (Guidewire_TopicMatch(TOPIC,"ClaimCenter Rules Guide") && Guidewire_FMSourceFileMatch(SRCFILE,"cover-rules.html") ) { return "cover-rules.html";}
else if (Guidewire_TopicMatch(TOPIC,"About This Document") && Guidewire_FMSourceFileMatch(SRCFILE,"about.html") ) { return "about.html";}
else if (Guidewire_TopicMatch(TOPIC,"Gosu Business Rules") && Guidewire_FMSourceFileMatch(SRCFILE,"p-rules.html") ) { return "p-rules.html";}
else if (Guidewire_TopicMatch(TOPIC,"Rules: A Background") && Guidewire_FMSourceFileMatch(SRCFILE,"rules_using.04.1.html") ) { return "rules_using.04.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Introduction to Business Rules") && Guidewire_FMSourceFileMatch(SRCFILE,"rules_using.04.2.html") ) { return "rules_using.04.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Important Terminology") && Guidewire_FMSourceFileMatch(SRCFILE,"rules_using.04.3.html") ) { return "rules_using.04.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Overview of ClaimCenter Rule Sets") && Guidewire_FMSourceFileMatch(SRCFILE,"rules_using.04.4.html") ) { return "rules_using.04.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Rules Overview") && Guidewire_FMSourceFileMatch(SRCFILE,"rules_overview.05.1.html") ) { return "rules_overview.05.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Rule Design Template") && Guidewire_FMSourceFileMatch(SRCFILE,"rules_overview.05.2.html") ) { return "rules_overview.05.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Rule Structure") && Guidewire_FMSourceFileMatch(SRCFILE,"rules_overview.05.3.html") ) { return "rules_overview.05.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Exiting a Rule") && Guidewire_FMSourceFileMatch(SRCFILE,"rules_overview.05.4.html") ) { return "rules_overview.05.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Gosu Annotations and ClaimCenter Business Rules") && Guidewire_FMSourceFileMatch(SRCFILE,"rules_overview.05.5.html") ) { return "rules_overview.05.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Invoking a Gosu Rule from Gosu Code") && Guidewire_FMSourceFileMatch(SRCFILE,"rules_overview.05.6.html") ) { return "rules_overview.05.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using the Rules Editor") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_rules.06.1.html") ) { return "studio_rules.06.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working with Rules") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_rules.06.2.html") ) { return "studio_rules.06.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Renaming or Deleting a Rule") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_rules.06.3.html") ) { return "studio_rules.06.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using Find-and-Replace") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_rules.06.4.html") ) { return "studio_rules.06.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Changing the Root Entity of a Rule") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_rules.06.5.html") ) { return "studio_rules.06.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Validating Rules and Gosu Code") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_rules.06.6.html") ) { return "studio_rules.06.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Making a Rule Active or Inactive") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_rules.06.7.html") ) { return "studio_rules.06.7.html";}
else if (Guidewire_TopicMatch(TOPIC,"Writing Rules: Best Practices") && Guidewire_FMSourceFileMatch(SRCFILE,"rules_bestpractices.07.1.html") ) { return "rules_bestpractices.07.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Rule and Rule Set Naming Conventions") && Guidewire_FMSourceFileMatch(SRCFILE,"rules_bestpractices.07.2.html") ) { return "rules_bestpractices.07.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Adding Comments to Rules") && Guidewire_FMSourceFileMatch(SRCFILE,"rules_bestpractices.07.3.html") ) { return "rules_bestpractices.07.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Generating Rule Debugging Information") && Guidewire_FMSourceFileMatch(SRCFILE,"rules_bestpractices.07.4.html") ) { return "rules_bestpractices.07.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Handling Errors") && Guidewire_FMSourceFileMatch(SRCFILE,"rules_bestpractices.07.5.html") ) { return "rules_bestpractices.07.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Writing Rules: Examples") && Guidewire_FMSourceFileMatch(SRCFILE,"rules_writing.08.1.html") ) { return "rules_writing.08.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Accessing Fields on Subtypes") && Guidewire_FMSourceFileMatch(SRCFILE,"rules_writing.08.2.html") ) { return "rules_writing.08.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Looking for One or More Items Meeting Conditions") && Guidewire_FMSourceFileMatch(SRCFILE,"rules_writing.08.3.html") ) { return "rules_writing.08.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Preventing Repeated Actions") && Guidewire_FMSourceFileMatch(SRCFILE,"rules_writing.08.4.html") ) { return "rules_writing.08.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Taking Actions on More Than One Subitem") && Guidewire_FMSourceFileMatch(SRCFILE,"rules_writing.08.5.html") ) { return "rules_writing.08.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Checking Permissions") && Guidewire_FMSourceFileMatch(SRCFILE,"rules_writing.08.6.html") ) { return "rules_writing.08.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Determining the Original Attributes of a Changed Entity") && Guidewire_FMSourceFileMatch(SRCFILE,"rules_writing.08.7.html") ) { return "rules_writing.08.7.html";}
else if (Guidewire_TopicMatch(TOPIC,"Rule Set Categories") && Guidewire_FMSourceFileMatch(SRCFILE,"cc_rulesets.09.01.html") ) { return "cc_rulesets.09.01.html";}
else if (Guidewire_TopicMatch(TOPIC,"Rule Set Summaries") && Guidewire_FMSourceFileMatch(SRCFILE,"cc_rulesets.09.02.html") ) { return "cc_rulesets.09.02.html";}
else if (Guidewire_TopicMatch(TOPIC,"Approval Routing") && Guidewire_FMSourceFileMatch(SRCFILE,"cc_rulesets.09.03.html") ) { return "cc_rulesets.09.03.html";}
else if (Guidewire_TopicMatch(TOPIC,"Archive") && Guidewire_FMSourceFileMatch(SRCFILE,"cc_rulesets.09.04.html") ) { return "cc_rulesets.09.04.html";}
else if (Guidewire_TopicMatch(TOPIC,"Assignment") && Guidewire_FMSourceFileMatch(SRCFILE,"cc_rulesets.09.05.html") ) { return "cc_rulesets.09.05.html";}
else if (Guidewire_TopicMatch(TOPIC,"BulkInvoice Approval") && Guidewire_FMSourceFileMatch(SRCFILE,"cc_rulesets.09.06.html") ) { return "cc_rulesets.09.06.html";}
else if (Guidewire_TopicMatch(TOPIC,"Closed") && Guidewire_FMSourceFileMatch(SRCFILE,"cc_rulesets.09.07.html") ) { return "cc_rulesets.09.07.html";}
else if (Guidewire_TopicMatch(TOPIC,"Event Message") && Guidewire_FMSourceFileMatch(SRCFILE,"cc_rulesets.09.08.html") ) { return "cc_rulesets.09.08.html";}
else if (Guidewire_TopicMatch(TOPIC,"Exception") && Guidewire_FMSourceFileMatch(SRCFILE,"cc_rulesets.09.09.html") ) { return "cc_rulesets.09.09.html";}
else if (Guidewire_TopicMatch(TOPIC,"Initial Reserve") && Guidewire_FMSourceFileMatch(SRCFILE,"cc_rulesets.09.10.html") ) { return "cc_rulesets.09.10.html";}
else if (Guidewire_TopicMatch(TOPIC,"Loaded") && Guidewire_FMSourceFileMatch(SRCFILE,"cc_rulesets.09.11.html") ) { return "cc_rulesets.09.11.html";}
else if (Guidewire_TopicMatch(TOPIC,"Postsetup") && Guidewire_FMSourceFileMatch(SRCFILE,"cc_rulesets.09.12.html") ) { return "cc_rulesets.09.12.html";}
else if (Guidewire_TopicMatch(TOPIC,"Presetup") && Guidewire_FMSourceFileMatch(SRCFILE,"cc_rulesets.09.13.html") ) { return "cc_rulesets.09.13.html";}
else if (Guidewire_TopicMatch(TOPIC,"Preupdate") && Guidewire_FMSourceFileMatch(SRCFILE,"cc_rulesets.09.14.html") ) { return "cc_rulesets.09.14.html";}
else if (Guidewire_TopicMatch(TOPIC,"Reopened") && Guidewire_FMSourceFileMatch(SRCFILE,"cc_rulesets.09.15.html") ) { return "cc_rulesets.09.15.html";}
else if (Guidewire_TopicMatch(TOPIC,"Segmentation") && Guidewire_FMSourceFileMatch(SRCFILE,"cc_rulesets.09.16.html") ) { return "cc_rulesets.09.16.html";}
else if (Guidewire_TopicMatch(TOPIC,"Transaction Approval") && Guidewire_FMSourceFileMatch(SRCFILE,"cc_rulesets.09.17.html") ) { return "cc_rulesets.09.17.html";}
else if (Guidewire_TopicMatch(TOPIC,"Validation") && Guidewire_FMSourceFileMatch(SRCFILE,"cc_rulesets.09.18.html") ) { return "cc_rulesets.09.18.html";}
else if (Guidewire_TopicMatch(TOPIC,"Workplan") && Guidewire_FMSourceFileMatch(SRCFILE,"cc_rulesets.09.19.html") ) { return "cc_rulesets.09.19.html";}
else if (Guidewire_TopicMatch(TOPIC,"ClaimCenter Rule Execution") && Guidewire_FMSourceFileMatch(SRCFILE,"rules_execution.10.1.html") ) { return "rules_execution.10.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Generating a Rule Repository Report") && Guidewire_FMSourceFileMatch(SRCFILE,"rules_execution.10.2.html") ) { return "rules_execution.10.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Generating a Rule Execution Report") && Guidewire_FMSourceFileMatch(SRCFILE,"rules_execution.10.3.html") ) { return "rules_execution.10.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Advanced Topics") && Guidewire_FMSourceFileMatch(SRCFILE,"p-rules_advanced.html") ) { return "p-rules_advanced.html";}
else if (Guidewire_TopicMatch(TOPIC,"Assignment in ClaimCenter") && Guidewire_FMSourceFileMatch(SRCFILE,"assignment_cc.12.01.html") ) { return "assignment_cc.12.01.html";}
else if (Guidewire_TopicMatch(TOPIC,"Understanding Assignment") && Guidewire_FMSourceFileMatch(SRCFILE,"assignment_cc.12.02.html") ) { return "assignment_cc.12.02.html";}
else if (Guidewire_TopicMatch(TOPIC,"ClaimCenter Assignment") && Guidewire_FMSourceFileMatch(SRCFILE,"assignment_cc.12.03.html") ) { return "assignment_cc.12.03.html";}
else if (Guidewire_TopicMatch(TOPIC,"Assignment Execution Session") && Guidewire_FMSourceFileMatch(SRCFILE,"assignment_cc.12.04.html") ) { return "assignment_cc.12.04.html";}
else if (Guidewire_TopicMatch(TOPIC,"Primary and Secondary Assignment") && Guidewire_FMSourceFileMatch(SRCFILE,"assignment_cc.12.05.html") ) { return "assignment_cc.12.05.html";}
else if (Guidewire_TopicMatch(TOPIC,"Assignment Success or Failure") && Guidewire_FMSourceFileMatch(SRCFILE,"assignment_cc.12.06.html") ) { return "assignment_cc.12.06.html";}
else if (Guidewire_TopicMatch(TOPIC,"Assignment Cascading") && Guidewire_FMSourceFileMatch(SRCFILE,"assignment_cc.12.07.html") ) { return "assignment_cc.12.07.html";}
else if (Guidewire_TopicMatch(TOPIC,"Assignment Events") && Guidewire_FMSourceFileMatch(SRCFILE,"assignment_cc.12.08.html") ) { return "assignment_cc.12.08.html";}
else if (Guidewire_TopicMatch(TOPIC,"Assignment Method Reference") && Guidewire_FMSourceFileMatch(SRCFILE,"assignment_cc.12.09.html") ) { return "assignment_cc.12.09.html";}
else if (Guidewire_TopicMatch(TOPIC,"Assignment by Assignment Engine") && Guidewire_FMSourceFileMatch(SRCFILE,"assignment_cc.12.10.html") ) { return "assignment_cc.12.10.html";}
else if (Guidewire_TopicMatch(TOPIC,"Group Assignment (within the Assignment Rules)") && Guidewire_FMSourceFileMatch(SRCFILE,"assignment_cc.12.11.html") ) { return "assignment_cc.12.11.html";}
else if (Guidewire_TopicMatch(TOPIC,"Queue Assignment") && Guidewire_FMSourceFileMatch(SRCFILE,"assignment_cc.12.12.html") ) { return "assignment_cc.12.12.html";}
else if (Guidewire_TopicMatch(TOPIC,"Immediate Assignment") && Guidewire_FMSourceFileMatch(SRCFILE,"assignment_cc.12.13.html") ) { return "assignment_cc.12.13.html";}
else if (Guidewire_TopicMatch(TOPIC,"Claim-Based Assignment") && Guidewire_FMSourceFileMatch(SRCFILE,"assignment_cc.12.14.html") ) { return "assignment_cc.12.14.html";}
else if (Guidewire_TopicMatch(TOPIC,"Condition-Based Assignment") && Guidewire_FMSourceFileMatch(SRCFILE,"assignment_cc.12.15.html") ) { return "assignment_cc.12.15.html";}
else if (Guidewire_TopicMatch(TOPIC,"Proximity-Based Assignment") && Guidewire_FMSourceFileMatch(SRCFILE,"assignment_cc.12.16.html") ) { return "assignment_cc.12.16.html";}
else if (Guidewire_TopicMatch(TOPIC,"Round-robin Assignment") && Guidewire_FMSourceFileMatch(SRCFILE,"assignment_cc.12.17.html") ) { return "assignment_cc.12.17.html";}
else if (Guidewire_TopicMatch(TOPIC,"Dynamic Assignment") && Guidewire_FMSourceFileMatch(SRCFILE,"assignment_cc.12.18.html") ) { return "assignment_cc.12.18.html";}
else if (Guidewire_TopicMatch(TOPIC,"Manual Assignment") && Guidewire_FMSourceFileMatch(SRCFILE,"assignment_cc.12.19.html") ) { return "assignment_cc.12.19.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using Assignment Methods in Assignment Pop-ups") && Guidewire_FMSourceFileMatch(SRCFILE,"assignment_cc.12.20.html") ) { return "assignment_cc.12.20.html";}
else if (Guidewire_TopicMatch(TOPIC,"Assignment by Workload Count") && Guidewire_FMSourceFileMatch(SRCFILE,"assignment_cc.12.21.html") ) { return "assignment_cc.12.21.html";}
else if (Guidewire_TopicMatch(TOPIC,"Validation in ClaimCenter") && Guidewire_FMSourceFileMatch(SRCFILE,"validation_cc.13.1.html") ) { return "validation_cc.13.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"What is Validation") && Guidewire_FMSourceFileMatch(SRCFILE,"validation_cc.13.2.html") ) { return "validation_cc.13.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Overview of ClaimCenter Validation") && Guidewire_FMSourceFileMatch(SRCFILE,"validation_cc.13.3.html") ) { return "validation_cc.13.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"The Validation Graph in Guidewire ClaimCenter") && Guidewire_FMSourceFileMatch(SRCFILE,"validation_cc.13.4.html") ) { return "validation_cc.13.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Validation Performance Issues") && Guidewire_FMSourceFileMatch(SRCFILE,"validation_cc.13.5.html") ) { return "validation_cc.13.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Debugging the Validation Graph") && Guidewire_FMSourceFileMatch(SRCFILE,"validation_cc.13.6.html") ) { return "validation_cc.13.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Validation in ContactCenter") && Guidewire_FMSourceFileMatch(SRCFILE,"validation_ab.14.1.html") ) { return "validation_ab.14.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Overview of ContactCenter Validation") && Guidewire_FMSourceFileMatch(SRCFILE,"validation_ab.14.2.html") ) { return "validation_ab.14.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"The Validation Graph in Guidewire ContactCenter") && Guidewire_FMSourceFileMatch(SRCFILE,"validation_ab.14.3.html") ) { return "validation_ab.14.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Top-level ContactCenter Entities that Trigger Validation") && Guidewire_FMSourceFileMatch(SRCFILE,"validation_ab.14.4.html") ) { return "validation_ab.14.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Detecting Claim Fraud") && Guidewire_FMSourceFileMatch(SRCFILE,"rules_siu.15.1.html") ) { return "rules_siu.15.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Claim Fraud") && Guidewire_FMSourceFileMatch(SRCFILE,"rules_siu.15.2.html") ) { return "rules_siu.15.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"The Special Investigation Details Screen") && Guidewire_FMSourceFileMatch(SRCFILE,"rules_siu.15.3.html") ) { return "rules_siu.15.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Special Investigation Trigger Rules") && Guidewire_FMSourceFileMatch(SRCFILE,"rules_siu.15.4.html") ) { return "rules_siu.15.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"SI Rule Evaluation Sequence") && Guidewire_FMSourceFileMatch(SRCFILE,"rules_siu.15.5.html") ) { return "rules_siu.15.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using the Special Investigation Rules") && Guidewire_FMSourceFileMatch(SRCFILE,"rules_siu.15.6.html") ) { return "rules_siu.15.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Sending Emails") && Guidewire_FMSourceFileMatch(SRCFILE,"rules_sending_emails.16.01.html") ) { return "rules_sending_emails.16.01.html";}
else if (Guidewire_TopicMatch(TOPIC,"Guidewire ClaimCenter and Email") && Guidewire_FMSourceFileMatch(SRCFILE,"rules_sending_emails.16.02.html") ) { return "rules_sending_emails.16.02.html";}
else if (Guidewire_TopicMatch(TOPIC,"The Email Object Model") && Guidewire_FMSourceFileMatch(SRCFILE,"rules_sending_emails.16.03.html") ) { return "rules_sending_emails.16.03.html";}
else if (Guidewire_TopicMatch(TOPIC,"Email Utility Methods") && Guidewire_FMSourceFileMatch(SRCFILE,"rules_sending_emails.16.04.html") ) { return "rules_sending_emails.16.04.html";}
else if (Guidewire_TopicMatch(TOPIC,"Email Transmission") && Guidewire_FMSourceFileMatch(SRCFILE,"rules_sending_emails.16.05.html") ) { return "rules_sending_emails.16.05.html";}
else if (Guidewire_TopicMatch(TOPIC,"Understanding Email Templates") && Guidewire_FMSourceFileMatch(SRCFILE,"rules_sending_emails.16.06.html") ) { return "rules_sending_emails.16.06.html";}
else if (Guidewire_TopicMatch(TOPIC,"Creating an Email Template") && Guidewire_FMSourceFileMatch(SRCFILE,"rules_sending_emails.16.07.html") ) { return "rules_sending_emails.16.07.html";}
else if (Guidewire_TopicMatch(TOPIC,"Localizing an Email Template") && Guidewire_FMSourceFileMatch(SRCFILE,"rules_sending_emails.16.08.html") ) { return "rules_sending_emails.16.08.html";}
else if (Guidewire_TopicMatch(TOPIC,"The IEmailTemplateSource Plugin") && Guidewire_FMSourceFileMatch(SRCFILE,"rules_sending_emails.16.09.html") ) { return "rules_sending_emails.16.09.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring ClaimCenter to Send Emails") && Guidewire_FMSourceFileMatch(SRCFILE,"rules_sending_emails.16.10.html") ) { return "rules_sending_emails.16.10.html";}
else if (Guidewire_TopicMatch(TOPIC,"Sending Emails from Gosu") && Guidewire_FMSourceFileMatch(SRCFILE,"rules_sending_emails.16.11.html") ) { return "rules_sending_emails.16.11.html";}
else if (Guidewire_TopicMatch(TOPIC,"Saving an Email Message as a Document") && Guidewire_FMSourceFileMatch(SRCFILE,"rules_sending_emails.16.12.html") ) { return "rules_sending_emails.16.12.html";}
else if (Guidewire_TopicMatch(TOPIC,"Document Creation") && Guidewire_FMSourceFileMatch(SRCFILE,"rules_documentcreation.17.1.html") ) { return "rules_documentcreation.17.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Synchronous and Asynchronous Document Production") && Guidewire_FMSourceFileMatch(SRCFILE,"rules_documentcreation.17.2.html") ) { return "rules_documentcreation.17.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Integrating Document Functionality with ClaimCenter") && Guidewire_FMSourceFileMatch(SRCFILE,"rules_documentcreation.17.3.html") ) { return "rules_documentcreation.17.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"The IDocumentTemplateDescriptor Interface") && Guidewire_FMSourceFileMatch(SRCFILE,"rules_documentcreation.17.4.html") ) { return "rules_documentcreation.17.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"The IDocumentTemplateDescriptor API") && Guidewire_FMSourceFileMatch(SRCFILE,"rules_documentcreation.17.5.html") ) { return "rules_documentcreation.17.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"The Document Production Class") && Guidewire_FMSourceFileMatch(SRCFILE,"rules_documentcreation.17.6.html") ) { return "rules_documentcreation.17.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Document Templates") && Guidewire_FMSourceFileMatch(SRCFILE,"rules_documentcreation.17.7.html") ) { return "rules_documentcreation.17.7.html";}
else if (Guidewire_TopicMatch(TOPIC,"Document Creation Examples") && Guidewire_FMSourceFileMatch(SRCFILE,"rules_documentcreation.17.8.html") ) { return "rules_documentcreation.17.8.html";}
else if (Guidewire_TopicMatch(TOPIC,"Troubleshooting") && Guidewire_FMSourceFileMatch(SRCFILE,"rules_documentcreation.17.9.html") ) { return "rules_documentcreation.17.9.html";}
else if (Guidewire_TopicMatch(TOPIC,"Financial Calculations") && Guidewire_FMSourceFileMatch(SRCFILE,"financials.18.01.html") ) { return "financials.18.01.html";}
else if (Guidewire_TopicMatch(TOPIC,"ClaimCenter Financials") && Guidewire_FMSourceFileMatch(SRCFILE,"financials.18.02.html") ) { return "financials.18.02.html";}
else if (Guidewire_TopicMatch(TOPIC,"Pre-Defined Financial Calculations") && Guidewire_FMSourceFileMatch(SRCFILE,"financials.18.03.html") ) { return "financials.18.03.html";}
else if (Guidewire_TopicMatch(TOPIC,"Multicurrency Transactions") && Guidewire_FMSourceFileMatch(SRCFILE,"financials.18.04.html") ) { return "financials.18.04.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using 'CheckCreator'") && Guidewire_FMSourceFileMatch(SRCFILE,"financials.18.05.html") ) { return "financials.18.05.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using the Pre-defined Financials Calculations") && Guidewire_FMSourceFileMatch(SRCFILE,"financials.18.06.html") ) { return "financials.18.06.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working with Reserves") && Guidewire_FMSourceFileMatch(SRCFILE,"financials.18.07.html") ) { return "financials.18.07.html";}
else if (Guidewire_TopicMatch(TOPIC,"Creating Reserve Transactions Directly") && Guidewire_FMSourceFileMatch(SRCFILE,"financials.18.08.html") ) { return "financials.18.08.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using Custom Calculation Building Blocks") && Guidewire_FMSourceFileMatch(SRCFILE,"financials.18.09.html") ) { return "financials.18.09.html";}
else if (Guidewire_TopicMatch(TOPIC,"Transaction Status") && Guidewire_FMSourceFileMatch(SRCFILE,"financials.18.10.html") ) { return "financials.18.10.html";}
else if (Guidewire_TopicMatch(TOPIC,"Transaction Validation") && Guidewire_FMSourceFileMatch(SRCFILE,"transaction_validation.19.1.html") ) { return "transaction_validation.19.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Overview of Transaction Validation") && Guidewire_FMSourceFileMatch(SRCFILE,"transaction_validation.19.2.html") ) { return "transaction_validation.19.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"The Transaction Validation Rules") && Guidewire_FMSourceFileMatch(SRCFILE,"transaction_validation.19.3.html") ) { return "transaction_validation.19.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"TXV01000 (Total payments not greater than Exposure limit)") && Guidewire_FMSourceFileMatch(SRCFILE,"transaction_validation.19.4.html") ) { return "transaction_validation.19.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"TXV02000 (Check Exposure limit when increasing reserves)") && Guidewire_FMSourceFileMatch(SRCFILE,"transaction_validation.19.5.html") ) { return "transaction_validation.19.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"TXV03000 (Total payments not greater than Incident limit)") && Guidewire_FMSourceFileMatch(SRCFILE,"transaction_validation.19.6.html") ) { return "transaction_validation.19.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"TXV04000 (Check Incident limit when increasing reserves)") && Guidewire_FMSourceFileMatch(SRCFILE,"transaction_validation.19.7.html") ) { return "transaction_validation.19.7.html";}
else if (Guidewire_TopicMatch(TOPIC,"TXV05000 (PIP)") && Guidewire_FMSourceFileMatch(SRCFILE,"transaction_validation.19.8.html") ) { return "transaction_validation.19.8.html";}
else if (Guidewire_TopicMatch(TOPIC,"The sumForPIPAgg Enhancement Methods") && Guidewire_FMSourceFileMatch(SRCFILE,"transaction_validation.19.9.html") ) { return "transaction_validation.19.9.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working with Queues") && Guidewire_FMSourceFileMatch(SRCFILE,"queues.20.1.html") ) { return "queues.20.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"What Are Activity Queues") && Guidewire_FMSourceFileMatch(SRCFILE,"queues.20.2.html") ) { return "queues.20.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using a Queue to Handle FNOL Claims: Example") && Guidewire_FMSourceFileMatch(SRCFILE,"queues.20.3.html") ) { return "queues.20.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using a Queue to VoidStop Checks: Example") && Guidewire_FMSourceFileMatch(SRCFILE,"queues.20.4.html") ) { return "queues.20.4.html";}
else { return("../wwhelp/topic_cannot_be_found.html"); } }

function  WWHBookData_MatchTopic(P)
{
var C=null;P=decodeURIComponent(decodeURIComponent(escape(P)));//workaround epub bug with UTF8 processing!
if (C) { return C } else { return GUIDEWIRE_TOPIC_TO_FILE(P,Guidewire_ExtractSrcFromURL());}
}
