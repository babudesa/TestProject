<%@ params(c : Claim) %>
<html>
	<head>
		<style type="text/css">
		td.header {font-family:verdana;font-size:12;font-weight:bold}
		td.label {font-family:verdana;font-size:10;font-weight:bold;text-align:left}
		td.value {font-family:verdana;font-size:10;text-align:left}
		</style>
	</head>
	
	<body> 
	<%
		var incidentOnly:boolean = c.IncidentReport;
		var reciepent = ""
		var sender = ""
		var agency = ""
		
		if(c.Policy.underwriter != null){
		  reciepent = c.Policy.underwriter.DisplayName;
		  }else{reciepent = "&#60No Underwriter Indicated&#62"
		}

		if(User.util.getCurrentUser() != null){
		  sender = User.util.getCurrentUser().DisplayName;
		}
		if(c.Policy.ex_Agency != null){
		  agency = c.Policy.ex_Agency.DisplayName;
		}
		
		var animalName = "";
		if(c.Exposures.length > 0){
          for (exp in c.Exposures) {	  
            var name = exp.returnProperty().Property.LocationNumber;
            if(name != null){
              animalName = name;
            }else{
              animalName = "Undefined";
            }    
          }
        }else{
          for (fpi in c.FixedPropertyIncidentsOnly) {	  
            if (animalName != "") animalName = animalName + ", ";
            var name = fpi.Property.LocationNumber;
            if (name == null) name = "Undefined";
            animalName = animalName + name;
          } 
        }
	%>
		<table>
			<tr>
				<td class=header>Notice of Deceased Horse</td>
			</tr>
			<tr>
				<td><br></td>
			</tr>
			<tr>
				<td>
					<table>
						<tr>
							<td class=label>To:</td>
							<td class=value><%= reciepent %></td>
						</tr>
						<tr>
							<td class=label>From:</td>
							<td class=value><%= sender %></td>
						</tr>
					</table>
				</td>
			</tr>
			<tr>
				<td><br></td>
			</tr>
			<tr>
				<td>		 
					<table>
						<tr>
							<td class=label>Claim Number:</td>
							<td class=value><%= c.ClaimNumber %></td>
						</tr>
						<tr>
							<td class=label>Insured Name:</td>
							<td class=value><%= c.Insured %></td>
						</tr>
						<tr>
							<td class=label>Policy Number:</td>
							<td class=value><%= c.Policy.PolicyNumber %></td>
						</tr>
						<tr>
							<td class=label>Policy Mod:</td>
							<td class=value><%= c.Policy.PolicySuffix %></td>
						</tr>
						<tr>
							<td class=label>Policy Effective Date:</td>
							<td class=value><%= gw.api.util.StringUtil.formatDate( c.Policy.EffectiveDate, "MM-dd-yyyy" ) %></td>
						</tr>
						<tr>
							<td class=label>Producer Name:</td>
							<td class=value><%= agency %></td>
						</tr>
						<tr>
							<td class=label>Animal Name:</td>
							<td class=value><%= animalName %></td>
						</tr>
						<tr>
							<td class=label>Cause of Loss:</td>
							<td class=value><%= c.LossCause==null ? "":c.LossCause.DisplayName %><%= c.ex_DetailLossCause==null ? "": ", " + c.ex_DetailLossCause.DisplayName %></td>
						</tr>
						<tr>
							<td class=label>Date of Loss:</td>
							<td class=value><%= gw.api.util.StringUtil.formatDate( c.LossDate, "MM-dd-yyyy") %></td>
						</tr>
						<tr>
							<td class=label>Date of Death:</td>
							<td class=value><%= gw.api.util.StringUtil.formatDate(c.DeathDate, "MM-dd-yyyy")  %></td>
						</tr>
						<tr>
							<td class=label>Adjuster Name:</td>
							<td class=value><%= c.AssignedUser.DisplayName %></td>
						</tr>
					</table> 
				</td>
			</tr>
		</table>	
	</body>
</html>