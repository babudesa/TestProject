<%uses util.StringUtils%>
<%uses templates.messaging.edw.TypeListTemplate %>
<%@ params(exposure : Exposure) %>
<%var origExp = exposure.OriginalVersion as Exposure %>
<%var isClaimantchgd:boolean = (origExp.ClaimantDenorm.PublicID == exposure.ClaimantDenorm.PublicID) ? false : true;%>

<% if (isClaimantchgd) {
     if (gw.api.util.ArrayUtil.count(exposure.Liens) > 0) { %>
        <FeatureLienData>
          <% for (lien in exposure.Liens) { %>
                  <FeatureLien>
                  <FeaturePublicID><%=exposure.PublicID%></FeaturePublicID>
                  <LienContactPublicID><%=lien.LienholderExt.PublicID%></LienContactPublicID>
                  <LienContactObjStatus>C</LienContactObjStatus>
                  <LienContactRole><Role><Code>claimlosspayee</Code><Description>ClaimLossPayee</Description><ListName>ContactBidiRel</ListName></Role></LienContactRole>
                  <LienContactRoleObjStatus>A</LienContactRoleObjStatus>
                  <% if (lien.AccountNumber != null) {%>
                     <LienAccountNumber><%=lien.AccountNumber%></LienAccountNumber>
                  <% }%>
                  <LienType><Code><%=lien.LienType.Code%></Code><Description><%=lien.LienType.Description%></Description><ListName><%=lien.LienType.ListName%></ListName></LienType>
                  </FeatureLien>
          <% }  %>
        </FeatureLienData>
     <% } %>
<% }  else  {
     if (gw.api.util.ArrayUtil.count(exposure.Liens) > 0 or gw.api.util.ArrayUtil.count(exposure.getRemovedArrayElements("Liens")) > 0) { %>
        <%var robjStatus = "C";%>
        <FeatureLienData>
        <% if (gw.api.util.ArrayUtil.count(exposure.Liens) > 0) { %>
            <% for (lien in exposure.Liens) {%>
                <%if (lien.New) {
  	             robjStatus = "A";
  	        } else {
  	             robjStatus = "C";
  	        } %>
  	        <%if (!lien.New and (lien.ChangedFields.contains("LienholderExt"))) { %>
                    <% var origLien = lien.OriginalVersion as LienDetailsExt  %>
                    <% if (lien.LienholderExt.PublicID != origLien.LienholderExt.PublicID) {%>
                         <FeatureLien>
                              <FeaturePublicID><%=exposure.PublicID%></FeaturePublicID>
                              <LienContactPublicID><%=lien.LienholderExt.PublicID%></LienContactPublicID>
                              <LienContactObjStatus>C</LienContactObjStatus>
                              <LienContactRole><Role><Code>claimlosspayee</Code><Description>ClaimLossPayee</Description><ListName>ContactBidiRel</ListName></Role></LienContactRole>
                              <LienContactRoleObjStatus>A</LienContactRoleObjStatus>
                              <% if (lien.AccountNumber != null) {%>
                                 <LienAccountNumber><%=lien.AccountNumber%></LienAccountNumber>
                              <% }%>
                              <LienType><Code><%=lien.LienType.Code%></Code><Description><%=lien.LienType.Description%></Description><ListName><%=lien.LienType.ListName%></ListName></LienType>
                         </FeatureLien>
                         <FeatureLien>
                              <FeaturePublicID><%=exposure.PublicID%></FeaturePublicID>
                              <LienContactPublicID><%=origLien.LienholderExt.PublicID%></LienContactPublicID>
                              <LienContactObjStatus>C</LienContactObjStatus>
                              <LienContactRole><Role><Code>claimlosspayee</Code><Description>ClaimLossPayee</Description><ListName>ContactBidiRel</ListName></Role></LienContactRole>
                              <LienContactRoleObjStatus>D</LienContactRoleObjStatus>
                              <% if (origLien.AccountNumber != null) {%>
                                 <LienAccountNumber><%=origLien.AccountNumber%></LienAccountNumber>
                              <% }%>
                              <LienType><Code><%=origLien.LienType.Code%></Code><Description><%=origLien.LienType.Description%></Description><ListName><%=origLien.LienType.ListName%></ListName></LienType>
                         </FeatureLien>
                    <% } else { %>
                         <FeatureLien>
                              <FeaturePublicID><%=exposure.PublicID%></FeaturePublicID>
                              <LienContactPublicID><%=origLien.LienholderExt.PublicID%></LienContactPublicID>
                              <LienContactObjStatus>C</LienContactObjStatus>
                              <LienContactRole><Role><Code>claimlosspayee</Code><Description>ClaimLossPayee</Description><ListName>ContactBidiRel</ListName></Role></LienContactRole>
                              <LienContactRoleObjStatus><%=robjStatus%></LienContactRoleObjStatus>
                              <% if (origLien.AccountNumber != null) {%>
                                 <LienAccountNumber><%=origLien.AccountNumber%></LienAccountNumber>
                              <% }%>
                              <LienType><Code><%=origLien.LienType.Code%></Code><Description><%=origLien.LienType.Description%></Description><ListName><%=origLien.LienType.ListName%></ListName></LienType>
                         </FeatureLien>
                  <% } %>
                <% } else { %>
                  <FeatureLien>
                    <FeaturePublicID><%=exposure.PublicID%></FeaturePublicID>
                    <LienContactPublicID><%=lien.LienholderExt.PublicID%></LienContactPublicID>
                    <LienContactObjStatus>C</LienContactObjStatus>
                    <LienContactRole><Role><Code>claimlosspayee</Code><Description>ClaimLossPayee</Description><ListName>ContactBidiRel</ListName></Role></LienContactRole>
                    <LienContactRoleObjStatus><%=robjStatus%></LienContactRoleObjStatus>
                    <% if (lien.AccountNumber != null) {%>
                       <LienAccountNumber><%=lien.AccountNumber%></LienAccountNumber>
                    <% }%>
                    <LienType><Code><%=lien.LienType.Code%></Code><Description><%=lien.LienType.Description%></Description><ListName><%=lien.LienType.ListName%></ListName></LienType>
                  </FeatureLien>
                <% }  %>
            <% }  %>
        <% }  %>
        <% if (gw.api.util.ArrayUtil.count(exposure.getRemovedArrayElements("Liens")) > 0) { %>
            <% for (lienD in exposure.getRemovedArrayElements("Liens"))  {
  	          robjStatus = "D";
  	          var lienDel = lienD as LienDetailsExt %>
                  <FeatureLien>
                    <FeaturePublicID><%=exposure.PublicID%></FeaturePublicID>
                    <LienContactPublicID><%=lienDel.LienholderExt.PublicID%></LienContactPublicID>
                    <LienContactObjStatus>C</LienContactObjStatus>
                    <LienContactRole><Role><Code>claimlosspayee</Code><Description>ClaimLossPayee</Description><ListName>ContactBidiRel</ListName></Role></LienContactRole>
                    <LienContactRoleObjStatus><%=robjStatus%></LienContactRoleObjStatus>
                    <% if (lienDel.AccountNumber != null) {%>
                       <LienAccountNumber><%=lienDel.AccountNumber%></LienAccountNumber>
                    <% }%>
                    <LienType><Code><%=lienDel.LienType.Code%></Code><Description><%=lienDel.LienType.Description%></Description><ListName><%=lienDel.LienType.ListName%></ListName></LienType>
                  </FeatureLien>
            <% }  %>
        <% }  %>
        </FeatureLienData>
     <%}%>
<%}%>