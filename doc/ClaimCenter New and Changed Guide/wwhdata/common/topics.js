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

else if (Guidewire_TopicMatch(TOPIC,"ClaimCenter New and Changed Guide") && Guidewire_FMSourceFileMatch(SRCFILE,"cover-whatsnew.html") ) { return "cover-whatsnew.html";}
else if (Guidewire_TopicMatch(TOPIC,"About This Document") && Guidewire_FMSourceFileMatch(SRCFILE,"about.html") ) { return "about.html";}
else if (Guidewire_TopicMatch(TOPIC,"What\u2019s New and Changed in 6.0") && Guidewire_FMSourceFileMatch(SRCFILE,"part-b.html") ) { return "part-b.html";}
else if (Guidewire_TopicMatch(TOPIC,"New and Changed in ClaimCenter 6.0") && Guidewire_FMSourceFileMatch(SRCFILE,"c-app.04.1.html") ) { return "c-app.04.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"New in ClaimCenter 6.0") && Guidewire_FMSourceFileMatch(SRCFILE,"c-app.04.2.html") ) { return "c-app.04.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Changes in ClaimCenter 6.0") && Guidewire_FMSourceFileMatch(SRCFILE,"c-app.04.3.html") ) { return "c-app.04.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Minor Exposure and Typelist Method Changes") && Guidewire_FMSourceFileMatch(SRCFILE,"c-app.04.4.html") ) { return "c-app.04.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"New and Changed in Configuration in 6.0") && Guidewire_FMSourceFileMatch(SRCFILE,"c-configuration.05.01.html") ) { return "c-configuration.05.01.html";}
else if (Guidewire_TopicMatch(TOPIC,"Changes to the Guidewire ClaimCenter Data Model") && Guidewire_FMSourceFileMatch(SRCFILE,"c-configuration.05.02.html") ) { return "c-configuration.05.02.html";}
else if (Guidewire_TopicMatch(TOPIC,"Changes in Studio") && Guidewire_FMSourceFileMatch(SRCFILE,"c-configuration.05.03.html") ) { return "c-configuration.05.03.html";}
else if (Guidewire_TopicMatch(TOPIC,"Changes Related to PCF Files") && Guidewire_FMSourceFileMatch(SRCFILE,"c-configuration.05.04.html") ) { return "c-configuration.05.04.html";}
else if (Guidewire_TopicMatch(TOPIC,"Changes Related to Workflow") && Guidewire_FMSourceFileMatch(SRCFILE,"c-configuration.05.05.html") ) { return "c-configuration.05.05.html";}
else if (Guidewire_TopicMatch(TOPIC,"Improvements in Localization") && Guidewire_FMSourceFileMatch(SRCFILE,"c-configuration.05.06.html") ) { return "c-configuration.05.06.html";}
else if (Guidewire_TopicMatch(TOPIC,"Catastrophe Bulk Associations Batch Job") && Guidewire_FMSourceFileMatch(SRCFILE,"c-configuration.05.07.html") ) { return "c-configuration.05.07.html";}
else if (Guidewire_TopicMatch(TOPIC,"Changes in Duplicate Claim and Check Searches") && Guidewire_FMSourceFileMatch(SRCFILE,"c-configuration.05.08.html") ) { return "c-configuration.05.08.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring Claim Health Metrics") && Guidewire_FMSourceFileMatch(SRCFILE,"c-configuration.05.09.html") ) { return "c-configuration.05.09.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring Deductibles") && Guidewire_FMSourceFileMatch(SRCFILE,"c-configuration.05.10.html") ) { return "c-configuration.05.10.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring Approval Rules with Bulk Invoice Checks") && Guidewire_FMSourceFileMatch(SRCFILE,"c-configuration.05.11.html") ) { return "c-configuration.05.11.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring Recently Viewed Claims in the Claim Tab") && Guidewire_FMSourceFileMatch(SRCFILE,"c-configuration.05.12.html") ) { return "c-configuration.05.12.html";}
else if (Guidewire_TopicMatch(TOPIC,"New and Changed in Gosu in 6.0") && Guidewire_FMSourceFileMatch(SRCFILE,"c-gosu.06.01.html") ) { return "c-gosu.06.01.html";}
else if (Guidewire_TopicMatch(TOPIC,"New in Gosu in 6.0") && Guidewire_FMSourceFileMatch(SRCFILE,"c-gosu.06.02.html") ) { return "c-gosu.06.02.html";}
else if (Guidewire_TopicMatch(TOPIC,"Gosu Shell") && Guidewire_FMSourceFileMatch(SRCFILE,"c-gosu.06.03.html") ) { return "c-gosu.06.03.html";}
else if (Guidewire_TopicMatch(TOPIC,"Gosu Generated Documentation from Type System") && Guidewire_FMSourceFileMatch(SRCFILE,"c-gosu.06.04.html") ) { return "c-gosu.06.04.html";}
else if (Guidewire_TopicMatch(TOPIC,"Run Local Command-line Commands from Gosu") && Guidewire_FMSourceFileMatch(SRCFILE,"c-gosu.06.05.html") ) { return "c-gosu.06.05.html";}
else if (Guidewire_TopicMatch(TOPIC,"Shell-related APIs") && Guidewire_FMSourceFileMatch(SRCFILE,"c-gosu.06.06.html") ) { return "c-gosu.06.06.html";}
else if (Guidewire_TopicMatch(TOPIC,"Increment and Decrement Operators") && Guidewire_FMSourceFileMatch(SRCFILE,"c-gosu.06.07.html") ) { return "c-gosu.06.07.html";}
else if (Guidewire_TopicMatch(TOPIC,"New Expression Operators") && Guidewire_FMSourceFileMatch(SRCFILE,"c-gosu.06.08.html") ) { return "c-gosu.06.08.html";}
else if (Guidewire_TopicMatch(TOPIC,"New Compound Assignment Operators") && Guidewire_FMSourceFileMatch(SRCFILE,"c-gosu.06.09.html") ) { return "c-gosu.06.09.html";}
else if (Guidewire_TopicMatch(TOPIC,"Gosu Templates") && Guidewire_FMSourceFileMatch(SRCFILE,"c-gosu.06.10.html") ) { return "c-gosu.06.10.html";}
else if (Guidewire_TopicMatch(TOPIC,"Gosu Composition Syntax") && Guidewire_FMSourceFileMatch(SRCFILE,"c-gosu.06.11.html") ) { return "c-gosu.06.11.html";}
else if (Guidewire_TopicMatch(TOPIC,"Object Lifecycle Management with the \u2018using\u2019 Keyword") && Guidewire_FMSourceFileMatch(SRCFILE,"c-gosu.06.12.html") ) { return "c-gosu.06.12.html";}
else if (Guidewire_TopicMatch(TOPIC,"Type Inference Downcasting") && Guidewire_FMSourceFileMatch(SRCFILE,"c-gosu.06.13.html") ) { return "c-gosu.06.13.html";}
else if (Guidewire_TopicMatch(TOPIC,"Profiler Tags") && Guidewire_FMSourceFileMatch(SRCFILE,"c-gosu.06.14.html") ) { return "c-gosu.06.14.html";}
else if (Guidewire_TopicMatch(TOPIC,"The Object Equality Operator (===)") && Guidewire_FMSourceFileMatch(SRCFILE,"c-gosu.06.15.html") ) { return "c-gosu.06.15.html";}
else if (Guidewire_TopicMatch(TOPIC,"Object Initializer Syntax During Object Creation") && Guidewire_FMSourceFileMatch(SRCFILE,"c-gosu.06.16.html") ) { return "c-gosu.06.16.html";}
else if (Guidewire_TopicMatch(TOPIC,"Type System Reflection New APIs") && Guidewire_FMSourceFileMatch(SRCFILE,"c-gosu.06.17.html") ) { return "c-gosu.06.17.html";}
else if (Guidewire_TopicMatch(TOPIC,"New Stream Utilities") && Guidewire_FMSourceFileMatch(SRCFILE,"c-gosu.06.18.html") ) { return "c-gosu.06.18.html";}
else if (Guidewire_TopicMatch(TOPIC,"Concurrency Utilities") && Guidewire_FMSourceFileMatch(SRCFILE,"c-gosu.06.19.html") ) { return "c-gosu.06.19.html";}
else if (Guidewire_TopicMatch(TOPIC,"Checksum APIs") && Guidewire_FMSourceFileMatch(SRCFILE,"c-gosu.06.20.html") ) { return "c-gosu.06.20.html";}
else if (Guidewire_TopicMatch(TOPIC,"Run With New Bundle With a User") && Guidewire_FMSourceFileMatch(SRCFILE,"c-gosu.06.21.html") ) { return "c-gosu.06.21.html";}
else if (Guidewire_TopicMatch(TOPIC,"Changed in Gosu in 6.0") && Guidewire_FMSourceFileMatch(SRCFILE,"c-gosu.06.22.html") ) { return "c-gosu.06.22.html";}
else if (Guidewire_TopicMatch(TOPIC,"Renamed GScript to Gosu") && Guidewire_FMSourceFileMatch(SRCFILE,"c-gosu.06.23.html") ) { return "c-gosu.06.23.html";}
else if (Guidewire_TopicMatch(TOPIC,"Moved Classes Hierarchy") && Guidewire_FMSourceFileMatch(SRCFILE,"c-gosu.06.24.html") ) { return "c-gosu.06.24.html";}
else if (Guidewire_TopicMatch(TOPIC,"Java Collection Generics Fixes") && Guidewire_FMSourceFileMatch(SRCFILE,"c-gosu.06.25.html") ) { return "c-gosu.06.25.html";}
else if (Guidewire_TopicMatch(TOPIC,"Data Structure Declaration Extensions for Lists, Maps, and Sets") && Guidewire_FMSourceFileMatch(SRCFILE,"c-gosu.06.26.html") ) { return "c-gosu.06.26.html";}
else if (Guidewire_TopicMatch(TOPIC,"Class Variables Can Both Expose as Property and Have Initializer") && Guidewire_FMSourceFileMatch(SRCFILE,"c-gosu.06.27.html") ) { return "c-gosu.06.27.html";}
else if (Guidewire_TopicMatch(TOPIC,"Compound Types") && Guidewire_FMSourceFileMatch(SRCFILE,"c-gosu.06.28.html") ) { return "c-gosu.06.28.html";}
else if (Guidewire_TopicMatch(TOPIC,"Change in Ternary Conditionals If Clauses Return Different Types") && Guidewire_FMSourceFileMatch(SRCFILE,"c-gosu.06.29.html") ) { return "c-gosu.06.29.html";}
else if (Guidewire_TopicMatch(TOPIC,"Moved Enhancement Packages") && Guidewire_FMSourceFileMatch(SRCFILE,"c-gosu.06.30.html") ) { return "c-gosu.06.30.html";}
else if (Guidewire_TopicMatch(TOPIC,"XML Node Package Name Changed") && Guidewire_FMSourceFileMatch(SRCFILE,"c-gosu.06.31.html") ) { return "c-gosu.06.31.html";}
else if (Guidewire_TopicMatch(TOPIC,"Gosu Error Reporting Improvements") && Guidewire_FMSourceFileMatch(SRCFILE,"c-gosu.06.32.html") ) { return "c-gosu.06.32.html";}
else if (Guidewire_TopicMatch(TOPIC,"Improvements to XSD and XML Processing") && Guidewire_FMSourceFileMatch(SRCFILE,"c-gosu.06.33.html") ) { return "c-gosu.06.33.html";}
else if (Guidewire_TopicMatch(TOPIC,"Changes to XSD Class Loading Behavior") && Guidewire_FMSourceFileMatch(SRCFILE,"c-gosu.06.34.html") ) { return "c-gosu.06.34.html";}
else if (Guidewire_TopicMatch(TOPIC,"Query Builder API Changes") && Guidewire_FMSourceFileMatch(SRCFILE,"c-gosu.06.35.html") ) { return "c-gosu.06.35.html";}
else if (Guidewire_TopicMatch(TOPIC,"Query Builder API Improvements") && Guidewire_FMSourceFileMatch(SRCFILE,"c-gosu.06.36.html") ) { return "c-gosu.06.36.html";}
else if (Guidewire_TopicMatch(TOPIC,"Blocks Require Single Statements in Braces") && Guidewire_FMSourceFileMatch(SRCFILE,"c-gosu.06.37.html") ) { return "c-gosu.06.37.html";}
else if (Guidewire_TopicMatch(TOPIC,"Changes to Existing Collections Enhancement Methods") && Guidewire_FMSourceFileMatch(SRCFILE,"c-gosu.06.38.html") ) { return "c-gosu.06.38.html";}
else if (Guidewire_TopicMatch(TOPIC,"New Collections Enhancement Methods") && Guidewire_FMSourceFileMatch(SRCFILE,"c-gosu.06.39.html") ) { return "c-gosu.06.39.html";}
else if (Guidewire_TopicMatch(TOPIC,"New ArrayList Expansion Operator (Deprecated Old Style)") && Guidewire_FMSourceFileMatch(SRCFILE,"c-gosu.06.40.html") ) { return "c-gosu.06.40.html";}
else if (Guidewire_TopicMatch(TOPIC,"Gosu Array Enhancement Changes") && Guidewire_FMSourceFileMatch(SRCFILE,"c-gosu.06.41.html") ) { return "c-gosu.06.41.html";}
else if (Guidewire_TopicMatch(TOPIC,"New Concurrency and Scoping APIs, Scoped Variables Deprecated") && Guidewire_FMSourceFileMatch(SRCFILE,"c-gosu.06.42.html") ) { return "c-gosu.06.42.html";}
else if (Guidewire_TopicMatch(TOPIC,"New \u2018Type\u2019 Property on All Types") && Guidewire_FMSourceFileMatch(SRCFILE,"c-gosu.06.43.html") ) { return "c-gosu.06.43.html";}
else if (Guidewire_TopicMatch(TOPIC,"Exception Changes If No Current User and Creating New Bundle") && Guidewire_FMSourceFileMatch(SRCFILE,"c-gosu.06.44.html") ) { return "c-gosu.06.44.html";}
else if (Guidewire_TopicMatch(TOPIC,"Block Declarations Now Require Argument Names") && Guidewire_FMSourceFileMatch(SRCFILE,"c-gosu.06.45.html") ) { return "c-gosu.06.45.html";}
else if (Guidewire_TopicMatch(TOPIC,"Function Pointers and Nested Functions Now Unsupported") && Guidewire_FMSourceFileMatch(SRCFILE,"c-gosu.06.46.html") ) { return "c-gosu.06.46.html";}
else if (Guidewire_TopicMatch(TOPIC,"Annotation Syntax Change for Run Time Access") && Guidewire_FMSourceFileMatch(SRCFILE,"c-gosu.06.47.html") ) { return "c-gosu.06.47.html";}
else if (Guidewire_TopicMatch(TOPIC,"New and Changed in System Administration in 6.0") && Guidewire_FMSourceFileMatch(SRCFILE,"c-installation.07.01.html") ) { return "c-installation.07.01.html";}
else if (Guidewire_TopicMatch(TOPIC,"New in System Administration in 6.0") && Guidewire_FMSourceFileMatch(SRCFILE,"c-installation.07.02.html") ) { return "c-installation.07.02.html";}
else if (Guidewire_TopicMatch(TOPIC,"Batch Process to Purge Completed Workflows") && Guidewire_FMSourceFileMatch(SRCFILE,"c-installation.07.03.html") ) { return "c-installation.07.03.html";}
else if (Guidewire_TopicMatch(TOPIC,"Graph Validation Checks") && Guidewire_FMSourceFileMatch(SRCFILE,"c-installation.07.04.html") ) { return "c-installation.07.04.html";}
else if (Guidewire_TopicMatch(TOPIC,"Changed in System Administration in 6.0") && Guidewire_FMSourceFileMatch(SRCFILE,"c-installation.07.05.html") ) { return "c-installation.07.05.html";}
else if (Guidewire_TopicMatch(TOPIC,"Application Server Requirements") && Guidewire_FMSourceFileMatch(SRCFILE,"c-installation.07.06.html") ) { return "c-installation.07.06.html";}
else if (Guidewire_TopicMatch(TOPIC,"Database Server Requirements") && Guidewire_FMSourceFileMatch(SRCFILE,"c-installation.07.07.html") ) { return "c-installation.07.07.html";}
else if (Guidewire_TopicMatch(TOPIC,"Operating System Requirements") && Guidewire_FMSourceFileMatch(SRCFILE,"c-installation.07.08.html") ) { return "c-installation.07.08.html";}
else if (Guidewire_TopicMatch(TOPIC,"Java and ANT Versions") && Guidewire_FMSourceFileMatch(SRCFILE,"c-installation.07.09.html") ) { return "c-installation.07.09.html";}
else if (Guidewire_TopicMatch(TOPIC,"Caching Mechanism") && Guidewire_FMSourceFileMatch(SRCFILE,"c-installation.07.10.html") ) { return "c-installation.07.10.html";}
else if (Guidewire_TopicMatch(TOPIC,"Administrative Data Export Granularity") && Guidewire_FMSourceFileMatch(SRCFILE,"c-installation.07.11.html") ) { return "c-installation.07.11.html";}
else if (Guidewire_TopicMatch(TOPIC,"New and Changed in Integration in 6.0") && Guidewire_FMSourceFileMatch(SRCFILE,"c-integration.08.01.html") ) { return "c-integration.08.01.html";}
else if (Guidewire_TopicMatch(TOPIC,"New in Integration in 6.0") && Guidewire_FMSourceFileMatch(SRCFILE,"c-integration.08.02.html") ) { return "c-integration.08.02.html";}
else if (Guidewire_TopicMatch(TOPIC,"Tools for XML Export of Types for Integration") && Guidewire_FMSourceFileMatch(SRCFILE,"c-integration.08.03.html") ) { return "c-integration.08.03.html";}
else if (Guidewire_TopicMatch(TOPIC,"Asynchronous Document Store and Transport") && Guidewire_FMSourceFileMatch(SRCFILE,"c-integration.08.04.html") ) { return "c-integration.08.04.html";}
else if (Guidewire_TopicMatch(TOPIC,"Startable Plugins") && Guidewire_FMSourceFileMatch(SRCFILE,"c-integration.08.05.html") ) { return "c-integration.08.05.html";}
else if (Guidewire_TopicMatch(TOPIC,"Create Custom Batch Processes") && Guidewire_FMSourceFileMatch(SRCFILE,"c-integration.08.06.html") ) { return "c-integration.08.06.html";}
else if (Guidewire_TopicMatch(TOPIC,"Profiler Web Services") && Guidewire_FMSourceFileMatch(SRCFILE,"c-integration.08.07.html") ) { return "c-integration.08.07.html";}
else if (Guidewire_TopicMatch(TOPIC,"Simple Servlets") && Guidewire_FMSourceFileMatch(SRCFILE,"c-integration.08.08.html") ) { return "c-integration.08.08.html";}
else if (Guidewire_TopicMatch(TOPIC,"Field-level Encryption") && Guidewire_FMSourceFileMatch(SRCFILE,"c-integration.08.09.html") ) { return "c-integration.08.09.html";}
else if (Guidewire_TopicMatch(TOPIC,"Claim Search (PolicyCenter Integration)") && Guidewire_FMSourceFileMatch(SRCFILE,"c-integration.08.10.html") ) { return "c-integration.08.10.html";}
else if (Guidewire_TopicMatch(TOPIC,"Authentication User Role Syncing") && Guidewire_FMSourceFileMatch(SRCFILE,"c-integration.08.11.html") ) { return "c-integration.08.11.html";}
else if (Guidewire_TopicMatch(TOPIC,"Large Loss Notification and Policy System Notification Architecture") && Guidewire_FMSourceFileMatch(SRCFILE,"c-integration.08.12.html") ) { return "c-integration.08.12.html";}
else if (Guidewire_TopicMatch(TOPIC,"New Preupdate Handler Plugin") && Guidewire_FMSourceFileMatch(SRCFILE,"c-integration.08.13.html") ) { return "c-integration.08.13.html";}
else if (Guidewire_TopicMatch(TOPIC,"Backup Withholding Plugin") && Guidewire_FMSourceFileMatch(SRCFILE,"c-integration.08.14.html") ) { return "c-integration.08.14.html";}
else if (Guidewire_TopicMatch(TOPIC,"Changes in Integration in 6.0") && Guidewire_FMSourceFileMatch(SRCFILE,"c-integration.08.15.html") ) { return "c-integration.08.15.html";}
else if (Guidewire_TopicMatch(TOPIC,"Changes to Structure of Integration-related Files and Scripts") && Guidewire_FMSourceFileMatch(SRCFILE,"c-integration.08.16.html") ) { return "c-integration.08.16.html";}
else if (Guidewire_TopicMatch(TOPIC,"Copy the Plugin Entity Library to Your Configuration Module") && Guidewire_FMSourceFileMatch(SRCFILE,"c-integration.08.17.html") ) { return "c-integration.08.17.html";}
else if (Guidewire_TopicMatch(TOPIC,"ISO Changes in ClaimCenter 6.0") && Guidewire_FMSourceFileMatch(SRCFILE,"c-integration.08.18.html") ) { return "c-integration.08.18.html";}
else if (Guidewire_TopicMatch(TOPIC,"FNOL Mapper is Now a Server-Side Tool") && Guidewire_FMSourceFileMatch(SRCFILE,"c-integration.08.19.html") ) { return "c-integration.08.19.html";}
else if (Guidewire_TopicMatch(TOPIC,"Financials Integration APIs for Acknowledgement-based Transitions") && Guidewire_FMSourceFileMatch(SRCFILE,"c-integration.08.20.html") ) { return "c-integration.08.20.html";}
else if (Guidewire_TopicMatch(TOPIC,"Validation Plugin Removed") && Guidewire_FMSourceFileMatch(SRCFILE,"c-integration.08.21.html") ) { return "c-integration.08.21.html";}
else if (Guidewire_TopicMatch(TOPIC,"Multicurrency-related Changes") && Guidewire_FMSourceFileMatch(SRCFILE,"c-integration.08.22.html") ) { return "c-integration.08.22.html";}
else if (Guidewire_TopicMatch(TOPIC,"Claim Financials Web Service API Changes") && Guidewire_FMSourceFileMatch(SRCFILE,"c-integration.08.23.html") ) { return "c-integration.08.23.html";}
else if (Guidewire_TopicMatch(TOPIC,"Messaging API Changes") && Guidewire_FMSourceFileMatch(SRCFILE,"c-integration.08.24.html") ) { return "c-integration.08.24.html";}
else if (Guidewire_TopicMatch(TOPIC,"Document Management Plugin Implementation Location Changes") && Guidewire_FMSourceFileMatch(SRCFILE,"c-integration.08.25.html") ) { return "c-integration.08.25.html";}
else if (Guidewire_TopicMatch(TOPIC,"Parameterization of Types Stripped from Java External Entities") && Guidewire_FMSourceFileMatch(SRCFILE,"c-integration.08.26.html") ) { return "c-integration.08.26.html";}
else if (Guidewire_TopicMatch(TOPIC,"New Plugin Registry (Old Version Deprecated in Gosu)") && Guidewire_FMSourceFileMatch(SRCFILE,"c-integration.08.27.html") ) { return "c-integration.08.27.html";}
else if (Guidewire_TopicMatch(TOPIC,"IMessagingToolsAPI Web Service Interface Changes") && Guidewire_FMSourceFileMatch(SRCFILE,"c-integration.08.28.html") ) { return "c-integration.08.28.html";}
else if (Guidewire_TopicMatch(TOPIC,"IDataExtractionAPI Web Service Interface Deprecated") && Guidewire_FMSourceFileMatch(SRCFILE,"c-integration.08.29.html") ) { return "c-integration.08.29.html";}
else if (Guidewire_TopicMatch(TOPIC,"IClaimAPI Web Service Interface Changes") && Guidewire_FMSourceFileMatch(SRCFILE,"c-integration.08.30.html") ) { return "c-integration.08.30.html";}
else if (Guidewire_TopicMatch(TOPIC,"IClaimFinancialsAPI Web Service Interface Changes") && Guidewire_FMSourceFileMatch(SRCFILE,"c-integration.08.31.html") ) { return "c-integration.08.31.html";}
else if (Guidewire_TopicMatch(TOPIC,"Document Management Plugin Changes for Availability") && Guidewire_FMSourceFileMatch(SRCFILE,"c-integration.08.32.html") ) { return "c-integration.08.32.html";}
else if (Guidewire_TopicMatch(TOPIC,"Geocoding Plugin Changes for Map Options") && Guidewire_FMSourceFileMatch(SRCFILE,"c-integration.08.33.html") ) { return "c-integration.08.33.html";}
else if (Guidewire_TopicMatch(TOPIC,"Summary of Plugin Changes, Additions, and Removals") && Guidewire_FMSourceFileMatch(SRCFILE,"c-integration.08.34.html") ) { return "c-integration.08.34.html";}
else if (Guidewire_TopicMatch(TOPIC,"Web Service Changes, Additions, and Removals") && Guidewire_FMSourceFileMatch(SRCFILE,"c-integration.08.35.html") ) { return "c-integration.08.35.html";}
else if (Guidewire_TopicMatch(TOPIC,"Authentication Integration Changes") && Guidewire_FMSourceFileMatch(SRCFILE,"c-integration.08.36.html") ) { return "c-integration.08.36.html";}
else if (Guidewire_TopicMatch(TOPIC,"Enforcement of Web Service Type Name Conflicts") && Guidewire_FMSourceFileMatch(SRCFILE,"c-integration.08.37.html") ) { return "c-integration.08.37.html";}
else if (Guidewire_TopicMatch(TOPIC,"Metropolitan Timeout Changes") && Guidewire_FMSourceFileMatch(SRCFILE,"c-integration.08.38.html") ) { return "c-integration.08.38.html";}
else if (Guidewire_TopicMatch(TOPIC,"Segmentation Plugin Deprecated") && Guidewire_FMSourceFileMatch(SRCFILE,"c-integration.08.39.html") ) { return "c-integration.08.39.html";}
else if (Guidewire_TopicMatch(TOPIC,"New and Changed in Rules in 6.0") && Guidewire_FMSourceFileMatch(SRCFILE,"c-rules.09.1.html") ) { return "c-rules.09.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"New in Rules in ClaimCenter 6.0") && Guidewire_FMSourceFileMatch(SRCFILE,"c-rules.09.2.html") ) { return "c-rules.09.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Changes in Rules in ClaimCenter 6.0") && Guidewire_FMSourceFileMatch(SRCFILE,"c-rules.09.3.html") ) { return "c-rules.09.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"New and Changed in Reporting in 6.0") && Guidewire_FMSourceFileMatch(SRCFILE,"c-reporting.10.1.html") ) { return "c-reporting.10.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"New in Reporting in ClaimCenter 6.0") && Guidewire_FMSourceFileMatch(SRCFILE,"c-reporting.10.2.html") ) { return "c-reporting.10.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Changes in Reporting in ClaimCenter 6.0") && Guidewire_FMSourceFileMatch(SRCFILE,"c-reporting.10.3.html") ) { return "c-reporting.10.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"What\u2019s New and Changed in 5.0") && Guidewire_FMSourceFileMatch(SRCFILE,"part-b_2.html") ) { return "part-b_2.html";}
else if (Guidewire_TopicMatch(TOPIC,"New and Changed in ClaimCenter 5.0") && Guidewire_FMSourceFileMatch(SRCFILE,"b-app.12.01.html") ) { return "b-app.12.01.html";}
else if (Guidewire_TopicMatch(TOPIC,"New in ClaimCenter 5.0") && Guidewire_FMSourceFileMatch(SRCFILE,"b-app.12.02.html") ) { return "b-app.12.02.html";}
else if (Guidewire_TopicMatch(TOPIC,"Address Completion") && Guidewire_FMSourceFileMatch(SRCFILE,"b-app.12.03.html") ) { return "b-app.12.03.html";}
else if (Guidewire_TopicMatch(TOPIC,"Assessments") && Guidewire_FMSourceFileMatch(SRCFILE,"b-app.12.04.html") ) { return "b-app.12.04.html";}
else if (Guidewire_TopicMatch(TOPIC,"Catastrophes") && Guidewire_FMSourceFileMatch(SRCFILE,"b-app.12.05.html") ) { return "b-app.12.05.html";}
else if (Guidewire_TopicMatch(TOPIC,"Claim Archiving") && Guidewire_FMSourceFileMatch(SRCFILE,"b-app.12.06.html") ) { return "b-app.12.06.html";}
else if (Guidewire_TopicMatch(TOPIC,"Claim Associations") && Guidewire_FMSourceFileMatch(SRCFILE,"b-app.12.07.html") ) { return "b-app.12.07.html";}
else if (Guidewire_TopicMatch(TOPIC,"Injury Incidents") && Guidewire_FMSourceFileMatch(SRCFILE,"b-app.12.08.html") ) { return "b-app.12.08.html";}
else if (Guidewire_TopicMatch(TOPIC,"Lines of Business") && Guidewire_FMSourceFileMatch(SRCFILE,"b-app.12.09.html") ) { return "b-app.12.09.html";}
else if (Guidewire_TopicMatch(TOPIC,"Multiple Currencies") && Guidewire_FMSourceFileMatch(SRCFILE,"b-app.12.10.html") ) { return "b-app.12.10.html";}
else if (Guidewire_TopicMatch(TOPIC,"Question Sets") && Guidewire_FMSourceFileMatch(SRCFILE,"b-app.12.11.html") ) { return "b-app.12.11.html";}
else if (Guidewire_TopicMatch(TOPIC,"QuickJump Box") && Guidewire_FMSourceFileMatch(SRCFILE,"b-app.12.12.html") ) { return "b-app.12.12.html";}
else if (Guidewire_TopicMatch(TOPIC,"Regional Holidays") && Guidewire_FMSourceFileMatch(SRCFILE,"b-app.12.13.html") ) { return "b-app.12.13.html";}
else if (Guidewire_TopicMatch(TOPIC,"Security on Notes") && Guidewire_FMSourceFileMatch(SRCFILE,"b-app.12.14.html") ) { return "b-app.12.14.html";}
else if (Guidewire_TopicMatch(TOPIC,"Service Provider Management") && Guidewire_FMSourceFileMatch(SRCFILE,"b-app.12.15.html") ) { return "b-app.12.15.html";}
else if (Guidewire_TopicMatch(TOPIC,"Subrogation") && Guidewire_FMSourceFileMatch(SRCFILE,"b-app.12.16.html") ) { return "b-app.12.16.html";}
else if (Guidewire_TopicMatch(TOPIC,"User Interface") && Guidewire_FMSourceFileMatch(SRCFILE,"b-app.12.17.html") ) { return "b-app.12.17.html";}
else if (Guidewire_TopicMatch(TOPIC,"Workflows") && Guidewire_FMSourceFileMatch(SRCFILE,"b-app.12.18.html") ) { return "b-app.12.18.html";}
else if (Guidewire_TopicMatch(TOPIC,"Zone Mapping and Autofill") && Guidewire_FMSourceFileMatch(SRCFILE,"b-app.12.19.html") ) { return "b-app.12.19.html";}
else if (Guidewire_TopicMatch(TOPIC,"Changes in ClaimCenter 5.0") && Guidewire_FMSourceFileMatch(SRCFILE,"b-app.12.20.html") ) { return "b-app.12.20.html";}
else if (Guidewire_TopicMatch(TOPIC,"Significant Assignment Changes") && Guidewire_FMSourceFileMatch(SRCFILE,"b-app.12.21.html") ) { return "b-app.12.21.html";}
else if (Guidewire_TopicMatch(TOPIC,"Calendar Enhancements") && Guidewire_FMSourceFileMatch(SRCFILE,"b-app.12.22.html") ) { return "b-app.12.22.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuration Parameters") && Guidewire_FMSourceFileMatch(SRCFILE,"b-app.12.23.html") ) { return "b-app.12.23.html";}
else if (Guidewire_TopicMatch(TOPIC,"Coverage Model Changes") && Guidewire_FMSourceFileMatch(SRCFILE,"b-app.12.24.html") ) { return "b-app.12.24.html";}
else if (Guidewire_TopicMatch(TOPIC,"Coverage Verification") && Guidewire_FMSourceFileMatch(SRCFILE,"b-app.12.25.html") ) { return "b-app.12.25.html";}
else if (Guidewire_TopicMatch(TOPIC,"Data and Security Dictionaries") && Guidewire_FMSourceFileMatch(SRCFILE,"b-app.12.26.html") ) { return "b-app.12.26.html";}
else if (Guidewire_TopicMatch(TOPIC,"Database Consistency Checks") && Guidewire_FMSourceFileMatch(SRCFILE,"b-app.12.27.html") ) { return "b-app.12.27.html";}
else if (Guidewire_TopicMatch(TOPIC,"Eclipse No Longer Supported") && Guidewire_FMSourceFileMatch(SRCFILE,"b-app.12.28.html") ) { return "b-app.12.28.html";}
else if (Guidewire_TopicMatch(TOPIC,"Email Enhancements") && Guidewire_FMSourceFileMatch(SRCFILE,"b-app.12.29.html") ) { return "b-app.12.29.html";}
else if (Guidewire_TopicMatch(TOPIC,"Export") && Guidewire_FMSourceFileMatch(SRCFILE,"b-app.12.30.html") ) { return "b-app.12.30.html";}
else if (Guidewire_TopicMatch(TOPIC,"Financial Changes") && Guidewire_FMSourceFileMatch(SRCFILE,"b-app.12.31.html") ) { return "b-app.12.31.html";}
else if (Guidewire_TopicMatch(TOPIC,"Geocoding") && Guidewire_FMSourceFileMatch(SRCFILE,"b-app.12.32.html") ) { return "b-app.12.32.html";}
else if (Guidewire_TopicMatch(TOPIC,"Localization") && Guidewire_FMSourceFileMatch(SRCFILE,"b-app.12.33.html") ) { return "b-app.12.33.html";}
else if (Guidewire_TopicMatch(TOPIC,"Matter and Negotiation Enhancements") && Guidewire_FMSourceFileMatch(SRCFILE,"b-app.12.34.html") ) { return "b-app.12.34.html";}
else if (Guidewire_TopicMatch(TOPIC,"Module-Based Configuration") && Guidewire_FMSourceFileMatch(SRCFILE,"b-app.12.35.html") ) { return "b-app.12.35.html";}
else if (Guidewire_TopicMatch(TOPIC,"New Claim Wizard") && Guidewire_FMSourceFileMatch(SRCFILE,"b-app.12.36.html") ) { return "b-app.12.36.html";}
else if (Guidewire_TopicMatch(TOPIC,"New Work Queue Parameters") && Guidewire_FMSourceFileMatch(SRCFILE,"b-app.12.37.html") ) { return "b-app.12.37.html";}
else if (Guidewire_TopicMatch(TOPIC,"Parties Involved Enhancements") && Guidewire_FMSourceFileMatch(SRCFILE,"b-app.12.38.html") ) { return "b-app.12.38.html";}
else if (Guidewire_TopicMatch(TOPIC,"PCF Definition") && Guidewire_FMSourceFileMatch(SRCFILE,"b-app.12.39.html") ) { return "b-app.12.39.html";}
else if (Guidewire_TopicMatch(TOPIC,"PCF Input Widgets") && Guidewire_FMSourceFileMatch(SRCFILE,"b-app.12.40.html") ) { return "b-app.12.40.html";}
else if (Guidewire_TopicMatch(TOPIC,"Policy Model Changes") && Guidewire_FMSourceFileMatch(SRCFILE,"b-app.12.41.html") ) { return "b-app.12.41.html";}
else if (Guidewire_TopicMatch(TOPIC,"SIU Questionnaire") && Guidewire_FMSourceFileMatch(SRCFILE,"b-app.12.42.html") ) { return "b-app.12.42.html";}
else if (Guidewire_TopicMatch(TOPIC,"Workflow Flexibility") && Guidewire_FMSourceFileMatch(SRCFILE,"b-app.12.43.html") ) { return "b-app.12.43.html";}
else if (Guidewire_TopicMatch(TOPIC,"New and Changed in GScript in 5.0") && Guidewire_FMSourceFileMatch(SRCFILE,"b-gscript.13.01.html") ) { return "b-gscript.13.01.html";}
else if (Guidewire_TopicMatch(TOPIC,"New in GScript in 5.0") && Guidewire_FMSourceFileMatch(SRCFILE,"b-gscript.13.02.html") ) { return "b-gscript.13.02.html";}
else if (Guidewire_TopicMatch(TOPIC,"Changed in GScript in 5.0") && Guidewire_FMSourceFileMatch(SRCFILE,"b-gscript.13.03.html") ) { return "b-gscript.13.03.html";}
else if (Guidewire_TopicMatch(TOPIC,"GScript Constructor Syntax Changed") && Guidewire_FMSourceFileMatch(SRCFILE,"b-gscript.13.04.html") ) { return "b-gscript.13.04.html";}
else if (Guidewire_TopicMatch(TOPIC,"Stricter Return Statements Requirements for All Code Paths") && Guidewire_FMSourceFileMatch(SRCFILE,"b-gscript.13.05.html") ) { return "b-gscript.13.05.html";}
else if (Guidewire_TopicMatch(TOPIC,"Java Type Information Changes") && Guidewire_FMSourceFileMatch(SRCFILE,"b-gscript.13.06.html") ) { return "b-gscript.13.06.html";}
else if (Guidewire_TopicMatch(TOPIC,"EntityFactory Deprecated in GScript (Not in Java)") && Guidewire_FMSourceFileMatch(SRCFILE,"b-gscript.13.07.html") ) { return "b-gscript.13.07.html";}
else if (Guidewire_TopicMatch(TOPIC,"GScript Libraries Changes") && Guidewire_FMSourceFileMatch(SRCFILE,"b-gscript.13.08.html") ) { return "b-gscript.13.08.html";}
else if (Guidewire_TopicMatch(TOPIC,"GScript Case Sensitivity Implications") && Guidewire_FMSourceFileMatch(SRCFILE,"b-gscript.13.09.html") ) { return "b-gscript.13.09.html";}
else if (Guidewire_TopicMatch(TOPIC,"Java Properties Capitalization Changes") && Guidewire_FMSourceFileMatch(SRCFILE,"b-gscript.13.10.html") ) { return "b-gscript.13.10.html";}
else if (Guidewire_TopicMatch(TOPIC,"Deprecation of itype Property") && Guidewire_FMSourceFileMatch(SRCFILE,"b-gscript.13.11.html") ) { return "b-gscript.13.11.html";}
else if (Guidewire_TopicMatch(TOPIC,"Minor Change In Meaning of \u2018List\u2019") && Guidewire_FMSourceFileMatch(SRCFILE,"b-gscript.13.12.html") ) { return "b-gscript.13.12.html";}
else if (Guidewire_TopicMatch(TOPIC,"Typekey.Name Becomes DisplayName and UnlocalizedName") && Guidewire_FMSourceFileMatch(SRCFILE,"b-gscript.13.13.html") ) { return "b-gscript.13.13.html";}
else if (Guidewire_TopicMatch(TOPIC,"Type.TypeKeys Property Becomes Method with Argument") && Guidewire_FMSourceFileMatch(SRCFILE,"b-gscript.13.14.html") ) { return "b-gscript.13.14.html";}
else if (Guidewire_TopicMatch(TOPIC,"TypeList.getByCode() Changes") && Guidewire_FMSourceFileMatch(SRCFILE,"b-gscript.13.15.html") ) { return "b-gscript.13.15.html";}
else if (Guidewire_TopicMatch(TOPIC,"Type Information Exposed for All Types") && Guidewire_FMSourceFileMatch(SRCFILE,"b-gscript.13.16.html") ) { return "b-gscript.13.16.html";}
else if (Guidewire_TopicMatch(TOPIC,"Removal of toMap Method on Collection") && Guidewire_FMSourceFileMatch(SRCFILE,"b-gscript.13.17.html") ) { return "b-gscript.13.17.html";}
else if (Guidewire_TopicMatch(TOPIC,"Change in Equality Comparison, and New Warnings for Edge Cases") && Guidewire_FMSourceFileMatch(SRCFILE,"b-gscript.13.18.html") ) { return "b-gscript.13.18.html";}
else if (Guidewire_TopicMatch(TOPIC,"New and Changed in Installation in 5.0") && Guidewire_FMSourceFileMatch(SRCFILE,"b-installation.14.1.html") ) { return "b-installation.14.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"New in Installation in 5.0") && Guidewire_FMSourceFileMatch(SRCFILE,"b-installation.14.2.html") ) { return "b-installation.14.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"QuickStart Installation") && Guidewire_FMSourceFileMatch(SRCFILE,"b-installation.14.3.html") ) { return "b-installation.14.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Support for WebLogic JNDI Data Source") && Guidewire_FMSourceFileMatch(SRCFILE,"b-installation.14.4.html") ) { return "b-installation.14.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Changed in Installation in 5.0") && Guidewire_FMSourceFileMatch(SRCFILE,"b-installation.14.5.html") ) { return "b-installation.14.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"New and Changed in Integration in 5.0") && Guidewire_FMSourceFileMatch(SRCFILE,"b-integration.15.01.html") ) { return "b-integration.15.01.html";}
else if (Guidewire_TopicMatch(TOPIC,"New in Integration in 5.0") && Guidewire_FMSourceFileMatch(SRCFILE,"b-integration.15.02.html") ) { return "b-integration.15.02.html";}
else if (Guidewire_TopicMatch(TOPIC,"Major New SOAP Features in GScript") && Guidewire_FMSourceFileMatch(SRCFILE,"b-integration.15.03.html") ) { return "b-integration.15.03.html";}
else if (Guidewire_TopicMatch(TOPIC,"New Email APIs, Including Document Management") && Guidewire_FMSourceFileMatch(SRCFILE,"b-integration.15.04.html") ) { return "b-integration.15.04.html";}
else if (Guidewire_TopicMatch(TOPIC,"EntityFactory in Java Method Name Change") && Guidewire_FMSourceFileMatch(SRCFILE,"b-integration.15.05.html") ) { return "b-integration.15.05.html";}
else if (Guidewire_TopicMatch(TOPIC,"Multicurrency Integration Support") && Guidewire_FMSourceFileMatch(SRCFILE,"b-integration.15.06.html") ) { return "b-integration.15.06.html";}
else if (Guidewire_TopicMatch(TOPIC,"SOAP API Non-Conversational Mode Now Supported") && Guidewire_FMSourceFileMatch(SRCFILE,"b-integration.15.07.html") ) { return "b-integration.15.07.html";}
else if (Guidewire_TopicMatch(TOPIC,"Rendering Arbitrary Input Stream Data, Such as PDF Data") && Guidewire_FMSourceFileMatch(SRCFILE,"b-integration.15.08.html") ) { return "b-integration.15.08.html";}
else if (Guidewire_TopicMatch(TOPIC,"Database Staging Table Import Conversion View") && Guidewire_FMSourceFileMatch(SRCFILE,"b-integration.15.09.html") ) { return "b-integration.15.09.html";}
else if (Guidewire_TopicMatch(TOPIC,"Messaging Threads Configurable") && Guidewire_FMSourceFileMatch(SRCFILE,"b-integration.15.10.html") ) { return "b-integration.15.10.html";}
else if (Guidewire_TopicMatch(TOPIC,"Changes in Integration in 5.0") && Guidewire_FMSourceFileMatch(SRCFILE,"b-integration.15.11.html") ) { return "b-integration.15.11.html";}
else if (Guidewire_TopicMatch(TOPIC,"IDataObjectAPI is Deprecated") && Guidewire_FMSourceFileMatch(SRCFILE,"b-integration.15.12.html") ) { return "b-integration.15.12.html";}
else if (Guidewire_TopicMatch(TOPIC,"Plugins Directories Moved In Relation to Config Directory") && Guidewire_FMSourceFileMatch(SRCFILE,"b-integration.15.13.html") ) { return "b-integration.15.13.html";}
else if (Guidewire_TopicMatch(TOPIC,"Web Service Visibility and Customizability Changes") && Guidewire_FMSourceFileMatch(SRCFILE,"b-integration.15.14.html") ) { return "b-integration.15.14.html";}
else if (Guidewire_TopicMatch(TOPIC,"Regenerating the Toolkit Changes") && Guidewire_FMSourceFileMatch(SRCFILE,"b-integration.15.15.html") ) { return "b-integration.15.15.html";}
else if (Guidewire_TopicMatch(TOPIC,"Plugin Registration Changes") && Guidewire_FMSourceFileMatch(SRCFILE,"b-integration.15.16.html") ) { return "b-integration.15.16.html";}
else if (Guidewire_TopicMatch(TOPIC,"Plugin Built-in Implementation Classes Package Changes") && Guidewire_FMSourceFileMatch(SRCFILE,"b-integration.15.17.html") ) { return "b-integration.15.17.html";}
else if (Guidewire_TopicMatch(TOPIC,"Messaging Destination Registration Moved") && Guidewire_FMSourceFileMatch(SRCFILE,"b-integration.15.18.html") ) { return "b-integration.15.18.html";}
else if (Guidewire_TopicMatch(TOPIC,"GWServices Plugins Removed") && Guidewire_FMSourceFileMatch(SRCFILE,"b-integration.15.19.html") ) { return "b-integration.15.19.html";}
else if (Guidewire_TopicMatch(TOPIC,"GScript Plugin Important and Required Changes") && Guidewire_FMSourceFileMatch(SRCFILE,"b-integration.15.20.html") ) { return "b-integration.15.20.html";}
else if (Guidewire_TopicMatch(TOPIC,"SOAP Plugins No Longer Needed") && Guidewire_FMSourceFileMatch(SRCFILE,"b-integration.15.21.html") ) { return "b-integration.15.21.html";}
else if (Guidewire_TopicMatch(TOPIC,"IAssignmentAdapter Deprecated") && Guidewire_FMSourceFileMatch(SRCFILE,"b-integration.15.22.html") ) { return "b-integration.15.22.html";}
else if (Guidewire_TopicMatch(TOPIC,"IExportTools Removed") && Guidewire_FMSourceFileMatch(SRCFILE,"b-integration.15.23.html") ) { return "b-integration.15.23.html";}
else if (Guidewire_TopicMatch(TOPIC,"Geocoding Plugin Changes") && Guidewire_FMSourceFileMatch(SRCFILE,"b-integration.15.24.html") ) { return "b-integration.15.24.html";}
else if (Guidewire_TopicMatch(TOPIC,"ISO Configuration Changes") && Guidewire_FMSourceFileMatch(SRCFILE,"b-integration.15.25.html") ) { return "b-integration.15.25.html";}
else if (Guidewire_TopicMatch(TOPIC,"Document Management Changes") && Guidewire_FMSourceFileMatch(SRCFILE,"b-integration.15.26.html") ) { return "b-integration.15.26.html";}
else if (Guidewire_TopicMatch(TOPIC,"Message State and Message History Changes") && Guidewire_FMSourceFileMatch(SRCFILE,"b-integration.15.27.html") ) { return "b-integration.15.27.html";}
else if (Guidewire_TopicMatch(TOPIC,"Messaging Transaction Changes and MessageRequest Plugin") && Guidewire_FMSourceFileMatch(SRCFILE,"b-integration.15.28.html") ) { return "b-integration.15.28.html";}
else if (Guidewire_TopicMatch(TOPIC,"Ensure Messaging Code Does Not Rely on Assignment Entity") && Guidewire_FMSourceFileMatch(SRCFILE,"b-integration.15.29.html") ) { return "b-integration.15.29.html";}
else if (Guidewire_TopicMatch(TOPIC,"Message Sinks Now Unsupported") && Guidewire_FMSourceFileMatch(SRCFILE,"b-integration.15.30.html") ) { return "b-integration.15.30.html";}
else if (Guidewire_TopicMatch(TOPIC,"Transaction Public ID Length Must Be Shorter") && Guidewire_FMSourceFileMatch(SRCFILE,"b-integration.15.31.html") ) { return "b-integration.15.31.html";}
else if (Guidewire_TopicMatch(TOPIC,"Multi-Registration of Plugins for Wrapping Unsupported") && Guidewire_FMSourceFileMatch(SRCFILE,"b-integration.15.32.html") ) { return "b-integration.15.32.html";}
else if (Guidewire_TopicMatch(TOPIC,"Contact Autosync") && Guidewire_FMSourceFileMatch(SRCFILE,"b-integration.15.33.html") ) { return "b-integration.15.33.html";}
else if (Guidewire_TopicMatch(TOPIC,"Changes to Parameter Order in Outgoing SOAP API Requests") && Guidewire_FMSourceFileMatch(SRCFILE,"b-integration.15.34.html") ) { return "b-integration.15.34.html";}
else if (Guidewire_TopicMatch(TOPIC,"MapPoint Updates for New WSDL Parameter Ordering") && Guidewire_FMSourceFileMatch(SRCFILE,"b-integration.15.35.html") ) { return "b-integration.15.35.html";}
else if (Guidewire_TopicMatch(TOPIC,"Changes to Message Ordering and Multi-Threading") && Guidewire_FMSourceFileMatch(SRCFILE,"b-integration.15.36.html") ) { return "b-integration.15.36.html";}
else if (Guidewire_TopicMatch(TOPIC,"New and Changed in Rules in 5.0") && Guidewire_FMSourceFileMatch(SRCFILE,"b-rules.16.1.html") ) { return "b-rules.16.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"New in Rules in 5.0") && Guidewire_FMSourceFileMatch(SRCFILE,"b-rules.16.2.html") ) { return "b-rules.16.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Archive Rules") && Guidewire_FMSourceFileMatch(SRCFILE,"b-rules.16.3.html") ) { return "b-rules.16.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"\u00a0Changes in Rules in 5.0") && Guidewire_FMSourceFileMatch(SRCFILE,"b-rules.16.4.html") ) { return "b-rules.16.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Assignment Rules") && Guidewire_FMSourceFileMatch(SRCFILE,"b-rules.16.5.html") ) { return "b-rules.16.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Exposure Get Recoveries API Returns Read-only Entities") && Guidewire_FMSourceFileMatch(SRCFILE,"b-rules.16.6.html") ) { return "b-rules.16.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"New and Changed in Studio in 5.0") && Guidewire_FMSourceFileMatch(SRCFILE,"b-studio.17.01.html") ) { return "b-studio.17.01.html";}
else if (Guidewire_TopicMatch(TOPIC,"New in Studio in 5.0") && Guidewire_FMSourceFileMatch(SRCFILE,"b-studio.17.02.html") ) { return "b-studio.17.02.html";}
else if (Guidewire_TopicMatch(TOPIC,"Standalone (Disconnected) Operation") && Guidewire_FMSourceFileMatch(SRCFILE,"b-studio.17.03.html") ) { return "b-studio.17.03.html";}
else if (Guidewire_TopicMatch(TOPIC,"Studio Resource Management") && Guidewire_FMSourceFileMatch(SRCFILE,"b-studio.17.04.html") ) { return "b-studio.17.04.html";}
else if (Guidewire_TopicMatch(TOPIC,"Studio Interface Changes") && Guidewire_FMSourceFileMatch(SRCFILE,"b-studio.17.05.html") ) { return "b-studio.17.05.html";}
else if (Guidewire_TopicMatch(TOPIC,"New Configuration Options") && Guidewire_FMSourceFileMatch(SRCFILE,"b-studio.17.06.html") ) { return "b-studio.17.06.html";}
else if (Guidewire_TopicMatch(TOPIC,"Graphical Studio Editors") && Guidewire_FMSourceFileMatch(SRCFILE,"b-studio.17.07.html") ) { return "b-studio.17.07.html";}
else if (Guidewire_TopicMatch(TOPIC,"GUnit Tester") && Guidewire_FMSourceFileMatch(SRCFILE,"b-studio.17.08.html") ) { return "b-studio.17.08.html";}
else if (Guidewire_TopicMatch(TOPIC,"New GScript API Documentation Support") && Guidewire_FMSourceFileMatch(SRCFILE,"b-studio.17.09.html") ) { return "b-studio.17.09.html";}
else if (Guidewire_TopicMatch(TOPIC,"Keyboard Shortcuts") && Guidewire_FMSourceFileMatch(SRCFILE,"b-studio.17.10.html") ) { return "b-studio.17.10.html";}
else if (Guidewire_TopicMatch(TOPIC,"New Contextual Right-Click Menu Commands") && Guidewire_FMSourceFileMatch(SRCFILE,"b-studio.17.11.html") ) { return "b-studio.17.11.html";}
else if (Guidewire_TopicMatch(TOPIC,"Delete (or Revert to Base) Files") && Guidewire_FMSourceFileMatch(SRCFILE,"b-studio.17.12.html") ) { return "b-studio.17.12.html";}
else if (Guidewire_TopicMatch(TOPIC,"View the SCM Log") && Guidewire_FMSourceFileMatch(SRCFILE,"b-studio.17.13.html") ) { return "b-studio.17.13.html";}
else if (Guidewire_TopicMatch(TOPIC,"View and Edit (More) Files in Studio") && Guidewire_FMSourceFileMatch(SRCFILE,"b-studio.17.14.html") ) { return "b-studio.17.14.html";}
else if (Guidewire_TopicMatch(TOPIC,"New Text Editor") && Guidewire_FMSourceFileMatch(SRCFILE,"b-studio.17.15.html") ) { return "b-studio.17.15.html";}
else if (Guidewire_TopicMatch(TOPIC,"New Help Menu PCF Format Reference") && Guidewire_FMSourceFileMatch(SRCFILE,"b-studio.17.16.html") ) { return "b-studio.17.16.html";}
else if (Guidewire_TopicMatch(TOPIC,"Changes in Studio in 5.0") && Guidewire_FMSourceFileMatch(SRCFILE,"b-studio.17.17.html") ) { return "b-studio.17.17.html";}
else if (Guidewire_TopicMatch(TOPIC,"New Development Mode") && Guidewire_FMSourceFileMatch(SRCFILE,"b-studio.17.18.html") ) { return "b-studio.17.18.html";}
else if (Guidewire_TopicMatch(TOPIC,"Resource View Is Virtual") && Guidewire_FMSourceFileMatch(SRCFILE,"b-studio.17.19.html") ) { return "b-studio.17.19.html";}
else if (Guidewire_TopicMatch(TOPIC,"Manage Most Resources from Studio") && Guidewire_FMSourceFileMatch(SRCFILE,"b-studio.17.20.html") ) { return "b-studio.17.20.html";}
else if (Guidewire_TopicMatch(TOPIC,"Library Functions Become Classes and Enhancements") && Guidewire_FMSourceFileMatch(SRCFILE,"b-studio.17.21.html") ) { return "b-studio.17.21.html";}
else if (Guidewire_TopicMatch(TOPIC,"Studio Options Moved to Tools Menu") && Guidewire_FMSourceFileMatch(SRCFILE,"b-studio.17.22.html") ) { return "b-studio.17.22.html";}
else if (Guidewire_TopicMatch(TOPIC,"Studio Handles Script Parameters Differently") && Guidewire_FMSourceFileMatch(SRCFILE,"b-studio.17.23.html") ) { return "b-studio.17.23.html";}
else if (Guidewire_TopicMatch(TOPIC,"Studio Links to SCM System") && Guidewire_FMSourceFileMatch(SRCFILE,"b-studio.17.24.html") ) { return "b-studio.17.24.html";}
else if (Guidewire_TopicMatch(TOPIC,"Release Notes Archive") && Guidewire_FMSourceFileMatch(SRCFILE,"part-relnotes.html") ) { return "part-relnotes.html";}
else if (Guidewire_TopicMatch(TOPIC,"Guidewire ClaimCenter\u00a04.0.0 Release Notes") && Guidewire_FMSourceFileMatch(SRCFILE,"relnotes-cc400.html") ) { return "relnotes-cc400.html";}
else if (Guidewire_TopicMatch(TOPIC,"Guidewire ClaimCenter\u00a04.0.1 Release\u00a0Notes") && Guidewire_FMSourceFileMatch(SRCFILE,"relnotes-cc401.html") ) { return "relnotes-cc401.html";}
else if (Guidewire_TopicMatch(TOPIC,"Guidewire ClaimCenter\u00a04.0.2 Release\u00a0Notes") && Guidewire_FMSourceFileMatch(SRCFILE,"relnotes-cc402.html") ) { return "relnotes-cc402.html";}
else if (Guidewire_TopicMatch(TOPIC,"Guidewire ClaimCenter 4.0.3 Release\u00a0Notes") && Guidewire_FMSourceFileMatch(SRCFILE,"relnotes-cc403.html") ) { return "relnotes-cc403.html";}
else if (Guidewire_TopicMatch(TOPIC,"Guidewire ClaimCenter 4.0.4 Release\u00a0Notes") && Guidewire_FMSourceFileMatch(SRCFILE,"relnotes-cc404.html") ) { return "relnotes-cc404.html";}
else if (Guidewire_TopicMatch(TOPIC,"Guidewire ClaimCenter 4.0.5 Release\u00a0Notes") && Guidewire_FMSourceFileMatch(SRCFILE,"relnotes-cc405.html") ) { return "relnotes-cc405.html";}
else if (Guidewire_TopicMatch(TOPIC,"Guidewire ClaimCenter 4.0.6 Release\u00a0Notes") && Guidewire_FMSourceFileMatch(SRCFILE,"relnotes-cc406.html") ) { return "relnotes-cc406.html";}
else if (Guidewire_TopicMatch(TOPIC,"Guidewire ClaimCenter 4.0.7 Release\u00a0Notes") && Guidewire_FMSourceFileMatch(SRCFILE,"relnotes-cc407.html") ) { return "relnotes-cc407.html";}
else if (Guidewire_TopicMatch(TOPIC,"Guidewire ClaimCenter 4.0.8 Release\u00a0Notes") && Guidewire_FMSourceFileMatch(SRCFILE,"relnotes-cc408.html") ) { return "relnotes-cc408.html";}
else if (Guidewire_TopicMatch(TOPIC,"Guidewire ClaimCenter 4.0.9 Release\u00a0Notes") && Guidewire_FMSourceFileMatch(SRCFILE,"relnotes-cc409.html") ) { return "relnotes-cc409.html";}
else if (Guidewire_TopicMatch(TOPIC,"Guidewire ClaimCenter 5.0.0 Release\u00a0Notes") && Guidewire_FMSourceFileMatch(SRCFILE,"relnotes-cc500.html") ) { return "relnotes-cc500.html";}
else if (Guidewire_TopicMatch(TOPIC,"Guidewire ClaimCenter 5.0.1 Release\u00a0Notes") && Guidewire_FMSourceFileMatch(SRCFILE,"relnotes-cc501.html") ) { return "relnotes-cc501.html";}
else if (Guidewire_TopicMatch(TOPIC,"Guidewire ClaimCenter 5.0.2 Release\u00a0Notes") && Guidewire_FMSourceFileMatch(SRCFILE,"relnotes-cc502.html") ) { return "relnotes-cc502.html";}
else if (Guidewire_TopicMatch(TOPIC,"Guidewire ClaimCenter 5.0.3 Release\u00a0Notes") && Guidewire_FMSourceFileMatch(SRCFILE,"relnotes-cc503.html") ) { return "relnotes-cc503.html";}
else if (Guidewire_TopicMatch(TOPIC,"Guidewire ClaimCenter 5.0.4 Release\u00a0Notes") && Guidewire_FMSourceFileMatch(SRCFILE,"relnotes-cc504.html") ) { return "relnotes-cc504.html";}
else if (Guidewire_TopicMatch(TOPIC,"Guidewire ClaimCenter 5.0.5 Release\u00a0Notes") && Guidewire_FMSourceFileMatch(SRCFILE,"relnotes-cc505.html") ) { return "relnotes-cc505.html";}
else if (Guidewire_TopicMatch(TOPIC,"Guidewire ClaimCenter 5.0.6 Release\u00a0Notes") && Guidewire_FMSourceFileMatch(SRCFILE,"relnotes-cc506.html") ) { return "relnotes-cc506.html";}
else if (Guidewire_TopicMatch(TOPIC,"Guidewire ClaimCenter 5.0.7 Release\u00a0Notes") && Guidewire_FMSourceFileMatch(SRCFILE,"relnotes-cc507.html") ) { return "relnotes-cc507.html";}
else if (Guidewire_TopicMatch(TOPIC,"Guidewire ClaimCenter 5.0.8 Release\u00a0Notes") && Guidewire_FMSourceFileMatch(SRCFILE,"relnotes-cc508.html") ) { return "relnotes-cc508.html";}
else if (Guidewire_TopicMatch(TOPIC,"Guidewire ClaimCenter 6.0.0 Release\u00a0Notes") && Guidewire_FMSourceFileMatch(SRCFILE,"relnotes-cc600.html") ) { return "relnotes-cc600.html";}
else if (Guidewire_TopicMatch(TOPIC,"Guidewire ClaimCenter 6.0.1 Release\u00a0Notes") && Guidewire_FMSourceFileMatch(SRCFILE,"relnotes-cc601.html") ) { return "relnotes-cc601.html";}
else if (Guidewire_TopicMatch(TOPIC,"Guidewire ClaimCenter 6.0.2 Release\u00a0Notes") && Guidewire_FMSourceFileMatch(SRCFILE,"relnotes-cc602.html") ) { return "relnotes-cc602.html";}
else if (Guidewire_TopicMatch(TOPIC,"Guidewire ClaimCenter 6.0.3 Release\u00a0Notes") && Guidewire_FMSourceFileMatch(SRCFILE,"relnotes-cc603.html") ) { return "relnotes-cc603.html";}
else if (Guidewire_TopicMatch(TOPIC,"Guidewire ClaimCenter 6.0.4 Release\u00a0Notes") && Guidewire_FMSourceFileMatch(SRCFILE,"ReleaseNotes_CC-604.html") ) { return "ReleaseNotes_CC-604.html";}
else if (Guidewire_TopicMatch(TOPIC,"Guidewire ClaimCenter 6.0.5 Release\u00a0Notes") && Guidewire_FMSourceFileMatch(SRCFILE,"ReleaseNotes_CC-605.html") ) { return "ReleaseNotes_CC-605.html";}
else if (Guidewire_TopicMatch(TOPIC,"Guidewire ClaimCenter 6.0.6 Release\u00a0Notes") && Guidewire_FMSourceFileMatch(SRCFILE,"ReleaseNotes_CC-606.html") ) { return "ReleaseNotes_CC-606.html";}
else if (Guidewire_TopicMatch(TOPIC,"Guidewire ClaimCenter 6.0.7 Release\u00a0Notes") && Guidewire_FMSourceFileMatch(SRCFILE,"ReleaseNotes-CC607.html") ) { return "ReleaseNotes-CC607.html";}
else { return("../wwhelp/topic_cannot_be_found.html"); } }

function  WWHBookData_MatchTopic(P)
{
var C=null;P=decodeURIComponent(decodeURIComponent(escape(P)));//workaround epub bug with UTF8 processing!
if(P=="Java_Plugin_Entity_Library_Changes")C="c-integration.08.17.html";
if(P=="Plugin_Registry_Deprecated_in_Gosu,_Replaced_by_New_Plugins_Class")C="c-integration.08.27.html";
if (C) { return C } else { return GUIDEWIRE_TOPIC_TO_FILE(P,Guidewire_ExtractSrcFromURL());}
}
