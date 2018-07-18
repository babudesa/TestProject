<%@ params(obj : Object, ruleNum : String, exception : java.lang.Throwable, otherInfo : String) %>
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
		//var simpleDate:java.text.SimpleDateFormat = new java.text.SimpleDateFormat("MM/dd/yyyy hh:mm:ss");
		var theClaim : String = util.ErrorHandling.GAICErrorHandling.getClaimNumber(obj);
		var environmentInformation : String = util.custom_Ext.finders.getEnvironment();
		var trace:String;
		
		if(User.util.getCurrentUser() != null){
		  sender = User.util.getCurrentUser().DisplayName;
		}		
		
   		trace = exception.getMessage()
   		for(val in exception.StackTrace){
   	 		trace = trace + val + "<br/>";
   		}
		%>
		
		<table>
			<tr>
				<td class=header>ClaimCenter Error Report</td>
			</tr>
			<tr>
				<td><br></td>
			</tr>
			<tr>
				<td></td>
			</tr>
			<tr>
				<td><br></td>
			</tr>
			<tr>
				<td class=value><p>The following error has occured:</p></td>
			</tr>
			<tr>
				<td><br></td>
			</tr>				
			<tr>
				<td>		 
					<table>
						<tr>
							<td class=label>Claim Number:</td>
							<td class=value><%= theClaim %></td>
						</tr>
						<tr>
							<td class=label>Environment:</td>
							<td class=value><%= environmentInformation %></td>
						</tr>
						<tr>
							<td class=label>Time:</td>
							<td class=value><%= gw.api.util.StringUtil.formatDate( gw.api.util.DateUtil.currentDate(), "MM-dd-yyyy hh:mm:ss" ) %></td>
						</tr>
						<tr>
							<td class=label>Logged in User:</td>
							<td class=value><%= sender %></td>
						</tr>
						<tr>
							<td class=label>Rule Number:</td>
							<td class=value><%= ruleNum %></td>
						</tr>
						<tr>
							<td class=label>Additional Comments:</td>
							<td class=value><%= otherInfo==null ? "": otherInfo %></td>
						</tr>
						<tr>
							<td class=label>Stack Trace:</td>
							<td class=value><%= trace %></td>
						</tr>
					</table> 
				</td>
			</tr>
		</table>	
	</body>
</html>