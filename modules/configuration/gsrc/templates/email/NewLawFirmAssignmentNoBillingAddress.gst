<% uses soap.CustomABContactSearch.entity.ABContact%>
<% uses java.util.Date %>

<%@ params(contactName : String, contactCreateDate : Date, contact : ABContact, claim : Claim)%>


<html>
  <head>
    <style type="text/css">
      td.header {font-family:verdana;font-size:12;font-weight:bold}
      td.label {font-family:verdana;font-size:10;font-weight:bold;text-align:left}
      td.value {font-family:verdana;font-size:10;text-align:left}
      p.value {font-family:verdana;font-size:10;font-weight:bold;text-align:left}
    </style>	
  </head>
	
  <body> 	
    <%
      
      var to =   ScriptParameters.CLSAddressBook.split("@")[0]
      var from = claim.AssignedUser
      //{Vendor Law Firm or Vendor Attorney Tax ID}
      var taxID = contact.TaxID 
      if(taxID == null){          
          taxID = "N/A"
      }
      //{Vendor Law Firm or Vendor Attorney Name}
      var name = contactName
      //{Current Date}
      var dateCreated = contactCreateDate
      //{User who entered the new Vendor Law Firm or Vendor Attorney}
      var createdBy = contact.Ex_LoggedInUserID
      if(createdBy == null){
          createdBy = "N/A"
      }
      //{Business Unit of the User who entered the new Vendor Law Firm or Vendor Attorney}
      var businessUnit = contact.LoggedInUserBUNameEXT
      if(businessUnit == null){
          businessUnit = "N/A"
      }
      //Claim Number of the legal action
      var claimNumber = claim.ClaimNumber
    %>
	
  <table>
    <tr>
      <td class=header>ClaimCenter Vendor Billing Address Notification</td>
    </tr>
    <tr>
      <td><br></td>
    </tr>
   </table>
			
    <table>
      <tr>
        <td class=label>To:</td>
	<td class=value><%= to %></td>
      </tr>
      <tr>
	<td class=label>From:</td>
	<td class=value><%= from %></td>
      </tr>
    </table>
					
    <p class=value>A Vendor Law Firm or Vendor Attorney without a Billing Address has been assigned to a Legal Action.  Please update the Billing Address at your earliest opportunity.<br>				
    <table>
      <tr>
        <td class=label>Tax ID:</td>
        <td class=value><%= taxID %></td>
      </tr>
      <tr>
	<td class=label>Law Firm/Attorney:</td>
	  <td class=value><%= name %></td>
	</tr>
      </tr>
      <tr>
	<td class=label>Date Created:</td> 
	<td class=value><%= dateCreated %></td>
      </tr>
      <tr>
        <td class=label>Created By:</td>
	<td class=value><%= gw.plugin.util.CurrentUserUtil.getCurrentUser().User %></td>
      </tr>
      <tr>
        <td class=label>Business Unit/Group:</td>
        <td class=value><%= gw.plugin.util.CurrentUserUtil.getCurrentUser().User.getUserBusinessUnit() %></td>
      </tr>
      <tr>
        <td class=label>Claim Number:</td>
        <td class=value><%= claimNumber %></td>
      </tr>			
    </table> 
  </body>
</html>

