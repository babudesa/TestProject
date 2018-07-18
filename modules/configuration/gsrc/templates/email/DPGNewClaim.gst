<% uses java.lang.Double %>
<% uses templates.dataextraction.edw.UserData %>
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
		var recipient = "DPG Broker"
		var claimant= ""
		var sender = ""
		var insurer = ""
		var num = ""
		var email = ""
		var issuingcomp = ""
		var assigned = ""
				
		if(c.AssignedUser != null){
		  assigned = c.AssignedUser.DisplayName}
		    else{assigned = "&#60No Attorney Indicated&#62"}
		    
		if(User.util.getCurrentUser() != null){
		  sender = User.util.getCurrentUser().DisplayName}
		    else{sender = "No User Indicated"}
		    
		if(c.AssignedUser.Contact.WorkPhone != null){
		  num = c.AssignedUser.Contact.WorkPhone}
		    else{num = "&#60No Number Indicated&#62"}
		    
		if(c.AssignedUser.Contact.EmailAddress1 != null){
		  email = c.AssignedUser.Contact.EmailAddress1}
		    else {email = "&#60No Email Indicated&#62"}
		  
		if(c.Policy.IssuingCompanyExt != null){
		  issuingcomp = c.Policy.IssuingCompanyExt.Description}
		    else{issuingcomp = "&#60No Issuing Company Indicated&#62"}
		
	%>			
		<table>	
			<tr>
				<td class=header>DPG New Claim</td>
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
			<table>
						<tr>
						        <td class=label>Insurer: </td>
						        <td class=value><%= issuingcomp %></td>
						</tr>
						<tr>
						        <td class=label>Insured:</td>
						        <td class=value><%= c.Insured %></td>
						</tr>
						<tr>
						        <td class=label>Policy Number:</td>
						        <td class=value><%= c.Policy.PolicyNumber %></td>
					        </tr>
						<tr>
						        <td class=label>Claim Number:</td>
						        <td class=value><%= c.ClaimNumber %></td>
						</tr>						
					</table>
				</td>
			</tr>
			<tr>
				<td><br></td>
			</tr>
			<tr>
			<td class=value><p>This is to acknowledge receipt of correspondence notifying 
				<%= issuingcomp %> of a new matter under the above-referenced policy.  
				Initially, this file has been assigned to <%= assigned %> for handling.  
				<%= assigned %> will be reviewing the information submitted along with policy terms and 
				conditions and will be in contact with the Insured soon.  Please, understand that 
				<%= issuingcomp %> is proceeding under a full and complete reservation of rights.  
				Should you have any questions, please contact <%= assigned %> at 
				<%= num %> or email to 
				<%= email %>.<br><br> 			
                                Underwriting Code: A35DPG</p></td>  
			</tr>			
	</body>
</html>