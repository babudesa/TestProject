function  WWHBookData_AddTOCEntries(P)
{
var A=P.fN("About This Document","1");
var B=A.fN("Intended Audience","1#1315821");
B=A.fN("Assumed Knowledge","1#1329378");
B=A.fN("Related Documents","1#1329383");
B=A.fN("Conventions In This Document","1#1333457");
A=P.fN("Gosu Introduction","2");
B=A.fN("Welcome to Gosu","3");
var C=B.fN("Control Flow","3#1437383");
C=B.fN("Blocks","3#1469415");
C=B.fN("Enhancements","3#1435182");
C=B.fN("Collections","3#1441186");
C=B.fN("Access to Java Types","3#1435102");
C=B.fN("Gosu Classes and Properties","3#1440296");
C=B.fN("Interfaces","3#1450798");
C=B.fN("List and Array Expansion Operator *.","3#1450589");
C=B.fN("Comparisons","3#1452648");
C=B.fN("Case Sensitivity","3#1450590");
C=B.fN("Compound Assignment Statements","3#1454915");
C=B.fN("Delegating Interface Implementation with Composition","3#1457296");
C=B.fN("Concurrency","3#1456854");
C=B.fN("Exceptions","3#1457070");
C=B.fN("Annotations","3#1458452");
C=B.fN("Gosu Templates","3#1457886");
C=B.fN("Native XML and XSD Support","3#1460816");
C=B.fN("Native Web Service Support","3#1460937");
C=B.fN("Gosu Character Set","3#1461607");
B=A.fN("More About the Gosu Type System","4");
C=B.fN("Compile Time Error Prevention","5");
C=B.fN("Type Inference","6");
C=B.fN("Intelligent Code Completion","7");
C=B.fN("Refactoring","8");
C=B.fN("Type Usage Searching","9");
C=B.fN("Property Accessor Paths are Null Safe","10");
C=B.fN("Generics in Gosu","11");
C=B.fN("Gosu Primitives Types","12");
C=B.fN("Custom Type Loaders","13");
B=A.fN("Gosu Case Sensitivity","14");
B=A.fN("Gosu Statement Terminators","15");
B=A.fN("Gosu Comments","16");
B=A.fN("Gosu Reserved Words","17");
B=A.fN("Gosu Generated Documentation","18");
B=A.fN("Running Programs","19");
B=A.fN("Notable Differences Between Gosu and Java","20");
B=A.fN("Get Ready for Gosu","21");
A=P.fN("Gosu Types","22");
B=A.fN("Built-in Types","23");
C=B.fN("Array","24");
C=B.fN("Boolean","25");
C=B.fN("DateTime","26");
C=B.fN("Key","27");
C=B.fN("Number","28");
C=B.fN("Object","29");
C=B.fN("String","30");
C=B.fN("Type","31");
C=B.fN("Primitive Types","32");
B=A.fN("Access to Java Types","33");
B=A.fN("Arrays","34");
C=B.fN("Array-related Entity Methods","34#1466376");
C=B.fN("Java-based Lists as Arrays","34#1441480");
C=B.fN("Array Expansion","34#1441521");
B=A.fN("Object Instantiation and Properties","35");
C=B.fN("Creating New Objects","35#1441638");
C=B.fN("Assigning Object Properties","35#1441650");
C=B.fN("Accessing Object Properties","35#1441662");
C=B.fN("Accessing Object Methods","35#1441682");
C=B.fN("Accessing Object Arrays","35#1441721");
B=A.fN("Entities","36");
B=A.fN("Typekeys","37");
C=B.fN("Typelist Literals","37#1466621");
C=B.fN("Typekey Literals","37#1466624");
C=B.fN("Getting Information from a Typekey","37#1466466");
A=P.fN("Gosu Operators and Expressions","38");
B=A.fN("Gosu Operators","39");
C=B.fN("Operator Precedence","40");
B=A.fN("Standard Gosu Expressions","41");
B=A.fN("Arithmetic Expressions","42");
B=A.fN("Equality Expressions","43");
B=A.fN("Evaluation Expressions","44");
B=A.fN("Existence Testing Expressions","45");
B=A.fN("Logical Expressions","46");
B=A.fN("New Object Expressions","47");
B=A.fN("Relational Expressions","48");
B=A.fN("Unary Expressions","49");
B=A.fN("Importing Types and Package Namespaces","50");
B=A.fN("Conditional Ternary Expressions","51");
B=A.fN("Special Gosu Expressions","52");
C=B.fN("Entity Literals","53");
C=B.fN("Function Calls","54");
C=B.fN("Handling Null Values","55");
C=B.fN("Static Method Calls","56");
C=B.fN("Static Property Paths","57");
C=B.fN("Entity and Typekey Type Literals","58");
A=P.fN("Statements","59");
B=A.fN("Gosu Statements","60");
C=B.fN("Statement Lists","60#1440698");
B=A.fN("Gosu Variables","61");
C=B.fN("Variable Type Declaration","61#1141530");
C=B.fN("Variable Assignment","61#1453654");
B=A.fN("Gosu Conditional Execution and Looping","62");
C=B.fN("If() \u2026 Else() Statements","62#1142199");
C=B.fN("For() Statements","62#1456475");
C=B.fN("While() Statements","62#1141335");
C=B.fN("Do\u2026While() Statements","62#1137579");
C=B.fN("Switch() Statements","62#1137580");
B=A.fN("Gosu Functions","63");
C=B.fN("Public and Private Functions","63#1142377");
A=P.fN("Exception Handling","64");
B=A.fN("Try-Catch-Finally Constructions","65");
B=A.fN("Throw Statements","66");
B=A.fN("Checked Exceptions in Gosu","67");
B=A.fN("Object Lifecycle Management (\u2018using\u2019 Clauses)","68");
C=B.fN("Disposable Objects","68#1466707");
C=B.fN("Closeable Objects and \u2018using\u2019 Clauses","68#1466986");
C=B.fN("Reentrant Objects and \u2018using\u2019 Clauses","68#1457358");
C=B.fN("Returning Values from \u2018using\u2019 Clauses","68#1469250");
A=P.fN("Java and Gosu","69");
B=A.fN("Overview of Calling Java from Gosu","70");
C=B.fN("Java Classes are First-Class Types","70#2002026");
C=B.fN("Many Java Classes are Core Classes for Gosu","70#2002392");
C=B.fN("Java Packages in Scope","70#2002365");
C=B.fN("Static Members in Gosu","70#2047802");
C=B.fN("Simple Java Example","70#2003007");
C=B.fN("Java Get and Set Methods Convert to Gosu Properties","70#2021794");
C=B.fN("Interfaces","70#2020668");
C=B.fN("Enumerations","70#2020577");
C=B.fN("Annotations","70#2047848");
C=B.fN("Java Primitives","70#2047899");
B=A.fN("Deploying Your Java Classes","71");
C=B.fN("Class Loading for Java Classes Called from Gosu","71#2073311");
B=A.fN("Java Class Loading, Delegation, and Package Naming","72");
C=B.fN("Java Class Loading Rules","72#2031881");
C=B.fN("Local Loading of Your Classes","72#2073391");
C=B.fN("Delegate Loading","72#2073481");
C=B.fN("Java Class Repository Listing","72#2073515");
B=A.fN("Special Handling of Collections, Arrays, Maps","73");
C=B.fN("Disable Container Conversion In Some Cases","73#2073608");
C=B.fN("Details of Container Conversion","73#2073639");
B=A.fN("Java Entity Libraries Overview","74");
B=A.fN("Using Java Entity Libraries","75");
C=B.fN("Creating Entities from Java","75#2073883");
C=B.fN("Getting and Setting Properties from Java","75#2073892");
C=B.fN("Calling Entity Domain Methods from Java","75#2073911");
C=B.fN("Exception Handling from Java","75#2073921");
C=B.fN("TypeKey Classes from Java","75#2073934");
C=B.fN("Parameterization of Types Stripped from Entities in Java","75#2073961");
C=B.fN("Special Entity-related Java Classes","75#2073968");
B=A.fN("Argument Conversion in Java Entity Libraries","76");
B=A.fN("How Entities and Typekeys Convert to and from Java","77");
C=B.fN("Comparing Entities","77#2074034");
C=B.fN("Comparing Typekeys","77#2074071");
C=B.fN("Comparing Keys","77#2074112");
B=A.fN("Java Entity Utility APIs","78");
C=B.fN("Creating and Accessing Entities From Java","78#2074123");
C=B.fN("Finding Entities by Public ID Within Java Code","78#2074187");
B=A.fN("Which Java Types Export to Java Entity Libraries?","79");
B=A.fN("Non-entity Types in the Java Entity Libraries","80");
C=B.fN("Adding Gosu Non-Entity Types to the Entity Libraries","80#2074248");
C=B.fN("Using Gosu Classes from Java Entity Libraries","80#2074285");
B=A.fN("Static Methods and Variables in Java Entity Libraries","81");
B=A.fN("Gosu Enhancements in Java Entity Libraries","82");
B=A.fN("Remapping Package and Type Names in Java Entity Libraries","83");
B=A.fN("Testing Your Entity Code in Java (EntityMock)","84");
C=B.fN("How EntityMock Works","84#2074396");
C=B.fN("Using EntityMock","84#2074406");
C=B.fN("Modifying EntityFactory for Mock Entities","84#2074507");
A=P.fN("Query Builder","85");
B=A.fN("Query Builder Overview","86");
C=B.fN("Basic Queries","86#2180576");
C=B.fN("Using Comparison Predicates with Null Values","87");
C=B.fN("Viewing the SQL for a Query","88");
C=B.fN("Column References","89");
C=B.fN("Database Functions","90");
C=B.fN("Combining Queries and Predicates","91");
B=A.fN("Returning Query Results","92");
C=B.fN("Getting Single Rows","93");
C=B.fN("Getting Results With an Iterator","94");
C=B.fN("Converting to Collections, Lists, Sets, and Arrays","95");
C=B.fN("Selecting Columns and Returning Results in Custom Formats","96");
C=B.fN("Ordering results","97");
C=B.fN("Found Entities Are Read-only Until Added to a Bundle","97#2233962");
C=B.fN("Result Counts and Dynamic Queries","97#2210976");
C=B.fN("Setting the Page Size For a Query","98");
B=A.fN("Advanced Queries (Subselects and Joins)","99");
C=B.fN("Using Subselect for Reverse Inner Joins","99#2207006");
C=B.fN("Join Method","100");
A=P.fN("Find Expressions","101");
B=A.fN("Basic Find Expressions","101#1216400");
C=B.fN("Find Expressions Using AND/OR","101#1137068");
C=B.fN("Find Expressions Using Equality and Relational Operators","101#1137084");
C=B.fN("Find Expressions Using \u2018Where...In\u2019 Clauses","101#1359589");
B=A.fN("Using Exists Expressions in Finders for Database Joins","101#1359679");
C=B.fN("Fixing Invalid Queries by Adding Exists Clauses","101#1360475");
C=B.fN("Combining Exists Expressions","101#1358792");
B=A.fN("Find Expressions Using Special Substring Keywords","101#1359890");
B=A.fN("Using the Results of Find Expressions (Using Query Objects)","101#1289012");
C=B.fN("Basic Iterator Example","101#1361185");
C=B.fN("Large Query Finder Results Example","101#1220606");
C=B.fN("Sort Results Example","101#1220627");
C=B.fN("Returning a Single Row of Finder Results","101#1137173");
C=B.fN("Found Entities Are Read-only Until Added to a Bundle","101#1361064");
C=B.fN("Queries Are Always Dynamic","101#1360246");
A=P.fN("Classes","102");
B=A.fN("What Are Classes?","103");
B=A.fN("Creating and Instantiating Classes","104");
C=B.fN("Creating a New Instance of a Class","104#2449212");
C=B.fN("Naming Conventions for Packages and Classes","104#2447745");
B=A.fN("Properties","105");
C=B.fN("Properties are Actually Virtual Like Functions","105#2447823");
C=B.fN("Property Paths are Null Tolerant","105#2465283");
C=B.fN("Static Properties","105#2449277");
C=B.fN("More Property Examples","105#2447851");
B=A.fN("Modifiers","106");
C=B.fN("Access Modifiers","106#2445688");
C=B.fN("Override Modifier","106#2449862");
C=B.fN("Abstract Modifier","106#2449868");
C=B.fN("Final Modifier","106#2449875");
C=B.fN("Static Modifier","106#2446412");
B=A.fN("Inner Classes","107");
C=B.fN("Named Inner Classes","107#2450636");
C=B.fN("Anonymous Inner Classes","107#2450064");
A=P.fN("Enumerations","108");
B=A.fN("Using Enumerations","109");
C=B.fN("Extracting Information from Enumerations","109#1459344");
C=B.fN("Comparing Enumerations","109#1459295");
A=P.fN("Interfaces","110");
B=A.fN("What is an Interface?","111");
B=A.fN("Defining and Using an Interface","112");
C=B.fN("Defining and Using Properties with Interfaces","112#1457203");
C=B.fN("Modifiers and Interfaces","112#1459141");
A=P.fN("Composition","113");
B=A.fN("Using Gosu Composition","114");
C=B.fN("Overriding Methods Independent of the Delegate Class","114#2201000");
C=B.fN("Declaring Delegate Implementation Type in the Variable Definition","114#2198236");
C=B.fN("Using One Delegate for Multiple Interfaces","114#2198240");
C=B.fN("Using Composition With Built-in Interfaces","114#2198246");
A=P.fN("Annotations and Interceptors","115");
B=A.fN("Annotating a Class, Method, Type, or Constructor","116");
C=B.fN("Built-in Annotations","116#1471842");
B=A.fN("Annotations at Run Time","117");
B=A.fN("Defining Your Own Annotations","118");
C=B.fN("Customizing Annotation Usage","118#1434674");
B=A.fN("Gosu Interceptors","119");
A=P.fN("Enhancements","120");
B=A.fN("Using Enhancements","121");
C=B.fN("Syntax for Using Enhancements","121#1439437");
C=B.fN("Creating a New Enhancement","121#1439200");
C=B.fN("Syntax for Defining Enhancements","121#1439430");
C=B.fN("Enhancement Naming and Package Conventions","121#1437458");
C=B.fN("Enhancements on Arrays","121#1438604");
A=P.fN("Gosu Blocks","122");
B=A.fN("What Are Blocks?","123");
B=A.fN("Basic Block Definition and Invocation","124");
B=A.fN("Variable Scope and Capturing Variables In Blocks","125");
B=A.fN("Argument Type Inference Shortcut In Certain Cases","126");
B=A.fN("Block Type Literals","127");
B=A.fN("Blocks and Collections","128");
B=A.fN("Blocks as Shortcuts for Anonymous Classes","129");
A=P.fN("Gosu Generics","130");
B=A.fN("Gosu Generics Overview","131");
B=A.fN("Using Gosu Generics","132");
B=A.fN("Other Unbounded Generics Wildcards","133");
B=A.fN("Generics and Blocks","134");
B=A.fN("How Generics Help Define Collection APIs","135");
B=A.fN("Multiple Dimensionality Generics","136");
B=A.fN("Generics With Custom \u2018Containers\u2019","137");
C=B.fN("Generics with Non-Containers","137#1446525");
A=P.fN("Collections","138");
B=A.fN("Basic Lists","139");
B=A.fN("Basic HashMaps","140");
C=B.fN("Special Enhancements on Maps","140#1452216");
B=A.fN("List and Array Expansion (*.)","141");
B=A.fN("Enhancement Reference for Collections and Related Types","142");
C=B.fN("Collections Enhancement Methods","143");
C=B.fN("Finding Data in Collections","143#1462591");
C=B.fN("Sorting Collections","143#1444564");
C=B.fN("Mapping Data in Collections","143#1442277");
C=B.fN("Iterating Across Collections","143#1442285");
C=B.fN("Partitioning Collections","143#1442296");
C=B.fN("Converting Lists, Arrays, and Sets","143#1449882");
C=B.fN("Flat Mapping a Series of Collections or Arrays","143#1450050");
C=B.fN("Sizes and Length of Collections and Strings are Equivalent","143#1443101");
A=P.fN("Gosu and XML","144");
B=A.fN("Manipulating XML Overview","145");
B=A.fN("Exporting XML Data","146");
B=A.fN("Manipulating XML as Untyped Nodes","147");
C=B.fN("Untyped Node Operations","147#1445111");
C=B.fN("Example of Manipulating XML as Untyped Nodes","147#1445635");
B=A.fN("Collection-like Enhancements with XML Nodes","148");
B=A.fN("Structured XML Using XSDs","149");
C=B.fN("Importing Strongly-Typed XML","149#1444007");
C=B.fN("Writing Strongly-Typed XML","149#1444034");
C=B.fN("Handling Choices in XML","149#1451098");
C=B.fN("Gosu Type to XSD Type Conversion Reference","149#1462005");
C=B.fN("XSD Namespaces and QNames","149#1497728");
C=B.fN("Autocreation of Intermediate Nodes","149#1461542");
C=B.fN("XML Node IDs","149#1461507");
C=B.fN("Date Handling in XSDs","149#1462736");
B=A.fN("The Guidewire XML (GX) Modeler","150");
C=B.fN("Automatic Publishing of the Generated XSD","151");
C=B.fN("Generating XML Using an XML Model","152");
C=B.fN("Customizing Guidewire Model XML Output (GXOptions)","153");
C=B.fN("Parsing XML Into an XML Model","154");
C=B.fN("Arrays of Entities in XML Output","155");
C=B.fN("Complete Guidewire XML Model Example","156");
C=B.fN("Type Conversions from Gosu Types to XSD Types","157");
A=P.fN("Bundles and Transactions","158");
B=A.fN("Which Circumstances to Manipulate Database Transactions","159");
B=A.fN("Using Existing Bundles","160");
C=B.fN("Getting an Entity from its Public ID or Internal ID (Key)","160#1562498");
C=B.fN("Creating New Entities in Specific Bundles","160#1567986");
C=B.fN("Committing a Bundle","160#1568102");
C=B.fN("Bundles and Web Services","160#1560993");
C=B.fN("Removing Entities from the Database Entirely","160#1561324");
B=A.fN("Running Code in an Entirely New Bundle","161");
C=B.fN("Create Bundle For a Specific ClaimCenter User","161#1583029");
C=B.fN("Warning about Transaction Class Confusion","161#1602225");
B=A.fN("Exception Handling in Transaction Blocks","162");
B=A.fN("Determining What Entity Data Changed in a Bundle","163");
C=B.fN("Detecting If Any Element Changes Occurred","163#1571314");
C=B.fN("Getting All Changed Properties From an Entity","163#1571181");
C=B.fN("Bundle Change Methods Specific to Arrays","163#1569999");
C=B.fN("Getting Add, Changed, or Deleted Entities In a Bundle","163#1571142");
B=A.fN("Bundle Commit and Query Implementation Details","164");
C=B.fN("How the Application Caches Entity Data and Prevents Problems","164#1568957");
C=B.fN("Details of What Happens During Bundle Commit","164#1571347");
A=P.fN("Gosu Templates","165");
B=A.fN("Template Overview","166");
C=B.fN("Template Expressions","166#1464080");
C=B.fN("When to Escape Special Characters for Templates","167");
B=A.fN("Using Template Files","168");
C=B.fN("Creating and Running a Template File","168#1464601");
C=B.fN("Template Scriptlet Tags","168#1461443");
C=B.fN("Template Parameters","168#1463866");
C=B.fN("Extending a Template From a Class","168#1455745");
C=B.fN("Template Comments","168#1463274");
B=A.fN("Template Export Formats","168#1465221");
A=P.fN("Type System","169");
B=A.fN("Basic Type Coercion","169#1444327");
B=A.fN("Basic Type Checking","170");
C=B.fN("Automatic Downcasting for \u2018typeis\u2019 and \u2018typeof\u2019","170#1455253");
B=A.fN("Using Reflection","171");
C=B.fN("Type Object Properties","171#1441372");
C=B.fN("Java Type Reflection","171#1441477");
C=B.fN("Type System Class","171#1465566");
B=A.fN("Compound Types","172");
A=P.fN("Concurrency","173");
B=A.fN("Overview of Thread Safety and Concurrency","174");
B=A.fN("Gosu Scoping Classes (Pre-scoped Maps)","175");
B=A.fN("Concurrent Lazy Variables","176");
B=A.fN("Concurrent Cache","177");
B=A.fN("Concurrency with Monitor Locks and Reentrant Objects","178");
A=P.fN("Gosu Programs and Command Line Tools","179");
B=A.fN("Gosu Shell Basics","180");
C=B.fN("Unpacking and Installing the Gosu Shell","180#2191323");
C=B.fN("Gosu Command Line Tool Options","180#2182333");
C=B.fN("Writing a Simple Gosu Program","180#2180168");
B=A.fN("Gosu Program Structure","181");
C=B.fN("Metaline as First Line","181#2182879");
C=B.fN("Functions","181#2182773");
C=B.fN("Calling Classes","181#2183011");
B=A.fN("Command Line Arguments","182");
B=A.fN("Advanced Class Loading Registry","183");
B=A.fN("The Self-Contained Gosu Editor","184");
B=A.fN("Gosu Interactive Shell","185");
B=A.fN("Helpful APIs for Command Line Gosu Programs","186");
A=P.fN("Running Local Shell Commands","187");
B=A.fN("Running Command Line Tools from Gosu","187#2186018");
A=P.fN("Checksums","188");
B=A.fN("Overview of Checksums","189");
B=A.fN("Creating Fingerprints","189#1442951");
C=B.fN("How to Output Data Inside a Fingerprint","189#1443786");
B=A.fN("Extending Fingerprints","189#1442456");
A=P.fN("Coding Style","190");
B=A.fN("General Coding Guidelines","191");
C=B.fN("Omit Semicolons","191#1445233");
C=B.fN("Type Declarations","191#1445238");
C=B.fN("The == and != Operator Recommendations and Warnings","191#1445388");
C=B.fN("Gosu Case Sensitivity Implications","191#1446066");
C=B.fN("Class Variable and Class Property Recommendations","191#1446206");
C=B.fN("Use \u2018typeis\u2019 Inference","191#1454113");
}
