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

else if (Guidewire_TopicMatch(TOPIC,"ClaimCenter Reporting Guide") && Guidewire_FMSourceFileMatch(SRCFILE,"cover-report.html") ) { return "cover-report.html";}
else if (Guidewire_TopicMatch(TOPIC,"About This Document") && Guidewire_FMSourceFileMatch(SRCFILE,"about.html") ) { return "about.html";}
else if (Guidewire_TopicMatch(TOPIC,"Installing Guidewire Standard Reporting") && Guidewire_FMSourceFileMatch(SRCFILE,"p-installing.html") ) { return "p-installing.html";}
else if (Guidewire_TopicMatch(TOPIC,"Before Starting the Installation") && Guidewire_FMSourceFileMatch(SRCFILE,"before_you_begin.04.1.html") ) { return "before_you_begin.04.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Guidewire ClaimCenter Standard Reporting") && Guidewire_FMSourceFileMatch(SRCFILE,"before_you_begin.04.2.html") ) { return "before_you_begin.04.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Installing Guidewire ClaimCenter") && Guidewire_FMSourceFileMatch(SRCFILE,"before_you_begin.04.3.html") ) { return "before_you_begin.04.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Guidewire Standard Reporting Installation Scenarios") && Guidewire_FMSourceFileMatch(SRCFILE,"before_you_begin.04.4.html") ) { return "before_you_begin.04.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Installing Standard Reporting for Production") && Guidewire_FMSourceFileMatch(SRCFILE,"install.05.01.html") ) { return "install.05.01.html";}
else if (Guidewire_TopicMatch(TOPIC,"Installation Checklist") && Guidewire_FMSourceFileMatch(SRCFILE,"install.05.02.html") ) { return "install.05.02.html";}
else if (Guidewire_TopicMatch(TOPIC,"Step 1: Acquire the InetSoft License Keys") && Guidewire_FMSourceFileMatch(SRCFILE,"install.05.03.html") ) { return "install.05.03.html";}
else if (Guidewire_TopicMatch(TOPIC,"Step 2: Install the Standard Reporting Files") && Guidewire_FMSourceFileMatch(SRCFILE,"install.05.04.html") ) { return "install.05.04.html";}
else if (Guidewire_TopicMatch(TOPIC,"Step 3: Create the Required Database Reporting Views") && Guidewire_FMSourceFileMatch(SRCFILE,"install.05.05.html") ) { return "install.05.05.html";}
else if (Guidewire_TopicMatch(TOPIC,"Step 4: Install the Production Report Server") && Guidewire_FMSourceFileMatch(SRCFILE,"install.05.06.html") ) { return "install.05.06.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using Apache Tomcat as the Report Server") && Guidewire_FMSourceFileMatch(SRCFILE,"install.05.07.html") ) { return "install.05.07.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using Oracle WebLogic as the Report Server") && Guidewire_FMSourceFileMatch(SRCFILE,"install.05.08.html") ) { return "install.05.08.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using IBM WebSphere as the Report Server") && Guidewire_FMSourceFileMatch(SRCFILE,"install.05.09.html") ) { return "install.05.09.html";}
else if (Guidewire_TopicMatch(TOPIC,"Step 5: Install Guidewire Standard Reporting") && Guidewire_FMSourceFileMatch(SRCFILE,"install.05.10.html") ) { return "install.05.10.html";}
else if (Guidewire_TopicMatch(TOPIC,"Step 6: Deploy the Reporting Files") && Guidewire_FMSourceFileMatch(SRCFILE,"install.05.11.html") ) { return "install.05.11.html";}
else if (Guidewire_TopicMatch(TOPIC,"Report URL") && Guidewire_FMSourceFileMatch(SRCFILE,"install.05.12.html") ) { return "install.05.12.html";}
else if (Guidewire_TopicMatch(TOPIC,"Deploying Reporting to a Tomcat Server") && Guidewire_FMSourceFileMatch(SRCFILE,"install.05.13.html") ) { return "install.05.13.html";}
else if (Guidewire_TopicMatch(TOPIC,"Deploying Reporting to a WebLogic Server") && Guidewire_FMSourceFileMatch(SRCFILE,"install.05.14.html") ) { return "install.05.14.html";}
else if (Guidewire_TopicMatch(TOPIC,"Deploying Reporting to a WebSphere Server") && Guidewire_FMSourceFileMatch(SRCFILE,"install.05.15.html") ) { return "install.05.15.html";}
else if (Guidewire_TopicMatch(TOPIC,"Step 7: Test the Reporting Configuration") && Guidewire_FMSourceFileMatch(SRCFILE,"install.05.16.html") ) { return "install.05.16.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working with Guidewire Standard Reporting") && Guidewire_FMSourceFileMatch(SRCFILE,"p-working_gwreporting.html") ) { return "p-working_gwreporting.html";}
else if (Guidewire_TopicMatch(TOPIC,"Understanding Report Security") && Guidewire_FMSourceFileMatch(SRCFILE,"security.07.1.html") ) { return "security.07.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"The Reporting Security Framework") && Guidewire_FMSourceFileMatch(SRCFILE,"security.07.2.html") ) { return "security.07.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Report Security") && Guidewire_FMSourceFileMatch(SRCFILE,"security.07.3.html") ) { return "security.07.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Upgrading from ClaimCenter 4.x to ClaimCenter 6.x") && Guidewire_FMSourceFileMatch(SRCFILE,"upgrade_i8_to_i10.08.1.html") ) { return "upgrade_i8_to_i10.08.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Upgrading from ClaimCenter 4.x to ClaimCenter 6.x with No Report Customization") && Guidewire_FMSourceFileMatch(SRCFILE,"upgrade_i8_to_i10.08.2.html") ) { return "upgrade_i8_to_i10.08.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Upgrading from ClaimCenter 4.x to ClaimCenter 6.x with Report Customization") && Guidewire_FMSourceFileMatch(SRCFILE,"upgrade_i8_to_i10.08.3.html") ) { return "upgrade_i8_to_i10.08.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Upgrading from ClaimCenter 5.x to ClaimCenter 6.x") && Guidewire_FMSourceFileMatch(SRCFILE,"upgrade_i9_to_i10.09.1.html") ) { return "upgrade_i9_to_i10.09.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Upgrading from ClaimCenter 5.x to ClaimCenter 6.x with No Report Customization") && Guidewire_FMSourceFileMatch(SRCFILE,"upgrade_i9_to_i10.09.2.html") ) { return "upgrade_i9_to_i10.09.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Upgrading from ClaimCenter 5.x to ClaimCenter 6.x with Report Customization") && Guidewire_FMSourceFileMatch(SRCFILE,"upgrade_i9_to_i10.09.3.html") ) { return "upgrade_i9_to_i10.09.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working with Reports") && Guidewire_FMSourceFileMatch(SRCFILE,"p-working_reports.html") ) { return "p-working_reports.html";}
else if (Guidewire_TopicMatch(TOPIC,"Reporting in a Clustered Environment") && Guidewire_FMSourceFileMatch(SRCFILE,"clustering.11.1.html") ) { return "clustering.11.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Guidewire Standard Reporting and Load-Balancing") && Guidewire_FMSourceFileMatch(SRCFILE,"clustering.11.2.html") ) { return "clustering.11.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring Report Clustering") && Guidewire_FMSourceFileMatch(SRCFILE,"clustering.11.3.html") ) { return "clustering.11.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Example Load Balancer httpd.conf File") && Guidewire_FMSourceFileMatch(SRCFILE,"clustering.11.4.html") ) { return "clustering.11.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using ClaimCenter Reports") && Guidewire_FMSourceFileMatch(SRCFILE,"reports.12.01.html") ) { return "reports.12.01.html";}
else if (Guidewire_TopicMatch(TOPIC,"Running ClaimCenter Reports") && Guidewire_FMSourceFileMatch(SRCFILE,"reports.12.02.html") ) { return "reports.12.02.html";}
else if (Guidewire_TopicMatch(TOPIC,"Scheduling ClaimCenter Reports") && Guidewire_FMSourceFileMatch(SRCFILE,"reports.12.03.html") ) { return "reports.12.03.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring Drill-Down Reports") && Guidewire_FMSourceFileMatch(SRCFILE,"reports.12.04.html") ) { return "reports.12.04.html";}
else if (Guidewire_TopicMatch(TOPIC,"Viewing the Guidewire Reports") && Guidewire_FMSourceFileMatch(SRCFILE,"reports.12.05.html") ) { return "reports.12.05.html";}
else if (Guidewire_TopicMatch(TOPIC,"Claim Reports") && Guidewire_FMSourceFileMatch(SRCFILE,"reports.12.06.html") ) { return "reports.12.06.html";}
else if (Guidewire_TopicMatch(TOPIC,"Claim Health Metrics Reports") && Guidewire_FMSourceFileMatch(SRCFILE,"reports.12.07.html") ) { return "reports.12.07.html";}
else if (Guidewire_TopicMatch(TOPIC,"Dashboard Reports") && Guidewire_FMSourceFileMatch(SRCFILE,"reports.12.08.html") ) { return "reports.12.08.html";}
else if (Guidewire_TopicMatch(TOPIC,"Financial Reports") && Guidewire_FMSourceFileMatch(SRCFILE,"reports.12.09.html") ) { return "reports.12.09.html";}
else if (Guidewire_TopicMatch(TOPIC,"Special Investigation Unit (SIU) Reports") && Guidewire_FMSourceFileMatch(SRCFILE,"reports.12.10.html") ) { return "reports.12.10.html";}
else if (Guidewire_TopicMatch(TOPIC,"Administering Reports") && Guidewire_FMSourceFileMatch(SRCFILE,"administer.13.01.html") ) { return "administer.13.01.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working with ClaimCenter Reporting Permissions") && Guidewire_FMSourceFileMatch(SRCFILE,"administer.13.02.html") ) { return "administer.13.02.html";}
else if (Guidewire_TopicMatch(TOPIC,"Synchronizing Reports with the InetSoft Server") && Guidewire_FMSourceFileMatch(SRCFILE,"administer.13.03.html") ) { return "administer.13.03.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring Reports to Access Claim Information") && Guidewire_FMSourceFileMatch(SRCFILE,"administer.13.04.html") ) { return "administer.13.04.html";}
else if (Guidewire_TopicMatch(TOPIC,"Administering Report Printing") && Guidewire_FMSourceFileMatch(SRCFILE,"administer.13.05.html") ) { return "administer.13.05.html";}
else if (Guidewire_TopicMatch(TOPIC,"Exporting Reports in Microsoft Excel Format") && Guidewire_FMSourceFileMatch(SRCFILE,"administer.13.06.html") ) { return "administer.13.06.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working with the InetSoft Enterprise Manager") && Guidewire_FMSourceFileMatch(SRCFILE,"administer.13.07.html") ) { return "administer.13.07.html";}
else if (Guidewire_TopicMatch(TOPIC,"Viewing System Logs") && Guidewire_FMSourceFileMatch(SRCFILE,"administer.13.08.html") ) { return "administer.13.08.html";}
else if (Guidewire_TopicMatch(TOPIC,"Viewing Report SQL Queries") && Guidewire_FMSourceFileMatch(SRCFILE,"administer.13.09.html") ) { return "administer.13.09.html";}
else if (Guidewire_TopicMatch(TOPIC,"Integrating Style Report with a Third-Party Logger") && Guidewire_FMSourceFileMatch(SRCFILE,"administer.13.10.html") ) { return "administer.13.10.html";}
else if (Guidewire_TopicMatch(TOPIC,"Reducing the Number of Cached Temporary Files") && Guidewire_FMSourceFileMatch(SRCFILE,"administer.13.11.html") ) { return "administer.13.11.html";}
else if (Guidewire_TopicMatch(TOPIC,"Understanding InetSoft Configuration Options") && Guidewire_FMSourceFileMatch(SRCFILE,"administer.13.12.html") ) { return "administer.13.12.html";}
else if (Guidewire_TopicMatch(TOPIC,"Troubleshooting Guidewire Standard Reporting") && Guidewire_FMSourceFileMatch(SRCFILE,"administer.13.13.html") ) { return "administer.13.13.html";}
else if (Guidewire_TopicMatch(TOPIC,"Problems with Report Data") && Guidewire_FMSourceFileMatch(SRCFILE,"administer.13.14.html") ) { return "administer.13.14.html";}
else if (Guidewire_TopicMatch(TOPIC,"Problems with Report Auditing") && Guidewire_FMSourceFileMatch(SRCFILE,"administer.13.15.html") ) { return "administer.13.15.html";}
else if (Guidewire_TopicMatch(TOPIC,"Problems Contacting the ClaimCenter Reporting Database") && Guidewire_FMSourceFileMatch(SRCFILE,"administer.13.16.html") ) { return "administer.13.16.html";}
else if (Guidewire_TopicMatch(TOPIC,"Problems Opening Reports from within ClaimCenter") && Guidewire_FMSourceFileMatch(SRCFILE,"administer.13.17.html") ) { return "administer.13.17.html";}
else if (Guidewire_TopicMatch(TOPIC,"Performance Issues Using F5 Proxy as a Load Balancer") && Guidewire_FMSourceFileMatch(SRCFILE,"administer.13.18.html") ) { return "administer.13.18.html";}
else if (Guidewire_TopicMatch(TOPIC,"Problems Related to Tomcat") && Guidewire_FMSourceFileMatch(SRCFILE,"administer.13.19.html") ) { return "administer.13.19.html";}
else if (Guidewire_TopicMatch(TOPIC,"Problems with the InetSoft Scheduler") && Guidewire_FMSourceFileMatch(SRCFILE,"administer.13.20.html") ) { return "administer.13.20.html";}
else if (Guidewire_TopicMatch(TOPIC,"Problems with InetSoft SRSecurityException") && Guidewire_FMSourceFileMatch(SRCFILE,"administer.13.21.html") ) { return "administer.13.21.html";}
else if (Guidewire_TopicMatch(TOPIC,"Problems with InetSoft installation on Microsoft Vista") && Guidewire_FMSourceFileMatch(SRCFILE,"administer.13.22.html") ) { return "administer.13.22.html";}
else if (Guidewire_TopicMatch(TOPIC,"Optimizing Report Performance") && Guidewire_FMSourceFileMatch(SRCFILE,"performance.14.1.html") ) { return "performance.14.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Optimizing the Reporting File Structure") && Guidewire_FMSourceFileMatch(SRCFILE,"performance.14.2.html") ) { return "performance.14.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Structuring Reporting Views") && Guidewire_FMSourceFileMatch(SRCFILE,"performance.14.3.html") ) { return "performance.14.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Streaming, Caching, and Clustering") && Guidewire_FMSourceFileMatch(SRCFILE,"performance.14.4.html") ) { return "performance.14.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working with Report Development") && Guidewire_FMSourceFileMatch(SRCFILE,"p-working_reportdesign.html") ) { return "p-working_reportdesign.html";}
else if (Guidewire_TopicMatch(TOPIC,"Installing InetSoft Style Report Enterprise for Development") && Guidewire_FMSourceFileMatch(SRCFILE,"inetsoft.16.1.html") ) { return "inetsoft.16.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Installing the InetSoft Application") && Guidewire_FMSourceFileMatch(SRCFILE,"inetsoft.16.2.html") ) { return "inetsoft.16.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Acquire the InetSoft Application Software") && Guidewire_FMSourceFileMatch(SRCFILE,"inetsoft.16.3.html") ) { return "inetsoft.16.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Install Style Report (Windows)") && Guidewire_FMSourceFileMatch(SRCFILE,"inetsoft.16.4.html") ) { return "inetsoft.16.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring InetSoft Style Report") && Guidewire_FMSourceFileMatch(SRCFILE,"inetsoft.16.5.html") ) { return "inetsoft.16.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Launching the Reporting Tools") && Guidewire_FMSourceFileMatch(SRCFILE,"inetsoft.16.6.html") ) { return "inetsoft.16.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Working with the Report Designer") && Guidewire_FMSourceFileMatch(SRCFILE,"report_designer.17.1.html") ) { return "report_designer.17.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Setting Report Designer Configuration Parameters") && Guidewire_FMSourceFileMatch(SRCFILE,"report_designer.17.2.html") ) { return "report_designer.17.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring the Data Source") && Guidewire_FMSourceFileMatch(SRCFILE,"report_designer.17.3.html") ) { return "report_designer.17.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Deploying Your Reports") && Guidewire_FMSourceFileMatch(SRCFILE,"report_designer.17.4.html") ) { return "report_designer.17.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Report Naming Guidelines") && Guidewire_FMSourceFileMatch(SRCFILE,"report_designer.17.5.html") ) { return "report_designer.17.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Report Localization") && Guidewire_FMSourceFileMatch(SRCFILE,"localization.18.1.html") ) { return "localization.18.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"InetSoft and Localization") && Guidewire_FMSourceFileMatch(SRCFILE,"localization.18.2.html") ) { return "localization.18.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Registering a Locale in InetSoft Enterprise Manager") && Guidewire_FMSourceFileMatch(SRCFILE,"localization.18.3.html") ) { return "localization.18.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Setting the Report Currency Display") && Guidewire_FMSourceFileMatch(SRCFILE,"localization.18.4.html") ) { return "localization.18.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring Localized Reports in InetSoft Report Designer") && Guidewire_FMSourceFileMatch(SRCFILE,"localization.18.5.html") ) { return "localization.18.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Setting the InetSoft Calendar Widget") && Guidewire_FMSourceFileMatch(SRCFILE,"localization.18.6.html") ) { return "localization.18.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Generating Localized ClaimCenter Reports") && Guidewire_FMSourceFileMatch(SRCFILE,"localization.18.7.html") ) { return "localization.18.7.html";}
else if (Guidewire_TopicMatch(TOPIC,"Configuring Direct Access for ClaimCenter Localized Reports") && Guidewire_FMSourceFileMatch(SRCFILE,"localization.18.8.html") ) { return "localization.18.8.html";}
else if (Guidewire_TopicMatch(TOPIC,"Localization and the Reporting Database") && Guidewire_FMSourceFileMatch(SRCFILE,"localization.18.9.html") ) { return "localization.18.9.html";}
else { return("../wwhelp/topic_cannot_be_found.html"); } }

function  WWHBookData_MatchTopic(P)
{
var C=null;P=decodeURIComponent(decodeURIComponent(escape(P)));//workaround epub bug with UTF8 processing!
if (C) { return C } else { return GUIDEWIRE_TOPIC_TO_FILE(P,Guidewire_ExtractSrcFromURL());}
}
