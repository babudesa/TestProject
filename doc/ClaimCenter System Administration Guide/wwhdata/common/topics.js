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

else if (Guidewire_TopicMatch(TOPIC,"ClaimCenter System Administration Guide") && Guidewire_FMSourceFileMatch(SRCFILE,"cover-admin.html") ) { return "cover-admin.html";}
else if (Guidewire_TopicMatch(TOPIC,"About This Document") && Guidewire_FMSourceFileMatch(SRCFILE,"about.html") ) { return "about.html";}
else if (Guidewire_TopicMatch(TOPIC,"Installation Files and Directories") && Guidewire_FMSourceFileMatch(SRCFILE,"filesndirs.03.1.html") ) { return "filesndirs.03.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"The ClaimCenter Installation Directory") && Guidewire_FMSourceFileMatch(SRCFILE,"filesndirs.03.2.html") ) { return "filesndirs.03.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Knowing When to Regenerate and Redeploy") && Guidewire_FMSourceFileMatch(SRCFILE,"filesndirs.03.3.html") ) { return "filesndirs.03.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Basic Configuration") && Guidewire_FMSourceFileMatch(SRCFILE,"configndeploy.04.1.html") ) { return "configndeploy.04.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"The Application Server config.xml") && Guidewire_FMSourceFileMatch(SRCFILE,"configndeploy.04.2.html") ) { return "configndeploy.04.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Defining the Application Server Environment") && Guidewire_FMSourceFileMatch(SRCFILE,"configndeploy.04.3.html") ) { return "configndeploy.04.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using the Geocoding Feature") && Guidewire_FMSourceFileMatch(SRCFILE,"configndeploy.04.4.html") ) { return "configndeploy.04.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring Guidewire Document Assistant") && Guidewire_FMSourceFileMatch(SRCFILE,"configndeploy.04.5.html") ) { return "configndeploy.04.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring an Email Server for Notifications") && Guidewire_FMSourceFileMatch(SRCFILE,"configndeploy.04.6.html") ) { return "configndeploy.04.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Changing the Unrestricted User") && Guidewire_FMSourceFileMatch(SRCFILE,"configndeploy.04.7.html") ) { return "configndeploy.04.7.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring Logging") && Guidewire_FMSourceFileMatch(SRCFILE,"logging.05.01.html") ) { return "logging.05.01.html";}
else if (Guidewire_TopicMatch(TOPIC,"Logging Overview") && Guidewire_FMSourceFileMatch(SRCFILE,"logging.05.02.html") ) { return "logging.05.02.html";}
else if (Guidewire_TopicMatch(TOPIC,"Logging for Studio") && Guidewire_FMSourceFileMatch(SRCFILE,"logging.05.03.html") ) { return "logging.05.03.html";}
else if (Guidewire_TopicMatch(TOPIC,"Specifying Location of Log Files for the View Logs Page") && Guidewire_FMSourceFileMatch(SRCFILE,"logging.05.04.html") ) { return "logging.05.04.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring Logging in a Multiple Instance Environment") && Guidewire_FMSourceFileMatch(SRCFILE,"logging.05.05.html") ) { return "logging.05.05.html";}
else if (Guidewire_TopicMatch(TOPIC,"Key Logging Options") && Guidewire_FMSourceFileMatch(SRCFILE,"logging.05.06.html") ) { return "logging.05.06.html";}
else if (Guidewire_TopicMatch(TOPIC,"Logging Successfully Archived Claims") && Guidewire_FMSourceFileMatch(SRCFILE,"logging.05.07.html") ) { return "logging.05.07.html";}
else if (Guidewire_TopicMatch(TOPIC,"Logs for Additional System Components") && Guidewire_FMSourceFileMatch(SRCFILE,"logging.05.08.html") ) { return "logging.05.08.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring Information in Log Messages") && Guidewire_FMSourceFileMatch(SRCFILE,"logging.05.09.html") ) { return "logging.05.09.html";}
else if (Guidewire_TopicMatch(TOPIC,"Listing Logger Categories") && Guidewire_FMSourceFileMatch(SRCFILE,"logging.05.10.html") ) { return "logging.05.10.html";}
else if (Guidewire_TopicMatch(TOPIC,"Making Dynamic Logging Changes without Redeploying") && Guidewire_FMSourceFileMatch(SRCFILE,"logging.05.11.html") ) { return "logging.05.11.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring and Maintaining the ClaimCenter Database") && Guidewire_FMSourceFileMatch(SRCFILE,"database.06.01.html") ) { return "database.06.01.html";}
else if (Guidewire_TopicMatch(TOPIC,"Database Best Practices") && Guidewire_FMSourceFileMatch(SRCFILE,"database.06.02.html") ) { return "database.06.02.html";}
else if (Guidewire_TopicMatch(TOPIC,"Guidewire Database Direct Update Policy") && Guidewire_FMSourceFileMatch(SRCFILE,"database.06.03.html") ) { return "database.06.03.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring Connection Pool Parameters") && Guidewire_FMSourceFileMatch(SRCFILE,"database.06.04.html") ) { return "database.06.04.html";}
else if (Guidewire_TopicMatch(TOPIC,"Setting Search Parameters for Oracle") && Guidewire_FMSourceFileMatch(SRCFILE,"database.06.05.html") ) { return "database.06.05.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using Oracle Materialized Views for Claim Searches") && Guidewire_FMSourceFileMatch(SRCFILE,"database.06.06.html") ) { return "database.06.06.html";}
else if (Guidewire_TopicMatch(TOPIC,"Understanding and Authorizing Database Upgrades") && Guidewire_FMSourceFileMatch(SRCFILE,"database.06.07.html") ) { return "database.06.07.html";}
else if (Guidewire_TopicMatch(TOPIC,"Viewing Detailed Database Upgrade Information") && Guidewire_FMSourceFileMatch(SRCFILE,"database.06.08.html") ) { return "database.06.08.html";}
else if (Guidewire_TopicMatch(TOPIC,"Checking Database Consistency") && Guidewire_FMSourceFileMatch(SRCFILE,"database.06.09.html") ) { return "database.06.09.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring Database Statistics") && Guidewire_FMSourceFileMatch(SRCFILE,"database.06.10.html") ) { return "database.06.10.html";}
else if (Guidewire_TopicMatch(TOPIC,"Purging Old Workflows and Workflow Logs") && Guidewire_FMSourceFileMatch(SRCFILE,"database.06.11.html") ) { return "database.06.11.html";}
else if (Guidewire_TopicMatch(TOPIC,"Purging Orphaned Policies") && Guidewire_FMSourceFileMatch(SRCFILE,"database.06.12.html") ) { return "database.06.12.html";}
else if (Guidewire_TopicMatch(TOPIC,"Purging Unwanted Claims") && Guidewire_FMSourceFileMatch(SRCFILE,"database.06.13.html") ) { return "database.06.13.html";}
else if (Guidewire_TopicMatch(TOPIC,"Recalculating Financial Summaries") && Guidewire_FMSourceFileMatch(SRCFILE,"database.06.14.html") ) { return "database.06.14.html";}
else if (Guidewire_TopicMatch(TOPIC,"Rebuilding Contact Associations") && Guidewire_FMSourceFileMatch(SRCFILE,"database.06.15.html") ) { return "database.06.15.html";}
else if (Guidewire_TopicMatch(TOPIC,"Backing up the ClaimCenter Database") && Guidewire_FMSourceFileMatch(SRCFILE,"database.06.16.html") ) { return "database.06.16.html";}
else if (Guidewire_TopicMatch(TOPIC,"Resizing Columns") && Guidewire_FMSourceFileMatch(SRCFILE,"database.06.17.html") ) { return "database.06.17.html";}
else if (Guidewire_TopicMatch(TOPIC,"Managing ClaimCenter Servers") && Guidewire_FMSourceFileMatch(SRCFILE,"mngservers.07.01.html") ) { return "mngservers.07.01.html";}
else if (Guidewire_TopicMatch(TOPIC,"Stopping the ClaimCenter Application") && Guidewire_FMSourceFileMatch(SRCFILE,"mngservers.07.02.html") ) { return "mngservers.07.02.html";}
else if (Guidewire_TopicMatch(TOPIC,"Understanding Server Run Levels and Modes") && Guidewire_FMSourceFileMatch(SRCFILE,"mngservers.07.03.html") ) { return "mngservers.07.03.html";}
else if (Guidewire_TopicMatch(TOPIC,"Understanding System Users") && Guidewire_FMSourceFileMatch(SRCFILE,"mngservers.07.04.html") ) { return "mngservers.07.04.html";}
else if (Guidewire_TopicMatch(TOPIC,"Graph Validation Checks") && Guidewire_FMSourceFileMatch(SRCFILE,"mngservers.07.05.html") ) { return "mngservers.07.05.html";}
else if (Guidewire_TopicMatch(TOPIC,"Monitoring the Servers") && Guidewire_FMSourceFileMatch(SRCFILE,"mngservers.07.06.html") ) { return "mngservers.07.06.html";}
else if (Guidewire_TopicMatch(TOPIC,"Monitoring and Managing Event Messages") && Guidewire_FMSourceFileMatch(SRCFILE,"mngservers.07.07.html") ) { return "mngservers.07.07.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring Minimum and Maximum Password Length") && Guidewire_FMSourceFileMatch(SRCFILE,"mngservers.07.08.html") ) { return "mngservers.07.08.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring Client Session Timeout") && Guidewire_FMSourceFileMatch(SRCFILE,"mngservers.07.09.html") ) { return "mngservers.07.09.html";}
else if (Guidewire_TopicMatch(TOPIC,"Avoiding Session Replication") && Guidewire_FMSourceFileMatch(SRCFILE,"mngservers.07.10.html") ) { return "mngservers.07.10.html";}
else if (Guidewire_TopicMatch(TOPIC,"Understanding Application Server Caching") && Guidewire_FMSourceFileMatch(SRCFILE,"mngservers.07.11.html") ) { return "mngservers.07.11.html";}
else if (Guidewire_TopicMatch(TOPIC,"Analyzing Server Memory Management") && Guidewire_FMSourceFileMatch(SRCFILE,"mngservers.07.12.html") ) { return "mngservers.07.12.html";}
else if (Guidewire_TopicMatch(TOPIC,"Managing Clustered Servers") && Guidewire_FMSourceFileMatch(SRCFILE,"clustering.08.01.html") ) { return "clustering.08.01.html";}
else if (Guidewire_TopicMatch(TOPIC,"Overview of Clustering") && Guidewire_FMSourceFileMatch(SRCFILE,"clustering.08.02.html") ) { return "clustering.08.02.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring a Cluster") && Guidewire_FMSourceFileMatch(SRCFILE,"clustering.08.03.html") ) { return "clustering.08.03.html";}
else if (Guidewire_TopicMatch(TOPIC,"Enabling and Disabling Clustering") && Guidewire_FMSourceFileMatch(SRCFILE,"clustering.08.04.html") ) { return "clustering.08.04.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring the Registry Element for Clustering") && Guidewire_FMSourceFileMatch(SRCFILE,"clustering.08.05.html") ) { return "clustering.08.05.html";}
else if (Guidewire_TopicMatch(TOPIC,"Setting the Multicast Address") && Guidewire_FMSourceFileMatch(SRCFILE,"clustering.08.06.html") ) { return "clustering.08.06.html";}
else if (Guidewire_TopicMatch(TOPIC,"Specifying the Key Range") && Guidewire_FMSourceFileMatch(SRCFILE,"clustering.08.07.html") ) { return "clustering.08.07.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring Separate Logging Environments") && Guidewire_FMSourceFileMatch(SRCFILE,"clustering.08.08.html") ) { return "clustering.08.08.html";}
else if (Guidewire_TopicMatch(TOPIC,"Managing a Cluster") && Guidewire_FMSourceFileMatch(SRCFILE,"clustering.08.09.html") ) { return "clustering.08.09.html";}
else if (Guidewire_TopicMatch(TOPIC,"Starting Clustered Servers") && Guidewire_FMSourceFileMatch(SRCFILE,"clustering.08.10.html") ) { return "clustering.08.10.html";}
else if (Guidewire_TopicMatch(TOPIC,"Checking Node Health") && Guidewire_FMSourceFileMatch(SRCFILE,"clustering.08.11.html") ) { return "clustering.08.11.html";}
else if (Guidewire_TopicMatch(TOPIC,"Adding a Server to a Cluster") && Guidewire_FMSourceFileMatch(SRCFILE,"clustering.08.12.html") ) { return "clustering.08.12.html";}
else if (Guidewire_TopicMatch(TOPIC,"Checking Server Run Level") && Guidewire_FMSourceFileMatch(SRCFILE,"clustering.08.13.html") ) { return "clustering.08.13.html";}
else if (Guidewire_TopicMatch(TOPIC,"Server Failures and Removing a Server") && Guidewire_FMSourceFileMatch(SRCFILE,"clustering.08.14.html") ) { return "clustering.08.14.html";}
else if (Guidewire_TopicMatch(TOPIC,"Running Administrative Commands") && Guidewire_FMSourceFileMatch(SRCFILE,"clustering.08.15.html") ) { return "clustering.08.15.html";}
else if (Guidewire_TopicMatch(TOPIC,"Updating Clustered Servers") && Guidewire_FMSourceFileMatch(SRCFILE,"clustering.08.16.html") ) { return "clustering.08.16.html";}
else if (Guidewire_TopicMatch(TOPIC,"Enabling JMX with ClaimCenter") && Guidewire_FMSourceFileMatch(SRCFILE,"topics.09.1.html") ) { return "topics.09.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Overview of JMX Management Tasks") && Guidewire_FMSourceFileMatch(SRCFILE,"topics.09.2.html") ) { return "topics.09.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Preparing the Management Plugin") && Guidewire_FMSourceFileMatch(SRCFILE,"topics.09.3.html") ) { return "topics.09.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Enabling JMX in ClaimCenter") && Guidewire_FMSourceFileMatch(SRCFILE,"topics.09.4.html") ) { return "topics.09.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Securing ClaimCenter Communications") && Guidewire_FMSourceFileMatch(SRCFILE,"serversecurity.10.1.html") ) { return "serversecurity.10.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using SSL with ClaimCenter") && Guidewire_FMSourceFileMatch(SRCFILE,"serversecurity.10.2.html") ) { return "serversecurity.10.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Accessing a ClaimCenter Server Using SSL") && Guidewire_FMSourceFileMatch(SRCFILE,"serversecurity.10.3.html") ) { return "serversecurity.10.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Securing Access to ClaimCenter Objects") && Guidewire_FMSourceFileMatch(SRCFILE,"security.11.1.html") ) { return "security.11.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Understanding the Object Access Infrastructure") && Guidewire_FMSourceFileMatch(SRCFILE,"security.11.2.html") ) { return "security.11.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Key Access Control Configuration Files") && Guidewire_FMSourceFileMatch(SRCFILE,"security.11.3.html") ) { return "security.11.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Controlling Access to Claim Objects") && Guidewire_FMSourceFileMatch(SRCFILE,"security.11.4.html") ) { return "security.11.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"How ClaimCenter Applies Claim ACL Changes") && Guidewire_FMSourceFileMatch(SRCFILE,"security.11.5.html") ) { return "security.11.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Controlling Document Security") && Guidewire_FMSourceFileMatch(SRCFILE,"security.11.6.html") ) { return "security.11.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Controlling Exposure Security") && Guidewire_FMSourceFileMatch(SRCFILE,"security.11.7.html") ) { return "security.11.7.html";}
else if (Guidewire_TopicMatch(TOPIC,"Importing and Exporting Administrative Data") && Guidewire_FMSourceFileMatch(SRCFILE,"importdata.12.1.html") ) { return "importdata.12.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Understanding Data Import and Export") && Guidewire_FMSourceFileMatch(SRCFILE,"importdata.12.2.html") ) { return "importdata.12.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Importing Administrative Data from the Command Line") && Guidewire_FMSourceFileMatch(SRCFILE,"importdata.12.3.html") ) { return "importdata.12.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Importing and Exporting Administrative Data from ClaimCenter") && Guidewire_FMSourceFileMatch(SRCFILE,"importdata.12.4.html") ) { return "importdata.12.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Other Import Functions") && Guidewire_FMSourceFileMatch(SRCFILE,"importdata.12.5.html") ) { return "importdata.12.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"The import Directory") && Guidewire_FMSourceFileMatch(SRCFILE,"importdata.12.6.html") ) { return "importdata.12.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Updating ICD Codes") && Guidewire_FMSourceFileMatch(SRCFILE,"importdata.12.7.html") ) { return "importdata.12.7.html";}
else if (Guidewire_TopicMatch(TOPIC,"Batch Processes and Work Queues") && Guidewire_FMSourceFileMatch(SRCFILE,"batch.13.01.html") ) { return "batch.13.01.html";}
else if (Guidewire_TopicMatch(TOPIC,"Understanding Batch Processes") && Guidewire_FMSourceFileMatch(SRCFILE,"batch.13.02.html") ) { return "batch.13.02.html";}
else if (Guidewire_TopicMatch(TOPIC,"Understanding Distributed Work Queues") && Guidewire_FMSourceFileMatch(SRCFILE,"batch.13.03.html") ) { return "batch.13.03.html";}
else if (Guidewire_TopicMatch(TOPIC,"Running Batch Processes and Work Queues") && Guidewire_FMSourceFileMatch(SRCFILE,"batch.13.04.html") ) { return "batch.13.04.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring Distributed Work Queues") && Guidewire_FMSourceFileMatch(SRCFILE,"batch.13.05.html") ) { return "batch.13.05.html";}
else if (Guidewire_TopicMatch(TOPIC,"Batch Processes and Distributed Work Queues") && Guidewire_FMSourceFileMatch(SRCFILE,"batch.13.06.html") ) { return "batch.13.06.html";}
else if (Guidewire_TopicMatch(TOPIC,"Scheduling Batch Processes and Distributed Work Queues") && Guidewire_FMSourceFileMatch(SRCFILE,"batch.13.07.html") ) { return "batch.13.07.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using Events and Messaging with Batch Processes") && Guidewire_FMSourceFileMatch(SRCFILE,"batch.13.08.html") ) { return "batch.13.08.html";}
else if (Guidewire_TopicMatch(TOPIC,"Troubleshooting Batch Processes and Work Queues") && Guidewire_FMSourceFileMatch(SRCFILE,"batch.13.09.html") ) { return "batch.13.09.html";}
else if (Guidewire_TopicMatch(TOPIC,"Interactions Between ClaimCenter and Specific Processes") && Guidewire_FMSourceFileMatch(SRCFILE,"batch.13.10.html") ) { return "batch.13.10.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using Server and Internal Tools") && Guidewire_FMSourceFileMatch(SRCFILE,"maintenance.14.01.html") ) { return "maintenance.14.01.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using the Server Tools") && Guidewire_FMSourceFileMatch(SRCFILE,"maintenance.14.02.html") ) { return "maintenance.14.02.html";}
else if (Guidewire_TopicMatch(TOPIC,"Batch Process Info") && Guidewire_FMSourceFileMatch(SRCFILE,"maintenance.14.03.html") ) { return "maintenance.14.03.html";}
else if (Guidewire_TopicMatch(TOPIC,"Work Queue Info") && Guidewire_FMSourceFileMatch(SRCFILE,"maintenance.14.04.html") ) { return "maintenance.14.04.html";}
else if (Guidewire_TopicMatch(TOPIC,"Metro Reports") && Guidewire_FMSourceFileMatch(SRCFILE,"maintenance.14.05.html") ) { return "maintenance.14.05.html";}
else if (Guidewire_TopicMatch(TOPIC,"Management Beans") && Guidewire_FMSourceFileMatch(SRCFILE,"maintenance.14.06.html") ) { return "maintenance.14.06.html";}
else if (Guidewire_TopicMatch(TOPIC,"Guidewire Profiler") && Guidewire_FMSourceFileMatch(SRCFILE,"maintenance.14.07.html") ) { return "maintenance.14.07.html";}
else if (Guidewire_TopicMatch(TOPIC,"Cache Info") && Guidewire_FMSourceFileMatch(SRCFILE,"maintenance.14.08.html") ) { return "maintenance.14.08.html";}
else if (Guidewire_TopicMatch(TOPIC,"Startable Plugin") && Guidewire_FMSourceFileMatch(SRCFILE,"maintenance.14.09.html") ) { return "maintenance.14.09.html";}
else if (Guidewire_TopicMatch(TOPIC,"Set Log Level") && Guidewire_FMSourceFileMatch(SRCFILE,"maintenance.14.10.html") ) { return "maintenance.14.10.html";}
else if (Guidewire_TopicMatch(TOPIC,"View Logs") && Guidewire_FMSourceFileMatch(SRCFILE,"maintenance.14.11.html") ) { return "maintenance.14.11.html";}
else if (Guidewire_TopicMatch(TOPIC,"Info Pages") && Guidewire_FMSourceFileMatch(SRCFILE,"maintenance.14.12.html") ) { return "maintenance.14.12.html";}
else if (Guidewire_TopicMatch(TOPIC,"Cluster Info") && Guidewire_FMSourceFileMatch(SRCFILE,"maintenance.14.13.html") ) { return "maintenance.14.13.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using the Internal Tools") && Guidewire_FMSourceFileMatch(SRCFILE,"maintenance.14.14.html") ) { return "maintenance.14.14.html";}
else if (Guidewire_TopicMatch(TOPIC,"Reload") && Guidewire_FMSourceFileMatch(SRCFILE,"maintenance.14.15.html") ) { return "maintenance.14.15.html";}
else if (Guidewire_TopicMatch(TOPIC,"Update All Dates") && Guidewire_FMSourceFileMatch(SRCFILE,"maintenance.14.16.html") ) { return "maintenance.14.16.html";}
else if (Guidewire_TopicMatch(TOPIC,"ClaimCenter Administrative Commands") && Guidewire_FMSourceFileMatch(SRCFILE,"commandsref.15.01.html") ) { return "commandsref.15.01.html";}
else if (Guidewire_TopicMatch(TOPIC,"fnol_mapper Command") && Guidewire_FMSourceFileMatch(SRCFILE,"commandsref.15.02.html") ) { return "commandsref.15.02.html";}
else if (Guidewire_TopicMatch(TOPIC,"import_tools Command") && Guidewire_FMSourceFileMatch(SRCFILE,"commandsref.15.03.html") ) { return "commandsref.15.03.html";}
else if (Guidewire_TopicMatch(TOPIC,"maintenance_tools Command") && Guidewire_FMSourceFileMatch(SRCFILE,"commandsref.15.04.html") ) { return "commandsref.15.04.html";}
else if (Guidewire_TopicMatch(TOPIC,"messaging_tools Command") && Guidewire_FMSourceFileMatch(SRCFILE,"commandsref.15.05.html") ) { return "commandsref.15.05.html";}
else if (Guidewire_TopicMatch(TOPIC,"system_tools Command") && Guidewire_FMSourceFileMatch(SRCFILE,"commandsref.15.06.html") ) { return "commandsref.15.06.html";}
else if (Guidewire_TopicMatch(TOPIC,"table_import Command") && Guidewire_FMSourceFileMatch(SRCFILE,"commandsref.15.07.html") ) { return "commandsref.15.07.html";}
else if (Guidewire_TopicMatch(TOPIC,"template_tools Command") && Guidewire_FMSourceFileMatch(SRCFILE,"commandsref.15.08.html") ) { return "commandsref.15.08.html";}
else if (Guidewire_TopicMatch(TOPIC,"usage_tools Command") && Guidewire_FMSourceFileMatch(SRCFILE,"commandsref.15.09.html") ) { return "commandsref.15.09.html";}
else if (Guidewire_TopicMatch(TOPIC,"zone_import Command") && Guidewire_FMSourceFileMatch(SRCFILE,"commandsref.15.10.html") ) { return "commandsref.15.10.html";}
else { return("../wwhelp/topic_cannot_be_found.html"); } }

function  WWHBookData_MatchTopic(P)
{
var C=null;P=decodeURIComponent(decodeURIComponent(escape(P)));//workaround epub bug with UTF8 processing!
if (C) { return C } else { return GUIDEWIRE_TOPIC_TO_FILE(P,Guidewire_ExtractSrcFromURL());}
}
