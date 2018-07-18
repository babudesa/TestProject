<% uses util.StringUtils %>
<% uses templates.messaging.edw.TypeListTemplate %>
<%@ params(person : Person, theClaim : Claim) %>
<% if (person.SendPartyToCMSExt != null or person.HICNExt != null or person.ContactISOMedicareExt.CMSIncidentDateExt != null
     or person.ContactISOMedicareExt.TermMedBenefit != null or person.ContactISOMedicareExt.MedBenefitTermDate != null
     or (person.ContactISOMedicareExt.ContactICDExt != null and person.ContactISOMedicareExt.ContactICDExt.length > 0) 
     or person.ContactISOMedicareExt.ProductLiabTypeExt != null or person.ContactISOMedicareExt.ProductGenericNameExt != null
     or person.ContactISOMedicareExt.ProductBrandNameExt != null or person.ContactISOMedicareExt.ProductManufacturerExt != null 
     or person.ContactISOMedicareExt.AllegedHarmExt != null or person.ContactISOMedicareExt.NFILLimitExt != null
     or person.ContactISOMedicareExt.ExhaustDateExt != null or person.ContactISOMedicareExt.ORMIndExt != null
     or person.ContactISOMedicareExt.ORMEndDateExt != null or person.StopSendPartyToCMSExt != null
     or person.DeleteFromCMSIndicatorExt != null or person.BelowThresholdExt != null or person.RefuseProvideExt != null
     or (person.ContactISOMedicareExt.TPOCExt != null and person.ContactISOMedicareExt.TPOCExt.length > 0) ) {%>
<Medicare>
  <% if (person.SendPartyToCMSExt != null) {%>	        
  <SendPartyToCMSExt><%=person.SendPartyToCMSExt%></SendPartyToCMSExt> 
  <%}%>
  <% if (person.HICNExt != null) {%>
  <HICNExt><%=StringUtils.getXMLValue(person.HICNExt, false)%></HICNExt>
  <%}%>
  <% if (person.ContactISOMedicareExt.CMSIncidentDateExt != null) {%>
  <CMSIncidentDateExt><%=person.ContactISOMedicareExt.CMSIncidentDateExt%></CMSIncidentDateExt>
  <%}%>
  <% if (person.ContactISOMedicareExt.ContactICDExt != null  and person.ContactISOMedicareExt.ContactICDExt.length > 0) {%>

    <%
    for (i in person.ContactISOMedicareExt.ContactICDExt) {
       if (i.CauseOfInjury == true) {  %>
          <CauseOfInjury><%=i.ICDCode.Code%></CauseOfInjury> 
          <CauseOfInjuryTextExt><%=i.ICDCode.CodeDesc%></CauseOfInjuryTextExt>     
       <% }  %>
    <%}%> 
    <% var medexposure : Exposure %>

    <% if(theClaim != null and theClaim.Exposures.HasElements){  
        var mexposures = theClaim.Exposures.where(\ m -> m.ExposureType == "wc_medical_details" )
        medexposure = mexposures.first();
    } %> 
    <%
    
     if (!(person typeis InjuredWorkerExt and medexposure != null) and exists(inj in person.ContactISOMedicareExt.ContactICDExt where inj.CauseOfInjury != true)) {  %>
         <ICDCodes>  
            <% for (inj in person.ContactISOMedicareExt.ContactICDExt) {  
                 if (inj.CauseOfInjury != true) {  %>
                   <ICDCodeExt>
                      <ICDCode><%=inj.ICDCode.Code%></ICDCode> 
                      <ICDCodeDesc><%=inj.ICDCode.CodeDesc%></ICDCodeDesc> 
                      <% if (inj.ICDCode.ICDVersionExt != null) {%>
                         <%=TypeListTemplate.renderToString(inj.ICDCode.ICDVersionExt, "ICDVersionExt", inj.ICDCode.ICDVersionExt.ListName)%>
                      <%}%> 
                   </ICDCodeExt>
                 <% } %>
            <% } %>
         </ICDCodes>
       <% }  %>   
  <% } %>
  <% if (person.ContactISOMedicareExt.ProductLiabTypeExt != null) {%>
    <%=TypeListTemplate.renderToString(person.ContactISOMedicareExt.ProductLiabTypeExt, "ProductLiabTypeExt", person.ContactISOMedicareExt.ProductLiabTypeExt.ListName)%>
  <%}%>
  <% if (person.ContactISOMedicareExt.ProductGenericNameExt != null) {%>
  <ProductGenericNameExt><%=person.ContactISOMedicareExt.ProductGenericNameExt%></ProductGenericNameExt>
  <%}%>
  <% if (person.ContactISOMedicareExt.ProductBrandNameExt != null) {%>
  <ProductBrandNameExt><%=person.ContactISOMedicareExt.ProductBrandNameExt%></ProductBrandNameExt>
  <%}%>
  <% if (person.ContactISOMedicareExt.ProductManufacturerExt != null) {%>
  <ProductManufacturerExt><%=person.ContactISOMedicareExt.ProductManufacturerExt%></ProductManufacturerExt>
  <%}%>
  <% if (person.ContactISOMedicareExt.AllegedHarmExt != null) {%>
  <AllegedHarmExt><%=person.ContactISOMedicareExt.AllegedHarmExt%></AllegedHarmExt>
  <%}%>
  <% if (person.ContactISOMedicareExt.NFILLimitExt.Amount != null) {%>
  <NFILLimitExt><%=person.ContactISOMedicareExt.NFILLimitExt.Amount%></NFILLimitExt>
  <%}%>
  <% if (person.ContactISOMedicareExt.ExhaustDateExt != null) {%>
  <ExhaustDateExt><%=person.ContactISOMedicareExt.ExhaustDateExt%></ExhaustDateExt>
  <%}%>
  <% if (person.ContactISOMedicareExt.ORMIndExt != null) {%>
  <ORMIndExt><%=person.ContactISOMedicareExt.ORMIndExt%></ORMIndExt>
  <%}%>
  <% if (person.ContactISOMedicareExt.ORMEndDateExt != null) {%>
  <ORMEndDateExt><%=person.ContactISOMedicareExt.ORMEndDateExt%></ORMEndDateExt>
  <%}%>
  <% if (person.StopSendPartyToCMSExt != null) {%>
  <StopSendPartyToCMSExt><%=person.StopSendPartyToCMSExt%></StopSendPartyToCMSExt>
  <%}%>
  <% if (person.DeleteFromCMSIndicatorExt != null) {%>
  <DeleteFromCMSExt><%=person.DeleteFromCMSIndicatorExt%></DeleteFromCMSExt>
  <%}%>
  <% if (person.BelowThresholdExt != null) {%>
  <BelowThresholdExt><%=person.BelowThresholdExt%></BelowThresholdExt>
  <%}%>
  <% if (person.RefuseProvideExt != null) {%>
  <RefuseProvideExt><%=person.RefuseProvideExt%></RefuseProvideExt>
  <%}%>
  <% var origperson = person.OriginalVersion as Person  %>
  <% if ((origperson.ContactISOMedicareExt.TPOCExt != null and origperson.ContactISOMedicareExt.TPOCExt.length > 0) or 
    (person.ContactISOMedicareExt.TPOCExt != null and person.ContactISOMedicareExt.TPOCExt.length > 0)) {%>
    <% var featuremap : java.util.Map = new java.util.HashMap();  %>
    <% var featurelist : java.util.Set = new java.util.HashSet();  %>
    <% var origfeaturelist : java.util.Set = new java.util.HashSet();  %>
    <% if (person.ContactISOMedicareExt.TPOCExt != null and person.ContactISOMedicareExt.TPOCExt.length > 0) {
         for (paymnts in person.ContactISOMedicareExt.TPOCExt) { 
               featurelist.add(paymnts.ExposureExt.PublicID);
               featuremap.put(paymnts.ExposureExt.PublicID, paymnts.ExposureExt.New);
      } } %>
    <% if (origperson.ContactISOMedicareExt.TPOCExt != null and origperson.ContactISOMedicareExt.TPOCExt.length > 0) {
       for (opaymnts in origperson.ContactISOMedicareExt.TPOCExt) { 
               origfeaturelist.add(opaymnts.ExposureExt.PublicID);
       } } %>
    <TPOCPayments>
       <%for (fPublicID in featurelist) {%>
          <TPOCFeature>
            <FeaturePublicID><%=fPublicID%></FeaturePublicID>
            <% if (featuremap.get(fPublicID) as boolean == true) { %>
              <FeatureAttribute>new</FeatureAttribute>
            <% }  %>
            <% for (paym in person.ContactISOMedicareExt.TPOCExt) { %>
                 <% if (fPublicID as java.lang.String == paym.ExposureExt.PublicID) { %>
                    <TPOCPayment>
                    <% if (paym.CMSTPOCNumber != null) {  %>
                      <CMSTPOCNumber><%=paym.CMSTPOCNumber%></CMSTPOCNumber>     
                    <% }  %>
                    <% if (paym.CMSTPOCDate != null) {  %>
                      <CMSTPOCDate><%=paym.CMSTPOCDate%></CMSTPOCDate>     
                    <% }  %>
                    <% if (paym.CMSTPOCAmount != null) {  %>
                      <CMSTPOCAmount><%=paym.CMSTPOCAmount.Amount%></CMSTPOCAmount>     
                    <% }  %>
                    <% if (paym.CMSTPOCStartDate != null) {  %>
                      <CMSTPOCStartDate><%=paym.CMSTPOCStartDate%></CMSTPOCStartDate>     
                    <% }  %>
                    </TPOCPayment>
                 <%}%>
            <%}%>
            <% var exp = find(e in Exposure where e.PublicID == fPublicID as java.lang.String).AtMostOneRow %>
            <% if (exp.ClaimantDenorm.PublicID == person.PublicID) {  %>
                  <TPOCFeatureRole><Role><Code>claimant</Code><Description>Claimant</Description><ListName>ContactRole</ListName></Role></TPOCFeatureRole>     
            <% } %>
          </TPOCFeature>
       <%}%>
       <% for (origfPublicID in origfeaturelist) {
             if (!featurelist.contains(origfPublicID))  {  %>
                  <TPOCFeature>
                      <FeaturePublicID><%=origfPublicID%></FeaturePublicID>
                      <FeatureAttribute>removed</FeatureAttribute>
                      <% var expo = find(e in Exposure where e.PublicID == origfPublicID as java.lang.String).AtMostOneRow
                         if (expo.ClaimantDenorm.PublicID == person.PublicID) { %>
                            <TPOCFeatureRole><Role><Code>claimant</Code><Description>Claimant</Description><ListName>ContactRole</ListName></Role></TPOCFeatureRole>
                         <%}%>
                  </TPOCFeature>       
             <%}%>
      <%  } %>
    </TPOCPayments>            
  <%}%>
  <% if (person.ContactISOMedicareExt.StateOfVenueExt != null) {%>
  <StateOfVenueExt><%=person.ContactISOMedicareExt.StateOfVenueExt%></StateOfVenueExt>
  <%}%>
   <% if (person.ContactISOMedicareExt.TermMedBenefit != null) {%>
  <TermMedBenefit><%=person.ContactISOMedicareExt.TermMedBenefit%></TermMedBenefit>
  <%}%>
  <% if (person.ContactISOMedicareExt.MedBenefitTermDate != null) {%>
  <MedBenefitTermDate><%=person.ContactISOMedicareExt.MedBenefitTermDate%></MedBenefitTermDate>
  <%}%> 
</Medicare> 
<%}%>