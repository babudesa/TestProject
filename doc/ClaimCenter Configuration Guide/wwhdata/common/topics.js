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

else if (Guidewire_TopicMatch(TOPIC,"ClaimCenter Configuration Guide") && Guidewire_FMSourceFileMatch(SRCFILE,"cover-config.html") ) { return "cover-config.html";}
else if (Guidewire_TopicMatch(TOPIC,"About This Document") && Guidewire_FMSourceFileMatch(SRCFILE,"about.html") ) { return "about.html";}
else if (Guidewire_TopicMatch(TOPIC,"ClaimCenter Configuration Basics") && Guidewire_FMSourceFileMatch(SRCFILE,"p-basics.html") ) { return "p-basics.html";}
else if (Guidewire_TopicMatch(TOPIC,"Overview of ClaimCenter Configuration") && Guidewire_FMSourceFileMatch(SRCFILE,"overview.04.1.html") ) { return "overview.04.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"What You Can Configure") && Guidewire_FMSourceFileMatch(SRCFILE,"overview.04.2.html") ) { return "overview.04.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"How You Configure ClaimCenter") && Guidewire_FMSourceFileMatch(SRCFILE,"overview.04.3.html") ) { return "overview.04.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Types of Application Environments") && Guidewire_FMSourceFileMatch(SRCFILE,"overview.04.4.html") ) { return "overview.04.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Deploying Configuration Files") && Guidewire_FMSourceFileMatch(SRCFILE,"overview.04.5.html") ) { return "overview.04.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Regenerating the Data Dictionary and Security Dictionary") && Guidewire_FMSourceFileMatch(SRCFILE,"overview.04.6.html") ) { return "overview.04.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Managing Configuration Changes") && Guidewire_FMSourceFileMatch(SRCFILE,"overview.04.7.html") ) { return "overview.04.7.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuration Topics in This and Other Documents") && Guidewire_FMSourceFileMatch(SRCFILE,"overview.04.8.html") ) { return "overview.04.8.html";}
else if (Guidewire_TopicMatch(TOPIC,"Application Configuration Parameters") && Guidewire_FMSourceFileMatch(SRCFILE,"params.05.01.html") ) { return "params.05.01.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working with Configuration Parameters") && Guidewire_FMSourceFileMatch(SRCFILE,"params.05.02.html") ) { return "params.05.02.html";}
else if (Guidewire_TopicMatch(TOPIC,"Approval Parameters") && Guidewire_FMSourceFileMatch(SRCFILE,"params.05.03.html") ) { return "params.05.03.html";}
else if (Guidewire_TopicMatch(TOPIC,"Archive Parameters") && Guidewire_FMSourceFileMatch(SRCFILE,"params.05.04.html") ) { return "params.05.04.html";}
else if (Guidewire_TopicMatch(TOPIC,"Assignment Parameters") && Guidewire_FMSourceFileMatch(SRCFILE,"params.05.05.html") ) { return "params.05.05.html";}
else if (Guidewire_TopicMatch(TOPIC,"Batch Process Parameters") && Guidewire_FMSourceFileMatch(SRCFILE,"params.05.06.html") ) { return "params.05.06.html";}
else if (Guidewire_TopicMatch(TOPIC,"Business Calendar Parameters") && Guidewire_FMSourceFileMatch(SRCFILE,"params.05.07.html") ) { return "params.05.07.html";}
else if (Guidewire_TopicMatch(TOPIC,"Cache Parameters") && Guidewire_FMSourceFileMatch(SRCFILE,"params.05.08.html") ) { return "params.05.08.html";}
else if (Guidewire_TopicMatch(TOPIC,"Claim Catastrophe Parameters") && Guidewire_FMSourceFileMatch(SRCFILE,"params.05.09.html") ) { return "params.05.09.html";}
else if (Guidewire_TopicMatch(TOPIC,"Claim Health Indicator and Metric Parameters") && Guidewire_FMSourceFileMatch(SRCFILE,"params.05.10.html") ) { return "params.05.10.html";}
else if (Guidewire_TopicMatch(TOPIC,"Clustering Parameters") && Guidewire_FMSourceFileMatch(SRCFILE,"params.05.11.html") ) { return "params.05.11.html";}
else if (Guidewire_TopicMatch(TOPIC,"Database Parameters") && Guidewire_FMSourceFileMatch(SRCFILE,"params.05.12.html") ) { return "params.05.12.html";}
else if (Guidewire_TopicMatch(TOPIC,"Deduction Parameters") && Guidewire_FMSourceFileMatch(SRCFILE,"params.05.13.html") ) { return "params.05.13.html";}
else if (Guidewire_TopicMatch(TOPIC,"Document Creation and Document Management Parameters") && Guidewire_FMSourceFileMatch(SRCFILE,"params.05.14.html") ) { return "params.05.14.html";}
else if (Guidewire_TopicMatch(TOPIC,"Domain Graph Parameters") && Guidewire_FMSourceFileMatch(SRCFILE,"params.05.15.html") ) { return "params.05.15.html";}
else if (Guidewire_TopicMatch(TOPIC,"Environment Parameters") && Guidewire_FMSourceFileMatch(SRCFILE,"params.05.16.html") ) { return "params.05.16.html";}
else if (Guidewire_TopicMatch(TOPIC,"Financial Parameters") && Guidewire_FMSourceFileMatch(SRCFILE,"params.05.17.html") ) { return "params.05.17.html";}
else if (Guidewire_TopicMatch(TOPIC,"Geocoding-related Parameters") && Guidewire_FMSourceFileMatch(SRCFILE,"params.05.18.html") ) { return "params.05.18.html";}
else if (Guidewire_TopicMatch(TOPIC,"Integration Parameters") && Guidewire_FMSourceFileMatch(SRCFILE,"params.05.19.html") ) { return "params.05.19.html";}
else if (Guidewire_TopicMatch(TOPIC,"Miscellaneous Bulk Invoice Activity Pattern Parameters") && Guidewire_FMSourceFileMatch(SRCFILE,"params.05.20.html") ) { return "params.05.20.html";}
else if (Guidewire_TopicMatch(TOPIC,"Miscellaneous Financial Activity Parameters") && Guidewire_FMSourceFileMatch(SRCFILE,"params.05.21.html") ) { return "params.05.21.html";}
else if (Guidewire_TopicMatch(TOPIC,"Miscellaneous Parameters") && Guidewire_FMSourceFileMatch(SRCFILE,"params.05.22.html") ) { return "params.05.22.html";}
else if (Guidewire_TopicMatch(TOPIC,"PDF Print Settings Parameters") && Guidewire_FMSourceFileMatch(SRCFILE,"params.05.23.html") ) { return "params.05.23.html";}
else if (Guidewire_TopicMatch(TOPIC,"Scheduler and Workflow Parameters") && Guidewire_FMSourceFileMatch(SRCFILE,"params.05.24.html") ) { return "params.05.24.html";}
else if (Guidewire_TopicMatch(TOPIC,"Search Parameters") && Guidewire_FMSourceFileMatch(SRCFILE,"params.05.25.html") ) { return "params.05.25.html";}
else if (Guidewire_TopicMatch(TOPIC,"Security Parameters") && Guidewire_FMSourceFileMatch(SRCFILE,"params.05.26.html") ) { return "params.05.26.html";}
else if (Guidewire_TopicMatch(TOPIC,"Segmentation Parameters") && Guidewire_FMSourceFileMatch(SRCFILE,"params.05.27.html") ) { return "params.05.27.html";}
else if (Guidewire_TopicMatch(TOPIC,"Spellcheck Parameters") && Guidewire_FMSourceFileMatch(SRCFILE,"params.05.28.html") ) { return "params.05.28.html";}
else if (Guidewire_TopicMatch(TOPIC,"Statistics, Team, and Dashboard Parameters") && Guidewire_FMSourceFileMatch(SRCFILE,"params.05.29.html") ) { return "params.05.29.html";}
else if (Guidewire_TopicMatch(TOPIC,"User Interface Parameters") && Guidewire_FMSourceFileMatch(SRCFILE,"params.05.30.html") ) { return "params.05.30.html";}
else if (Guidewire_TopicMatch(TOPIC,"Work Queue Parameters") && Guidewire_FMSourceFileMatch(SRCFILE,"params.05.31.html") ) { return "params.05.31.html";}
else if (Guidewire_TopicMatch(TOPIC,"The Guidewire Development Environment") && Guidewire_FMSourceFileMatch(SRCFILE,"p-datamodel.html") ) { return "p-datamodel.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working with Guidewire Studio") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_configure.07.01.html") ) { return "studio_configure.07.01.html";}
else if (Guidewire_TopicMatch(TOPIC,"What Is Guidewire Studio") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_configure.07.02.html") ) { return "studio_configure.07.02.html";}
else if (Guidewire_TopicMatch(TOPIC,"Starting Guidewire Studio") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_configure.07.03.html") ) { return "studio_configure.07.03.html";}
else if (Guidewire_TopicMatch(TOPIC,"Restarting Studio") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_configure.07.04.html") ) { return "studio_configure.07.04.html";}
else if (Guidewire_TopicMatch(TOPIC,"The Studio Development Environment") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_configure.07.05.html") ) { return "studio_configure.07.05.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working with the QuickStart Development Server") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_configure.07.06.html") ) { return "studio_configure.07.06.html";}
else if (Guidewire_TopicMatch(TOPIC,"ClaimCenter Configuration Files") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_configure.07.07.html") ) { return "studio_configure.07.07.html";}
else if (Guidewire_TopicMatch(TOPIC,"ClaimCenter Resources Tree") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_configure.07.08.html") ) { return "studio_configure.07.08.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring Diagnostic Logging in Studio") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_configure.07.09.html") ) { return "studio_configure.07.09.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring Guidewire Studio") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_configure.07.10.html") ) { return "studio_configure.07.10.html";}
else if (Guidewire_TopicMatch(TOPIC,"Linking Studio to a SCM System") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_configure.07.11.html") ) { return "studio_configure.07.11.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring Version Control") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_configure.07.12.html") ) { return "studio_configure.07.12.html";}
else if (Guidewire_TopicMatch(TOPIC,"Setting File Update and Deletion Parameters (General Settings Tab)") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_configure.07.13.html") ) { return "studio_configure.07.13.html";}
else if (Guidewire_TopicMatch(TOPIC,"Setting Font Display Options") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_configure.07.14.html") ) { return "studio_configure.07.14.html";}
else if (Guidewire_TopicMatch(TOPIC,"Setting Code Completion Options") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_configure.07.15.html") ) { return "studio_configure.07.15.html";}
else if (Guidewire_TopicMatch(TOPIC,"Setting Server Default Options") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_configure.07.16.html") ) { return "studio_configure.07.16.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring External Editors") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_configure.07.17.html") ) { return "studio_configure.07.17.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working with an External XML Tool") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_configure.07.18.html") ) { return "studio_configure.07.18.html";}
else if (Guidewire_TopicMatch(TOPIC,"Setting the Studio Locale") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_configure.07.19.html") ) { return "studio_configure.07.19.html";}
else if (Guidewire_TopicMatch(TOPIC,"ClaimCenter Studio and Gosu") && Guidewire_FMSourceFileMatch(SRCFILE,"building_blocks.08.01.html") ) { return "building_blocks.08.01.html";}
else if (Guidewire_TopicMatch(TOPIC,"Gosu Building Blocks") && Guidewire_FMSourceFileMatch(SRCFILE,"building_blocks.08.02.html") ) { return "building_blocks.08.02.html";}
else if (Guidewire_TopicMatch(TOPIC,"Gosu Case Sensitivity") && Guidewire_FMSourceFileMatch(SRCFILE,"building_blocks.08.03.html") ) { return "building_blocks.08.03.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working with Gosu in ClaimCenter Studio") && Guidewire_FMSourceFileMatch(SRCFILE,"building_blocks.08.04.html") ) { return "building_blocks.08.04.html";}
else if (Guidewire_TopicMatch(TOPIC,"Gosu Packages") && Guidewire_FMSourceFileMatch(SRCFILE,"building_blocks.08.05.html") ) { return "building_blocks.08.05.html";}
else if (Guidewire_TopicMatch(TOPIC,"Gosu Classes") && Guidewire_FMSourceFileMatch(SRCFILE,"building_blocks.08.06.html") ) { return "building_blocks.08.06.html";}
else if (Guidewire_TopicMatch(TOPIC,"ClaimCenter Base Configuration Classes") && Guidewire_FMSourceFileMatch(SRCFILE,"building_blocks.08.07.html") ) { return "building_blocks.08.07.html";}
else if (Guidewire_TopicMatch(TOPIC,"Class Visibility in Studio") && Guidewire_FMSourceFileMatch(SRCFILE,"building_blocks.08.08.html") ) { return "building_blocks.08.08.html";}
else if (Guidewire_TopicMatch(TOPIC,"Preloading Gosu Classes") && Guidewire_FMSourceFileMatch(SRCFILE,"building_blocks.08.09.html") ) { return "building_blocks.08.09.html";}
else if (Guidewire_TopicMatch(TOPIC,"Gosu Enhancements") && Guidewire_FMSourceFileMatch(SRCFILE,"building_blocks.08.10.html") ) { return "building_blocks.08.10.html";}
else if (Guidewire_TopicMatch(TOPIC,"The Guidewire XML Model") && Guidewire_FMSourceFileMatch(SRCFILE,"building_blocks.08.11.html") ) { return "building_blocks.08.11.html";}
else if (Guidewire_TopicMatch(TOPIC,"Script Parameters") && Guidewire_FMSourceFileMatch(SRCFILE,"building_blocks.08.12.html") ) { return "building_blocks.08.12.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working with Script Parameters") && Guidewire_FMSourceFileMatch(SRCFILE,"building_blocks.08.13.html") ) { return "building_blocks.08.13.html";}
else if (Guidewire_TopicMatch(TOPIC,"Referencing a Script Parameter in Gosu") && Guidewire_FMSourceFileMatch(SRCFILE,"building_blocks.08.14.html") ) { return "building_blocks.08.14.html";}
else if (Guidewire_TopicMatch(TOPIC,"Getting Started") && Guidewire_FMSourceFileMatch(SRCFILE,"studio.09.1.html") ) { return "studio.09.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using the Studio Interface") && Guidewire_FMSourceFileMatch(SRCFILE,"studio.09.2.html") ) { return "studio.09.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using the Studio Menus") && Guidewire_FMSourceFileMatch(SRCFILE,"studio.09.3.html") ) { return "studio.09.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using the Toolbar Icons") && Guidewire_FMSourceFileMatch(SRCFILE,"studio.09.4.html") ) { return "studio.09.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using the Right-Click Menu") && Guidewire_FMSourceFileMatch(SRCFILE,"studio.09.5.html") ) { return "studio.09.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Managing Windows and Views") && Guidewire_FMSourceFileMatch(SRCFILE,"studio.09.6.html") ) { return "studio.09.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working with Studio Resources") && Guidewire_FMSourceFileMatch(SRCFILE,"studio.09.7.html") ) { return "studio.09.7.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working in Guidewire Studio") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_using.10.1.html") ) { return "studio_using.10.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Entering Valid Code") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_using.10.2.html") ) { return "studio_using.10.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using Studio Keyboard Shortcuts") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_using.10.3.html") ) { return "studio_using.10.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Viewing Keyboard Shortcuts in ClaimCenter") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_using.10.4.html") ) { return "studio_using.10.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using Text Editing Commands") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_using.10.5.html") ) { return "studio_using.10.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Navigating Tables") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_using.10.6.html") ) { return "studio_using.10.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Refactoring Gosu Code") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_using.10.7.html") ) { return "studio_using.10.7.html";}
else if (Guidewire_TopicMatch(TOPIC,"Saving Your Work") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_using.10.8.html") ) { return "studio_using.10.8.html";}
else if (Guidewire_TopicMatch(TOPIC,"Guidewire Studio Editors") && Guidewire_FMSourceFileMatch(SRCFILE,"p-editors.html") ) { return "p-editors.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using the Studio Editors") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_editors.12.1.html") ) { return "studio_editors.12.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Editing in Guidewire Studio") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_editors.12.2.html") ) { return "studio_editors.12.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working in the Gosu Editor") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_editors.12.3.html") ) { return "studio_editors.12.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using the Plugins Editor") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_plugins.13.1.html") ) { return "studio_plugins.13.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"What Are Plugins") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_plugins.13.2.html") ) { return "studio_plugins.13.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working with Plugins") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_plugins.13.3.html") ) { return "studio_plugins.13.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Customizing Plugin Functionality") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_plugins.13.4.html") ) { return "studio_plugins.13.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working with Web Services") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_web_services.14.1.html") ) { return "studio_web_services.14.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"What Are Web Services") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_web_services.14.2.html") ) { return "studio_web_services.14.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using the Web Services Editor") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_web_services.14.3.html") ) { return "studio_web_services.14.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Creating a New Web Service Proxy Endpoint") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_web_services.14.4.html") ) { return "studio_web_services.14.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Implementing QuickJump Commands") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_quickjump.15.1.html") ) { return "studio_quickjump.15.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"What Is QuickJump") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_quickjump.15.2.html") ) { return "studio_quickjump.15.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Adding a QuickJump Navigation Command") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_quickjump.15.3.html") ) { return "studio_quickjump.15.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Implementing QuickJumpCommandRef Commands") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_quickjump.15.4.html") ) { return "studio_quickjump.15.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Implementing StaticNavigationCommandRef Commands") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_quickjump.15.5.html") ) { return "studio_quickjump.15.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Implementing ContextualNavigationCommandRef Commands") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_quickjump.15.6.html") ) { return "studio_quickjump.15.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Checking Permissions on QuickJump Navigation Commands") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_quickjump.15.7.html") ) { return "studio_quickjump.15.7.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using the Entity Names Editor") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_entity_names.16.1.html") ) { return "studio_entity_names.16.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"The Entity Names Editor") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_entity_names.16.2.html") ) { return "studio_entity_names.16.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"The Variable Table") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_entity_names.16.3.html") ) { return "studio_entity_names.16.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"The Gosu Text Editor") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_entity_names.16.4.html") ) { return "studio_entity_names.16.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Including Data from Subentities") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_entity_names.16.5.html") ) { return "studio_entity_names.16.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Entity Name Types") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_entity_names.16.6.html") ) { return "studio_entity_names.16.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using the Messaging Editor") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_messaging.17.1.html") ) { return "studio_messaging.17.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"The Messaging Editor") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_messaging.17.2.html") ) { return "studio_messaging.17.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working with Email Attachments") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_messaging.17.3.html") ) { return "studio_messaging.17.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using the Rules Editor") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_rules.18.1.html") ) { return "studio_rules.18.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working with Rules") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_rules.18.2.html") ) { return "studio_rules.18.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Renaming or Deleting a Rule") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_rules.18.3.html") ) { return "studio_rules.18.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using Find-and-Replace") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_rules.18.4.html") ) { return "studio_rules.18.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Changing the Root Entity of a Rule") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_rules.18.5.html") ) { return "studio_rules.18.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Validating Rules and Gosu Code") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_rules.18.6.html") ) { return "studio_rules.18.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Making a Rule Active or Inactive") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_rules.18.7.html") ) { return "studio_rules.18.7.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using the Display Keys Editor") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_displaykey_editor.19.1.html") ) { return "studio_displaykey_editor.19.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"The Display Keys Editor") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_displaykey_editor.19.2.html") ) { return "studio_displaykey_editor.19.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Creating Display Keys in a Gosu Editor") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_displaykey_editor.19.3.html") ) { return "studio_displaykey_editor.19.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Retrieving the Value of a Display Key") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_displaykey_editor.19.4.html") ) { return "studio_displaykey_editor.19.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Data Model Configuration") && Guidewire_FMSourceFileMatch(SRCFILE,"p-datamodel_2.html") ) { return "p-datamodel_2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working with the Data Dictionary") && Guidewire_FMSourceFileMatch(SRCFILE,"data_dictionary.21.1.html") ) { return "data_dictionary.21.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"What is the Data Dictionary") && Guidewire_FMSourceFileMatch(SRCFILE,"data_dictionary.21.2.html") ) { return "data_dictionary.21.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"What Can You View in the Data Dictionary") && Guidewire_FMSourceFileMatch(SRCFILE,"data_dictionary.21.3.html") ) { return "data_dictionary.21.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using the Data Dictionary") && Guidewire_FMSourceFileMatch(SRCFILE,"data_dictionary.21.4.html") ) { return "data_dictionary.21.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"The ClaimCenter Data Model") && Guidewire_FMSourceFileMatch(SRCFILE,"entities.22.01.html") ) { return "entities.22.01.html";}
else if (Guidewire_TopicMatch(TOPIC,"What Is the Data Model") && Guidewire_FMSourceFileMatch(SRCFILE,"entities.22.02.html") ) { return "entities.22.02.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using Dot Notation") && Guidewire_FMSourceFileMatch(SRCFILE,"entities.22.03.html") ) { return "entities.22.03.html";}
else if (Guidewire_TopicMatch(TOPIC,"Overview of Data Entities") && Guidewire_FMSourceFileMatch(SRCFILE,"entities.22.04.html") ) { return "entities.22.04.html";}
else if (Guidewire_TopicMatch(TOPIC,"Base ClaimCenter Data Objects") && Guidewire_FMSourceFileMatch(SRCFILE,"entities.22.05.html") ) { return "entities.22.05.html";}
else if (Guidewire_TopicMatch(TOPIC,"Component Data Objects") && Guidewire_FMSourceFileMatch(SRCFILE,"entities.22.06.html") ) { return "entities.22.06.html";}
else if (Guidewire_TopicMatch(TOPIC,"Delegate Data Objects") && Guidewire_FMSourceFileMatch(SRCFILE,"entities.22.07.html") ) { return "entities.22.07.html";}
else if (Guidewire_TopicMatch(TOPIC,"Delete Entity Data Objects") && Guidewire_FMSourceFileMatch(SRCFILE,"entities.22.08.html") ) { return "entities.22.08.html";}
else if (Guidewire_TopicMatch(TOPIC,"Entity Data Objects") && Guidewire_FMSourceFileMatch(SRCFILE,"entities.22.09.html") ) { return "entities.22.09.html";}
else if (Guidewire_TopicMatch(TOPIC,"Extension Data Objects") && Guidewire_FMSourceFileMatch(SRCFILE,"entities.22.10.html") ) { return "entities.22.10.html";}
else if (Guidewire_TopicMatch(TOPIC,"Nonpersistent Entity Data Objects") && Guidewire_FMSourceFileMatch(SRCFILE,"entities.22.11.html") ) { return "entities.22.11.html";}
else if (Guidewire_TopicMatch(TOPIC,"Subtype Data Objects") && Guidewire_FMSourceFileMatch(SRCFILE,"entities.22.12.html") ) { return "entities.22.12.html";}
else if (Guidewire_TopicMatch(TOPIC,"View Entity Data Objects") && Guidewire_FMSourceFileMatch(SRCFILE,"entities.22.13.html") ) { return "entities.22.13.html";}
else if (Guidewire_TopicMatch(TOPIC,"View Entity Extension Data Objects") && Guidewire_FMSourceFileMatch(SRCFILE,"entities.22.14.html") ) { return "entities.22.14.html";}
else if (Guidewire_TopicMatch(TOPIC,"Data Object Subelements") && Guidewire_FMSourceFileMatch(SRCFILE,"entities.22.15.html") ) { return "entities.22.15.html";}
else if (Guidewire_TopicMatch(TOPIC,"(array)") && Guidewire_FMSourceFileMatch(SRCFILE,"entities.22.16.html") ) { return "entities.22.16.html";}
else if (Guidewire_TopicMatch(TOPIC,"(column)") && Guidewire_FMSourceFileMatch(SRCFILE,"entities.22.17.html") ) { return "entities.22.17.html";}
else if (Guidewire_TopicMatch(TOPIC,"(componentref)") && Guidewire_FMSourceFileMatch(SRCFILE,"entities.22.18.html") ) { return "entities.22.18.html";}
else if (Guidewire_TopicMatch(TOPIC,"(edgeForeignKey)") && Guidewire_FMSourceFileMatch(SRCFILE,"entities.22.19.html") ) { return "entities.22.19.html";}
else if (Guidewire_TopicMatch(TOPIC,"(events)") && Guidewire_FMSourceFileMatch(SRCFILE,"entities.22.20.html") ) { return "entities.22.20.html";}
else if (Guidewire_TopicMatch(TOPIC,"(foreignkey)") && Guidewire_FMSourceFileMatch(SRCFILE,"entities.22.21.html") ) { return "entities.22.21.html";}
else if (Guidewire_TopicMatch(TOPIC,"(fulldescription)") && Guidewire_FMSourceFileMatch(SRCFILE,"entities.22.22.html") ) { return "entities.22.22.html";}
else if (Guidewire_TopicMatch(TOPIC,"(implementsEntity)") && Guidewire_FMSourceFileMatch(SRCFILE,"entities.22.23.html") ) { return "entities.22.23.html";}
else if (Guidewire_TopicMatch(TOPIC,"(implementsInterface)") && Guidewire_FMSourceFileMatch(SRCFILE,"entities.22.24.html") ) { return "entities.22.24.html";}
else if (Guidewire_TopicMatch(TOPIC,"(index)") && Guidewire_FMSourceFileMatch(SRCFILE,"entities.22.25.html") ) { return "entities.22.25.html";}
else if (Guidewire_TopicMatch(TOPIC,"(onetoone)") && Guidewire_FMSourceFileMatch(SRCFILE,"entities.22.26.html") ) { return "entities.22.26.html";}
else if (Guidewire_TopicMatch(TOPIC,"(remove-index)") && Guidewire_FMSourceFileMatch(SRCFILE,"entities.22.27.html") ) { return "entities.22.27.html";}
else if (Guidewire_TopicMatch(TOPIC,"(typekey)") && Guidewire_FMSourceFileMatch(SRCFILE,"entities.22.28.html") ) { return "entities.22.28.html";}
else if (Guidewire_TopicMatch(TOPIC,"Modifying the Base Data Model") && Guidewire_FMSourceFileMatch(SRCFILE,"extenddm.23.01.html") ) { return "extenddm.23.01.html";}
else if (Guidewire_TopicMatch(TOPIC,"Planning Changes to the Base Data Model") && Guidewire_FMSourceFileMatch(SRCFILE,"extenddm.23.02.html") ) { return "extenddm.23.02.html";}
else if (Guidewire_TopicMatch(TOPIC,"Defining a New Data Entity") && Guidewire_FMSourceFileMatch(SRCFILE,"extenddm.23.03.html") ) { return "extenddm.23.03.html";}
else if (Guidewire_TopicMatch(TOPIC,"Extending a Base Configuration Entity") && Guidewire_FMSourceFileMatch(SRCFILE,"extenddm.23.04.html") ) { return "extenddm.23.04.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working with Attribute Overrides") && Guidewire_FMSourceFileMatch(SRCFILE,"extenddm.23.05.html") ) { return "extenddm.23.05.html";}
else if (Guidewire_TopicMatch(TOPIC,"Extending the Base Data Model: Examples") && Guidewire_FMSourceFileMatch(SRCFILE,"extenddm.23.06.html") ) { return "extenddm.23.06.html";}
else if (Guidewire_TopicMatch(TOPIC,"Creating a New Delegate Object") && Guidewire_FMSourceFileMatch(SRCFILE,"extenddm.23.07.html") ) { return "extenddm.23.07.html";}
else if (Guidewire_TopicMatch(TOPIC,"Extending a Delegate Object") && Guidewire_FMSourceFileMatch(SRCFILE,"extenddm.23.08.html") ) { return "extenddm.23.08.html";}
else if (Guidewire_TopicMatch(TOPIC,"Defining a Subtype") && Guidewire_FMSourceFileMatch(SRCFILE,"extenddm.23.09.html") ) { return "extenddm.23.09.html";}
else if (Guidewire_TopicMatch(TOPIC,"Defining a Reference Entity") && Guidewire_FMSourceFileMatch(SRCFILE,"extenddm.23.10.html") ) { return "extenddm.23.10.html";}
else if (Guidewire_TopicMatch(TOPIC,"Defining an Entity Array") && Guidewire_FMSourceFileMatch(SRCFILE,"extenddm.23.11.html") ) { return "extenddm.23.11.html";}
else if (Guidewire_TopicMatch(TOPIC,"Implementing a Many-to-Many Relationship Between Entity Types") && Guidewire_FMSourceFileMatch(SRCFILE,"extenddm.23.12.html") ) { return "extenddm.23.12.html";}
else if (Guidewire_TopicMatch(TOPIC,"Extending an Existing View Entity") && Guidewire_FMSourceFileMatch(SRCFILE,"extenddm.23.13.html") ) { return "extenddm.23.13.html";}
else if (Guidewire_TopicMatch(TOPIC,"Removing Objects from the Base Configuration Data Model") && Guidewire_FMSourceFileMatch(SRCFILE,"extenddm.23.14.html") ) { return "extenddm.23.14.html";}
else if (Guidewire_TopicMatch(TOPIC,"Deploying Data Model Changes to the Application Server") && Guidewire_FMSourceFileMatch(SRCFILE,"extenddm.23.15.html") ) { return "extenddm.23.15.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working with Associative Arrays") && Guidewire_FMSourceFileMatch(SRCFILE,"associative_arrays.24.1.html") ) { return "associative_arrays.24.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Overview of Associative Arrays") && Guidewire_FMSourceFileMatch(SRCFILE,"associative_arrays.24.2.html") ) { return "associative_arrays.24.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Subtype Mapping Associative Arrays") && Guidewire_FMSourceFileMatch(SRCFILE,"associative_arrays.24.3.html") ) { return "associative_arrays.24.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Typelist Mapping Associative Arrays") && Guidewire_FMSourceFileMatch(SRCFILE,"associative_arrays.24.4.html") ) { return "associative_arrays.24.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Example: Creating Assignable Entities") && Guidewire_FMSourceFileMatch(SRCFILE,"extenddm_example.25.01.html") ) { return "extenddm_example.25.01.html";}
else if (Guidewire_TopicMatch(TOPIC,"Creating an Assignable Extension Entity") && Guidewire_FMSourceFileMatch(SRCFILE,"extenddm_example.25.02.html") ) { return "extenddm_example.25.02.html";}
else if (Guidewire_TopicMatch(TOPIC,"Step 1: Create Extension Entity UserAssignableEntityExt") && Guidewire_FMSourceFileMatch(SRCFILE,"extenddm_example.25.03.html") ) { return "extenddm_example.25.03.html";}
else if (Guidewire_TopicMatch(TOPIC,"Step 2: Create Assignment Class NewAssignableMethodsImpl") && Guidewire_FMSourceFileMatch(SRCFILE,"extenddm_example.25.04.html") ) { return "extenddm_example.25.04.html";}
else if (Guidewire_TopicMatch(TOPIC,"Step 3: Test Assign Your Extension Entity") && Guidewire_FMSourceFileMatch(SRCFILE,"extenddm_example.25.05.html") ) { return "extenddm_example.25.05.html";}
else if (Guidewire_TopicMatch(TOPIC,"Making Your Extension Entity Eligible for Round-Robin Assignment") && Guidewire_FMSourceFileMatch(SRCFILE,"extenddm_example.25.06.html") ) { return "extenddm_example.25.06.html";}
else if (Guidewire_TopicMatch(TOPIC,"Step 1: Extend the Assignment State Entities") && Guidewire_FMSourceFileMatch(SRCFILE,"extenddm_example.25.07.html") ) { return "extenddm_example.25.07.html";}
else if (Guidewire_TopicMatch(TOPIC,"Step 2: Subclass Class AssignmentType") && Guidewire_FMSourceFileMatch(SRCFILE,"extenddm_example.25.08.html") ) { return "extenddm_example.25.08.html";}
else if (Guidewire_TopicMatch(TOPIC,"Step 3: Create UserAssignableEntityExtEnhancement") && Guidewire_FMSourceFileMatch(SRCFILE,"extenddm_example.25.09.html") ) { return "extenddm_example.25.09.html";}
else if (Guidewire_TopicMatch(TOPIC,"Step 4: Test Round Robin Assignment") && Guidewire_FMSourceFileMatch(SRCFILE,"extenddm_example.25.10.html") ) { return "extenddm_example.25.10.html";}
else if (Guidewire_TopicMatch(TOPIC,"Creating an Assignable Extension Entity that Uses Foreign Keys") && Guidewire_FMSourceFileMatch(SRCFILE,"extenddm_example.25.11.html") ) { return "extenddm_example.25.11.html";}
else if (Guidewire_TopicMatch(TOPIC,"Step 1: Create Extension Entity TestClaimAssignable") && Guidewire_FMSourceFileMatch(SRCFILE,"extenddm_example.25.12.html") ) { return "extenddm_example.25.12.html";}
else if (Guidewire_TopicMatch(TOPIC,"Step 2: Add Foreign Keys to Assignable Entities") && Guidewire_FMSourceFileMatch(SRCFILE,"extenddm_example.25.13.html") ) { return "extenddm_example.25.13.html";}
else if (Guidewire_TopicMatch(TOPIC,"Step 3: Create New Assignment Type for New Extension Entity") && Guidewire_FMSourceFileMatch(SRCFILE,"extenddm_example.25.14.html") ) { return "extenddm_example.25.14.html";}
else if (Guidewire_TopicMatch(TOPIC,"Step 4: Create Enhancement TestClaimAssignableEnhancement") && Guidewire_FMSourceFileMatch(SRCFILE,"extenddm_example.25.15.html") ) { return "extenddm_example.25.15.html";}
else if (Guidewire_TopicMatch(TOPIC,"Step 5: Create Test Class TestClaimAssignableMethodsImpl") && Guidewire_FMSourceFileMatch(SRCFILE,"extenddm_example.25.16.html") ) { return "extenddm_example.25.16.html";}
else if (Guidewire_TopicMatch(TOPIC,"Step 6: Add Corresponding Permission for the Extension Entity") && Guidewire_FMSourceFileMatch(SRCFILE,"extenddm_example.25.17.html") ) { return "extenddm_example.25.17.html";}
else if (Guidewire_TopicMatch(TOPIC,"Step 7: Test Assignment of the Assignable Entity") && Guidewire_FMSourceFileMatch(SRCFILE,"extenddm_example.25.18.html") ) { return "extenddm_example.25.18.html";}
else if (Guidewire_TopicMatch(TOPIC,"The Domain Graph") && Guidewire_FMSourceFileMatch(SRCFILE,"domain_graph.26.1.html") ) { return "domain_graph.26.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"What is the Domain Graph") && Guidewire_FMSourceFileMatch(SRCFILE,"domain_graph.26.2.html") ) { return "domain_graph.26.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Object Ownership and the Domain Graph") && Guidewire_FMSourceFileMatch(SRCFILE,"domain_graph.26.3.html") ) { return "domain_graph.26.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Accessing the Domain Graph") && Guidewire_FMSourceFileMatch(SRCFILE,"domain_graph.26.4.html") ) { return "domain_graph.26.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Adding Objects to the Domain Graph") && Guidewire_FMSourceFileMatch(SRCFILE,"domain_graph.26.5.html") ) { return "domain_graph.26.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Graph Validation Checks") && Guidewire_FMSourceFileMatch(SRCFILE,"domain_graph.26.6.html") ) { return "domain_graph.26.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working with Changes to the Data Model") && Guidewire_FMSourceFileMatch(SRCFILE,"domain_graph.26.7.html") ) { return "domain_graph.26.7.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working with Shared Entity Data") && Guidewire_FMSourceFileMatch(SRCFILE,"domain_graph.26.8.html") ) { return "domain_graph.26.8.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working with Cycles") && Guidewire_FMSourceFileMatch(SRCFILE,"domain_graph.26.9.html") ) { return "domain_graph.26.9.html";}
else if (Guidewire_TopicMatch(TOPIC,"Field Validation") && Guidewire_FMSourceFileMatch(SRCFILE,"fieldvalidators.27.1.html") ) { return "fieldvalidators.27.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Field Validators") && Guidewire_FMSourceFileMatch(SRCFILE,"fieldvalidators.27.2.html") ) { return "fieldvalidators.27.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Field Validator Definitions") && Guidewire_FMSourceFileMatch(SRCFILE,"fieldvalidators.27.3.html") ) { return "fieldvalidators.27.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"(FieldValidators)") && Guidewire_FMSourceFileMatch(SRCFILE,"fieldvalidators.27.4.html") ) { return "fieldvalidators.27.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Modifying Field Validators") && Guidewire_FMSourceFileMatch(SRCFILE,"fieldvalidators.27.5.html") ) { return "fieldvalidators.27.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Field Validation and Localization") && Guidewire_FMSourceFileMatch(SRCFILE,"fieldvalidators.27.6.html") ) { return "fieldvalidators.27.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Data Types") && Guidewire_FMSourceFileMatch(SRCFILE,"datatypes.28.1.html") ) { return "datatypes.28.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Overview of Data Types") && Guidewire_FMSourceFileMatch(SRCFILE,"datatypes.28.2.html") ) { return "datatypes.28.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"The \u2018datatypes.xml\u2019 File") && Guidewire_FMSourceFileMatch(SRCFILE,"datatypes.28.3.html") ) { return "datatypes.28.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Customizing Base Configuration Data Types") && Guidewire_FMSourceFileMatch(SRCFILE,"datatypes.28.4.html") ) { return "datatypes.28.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working with Money and Currency Data Types") && Guidewire_FMSourceFileMatch(SRCFILE,"datatypes.28.5.html") ) { return "datatypes.28.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working with the Medium Text Data Type (Oracle)") && Guidewire_FMSourceFileMatch(SRCFILE,"datatypes.28.6.html") ) { return "datatypes.28.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"The Data Type API") && Guidewire_FMSourceFileMatch(SRCFILE,"datatypes.28.7.html") ) { return "datatypes.28.7.html";}
else if (Guidewire_TopicMatch(TOPIC,"Defining a New Data Type: Required Steps") && Guidewire_FMSourceFileMatch(SRCFILE,"datatypes.28.8.html") ) { return "datatypes.28.8.html";}
else if (Guidewire_TopicMatch(TOPIC,"Defining a New Tax Identification Number Data Type") && Guidewire_FMSourceFileMatch(SRCFILE,"datatypes.28.9.html") ) { return "datatypes.28.9.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working with Typelists") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_typelist.29.01.html") ) { return "studio_typelist.29.01.html";}
else if (Guidewire_TopicMatch(TOPIC,"What is a Typelist") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_typelist.29.02.html") ) { return "studio_typelist.29.02.html";}
else if (Guidewire_TopicMatch(TOPIC,"Terms Related to Typelists") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_typelist.29.03.html") ) { return "studio_typelist.29.03.html";}
else if (Guidewire_TopicMatch(TOPIC,"Typelists and Typecodes") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_typelist.29.04.html") ) { return "studio_typelist.29.04.html";}
else if (Guidewire_TopicMatch(TOPIC,"Typelist Definition Files") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_typelist.29.05.html") ) { return "studio_typelist.29.05.html";}
else if (Guidewire_TopicMatch(TOPIC,"Different Kinds of Typelists") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_typelist.29.06.html") ) { return "studio_typelist.29.06.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working with Typelists in Studio") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_typelist.29.07.html") ) { return "studio_typelist.29.07.html";}
else if (Guidewire_TopicMatch(TOPIC,"Typekey Fields") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_typelist.29.08.html") ) { return "studio_typelist.29.08.html";}
else if (Guidewire_TopicMatch(TOPIC,"Typelist Filters") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_typelist.29.09.html") ) { return "studio_typelist.29.09.html";}
else if (Guidewire_TopicMatch(TOPIC,"Static Filters") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_typelist.29.10.html") ) { return "studio_typelist.29.10.html";}
else if (Guidewire_TopicMatch(TOPIC,"Dynamic Filters") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_typelist.29.11.html") ) { return "studio_typelist.29.11.html";}
else if (Guidewire_TopicMatch(TOPIC,"Mapping Typecodes to External System Codes") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_typelist.29.12.html") ) { return "studio_typelist.29.12.html";}
else if (Guidewire_TopicMatch(TOPIC,"User Interface Configuration") && Guidewire_FMSourceFileMatch(SRCFILE,"p-ui.html") ) { return "p-ui.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using the PCF Editor") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_pcf.31.01.html") ) { return "studio_pcf.31.01.html";}
else if (Guidewire_TopicMatch(TOPIC,"The Page Configuration (PCF) Editor") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_pcf.31.02.html") ) { return "studio_pcf.31.02.html";}
else if (Guidewire_TopicMatch(TOPIC,"The PCF Canvas") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_pcf.31.03.html") ) { return "studio_pcf.31.03.html";}
else if (Guidewire_TopicMatch(TOPIC,"Creating a New PCF File") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_pcf.31.04.html") ) { return "studio_pcf.31.04.html";}
else if (Guidewire_TopicMatch(TOPIC,"The Toolbox Tab") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_pcf.31.05.html") ) { return "studio_pcf.31.05.html";}
else if (Guidewire_TopicMatch(TOPIC,"The Structure Tab") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_pcf.31.06.html") ) { return "studio_pcf.31.06.html";}
else if (Guidewire_TopicMatch(TOPIC,"The Translations Tab") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_pcf.31.07.html") ) { return "studio_pcf.31.07.html";}
else if (Guidewire_TopicMatch(TOPIC,"The Properties Tab") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_pcf.31.08.html") ) { return "studio_pcf.31.08.html";}
else if (Guidewire_TopicMatch(TOPIC,"PCF Elements") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_pcf.31.09.html") ) { return "studio_pcf.31.09.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working with Elements") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_pcf.31.10.html") ) { return "studio_pcf.31.10.html";}
else if (Guidewire_TopicMatch(TOPIC,"Introduction to Page Configuration") && Guidewire_FMSourceFileMatch(SRCFILE,"pageconfig.32.1.html") ) { return "pageconfig.32.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Page Configuration Files") && Guidewire_FMSourceFileMatch(SRCFILE,"pageconfig.32.2.html") ) { return "pageconfig.32.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Page Configuration Elements") && Guidewire_FMSourceFileMatch(SRCFILE,"pageconfig.32.3.html") ) { return "pageconfig.32.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Getting Started Configuring Pages") && Guidewire_FMSourceFileMatch(SRCFILE,"pageconfig.32.4.html") ) { return "pageconfig.32.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Data Panels") && Guidewire_FMSourceFileMatch(SRCFILE,"panels.33.1.html") ) { return "panels.33.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Panel Overview") && Guidewire_FMSourceFileMatch(SRCFILE,"panels.33.2.html") ) { return "panels.33.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Detail View Panel") && Guidewire_FMSourceFileMatch(SRCFILE,"panels.33.3.html") ) { return "panels.33.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"List View Panel") && Guidewire_FMSourceFileMatch(SRCFILE,"panels.33.4.html") ) { return "panels.33.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Location Groups") && Guidewire_FMSourceFileMatch(SRCFILE,"locationgroups.34.1.html") ) { return "locationgroups.34.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Location Group Overview") && Guidewire_FMSourceFileMatch(SRCFILE,"locationgroups.34.2.html") ) { return "locationgroups.34.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Define a Location Group") && Guidewire_FMSourceFileMatch(SRCFILE,"locationgroups.34.3.html") ) { return "locationgroups.34.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Location Groups as Navigation") && Guidewire_FMSourceFileMatch(SRCFILE,"locationgroups.34.4.html") ) { return "locationgroups.34.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Navigation") && Guidewire_FMSourceFileMatch(SRCFILE,"nav.35.1.html") ) { return "nav.35.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Navigation Overview") && Guidewire_FMSourceFileMatch(SRCFILE,"nav.35.2.html") ) { return "nav.35.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Tab Bars") && Guidewire_FMSourceFileMatch(SRCFILE,"nav.35.3.html") ) { return "nav.35.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Tabs") && Guidewire_FMSourceFileMatch(SRCFILE,"nav.35.4.html") ) { return "nav.35.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring Spell Check") && Guidewire_FMSourceFileMatch(SRCFILE,"spellcheck.36.1.html") ) { return "spellcheck.36.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using the Spell Checking Feature") && Guidewire_FMSourceFileMatch(SRCFILE,"spellcheck.36.2.html") ) { return "spellcheck.36.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"How to Configure Spell Check") && Guidewire_FMSourceFileMatch(SRCFILE,"spellcheck.36.3.html") ) { return "spellcheck.36.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring Search Functionality") && Guidewire_FMSourceFileMatch(SRCFILE,"search.37.01.html") ) { return "search.37.01.html";}
else if (Guidewire_TopicMatch(TOPIC,"The ClaimCenter Search Functionality") && Guidewire_FMSourceFileMatch(SRCFILE,"search.37.02.html") ) { return "search.37.02.html";}
else if (Guidewire_TopicMatch(TOPIC,"File search-config.xml") && Guidewire_FMSourceFileMatch(SRCFILE,"search.37.03.html") ) { return "search.37.03.html";}
else if (Guidewire_TopicMatch(TOPIC,"The Criteria Definition Element") && Guidewire_FMSourceFileMatch(SRCFILE,"search.37.04.html") ) { return "search.37.04.html";}
else if (Guidewire_TopicMatch(TOPIC,"The Criterion Subelement") && Guidewire_FMSourceFileMatch(SRCFILE,"search.37.05.html") ) { return "search.37.05.html";}
else if (Guidewire_TopicMatch(TOPIC,"The Criterion Choice Subelement") && Guidewire_FMSourceFileMatch(SRCFILE,"search.37.06.html") ) { return "search.37.06.html";}
else if (Guidewire_TopicMatch(TOPIC,"The Array Criterion Subelement") && Guidewire_FMSourceFileMatch(SRCFILE,"search.37.07.html") ) { return "search.37.07.html";}
else if (Guidewire_TopicMatch(TOPIC,"Deploying Customized Search Files") && Guidewire_FMSourceFileMatch(SRCFILE,"search.37.08.html") ) { return "search.37.08.html";}
else if (Guidewire_TopicMatch(TOPIC,"Steps in Customizing a Search") && Guidewire_FMSourceFileMatch(SRCFILE,"search.37.09.html") ) { return "search.37.09.html";}
else if (Guidewire_TopicMatch(TOPIC,"Adding an Optional Search Field") && Guidewire_FMSourceFileMatch(SRCFILE,"search.37.10.html") ) { return "search.37.10.html";}
else if (Guidewire_TopicMatch(TOPIC,"Adding an Optional Array Search Field") && Guidewire_FMSourceFileMatch(SRCFILE,"search.37.11.html") ) { return "search.37.11.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring Special Page Functions") && Guidewire_FMSourceFileMatch(SRCFILE,"pagefunc.38.1.html") ) { return "pagefunc.38.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Adding Print Capabilities") && Guidewire_FMSourceFileMatch(SRCFILE,"pagefunc.38.2.html") ) { return "pagefunc.38.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Linking to a Specific Page: Using an EntryPoint PCF") && Guidewire_FMSourceFileMatch(SRCFILE,"pagefunc.38.3.html") ) { return "pagefunc.38.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Linking to a Specific Page: Using an ExitPoint PCF") && Guidewire_FMSourceFileMatch(SRCFILE,"pagefunc.38.4.html") ) { return "pagefunc.38.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Populating a PCF Template: Using a TemplatePage PCF") && Guidewire_FMSourceFileMatch(SRCFILE,"pagefunc.38.5.html") ) { return "pagefunc.38.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Workflow and Activity Configuration") && Guidewire_FMSourceFileMatch(SRCFILE,"p-workflow.html") ) { return "p-workflow.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using the Workflow Editor") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_workflow.40.1.html") ) { return "studio_workflow.40.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Workflow in Guidewire ClaimCenter") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_workflow.40.2.html") ) { return "studio_workflow.40.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Workflow in Guidewire Studio") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_workflow.40.3.html") ) { return "studio_workflow.40.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Understanding Workflow Steps") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_workflow.40.4.html") ) { return "studio_workflow.40.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using the Workflow Right-Click Menu") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_workflow.40.5.html") ) { return "studio_workflow.40.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using Search with Workflow") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_workflow.40.6.html") ) { return "studio_workflow.40.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Guidewire Workflow") && Guidewire_FMSourceFileMatch(SRCFILE,"workflow.41.01.html") ) { return "workflow.41.01.html";}
else if (Guidewire_TopicMatch(TOPIC,"Understanding Workflow") && Guidewire_FMSourceFileMatch(SRCFILE,"workflow.41.02.html") ) { return "workflow.41.02.html";}
else if (Guidewire_TopicMatch(TOPIC,"Workflow Instances") && Guidewire_FMSourceFileMatch(SRCFILE,"workflow.41.03.html") ) { return "workflow.41.03.html";}
else if (Guidewire_TopicMatch(TOPIC,"Work Items") && Guidewire_FMSourceFileMatch(SRCFILE,"workflow.41.04.html") ) { return "workflow.41.04.html";}
else if (Guidewire_TopicMatch(TOPIC,"Workflow Process Format") && Guidewire_FMSourceFileMatch(SRCFILE,"workflow.41.05.html") ) { return "workflow.41.05.html";}
else if (Guidewire_TopicMatch(TOPIC,"Workflow Gosu") && Guidewire_FMSourceFileMatch(SRCFILE,"workflow.41.06.html") ) { return "workflow.41.06.html";}
else if (Guidewire_TopicMatch(TOPIC,"Workflow Versioning") && Guidewire_FMSourceFileMatch(SRCFILE,"workflow.41.07.html") ) { return "workflow.41.07.html";}
else if (Guidewire_TopicMatch(TOPIC,"Workflow Localization") && Guidewire_FMSourceFileMatch(SRCFILE,"workflow.41.08.html") ) { return "workflow.41.08.html";}
else if (Guidewire_TopicMatch(TOPIC,"Workflow Structural Elements") && Guidewire_FMSourceFileMatch(SRCFILE,"workflow.41.09.html") ) { return "workflow.41.09.html";}
else if (Guidewire_TopicMatch(TOPIC,"(Context)") && Guidewire_FMSourceFileMatch(SRCFILE,"workflow.41.10.html") ) { return "workflow.41.10.html";}
else if (Guidewire_TopicMatch(TOPIC,"(Start)") && Guidewire_FMSourceFileMatch(SRCFILE,"workflow.41.11.html") ) { return "workflow.41.11.html";}
else if (Guidewire_TopicMatch(TOPIC,"(Finish)") && Guidewire_FMSourceFileMatch(SRCFILE,"workflow.41.12.html") ) { return "workflow.41.12.html";}
else if (Guidewire_TopicMatch(TOPIC,"Common Step Elements") && Guidewire_FMSourceFileMatch(SRCFILE,"workflow.41.13.html") ) { return "workflow.41.13.html";}
else if (Guidewire_TopicMatch(TOPIC,"Enter and Exit Scripts") && Guidewire_FMSourceFileMatch(SRCFILE,"workflow.41.14.html") ) { return "workflow.41.14.html";}
else if (Guidewire_TopicMatch(TOPIC,"Asserts") && Guidewire_FMSourceFileMatch(SRCFILE,"workflow.41.15.html") ) { return "workflow.41.15.html";}
else if (Guidewire_TopicMatch(TOPIC,"Events") && Guidewire_FMSourceFileMatch(SRCFILE,"workflow.41.16.html") ) { return "workflow.41.16.html";}
else if (Guidewire_TopicMatch(TOPIC,"Notifications") && Guidewire_FMSourceFileMatch(SRCFILE,"workflow.41.17.html") ) { return "workflow.41.17.html";}
else if (Guidewire_TopicMatch(TOPIC,"Branch IDs") && Guidewire_FMSourceFileMatch(SRCFILE,"workflow.41.18.html") ) { return "workflow.41.18.html";}
else if (Guidewire_TopicMatch(TOPIC,"Basic Workflow Steps") && Guidewire_FMSourceFileMatch(SRCFILE,"workflow.41.19.html") ) { return "workflow.41.19.html";}
else if (Guidewire_TopicMatch(TOPIC,"AutoStep") && Guidewire_FMSourceFileMatch(SRCFILE,"workflow.41.20.html") ) { return "workflow.41.20.html";}
else if (Guidewire_TopicMatch(TOPIC,"MessageStep") && Guidewire_FMSourceFileMatch(SRCFILE,"workflow.41.21.html") ) { return "workflow.41.21.html";}
else if (Guidewire_TopicMatch(TOPIC,"ActivityStep") && Guidewire_FMSourceFileMatch(SRCFILE,"workflow.41.22.html") ) { return "workflow.41.22.html";}
else if (Guidewire_TopicMatch(TOPIC,"ManualStep") && Guidewire_FMSourceFileMatch(SRCFILE,"workflow.41.23.html") ) { return "workflow.41.23.html";}
else if (Guidewire_TopicMatch(TOPIC,"Outcome") && Guidewire_FMSourceFileMatch(SRCFILE,"workflow.41.24.html") ) { return "workflow.41.24.html";}
else if (Guidewire_TopicMatch(TOPIC,"Step Branches") && Guidewire_FMSourceFileMatch(SRCFILE,"workflow.41.25.html") ) { return "workflow.41.25.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working with Branch IDs") && Guidewire_FMSourceFileMatch(SRCFILE,"workflow.41.26.html") ) { return "workflow.41.26.html";}
else if (Guidewire_TopicMatch(TOPIC,"GO") && Guidewire_FMSourceFileMatch(SRCFILE,"workflow.41.27.html") ) { return "workflow.41.27.html";}
else if (Guidewire_TopicMatch(TOPIC,"TRIGGER") && Guidewire_FMSourceFileMatch(SRCFILE,"workflow.41.28.html") ) { return "workflow.41.28.html";}
else if (Guidewire_TopicMatch(TOPIC,"TIMEOUT") && Guidewire_FMSourceFileMatch(SRCFILE,"workflow.41.29.html") ) { return "workflow.41.29.html";}
else if (Guidewire_TopicMatch(TOPIC,"Creating New Workflows") && Guidewire_FMSourceFileMatch(SRCFILE,"workflow.41.30.html") ) { return "workflow.41.30.html";}
else if (Guidewire_TopicMatch(TOPIC,"Extending a Workflow: A Simple Example") && Guidewire_FMSourceFileMatch(SRCFILE,"workflow.41.31.html") ) { return "workflow.41.31.html";}
else if (Guidewire_TopicMatch(TOPIC,"Instantiating a Workflow") && Guidewire_FMSourceFileMatch(SRCFILE,"workflow.41.32.html") ) { return "workflow.41.32.html";}
else if (Guidewire_TopicMatch(TOPIC,"The Workflow Engine") && Guidewire_FMSourceFileMatch(SRCFILE,"workflow.41.33.html") ) { return "workflow.41.33.html";}
else if (Guidewire_TopicMatch(TOPIC,"Synchronicity, Transactions, and Errors") && Guidewire_FMSourceFileMatch(SRCFILE,"workflow.41.34.html") ) { return "workflow.41.34.html";}
else if (Guidewire_TopicMatch(TOPIC,"Workflow Subflows") && Guidewire_FMSourceFileMatch(SRCFILE,"workflow.41.35.html") ) { return "workflow.41.35.html";}
else if (Guidewire_TopicMatch(TOPIC,"Workflow Administration") && Guidewire_FMSourceFileMatch(SRCFILE,"workflow.41.36.html") ) { return "workflow.41.36.html";}
else if (Guidewire_TopicMatch(TOPIC,"Workflow Debugging and Logging") && Guidewire_FMSourceFileMatch(SRCFILE,"workflow.41.37.html") ) { return "workflow.41.37.html";}
else if (Guidewire_TopicMatch(TOPIC,"Defining Activity Patterns") && Guidewire_FMSourceFileMatch(SRCFILE,"activity-patterns.42.1.html") ) { return "activity-patterns.42.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"What is an Activity Pattern") && Guidewire_FMSourceFileMatch(SRCFILE,"activity-patterns.42.2.html") ) { return "activity-patterns.42.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Pattern Types and Categories") && Guidewire_FMSourceFileMatch(SRCFILE,"activity-patterns.42.3.html") ) { return "activity-patterns.42.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using Activity Patterns in Gosu") && Guidewire_FMSourceFileMatch(SRCFILE,"activity-patterns.42.4.html") ) { return "activity-patterns.42.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Calculating Activity Due Dates") && Guidewire_FMSourceFileMatch(SRCFILE,"activity-patterns.42.5.html") ) { return "activity-patterns.42.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Defining the Business Calendar") && Guidewire_FMSourceFileMatch(SRCFILE,"activity-patterns.42.6.html") ) { return "activity-patterns.42.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring Activity Patterns") && Guidewire_FMSourceFileMatch(SRCFILE,"activity-patterns.42.7.html") ) { return "activity-patterns.42.7.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using Activity Patterns with Documents and Emails") && Guidewire_FMSourceFileMatch(SRCFILE,"activity-patterns.42.8.html") ) { return "activity-patterns.42.8.html";}
else if (Guidewire_TopicMatch(TOPIC,"Localizing Activity Patterns") && Guidewire_FMSourceFileMatch(SRCFILE,"activity-patterns.42.9.html") ) { return "activity-patterns.42.9.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring Localization") && Guidewire_FMSourceFileMatch(SRCFILE,"p-localization.html") ) { return "p-localization.html";}
else if (Guidewire_TopicMatch(TOPIC,"Localizing Guidewire ClaimCenter") && Guidewire_FMSourceFileMatch(SRCFILE,"localization.44.1.html") ) { return "localization.44.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Understanding Language and Locales") && Guidewire_FMSourceFileMatch(SRCFILE,"localization.44.2.html") ) { return "localization.44.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working with Localization Configuration Files") && Guidewire_FMSourceFileMatch(SRCFILE,"localization.44.3.html") ) { return "localization.44.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working with Locales") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_add.45.1.html") ) { return "localization_add.45.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Locale Configuration Files") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_add.45.2.html") ) { return "localization_add.45.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Adding a New Locale") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_add.45.3.html") ) { return "localization_add.45.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Step 1: Add the Locale to the Localization File") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_add.45.4.html") ) { return "localization_add.45.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Step 2: Add the Locale to the Language Type Typelist") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_add.45.5.html") ) { return "localization_add.45.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Step 3: Add the Locale to the Collations File") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_add.45.6.html") ) { return "localization_add.45.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Step 4: Create and Populate the New Locale Folder") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_add.45.7.html") ) { return "localization_add.45.7.html";}
else if (Guidewire_TopicMatch(TOPIC,"Localizing the ClaimCenter Interface") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_ui.46.1.html") ) { return "localization_ui.46.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Setting the Default Application Locale") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_ui.46.2.html") ) { return "localization_ui.46.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Setting the User Locale") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_ui.46.3.html") ) { return "localization_ui.46.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring Zone Information") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_ui.46.4.html") ) { return "localization_ui.46.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Setting the IME Mode for Field Inputs") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_ui.46.5.html") ) { return "localization_ui.46.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Printing in Non-US Character Sets") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_ui.46.6.html") ) { return "localization_ui.46.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Localizing String Labels") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_strings.47.1.html") ) { return "localization_strings.47.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Localizing Display Keys") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_strings.47.2.html") ) { return "localization_strings.47.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Display Key Localization Files") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_strings.47.3.html") ) { return "localization_strings.47.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working with Missing Display Keys") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_strings.47.4.html") ) { return "localization_strings.47.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Different Ways to Localize Display Keys") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_strings.47.5.html") ) { return "localization_strings.47.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Localizing Typecodes") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_strings.47.6.html") ) { return "localization_strings.47.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Accessing Localized Typekeys from Gosu") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_strings.47.7.html") ) { return "localization_strings.47.7.html";}
else if (Guidewire_TopicMatch(TOPIC,"Exporting and Importing Localization Files") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_strings.47.8.html") ) { return "localization_strings.47.8.html";}
else if (Guidewire_TopicMatch(TOPIC,"Localizing the Development Environment") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_studio.48.1.html") ) { return "localization_studio.48.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Viewing Double-byte Characters in Studio") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_studio.48.2.html") ) { return "localization_studio.48.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Changing the Studio Locale") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_studio.48.3.html") ) { return "localization_studio.48.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Localizing Rule Set Names and Descriptions") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_studio.48.4.html") ) { return "localization_studio.48.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Setting a Locale for a Gosu Code Block") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_studio.48.5.html") ) { return "localization_studio.48.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Localizing Gosu Error Messages") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_studio.48.6.html") ) { return "localization_studio.48.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Localizing Administration Tool Argument Descriptions") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_studio.48.7.html") ) { return "localization_studio.48.7.html";}
else if (Guidewire_TopicMatch(TOPIC,"Localizing Logging Messages") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_studio.48.8.html") ) { return "localization_studio.48.8.html";}
else if (Guidewire_TopicMatch(TOPIC,"Localizing Guidewire Workflow") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_workflow.49.1.html") ) { return "localization_workflow.49.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Localize a Workflow") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_workflow.49.2.html") ) { return "localization_workflow.49.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Localizing Gosu Code in a Workflow Step") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_workflow.49.3.html") ) { return "localization_workflow.49.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Localizing Shared Administration Data") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_db_column.50.1.html") ) { return "localization_db_column.50.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Shared Administration Data") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_db_column.50.2.html") ) { return "localization_db_column.50.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Localized Entities") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_db_column.50.3.html") ) { return "localization_db_column.50.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Localization Database Tables") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_db_column.50.4.html") ) { return "localization_db_column.50.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Localized PCF Files") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_db_column.50.5.html") ) { return "localization_db_column.50.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Localizing Field Validators") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_fieldvalidation.51.1.html") ) { return "localization_fieldvalidation.51.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Localizing Field Validation") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_fieldvalidation.51.2.html") ) { return "localization_fieldvalidation.51.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring Localized Error Messages for Field Validators") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_fieldvalidation.51.3.html") ) { return "localization_fieldvalidation.51.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Validating Country-Specific Entity Fields") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_fieldvalidation.51.4.html") ) { return "localization_fieldvalidation.51.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Localizing Templates") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_templates.52.1.html") ) { return "localization_templates.52.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Understanding Templates: A Review") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_templates.52.2.html") ) { return "localization_templates.52.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Creating Localized Documents, Emails, and Notes") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_templates.52.3.html") ) { return "localization_templates.52.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Step 1: Create Locale-Specific Folders") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_templates.52.4.html") ) { return "localization_templates.52.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Step 2: Localize Template Descriptor Files") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_templates.52.5.html") ) { return "localization_templates.52.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Step 3: Localize Template Files") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_templates.52.6.html") ) { return "localization_templates.52.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Step 4: Localize Documents, Emails, and Notes within ClaimCenter") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_templates.52.7.html") ) { return "localization_templates.52.7.html";}
else if (Guidewire_TopicMatch(TOPIC,"Document Localization Support") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_templates.52.8.html") ) { return "localization_templates.52.8.html";}
else if (Guidewire_TopicMatch(TOPIC,"Localized Search and Sort") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_sorting.53.1.html") ) { return "localization_sorting.53.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Searching and Sorting Character Data") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_sorting.53.2.html") ) { return "localization_sorting.53.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"How Guidewire Stores Data") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_sorting.53.3.html") ) { return "localization_sorting.53.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working with the Default Application Locale") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_sorting.53.4.html") ) { return "localization_sorting.53.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring a Locale") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_sorting.53.5.html") ) { return "localization_sorting.53.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Database Searching") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_sorting.53.6.html") ) { return "localization_sorting.53.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Searching and the Oracle Database") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_sorting.53.7.html") ) { return "localization_sorting.53.7.html";}
else if (Guidewire_TopicMatch(TOPIC,"Searching and the SQL Server Database") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_sorting.53.8.html") ) { return "localization_sorting.53.8.html";}
else if (Guidewire_TopicMatch(TOPIC,"Data Sorting") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_sorting.53.9.html") ) { return "localization_sorting.53.9.html";}
else if (Guidewire_TopicMatch(TOPIC,"Localizing Addresses") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_addresses.54.1.html") ) { return "localization_addresses.54.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Address Localization Overview") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_addresses.54.2.html") ) { return "localization_addresses.54.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"The AddressOwner and CCAddressOwner Interfaces") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_addresses.54.3.html") ) { return "localization_addresses.54.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"The CCAddressOwnerFieldId and CountryAddressFields Classes") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_addresses.54.4.html") ) { return "localization_addresses.54.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"PCF Address Configuration") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_addresses.54.5.html") ) { return "localization_addresses.54.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working with the Japanese Imperial Calendar") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_JIC.55.1.html") ) { return "localization_JIC.55.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"The Japanese Imperial Calendar Date Widget") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_JIC.55.2.html") ) { return "localization_JIC.55.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring Japanese Dates") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_JIC.55.3.html") ) { return "localization_JIC.55.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Setting the Japanese Imperial Calendar as the Default for a Locale") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_JIC.55.4.html") ) { return "localization_JIC.55.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working with the Japanese Imperial Date Data Type") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_JIC.55.5.html") ) { return "localization_JIC.55.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Setting a Field to Always Display the Japanese Imperial Calendar") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_JIC.55.6.html") ) { return "localization_JIC.55.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Setting a Field to Conditionally Display the Japanese Imperial Calendar") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_JIC.55.7.html") ) { return "localization_JIC.55.7.html";}
else if (Guidewire_TopicMatch(TOPIC,"Sample JIC Presentation Handler") && Guidewire_FMSourceFileMatch(SRCFILE,"localization_JIC.55.8.html") ) { return "localization_JIC.55.8.html";}
else if (Guidewire_TopicMatch(TOPIC,"Testing Gosu Code") && Guidewire_FMSourceFileMatch(SRCFILE,"p-testing.html") ) { return "p-testing.html";}
else if (Guidewire_TopicMatch(TOPIC,"Debugging and Testing Your Gosu Code") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_debugging.57.01.html") ) { return "studio_debugging.57.01.html";}
else if (Guidewire_TopicMatch(TOPIC,"The Studio Debugger") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_debugging.57.02.html") ) { return "studio_debugging.57.02.html";}
else if (Guidewire_TopicMatch(TOPIC,"Starting the Debugger") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_debugging.57.03.html") ) { return "studio_debugging.57.03.html";}
else if (Guidewire_TopicMatch(TOPIC,"Setting Breakpoints") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_debugging.57.04.html") ) { return "studio_debugging.57.04.html";}
else if (Guidewire_TopicMatch(TOPIC,"Stepping Through Code") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_debugging.57.05.html") ) { return "studio_debugging.57.05.html";}
else if (Guidewire_TopicMatch(TOPIC,"Viewing Current Values") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_debugging.57.06.html") ) { return "studio_debugging.57.06.html";}
else if (Guidewire_TopicMatch(TOPIC,"Resuming Execution") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_debugging.57.07.html") ) { return "studio_debugging.57.07.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using the Debugger with the GUnit Tester") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_debugging.57.08.html") ) { return "studio_debugging.57.08.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using the Gosu Tester") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_debugging.57.09.html") ) { return "studio_debugging.57.09.html";}
else if (Guidewire_TopicMatch(TOPIC,"Suggestions for Testing Rules") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_debugging.57.10.html") ) { return "studio_debugging.57.10.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using GUnit") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_GUnit_tester.58.01.html") ) { return "studio_GUnit_tester.58.01.html";}
else if (Guidewire_TopicMatch(TOPIC,"The TestBase Class") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_GUnit_tester.58.02.html") ) { return "studio_GUnit_tester.58.02.html";}
else if (Guidewire_TopicMatch(TOPIC,"Overriding TestBase Methods") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_GUnit_tester.58.03.html") ) { return "studio_GUnit_tester.58.03.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring the Server Environment") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_GUnit_tester.58.04.html") ) { return "studio_GUnit_tester.58.04.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring the Test Environment") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_GUnit_tester.58.05.html") ) { return "studio_GUnit_tester.58.05.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuration Parameters") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_GUnit_tester.58.06.html") ) { return "studio_GUnit_tester.58.06.html";}
else if (Guidewire_TopicMatch(TOPIC,"Creating a GUnit Test Class") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_GUnit_tester.58.07.html") ) { return "studio_GUnit_tester.58.07.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using Entity Builders to Create Test Data") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_GUnit_tester.58.08.html") ) { return "studio_GUnit_tester.58.08.html";}
else if (Guidewire_TopicMatch(TOPIC,"Creating an Entity Builder") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_GUnit_tester.58.09.html") ) { return "studio_GUnit_tester.58.09.html";}
else if (Guidewire_TopicMatch(TOPIC,"Entity Builder Examples") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_GUnit_tester.58.10.html") ) { return "studio_GUnit_tester.58.10.html";}
else if (Guidewire_TopicMatch(TOPIC,"Creating New Builders") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_GUnit_tester.58.11.html") ) { return "studio_GUnit_tester.58.11.html";}
else if (Guidewire_TopicMatch(TOPIC,"Running Gosu API Tests") && Guidewire_FMSourceFileMatch(SRCFILE,"studio_GUnit_tester.58.12.html") ) { return "studio_GUnit_tester.58.12.html";}
else if (Guidewire_TopicMatch(TOPIC,"Guidewire ClaimCenter Configuration") && Guidewire_FMSourceFileMatch(SRCFILE,"p-ClaimCenter.html") ) { return "p-ClaimCenter.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using the Lines of Business Editor") && Guidewire_FMSourceFileMatch(SRCFILE,"LOB_editor.60.1.html") ) { return "LOB_editor.60.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Lines of Business in Guidewire ClaimCenter") && Guidewire_FMSourceFileMatch(SRCFILE,"LOB_editor.60.2.html") ) { return "LOB_editor.60.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"The Studio Lines of Business Editor") && Guidewire_FMSourceFileMatch(SRCFILE,"LOB_editor.60.3.html") ) { return "LOB_editor.60.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Managing References to the LOB Typelists") && Guidewire_FMSourceFileMatch(SRCFILE,"LOB_editor.60.4.html") ) { return "LOB_editor.60.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring Policy Behavior") && Guidewire_FMSourceFileMatch(SRCFILE,"policy-behavior.61.1.html") ) { return "policy-behavior.61.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Managing Aggregate Limits") && Guidewire_FMSourceFileMatch(SRCFILE,"policy-behavior.61.2.html") ) { return "policy-behavior.61.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Specifying the Subtabs on a Policy") && Guidewire_FMSourceFileMatch(SRCFILE,"policy-behavior.61.3.html") ) { return "policy-behavior.61.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Defining Internal (ClaimCenter-only) Policy Fields") && Guidewire_FMSourceFileMatch(SRCFILE,"policy-behavior.61.4.html") ) { return "policy-behavior.61.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring Financials") && Guidewire_FMSourceFileMatch(SRCFILE,"financials.62.1.html") ) { return "financials.62.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Understanding Financials") && Guidewire_FMSourceFileMatch(SRCFILE,"financials.62.2.html") ) { return "financials.62.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Financial Summary Screen Configuration") && Guidewire_FMSourceFileMatch(SRCFILE,"financials.62.3.html") ) { return "financials.62.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring Reserve Behavior") && Guidewire_FMSourceFileMatch(SRCFILE,"financials.62.4.html") ) { return "financials.62.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Checks and Payments Configuration") && Guidewire_FMSourceFileMatch(SRCFILE,"financials.62.5.html") ) { return "financials.62.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Bulk Invoice Payment Configuration") && Guidewire_FMSourceFileMatch(SRCFILE,"financials.62.6.html") ) { return "financials.62.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring Currency") && Guidewire_FMSourceFileMatch(SRCFILE,"currency.63.1.html") ) { return "currency.63.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Setting the Default Application Currency") && Guidewire_FMSourceFileMatch(SRCFILE,"currency.63.2.html") ) { return "currency.63.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Setting a Currency Mode") && Guidewire_FMSourceFileMatch(SRCFILE,"currency.63.3.html") ) { return "currency.63.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working with Currency Typecodes") && Guidewire_FMSourceFileMatch(SRCFILE,"currency.63.4.html") ) { return "currency.63.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Implementing a Single Currency Configuration") && Guidewire_FMSourceFileMatch(SRCFILE,"currency.63.5.html") ) { return "currency.63.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Implementing a Multicurrency Configuration") && Guidewire_FMSourceFileMatch(SRCFILE,"currency.63.6.html") ) { return "currency.63.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Changing the Default Application Currency") && Guidewire_FMSourceFileMatch(SRCFILE,"currency.63.7.html") ) { return "currency.63.7.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring Snapshot Views") && Guidewire_FMSourceFileMatch(SRCFILE,"snapshot.64.1.html") ) { return "snapshot.64.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"How ClaimCenter Renders Claim Snapshots") && Guidewire_FMSourceFileMatch(SRCFILE,"snapshot.64.2.html") ) { return "snapshot.64.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Encrypting Claim Snapshot Fields") && Guidewire_FMSourceFileMatch(SRCFILE,"snapshot.64.3.html") ) { return "snapshot.64.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring Snapshot Templates") && Guidewire_FMSourceFileMatch(SRCFILE,"snapshot.64.4.html") ) { return "snapshot.64.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring Deductibles") && Guidewire_FMSourceFileMatch(SRCFILE,"config_deductibles.65.1.html") ) { return "config_deductibles.65.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Deductible Data Model") && Guidewire_FMSourceFileMatch(SRCFILE,"config_deductibles.65.2.html") ) { return "config_deductibles.65.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Typekeys") && Guidewire_FMSourceFileMatch(SRCFILE,"config_deductibles.65.3.html") ) { return "config_deductibles.65.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Permissions") && Guidewire_FMSourceFileMatch(SRCFILE,"config_deductibles.65.4.html") ) { return "config_deductibles.65.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Deductibles and Checks") && Guidewire_FMSourceFileMatch(SRCFILE,"config_deductibles.65.5.html") ) { return "config_deductibles.65.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Deductibles and Rules") && Guidewire_FMSourceFileMatch(SRCFILE,"config_deductibles.65.6.html") ) { return "config_deductibles.65.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working with Catastrophe Bulk Associations") && Guidewire_FMSourceFileMatch(SRCFILE,"config_catastrophe.66.1.html") ) { return "config_catastrophe.66.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Catastrophe Bulk Association Configuration") && Guidewire_FMSourceFileMatch(SRCFILE,"config_catastrophe.66.2.html") ) { return "config_catastrophe.66.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Catastrophes Data Model") && Guidewire_FMSourceFileMatch(SRCFILE,"config_catastrophe.66.3.html") ) { return "config_catastrophe.66.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Catastrophe Configuration Parameter") && Guidewire_FMSourceFileMatch(SRCFILE,"config_catastrophe.66.4.html") ) { return "config_catastrophe.66.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring Duplicate Claim and Check Searches") && Guidewire_FMSourceFileMatch(SRCFILE,"config_dupe_claim_search.67.1.html") ) { return "config_dupe_claim_search.67.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Understanding the Gosu Templates") && Guidewire_FMSourceFileMatch(SRCFILE,"config_dupe_claim_search.67.2.html") ) { return "config_dupe_claim_search.67.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Duplicate Claim Search") && Guidewire_FMSourceFileMatch(SRCFILE,"config_dupe_claim_search.67.3.html") ) { return "config_dupe_claim_search.67.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Duplicate Check Search") && Guidewire_FMSourceFileMatch(SRCFILE,"config_dupe_claim_search.67.4.html") ) { return "config_dupe_claim_search.67.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring Claim Health Metrics") && Guidewire_FMSourceFileMatch(SRCFILE,"config_metrics.68.1.html") ) { return "config_metrics.68.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Adding a New Tier") && Guidewire_FMSourceFileMatch(SRCFILE,"config_metrics.68.2.html") ) { return "config_metrics.68.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Adding a High-Risk Indicator") && Guidewire_FMSourceFileMatch(SRCFILE,"config_metrics.68.3.html") ) { return "config_metrics.68.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Adding a New Claim Metric") && Guidewire_FMSourceFileMatch(SRCFILE,"config_metrics.68.4.html") ) { return "config_metrics.68.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring Recently Viewed Claims") && Guidewire_FMSourceFileMatch(SRCFILE,"config_recently_viewed_claims.69.1.html") ) { return "config_recently_viewed_claims.69.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Adding a Loss Date to the Recently Viewed Claim List") && Guidewire_FMSourceFileMatch(SRCFILE,"config_recently_viewed_claims.69.2.html") ) { return "config_recently_viewed_claims.69.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring Incidents") && Guidewire_FMSourceFileMatch(SRCFILE,"config_incidents.70.1.html") ) { return "config_incidents.70.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Incidents Data Model") && Guidewire_FMSourceFileMatch(SRCFILE,"config_incidents.70.2.html") ) { return "config_incidents.70.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Archiving Claims") && Guidewire_FMSourceFileMatch(SRCFILE,"archiving.71.01.html") ) { return "archiving.71.01.html";}
else if (Guidewire_TopicMatch(TOPIC,"Archive-related Documentation") && Guidewire_FMSourceFileMatch(SRCFILE,"archiving.71.02.html") ) { return "archiving.71.02.html";}
else if (Guidewire_TopicMatch(TOPIC,"Archiving and the Domain Graph") && Guidewire_FMSourceFileMatch(SRCFILE,"archiving.71.03.html") ) { return "archiving.71.03.html";}
else if (Guidewire_TopicMatch(TOPIC,"Claims Archiving in Guidewire ClaimCenter") && Guidewire_FMSourceFileMatch(SRCFILE,"archiving.71.04.html") ) { return "archiving.71.04.html";}
else if (Guidewire_TopicMatch(TOPIC,"Archiving and Encryption") && Guidewire_FMSourceFileMatch(SRCFILE,"archiving.71.05.html") ) { return "archiving.71.05.html";}
else if (Guidewire_TopicMatch(TOPIC,"Selecting Claims for Archive Eligibility") && Guidewire_FMSourceFileMatch(SRCFILE,"archiving.71.06.html") ) { return "archiving.71.06.html";}
else if (Guidewire_TopicMatch(TOPIC,"Restoring Claims from the Command Line") && Guidewire_FMSourceFileMatch(SRCFILE,"archiving.71.07.html") ) { return "archiving.71.07.html";}
else if (Guidewire_TopicMatch(TOPIC,"Monitoring Claim Archiving Activity") && Guidewire_FMSourceFileMatch(SRCFILE,"archiving.71.08.html") ) { return "archiving.71.08.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring Claims Archiving") && Guidewire_FMSourceFileMatch(SRCFILE,"archiving.71.09.html") ) { return "archiving.71.09.html";}
else if (Guidewire_TopicMatch(TOPIC,"Archiving-related Configuration Parameters") && Guidewire_FMSourceFileMatch(SRCFILE,"archiving.71.10.html") ) { return "archiving.71.10.html";}
else if (Guidewire_TopicMatch(TOPIC,"Archive Rules") && Guidewire_FMSourceFileMatch(SRCFILE,"archiving.71.11.html") ) { return "archiving.71.11.html";}
else if (Guidewire_TopicMatch(TOPIC,"Archive Events") && Guidewire_FMSourceFileMatch(SRCFILE,"archiving.71.12.html") ) { return "archiving.71.12.html";}
else if (Guidewire_TopicMatch(TOPIC,"Archive Work Queue") && Guidewire_FMSourceFileMatch(SRCFILE,"archiving.71.13.html") ) { return "archiving.71.13.html";}
else if (Guidewire_TopicMatch(TOPIC,"The Archive Plugin") && Guidewire_FMSourceFileMatch(SRCFILE,"archiving.71.14.html") ) { return "archiving.71.14.html";}
else { return("../wwhelp/topic_cannot_be_found.html"); } }

function  WWHBookData_MatchTopic(P)
{
var C=null;P=decodeURIComponent(decodeURIComponent(escape(P)));//workaround epub bug with UTF8 processing!
if(P=="Field_Validator_Extensions")C="fieldvalidators.27.1.html";
if (C) { return C } else { return GUIDEWIRE_TOPIC_TO_FILE(P,Guidewire_ExtractSrcFromURL());}
}
