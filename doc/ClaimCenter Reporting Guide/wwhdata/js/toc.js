function  WWHBookData_AddTOCEntries(P)
{
var A=P.fN("About This Document","1");
var B=A.fN("Intended Audience","1#2147432");
B=A.fN("Assumed Knowledge","1#1007680");
B=A.fN("Related Documents","1#1007682");
B=A.fN("Conventions In This Document","1#2152385");
B=A.fN("Support","1#2152597");
A=P.fN("Installing Guidewire Standard Reporting","2#1002051");
B=A.fN("Before Starting the Installation","3");
var C=B.fN("Guidewire ClaimCenter Standard Reporting","4");
var D=C.fN("Mirror Database Recommendations","4#4362698");
C=B.fN("Installing Guidewire ClaimCenter","5");
C=B.fN("Guidewire Standard Reporting Installation Scenarios","6");
D=C.fN("Production Environment","6#5479143");
D=C.fN("Development Environment","6#5478113");
D=C.fN("Upgrading Guidewire Standard Reporting","6#5644248");
B=A.fN("Installing Standard Reporting for Production","7");
C=B.fN("Installation Checklist","8");
C=B.fN("Step 1: Acquire the InetSoft License Keys","9");
C=B.fN("Step 2: Install the Standard Reporting Files","10");
C=B.fN("Step 3: Create the Required Database Reporting Views","11");
C=B.fN("Step 4: Install the Production Report Server","12");
D=C.fN("Naming Guidelines","12#5669369");
D=C.fN("Reporting JVM Requirements","12#5663991");
D=C.fN("Using Apache Tomcat as the Report Server","13");
D=C.fN("Using Oracle WebLogic as the Report Server","14");
D=C.fN("Using IBM WebSphere as the Report Server","15");
C=B.fN("Step 5: Install Guidewire Standard Reporting","16");
D=C.fN("Set Up the Reporting Configuration Files","16#5464127");
D=C.fN("Set Up the ClaimCenter Application Files","16#5464128");
C=B.fN("Step 6: Deploy the Reporting Files","17");
D=C.fN("Report URL","18");
D=C.fN("Deploying Reporting to a Tomcat Server","19");
D=C.fN("Deploying Reporting to a WebLogic Server","20");
D=C.fN("Deploying Reporting to a WebSphere Server","21");
C=B.fN("Step 7: Test the Reporting Configuration","22");
A=P.fN("Working with Guidewire Standard Reporting","23#1002051");
B=A.fN("Understanding Report Security","24");
C=B.fN("The Reporting Security Framework","25");
D=C.fN("SOAP Communication","25#4559560");
D=C.fN("Security Management","25#4985412");
D=C.fN("Managing Reporting Log Ins","25#4985530");
C=B.fN("Report Security","26");
D=C.fN("Report Synchronization","26#4559589");
D=C.fN("Report Permission Group Definition","26#4654289");
D=C.fN("Report Permission Sets","26#4841214");
D=C.fN("Report Viewing","26#4841434");
D=C.fN("Report Viewing in InetSoft","26#4984763");
B=A.fN("Upgrading from ClaimCenter 4.x to ClaimCenter 6.x","27");
C=B.fN("Starting the Upgrade Process","27#5177459");
D=C.fN("Install InetSoft Enterprise Edition (EE) version 10.1","27#5177503");
D=C.fN("Upgrade InetSoft Charts","27#5176735");
C=B.fN("Upgrading from ClaimCenter 4.x to ClaimCenter 6.x with No Report Customization","28");
D=C.fN("Remove Unneeded SQL Views from ClaimCenter 6.x Mirror Database","28#5152465");
D=C.fN("Verify Existence of Necessary Mirror Database Tables","28#5152606");
D=C.fN("Add Reports to Report Permission Sets","28#5152869");
C=B.fN("Upgrading from ClaimCenter 4.x to ClaimCenter 6.x with Report Customization","29");
D=C.fN("If You Created a Data Model in 4.x","29#5177894");
D=C.fN("If You Customized or Added a Report","29#5177646");
D=C.fN("If You Modified the Reporting SQL Views","29#5339561");
D=C.fN("If You Modified the Report Environment","29#5177709");
D=C.fN("If You Modified Report Localization Files","29#5177716");
D=C.fN("If You Modified Parameter Sheets or Entities","29#5177724");
D=C.fN("If You Used Worksheets","29#5177789");
B=A.fN("Upgrading from ClaimCenter 5.x to ClaimCenter 6.x","30");
C=B.fN("Starting the Upgrade Process","30#5177459");
D=C.fN("Install InetSoft Enterprise Edition (EE) version 10.1","30#5177503");
D=C.fN("Upgrade InetSoft Charts","30#5340097");
C=B.fN("Upgrading from ClaimCenter 5.x to ClaimCenter 6.x with No Report Customization","31");
D=C.fN("Remove Unneeded Tables from ClaimCenter 6.x Mirror Database","31#5152465");
D=C.fN("Verify Existence of Necessary Mirror Database Tables","31#5152606");
D=C.fN("Add Reports to Report Permission Sets","31#5152869");
C=B.fN("Upgrading from ClaimCenter 5.x to ClaimCenter 6.x with Report Customization","32");
D=C.fN("If You Added a Report Permission Set in 5.x","32#5265073");
D=C.fN("If You Created a Data Model in 5.x","32#5177894");
D=C.fN("If You Modified File query.xml","32#5177646");
D=C.fN("If You Modified File repository.xml","32#5339766");
D=C.fN("If You Customized or Added a Report","32#5339686");
D=C.fN("If You Modified the Report Environment","32#5177709");
D=C.fN("If You Modified Report Localization Files","32#5177716");
D=C.fN("If You Modified Parameter Sheets or Entities","32#5177724");
D=C.fN("If You Used Worksheets","32#5177789");
A=P.fN("Working with Reports","33#1002051");
B=A.fN("Reporting in a Clustered Environment","34");
C=B.fN("Guidewire Standard Reporting and Load-Balancing","35");
C=B.fN("Configuring Report Clustering","36");
D=C.fN("Step 1: Configure the Load Balancer","36#5303622");
D=C.fN("Step 2: Configure Application Server One","36#5302320");
D=C.fN("Step 3: Configure Application Server Two","36#5302791");
D=C.fN("Step 4: Configure the Report Server","36#5303232");
D=C.fN("Step 5: Start the Cluster Nodes","36#5152005");
D=C.fN("Step 6: Test Your Clustering Configuration","36#5323038");
C=B.fN("Example Load Balancer httpd.conf File","37");
B=A.fN("Using ClaimCenter Reports","38");
C=B.fN("Running ClaimCenter Reports","39");
C=B.fN("Scheduling ClaimCenter Reports","40");
C=B.fN("Configuring Drill-Down Reports","41");
C=B.fN("Viewing the Guidewire Reports","42");
D=C.fN("Claim Reports","43");
D=C.fN("Claim Health Metrics Reports","44");
D=C.fN("Dashboard Reports","45");
D=C.fN("Financial Reports","46");
D=C.fN("Special Investigation Unit (SIU) Reports","47");
B=A.fN("Administering Reports","48");
C=B.fN("Working with ClaimCenter Reporting Permissions","49");
C=B.fN("Synchronizing Reports with the InetSoft Server","50");
C=B.fN("Configuring Reports to Access Claim Information","51");
C=B.fN("Administering Report Printing","52");
C=B.fN("Exporting Reports in Microsoft Excel Format","53");
C=B.fN("Working with the InetSoft Enterprise Manager","54");
D=C.fN("Viewing System Logs","55");
D=C.fN("Viewing Report SQL Queries","56");
D=C.fN("Integrating Style Report with a Third-Party Logger","57");
D=C.fN("Reducing the Number of Cached Temporary Files","58");
C=B.fN("Understanding InetSoft Configuration Options","59");
C=B.fN("Troubleshooting Guidewire Standard Reporting","60");
D=C.fN("Problems with Report Data","61");
D=C.fN("Problems with Report Auditing","62");
D=C.fN("Problems Contacting the ClaimCenter Reporting Database","63");
D=C.fN("Problems Opening Reports from within ClaimCenter","64");
D=C.fN("Performance Issues Using F5 Proxy as a Load Balancer","65");
D=C.fN("Problems Related to Tomcat","66");
D=C.fN("Problems with the InetSoft Scheduler","67");
D=C.fN("Problems with InetSoft SRSecurityException","68");
D=C.fN("Problems with InetSoft installation on Microsoft Vista","69");
B=A.fN("Optimizing Report Performance","70");
C=B.fN("Optimizing the Reporting File Structure","71");
C=B.fN("Structuring Reporting Views","72");
C=B.fN("Streaming, Caching, and Clustering","73");
A=P.fN("Working with Report Development","74#1002051");
B=A.fN("Installing InetSoft Style Report Enterprise for Development","75");
C=B.fN("Installing the InetSoft Application","76");
D=C.fN("Acquire the InetSoft Application Software","77");
D=C.fN("Install Style Report (Windows)","78");
C=B.fN("Configuring InetSoft Style Report","79");
C=B.fN("Launching the Reporting Tools","80");
B=A.fN("Working with the Report Designer","81");
C=B.fN("Setting Report Designer Configuration Parameters","82");
C=B.fN("Configuring the Data Source","83");
C=B.fN("Deploying Your Reports","84");
C=B.fN("Report Naming Guidelines","85");
B=A.fN("Report Localization","86");
C=B.fN("InetSoft and Localization","87");
C=B.fN("Registering a Locale in InetSoft Enterprise Manager","88");
C=B.fN("Setting the Report Currency Display","89");
C=B.fN("Configuring Localized Reports in InetSoft Report Designer","90");
C=B.fN("Setting the InetSoft Calendar Widget","91");
C=B.fN("Generating Localized ClaimCenter Reports","92");
C=B.fN("Configuring Direct Access for ClaimCenter Localized Reports","93");
C=B.fN("Localization and the Reporting Database","94");
}
