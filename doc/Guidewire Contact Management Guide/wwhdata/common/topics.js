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

else if (Guidewire_TopicMatch(TOPIC,"Guidewire Contact Management Guide") && Guidewire_FMSourceFileMatch(SRCFILE,"cover-contact.html") ) { return "cover-contact.html";}
else if (Guidewire_TopicMatch(TOPIC,"About This Document") && Guidewire_FMSourceFileMatch(SRCFILE,"about.html") ) { return "about.html";}
else if (Guidewire_TopicMatch(TOPIC,"Key Concepts in Contact Management") && Guidewire_FMSourceFileMatch(SRCFILE,"understanding.03.1.html") ) { return "understanding.03.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Components of Contact Management") && Guidewire_FMSourceFileMatch(SRCFILE,"understanding.03.2.html") ) { return "understanding.03.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"ClaimCenter Integration with ContactCenter") && Guidewire_FMSourceFileMatch(SRCFILE,"understanding.03.3.html") ) { return "understanding.03.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Integrating ClaimCenter with ContactCenter") && Guidewire_FMSourceFileMatch(SRCFILE,"integrate.04.1.html") ) { return "integrate.04.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Integration Concepts and Prerequisites") && Guidewire_FMSourceFileMatch(SRCFILE,"integrate.04.2.html") ) { return "integrate.04.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Installing and Integrating ContactCenter with QuickStart") && Guidewire_FMSourceFileMatch(SRCFILE,"integrate.04.3.html") ) { return "integrate.04.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Installing and Integrating ContactCenter in a Development Environment") && Guidewire_FMSourceFileMatch(SRCFILE,"integrate.04.4.html") ) { return "integrate.04.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Management and Configuration Resources") && Guidewire_FMSourceFileMatch(SRCFILE,"admin.05.1.html") ) { return "admin.05.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Managing ContactCenter Information") && Guidewire_FMSourceFileMatch(SRCFILE,"admin.05.2.html") ) { return "admin.05.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring ClaimCenter Contact Management Features") && Guidewire_FMSourceFileMatch(SRCFILE,"admin.05.3.html") ) { return "admin.05.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring an Integrated ClaimCenter and ContactCenter") && Guidewire_FMSourceFileMatch(SRCFILE,"admin.05.4.html") ) { return "admin.05.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Extending the Contact Data Model") && Guidewire_FMSourceFileMatch(SRCFILE,"extending.06.1.html") ) { return "extending.06.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Understanding the Contact Data Model") && Guidewire_FMSourceFileMatch(SRCFILE,"extending.06.2.html") ) { return "extending.06.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Extending Contacts") && Guidewire_FMSourceFileMatch(SRCFILE,"extending.06.3.html") ) { return "extending.06.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working with Contact Mapping Files") && Guidewire_FMSourceFileMatch(SRCFILE,"extending.06.4.html") ) { return "extending.06.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Example of Adding a Contact Subtype") && Guidewire_FMSourceFileMatch(SRCFILE,"extending.06.5.html") ) { return "extending.06.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Synchronizing Contacts between ContactCenter and ClaimCenter") && Guidewire_FMSourceFileMatch(SRCFILE,"syncing.07.1.html") ) { return "syncing.07.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring Automatic Synchronization") && Guidewire_FMSourceFileMatch(SRCFILE,"syncing.07.2.html") ) { return "syncing.07.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Synchronizing Contact Attributes") && Guidewire_FMSourceFileMatch(SRCFILE,"syncing.07.3.html") ) { return "syncing.07.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring Link Functionality") && Guidewire_FMSourceFileMatch(SRCFILE,"syncing.07.4.html") ) { return "syncing.07.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring Roles and Relationships") && Guidewire_FMSourceFileMatch(SRCFILE,"roles.08.1.html") ) { return "roles.08.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Adding Contact Roles") && Guidewire_FMSourceFileMatch(SRCFILE,"roles.08.2.html") ) { return "roles.08.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"How Configuring Roles Impacts Entity Data and Types") && Guidewire_FMSourceFileMatch(SRCFILE,"roles.08.3.html") ) { return "roles.08.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Example of Adding a New Contact Role") && Guidewire_FMSourceFileMatch(SRCFILE,"roles.08.4.html") ) { return "roles.08.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Relationships Between Contacts") && Guidewire_FMSourceFileMatch(SRCFILE,"roles.08.5.html") ) { return "roles.08.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring Contact Address Interfaces") && Guidewire_FMSourceFileMatch(SRCFILE,"afill-zmap.09.1.html") ) { return "afill-zmap.09.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Understanding Autofill and Zone Mapping") && Guidewire_FMSourceFileMatch(SRCFILE,"afill-zmap.09.2.html") ) { return "afill-zmap.09.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Importing Address Zone Data") && Guidewire_FMSourceFileMatch(SRCFILE,"afill-zmap.09.3.html") ) { return "afill-zmap.09.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working with the zone-config.xml File") && Guidewire_FMSourceFileMatch(SRCFILE,"afill-zmap.09.4.html") ) { return "afill-zmap.09.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring Addressing") && Guidewire_FMSourceFileMatch(SRCFILE,"afill-zmap.09.5.html") ) { return "afill-zmap.09.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Implementing Autofill and Autocomplete in a PCF File") && Guidewire_FMSourceFileMatch(SRCFILE,"afill-zmap.09.6.html") ) { return "afill-zmap.09.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Contact Pickers and Search") && Guidewire_FMSourceFileMatch(SRCFILE,"picker.10.1.html") ) { return "picker.10.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"How Pickers Work") && Guidewire_FMSourceFileMatch(SRCFILE,"picker.10.2.html") ) { return "picker.10.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Example of a Constrained Picker") && Guidewire_FMSourceFileMatch(SRCFILE,"picker.10.3.html") ) { return "picker.10.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Extending Contacts and Search with an Array") && Guidewire_FMSourceFileMatch(SRCFILE,"picker.10.4.html") ) { return "picker.10.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Proximity Search Using Geocoding") && Guidewire_FMSourceFileMatch(SRCFILE,"geocode.11.1.html") ) { return "geocode.11.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Overview of the Geocoding Feature") && Guidewire_FMSourceFileMatch(SRCFILE,"geocode.11.2.html") ) { return "geocode.11.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"The Mechanics of Geocoding") && Guidewire_FMSourceFileMatch(SRCFILE,"geocode.11.3.html") ) { return "geocode.11.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring Geocoding") && Guidewire_FMSourceFileMatch(SRCFILE,"geocode.11.4.html") ) { return "geocode.11.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Proximity Search and Geocoding with Gosu") && Guidewire_FMSourceFileMatch(SRCFILE,"geocode.11.5.html") ) { return "geocode.11.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Securing Contact Information") && Guidewire_FMSourceFileMatch(SRCFILE,"security.12.1.html") ) { return "security.12.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Overview of Contact Security") && Guidewire_FMSourceFileMatch(SRCFILE,"security.12.2.html") ) { return "security.12.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring Contact Permissions") && Guidewire_FMSourceFileMatch(SRCFILE,"security.12.3.html") ) { return "security.12.3.html";}
else { return("../wwhelp/topic_cannot_be_found.html"); } }

function  WWHBookData_MatchTopic(P)
{
var C=null;P=decodeURIComponent(decodeURIComponent(escape(P)));//workaround epub bug with UTF8 processing!
if (C) { return C } else { return GUIDEWIRE_TOPIC_TO_FILE(P,Guidewire_ExtractSrcFromURL());}
}
