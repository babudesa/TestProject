<%@ params(investigation : SIUInvestigationExt) %>
<html>
	<head>
		<style type="text/css">
			td.header {font-family:verdana;font-size:12;font-weight:bold}
			td.label {font-family:verdana;font-size:10;font-weight:bold;text-align:left}
			td.value {font-family:verdana;font-size:10;text-align:left}
			th.label {font-family:verdana;font-size:10;font-weight:bold;text-align:left}
		</style>
	</head>
	<body> 
			
		<%
		var recipient = ""
		var sender = ""
		
		if(investigation.SIUInvestigator != null){
		  recipient = "SIU";
		}else{
		  recipient = "&#60No Investigator Indicated&#62";
		}
		if(User.util.getCurrentUser() != null){
		  sender = User.util.getCurrentUser().DisplayName;
		}
		%>
		
		<table>
				<tr>
					<td class=header>SIU Investigation Referral</td>
				</tr>
				<tr>
					<td><br></td>
				</tr>
				<tr>
					<td>
						<table>
							<tr>
								<td class=label>To:</td>
								<td class=value><%= recipient %></td>
							</tr>
							<tr>
								<td class=label>From:</td>
								<td class=value><%= sender %></td>
							</tr>
						</table>
					</td>
				</tr>
			<tr>
				<td>		 
					<table>
						<tr>
							<td class=label>Date of Loss:</td>
							<td class=value><%= gw.api.util.StringUtil.formatDate( investigation.Claim.LossDate, "MM-dd-yyyy" ) %></td>
						</tr>
						<tr>
							<td class=label>Loss Description:</td>
							<td class=value><%= investigation.Claim.Description %></td>
						</tr>
						<tr>
							<td class=label>Insured Name:</td>
							<td class=value><%= investigation.Claim.Policy.insured %></td>
						</tr>
						<tr>
							<td class=label>Claim Number:</td>
							<td class=value><%= investigation.Claim.ClaimNumber %></td>
						</tr>
						<tr>
							<td class=label>SIU Claim Type:</td>
							<td class=value><%= investigation.SIUClaimType.Description %></td>
						</tr>
						<% if(investigation.SIUClaimType=="other") { %>
							<tr>
								<td class=label>Other Type:</td>
								<td class=value><%= investigation.OtherType %></td>
							</tr>
						<% } %>
						</table>
						<table>
					        <tr>
              					  <td class=label>Subject of Research:</td>
              					</tr>
              					<%  var bodyStr = new java.lang.StringBuilder()
                                                    try{      
                                                      if(investigation.Claim.Contacts.HasElements){
                                                        bodyStr.append("<table border=\"1\">")
              						bodyStr.append("<tr><th class=\"label\">Person of Company Information:</th>")
                                                        bodyStr.append("<th class=\"label\">Relationship to Claim:</th>")
                                                        bodyStr.append("<th class=\"label\">Services Requested:</th>")
        
                                                          for (each in investigation.DataResearchParties) {
                                                          var con = investigation.SIUClaimant
                                                            bodyStr.append("<tr>")
                                                              bodyStr.append("<td class=\"value\">" 
                                                              + investigation.siuContactInfo(con) +"</td>")
                                                              bodyStr.append("<td class=\"value\">" + investigation.siuContactRoles(con) +"</td>")
                  					    bodyStr.append("<td class=\"value\">" + investigation.getResearchTypes(each, True) +"</td>")
                                                              bodyStr.append("</tr>")
                                                          }
                                                        }
                                                      }catch(e){
                                                         throw e 
                                                      }
                                                %>
                                                ${bodyStr.toString()}
                                                </table> 
					</table>
				      </td>
				  </tr> 
				</td>
			      </tr>
              		    </table>
              		<table>
              		<tr>
              		      <td class=label>Referral Reason:</td>
              		      <td class=value><%= investigation.ReferralReason %></td>
              		</tr>
		</table>
	</body>
</html>