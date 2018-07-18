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

else if (Guidewire_TopicMatch(TOPIC,"ClaimCenter Application\u00a0Guide") && Guidewire_FMSourceFileMatch(SRCFILE,"cover-app.html") ) { return "cover-app.html";}
else if (Guidewire_TopicMatch(TOPIC,"About This Document") && Guidewire_FMSourceFileMatch(SRCFILE,"about.html") ) { return "about.html";}
else if (Guidewire_TopicMatch(TOPIC,"Introduction") && Guidewire_FMSourceFileMatch(SRCFILE,"p_intro.html") ) { return "p_intro.html";}
else if (Guidewire_TopicMatch(TOPIC,"Introduction to ClaimCenter") && Guidewire_FMSourceFileMatch(SRCFILE,"intro.04.1.html") ) { return "intro.04.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"ClaimCenter Benefits") && Guidewire_FMSourceFileMatch(SRCFILE,"intro.04.2.html") ) { return "intro.04.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Claims Overview") && Guidewire_FMSourceFileMatch(SRCFILE,"claimoverview.05.01.html") ) { return "claimoverview.05.01.html";}
else if (Guidewire_TopicMatch(TOPIC,"Claim Contents") && Guidewire_FMSourceFileMatch(SRCFILE,"claimoverview.05.02.html") ) { return "claimoverview.05.02.html";}
else if (Guidewire_TopicMatch(TOPIC,"Summary of the Claim") && Guidewire_FMSourceFileMatch(SRCFILE,"claimoverview.05.03.html") ) { return "claimoverview.05.03.html";}
else if (Guidewire_TopicMatch(TOPIC,"Activities") && Guidewire_FMSourceFileMatch(SRCFILE,"claimoverview.05.04.html") ) { return "claimoverview.05.04.html";}
else if (Guidewire_TopicMatch(TOPIC,"Workplan") && Guidewire_FMSourceFileMatch(SRCFILE,"claimoverview.05.05.html") ) { return "claimoverview.05.05.html";}
else if (Guidewire_TopicMatch(TOPIC,"Loss Details") && Guidewire_FMSourceFileMatch(SRCFILE,"claimoverview.05.06.html") ) { return "claimoverview.05.06.html";}
else if (Guidewire_TopicMatch(TOPIC,"Incidents in ClaimCenter") && Guidewire_FMSourceFileMatch(SRCFILE,"claimoverview.05.07.html") ) { return "claimoverview.05.07.html";}
else if (Guidewire_TopicMatch(TOPIC,"Exposures") && Guidewire_FMSourceFileMatch(SRCFILE,"claimoverview.05.08.html") ) { return "claimoverview.05.08.html";}
else if (Guidewire_TopicMatch(TOPIC,"Parties Involved") && Guidewire_FMSourceFileMatch(SRCFILE,"claimoverview.05.09.html") ) { return "claimoverview.05.09.html";}
else if (Guidewire_TopicMatch(TOPIC,"Policies") && Guidewire_FMSourceFileMatch(SRCFILE,"claimoverview.05.10.html") ) { return "claimoverview.05.10.html";}
else if (Guidewire_TopicMatch(TOPIC,"Financials") && Guidewire_FMSourceFileMatch(SRCFILE,"claimoverview.05.11.html") ) { return "claimoverview.05.11.html";}
else if (Guidewire_TopicMatch(TOPIC,"New Claim Wizard") && Guidewire_FMSourceFileMatch(SRCFILE,"claimoverview.05.12.html") ) { return "claimoverview.05.12.html";}
else if (Guidewire_TopicMatch(TOPIC,"Notes") && Guidewire_FMSourceFileMatch(SRCFILE,"claimoverview.05.13.html") ) { return "claimoverview.05.13.html";}
else if (Guidewire_TopicMatch(TOPIC,"Documents") && Guidewire_FMSourceFileMatch(SRCFILE,"claimoverview.05.14.html") ) { return "claimoverview.05.14.html";}
else if (Guidewire_TopicMatch(TOPIC,"Calendar") && Guidewire_FMSourceFileMatch(SRCFILE,"claimoverview.05.15.html") ) { return "claimoverview.05.15.html";}
else if (Guidewire_TopicMatch(TOPIC,"Plan of Action") && Guidewire_FMSourceFileMatch(SRCFILE,"claimoverview.05.16.html") ) { return "claimoverview.05.16.html";}
else if (Guidewire_TopicMatch(TOPIC,"Litigation") && Guidewire_FMSourceFileMatch(SRCFILE,"claimoverview.05.17.html") ) { return "claimoverview.05.17.html";}
else if (Guidewire_TopicMatch(TOPIC,"History") && Guidewire_FMSourceFileMatch(SRCFILE,"claimoverview.05.18.html") ) { return "claimoverview.05.18.html";}
else if (Guidewire_TopicMatch(TOPIC,"FNOL Snapshot") && Guidewire_FMSourceFileMatch(SRCFILE,"claimoverview.05.19.html") ) { return "claimoverview.05.19.html";}
else if (Guidewire_TopicMatch(TOPIC,"Administration") && Guidewire_FMSourceFileMatch(SRCFILE,"claimoverview.05.20.html") ) { return "claimoverview.05.20.html";}
else if (Guidewire_TopicMatch(TOPIC,"High-Level User Interface") && Guidewire_FMSourceFileMatch(SRCFILE,"p-ui.html") ) { return "p-ui.html";}
else if (Guidewire_TopicMatch(TOPIC,"Navigating ClaimCenter") && Guidewire_FMSourceFileMatch(SRCFILE,"ui.07.1.html") ) { return "ui.07.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Logging in to ClaimCenter") && Guidewire_FMSourceFileMatch(SRCFILE,"ui.07.2.html") ) { return "ui.07.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Changing Your Preferences, Startup View, and Entries") && Guidewire_FMSourceFileMatch(SRCFILE,"ui.07.3.html") ) { return "ui.07.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Viewing Statistics") && Guidewire_FMSourceFileMatch(SRCFILE,"ui.07.4.html") ) { return "ui.07.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Common Areas in the ClaimCenter User Interface") && Guidewire_FMSourceFileMatch(SRCFILE,"ui.07.5.html") ) { return "ui.07.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Performing Searches") && Guidewire_FMSourceFileMatch(SRCFILE,"ui.07.6.html") ) { return "ui.07.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Localizing ClaimCenter") && Guidewire_FMSourceFileMatch(SRCFILE,"localizing.08.1.html") ) { return "localizing.08.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Localizing Documents, Email, and Notes") && Guidewire_FMSourceFileMatch(SRCFILE,"localizing.08.2.html") ) { return "localizing.08.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Localizing Activities") && Guidewire_FMSourceFileMatch(SRCFILE,"localizing.08.3.html") ) { return "localizing.08.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Localizing Workflows") && Guidewire_FMSourceFileMatch(SRCFILE,"localizing.08.4.html") ) { return "localizing.08.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"The QuickJump Box") && Guidewire_FMSourceFileMatch(SRCFILE,"quickjump.09.1.html") ) { return "quickjump.09.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"QuickJump Features:") && Guidewire_FMSourceFileMatch(SRCFILE,"quickjump.09.2.html") ) { return "quickjump.09.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Data Model for QuickJump") && Guidewire_FMSourceFileMatch(SRCFILE,"quickjump.09.3.html") ) { return "quickjump.09.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working With Claims") && Guidewire_FMSourceFileMatch(SRCFILE,"p-claims.html") ) { return "p-claims.html";}
else if (Guidewire_TopicMatch(TOPIC,"Claim Creation") && Guidewire_FMSourceFileMatch(SRCFILE,"fnol.11.1.html") ) { return "fnol.11.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Overview of the New Claim Wizard") && Guidewire_FMSourceFileMatch(SRCFILE,"fnol.11.2.html") ) { return "fnol.11.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Steps of the New Claim Wizard") && Guidewire_FMSourceFileMatch(SRCFILE,"fnol.11.3.html") ) { return "fnol.11.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Optional New Claim Wizard Screens") && Guidewire_FMSourceFileMatch(SRCFILE,"fnol.11.4.html") ) { return "fnol.11.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"New Claim Wizard and the Lines of Business") && Guidewire_FMSourceFileMatch(SRCFILE,"fnol.11.5.html") ) { return "fnol.11.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working with Policies in Claims") && Guidewire_FMSourceFileMatch(SRCFILE,"policy.12.1.html") ) { return "policy.12.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Verified and Unverified Policies") && Guidewire_FMSourceFileMatch(SRCFILE,"policy.12.2.html") ) { return "policy.12.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working with Policies in ClaimCenter") && Guidewire_FMSourceFileMatch(SRCFILE,"policy.12.3.html") ) { return "policy.12.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Coverage Verification") && Guidewire_FMSourceFileMatch(SRCFILE,"policy.12.4.html") ) { return "policy.12.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Aggregate Limits") && Guidewire_FMSourceFileMatch(SRCFILE,"policy.12.5.html") ) { return "policy.12.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Policies and the Data Model") && Guidewire_FMSourceFileMatch(SRCFILE,"policy.12.6.html") ) { return "policy.12.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Claim Policies and the Policy Administration System") && Guidewire_FMSourceFileMatch(SRCFILE,"policy.12.7.html") ) { return "policy.12.7.html";}
else if (Guidewire_TopicMatch(TOPIC,"Claim History") && Guidewire_FMSourceFileMatch(SRCFILE,"histories.13.1.html") ) { return "histories.13.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Contents of a Claim History") && Guidewire_FMSourceFileMatch(SRCFILE,"histories.13.2.html") ) { return "histories.13.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Adding History Events") && Guidewire_FMSourceFileMatch(SRCFILE,"histories.13.3.html") ) { return "histories.13.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Archiving") && Guidewire_FMSourceFileMatch(SRCFILE,"archiving.14.1.html") ) { return "archiving.14.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Archiving Claims") && Guidewire_FMSourceFileMatch(SRCFILE,"archiving.14.2.html") ) { return "archiving.14.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Searching for Archived Claims") && Guidewire_FMSourceFileMatch(SRCFILE,"archiving.14.3.html") ) { return "archiving.14.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Restoring Archived Claims") && Guidewire_FMSourceFileMatch(SRCFILE,"archiving.14.4.html") ) { return "archiving.14.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring Claim Archiving") && Guidewire_FMSourceFileMatch(SRCFILE,"archiving.14.5.html") ) { return "archiving.14.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"More Information on Archiving") && Guidewire_FMSourceFileMatch(SRCFILE,"archiving.14.6.html") ) { return "archiving.14.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Validation") && Guidewire_FMSourceFileMatch(SRCFILE,"validation.15.1.html") ) { return "validation.15.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Field-level Validators") && Guidewire_FMSourceFileMatch(SRCFILE,"validation.15.2.html") ) { return "validation.15.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Validation Rules") && Guidewire_FMSourceFileMatch(SRCFILE,"validation.15.3.html") ) { return "validation.15.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Claim Fraud") && Guidewire_FMSourceFileMatch(SRCFILE,"fraud.16.1.html") ) { return "fraud.16.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Fraud Detection Overview") && Guidewire_FMSourceFileMatch(SRCFILE,"fraud.16.2.html") ) { return "fraud.16.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Rules can Evaluate Risk Potential") && Guidewire_FMSourceFileMatch(SRCFILE,"fraud.16.3.html") ) { return "fraud.16.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Question Sets also Evaluate Risk Potential") && Guidewire_FMSourceFileMatch(SRCFILE,"fraud.16.4.html") ) { return "fraud.16.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"The Special Investigations Score") && Guidewire_FMSourceFileMatch(SRCFILE,"fraud.16.5.html") ) { return "fraud.16.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"The Special Investigation Details Screen") && Guidewire_FMSourceFileMatch(SRCFILE,"fraud.16.6.html") ) { return "fraud.16.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Assessments") && Guidewire_FMSourceFileMatch(SRCFILE,"assessments.17.1.html") ) { return "assessments.17.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Assessment Overview") && Guidewire_FMSourceFileMatch(SRCFILE,"assessments.17.2.html") ) { return "assessments.17.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working With Assessments") && Guidewire_FMSourceFileMatch(SRCFILE,"assessments.17.3.html") ) { return "assessments.17.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Data Model for Assessments") && Guidewire_FMSourceFileMatch(SRCFILE,"assessments.17.4.html") ) { return "assessments.17.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Catastrophes") && Guidewire_FMSourceFileMatch(SRCFILE,"catastrophes.18.1.html") ) { return "catastrophes.18.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Catastrophe Overview") && Guidewire_FMSourceFileMatch(SRCFILE,"catastrophes.18.2.html") ) { return "catastrophes.18.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working With Catastrophes") && Guidewire_FMSourceFileMatch(SRCFILE,"catastrophes.18.3.html") ) { return "catastrophes.18.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Catastrophe Bulk Association") && Guidewire_FMSourceFileMatch(SRCFILE,"catastrophes.18.4.html") ) { return "catastrophes.18.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Associating Catastrophes and Claims") && Guidewire_FMSourceFileMatch(SRCFILE,"catastrophes.18.5.html") ) { return "catastrophes.18.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Service Provider Performance Reviews") && Guidewire_FMSourceFileMatch(SRCFILE,"serviceprovidermgmt.19.1.html") ) { return "serviceprovidermgmt.19.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Overview of Service Provider Performance Reviews") && Guidewire_FMSourceFileMatch(SRCFILE,"serviceprovidermgmt.19.2.html") ) { return "serviceprovidermgmt.19.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using Service Provider Performance Reviews") && Guidewire_FMSourceFileMatch(SRCFILE,"serviceprovidermgmt.19.3.html") ) { return "serviceprovidermgmt.19.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring Service Provider Performance Reviews") && Guidewire_FMSourceFileMatch(SRCFILE,"serviceprovidermgmt.19.4.html") ) { return "serviceprovidermgmt.19.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Data Model for Service Provider Performance Reviews") && Guidewire_FMSourceFileMatch(SRCFILE,"serviceprovidermgmt.19.5.html") ) { return "serviceprovidermgmt.19.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"ClaimCenter Financials") && Guidewire_FMSourceFileMatch(SRCFILE,"p-financials.html") ) { return "p-financials.html";}
else if (Guidewire_TopicMatch(TOPIC,"Claim Financials") && Guidewire_FMSourceFileMatch(SRCFILE,"financials.21.01.html") ) { return "financials.21.01.html";}
else if (Guidewire_TopicMatch(TOPIC,"Financial Overview") && Guidewire_FMSourceFileMatch(SRCFILE,"financials.21.02.html") ) { return "financials.21.02.html";}
else if (Guidewire_TopicMatch(TOPIC,"Transactions") && Guidewire_FMSourceFileMatch(SRCFILE,"financials.21.03.html") ) { return "financials.21.03.html";}
else if (Guidewire_TopicMatch(TOPIC,"Reserves") && Guidewire_FMSourceFileMatch(SRCFILE,"financials.21.04.html") ) { return "financials.21.04.html";}
else if (Guidewire_TopicMatch(TOPIC,"Reserve Lines") && Guidewire_FMSourceFileMatch(SRCFILE,"financials.21.05.html") ) { return "financials.21.05.html";}
else if (Guidewire_TopicMatch(TOPIC,"Payments") && Guidewire_FMSourceFileMatch(SRCFILE,"financials.21.06.html") ) { return "financials.21.06.html";}
else if (Guidewire_TopicMatch(TOPIC,"Checks") && Guidewire_FMSourceFileMatch(SRCFILE,"financials.21.07.html") ) { return "financials.21.07.html";}
else if (Guidewire_TopicMatch(TOPIC,"Electronic Funds Transfer (EFT)") && Guidewire_FMSourceFileMatch(SRCFILE,"financials.21.08.html") ) { return "financials.21.08.html";}
else if (Guidewire_TopicMatch(TOPIC,"Recoveries and Recovery Reserves") && Guidewire_FMSourceFileMatch(SRCFILE,"financials.21.09.html") ) { return "financials.21.09.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working With Transactions and Checks") && Guidewire_FMSourceFileMatch(SRCFILE,"financials.21.10.html") ) { return "financials.21.10.html";}
else if (Guidewire_TopicMatch(TOPIC,"How Transactions Affect Financial Values") && Guidewire_FMSourceFileMatch(SRCFILE,"financials.21.11.html") ) { return "financials.21.11.html";}
else if (Guidewire_TopicMatch(TOPIC,"Lifecycles of Financial Objects") && Guidewire_FMSourceFileMatch(SRCFILE,"financials.21.12.html") ) { return "financials.21.12.html";}
else if (Guidewire_TopicMatch(TOPIC,"Lifecycles of Transactions") && Guidewire_FMSourceFileMatch(SRCFILE,"financials.21.13.html") ) { return "financials.21.13.html";}
else if (Guidewire_TopicMatch(TOPIC,"Lifecycles of Checks") && Guidewire_FMSourceFileMatch(SRCFILE,"financials.21.14.html") ) { return "financials.21.14.html";}
else if (Guidewire_TopicMatch(TOPIC,"Integration with Other Accounting Systems") && Guidewire_FMSourceFileMatch(SRCFILE,"financials.21.15.html") ) { return "financials.21.15.html";}
else if (Guidewire_TopicMatch(TOPIC,"Summary of Financial Calculations") && Guidewire_FMSourceFileMatch(SRCFILE,"financials.21.16.html") ) { return "financials.21.16.html";}
else if (Guidewire_TopicMatch(TOPIC,"Financial Transactions Outside the User Interface") && Guidewire_FMSourceFileMatch(SRCFILE,"financials.21.17.html") ) { return "financials.21.17.html";}
else if (Guidewire_TopicMatch(TOPIC,"The Financials Data Model") && Guidewire_FMSourceFileMatch(SRCFILE,"financials.21.18.html") ) { return "financials.21.18.html";}
else if (Guidewire_TopicMatch(TOPIC,"Transaction Business Rules") && Guidewire_FMSourceFileMatch(SRCFILE,"financials.21.19.html") ) { return "financials.21.19.html";}
else if (Guidewire_TopicMatch(TOPIC,"Financials Permissions and Authority Limits") && Guidewire_FMSourceFileMatch(SRCFILE,"financials.21.20.html") ) { return "financials.21.20.html";}
else if (Guidewire_TopicMatch(TOPIC,"Multiple Currencies") && Guidewire_FMSourceFileMatch(SRCFILE,"multicurrency.22.1.html") ) { return "multicurrency.22.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Multicurrency Overview") && Guidewire_FMSourceFileMatch(SRCFILE,"multicurrency.22.2.html") ) { return "multicurrency.22.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Multicurrency Displays") && Guidewire_FMSourceFileMatch(SRCFILE,"multicurrency.22.3.html") ) { return "multicurrency.22.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Multicurrency Financial Summaries") && Guidewire_FMSourceFileMatch(SRCFILE,"multicurrency.22.4.html") ) { return "multicurrency.22.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Exchange Rates") && Guidewire_FMSourceFileMatch(SRCFILE,"multicurrency.22.5.html") ) { return "multicurrency.22.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Foreign Exchange Adjustments") && Guidewire_FMSourceFileMatch(SRCFILE,"multicurrency.22.6.html") ) { return "multicurrency.22.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Bulk Invoices Use Multiple Currencies") && Guidewire_FMSourceFileMatch(SRCFILE,"multicurrency.22.7.html") ) { return "multicurrency.22.7.html";}
else if (Guidewire_TopicMatch(TOPIC,"Multicurrency Data Model") && Guidewire_FMSourceFileMatch(SRCFILE,"multicurrency.22.8.html") ) { return "multicurrency.22.8.html";}
else if (Guidewire_TopicMatch(TOPIC,"Deductible Handling") && Guidewire_FMSourceFileMatch(SRCFILE,"deductible_handling.23.1.html") ) { return "deductible_handling.23.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Deductible Handling Overview") && Guidewire_FMSourceFileMatch(SRCFILE,"deductible_handling.23.2.html") ) { return "deductible_handling.23.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working with Deductibles") && Guidewire_FMSourceFileMatch(SRCFILE,"deductible_handling.23.3.html") ) { return "deductible_handling.23.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Viewing Deductibles") && Guidewire_FMSourceFileMatch(SRCFILE,"deductible_handling.23.4.html") ) { return "deductible_handling.23.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Applying Deductibles") && Guidewire_FMSourceFileMatch(SRCFILE,"deductible_handling.23.5.html") ) { return "deductible_handling.23.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Editing Deductibles") && Guidewire_FMSourceFileMatch(SRCFILE,"deductible_handling.23.6.html") ) { return "deductible_handling.23.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Waiving Deductibles") && Guidewire_FMSourceFileMatch(SRCFILE,"deductible_handling.23.7.html") ) { return "deductible_handling.23.7.html";}
else if (Guidewire_TopicMatch(TOPIC,"Setting Up Deductibles") && Guidewire_FMSourceFileMatch(SRCFILE,"deductible_handling.23.8.html") ) { return "deductible_handling.23.8.html";}
else if (Guidewire_TopicMatch(TOPIC,"Bulk Invoices") && Guidewire_FMSourceFileMatch(SRCFILE,"bulkinvoice.24.1.html") ) { return "bulkinvoice.24.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Bulk Invoice Screens") && Guidewire_FMSourceFileMatch(SRCFILE,"bulkinvoice.24.2.html") ) { return "bulkinvoice.24.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Creating a Bulk Invoice") && Guidewire_FMSourceFileMatch(SRCFILE,"bulkinvoice.24.3.html") ) { return "bulkinvoice.24.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Lifecycle of a Bulk Invoice and its Line Items") && Guidewire_FMSourceFileMatch(SRCFILE,"bulkinvoice.24.4.html") ) { return "bulkinvoice.24.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Viewing Bulk Invoices From the Desktop") && Guidewire_FMSourceFileMatch(SRCFILE,"bulkinvoice.24.5.html") ) { return "bulkinvoice.24.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Bulk Invoices and Multicurrency") && Guidewire_FMSourceFileMatch(SRCFILE,"bulkinvoice.24.6.html") ) { return "bulkinvoice.24.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Bulk Invoice Financials Permissions and Authority Limits") && Guidewire_FMSourceFileMatch(SRCFILE,"bulkinvoice.24.7.html") ) { return "bulkinvoice.24.7.html";}
else if (Guidewire_TopicMatch(TOPIC,"Bulk Invoice Web Service API") && Guidewire_FMSourceFileMatch(SRCFILE,"bulkinvoice.24.8.html") ) { return "bulkinvoice.24.8.html";}
else if (Guidewire_TopicMatch(TOPIC,"The Bulk Invoice Data Model") && Guidewire_FMSourceFileMatch(SRCFILE,"bulkinvoice.24.9.html") ) { return "bulkinvoice.24.9.html";}
else if (Guidewire_TopicMatch(TOPIC,"ClaimCenter Components") && Guidewire_FMSourceFileMatch(SRCFILE,"p-components.html") ) { return "p-components.html";}
else if (Guidewire_TopicMatch(TOPIC,"Assigning Work") && Guidewire_FMSourceFileMatch(SRCFILE,"assignments.26.1.html") ) { return "assignments.26.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Assignment Models the Way A Carrier Distributes Work") && Guidewire_FMSourceFileMatch(SRCFILE,"assignments.26.2.html") ) { return "assignments.26.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"What Work is Assignable") && Guidewire_FMSourceFileMatch(SRCFILE,"assignments.26.3.html") ) { return "assignments.26.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"How Work is Assigned") && Guidewire_FMSourceFileMatch(SRCFILE,"assignments.26.4.html") ) { return "assignments.26.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Assignment Methods") && Guidewire_FMSourceFileMatch(SRCFILE,"assignments.26.5.html") ) { return "assignments.26.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Queues") && Guidewire_FMSourceFileMatch(SRCFILE,"assignments.26.6.html") ) { return "assignments.26.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Claim Segmentation") && Guidewire_FMSourceFileMatch(SRCFILE,"segmentations.27.1.html") ) { return "segmentations.27.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Automated Claim Setup") && Guidewire_FMSourceFileMatch(SRCFILE,"segmentations.27.2.html") ) { return "segmentations.27.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Segmentation Rules") && Guidewire_FMSourceFileMatch(SRCFILE,"segmentations.27.3.html") ) { return "segmentations.27.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Strategy is Similar to Segmentation") && Guidewire_FMSourceFileMatch(SRCFILE,"segmentations.27.4.html") ) { return "segmentations.27.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working with Activities") && Guidewire_FMSourceFileMatch(SRCFILE,"activities.28.1.html") ) { return "activities.28.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Activities Overview") && Guidewire_FMSourceFileMatch(SRCFILE,"activities.28.2.html") ) { return "activities.28.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Displaying Activities") && Guidewire_FMSourceFileMatch(SRCFILE,"activities.28.3.html") ) { return "activities.28.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Activity Patterns") && Guidewire_FMSourceFileMatch(SRCFILE,"activities.28.4.html") ) { return "activities.28.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Activity Calendars") && Guidewire_FMSourceFileMatch(SRCFILE,"activities.28.5.html") ) { return "activities.28.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Activities and the Data Model") && Guidewire_FMSourceFileMatch(SRCFILE,"activities.28.6.html") ) { return "activities.28.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Outbound Email") && Guidewire_FMSourceFileMatch(SRCFILE,"email.29.1.html") ) { return "email.29.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working with Email in Claims") && Guidewire_FMSourceFileMatch(SRCFILE,"email.29.2.html") ) { return "email.29.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"How Emails are Sent") && Guidewire_FMSourceFileMatch(SRCFILE,"email.29.3.html") ) { return "email.29.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Incidents") && Guidewire_FMSourceFileMatch(SRCFILE,"incidents.30.1.html") ) { return "incidents.30.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Incident Overview") && Guidewire_FMSourceFileMatch(SRCFILE,"incidents.30.2.html") ) { return "incidents.30.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Incidents, Exposures, and Claims") && Guidewire_FMSourceFileMatch(SRCFILE,"incidents.30.3.html") ) { return "incidents.30.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"The Incident Entity and Its Subtypes") && Guidewire_FMSourceFileMatch(SRCFILE,"incidents.30.4.html") ) { return "incidents.30.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working with Incidents") && Guidewire_FMSourceFileMatch(SRCFILE,"incidents.30.5.html") ) { return "incidents.30.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Incident Only Claims") && Guidewire_FMSourceFileMatch(SRCFILE,"incidents.30.6.html") ) { return "incidents.30.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Legal Matters") && Guidewire_FMSourceFileMatch(SRCFILE,"matters.31.1.html") ) { return "matters.31.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Legal Matters Overview") && Guidewire_FMSourceFileMatch(SRCFILE,"matters.31.2.html") ) { return "matters.31.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working with Matters") && Guidewire_FMSourceFileMatch(SRCFILE,"matters.31.3.html") ) { return "matters.31.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Notes in ClaimCenter") && Guidewire_FMSourceFileMatch(SRCFILE,"notes.32.1.html") ) { return "notes.32.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Differences Between Notes and Documents") && Guidewire_FMSourceFileMatch(SRCFILE,"notes.32.2.html") ) { return "notes.32.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working with Notes") && Guidewire_FMSourceFileMatch(SRCFILE,"notes.32.3.html") ) { return "notes.32.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Notes Security") && Guidewire_FMSourceFileMatch(SRCFILE,"notes.32.4.html") ) { return "notes.32.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring Notes") && Guidewire_FMSourceFileMatch(SRCFILE,"notes.32.5.html") ) { return "notes.32.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Holidays and Business Weeks") && Guidewire_FMSourceFileMatch(SRCFILE,"holidays.33.1.html") ) { return "holidays.33.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Specifying Holiday Dates") && Guidewire_FMSourceFileMatch(SRCFILE,"holidays.33.2.html") ) { return "holidays.33.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working with Holidays, Weekends, and Business Weeks") && Guidewire_FMSourceFileMatch(SRCFILE,"holidays.33.3.html") ) { return "holidays.33.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using Gosu Methods to Work with Holidays") && Guidewire_FMSourceFileMatch(SRCFILE,"holidays.33.4.html") ) { return "holidays.33.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Business Weeks") && Guidewire_FMSourceFileMatch(SRCFILE,"holidays.33.5.html") ) { return "holidays.33.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Holiday Permissions") && Guidewire_FMSourceFileMatch(SRCFILE,"holidays.33.6.html") ) { return "holidays.33.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Vacation Status") && Guidewire_FMSourceFileMatch(SRCFILE,"vacations.html") ) { return "vacations.html";}
else if (Guidewire_TopicMatch(TOPIC,"Question Sets") && Guidewire_FMSourceFileMatch(SRCFILE,"questionset.35.1.html") ) { return "questionset.35.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Service Provider Question Sets") && Guidewire_FMSourceFileMatch(SRCFILE,"questionset.35.2.html") ) { return "questionset.35.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Fraud Question Sets and the Use of Risk Points") && Guidewire_FMSourceFileMatch(SRCFILE,"questionset.35.3.html") ) { return "questionset.35.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working with Question Sets") && Guidewire_FMSourceFileMatch(SRCFILE,"questionset.35.4.html") ) { return "questionset.35.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Question Sets Key Entities") && Guidewire_FMSourceFileMatch(SRCFILE,"questionset.35.5.html") ) { return "questionset.35.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Reinsurance") && Guidewire_FMSourceFileMatch(SRCFILE,"reinsurance.36.1.html") ) { return "reinsurance.36.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Reinsurance Overview") && Guidewire_FMSourceFileMatch(SRCFILE,"reinsurance.36.2.html") ) { return "reinsurance.36.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Reinsurance Manager") && Guidewire_FMSourceFileMatch(SRCFILE,"reinsurance.36.3.html") ) { return "reinsurance.36.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working with Claims for Reinsurance") && Guidewire_FMSourceFileMatch(SRCFILE,"reinsurance.36.4.html") ) { return "reinsurance.36.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Reinsurance Data Model") && Guidewire_FMSourceFileMatch(SRCFILE,"reinsurance.36.5.html") ) { return "reinsurance.36.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Subrogation") && Guidewire_FMSourceFileMatch(SRCFILE,"subrogations.37.1.html") ) { return "subrogations.37.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working With Subrogation") && Guidewire_FMSourceFileMatch(SRCFILE,"subrogations.37.2.html") ) { return "subrogations.37.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Enabling Subrogation") && Guidewire_FMSourceFileMatch(SRCFILE,"subrogations.37.3.html") ) { return "subrogations.37.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Subrogation Data Model") && Guidewire_FMSourceFileMatch(SRCFILE,"subrogations.37.4.html") ) { return "subrogations.37.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Lines of Business") && Guidewire_FMSourceFileMatch(SRCFILE,"p-lobs.html") ) { return "p-lobs.html";}
else if (Guidewire_TopicMatch(TOPIC,"Homeowner\u2019s Line of Business") && Guidewire_FMSourceFileMatch(SRCFILE,"homeowners.39.1.html") ) { return "homeowners.39.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Homeowner\u2019s Screens") && Guidewire_FMSourceFileMatch(SRCFILE,"homeowners.39.2.html") ) { return "homeowners.39.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Homeowner\u2019s Types") && Guidewire_FMSourceFileMatch(SRCFILE,"homeowners.39.3.html") ) { return "homeowners.39.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Personal Travel Line of Business") && Guidewire_FMSourceFileMatch(SRCFILE,"travel.40.1.html") ) { return "travel.40.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Personal Travel Insurance Overview") && Guidewire_FMSourceFileMatch(SRCFILE,"travel.40.2.html") ) { return "travel.40.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working with the Travel Line of Business") && Guidewire_FMSourceFileMatch(SRCFILE,"travel.40.3.html") ) { return "travel.40.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Personal Travel Screens") && Guidewire_FMSourceFileMatch(SRCFILE,"travel.40.4.html") ) { return "travel.40.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Personal Travel Coverage Types") && Guidewire_FMSourceFileMatch(SRCFILE,"travel.40.5.html") ) { return "travel.40.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Workers\u2019 Compensation Line of Business") && Guidewire_FMSourceFileMatch(SRCFILE,"workers_comp.41.1.html") ) { return "workers_comp.41.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Workers\u2019 Compensation Overview") && Guidewire_FMSourceFileMatch(SRCFILE,"workers_comp.41.2.html") ) { return "workers_comp.41.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Workers\u2019 Compensation Screens") && Guidewire_FMSourceFileMatch(SRCFILE,"workers_comp.41.3.html") ) { return "workers_comp.41.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Compensability Decision") && Guidewire_FMSourceFileMatch(SRCFILE,"workers_comp.41.4.html") ) { return "workers_comp.41.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Finding Injured Workers") && Guidewire_FMSourceFileMatch(SRCFILE,"workers_comp.41.5.html") ) { return "workers_comp.41.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Jurisdictional Benefit Calculation Management") && Guidewire_FMSourceFileMatch(SRCFILE,"workers_comp.41.6.html") ) { return "workers_comp.41.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Workers\u2019 Compensation Administration") && Guidewire_FMSourceFileMatch(SRCFILE,"workers_comp.41.7.html") ) { return "workers_comp.41.7.html";}
else if (Guidewire_TopicMatch(TOPIC,"Workers\u2019 Compensation Types") && Guidewire_FMSourceFileMatch(SRCFILE,"workers_comp.41.8.html") ) { return "workers_comp.41.8.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring Your Lines of Business") && Guidewire_FMSourceFileMatch(SRCFILE,"lobs.42.1.html") ) { return "lobs.42.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"LOB Typelists") && Guidewire_FMSourceFileMatch(SRCFILE,"lobs.42.2.html") ) { return "lobs.42.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Relationships Among LOB Typelists") && Guidewire_FMSourceFileMatch(SRCFILE,"lobs.42.3.html") ) { return "lobs.42.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Coverages and Policies") && Guidewire_FMSourceFileMatch(SRCFILE,"lobs.42.4.html") ) { return "lobs.42.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"ClaimCenter Management") && Guidewire_FMSourceFileMatch(SRCFILE,"p-management.html") ) { return "p-management.html";}
else if (Guidewire_TopicMatch(TOPIC,"Claim Performance Monitoring") && Guidewire_FMSourceFileMatch(SRCFILE,"claim_perf_monitor.44.1.html") ) { return "claim_perf_monitor.44.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Claim Health Metrics") && Guidewire_FMSourceFileMatch(SRCFILE,"claim_perf_monitor.44.2.html") ) { return "claim_perf_monitor.44.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Claim Health Metric Fields") && Guidewire_FMSourceFileMatch(SRCFILE,"claim_perf_monitor.44.3.html") ) { return "claim_perf_monitor.44.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Claim Health Metrics Calculations") && Guidewire_FMSourceFileMatch(SRCFILE,"claim_perf_monitor.44.4.html") ) { return "claim_perf_monitor.44.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Claim Tiers") && Guidewire_FMSourceFileMatch(SRCFILE,"claim_perf_monitor.44.5.html") ) { return "claim_perf_monitor.44.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Aggregate Reports") && Guidewire_FMSourceFileMatch(SRCFILE,"claim_perf_monitor.44.6.html") ) { return "claim_perf_monitor.44.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Claim Headline") && Guidewire_FMSourceFileMatch(SRCFILE,"claim_perf_monitor.44.7.html") ) { return "claim_perf_monitor.44.7.html";}
else if (Guidewire_TopicMatch(TOPIC,"The Claim Status Screen") && Guidewire_FMSourceFileMatch(SRCFILE,"claim_perf_monitor.44.8.html") ) { return "claim_perf_monitor.44.8.html";}
else if (Guidewire_TopicMatch(TOPIC,"Administering Metrics and Thresholds") && Guidewire_FMSourceFileMatch(SRCFILE,"claim_perf_monitor.44.9.html") ) { return "claim_perf_monitor.44.9.html";}
else if (Guidewire_TopicMatch(TOPIC,"Team Management") && Guidewire_FMSourceFileMatch(SRCFILE,"team.45.1.html") ) { return "team.45.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Team Management Overview") && Guidewire_FMSourceFileMatch(SRCFILE,"team.45.2.html") ) { return "team.45.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using Flags") && Guidewire_FMSourceFileMatch(SRCFILE,"team.45.3.html") ) { return "team.45.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Dashboard") && Guidewire_FMSourceFileMatch(SRCFILE,"dashboard.html") ) { return "dashboard.html";}
else if (Guidewire_TopicMatch(TOPIC,"Key Integrations") && Guidewire_FMSourceFileMatch(SRCFILE,"p-key-integrations.html") ) { return "p-key-integrations.html";}
else if (Guidewire_TopicMatch(TOPIC,"ClaimCenter Integration Points") && Guidewire_FMSourceFileMatch(SRCFILE,"key_integrations.48.1.html") ) { return "key_integrations.48.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Systems That Can Require Integration") && Guidewire_FMSourceFileMatch(SRCFILE,"key_integrations.48.2.html") ) { return "key_integrations.48.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Policy System Integration") && Guidewire_FMSourceFileMatch(SRCFILE,"pas.49.1.html") ) { return "pas.49.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Policy System Integration Overview") && Guidewire_FMSourceFileMatch(SRCFILE,"pas.49.2.html") ) { return "pas.49.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Getting a Policy into ClaimCenter") && Guidewire_FMSourceFileMatch(SRCFILE,"pas.49.3.html") ) { return "pas.49.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Viewing Policies in a Policy Administration System (PAS)") && Guidewire_FMSourceFileMatch(SRCFILE,"pas.49.4.html") ) { return "pas.49.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Large Loss Notifications") && Guidewire_FMSourceFileMatch(SRCFILE,"pas.49.5.html") ) { return "pas.49.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Permissions for Working with Policies") && Guidewire_FMSourceFileMatch(SRCFILE,"pas.49.6.html") ) { return "pas.49.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Contacts") && Guidewire_FMSourceFileMatch(SRCFILE,"contacts.50.1.html") ) { return "contacts.50.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"The Address Book in ClaimCenter") && Guidewire_FMSourceFileMatch(SRCFILE,"contacts.50.2.html") ) { return "contacts.50.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using ContactCenter") && Guidewire_FMSourceFileMatch(SRCFILE,"contacts.50.3.html") ) { return "contacts.50.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Document Management") && Guidewire_FMSourceFileMatch(SRCFILE,"documents.51.1.html") ) { return "documents.51.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Document Security") && Guidewire_FMSourceFileMatch(SRCFILE,"documents.51.2.html") ) { return "documents.51.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working With Documents") && Guidewire_FMSourceFileMatch(SRCFILE,"documents.51.3.html") ) { return "documents.51.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring Document Management") && Guidewire_FMSourceFileMatch(SRCFILE,"documents.51.4.html") ) { return "documents.51.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Document Management Integration") && Guidewire_FMSourceFileMatch(SRCFILE,"documents.51.5.html") ) { return "documents.51.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Metropolitan Reports") && Guidewire_FMSourceFileMatch(SRCFILE,"metro_reports.52.1.html") ) { return "metro_reports.52.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Metropolitan Reports Overview") && Guidewire_FMSourceFileMatch(SRCFILE,"metro_reports.52.2.html") ) { return "metro_reports.52.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working with Metropolitan Reports") && Guidewire_FMSourceFileMatch(SRCFILE,"metro_reports.52.3.html") ) { return "metro_reports.52.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Preupdate Rules and Metropolitan Reports") && Guidewire_FMSourceFileMatch(SRCFILE,"metro_reports.52.4.html") ) { return "metro_reports.52.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Activity Patterns and Metropolitan Reports") && Guidewire_FMSourceFileMatch(SRCFILE,"metro_reports.52.5.html") ) { return "metro_reports.52.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Metropolitan Reports Uses a Workflow") && Guidewire_FMSourceFileMatch(SRCFILE,"metro_reports.52.6.html") ) { return "metro_reports.52.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Reports") && Guidewire_FMSourceFileMatch(SRCFILE,"reports.html") ) { return "reports.html";}
else if (Guidewire_TopicMatch(TOPIC,"ISO and Claims") && Guidewire_FMSourceFileMatch(SRCFILE,"iso.54.1.html") ) { return "iso.54.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"ISO Interacts with Claims and Exposures") && Guidewire_FMSourceFileMatch(SRCFILE,"iso.54.2.html") ) { return "iso.54.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"How Does ISO Work With ClaimCenter") && Guidewire_FMSourceFileMatch(SRCFILE,"iso.54.3.html") ) { return "iso.54.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"ISO Permissions") && Guidewire_FMSourceFileMatch(SRCFILE,"iso.54.4.html") ) { return "iso.54.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"ClaimCenter Administration") && Guidewire_FMSourceFileMatch(SRCFILE,"p-administering.html") ) { return "p-administering.html";}
else if (Guidewire_TopicMatch(TOPIC,"Users, Groups, and Regions") && Guidewire_FMSourceFileMatch(SRCFILE,"groups_users_queues.56.1.html") ) { return "groups_users_queues.56.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Groups") && Guidewire_FMSourceFileMatch(SRCFILE,"groups_users_queues.56.2.html") ) { return "groups_users_queues.56.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Users") && Guidewire_FMSourceFileMatch(SRCFILE,"groups_users_queues.56.3.html") ) { return "groups_users_queues.56.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Roles") && Guidewire_FMSourceFileMatch(SRCFILE,"groups_users_queues.56.4.html") ) { return "groups_users_queues.56.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Assignment Queues") && Guidewire_FMSourceFileMatch(SRCFILE,"groups_users_queues.56.5.html") ) { return "groups_users_queues.56.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Regions") && Guidewire_FMSourceFileMatch(SRCFILE,"groups_users_queues.56.6.html") ) { return "groups_users_queues.56.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Security: Roles, Permissions, and Access Controls") && Guidewire_FMSourceFileMatch(SRCFILE,"securityrole.57.1.html") ) { return "securityrole.57.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Role-Based Security") && Guidewire_FMSourceFileMatch(SRCFILE,"securityrole.57.2.html") ) { return "securityrole.57.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Data-based Security - Claim Access Control") && Guidewire_FMSourceFileMatch(SRCFILE,"securityrole.57.3.html") ) { return "securityrole.57.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Access Control for Documents and Notes") && Guidewire_FMSourceFileMatch(SRCFILE,"securityrole.57.4.html") ) { return "securityrole.57.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Access Control for Exposures") && Guidewire_FMSourceFileMatch(SRCFILE,"securityrole.57.5.html") ) { return "securityrole.57.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working with Exposure Security") && Guidewire_FMSourceFileMatch(SRCFILE,"securityrole.57.6.html") ) { return "securityrole.57.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"User Login and Passwords") && Guidewire_FMSourceFileMatch(SRCFILE,"securityrole.57.7.html") ) { return "securityrole.57.7.html";}
else if (Guidewire_TopicMatch(TOPIC,"Security Dictionary") && Guidewire_FMSourceFileMatch(SRCFILE,"securityrole.57.8.html") ) { return "securityrole.57.8.html";}
else if (Guidewire_TopicMatch(TOPIC,"Data Model for Access Control Profiles") && Guidewire_FMSourceFileMatch(SRCFILE,"securityrole.57.9.html") ) { return "securityrole.57.9.html";}
else if (Guidewire_TopicMatch(TOPIC,"Administering ClaimCenter") && Guidewire_FMSourceFileMatch(SRCFILE,"administration.58.1.html") ) { return "administration.58.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"User Administration Tasks") && Guidewire_FMSourceFileMatch(SRCFILE,"administration.58.2.html") ) { return "administration.58.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"The Administration Tab") && Guidewire_FMSourceFileMatch(SRCFILE,"administration.58.3.html") ) { return "administration.58.3.html";}
else { return("../wwhelp/topic_cannot_be_found.html"); } }

function  WWHBookData_MatchTopic(P)
{
var C=null;P=decodeURIComponent(decodeURIComponent(escape(P)));//workaround epub bug with UTF8 processing!
if(P=="Documents_and_Their_Management")C="documents.51.1.html";
if (C) { return C } else { return GUIDEWIRE_TOPIC_TO_FILE(P,Guidewire_ExtractSrcFromURL());}
}
