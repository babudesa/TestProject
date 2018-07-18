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

else if (Guidewire_TopicMatch(TOPIC,"ClaimCenter Upgrade Guide") && Guidewire_FMSourceFileMatch(SRCFILE,"cover-upgrade.html") ) { return "cover-upgrade.html";}
else if (Guidewire_TopicMatch(TOPIC,"About This Document") && Guidewire_FMSourceFileMatch(SRCFILE,"about.html") ) { return "about.html";}
else if (Guidewire_TopicMatch(TOPIC,"Planning the Upgrade") && Guidewire_FMSourceFileMatch(SRCFILE,"part-basicupgrade.html") ) { return "part-basicupgrade.html";}
else if (Guidewire_TopicMatch(TOPIC,"Planning the ClaimCenter Upgrade") && Guidewire_FMSourceFileMatch(SRCFILE,"planning.04.1.html") ) { return "planning.04.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Supported Starting Version") && Guidewire_FMSourceFileMatch(SRCFILE,"planning.04.2.html") ) { return "planning.04.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Roadmap for Planning the Upgrade") && Guidewire_FMSourceFileMatch(SRCFILE,"planning.04.3.html") ) { return "planning.04.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Upgrade Assessment") && Guidewire_FMSourceFileMatch(SRCFILE,"planning.04.4.html") ) { return "planning.04.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Preparing for the Upgrade") && Guidewire_FMSourceFileMatch(SRCFILE,"planning.04.5.html") ) { return "planning.04.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Project Inception") && Guidewire_FMSourceFileMatch(SRCFILE,"planning.04.6.html") ) { return "planning.04.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Design and Development") && Guidewire_FMSourceFileMatch(SRCFILE,"planning.04.7.html") ) { return "planning.04.7.html";}
else if (Guidewire_TopicMatch(TOPIC,"System Test") && Guidewire_FMSourceFileMatch(SRCFILE,"planning.04.8.html") ) { return "planning.04.8.html";}
else if (Guidewire_TopicMatch(TOPIC,"Deployment and Support") && Guidewire_FMSourceFileMatch(SRCFILE,"planning.04.9.html") ) { return "planning.04.9.html";}
else if (Guidewire_TopicMatch(TOPIC,"Upgrading from 6.0.x") && Guidewire_FMSourceFileMatch(SRCFILE,"part-basicupgrade_2.html") ) { return "part-basicupgrade_2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Upgrading the ClaimCenter 6.0.x Configuration") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-config-c-c.06.01.html") ) { return "procedure-config-c-c.06.01.html";}
else if (Guidewire_TopicMatch(TOPIC,"Overview of ContactCenter Upgrade") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-config-c-c.06.02.html") ) { return "procedure-config-c-c.06.02.html";}
else if (Guidewire_TopicMatch(TOPIC,"Obtaining Configurations and Tools") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-config-c-c.06.03.html") ) { return "procedure-config-c-c.06.03.html";}
else if (Guidewire_TopicMatch(TOPIC,"Creating a Configuration Backup") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-config-c-c.06.04.html") ) { return "procedure-config-c-c.06.04.html";}
else if (Guidewire_TopicMatch(TOPIC,"Updating Infrastructure") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-config-c-c.06.05.html") ) { return "procedure-config-c-c.06.05.html";}
else if (Guidewire_TopicMatch(TOPIC,"Deleting Target Configuration Module") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-config-c-c.06.06.html") ) { return "procedure-config-c-c.06.06.html";}
else if (Guidewire_TopicMatch(TOPIC,"Merging the ClaimCenter Configuration") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-config-c-c.06.07.html") ) { return "procedure-config-c-c.06.07.html";}
else if (Guidewire_TopicMatch(TOPIC,"Upgrading Rules to ClaimCenter 6.0.8") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-config-c-c.06.08.html") ) { return "procedure-config-c-c.06.08.html";}
else if (Guidewire_TopicMatch(TOPIC,"Translating New Display Properties and Typecodes") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-config-c-c.06.09.html") ) { return "procedure-config-c-c.06.09.html";}
else if (Guidewire_TopicMatch(TOPIC,"Modifying PCF files, Rules and Libraries for Unused Contact Subtypes") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-config-c-c.06.10.html") ) { return "procedure-config-c-c.06.10.html";}
else if (Guidewire_TopicMatch(TOPIC,"Validating the ClaimCenter 6.0.8 Configuration") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-config-c-c.06.11.html") ) { return "procedure-config-c-c.06.11.html";}
else if (Guidewire_TopicMatch(TOPIC,"Building and Deploying ClaimCenter 6.0.8") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-config-c-c.06.12.html") ) { return "procedure-config-c-c.06.12.html";}
else if (Guidewire_TopicMatch(TOPIC,"Upgrading the ClaimCenter 6.0.x Database") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-c-c.07.01.html") ) { return "procedure-db-c-c.07.01.html";}
else if (Guidewire_TopicMatch(TOPIC,"Identifying Data Model Issues") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-c-c.07.02.html") ) { return "procedure-db-c-c.07.02.html";}
else if (Guidewire_TopicMatch(TOPIC,"Verifying Batch Process and Work Queue Completion") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-c-c.07.03.html") ) { return "procedure-db-c-c.07.03.html";}
else if (Guidewire_TopicMatch(TOPIC,"Purging Data Prior to Upgrade") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-c-c.07.04.html") ) { return "procedure-db-c-c.07.04.html";}
else if (Guidewire_TopicMatch(TOPIC,"Validating the Database Schema") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-c-c.07.05.html") ) { return "procedure-db-c-c.07.05.html";}
else if (Guidewire_TopicMatch(TOPIC,"Checking Database Consistency") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-c-c.07.06.html") ) { return "procedure-db-c-c.07.06.html";}
else if (Guidewire_TopicMatch(TOPIC,"Creating a Data Distribution Report") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-c-c.07.07.html") ) { return "procedure-db-c-c.07.07.html";}
else if (Guidewire_TopicMatch(TOPIC,"Generating Database Statistics") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-c-c.07.08.html") ) { return "procedure-db-c-c.07.08.html";}
else if (Guidewire_TopicMatch(TOPIC,"Creating a Database Backup") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-c-c.07.09.html") ) { return "procedure-db-c-c.07.09.html";}
else if (Guidewire_TopicMatch(TOPIC,"Updating Database Infrastructure") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-c-c.07.10.html") ) { return "procedure-db-c-c.07.10.html";}
else if (Guidewire_TopicMatch(TOPIC,"Preparing the Database for Upgrade") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-c-c.07.11.html") ) { return "procedure-db-c-c.07.11.html";}
else if (Guidewire_TopicMatch(TOPIC,"Handling Extensions") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-c-c.07.12.html") ) { return "procedure-db-c-c.07.12.html";}
else if (Guidewire_TopicMatch(TOPIC,"Setting Linguistic Search Collation for Oracle") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-c-c.07.13.html") ) { return "procedure-db-c-c.07.13.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using the IDatabaseUpgrade Plugin") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-c-c.07.14.html") ) { return "procedure-db-c-c.07.14.html";}
else if (Guidewire_TopicMatch(TOPIC,"Disabling the Scheduler") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-c-c.07.15.html") ) { return "procedure-db-c-c.07.15.html";}
else if (Guidewire_TopicMatch(TOPIC,"Suspending Message Destinations") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-c-c.07.16.html") ) { return "procedure-db-c-c.07.16.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring the Database Upgrade") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-c-c.07.17.html") ) { return "procedure-db-c-c.07.17.html";}
else if (Guidewire_TopicMatch(TOPIC,"Starting the Server to Begin Automatic Database Upgrade") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-c-c.07.18.html") ) { return "procedure-db-c-c.07.18.html";}
else if (Guidewire_TopicMatch(TOPIC,"Viewing Detailed Database Upgrade Information") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-c-c.07.19.html") ) { return "procedure-db-c-c.07.19.html";}
else if (Guidewire_TopicMatch(TOPIC,"Dropping Unused Columns on Oracle") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-c-c.07.20.html") ) { return "procedure-db-c-c.07.20.html";}
else if (Guidewire_TopicMatch(TOPIC,"Setting Claim Descriptions") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-c-c.07.21.html") ) { return "procedure-db-c-c.07.21.html";}
else if (Guidewire_TopicMatch(TOPIC,"Final Steps After The Database Upgrade is Complete") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-c-c.07.22.html") ) { return "procedure-db-c-c.07.22.html";}
else if (Guidewire_TopicMatch(TOPIC,"Upgrading from 5.0.x") && Guidewire_FMSourceFileMatch(SRCFILE,"part-basicupgrade_3.html") ) { return "part-basicupgrade_3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Upgrading the ClaimCenter 5.0.x Configuration") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-config-b-c.09.01.html") ) { return "procedure-config-b-c.09.01.html";}
else if (Guidewire_TopicMatch(TOPIC,"Overview of ContactCenter Upgrade") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-config-b-c.09.02.html") ) { return "procedure-config-b-c.09.02.html";}
else if (Guidewire_TopicMatch(TOPIC,"Obtaining Configurations and Tools") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-config-b-c.09.03.html") ) { return "procedure-config-b-c.09.03.html";}
else if (Guidewire_TopicMatch(TOPIC,"Creating a Configuration Backup") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-config-b-c.09.04.html") ) { return "procedure-config-b-c.09.04.html";}
else if (Guidewire_TopicMatch(TOPIC,"Updating Infrastructure") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-config-b-c.09.05.html") ) { return "procedure-config-b-c.09.05.html";}
else if (Guidewire_TopicMatch(TOPIC,"Deleting Target Configuration Module") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-config-b-c.09.06.html") ) { return "procedure-config-b-c.09.06.html";}
else if (Guidewire_TopicMatch(TOPIC,"Removing Size Attribute from Integer and Money Datatypes") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-config-b-c.09.07.html") ) { return "procedure-config-b-c.09.07.html";}
else if (Guidewire_TopicMatch(TOPIC,"Merging the ClaimCenter Configuration") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-config-b-c.09.08.html") ) { return "procedure-config-b-c.09.08.html";}
else if (Guidewire_TopicMatch(TOPIC,"Upgrading Rules to ClaimCenter 6.0.8") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-config-b-c.09.09.html") ) { return "procedure-config-b-c.09.09.html";}
else if (Guidewire_TopicMatch(TOPIC,"Translating New Display Properties and Typecodes") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-config-b-c.09.10.html") ) { return "procedure-config-b-c.09.10.html";}
else if (Guidewire_TopicMatch(TOPIC,"Modifying PCF files, Rules and Libraries for Unused Contact Subtypes") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-config-b-c.09.11.html") ) { return "procedure-config-b-c.09.11.html";}
else if (Guidewire_TopicMatch(TOPIC,"Converting Velocity Templates to Gosu Templates") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-config-b-c.09.12.html") ) { return "procedure-config-b-c.09.12.html";}
else if (Guidewire_TopicMatch(TOPIC,"Validating the ClaimCenter 6.0.8 Configuration") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-config-b-c.09.13.html") ) { return "procedure-config-b-c.09.13.html";}
else if (Guidewire_TopicMatch(TOPIC,"Building and Deploying ClaimCenter 6.0.8") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-config-b-c.09.14.html") ) { return "procedure-config-b-c.09.14.html";}
else if (Guidewire_TopicMatch(TOPIC,"Upgrading the ClaimCenter 5.0.x Database") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-b-c.10.01.html") ) { return "procedure-db-b-c.10.01.html";}
else if (Guidewire_TopicMatch(TOPIC,"Upgrading Administration Data for Testing") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-b-c.10.02.html") ) { return "procedure-db-b-c.10.02.html";}
else if (Guidewire_TopicMatch(TOPIC,"Identifying Data Model Issues") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-b-c.10.03.html") ) { return "procedure-db-b-c.10.03.html";}
else if (Guidewire_TopicMatch(TOPIC,"Verifying Batch Process and Work Queue Completion") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-b-c.10.04.html") ) { return "procedure-db-b-c.10.04.html";}
else if (Guidewire_TopicMatch(TOPIC,"Purging Data Prior to Upgrade") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-b-c.10.05.html") ) { return "procedure-db-b-c.10.05.html";}
else if (Guidewire_TopicMatch(TOPIC,"Validating the Database Schema") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-b-c.10.06.html") ) { return "procedure-db-b-c.10.06.html";}
else if (Guidewire_TopicMatch(TOPIC,"Checking Database Consistency") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-b-c.10.07.html") ) { return "procedure-db-b-c.10.07.html";}
else if (Guidewire_TopicMatch(TOPIC,"Creating a Data Distribution Report") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-b-c.10.08.html") ) { return "procedure-db-b-c.10.08.html";}
else if (Guidewire_TopicMatch(TOPIC,"Generating Database Statistics") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-b-c.10.09.html") ) { return "procedure-db-b-c.10.09.html";}
else if (Guidewire_TopicMatch(TOPIC,"Creating a Database Backup") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-b-c.10.10.html") ) { return "procedure-db-b-c.10.10.html";}
else if (Guidewire_TopicMatch(TOPIC,"Updating Database Infrastructure") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-b-c.10.11.html") ) { return "procedure-db-b-c.10.11.html";}
else if (Guidewire_TopicMatch(TOPIC,"Preparing the Database for Upgrade") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-b-c.10.12.html") ) { return "procedure-db-b-c.10.12.html";}
else if (Guidewire_TopicMatch(TOPIC,"Handling Extensions") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-b-c.10.13.html") ) { return "procedure-db-b-c.10.13.html";}
else if (Guidewire_TopicMatch(TOPIC,"Creating Extensions to Preserve Data") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-b-c.10.14.html") ) { return "procedure-db-b-c.10.14.html";}
else if (Guidewire_TopicMatch(TOPIC,"Disabling Encryption for Upgrade Performance") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-b-c.10.15.html") ) { return "procedure-db-b-c.10.15.html";}
else if (Guidewire_TopicMatch(TOPIC,"Setting Linguistic Search Collation for Oracle") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-b-c.10.16.html") ) { return "procedure-db-b-c.10.16.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using the IDatabaseUpgrade Plugin") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-b-c.10.17.html") ) { return "procedure-db-b-c.10.17.html";}
else if (Guidewire_TopicMatch(TOPIC,"Disabling the Scheduler") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-b-c.10.18.html") ) { return "procedure-db-b-c.10.18.html";}
else if (Guidewire_TopicMatch(TOPIC,"Suspending Message Destinations") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-b-c.10.19.html") ) { return "procedure-db-b-c.10.19.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring the Database Upgrade") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-b-c.10.20.html") ) { return "procedure-db-b-c.10.20.html";}
else if (Guidewire_TopicMatch(TOPIC,"Starting the Server to Begin Automatic Database Upgrade") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-b-c.10.21.html") ) { return "procedure-db-b-c.10.21.html";}
else if (Guidewire_TopicMatch(TOPIC,"Correcting Issues with Multiple Exposures on Incidents") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-b-c.10.22.html") ) { return "procedure-db-b-c.10.22.html";}
else if (Guidewire_TopicMatch(TOPIC,"Viewing Detailed Database Upgrade Information") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-b-c.10.23.html") ) { return "procedure-db-b-c.10.23.html";}
else if (Guidewire_TopicMatch(TOPIC,"Dropping Unused Columns on Oracle") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-b-c.10.24.html") ) { return "procedure-db-b-c.10.24.html";}
else if (Guidewire_TopicMatch(TOPIC,"Setting Claim Descriptions") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-b-c.10.25.html") ) { return "procedure-db-b-c.10.25.html";}
else if (Guidewire_TopicMatch(TOPIC,"Exporting Administration Data for Testing") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-b-c.10.26.html") ) { return "procedure-db-b-c.10.26.html";}
else if (Guidewire_TopicMatch(TOPIC,"Final Steps After The Database Upgrade is Complete") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-b-c.10.27.html") ) { return "procedure-db-b-c.10.27.html";}
else if (Guidewire_TopicMatch(TOPIC,"Upgrading Integrations and Gosu from 5.0.x") && Guidewire_FMSourceFileMatch(SRCFILE,"b-c-upgrade-tasks.11.1.html") ) { return "b-c-upgrade-tasks.11.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Overview of Upgrading Integration Plugins and Code") && Guidewire_FMSourceFileMatch(SRCFILE,"b-c-upgrade-tasks.11.2.html") ) { return "b-c-upgrade-tasks.11.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Upgrading from 4.0.x") && Guidewire_FMSourceFileMatch(SRCFILE,"part-basicupgrade_4.html") ) { return "part-basicupgrade_4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Upgrading the ClaimCenter 4.0.x Configuration") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-config-athena.13.01.html") ) { return "procedure-config-athena.13.01.html";}
else if (Guidewire_TopicMatch(TOPIC,"Overview of ContactCenter Upgrade") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-config-athena.13.02.html") ) { return "procedure-config-athena.13.02.html";}
else if (Guidewire_TopicMatch(TOPIC,"Understanding Configuration Modules") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-config-athena.13.03.html") ) { return "procedure-config-athena.13.03.html";}
else if (Guidewire_TopicMatch(TOPIC,"Obtaining Configurations and Tools") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-config-athena.13.04.html") ) { return "procedure-config-athena.13.04.html";}
else if (Guidewire_TopicMatch(TOPIC,"Creating a Configuration Backup") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-config-athena.13.05.html") ) { return "procedure-config-athena.13.05.html";}
else if (Guidewire_TopicMatch(TOPIC,"Updating Infrastructure") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-config-athena.13.06.html") ) { return "procedure-config-athena.13.06.html";}
else if (Guidewire_TopicMatch(TOPIC,"Upgrading the ClaimCenter 4.0 Configuration to 5.0") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-config-athena.13.07.html") ) { return "procedure-config-athena.13.07.html";}
else if (Guidewire_TopicMatch(TOPIC,"Deleting Target Configuration Module") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-config-athena.13.08.html") ) { return "procedure-config-athena.13.08.html";}
else if (Guidewire_TopicMatch(TOPIC,"Remove Size Attribute from Integer and Money Datatypes") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-config-athena.13.09.html") ) { return "procedure-config-athena.13.09.html";}
else if (Guidewire_TopicMatch(TOPIC,"Upgrading the ClaimCenter 5.0 Configuration to 6.0.8") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-config-athena.13.10.html") ) { return "procedure-config-athena.13.10.html";}
else if (Guidewire_TopicMatch(TOPIC,"Upgrading Rules to ClaimCenter 6.0.8") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-config-athena.13.11.html") ) { return "procedure-config-athena.13.11.html";}
else if (Guidewire_TopicMatch(TOPIC,"Importing Translation Properties") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-config-athena.13.12.html") ) { return "procedure-config-athena.13.12.html";}
else if (Guidewire_TopicMatch(TOPIC,"Translating New Display Properties and Typecodes") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-config-athena.13.13.html") ) { return "procedure-config-athena.13.13.html";}
else if (Guidewire_TopicMatch(TOPIC,"Modifying PCF files, Rules and Libraries for Unused Contact Subtypes") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-config-athena.13.14.html") ) { return "procedure-config-athena.13.14.html";}
else if (Guidewire_TopicMatch(TOPIC,"Creating Modal PCF files for Custom Lines of Business") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-config-athena.13.15.html") ) { return "procedure-config-athena.13.15.html";}
else if (Guidewire_TopicMatch(TOPIC,"Converting Velocity Templates to Gosu Templates") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-config-athena.13.16.html") ) { return "procedure-config-athena.13.16.html";}
else if (Guidewire_TopicMatch(TOPIC,"Validating the ClaimCenter 6.0.8 Configuration") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-config-athena.13.17.html") ) { return "procedure-config-athena.13.17.html";}
else if (Guidewire_TopicMatch(TOPIC,"Building and Deploying ClaimCenter 6.0.8") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-config-athena.13.18.html") ) { return "procedure-config-athena.13.18.html";}
else if (Guidewire_TopicMatch(TOPIC,"Integrating ContactCenter with ClaimCenter") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-config-athena.13.19.html") ) { return "procedure-config-athena.13.19.html";}
else if (Guidewire_TopicMatch(TOPIC,"Upgrading the ClaimCenter 4.0.x Database") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-athena.14.01.html") ) { return "procedure-db-athena.14.01.html";}
else if (Guidewire_TopicMatch(TOPIC,"Upgrading Administration Data for Testing") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-athena.14.02.html") ) { return "procedure-db-athena.14.02.html";}
else if (Guidewire_TopicMatch(TOPIC,"Identifying Data Model Issues") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-athena.14.03.html") ) { return "procedure-db-athena.14.03.html";}
else if (Guidewire_TopicMatch(TOPIC,"Verifying Batch Process and Work Queue Completion") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-athena.14.04.html") ) { return "procedure-db-athena.14.04.html";}
else if (Guidewire_TopicMatch(TOPIC,"Purging Data Prior to Upgrade") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-athena.14.05.html") ) { return "procedure-db-athena.14.05.html";}
else if (Guidewire_TopicMatch(TOPIC,"Validating the Database Schema") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-athena.14.06.html") ) { return "procedure-db-athena.14.06.html";}
else if (Guidewire_TopicMatch(TOPIC,"Checking Database Consistency") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-athena.14.07.html") ) { return "procedure-db-athena.14.07.html";}
else if (Guidewire_TopicMatch(TOPIC,"Creating a Data Distribution Report") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-athena.14.08.html") ) { return "procedure-db-athena.14.08.html";}
else if (Guidewire_TopicMatch(TOPIC,"Generating Database Statistics") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-athena.14.09.html") ) { return "procedure-db-athena.14.09.html";}
else if (Guidewire_TopicMatch(TOPIC,"Creating a Database Backup") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-athena.14.10.html") ) { return "procedure-db-athena.14.10.html";}
else if (Guidewire_TopicMatch(TOPIC,"Updating Database Infrastructure") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-athena.14.11.html") ) { return "procedure-db-athena.14.11.html";}
else if (Guidewire_TopicMatch(TOPIC,"Preparing the Database for Upgrade") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-athena.14.12.html") ) { return "procedure-db-athena.14.12.html";}
else if (Guidewire_TopicMatch(TOPIC,"Handling Extensions") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-athena.14.13.html") ) { return "procedure-db-athena.14.13.html";}
else if (Guidewire_TopicMatch(TOPIC,"Creating Extensions to Preserve Data") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-athena.14.14.html") ) { return "procedure-db-athena.14.14.html";}
else if (Guidewire_TopicMatch(TOPIC,"Disabling Encryption for Upgrade Performance") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-athena.14.15.html") ) { return "procedure-db-athena.14.15.html";}
else if (Guidewire_TopicMatch(TOPIC,"Setting Linguistic Search Collation for Oracle") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-athena.14.16.html") ) { return "procedure-db-athena.14.16.html";}
else if (Guidewire_TopicMatch(TOPIC,"Reviewing Data Model Changes") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-athena.14.17.html") ) { return "procedure-db-athena.14.17.html";}
else if (Guidewire_TopicMatch(TOPIC,"Default Size of mediumtext Columns") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-athena.14.18.html") ) { return "procedure-db-athena.14.18.html";}
else if (Guidewire_TopicMatch(TOPIC,"Exposure Fields Copied to Incident") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-athena.14.19.html") ) { return "procedure-db-athena.14.19.html";}
else if (Guidewire_TopicMatch(TOPIC,"Policy Data Model Changes") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-athena.14.20.html") ) { return "procedure-db-athena.14.20.html";}
else if (Guidewire_TopicMatch(TOPIC,"Injury Information Moved to New InjuryIncident Entity") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-athena.14.21.html") ) { return "procedure-db-athena.14.21.html";}
else if (Guidewire_TopicMatch(TOPIC,"New MessageHistory Entity") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-athena.14.22.html") ) { return "procedure-db-athena.14.22.html";}
else if (Guidewire_TopicMatch(TOPIC,"Address Entities Consolidated") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-athena.14.23.html") ) { return "procedure-db-athena.14.23.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using the IDatabaseUpgrade Plugin") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-athena.14.24.html") ) { return "procedure-db-athena.14.24.html";}
else if (Guidewire_TopicMatch(TOPIC,"Disabling the Scheduler") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-athena.14.25.html") ) { return "procedure-db-athena.14.25.html";}
else if (Guidewire_TopicMatch(TOPIC,"Suspending Message Destinations") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-athena.14.26.html") ) { return "procedure-db-athena.14.26.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring the Database Upgrade") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-athena.14.27.html") ) { return "procedure-db-athena.14.27.html";}
else if (Guidewire_TopicMatch(TOPIC,"Starting the Server to Begin Automatic Database Upgrade") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-athena.14.28.html") ) { return "procedure-db-athena.14.28.html";}
else if (Guidewire_TopicMatch(TOPIC,"Correcting Issues with Multiple Exposures on Incidents") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-athena.14.29.html") ) { return "procedure-db-athena.14.29.html";}
else if (Guidewire_TopicMatch(TOPIC,"Viewing Detailed Database Upgrade Information") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-athena.14.30.html") ) { return "procedure-db-athena.14.30.html";}
else if (Guidewire_TopicMatch(TOPIC,"Dropping Unused Columns on Oracle") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-athena.14.31.html") ) { return "procedure-db-athena.14.31.html";}
else if (Guidewire_TopicMatch(TOPIC,"Setting Claim Descriptions") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-athena.14.32.html") ) { return "procedure-db-athena.14.32.html";}
else if (Guidewire_TopicMatch(TOPIC,"Exporting Administration Data for Testing") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-athena.14.33.html") ) { return "procedure-db-athena.14.33.html";}
else if (Guidewire_TopicMatch(TOPIC,"Final Steps After The Database Upgrade is Complete") && Guidewire_FMSourceFileMatch(SRCFILE,"procedure-db-athena.14.34.html") ) { return "procedure-db-athena.14.34.html";}
else if (Guidewire_TopicMatch(TOPIC,"Upgrading Integrations and Gosu from 4.0.x") && Guidewire_FMSourceFileMatch(SRCFILE,"a-c-upgrade-tasks.15.1.html") ) { return "a-c-upgrade-tasks.15.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Overview of Upgrading Integration Plugins and Code from 4.0.x") && Guidewire_FMSourceFileMatch(SRCFILE,"a-c-upgrade-tasks.15.2.html") ) { return "a-c-upgrade-tasks.15.2.html";}
else { return("../wwhelp/topic_cannot_be_found.html"); } }

function  WWHBookData_MatchTopic(P)
{
var C=null;P=decodeURIComponent(decodeURIComponent(escape(P)));//workaround epub bug with UTF8 processing!
if (C) { return C } else { return GUIDEWIRE_TOPIC_TO_FILE(P,Guidewire_ExtractSrcFromURL());}
}
