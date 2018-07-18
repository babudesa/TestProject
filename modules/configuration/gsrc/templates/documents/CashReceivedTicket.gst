<%@ params(BulkRecovery : BulkRecoveryExt, tableData : String, formID : String,insuredName :String) %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html> 
<head>
	<meta http-equiv="content-type"content="text/html; charset=UTF-8">
	<title></title>
	<style type="text/css">
		.labelStyle{
			font-size: 13px;
			font-family: Arial;
		}
		.dataStyle{
			font-size: 11px;
			font-family: Verdana;
			font-weight: bold;
			text-decoration: underline;
		}
		.footerStyle{
			font-size: 10px;
			font-family: Arial;
		}
		h2,h3{
			font-weight: bold;
			font-family: Arial;
			text-align: center;
		}
		td{
			vertical-align: top;
			border: 2px solid #000000;
		}
		td.noRightBorder{
			border-right-width: 0px;
		}
		td.noLeftBorder{
			border-left-width:0px;
		}
		td.noBorder{
			border-style: none none none none;
		}
		table{
			border:3px solid #000000;
			border-collapse: collapse;
			width: 600px;
			border-spacing: 2;
			padding: 3;
			margin-left: auto;
			margin-right: auto;
		}
		table.noBorder{
			border-style: none none none none;
		}
		.center{
			text-align: center;
		}
                #top {
    			position: absolute;
		}
		#container {
    			min-height: 100%;
    			margin-bottom: -14px;
		}
		* html #container {
			height: 100%;
		}
		#footer-spacer {
    			height: 14px;
		}
		#footer {
    			height: 13px;
			margin-left: 24px;
		}

	</style>
</head>
<body>
	<%
     var recievedFrom : String ="";
     if(BulkRecovery.PayerExt.DisplayName!=null)  {
	if(BulkRecovery.PayerExt.DisplayName.contains("(Former)")) {
	   recievedFrom= BulkRecovery.PayerExt.DisplayName.remove("(Former)")
	}
	}
      %>
	
	 
	<div id="top"></div>

	<div id="container">

		<h2>CLAIMCENTER</h2> 
		<h3>CASH RECEIVED FORM</h3> 

		<br/>
	
		<div class="center">
			<table>
				<tbody>
					<tr>
						<td width="300">
							<span class="labelStyle">Insured Name: </span>
							<span class="dataStyle"> <%= insuredName %></span><br/>
							<span class="labelStyle">Received From: </span>						 
							<span class="dataStyle"><%= recievedFrom %></span><br/>
							<span class="labelStyle">Date Received: </span>
							<span class="dataStyle"><%= util.custom_Ext.DateTime.formatDate(BulkRecovery.CreateTime) %></span><br/>
							<span class="labelStyle">Amount Received: </span>
							<span class="dataStyle"><%= gw.api.util.StringUtil.formatNumber(BulkRecovery.TotalAmountExt as java.lang.Double, "$###,###.00") %></span><br/>
						<% if(BulkRecovery.RecoveryCheckNumberExt!=null){ %>
							<span class="labelStyle">Money Order or Check Number: </span>
							<span class="dataStyle"><%= BulkRecovery.RecoveryCheckNumberExt %></span><br/>
						<%}else{%>
							<span class="labelStyle">Money Order or Check Number: </span>
							<span class="dataStyle">_____________</span><br/>
						<%} %>	
						<% if(BulkRecovery.RecoveryCheckDateExt!=null){ %>	
							<span class="labelStyle">Date of Check or Money Order: </span>
							<span class="dataStyle"><%= util.custom_Ext.DateTime.formatDate( BulkRecovery.RecoveryCheckDateExt ) %></span><br/>
						<%}else{%>	
							<span class="labelStyle">Date of Check or Money Order: </span>
							<span class="dataStyle">_____________</span><br/>
						<%} %>
							<span class="labelStyle">Claim Office: </span>
							<span class="dataStyle"><%= BulkRecovery.UpdateUser.getUserGroupBusinessUnit("Office")%></span><br/>
						<% if(BulkRecovery.UpdateUser.getUserGroupBusinessUnit("BusinessUnit")!=null){ %>
							<span class="labelStyle">Business Unit: </span>
							<span class="dataStyle"><%= BulkRecovery.UpdateUser.getUserGroupBusinessUnit("BusinessUnit") %></span>
						<%}else{%>
							<span class="labelStyle">Business Unit: </span>
							<span class="dataStyle">______________________</span>
						<%} %>
						</td>
						<td width="300">
							<span class="labelStyle">Cost Type: </span>
							<span class="dataStyle">see below</span><br/>
							<span class="labelStyle">Recovery Category: </span>
							<span class="dataStyle">see below</span><br/>
							<span class="labelStyle">Expense Code: </span>
							<span class="dataStyle">see below</span><br/>
							<span class="labelStyle">Receipt No.: </span>
							<span class="dataStyle"><%= BulkRecovery.CashReceiptNumberExt %></span><br/>
						</td>
					</tr>
					<tr>
						<td class="noRightBorder" >
							<span class="labelStyle">Completed By: </span>
							<span class="dataStyle"><%= BulkRecovery.UpdateUser %></span><br/>
							<span class="labelStyle">Claim Number: </span>
							<span class="dataStyle">see below</span><br/>
							<span class="labelStyle">Policy Number: </span>
							<span class="dataStyle">see below</span>
						</td>
						<td class="noLeftBorder" >
							<span class="labelStyle">Date: </span>
							<span class="dataStyle"><%= util.custom_Ext.DateTime.formatDate( gw.api.util.DateUtil.currentDate() ) %></span><br/>
						</td>
					</tr>
				</tbody>
			</table>
			<br/>
			<table>
				<tbody>
					<tr>
						<td class="labelStyle">Claim Number</td>
						<td class="labelStyle">Policy Number</td>
						<td class="labelStyle">Amt per Claim</td>
						<td class="labelStyle">Cost Type</td>
						<td class="labelStyle">Recovery Category</td>
						<td class="labelStyle">Expense Code</td>
					</tr>
					<%= tableData %>
				</tbody>
			</table>
		</div>
		<div id="footer-spacer"></div>
	</div>
	<div id="footer">
		<table class="noBorder">
			<tbody>
				<tr>
					<td  class="noBorder"><span class="footerStyle"><%= formID %></span></td>
				</tr>
			</tbody>
		</table>
	</div>
</body>
</html>	