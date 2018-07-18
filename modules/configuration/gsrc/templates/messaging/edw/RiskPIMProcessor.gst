<%@ params(theclaim : Claim, thepolicy : Policy, objStatus : String, eventName : String) %>
<%
uses java.util.SortedMap;
uses java.util.TreeMap;
uses java.util.List;
uses java.util.ArrayList;
uses java.lang.Integer;
uses templates.messaging.edw.RiskPIMPremisesPropertyTemplate
uses templates.messaging.edw.RiskPIMBuildingPropertyTemplate
uses templates.messaging.edw.RiskPIMJobsitePropertyTemplate




	var thepremisesrisk : SortedMap<Integer, LocationBasedRU> = new TreeMap<Integer, LocationBasedRU>();
	var riskType = "PRM";

	if (thepolicy.Properties != null) {
	  for (thepolicyproperty in thepolicy.Properties) {
	    if (thepolicyproperty typeis PropertyRU) {
	      thepremisesrisk.put(thepolicyproperty.PropertyNumberExt, thepolicyproperty);
	    }
	  }
	}
	
	if (thepremisesrisk != null) {
	  for (thelocationnumber in thepremisesrisk.keySet().iterator()) {
	    var therisk = thepremisesrisk.get(thelocationnumber);
	    var thepremisesnumber : String = thelocationnumber as java.lang.String;
	    var actualpremises = "";
	
	    for (prop in thepolicy.Properties) {
	      if (prop typeis PropertyRU) {
	        if (thelocationnumber == prop.PropertyNumberExt and prop.Property.RiskTypeExt == "PRM") {
	          therisk = prop;
	          thepremisesnumber = null;
	          actualpremises = therisk.PublicID;
	        }
	      }
	    }
	
	    var riskCat = "<RiskCat><Code>"+riskType+"</Code><Description>"+riskType+"</Description><ListName>EDWRiskType</ListName></RiskCat>"
	%>
	    <%=RiskPIMPremisesPropertyTemplate.renderToString(theclaim, therisk, objStatus, riskCat, riskType, eventName, thepremisesnumber)%>
	    <%
	    var thebuildingrisk : SortedMap<String, LocationBasedRU> = new TreeMap<String, LocationBasedRU>();
	    var bldgriskType = "BLDG";
	    var thecoverages : List<Coverage> = null;
	
	    if (thepolicy.Properties != null) {
	      for (thepolproperty in thepolicy.Properties) {
	         if (thepolproperty typeis PropertyRU and thelocationnumber == thepolproperty.PropertyNumberExt) {
	           thebuildingrisk.put(thepolproperty.Property.BuildingNumberExt, thepolproperty);
	         }
	      }
	    }
	
	    if (thebuildingrisk != null) {
	      for (thebuildingnumber in thebuildingrisk.keySet().iterator()) {
	         var thebldgrisk = thebuildingrisk.get(thebuildingnumber);
	
	         for (polprop in thepolicy.Properties) {
	           if (polprop typeis PropertyRU) {
	             if (thelocationnumber == polprop.PropertyNumberExt and thebuildingnumber == polprop.Property.BuildingNumberExt and polprop.Property.RiskTypeExt == "BLDG") {
	               thecoverages = new ArrayList<Coverage>();
	               for (thecoverage in polprop.Coverages) {
	                 thecoverages.add(thecoverage);
	               }
	               thebldgrisk = polprop;
	             }
	           }
	         }
	
	         var bldgriskCat = "<RiskCat><Code>"+bldgriskType+"</Code><Description>"+bldgriskType+"</Description><ListName>EDWRiskType</ListName></RiskCat>"
	         if (!(thebldgrisk.Property.RiskTypeExt != null && thebldgrisk.Property.RiskTypeExt == "BLDG")) {
	           thecoverages = null;
	         }    
	    %>
	        <%=RiskPIMBuildingPropertyTemplate.renderToString(theclaim, thebldgrisk, objStatus, bldgriskCat, displaykey.EDW.Templates.CVRG, bldgriskType, eventName, thebuildingnumber, thecoverages, actualpremises, thepremisesnumber)%>
	    <%}%>
	  <%}%>
	 <%}%>
	 <%}%>
	 
<% if (thepolicy.PolicyType.Code == "IMP") {  %>
         <%
	    var thejobsiterisk : SortedMap<Integer, LocationBasedRU> = new TreeMap<Integer, LocationBasedRU>();
	    var jobsriskType = "JOBSITE";
	    var thejcoverages : List<Coverage> = null;
	
	    if (thepolicy.Properties != null) {
	      for (thepoljobprop in thepolicy.Properties) {
	         if (thepoljobprop typeis JobsiteRUExt) {
	           thejobsiterisk.put(thepoljobprop.JobsiteNumberExt, thepoljobprop);
	         }
	      }
	    }
	
	    if (thejobsiterisk != null) {
	      for (thejobsitenum in thejobsiterisk.keySet().iterator()) {
	         var thejobsrisk = thejobsiterisk.get(thejobsitenum);
	         var thejobsitenumber : String = thejobsitenum as java.lang.String;
	
	         for (polprop in thepolicy.Properties) {
	           if (polprop typeis JobsiteRUExt) {
	             if (thejobsitenum == polprop.JobsiteNumberExt and polprop.Property.RiskTypeExt == "JOBSITE") {
	               thejcoverages = new ArrayList<Coverage>();
	               for (thecoverage in polprop.Coverages) {
	                 thejcoverages.add(thecoverage);
	               }
	               thejobsrisk = polprop;
	             }
	           }
	         }
	
	         var jobsriskCat = "<RiskCat><Code>"+jobsriskType+"</Code><Description>"+jobsriskType+"</Description><ListName>EDWRiskType</ListName></RiskCat>"
	         if (!(thejobsrisk.Property.RiskTypeExt != null && thejobsrisk.Property.RiskTypeExt == "JOBSITE")) {
	           thejcoverages = null;
	         }    
	    %>
	        <%=RiskPIMJobsitePropertyTemplate.renderToString(theclaim, thejobsrisk, objStatus, jobsriskCat, displaykey.EDW.Templates.CVRG, jobsriskType, eventName, thejobsitenumber, thejcoverages)%>
	    <%}%>
	  <%}%>    
<%}%>    
    
	 