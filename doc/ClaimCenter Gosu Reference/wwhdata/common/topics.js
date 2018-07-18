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

else if (Guidewire_TopicMatch(TOPIC,"Gosu Reference Guide") && Guidewire_FMSourceFileMatch(SRCFILE,"cover-gscript.html") ) { return "cover-gscript.html";}
else if (Guidewire_TopicMatch(TOPIC,"About This Document") && Guidewire_FMSourceFileMatch(SRCFILE,"about.html") ) { return "about.html";}
else if (Guidewire_TopicMatch(TOPIC,"Gosu Introduction") && Guidewire_FMSourceFileMatch(SRCFILE,"intro.03.01.html") ) { return "intro.03.01.html";}
else if (Guidewire_TopicMatch(TOPIC,"Welcome to Gosu") && Guidewire_FMSourceFileMatch(SRCFILE,"intro.03.02.html") ) { return "intro.03.02.html";}
else if (Guidewire_TopicMatch(TOPIC,"More About the Gosu Type System") && Guidewire_FMSourceFileMatch(SRCFILE,"intro.03.03.html") ) { return "intro.03.03.html";}
else if (Guidewire_TopicMatch(TOPIC,"Compile Time Error Prevention") && Guidewire_FMSourceFileMatch(SRCFILE,"intro.03.04.html") ) { return "intro.03.04.html";}
else if (Guidewire_TopicMatch(TOPIC,"Type Inference") && Guidewire_FMSourceFileMatch(SRCFILE,"intro.03.05.html") ) { return "intro.03.05.html";}
else if (Guidewire_TopicMatch(TOPIC,"Intelligent Code Completion") && Guidewire_FMSourceFileMatch(SRCFILE,"intro.03.06.html") ) { return "intro.03.06.html";}
else if (Guidewire_TopicMatch(TOPIC,"Refactoring") && Guidewire_FMSourceFileMatch(SRCFILE,"intro.03.07.html") ) { return "intro.03.07.html";}
else if (Guidewire_TopicMatch(TOPIC,"Type Usage Searching") && Guidewire_FMSourceFileMatch(SRCFILE,"intro.03.08.html") ) { return "intro.03.08.html";}
else if (Guidewire_TopicMatch(TOPIC,"Property Accessor Paths are Null Safe") && Guidewire_FMSourceFileMatch(SRCFILE,"intro.03.09.html") ) { return "intro.03.09.html";}
else if (Guidewire_TopicMatch(TOPIC,"Generics in Gosu") && Guidewire_FMSourceFileMatch(SRCFILE,"intro.03.10.html") ) { return "intro.03.10.html";}
else if (Guidewire_TopicMatch(TOPIC,"Gosu Primitives Types") && Guidewire_FMSourceFileMatch(SRCFILE,"intro.03.11.html") ) { return "intro.03.11.html";}
else if (Guidewire_TopicMatch(TOPIC,"Custom Type Loaders") && Guidewire_FMSourceFileMatch(SRCFILE,"intro.03.12.html") ) { return "intro.03.12.html";}
else if (Guidewire_TopicMatch(TOPIC,"Gosu Case Sensitivity") && Guidewire_FMSourceFileMatch(SRCFILE,"intro.03.13.html") ) { return "intro.03.13.html";}
else if (Guidewire_TopicMatch(TOPIC,"Gosu Statement Terminators") && Guidewire_FMSourceFileMatch(SRCFILE,"intro.03.14.html") ) { return "intro.03.14.html";}
else if (Guidewire_TopicMatch(TOPIC,"Gosu Comments") && Guidewire_FMSourceFileMatch(SRCFILE,"intro.03.15.html") ) { return "intro.03.15.html";}
else if (Guidewire_TopicMatch(TOPIC,"Gosu Reserved Words") && Guidewire_FMSourceFileMatch(SRCFILE,"intro.03.16.html") ) { return "intro.03.16.html";}
else if (Guidewire_TopicMatch(TOPIC,"Gosu Generated Documentation") && Guidewire_FMSourceFileMatch(SRCFILE,"intro.03.17.html") ) { return "intro.03.17.html";}
else if (Guidewire_TopicMatch(TOPIC,"Running Programs") && Guidewire_FMSourceFileMatch(SRCFILE,"intro.03.18.html") ) { return "intro.03.18.html";}
else if (Guidewire_TopicMatch(TOPIC,"Notable Differences Between Gosu and Java") && Guidewire_FMSourceFileMatch(SRCFILE,"intro.03.19.html") ) { return "intro.03.19.html";}
else if (Guidewire_TopicMatch(TOPIC,"Get Ready for Gosu") && Guidewire_FMSourceFileMatch(SRCFILE,"intro.03.20.html") ) { return "intro.03.20.html";}
else if (Guidewire_TopicMatch(TOPIC,"Gosu Types") && Guidewire_FMSourceFileMatch(SRCFILE,"datatypes.04.01.html") ) { return "datatypes.04.01.html";}
else if (Guidewire_TopicMatch(TOPIC,"Built-in Types") && Guidewire_FMSourceFileMatch(SRCFILE,"datatypes.04.02.html") ) { return "datatypes.04.02.html";}
else if (Guidewire_TopicMatch(TOPIC,"Array") && Guidewire_FMSourceFileMatch(SRCFILE,"datatypes.04.03.html") ) { return "datatypes.04.03.html";}
else if (Guidewire_TopicMatch(TOPIC,"Boolean") && Guidewire_FMSourceFileMatch(SRCFILE,"datatypes.04.04.html") ) { return "datatypes.04.04.html";}
else if (Guidewire_TopicMatch(TOPIC,"DateTime") && Guidewire_FMSourceFileMatch(SRCFILE,"datatypes.04.05.html") ) { return "datatypes.04.05.html";}
else if (Guidewire_TopicMatch(TOPIC,"Key") && Guidewire_FMSourceFileMatch(SRCFILE,"datatypes.04.06.html") ) { return "datatypes.04.06.html";}
else if (Guidewire_TopicMatch(TOPIC,"Number") && Guidewire_FMSourceFileMatch(SRCFILE,"datatypes.04.07.html") ) { return "datatypes.04.07.html";}
else if (Guidewire_TopicMatch(TOPIC,"Object") && Guidewire_FMSourceFileMatch(SRCFILE,"datatypes.04.08.html") ) { return "datatypes.04.08.html";}
else if (Guidewire_TopicMatch(TOPIC,"String") && Guidewire_FMSourceFileMatch(SRCFILE,"datatypes.04.09.html") ) { return "datatypes.04.09.html";}
else if (Guidewire_TopicMatch(TOPIC,"Type") && Guidewire_FMSourceFileMatch(SRCFILE,"datatypes.04.10.html") ) { return "datatypes.04.10.html";}
else if (Guidewire_TopicMatch(TOPIC,"Primitive Types") && Guidewire_FMSourceFileMatch(SRCFILE,"datatypes.04.11.html") ) { return "datatypes.04.11.html";}
else if (Guidewire_TopicMatch(TOPIC,"Access to Java Types") && Guidewire_FMSourceFileMatch(SRCFILE,"datatypes.04.12.html") ) { return "datatypes.04.12.html";}
else if (Guidewire_TopicMatch(TOPIC,"Arrays") && Guidewire_FMSourceFileMatch(SRCFILE,"datatypes.04.13.html") ) { return "datatypes.04.13.html";}
else if (Guidewire_TopicMatch(TOPIC,"Object Instantiation and Properties") && Guidewire_FMSourceFileMatch(SRCFILE,"datatypes.04.14.html") ) { return "datatypes.04.14.html";}
else if (Guidewire_TopicMatch(TOPIC,"Entities") && Guidewire_FMSourceFileMatch(SRCFILE,"datatypes.04.15.html") ) { return "datatypes.04.15.html";}
else if (Guidewire_TopicMatch(TOPIC,"Typekeys") && Guidewire_FMSourceFileMatch(SRCFILE,"datatypes.04.16.html") ) { return "datatypes.04.16.html";}
else if (Guidewire_TopicMatch(TOPIC,"Gosu Operators and Expressions") && Guidewire_FMSourceFileMatch(SRCFILE,"expressions.05.01.html") ) { return "expressions.05.01.html";}
else if (Guidewire_TopicMatch(TOPIC,"Gosu Operators") && Guidewire_FMSourceFileMatch(SRCFILE,"expressions.05.02.html") ) { return "expressions.05.02.html";}
else if (Guidewire_TopicMatch(TOPIC,"Operator Precedence") && Guidewire_FMSourceFileMatch(SRCFILE,"expressions.05.03.html") ) { return "expressions.05.03.html";}
else if (Guidewire_TopicMatch(TOPIC,"Standard Gosu Expressions") && Guidewire_FMSourceFileMatch(SRCFILE,"expressions.05.04.html") ) { return "expressions.05.04.html";}
else if (Guidewire_TopicMatch(TOPIC,"Arithmetic Expressions") && Guidewire_FMSourceFileMatch(SRCFILE,"expressions.05.05.html") ) { return "expressions.05.05.html";}
else if (Guidewire_TopicMatch(TOPIC,"Equality Expressions") && Guidewire_FMSourceFileMatch(SRCFILE,"expressions.05.06.html") ) { return "expressions.05.06.html";}
else if (Guidewire_TopicMatch(TOPIC,"Evaluation Expressions") && Guidewire_FMSourceFileMatch(SRCFILE,"expressions.05.07.html") ) { return "expressions.05.07.html";}
else if (Guidewire_TopicMatch(TOPIC,"Existence Testing Expressions") && Guidewire_FMSourceFileMatch(SRCFILE,"expressions.05.08.html") ) { return "expressions.05.08.html";}
else if (Guidewire_TopicMatch(TOPIC,"Logical Expressions") && Guidewire_FMSourceFileMatch(SRCFILE,"expressions.05.09.html") ) { return "expressions.05.09.html";}
else if (Guidewire_TopicMatch(TOPIC,"New Object Expressions") && Guidewire_FMSourceFileMatch(SRCFILE,"expressions.05.10.html") ) { return "expressions.05.10.html";}
else if (Guidewire_TopicMatch(TOPIC,"Relational Expressions") && Guidewire_FMSourceFileMatch(SRCFILE,"expressions.05.11.html") ) { return "expressions.05.11.html";}
else if (Guidewire_TopicMatch(TOPIC,"Unary Expressions") && Guidewire_FMSourceFileMatch(SRCFILE,"expressions.05.12.html") ) { return "expressions.05.12.html";}
else if (Guidewire_TopicMatch(TOPIC,"Importing Types and Package Namespaces") && Guidewire_FMSourceFileMatch(SRCFILE,"expressions.05.13.html") ) { return "expressions.05.13.html";}
else if (Guidewire_TopicMatch(TOPIC,"Conditional Ternary Expressions") && Guidewire_FMSourceFileMatch(SRCFILE,"expressions.05.14.html") ) { return "expressions.05.14.html";}
else if (Guidewire_TopicMatch(TOPIC,"Special Gosu Expressions") && Guidewire_FMSourceFileMatch(SRCFILE,"expressions.05.15.html") ) { return "expressions.05.15.html";}
else if (Guidewire_TopicMatch(TOPIC,"Entity Literals") && Guidewire_FMSourceFileMatch(SRCFILE,"expressions.05.16.html") ) { return "expressions.05.16.html";}
else if (Guidewire_TopicMatch(TOPIC,"Function Calls") && Guidewire_FMSourceFileMatch(SRCFILE,"expressions.05.17.html") ) { return "expressions.05.17.html";}
else if (Guidewire_TopicMatch(TOPIC,"Handling Null Values") && Guidewire_FMSourceFileMatch(SRCFILE,"expressions.05.18.html") ) { return "expressions.05.18.html";}
else if (Guidewire_TopicMatch(TOPIC,"Static Method Calls") && Guidewire_FMSourceFileMatch(SRCFILE,"expressions.05.19.html") ) { return "expressions.05.19.html";}
else if (Guidewire_TopicMatch(TOPIC,"Static Property Paths") && Guidewire_FMSourceFileMatch(SRCFILE,"expressions.05.20.html") ) { return "expressions.05.20.html";}
else if (Guidewire_TopicMatch(TOPIC,"Entity and Typekey Type Literals") && Guidewire_FMSourceFileMatch(SRCFILE,"expressions.05.21.html") ) { return "expressions.05.21.html";}
else if (Guidewire_TopicMatch(TOPIC,"Statements") && Guidewire_FMSourceFileMatch(SRCFILE,"statements.06.1.html") ) { return "statements.06.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Gosu Statements") && Guidewire_FMSourceFileMatch(SRCFILE,"statements.06.2.html") ) { return "statements.06.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Gosu Variables") && Guidewire_FMSourceFileMatch(SRCFILE,"statements.06.3.html") ) { return "statements.06.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Gosu Conditional Execution and Looping") && Guidewire_FMSourceFileMatch(SRCFILE,"statements.06.4.html") ) { return "statements.06.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Gosu Functions") && Guidewire_FMSourceFileMatch(SRCFILE,"statements.06.5.html") ) { return "statements.06.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Exception Handling") && Guidewire_FMSourceFileMatch(SRCFILE,"exceptionhandling.07.1.html") ) { return "exceptionhandling.07.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Try-Catch-Finally Constructions") && Guidewire_FMSourceFileMatch(SRCFILE,"exceptionhandling.07.2.html") ) { return "exceptionhandling.07.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Throw Statements") && Guidewire_FMSourceFileMatch(SRCFILE,"exceptionhandling.07.3.html") ) { return "exceptionhandling.07.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Checked Exceptions in Gosu") && Guidewire_FMSourceFileMatch(SRCFILE,"exceptionhandling.07.4.html") ) { return "exceptionhandling.07.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Object Lifecycle Management (\u2018using\u2019 Clauses)") && Guidewire_FMSourceFileMatch(SRCFILE,"exceptionhandling.07.5.html") ) { return "exceptionhandling.07.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Java and Gosu") && Guidewire_FMSourceFileMatch(SRCFILE,"java-gosu.08.01.html") ) { return "java-gosu.08.01.html";}
else if (Guidewire_TopicMatch(TOPIC,"Overview of Calling Java from Gosu") && Guidewire_FMSourceFileMatch(SRCFILE,"java-gosu.08.02.html") ) { return "java-gosu.08.02.html";}
else if (Guidewire_TopicMatch(TOPIC,"Deploying Your Java Classes") && Guidewire_FMSourceFileMatch(SRCFILE,"java-gosu.08.03.html") ) { return "java-gosu.08.03.html";}
else if (Guidewire_TopicMatch(TOPIC,"Java Class Loading, Delegation, and Package Naming") && Guidewire_FMSourceFileMatch(SRCFILE,"java-gosu.08.04.html") ) { return "java-gosu.08.04.html";}
else if (Guidewire_TopicMatch(TOPIC,"Special Handling of Collections, Arrays, Maps") && Guidewire_FMSourceFileMatch(SRCFILE,"java-gosu.08.05.html") ) { return "java-gosu.08.05.html";}
else if (Guidewire_TopicMatch(TOPIC,"Java Entity Libraries Overview") && Guidewire_FMSourceFileMatch(SRCFILE,"java-gosu.08.06.html") ) { return "java-gosu.08.06.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using Java Entity Libraries") && Guidewire_FMSourceFileMatch(SRCFILE,"java-gosu.08.07.html") ) { return "java-gosu.08.07.html";}
else if (Guidewire_TopicMatch(TOPIC,"Argument Conversion in Java Entity Libraries") && Guidewire_FMSourceFileMatch(SRCFILE,"java-gosu.08.08.html") ) { return "java-gosu.08.08.html";}
else if (Guidewire_TopicMatch(TOPIC,"How Entities and Typekeys Convert to and from Java") && Guidewire_FMSourceFileMatch(SRCFILE,"java-gosu.08.09.html") ) { return "java-gosu.08.09.html";}
else if (Guidewire_TopicMatch(TOPIC,"Java Entity Utility APIs") && Guidewire_FMSourceFileMatch(SRCFILE,"java-gosu.08.10.html") ) { return "java-gosu.08.10.html";}
else if (Guidewire_TopicMatch(TOPIC,"Which Java Types Export to Java Entity Libraries") && Guidewire_FMSourceFileMatch(SRCFILE,"java-gosu.08.11.html") ) { return "java-gosu.08.11.html";}
else if (Guidewire_TopicMatch(TOPIC,"Non-entity Types in the Java Entity Libraries") && Guidewire_FMSourceFileMatch(SRCFILE,"java-gosu.08.12.html") ) { return "java-gosu.08.12.html";}
else if (Guidewire_TopicMatch(TOPIC,"Static Methods and Variables in Java Entity Libraries") && Guidewire_FMSourceFileMatch(SRCFILE,"java-gosu.08.13.html") ) { return "java-gosu.08.13.html";}
else if (Guidewire_TopicMatch(TOPIC,"Gosu Enhancements in Java Entity Libraries") && Guidewire_FMSourceFileMatch(SRCFILE,"java-gosu.08.14.html") ) { return "java-gosu.08.14.html";}
else if (Guidewire_TopicMatch(TOPIC,"Remapping Package and Type Names in Java Entity Libraries") && Guidewire_FMSourceFileMatch(SRCFILE,"java-gosu.08.15.html") ) { return "java-gosu.08.15.html";}
else if (Guidewire_TopicMatch(TOPIC,"Testing Your Entity Code in Java (EntityMock)") && Guidewire_FMSourceFileMatch(SRCFILE,"java-gosu.08.16.html") ) { return "java-gosu.08.16.html";}
else if (Guidewire_TopicMatch(TOPIC,"Query Builder") && Guidewire_FMSourceFileMatch(SRCFILE,"querybuilder.09.01.html") ) { return "querybuilder.09.01.html";}
else if (Guidewire_TopicMatch(TOPIC,"Query Builder Overview") && Guidewire_FMSourceFileMatch(SRCFILE,"querybuilder.09.02.html") ) { return "querybuilder.09.02.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using Comparison Predicates with Null Values") && Guidewire_FMSourceFileMatch(SRCFILE,"querybuilder.09.03.html") ) { return "querybuilder.09.03.html";}
else if (Guidewire_TopicMatch(TOPIC,"Viewing the SQL for a Query") && Guidewire_FMSourceFileMatch(SRCFILE,"querybuilder.09.04.html") ) { return "querybuilder.09.04.html";}
else if (Guidewire_TopicMatch(TOPIC,"Column References") && Guidewire_FMSourceFileMatch(SRCFILE,"querybuilder.09.05.html") ) { return "querybuilder.09.05.html";}
else if (Guidewire_TopicMatch(TOPIC,"Database Functions") && Guidewire_FMSourceFileMatch(SRCFILE,"querybuilder.09.06.html") ) { return "querybuilder.09.06.html";}
else if (Guidewire_TopicMatch(TOPIC,"Combining Queries and Predicates") && Guidewire_FMSourceFileMatch(SRCFILE,"querybuilder.09.07.html") ) { return "querybuilder.09.07.html";}
else if (Guidewire_TopicMatch(TOPIC,"Returning Query Results") && Guidewire_FMSourceFileMatch(SRCFILE,"querybuilder.09.08.html") ) { return "querybuilder.09.08.html";}
else if (Guidewire_TopicMatch(TOPIC,"Getting Single Rows") && Guidewire_FMSourceFileMatch(SRCFILE,"querybuilder.09.09.html") ) { return "querybuilder.09.09.html";}
else if (Guidewire_TopicMatch(TOPIC,"Getting Results With an Iterator") && Guidewire_FMSourceFileMatch(SRCFILE,"querybuilder.09.10.html") ) { return "querybuilder.09.10.html";}
else if (Guidewire_TopicMatch(TOPIC,"Converting to Collections, Lists, Sets, and Arrays") && Guidewire_FMSourceFileMatch(SRCFILE,"querybuilder.09.11.html") ) { return "querybuilder.09.11.html";}
else if (Guidewire_TopicMatch(TOPIC,"Selecting Columns and Returning Results in Custom Formats") && Guidewire_FMSourceFileMatch(SRCFILE,"querybuilder.09.12.html") ) { return "querybuilder.09.12.html";}
else if (Guidewire_TopicMatch(TOPIC,"Ordering results") && Guidewire_FMSourceFileMatch(SRCFILE,"querybuilder.09.13.html") ) { return "querybuilder.09.13.html";}
else if (Guidewire_TopicMatch(TOPIC,"Setting the Page Size For a Query") && Guidewire_FMSourceFileMatch(SRCFILE,"querybuilder.09.14.html") ) { return "querybuilder.09.14.html";}
else if (Guidewire_TopicMatch(TOPIC,"Advanced Queries (Subselects and Joins)") && Guidewire_FMSourceFileMatch(SRCFILE,"querybuilder.09.15.html") ) { return "querybuilder.09.15.html";}
else if (Guidewire_TopicMatch(TOPIC,"Join Method") && Guidewire_FMSourceFileMatch(SRCFILE,"querybuilder.09.16.html") ) { return "querybuilder.09.16.html";}
else if (Guidewire_TopicMatch(TOPIC,"Find Expressions") && Guidewire_FMSourceFileMatch(SRCFILE,"find.html") ) { return "find.html";}
else if (Guidewire_TopicMatch(TOPIC,"Classes") && Guidewire_FMSourceFileMatch(SRCFILE,"classes.11.1.html") ) { return "classes.11.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"What Are Classes") && Guidewire_FMSourceFileMatch(SRCFILE,"classes.11.2.html") ) { return "classes.11.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Creating and Instantiating Classes") && Guidewire_FMSourceFileMatch(SRCFILE,"classes.11.3.html") ) { return "classes.11.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Properties") && Guidewire_FMSourceFileMatch(SRCFILE,"classes.11.4.html") ) { return "classes.11.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Modifiers") && Guidewire_FMSourceFileMatch(SRCFILE,"classes.11.5.html") ) { return "classes.11.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Inner Classes") && Guidewire_FMSourceFileMatch(SRCFILE,"classes.11.6.html") ) { return "classes.11.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Enumerations") && Guidewire_FMSourceFileMatch(SRCFILE,"enumerations.12.1.html") ) { return "enumerations.12.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using Enumerations") && Guidewire_FMSourceFileMatch(SRCFILE,"enumerations.12.2.html") ) { return "enumerations.12.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Interfaces") && Guidewire_FMSourceFileMatch(SRCFILE,"interfaces.13.1.html") ) { return "interfaces.13.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"What is an Interface") && Guidewire_FMSourceFileMatch(SRCFILE,"interfaces.13.2.html") ) { return "interfaces.13.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Defining and Using an Interface") && Guidewire_FMSourceFileMatch(SRCFILE,"interfaces.13.3.html") ) { return "interfaces.13.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Composition") && Guidewire_FMSourceFileMatch(SRCFILE,"composition.14.1.html") ) { return "composition.14.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using Gosu Composition") && Guidewire_FMSourceFileMatch(SRCFILE,"composition.14.2.html") ) { return "composition.14.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Annotations and Interceptors") && Guidewire_FMSourceFileMatch(SRCFILE,"annotations.15.1.html") ) { return "annotations.15.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Annotating a Class, Method, Type, or Constructor") && Guidewire_FMSourceFileMatch(SRCFILE,"annotations.15.2.html") ) { return "annotations.15.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Annotations at Run Time") && Guidewire_FMSourceFileMatch(SRCFILE,"annotations.15.3.html") ) { return "annotations.15.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Defining Your Own Annotations") && Guidewire_FMSourceFileMatch(SRCFILE,"annotations.15.4.html") ) { return "annotations.15.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Gosu Interceptors") && Guidewire_FMSourceFileMatch(SRCFILE,"annotations.15.5.html") ) { return "annotations.15.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Enhancements") && Guidewire_FMSourceFileMatch(SRCFILE,"enhancements.16.1.html") ) { return "enhancements.16.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using Enhancements") && Guidewire_FMSourceFileMatch(SRCFILE,"enhancements.16.2.html") ) { return "enhancements.16.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Gosu Blocks") && Guidewire_FMSourceFileMatch(SRCFILE,"blocks.17.1.html") ) { return "blocks.17.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"What Are Blocks") && Guidewire_FMSourceFileMatch(SRCFILE,"blocks.17.2.html") ) { return "blocks.17.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Basic Block Definition and Invocation") && Guidewire_FMSourceFileMatch(SRCFILE,"blocks.17.3.html") ) { return "blocks.17.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Variable Scope and Capturing Variables In Blocks") && Guidewire_FMSourceFileMatch(SRCFILE,"blocks.17.4.html") ) { return "blocks.17.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Argument Type Inference Shortcut In Certain Cases") && Guidewire_FMSourceFileMatch(SRCFILE,"blocks.17.5.html") ) { return "blocks.17.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Block Type Literals") && Guidewire_FMSourceFileMatch(SRCFILE,"blocks.17.6.html") ) { return "blocks.17.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Blocks and Collections") && Guidewire_FMSourceFileMatch(SRCFILE,"blocks.17.7.html") ) { return "blocks.17.7.html";}
else if (Guidewire_TopicMatch(TOPIC,"Blocks as Shortcuts for Anonymous Classes") && Guidewire_FMSourceFileMatch(SRCFILE,"blocks.17.8.html") ) { return "blocks.17.8.html";}
else if (Guidewire_TopicMatch(TOPIC,"Gosu Generics") && Guidewire_FMSourceFileMatch(SRCFILE,"generics.18.1.html") ) { return "generics.18.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Gosu Generics Overview") && Guidewire_FMSourceFileMatch(SRCFILE,"generics.18.2.html") ) { return "generics.18.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using Gosu Generics") && Guidewire_FMSourceFileMatch(SRCFILE,"generics.18.3.html") ) { return "generics.18.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Other Unbounded Generics Wildcards") && Guidewire_FMSourceFileMatch(SRCFILE,"generics.18.4.html") ) { return "generics.18.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Generics and Blocks") && Guidewire_FMSourceFileMatch(SRCFILE,"generics.18.5.html") ) { return "generics.18.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"How Generics Help Define Collection APIs") && Guidewire_FMSourceFileMatch(SRCFILE,"generics.18.6.html") ) { return "generics.18.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Multiple Dimensionality Generics") && Guidewire_FMSourceFileMatch(SRCFILE,"generics.18.7.html") ) { return "generics.18.7.html";}
else if (Guidewire_TopicMatch(TOPIC,"Generics With Custom \u2018Containers\u2019") && Guidewire_FMSourceFileMatch(SRCFILE,"generics.18.8.html") ) { return "generics.18.8.html";}
else if (Guidewire_TopicMatch(TOPIC,"Collections") && Guidewire_FMSourceFileMatch(SRCFILE,"collections.19.1.html") ) { return "collections.19.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Basic Lists") && Guidewire_FMSourceFileMatch(SRCFILE,"collections.19.2.html") ) { return "collections.19.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Basic HashMaps") && Guidewire_FMSourceFileMatch(SRCFILE,"collections.19.3.html") ) { return "collections.19.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"List and Array Expansion (*.)") && Guidewire_FMSourceFileMatch(SRCFILE,"collections.19.4.html") ) { return "collections.19.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Enhancement Reference for Collections and Related Types") && Guidewire_FMSourceFileMatch(SRCFILE,"collections.19.5.html") ) { return "collections.19.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Collections Enhancement Methods") && Guidewire_FMSourceFileMatch(SRCFILE,"collections.19.6.html") ) { return "collections.19.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Gosu and XML") && Guidewire_FMSourceFileMatch(SRCFILE,"xml.20.01.html") ) { return "xml.20.01.html";}
else if (Guidewire_TopicMatch(TOPIC,"Manipulating XML Overview") && Guidewire_FMSourceFileMatch(SRCFILE,"xml.20.02.html") ) { return "xml.20.02.html";}
else if (Guidewire_TopicMatch(TOPIC,"Exporting XML Data") && Guidewire_FMSourceFileMatch(SRCFILE,"xml.20.03.html") ) { return "xml.20.03.html";}
else if (Guidewire_TopicMatch(TOPIC,"Manipulating XML as Untyped Nodes") && Guidewire_FMSourceFileMatch(SRCFILE,"xml.20.04.html") ) { return "xml.20.04.html";}
else if (Guidewire_TopicMatch(TOPIC,"Collection-like Enhancements with XML Nodes") && Guidewire_FMSourceFileMatch(SRCFILE,"xml.20.05.html") ) { return "xml.20.05.html";}
else if (Guidewire_TopicMatch(TOPIC,"Structured XML Using XSDs") && Guidewire_FMSourceFileMatch(SRCFILE,"xml.20.06.html") ) { return "xml.20.06.html";}
else if (Guidewire_TopicMatch(TOPIC,"The Guidewire XML (GX) Modeler") && Guidewire_FMSourceFileMatch(SRCFILE,"xml.20.07.html") ) { return "xml.20.07.html";}
else if (Guidewire_TopicMatch(TOPIC,"Automatic Publishing of the Generated XSD") && Guidewire_FMSourceFileMatch(SRCFILE,"xml.20.08.html") ) { return "xml.20.08.html";}
else if (Guidewire_TopicMatch(TOPIC,"Generating XML Using an XML Model") && Guidewire_FMSourceFileMatch(SRCFILE,"xml.20.09.html") ) { return "xml.20.09.html";}
else if (Guidewire_TopicMatch(TOPIC,"Customizing Guidewire Model XML Output (GXOptions)") && Guidewire_FMSourceFileMatch(SRCFILE,"xml.20.10.html") ) { return "xml.20.10.html";}
else if (Guidewire_TopicMatch(TOPIC,"Parsing XML Into an XML Model") && Guidewire_FMSourceFileMatch(SRCFILE,"xml.20.11.html") ) { return "xml.20.11.html";}
else if (Guidewire_TopicMatch(TOPIC,"Arrays of Entities in XML Output") && Guidewire_FMSourceFileMatch(SRCFILE,"xml.20.12.html") ) { return "xml.20.12.html";}
else if (Guidewire_TopicMatch(TOPIC,"Complete Guidewire XML Model Example") && Guidewire_FMSourceFileMatch(SRCFILE,"xml.20.13.html") ) { return "xml.20.13.html";}
else if (Guidewire_TopicMatch(TOPIC,"Type Conversions from Gosu Types to XSD Types") && Guidewire_FMSourceFileMatch(SRCFILE,"xml.20.14.html") ) { return "xml.20.14.html";}
else if (Guidewire_TopicMatch(TOPIC,"Bundles and Transactions") && Guidewire_FMSourceFileMatch(SRCFILE,"transactions.21.1.html") ) { return "transactions.21.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Which Circumstances to Manipulate Database Transactions") && Guidewire_FMSourceFileMatch(SRCFILE,"transactions.21.2.html") ) { return "transactions.21.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using Existing Bundles") && Guidewire_FMSourceFileMatch(SRCFILE,"transactions.21.3.html") ) { return "transactions.21.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Running Code in an Entirely New Bundle") && Guidewire_FMSourceFileMatch(SRCFILE,"transactions.21.4.html") ) { return "transactions.21.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Exception Handling in Transaction Blocks") && Guidewire_FMSourceFileMatch(SRCFILE,"transactions.21.5.html") ) { return "transactions.21.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Determining What Entity Data Changed in a Bundle") && Guidewire_FMSourceFileMatch(SRCFILE,"transactions.21.6.html") ) { return "transactions.21.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Bundle Commit and Query Implementation Details") && Guidewire_FMSourceFileMatch(SRCFILE,"transactions.21.7.html") ) { return "transactions.21.7.html";}
else if (Guidewire_TopicMatch(TOPIC,"Gosu Templates") && Guidewire_FMSourceFileMatch(SRCFILE,"templates.22.1.html") ) { return "templates.22.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Template Overview") && Guidewire_FMSourceFileMatch(SRCFILE,"templates.22.2.html") ) { return "templates.22.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"When to Escape Special Characters for Templates") && Guidewire_FMSourceFileMatch(SRCFILE,"templates.22.3.html") ) { return "templates.22.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using Template Files") && Guidewire_FMSourceFileMatch(SRCFILE,"templates.22.4.html") ) { return "templates.22.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Type System") && Guidewire_FMSourceFileMatch(SRCFILE,"typesystem.23.1.html") ) { return "typesystem.23.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Basic Type Checking") && Guidewire_FMSourceFileMatch(SRCFILE,"typesystem.23.2.html") ) { return "typesystem.23.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Using Reflection") && Guidewire_FMSourceFileMatch(SRCFILE,"typesystem.23.3.html") ) { return "typesystem.23.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Compound Types") && Guidewire_FMSourceFileMatch(SRCFILE,"typesystem.23.4.html") ) { return "typesystem.23.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Concurrency") && Guidewire_FMSourceFileMatch(SRCFILE,"concurrency.24.1.html") ) { return "concurrency.24.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Overview of Thread Safety and Concurrency") && Guidewire_FMSourceFileMatch(SRCFILE,"concurrency.24.2.html") ) { return "concurrency.24.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Gosu Scoping Classes (Pre-scoped Maps)") && Guidewire_FMSourceFileMatch(SRCFILE,"concurrency.24.3.html") ) { return "concurrency.24.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Concurrent Lazy Variables") && Guidewire_FMSourceFileMatch(SRCFILE,"concurrency.24.4.html") ) { return "concurrency.24.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Concurrent Cache") && Guidewire_FMSourceFileMatch(SRCFILE,"concurrency.24.5.html") ) { return "concurrency.24.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"Concurrency with Monitor Locks and Reentrant Objects") && Guidewire_FMSourceFileMatch(SRCFILE,"concurrency.24.6.html") ) { return "concurrency.24.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Gosu Programs and Command Line Tools") && Guidewire_FMSourceFileMatch(SRCFILE,"gscript-shell.25.1.html") ) { return "gscript-shell.25.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Gosu Shell Basics") && Guidewire_FMSourceFileMatch(SRCFILE,"gscript-shell.25.2.html") ) { return "gscript-shell.25.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Gosu Program Structure") && Guidewire_FMSourceFileMatch(SRCFILE,"gscript-shell.25.3.html") ) { return "gscript-shell.25.3.html";}
else if (Guidewire_TopicMatch(TOPIC,"Command Line Arguments") && Guidewire_FMSourceFileMatch(SRCFILE,"gscript-shell.25.4.html") ) { return "gscript-shell.25.4.html";}
else if (Guidewire_TopicMatch(TOPIC,"Advanced Class Loading Registry") && Guidewire_FMSourceFileMatch(SRCFILE,"gscript-shell.25.5.html") ) { return "gscript-shell.25.5.html";}
else if (Guidewire_TopicMatch(TOPIC,"The Self-Contained Gosu Editor") && Guidewire_FMSourceFileMatch(SRCFILE,"gscript-shell.25.6.html") ) { return "gscript-shell.25.6.html";}
else if (Guidewire_TopicMatch(TOPIC,"Gosu Interactive Shell") && Guidewire_FMSourceFileMatch(SRCFILE,"gscript-shell.25.7.html") ) { return "gscript-shell.25.7.html";}
else if (Guidewire_TopicMatch(TOPIC,"Helpful APIs for Command Line Gosu Programs") && Guidewire_FMSourceFileMatch(SRCFILE,"gscript-shell.25.8.html") ) { return "gscript-shell.25.8.html";}
else if (Guidewire_TopicMatch(TOPIC,"Running Local Shell Commands") && Guidewire_FMSourceFileMatch(SRCFILE,"gw-util-shell.html") ) { return "gw-util-shell.html";}
else if (Guidewire_TopicMatch(TOPIC,"Checksums") && Guidewire_FMSourceFileMatch(SRCFILE,"checksums.27.1.html") ) { return "checksums.27.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"Overview of Checksums") && Guidewire_FMSourceFileMatch(SRCFILE,"checksums.27.2.html") ) { return "checksums.27.2.html";}
else if (Guidewire_TopicMatch(TOPIC,"Coding Style") && Guidewire_FMSourceFileMatch(SRCFILE,"style.28.1.html") ) { return "style.28.1.html";}
else if (Guidewire_TopicMatch(TOPIC,"General Coding Guidelines") && Guidewire_FMSourceFileMatch(SRCFILE,"style.28.2.html") ) { return "style.28.2.html";}
else { return("../wwhelp/topic_cannot_be_found.html"); } }

function  WWHBookData_MatchTopic(P)
{
var C=null;P=decodeURIComponent(decodeURIComponent(escape(P)));//workaround epub bug with UTF8 processing!
if(P=="The_Gosu_Language")C="intro.03.02.html";
if(P=="Gosu_Case_Sensitivity")C="intro.03.13.html";
if(P=="Gosu_Code_Comments")C="intro.03.15.html";
if(P=="Java_and_Gosu")C="java-gosu.08.01.html";
if(P=="Calling_Java_from_Gosu")C="java-gosu.08.01.html";
if(P=="Gosu-to-Java_Class_Deployment")C="java-gosu.08.03.html";
if(P=="Gosu_Classes_in_the_Entity_Libraries")C="java-gosu.08.12.html#2074248";
if(P=="Using_Gosu_Classes_that_Appear_in_External_Libraries")C="java-gosu.08.12.html#2074285";
if(P=="Static_Methods_and_Variables_Using_UTIL_Property")C="java-gosu.08.13.html";
if(P=="Gosu_Enhancements_in_the_Entity_Libraries")C="java-gosu.08.14.html";
if(P=="Using_Mock_Entities_to_Test_Code_That_Uses_Entities")C="java-gosu.08.16.html";
if(P=="Advanced_Queries_Using_Table_Joins")C="querybuilder.09.15.html";
if(P=="Collections_in_Gosu")C="collections.19.1.html";
if(P=="GScript_and_XML_")C="xml.20.01.html";
if(P=="Creating_Standard_XSDs_and_Standard_XML")C="xml.20.07.html";
if(P=="Using_Create_XSDs_and_Convert_Types_to_XML")C="xml.20.07.html";
if(P=="Bundles_and_Transactions")C="transactions.21.1.html";
if(P=="Type_System_and_Reflection")C="typesystem.23.1.html";
if(P=="Gosu_Scoping_Classes")C="concurrency.24.3.html";
if(P=="Gosu_Shell")C="gscript-shell.25.1.html";
if(P=="Gosu_Interactive_Shell")C="gscript-shell.25.7.html";
if(P=="Running_Command_Line_Tools_from_Gosu")C="gw-util-shell.html#2186018";
if (C) { return C } else { return GUIDEWIRE_TOPIC_TO_FILE(P,Guidewire_ExtractSrcFromURL());}
}
