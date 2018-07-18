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

else if (Guidewire_TopicMatch(TOPIC,"ClaimCenter Integration Guide") && Guidewire_FMSourceFileMatch(SRCFILE,"cover-integration.html") ) { return "cover-integration.html";}
else if (Guidewire_TopicMatch(TOPIC,"About This Document") && Guidewire_FMSourceFileMatch(SRCFILE,"about.html") ) { return "about.html";}
else if (Guidewire_TopicMatch(TOPIC,"Integration Overview") && Guidewire_FMSourceFileMatch(SRCFILE,"overview.03.1.html") ) { return "overview.03.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Overview of Integration Methods") && Guidewire_FMSourceFileMatch(SRCFILE,"overview.03.2.html") ) { return "overview.03.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Preparing for Integration Development") && Guidewire_FMSourceFileMatch(SRCFILE,"overview.03.3.html") ) { return "overview.03.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Integration Documentation Overview") && Guidewire_FMSourceFileMatch(SRCFILE,"overview.03.4.html") ) { return "overview.03.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Required Generated Files for Integration") && Guidewire_FMSourceFileMatch(SRCFILE,"overview.03.5.html") ) { return "overview.03.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Web Services (SOAP)") && Guidewire_FMSourceFileMatch(SRCFILE,"webservices.04.01.html") ) { return "webservices.04.01.html";}
else if (Guidewire_TopicMatch(TOPIC,"Web Service and SOAP Entity Overview") && Guidewire_FMSourceFileMatch(SRCFILE,"webservices.04.02.html") ) { return "webservices.04.02.html";}
else if (Guidewire_TopicMatch(TOPIC,"Publishing a Web Service") && Guidewire_FMSourceFileMatch(SRCFILE,"webservices.04.03.html") ) { return "webservices.04.03.html";}
else if (Guidewire_TopicMatch(TOPIC,"Writing Web Services that Use Entities") && Guidewire_FMSourceFileMatch(SRCFILE,"webservices.04.04.html") ) { return "webservices.04.04.html";}
else if (Guidewire_TopicMatch(TOPIC,"Testing Your Web Service") && Guidewire_FMSourceFileMatch(SRCFILE,"webservices.04.05.html") ) { return "webservices.04.05.html";}
else if (Guidewire_TopicMatch(TOPIC,"Calling Your Web Service from Java") && Guidewire_FMSourceFileMatch(SRCFILE,"webservices.04.06.html") ) { return "webservices.04.06.html";}
else if (Guidewire_TopicMatch(TOPIC,"Calling Your Web Service from Microsoft .NET (WSE 3.0)") && Guidewire_FMSourceFileMatch(SRCFILE,"webservices.04.07.html") ) { return "webservices.04.07.html";}
else if (Guidewire_TopicMatch(TOPIC,"Calling Your Web Service from Microsoft .NET (WSE 2.0)") && Guidewire_FMSourceFileMatch(SRCFILE,"webservices.04.08.html") ) { return "webservices.04.08.html";}
else if (Guidewire_TopicMatch(TOPIC,"SOAP From Other Languages, Including Java 1.4  Non-.NET") && Guidewire_FMSourceFileMatch(SRCFILE,"webservices.04.09.html") ) { return "webservices.04.09.html";}
else if (Guidewire_TopicMatch(TOPIC,"New Entity Syntax Depends on Context") && Guidewire_FMSourceFileMatch(SRCFILE,"webservices.04.10.html") ) { return "webservices.04.10.html";}
else if (Guidewire_TopicMatch(TOPIC,"Typecodes and Web Services") && Guidewire_FMSourceFileMatch(SRCFILE,"webservices.04.11.html") ) { return "webservices.04.11.html";}
else if (Guidewire_TopicMatch(TOPIC,"Public IDs and Integration Code") && Guidewire_FMSourceFileMatch(SRCFILE,"webservices.04.12.html") ) { return "webservices.04.12.html";}
else if (Guidewire_TopicMatch(TOPIC,"Endpoint URLs and Generated WSDL") && Guidewire_FMSourceFileMatch(SRCFILE,"webservices.04.13.html") ) { return "webservices.04.13.html";}
else if (Guidewire_TopicMatch(TOPIC,"Web Services Using ClaimCenter Clusters") && Guidewire_FMSourceFileMatch(SRCFILE,"webservices.04.14.html") ) { return "webservices.04.14.html";}
else if (Guidewire_TopicMatch(TOPIC,"SOAP Faults (Exceptions)") && Guidewire_FMSourceFileMatch(SRCFILE,"webservices.04.15.html") ) { return "webservices.04.15.html";}
else if (Guidewire_TopicMatch(TOPIC,"Writing Command Line Tools to Call Web Services") && Guidewire_FMSourceFileMatch(SRCFILE,"webservices.04.16.html") ) { return "webservices.04.16.html";}
else if (Guidewire_TopicMatch(TOPIC,"Built-in Web Services") && Guidewire_FMSourceFileMatch(SRCFILE,"webservices.04.17.html") ) { return "webservices.04.17.html";}
else if (Guidewire_TopicMatch(TOPIC,"Calling Web Services from Gosu") && Guidewire_FMSourceFileMatch(SRCFILE,"webservice-consuming.html") ) { return "webservice-consuming.html";}
else if (Guidewire_TopicMatch(TOPIC,"General Web Services") && Guidewire_FMSourceFileMatch(SRCFILE,"webservices-general.06.1.html") ) { return "webservices-general.06.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Mapping Typecodes to External System Codes") && Guidewire_FMSourceFileMatch(SRCFILE,"webservices-general.06.2.html") ) { return "webservices-general.06.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Importing Administrative Data") && Guidewire_FMSourceFileMatch(SRCFILE,"webservices-general.06.3.html") ) { return "webservices-general.06.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Maintenance Web Services") && Guidewire_FMSourceFileMatch(SRCFILE,"webservices-general.06.4.html") ) { return "webservices-general.06.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"System Tools Web Services") && Guidewire_FMSourceFileMatch(SRCFILE,"webservices-general.06.5.html") ) { return "webservices-general.06.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"User and Group Web Services") && Guidewire_FMSourceFileMatch(SRCFILE,"webservices-general.06.6.html") ) { return "webservices-general.06.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Workflow Web Services") && Guidewire_FMSourceFileMatch(SRCFILE,"webservices-general.06.7.html") ) { return "webservices-general.06.7.html";}
else if (Guidewire_TopicMatch(TOPIC,"Profiling Web Services") && Guidewire_FMSourceFileMatch(SRCFILE,"webservices-general.06.8.html") ) { return "webservices-general.06.8.html";}
else if (Guidewire_TopicMatch(TOPIC,"Claim-related Web Services") && Guidewire_FMSourceFileMatch(SRCFILE,"webservices-claim.07.1.html") ) { return "webservices-claim.07.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Claim APIs") && Guidewire_FMSourceFileMatch(SRCFILE,"webservices-claim.07.2.html") ) { return "webservices-claim.07.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Adding First Notice of Loss") && Guidewire_FMSourceFileMatch(SRCFILE,"webservices-claim.07.3.html") ) { return "webservices-claim.07.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Migrating a Claim") && Guidewire_FMSourceFileMatch(SRCFILE,"webservices-claim.07.4.html") ) { return "webservices-claim.07.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Importing a Claim from XML") && Guidewire_FMSourceFileMatch(SRCFILE,"webservices-claim.07.5.html") ) { return "webservices-claim.07.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Archiving and Restoring Claims") && Guidewire_FMSourceFileMatch(SRCFILE,"webservices-claim.07.6.html") ) { return "webservices-claim.07.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Activity APIs") && Guidewire_FMSourceFileMatch(SRCFILE,"webservices-claim.07.7.html") ) { return "webservices-claim.07.7.html";}
else if (Guidewire_TopicMatch(TOPIC,"Exposure APIs") && Guidewire_FMSourceFileMatch(SRCFILE,"webservices-claim.07.8.html") ) { return "webservices-claim.07.8.html";}
else if (Guidewire_TopicMatch(TOPIC,"Servlets") && Guidewire_FMSourceFileMatch(SRCFILE,"servlets.html") ) { return "servlets.html";}
else if (Guidewire_TopicMatch(TOPIC,"Plugin Overview") && Guidewire_FMSourceFileMatch(SRCFILE,"plugins.09.01.html") ) { return "plugins.09.01.html";}
else if (Guidewire_TopicMatch(TOPIC,"Overview of ClaimCenter Plugins") && Guidewire_FMSourceFileMatch(SRCFILE,"plugins.09.02.html") ) { return "plugins.09.02.html";}
else if (Guidewire_TopicMatch(TOPIC,"Summary of All ClaimCenter Plugins") && Guidewire_FMSourceFileMatch(SRCFILE,"plugins.09.03.html") ) { return "plugins.09.03.html";}
else if (Guidewire_TopicMatch(TOPIC,"Plugin Implementation Overview") && Guidewire_FMSourceFileMatch(SRCFILE,"plugins.09.04.html") ) { return "plugins.09.04.html";}
else if (Guidewire_TopicMatch(TOPIC,"Deploying Gosu Plugins") && Guidewire_FMSourceFileMatch(SRCFILE,"plugins.09.05.html") ) { return "plugins.09.05.html";}
else if (Guidewire_TopicMatch(TOPIC,"Deploying Java Plugins") && Guidewire_FMSourceFileMatch(SRCFILE,"plugins.09.06.html") ) { return "plugins.09.06.html";}
else if (Guidewire_TopicMatch(TOPIC,"Getting Plugin Parameters from the Plugins Editor") && Guidewire_FMSourceFileMatch(SRCFILE,"plugins.09.07.html") ) { return "plugins.09.07.html";}
else if (Guidewire_TopicMatch(TOPIC,"Writing Plugin Templates in Gosu") && Guidewire_FMSourceFileMatch(SRCFILE,"plugins.09.08.html") ) { return "plugins.09.08.html";}
else if (Guidewire_TopicMatch(TOPIC,"The Plugin Registry") && Guidewire_FMSourceFileMatch(SRCFILE,"plugins.09.09.html") ) { return "plugins.09.09.html";}
else if (Guidewire_TopicMatch(TOPIC,"Plugin Thread Safety and Static Variables") && Guidewire_FMSourceFileMatch(SRCFILE,"plugins.09.10.html") ) { return "plugins.09.10.html";}
else if (Guidewire_TopicMatch(TOPIC,"Reading System Properties in Plugins") && Guidewire_FMSourceFileMatch(SRCFILE,"plugins.09.11.html") ) { return "plugins.09.11.html";}
else if (Guidewire_TopicMatch(TOPIC,"Startable Plugins") && Guidewire_FMSourceFileMatch(SRCFILE,"plugins.09.12.html") ) { return "plugins.09.12.html";}
else if (Guidewire_TopicMatch(TOPIC,"Do Not Call Local SOAP APIs From Plugins") && Guidewire_FMSourceFileMatch(SRCFILE,"plugins.09.13.html") ) { return "plugins.09.13.html";}
else if (Guidewire_TopicMatch(TOPIC,"Creating Unique Numbers in a Sequence") && Guidewire_FMSourceFileMatch(SRCFILE,"plugins.09.14.html") ) { return "plugins.09.14.html";}
else if (Guidewire_TopicMatch(TOPIC,"Java Class Loading, Delegation, and Package Naming") && Guidewire_FMSourceFileMatch(SRCFILE,"plugins.09.15.html") ) { return "plugins.09.15.html";}
else if (Guidewire_TopicMatch(TOPIC,"Messaging and Events") && Guidewire_FMSourceFileMatch(SRCFILE,"eventsmessaging.10.01.html") ) { return "eventsmessaging.10.01.html";}
else if (Guidewire_TopicMatch(TOPIC,"Messaging Overview") && Guidewire_FMSourceFileMatch(SRCFILE,"eventsmessaging.10.02.html") ) { return "eventsmessaging.10.02.html";}
else if (Guidewire_TopicMatch(TOPIC,"Message Destination Overview") && Guidewire_FMSourceFileMatch(SRCFILE,"eventsmessaging.10.03.html") ) { return "eventsmessaging.10.03.html";}
else if (Guidewire_TopicMatch(TOPIC,"Filtering Events") && Guidewire_FMSourceFileMatch(SRCFILE,"eventsmessaging.10.04.html") ) { return "eventsmessaging.10.04.html";}
else if (Guidewire_TopicMatch(TOPIC,"List of Messaging Events in ClaimCenter") && Guidewire_FMSourceFileMatch(SRCFILE,"eventsmessaging.10.05.html") ) { return "eventsmessaging.10.05.html";}
else if (Guidewire_TopicMatch(TOPIC,"Generating New Messages in Event Fired Rules") && Guidewire_FMSourceFileMatch(SRCFILE,"eventsmessaging.10.06.html") ) { return "eventsmessaging.10.06.html";}
else if (Guidewire_TopicMatch(TOPIC,"Message Ordering and Multi-Threaded Sending") && Guidewire_FMSourceFileMatch(SRCFILE,"eventsmessaging.10.07.html") ) { return "eventsmessaging.10.07.html";}
else if (Guidewire_TopicMatch(TOPIC,"Late Binding Fields") && Guidewire_FMSourceFileMatch(SRCFILE,"eventsmessaging.10.08.html") ) { return "eventsmessaging.10.08.html";}
else if (Guidewire_TopicMatch(TOPIC,"Message Sending Errors") && Guidewire_FMSourceFileMatch(SRCFILE,"eventsmessaging.10.09.html") ) { return "eventsmessaging.10.09.html";}
else if (Guidewire_TopicMatch(TOPIC,"Reporting Acknowledgements and Errors") && Guidewire_FMSourceFileMatch(SRCFILE,"eventsmessaging.10.10.html") ) { return "eventsmessaging.10.10.html";}
else if (Guidewire_TopicMatch(TOPIC,"Tracking a Specific Entity With a Message") && Guidewire_FMSourceFileMatch(SRCFILE,"eventsmessaging.10.11.html") ) { return "eventsmessaging.10.11.html";}
else if (Guidewire_TopicMatch(TOPIC,"Implementing Messaging Plugins") && Guidewire_FMSourceFileMatch(SRCFILE,"eventsmessaging.10.12.html") ) { return "eventsmessaging.10.12.html";}
else if (Guidewire_TopicMatch(TOPIC,"Resyncing Messages") && Guidewire_FMSourceFileMatch(SRCFILE,"eventsmessaging.10.13.html") ) { return "eventsmessaging.10.13.html";}
else if (Guidewire_TopicMatch(TOPIC,"Message Payload Mapping Utility for Java Plugins") && Guidewire_FMSourceFileMatch(SRCFILE,"eventsmessaging.10.14.html") ) { return "eventsmessaging.10.14.html";}
else if (Guidewire_TopicMatch(TOPIC,"Monitoring Messages and Handling Errors") && Guidewire_FMSourceFileMatch(SRCFILE,"eventsmessaging.10.15.html") ) { return "eventsmessaging.10.15.html";}
else if (Guidewire_TopicMatch(TOPIC,"Batch Mode Integration") && Guidewire_FMSourceFileMatch(SRCFILE,"eventsmessaging.10.16.html") ) { return "eventsmessaging.10.16.html";}
else if (Guidewire_TopicMatch(TOPIC,"Included Messaging Transports") && Guidewire_FMSourceFileMatch(SRCFILE,"eventsmessaging.10.17.html") ) { return "eventsmessaging.10.17.html";}
else if (Guidewire_TopicMatch(TOPIC,"Financials Integration") && Guidewire_FMSourceFileMatch(SRCFILE,"financials.11.01.html") ) { return "financials.11.01.html";}
else if (Guidewire_TopicMatch(TOPIC,"Financial Transaction Status and Status Transitions") && Guidewire_FMSourceFileMatch(SRCFILE,"financials.11.02.html") ) { return "financials.11.02.html";}
else if (Guidewire_TopicMatch(TOPIC,"Claim Financials Web Services") && Guidewire_FMSourceFileMatch(SRCFILE,"financials.11.03.html") ) { return "financials.11.03.html";}
else if (Guidewire_TopicMatch(TOPIC,"Check Integration") && Guidewire_FMSourceFileMatch(SRCFILE,"financials.11.04.html") ) { return "financials.11.04.html";}
else if (Guidewire_TopicMatch(TOPIC,"Check Scheduled Send Date Only Modifiable in Special Situations") && Guidewire_FMSourceFileMatch(SRCFILE,"financials.11.05.html") ) { return "financials.11.05.html";}
else if (Guidewire_TopicMatch(TOPIC,"Payment Transaction Integration") && Guidewire_FMSourceFileMatch(SRCFILE,"financials.11.06.html") ) { return "financials.11.06.html";}
else if (Guidewire_TopicMatch(TOPIC,"Recovery Reserve Transaction Integration") && Guidewire_FMSourceFileMatch(SRCFILE,"financials.11.07.html") ) { return "financials.11.07.html";}
else if (Guidewire_TopicMatch(TOPIC,"Recovery Transaction Integration") && Guidewire_FMSourceFileMatch(SRCFILE,"financials.11.08.html") ) { return "financials.11.08.html";}
else if (Guidewire_TopicMatch(TOPIC,"Reserve Transaction Integration") && Guidewire_FMSourceFileMatch(SRCFILE,"financials.11.09.html") ) { return "financials.11.09.html";}
else if (Guidewire_TopicMatch(TOPIC,"Bulk Invoice Integration") && Guidewire_FMSourceFileMatch(SRCFILE,"financials.11.10.html") ) { return "financials.11.10.html";}
else if (Guidewire_TopicMatch(TOPIC,"Deduction Plugins") && Guidewire_FMSourceFileMatch(SRCFILE,"financials.11.11.html") ) { return "financials.11.11.html";}
else if (Guidewire_TopicMatch(TOPIC,"Initial Reserve Initialization for Exposures") && Guidewire_FMSourceFileMatch(SRCFILE,"financials.11.12.html") ) { return "financials.11.12.html";}
else if (Guidewire_TopicMatch(TOPIC,"Exchange Rate Integration") && Guidewire_FMSourceFileMatch(SRCFILE,"financials.11.13.html") ) { return "financials.11.13.html";}
else if (Guidewire_TopicMatch(TOPIC,"Authentication Integration") && Guidewire_FMSourceFileMatch(SRCFILE,"authentication.12.1.html") ) { return "authentication.12.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Overview of User Authentication Interfaces") && Guidewire_FMSourceFileMatch(SRCFILE,"authentication.12.2.html") ) { return "authentication.12.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"User Authentication Source Creator Plugin") && Guidewire_FMSourceFileMatch(SRCFILE,"authentication.12.3.html") ) { return "authentication.12.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"User Authentication Service Plugin") && Guidewire_FMSourceFileMatch(SRCFILE,"authentication.12.4.html") ) { return "authentication.12.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Deploying User Authentication Plugins") && Guidewire_FMSourceFileMatch(SRCFILE,"authentication.12.5.html") ) { return "authentication.12.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Database Authentication Plugins") && Guidewire_FMSourceFileMatch(SRCFILE,"authentication.12.6.html") ) { return "authentication.12.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"ABAuthenticationPlugin for ContactCenter Authentication") && Guidewire_FMSourceFileMatch(SRCFILE,"authentication.12.7.html") ) { return "authentication.12.7.html";}
else if (Guidewire_TopicMatch(TOPIC,"Document Management") && Guidewire_FMSourceFileMatch(SRCFILE,"documentsforms.13.1.html") ) { return "documentsforms.13.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Document Management Overview") && Guidewire_FMSourceFileMatch(SRCFILE,"documentsforms.13.2.html") ) { return "documentsforms.13.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Document Production") && Guidewire_FMSourceFileMatch(SRCFILE,"documentsforms.13.3.html") ) { return "documentsforms.13.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Document Template Descriptors") && Guidewire_FMSourceFileMatch(SRCFILE,"documentsforms.13.4.html") ) { return "documentsforms.13.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Generating Documents from Gosu") && Guidewire_FMSourceFileMatch(SRCFILE,"documentsforms.13.5.html") ) { return "documentsforms.13.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Document Storage") && Guidewire_FMSourceFileMatch(SRCFILE,"documentsforms.13.6.html") ) { return "documentsforms.13.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Rendering Arbitrary Input Stream Data Such as PDF") && Guidewire_FMSourceFileMatch(SRCFILE,"documentsforms.13.7.html") ) { return "documentsforms.13.7.html";}
else if (Guidewire_TopicMatch(TOPIC,"Data Extraction Integration") && Guidewire_FMSourceFileMatch(SRCFILE,"dataextraction.14.1.html") ) { return "dataextraction.14.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Why Templates are Useful for Data Extraction") && Guidewire_FMSourceFileMatch(SRCFILE,"dataextraction.14.2.html") ) { return "dataextraction.14.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"PCF Template Page Data Extraction Overview") && Guidewire_FMSourceFileMatch(SRCFILE,"dataextraction.14.3.html") ) { return "dataextraction.14.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Data Extraction Gosu Template Integration") && Guidewire_FMSourceFileMatch(SRCFILE,"dataextraction.14.4.html") ) { return "dataextraction.14.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Archiving Integration") && Guidewire_FMSourceFileMatch(SRCFILE,"archiving-integration.15.1.html") ) { return "archiving-integration.15.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Overview of Archiving Integration Flow") && Guidewire_FMSourceFileMatch(SRCFILE,"archiving-integration.15.2.html") ) { return "archiving-integration.15.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"The Archive Source Plugin") && Guidewire_FMSourceFileMatch(SRCFILE,"archiving-integration.15.3.html") ) { return "archiving-integration.15.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Archiving Storage Integration") && Guidewire_FMSourceFileMatch(SRCFILE,"archiving-integration.15.4.html") ) { return "archiving-integration.15.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Archive Retrieval Integration") && Guidewire_FMSourceFileMatch(SRCFILE,"archiving-integration.15.5.html") ) { return "archiving-integration.15.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Archive Plugin Utility Methods") && Guidewire_FMSourceFileMatch(SRCFILE,"archiving-integration.15.6.html") ) { return "archiving-integration.15.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Upgrading the Data Model of Restored Data") && Guidewire_FMSourceFileMatch(SRCFILE,"archiving-integration.15.7.html") ) { return "archiving-integration.15.7.html";}
else if (Guidewire_TopicMatch(TOPIC,"Logging") && Guidewire_FMSourceFileMatch(SRCFILE,"logging.16.1.html") ) { return "logging.16.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Logging Overview For Integration Developers") && Guidewire_FMSourceFileMatch(SRCFILE,"logging.16.2.html") ) { return "logging.16.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"The Logging Properties File") && Guidewire_FMSourceFileMatch(SRCFILE,"logging.16.3.html") ) { return "logging.16.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Logging APIs For Java Integration Developers") && Guidewire_FMSourceFileMatch(SRCFILE,"logging.16.4.html") ) { return "logging.16.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Address Book Integration") && Guidewire_FMSourceFileMatch(SRCFILE,"addressbook.17.1.html") ) { return "addressbook.17.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"ContactCenter Integration Overview") && Guidewire_FMSourceFileMatch(SRCFILE,"addressbook.17.2.html") ) { return "addressbook.17.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Address Book and Contact Search Plugins") && Guidewire_FMSourceFileMatch(SRCFILE,"addressbook.17.3.html") ) { return "addressbook.17.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"ContactCenter Web Services Overview") && Guidewire_FMSourceFileMatch(SRCFILE,"addressbook.17.4.html") ) { return "addressbook.17.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"ContactCenter Entities and Properties") && Guidewire_FMSourceFileMatch(SRCFILE,"addressbook.17.5.html") ) { return "addressbook.17.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"ContactCenter-specific Web Services") && Guidewire_FMSourceFileMatch(SRCFILE,"addressbook.17.6.html") ) { return "addressbook.17.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"ContactCenter Messaging Events, by Entity") && Guidewire_FMSourceFileMatch(SRCFILE,"addressbook.17.7.html") ) { return "addressbook.17.7.html";}
else if (Guidewire_TopicMatch(TOPIC,"ContactCenter Callbacks into ClaimCenter") && Guidewire_FMSourceFileMatch(SRCFILE,"addressbook.17.8.html") ) { return "addressbook.17.8.html";}
else if (Guidewire_TopicMatch(TOPIC,"Geographic Data Integration") && Guidewire_FMSourceFileMatch(SRCFILE,"geocoding.18.1.html") ) { return "geocoding.18.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Geocoding Plugin Integration") && Guidewire_FMSourceFileMatch(SRCFILE,"geocoding.18.2.html") ) { return "geocoding.18.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Steps to Deploy a Geocode Plugin Overview") && Guidewire_FMSourceFileMatch(SRCFILE,"geocoding.18.3.html") ) { return "geocoding.18.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Writing a Geocoding Plugin") && Guidewire_FMSourceFileMatch(SRCFILE,"geocoding.18.4.html") ) { return "geocoding.18.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Geocoding an Address") && Guidewire_FMSourceFileMatch(SRCFILE,"geocoding.18.5.html") ) { return "geocoding.18.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Getting Driving Directions") && Guidewire_FMSourceFileMatch(SRCFILE,"geocoding.18.6.html") ) { return "geocoding.18.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Getting a Map For an Address") && Guidewire_FMSourceFileMatch(SRCFILE,"geocoding.18.7.html") ) { return "geocoding.18.7.html";}
else if (Guidewire_TopicMatch(TOPIC,"Getting an Address from Coordinates (Reverse Geocoding)") && Guidewire_FMSourceFileMatch(SRCFILE,"geocoding.18.8.html") ) { return "geocoding.18.8.html";}
else if (Guidewire_TopicMatch(TOPIC,"Geocoding Status Codes") && Guidewire_FMSourceFileMatch(SRCFILE,"geocoding.18.9.html") ) { return "geocoding.18.9.html";}
else if (Guidewire_TopicMatch(TOPIC,"Custom Batch Processes") && Guidewire_FMSourceFileMatch(SRCFILE,"batchprocess.19.1.html") ) { return "batchprocess.19.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Custom Batch Processes and MaintenanceToolsAPI") && Guidewire_FMSourceFileMatch(SRCFILE,"batchprocess.19.2.html") ) { return "batchprocess.19.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Other Plugin Interfaces") && Guidewire_FMSourceFileMatch(SRCFILE,"plugins-other.20.1.html") ) { return "plugins-other.20.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Claim Number Generator Plugin") && Guidewire_FMSourceFileMatch(SRCFILE,"plugins-other.20.2.html") ) { return "plugins-other.20.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Defining Base URLs for Fully-Qualified Domain Names") && Guidewire_FMSourceFileMatch(SRCFILE,"plugins-other.20.3.html") ) { return "plugins-other.20.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Approval Plugin") && Guidewire_FMSourceFileMatch(SRCFILE,"plugins-other.20.4.html") ) { return "plugins-other.20.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Testing Clock Plugin (Only For Non-Production Servers)") && Guidewire_FMSourceFileMatch(SRCFILE,"plugins-other.20.5.html") ) { return "plugins-other.20.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Work Item Priority Plugin") && Guidewire_FMSourceFileMatch(SRCFILE,"plugins-other.20.6.html") ) { return "plugins-other.20.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Preupdate Handler Plugin") && Guidewire_FMSourceFileMatch(SRCFILE,"plugins-other.20.7.html") ) { return "plugins-other.20.7.html";}
else if (Guidewire_TopicMatch(TOPIC,"Insurance Services Office (ISO) Integration") && Guidewire_FMSourceFileMatch(SRCFILE,"isointegration.21.01.html") ) { return "isointegration.21.01.html";}
else if (Guidewire_TopicMatch(TOPIC,"ISO Integration Overview") && Guidewire_FMSourceFileMatch(SRCFILE,"isointegration.21.02.html") ) { return "isointegration.21.02.html";}
else if (Guidewire_TopicMatch(TOPIC,"ISO Implementation Checklist") && Guidewire_FMSourceFileMatch(SRCFILE,"isointegration.21.03.html") ) { return "isointegration.21.03.html";}
else if (Guidewire_TopicMatch(TOPIC,"ISO Network Architecture") && Guidewire_FMSourceFileMatch(SRCFILE,"isointegration.21.04.html") ) { return "isointegration.21.04.html";}
else if (Guidewire_TopicMatch(TOPIC,"ISO Activity and Decision Timeline") && Guidewire_FMSourceFileMatch(SRCFILE,"isointegration.21.05.html") ) { return "isointegration.21.05.html";}
else if (Guidewire_TopicMatch(TOPIC,"ISO Authentication and Security") && Guidewire_FMSourceFileMatch(SRCFILE,"isointegration.21.06.html") ) { return "isointegration.21.06.html";}
else if (Guidewire_TopicMatch(TOPIC,"ISO Proxy Server Setup") && Guidewire_FMSourceFileMatch(SRCFILE,"isointegration.21.07.html") ) { return "isointegration.21.07.html";}
else if (Guidewire_TopicMatch(TOPIC,"ISO Validation Level") && Guidewire_FMSourceFileMatch(SRCFILE,"isointegration.21.08.html") ) { return "isointegration.21.08.html";}
else if (Guidewire_TopicMatch(TOPIC,"ISO Messaging Destination") && Guidewire_FMSourceFileMatch(SRCFILE,"isointegration.21.09.html") ) { return "isointegration.21.09.html";}
else if (Guidewire_TopicMatch(TOPIC,"ISO Receive Servlet and the ISO Reply Plugin") && Guidewire_FMSourceFileMatch(SRCFILE,"isointegration.21.10.html") ) { return "isointegration.21.10.html";}
else if (Guidewire_TopicMatch(TOPIC,"ISO Properties on Entities") && Guidewire_FMSourceFileMatch(SRCFILE,"isointegration.21.11.html") ) { return "isointegration.21.11.html";}
else if (Guidewire_TopicMatch(TOPIC,"ISO User Interface") && Guidewire_FMSourceFileMatch(SRCFILE,"isointegration.21.12.html") ) { return "isointegration.21.12.html";}
else if (Guidewire_TopicMatch(TOPIC,"ISO Properties File") && Guidewire_FMSourceFileMatch(SRCFILE,"isointegration.21.13.html") ) { return "isointegration.21.13.html";}
else if (Guidewire_TopicMatch(TOPIC,"ISO Type Code and Coverage Mapping") && Guidewire_FMSourceFileMatch(SRCFILE,"isointegration.21.14.html") ) { return "isointegration.21.14.html";}
else if (Guidewire_TopicMatch(TOPIC,"ISO Payload XML Customization") && Guidewire_FMSourceFileMatch(SRCFILE,"isointegration.21.15.html") ) { return "isointegration.21.15.html";}
else if (Guidewire_TopicMatch(TOPIC,"ISO Match Reports") && Guidewire_FMSourceFileMatch(SRCFILE,"isointegration.21.16.html") ) { return "isointegration.21.16.html";}
else if (Guidewire_TopicMatch(TOPIC,"ISO Exposure Type Changes") && Guidewire_FMSourceFileMatch(SRCFILE,"isointegration.21.17.html") ) { return "isointegration.21.17.html";}
else if (Guidewire_TopicMatch(TOPIC,"ISO Date Search Range and Resubmitting Exposures") && Guidewire_FMSourceFileMatch(SRCFILE,"isointegration.21.18.html") ) { return "isointegration.21.18.html";}
else if (Guidewire_TopicMatch(TOPIC,"ISO Integration Troubleshooting") && Guidewire_FMSourceFileMatch(SRCFILE,"isointegration.21.19.html") ) { return "isointegration.21.19.html";}
else if (Guidewire_TopicMatch(TOPIC,"ISO Formats and Feeds") && Guidewire_FMSourceFileMatch(SRCFILE,"isointegration.21.20.html") ) { return "isointegration.21.20.html";}
else if (Guidewire_TopicMatch(TOPIC,"FNOL Mapper") && Guidewire_FMSourceFileMatch(SRCFILE,"FNOLmapper.22.1.html") ) { return "FNOLmapper.22.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"FNOL Mapper Overview") && Guidewire_FMSourceFileMatch(SRCFILE,"FNOLmapper.22.2.html") ) { return "FNOLmapper.22.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"FNOL Mapper Detailed Flow") && Guidewire_FMSourceFileMatch(SRCFILE,"FNOLmapper.22.3.html") ) { return "FNOLmapper.22.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Structure of FNOL Mapper Classes") && Guidewire_FMSourceFileMatch(SRCFILE,"FNOLmapper.22.4.html") ) { return "FNOLmapper.22.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Example FNOL Mapper Customizations") && Guidewire_FMSourceFileMatch(SRCFILE,"FNOLmapper.22.5.html") ) { return "FNOLmapper.22.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Metropolitan Reporting\u00a0Bureau Integration") && Guidewire_FMSourceFileMatch(SRCFILE,"metropolitan.23.1.html") ) { return "metropolitan.23.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Overview of ClaimCenter-Metropolitan Integration") && Guidewire_FMSourceFileMatch(SRCFILE,"metropolitan.23.2.html") ) { return "metropolitan.23.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Metropolitan Configuration") && Guidewire_FMSourceFileMatch(SRCFILE,"metropolitan.23.3.html") ) { return "metropolitan.23.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Metropolitan Report Templates and Report Types") && Guidewire_FMSourceFileMatch(SRCFILE,"metropolitan.23.4.html") ) { return "metropolitan.23.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Metropolitan Entities, Typelists, Properties, and Statuses") && Guidewire_FMSourceFileMatch(SRCFILE,"metropolitan.23.5.html") ) { return "metropolitan.23.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Metropolitan Error Handling") && Guidewire_FMSourceFileMatch(SRCFILE,"metropolitan.23.6.html") ) { return "metropolitan.23.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Encryption Integration") && Guidewire_FMSourceFileMatch(SRCFILE,"encryption.24.1.html") ) { return "encryption.24.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Encryption Integration Overview") && Guidewire_FMSourceFileMatch(SRCFILE,"encryption.24.2.html") ) { return "encryption.24.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Changing Your Encryption Algorithm Later") && Guidewire_FMSourceFileMatch(SRCFILE,"encryption.24.3.html") ) { return "encryption.24.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Encryption Changes with Archiving and Snapshots") && Guidewire_FMSourceFileMatch(SRCFILE,"encryption.24.4.html") ) { return "encryption.24.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Encrypted Properties in Staging Tables") && Guidewire_FMSourceFileMatch(SRCFILE,"encryption.24.5.html") ) { return "encryption.24.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Management Integration") && Guidewire_FMSourceFileMatch(SRCFILE,"management.25.1.html") ) { return "management.25.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Management Integration Overview") && Guidewire_FMSourceFileMatch(SRCFILE,"management.25.2.html") ) { return "management.25.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"The Abstract Management Plugin Interface") && Guidewire_FMSourceFileMatch(SRCFILE,"management.25.3.html") ) { return "management.25.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Integrating With the Included JMX Management Plugin") && Guidewire_FMSourceFileMatch(SRCFILE,"management.25.4.html") ) { return "management.25.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Proxy Servers") && Guidewire_FMSourceFileMatch(SRCFILE,"proxyservers.26.1.html") ) { return "proxyservers.26.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Proxy Server Overview") && Guidewire_FMSourceFileMatch(SRCFILE,"proxyservers.26.2.html") ) { return "proxyservers.26.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring a Proxy Server with Apache HTTP Server") && Guidewire_FMSourceFileMatch(SRCFILE,"proxyservers.26.3.html") ) { return "proxyservers.26.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Certificates, Private Keys, and Passphrase Scripts") && Guidewire_FMSourceFileMatch(SRCFILE,"proxyservers.26.4.html") ) { return "proxyservers.26.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Proxy Server Integration Types for ClaimCenter") && Guidewire_FMSourceFileMatch(SRCFILE,"proxyservers.26.5.html") ) { return "proxyservers.26.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Proxy Building Blocks") && Guidewire_FMSourceFileMatch(SRCFILE,"proxyservers.26.6.html") ) { return "proxyservers.26.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Importing from Database Staging Tables") && Guidewire_FMSourceFileMatch(SRCFILE,"databaseimport.27.1.html") ) { return "databaseimport.27.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Introduction to Database Staging Table Import") && Guidewire_FMSourceFileMatch(SRCFILE,"databaseimport.27.2.html") ) { return "databaseimport.27.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Overview of a Typical Database Import") && Guidewire_FMSourceFileMatch(SRCFILE,"databaseimport.27.3.html") ) { return "databaseimport.27.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Database Import Performance and Statistics") && Guidewire_FMSourceFileMatch(SRCFILE,"databaseimport.27.4.html") ) { return "databaseimport.27.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Table Import Tools") && Guidewire_FMSourceFileMatch(SRCFILE,"databaseimport.27.5.html") ) { return "databaseimport.27.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Populating the Staging Tables") && Guidewire_FMSourceFileMatch(SRCFILE,"databaseimport.27.6.html") ) { return "databaseimport.27.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Data Integrity Checks") && Guidewire_FMSourceFileMatch(SRCFILE,"databaseimport.27.7.html") ) { return "databaseimport.27.7.html";}
else if (Guidewire_TopicMatch(TOPIC,"Table Import Tips and Troubleshooting") && Guidewire_FMSourceFileMatch(SRCFILE,"databaseimport.27.8.html") ) { return "databaseimport.27.8.html";}
else if (Guidewire_TopicMatch(TOPIC,"Staging Table Import of Encrypted Properties") && Guidewire_FMSourceFileMatch(SRCFILE,"databaseimport.27.9.html") ) { return "databaseimport.27.9.html";}
else if (Guidewire_TopicMatch(TOPIC,"Claim and Policy Integration") && Guidewire_FMSourceFileMatch(SRCFILE,"cc-pc-integration.28.1.html") ) { return "cc-pc-integration.28.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Policy System Notifications") && Guidewire_FMSourceFileMatch(SRCFILE,"cc-pc-integration.28.2.html") ) { return "cc-pc-integration.28.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Policy Search Plugin") && Guidewire_FMSourceFileMatch(SRCFILE,"cc-pc-integration.28.3.html") ) { return "cc-pc-integration.28.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Claim Search Web Service For Policy System Integration") && Guidewire_FMSourceFileMatch(SRCFILE,"cc-pc-integration.28.4.html") ) { return "cc-pc-integration.28.4.html";}
else { return("../wwhelp/topic_cannot_be_found.html"); } }

function  WWHBookData_MatchTopic(P)
{
var C=null;P=decodeURIComponent(decodeURIComponent(escape(P)));//workaround epub bug with UTF8 processing!
if(P=="SOAP")C="webservices.04.01.html";
if(P=="SOAP_Differences_with_Java_1.4_and_Non-.NET_Languages")C="webservices.04.09.html";
if(P=="GenericCenter_Clusters_and_Web_Services")C="webservices.04.14.html";
if(P=="Conversational_and_Non-Conversational_SOAP_Modes")C="webservices.04.14.html#3541689";
if(P=="Plugin_Thread_Safety")C="plugins.09.10.html";
if(P=="What_Events_Might_Be_Generated")C="eventsmessaging.10.05.html";
if(P=="Generating_Your_Message_Payload")C="eventsmessaging.10.06.html";
if(P=="Using_Rules_to_Generating_Messages")C="eventsmessaging.10.06.html";
if(P=="Overview_of_Messages")C="eventsmessaging.10.07.html";
if(P=="Early_Binding_and_Late_Binding")C="eventsmessaging.10.08.html";
if(P=="Claim_Financials_using_Web_Services")C="financials.11.03.html";
if(P=="GScript-Initiated_Automatic_Document_Generation")C="documentsforms.13.5.html";
if(P=="Document_Storage_Plugins")C="documentsforms.13.6.html";
if(P=="Geographic_Data_Integration")C="geocoding.18.1.html";
if(P=="Geocoding,_Mapping,_and_Driving_Direction_Integration")C="geocoding.18.1.html";
if(P=="ISO_ClaimSearch_Integration_Overview")C="isointegration.21.02.html";
if(P=="ISO-related_Fields_on_Entities")C="isointegration.21.11.html";
if(P=="ISO-related_Entity_Fields")C="isointegration.21.11.html";
if(P=="ISO-related_User_Interface")C="isointegration.21.12.html";
if(P=="Configuring_the_ISO_Properties_File")C="isointegration.21.13.html";
if(P=="Configuring_the_Type_Code_Mapping_File")C="isointegration.21.14.html";
if(P=="Customizing_the_ISO_Payload_XML")C="isointegration.21.15.html";
if(P=="Configuring_Payload_Generation_in_ISO_Rules_and_Libraries")C="isointegration.21.15.html";
if(P=="How_ClaimCenter_Stores_ISO_Match_Reports")C="isointegration.21.16.html";
if(P=="Storing_Match_Report_on_Exposures_and_as_Documents")C="isointegration.21.16.html";
if(P=="ISO_and_Exposure_Subtype_Changes")C="isointegration.21.17.html";
if(P=="ISO_Integration_Tasks_for_Exposure_Subtype_Changes")C="isointegration.21.17.html";
if(P=="ISO_Search_Date_Range_and_Re-sending_to_ISO")C="isointegration.21.18.html";
if(P=="ISO_Search_Date_Range_and_Customizations")C="isointegration.21.18.html";
if(P=="Troubleshooting_ISO_Integration")C="isointegration.21.19.html";
if(P=="ISO_Format_Types_and_Feed_Types")C="isointegration.21.20.html";
if(P=="FNOL_Mapper_Tool")C="FNOLmapper.22.1.html";
if(P=="FNOL_Mapper")C="FNOLmapper.22.1.html";
if(P=="Property_Encryption_Integration")C="encryption.24.2.html";
if(P=="Property_Level_Encryption_Integration")C="encryption.24.2.html";
if(P=="Encryption_Features_for_Staging_Tables")C="encryption.24.5.html";
if (C) { return C } else { return GUIDEWIRE_TOPIC_TO_FILE(P,Guidewire_ExtractSrcFromURL());}
}
