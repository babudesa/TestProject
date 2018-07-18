<%@ params(theCheck : Check) %>
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
		var sender = ""
		var sender2 = ""
		var toUser:User
		var checknum = theCheck.ManualCheck == false ? theCheck.BankAccount.DisplayName +" "+theCheck.CheckNumber : theCheck.ex_ManualPaymentMethod.ListName+" "+ (theCheck.ex_ManualPaymentMethod.Code.equals("manual") ? theCheck.ex_DraftRegion.ListName : theCheck.PrefixExt) +"-"+theCheck.CheckNumber
		var vendor:Contact
		var backuplevy = ""
		var withholdtaxlevy = ""
		var issueDate=""
				
		if(User.util.getCurrentUser() != null){
		  sender = User.util.getCurrentUser().DisplayName;
		}
		if(theCheck.CreateUser != null){
		  sender2 = theCheck.CreateUser.DisplayName;
		}else{
		     sender2 = User.util.getCurrentUser().DisplayName;
		}
				
		toUser = util.GlobalParameters.ParameterFinder.getUserParameter( "unitmanager", theCheck.Claim.LossType ); 
		for (aPayee in theCheck.Payees) { 
	  		if (aPayee.Payee.Ex_TaxStatusCode == "B" || aPayee.Payee.Ex_TaxStatusCode == "T") {
	    		vendor = aPayee.Payee
	    		if(aPayee.Payee.Ex_TaxStatusCode == "B"){
	    		backuplevy = "Backup Withholding"
	    		withholdtaxlevy = "Backup Withholding Payment"
	    		}
	    		if(aPayee.Payee.Ex_TaxStatusCode == "T"){
	    		backuplevy = "Tax Levy imposed"
	    		withholdtaxlevy = "Tax Levy Payment"
	    		}
	    	}
	    }
	    if(theCheck.CreateTime==null){ 
	       issueDate = gw.api.util.StringUtil.formatDate(gw.api.util.DateUtil.currentDate(), "MM-dd-yyyy" ) 
	    }else{
	         issueDate = gw.api.util.StringUtil.formatDate( theCheck.CreateTime, "MM-dd-yyyy" ) 
	    }
		%>

		<table>	
			<tr>
				<td class=header><%= withholdtaxlevy %></td>
			</tr>
			<tr>
				<td><br></td>
			</tr>
			<tr>
				<td>
					<table>
						<tr>
							<td class=label>To:</td>
							<td class=value>DL-ClaimCenter BackupTax, <%= toUser %></td>
						</tr>
						<tr>
							<td class=label>From:</td>
							<td class=value><%= sender2 %></td>
						</tr>
					</table>
				</td>
			</tr>
			<tr>
				<td><br></td>
			</tr>
			<tr>
			<td class=value><p>A payment of $<%=(new java.text.DecimalFormat("########0.00")).format(theCheck.NetAmount.Amount)%> was made on <%= issueDate %> to <%= vendor %> who has a <%= backuplevy %> against them.  The payment was mailed directly to Compliance Accounting.</p></td>
			</tr>
			<tr>
				<td><br></td>
			</tr>
			<tr>
				<td>		 
					<table>
						<tr>
							<td class=label>Issue date:</td>
							<td class=value><%= issueDate %></td>
						</tr>
						<tr>
							<td><br></td>
						</tr>
						<tr>
							<td class=label>Claim Number:</td>
							<td class=value><%=theCheck.Claim.ClaimNumber%></td>
						</tr>
						<tr>
							<td class=label>Bank Name:</td>
							<td class=value><%=theCheck.BankAccount.DisplayName%></td>
						</tr>
						<tr>
							<td class=label>Check Number:</td>
							<td class=value><%=theCheck.CheckNumber as java.lang.String%></td>
						</tr>
						<tr>
							<td class=label>Check Amount:</td>
							<td class=value>$ <%=(new java.text.DecimalFormat("########0.00")).format(theCheck.NetAmount.Amount)%></td>
						</tr>
						<tr>
							<td><br></td>
						</tr>
						<tr>
							<td class=label>Withholding Type:</td>
							<td class=value><%=vendor.Ex_TaxStatusCode.Description%></td>
						</tr>
						<tr>
							<td class=label>Vendor Name</td>
							<td class=value><%= vendor %></td>
						</tr>
						<tr>
							<td class=label>Tax ID:</td>
							<td class=value><%=vendor.TaxID%></td>
						</tr>
					</table> 
				</td>
			</tr>
		</table>	
	</body>
</html>