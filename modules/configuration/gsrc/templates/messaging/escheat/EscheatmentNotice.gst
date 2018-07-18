<%@ params(check : Check, attemptNumber : String ) %>
<?xml version="1.0" encoding="utf-8"?>
<ns1:CreateTransactionBatchRequest xmlns:ns1="http://www.gaic.com/ContentPubService">
    <ns1:ApplicationCode>005</ns1:ApplicationCode>
<ns1:Driver>
<Policy_Application>
    <!--Element Policy_Transaction, maxOccurs=unbounded-->
   <%  
   uses java.text.SimpleDateFormat; 
   uses java.lang.Integer;
      
   // Added dynamic code. Defect #5561  -tray2
    var documentID=""
    if (attemptNumber!=null and attemptNumber.trim().equals("1")){
      documentID="ENT0033"
    }else if (attemptNumber!=null and attemptNumber.trim().equals("2")){
     documentID="ENT0034"
    }
    
   //Assigned Group specific 
   //Applicable for all LOB
  
    var group:Group=check.Claim.AssignedGroup
    var businessUnit:String=""
    var office:String=""
    var adjMailAddress:Address
    var addressLine1:String=""
    var addressLine2:String=""
    var csz:String=""
    var country:String=""
  
    //Moving up through the hierarchy and picking the required value all the way until root group
    while(group != null && group != group.RootGroup && group.GroupType != GroupType.TC_BUSUNIT) {
      group=group.Parent
    }
    
    if(group.GroupType == GroupType.TC_BUSUNIT && group.DivisionNameExt.DivisionNameValue != null){
      businessUnit = group.DivisionNameExt.DivisionNameValue
    } else {
      //if Division name and address is still not present, then default value applies
      businessUnit=""
    }
    
    if((office ==null or office=="") and group.GroupType == GroupType.TC_BUSUNIT){
      office = group.DisplayName
    }
    // Defect#8497 Address under the logo on Escheatment letter should be Adjuster Mailing address, not group's address
    //addressLine1=group.GroupAddressExt.AddressLine1
    for(addr in check.Claim.AssignedUser.Contact.AllAddresses) {
      if(addr.AddressType == "mailing") {
        adjMailAddress = addr
        //There should only be one mailing address for an ajuster
        break
      }  //end mailing if
    }  //end for loop
    if(adjMailAddress.AddressLine1 != null){
      addressLine1=adjMailAddress.AddressLine1
    } else {
      //Default addressline2 will set only if default addressline1 sets.
      addressLine1="301 East Fourth Street" 
      csz="Cincinnati, OH 45202"
    }

    if(adjMailAddress.AddressLine2 != null && adjMailAddress.AddressLine2 != ""){
      addressLine2=adjMailAddress.AddressLine2
    }
    if(adjMailAddress.CityStateZip!=null and adjMailAddress.CityStateZip!=""){
      csz=adjMailAddress.CityStateZip
    }

    if(adjMailAddress.Country!=null){
      country=adjMailAddress.Country
    }

    var claimNoticeAdjusterBU=businessUnit;

    //Check for copyright - business unit
    if(businessUnit.matches(".*[\\xa9].*")){
           var NONASCII = java.util.regex.Pattern.compile("[\\xa9]");
           businessUnit = NONASCII.matcher(businessUnit).replaceAll("{super}{ANB8}"+(Integer.parseInt("a9", 16) as char)+"{ANB14}{/super}")
           claimNoticeAdjusterBU = NONASCII.matcher(claimNoticeAdjusterBU).replaceAll("{super}{AN6}"+(Integer.parseInt("a9", 16) as char)+"{AN10}{/super}")
    }             
    //check for registered - business unit
    if(businessUnit.matches(".*[\\xae].*")){
           var NONASCII2 = java.util.regex.Pattern.compile("[\\xae]");
           businessUnit = NONASCII2.matcher(businessUnit).replaceAll("{super}{ANB8}"+(Integer.parseInt("ae", 16) as char)+"{ANB14}{/super}")
           claimNoticeAdjusterBU = NONASCII2.matcher(claimNoticeAdjusterBU).replaceAll("{super}{AN6}"+(Integer.parseInt("ae", 16) as char)+"{AN10}{/super}")
    }
    
    //Check for copyright - office
    if(office.matches(".*[\\xa9].*")){
           var NONASCII = java.util.regex.Pattern.compile("[\\xa9]");
           office = NONASCII.matcher(office).replaceAll("{super}{A6}"+(Integer.parseInt("a9", 16) as char)+"{A10}{/super}")
    }             
    //check for registered - office
    if(office.matches(".*[\\xae].*")){
           var NONASCII2 = java.util.regex.Pattern.compile("[\\xae]");
           office = NONASCII2.matcher(office).replaceAll("{super}{A6}"+(Integer.parseInt("ae", 16) as char)+"{A10}{/super}")
    }
    //Assigned User (Adjuster) specific
    var adjusterName:String = check.Claim.AssignedUser.DisplayName
    var adjusterJobTitle:String = check.Claim.AssignedUser.JobTitle
    var adjusterEmail1:String = check.Claim.AssignedUser.Contact.EmailAddress1
    var adjusterFax:String=check.Claim.AssignedUser.Contact.FaxPhone
    var adjusterSignature:String = check.Claim.AssignedUser.ex_Signature
    var adjusterTollFreePhone:String=check.Claim.AssignedUser.ex_TollFreePhone
    var adjusterWorkPhone:String = check.Claim.AssignedUser.Contact.WorkPhone
    var adjusterCompany:String=check.Claim.Policy.IssuingCompanyExt.Description
    
    //Default company in signature block
    if(adjusterCompany==null or adjusterCompany=="" ){adjusterCompany="Great American Insurance Company"}
    
    var sdf:SimpleDateFormat = new SimpleDateFormat("MM/dd/yyyy") ;
    var issueDate:String = sdf.format(check.IssueDate!=null? check.IssueDate :gw.api.util.DateUtil.currentDate());
    var noticeDate:String = sdf.format( gw.api.util.DateUtil.currentDate() );
    
     //Recipient Data
     //Escheat letter should be mailed to mailing address Defect #6215
    
    var recipientName:String  = check.MailTo
    var recipientAddr1:String = check.MailToAddressOwner.Address.AddressLine1
    var recipientAddr2:String = check.MailToAddressOwner.Address.AddressLine2
    var recipientAddr3:String = check.MailToAddressOwner.Address.AddressLine3
    var recipientCityStateZip:String = check.MailToAddressOwner.Address.CityStateZip
    var recipientCountry : String = null
    
    if (check.DeliveryMethod=="hold"){
      recipientName = displaykey.GAIC.Check.ReturnToOffice.DefaultCompany
      recipientAddr1 = check.Claim.AssignedGroup.DivisionNameExt.DivisionNameValue==null?"":check.Claim.AssignedGroup.DivisionNameExt.DivisionNameValue
      recipientAddr2 = check.AttentionMailToExt != null ? "Attn: " + check.AttentionMailToExt : ""
      recipientAddr3 = check.MailToAddressOwner.Address.AddressLine1
      recipientCityStateZip = check.MailToAddressOwner.Address.AddressLine2
      recipientCountry = check.MailToAddressOwner.Address.CityStateZip
    } else if (check.AttentionMailToExt != null) {
      recipientAddr1 = "Attn: " + check.AttentionMailToExt
      recipientAddr2 = check.MailToAddressOwner.Address.AddressLine1
      recipientAddr3 = check.MailToAddressOwner.Address.AddressLine2
      recipientCityStateZip = check.MailToAddressOwner.Address.AddressLine3
      recipientCountry = check.MailToAddressOwner.Address.CityStateZip
    }

    
    var region:String =""
    if(check.TypeOfCheckExt=="us_check"){
      region="state"
    }else if(check.TypeOfCheckExt=="canadian_check"){
      region="province"
    }
                  
    %>        
    
    <Policy_Transaction>
      <Claim_Notice_Company_Name>Great American Insurance Company</Claim_Notice_Company_Name>
        <Claim_Address>
          <Claim_Notice_Office><%=util.StringUtils.getXMLValue(office, false)%></Claim_Notice_Office>
          <Claim_Notice_Address><%=util.StringUtils.getXMLValue(addressLine1, false)%></Claim_Notice_Address>
         <Claim_Notice_Address2><%=util.StringUtils.getXMLValue(addressLine2, false)%></Claim_Notice_Address2>
		 <Claim_Notice_Address3></Claim_Notice_Address3>
          <Claim_Notice_CSZ><%=util.StringUtils.getXMLValue(csz, false)%></Claim_Notice_CSZ>
         <Claim_Notice_Country><%=util.StringUtils.getXMLValue(country, false)%></Claim_Notice_Country>
         <Claim_Notice_Fax><%=util.StringUtils.getXMLValue(adjusterFax, false)%></Claim_Notice_Fax>
         <Claim_Notice_Phone><%=adjusterTollFreePhone!=null? adjusterTollFreePhone : (adjusterWorkPhone!=null? adjusterWorkPhone:"")%></Claim_Notice_Phone>
          <Claim_Notice_Logo_Division><%=util.StringUtils.getXMLValue(businessUnit, false)%></Claim_Notice_Logo_Division>
        </Claim_Address>
        <Claim_Notice_Recipient_Data>
          <Claim_Notice_Recipient_Name><%= util.StringUtils.getXMLValue(recipientName, false)%></Claim_Notice_Recipient_Name>
          <Claim_Notice_Recipient_Addr_1><%=util.StringUtils.getXMLValue(recipientAddr1, false)%></Claim_Notice_Recipient_Addr_1>
          <Claim_Notice_Recipient_Addr_2><%=recipientAddr2 == null ? util.StringUtils.getXMLValue(recipientCityStateZip, false) 
           : util.StringUtils.getXMLValue(recipientAddr2, false) %></Claim_Notice_Recipient_Addr_2>
          <Claim_Notice_Recipient_Addr_3><%=recipientAddr2 == null ? "" : recipientAddr3 == null ? util.StringUtils.getXMLValue(recipientCityStateZip, false)
           : util.StringUtils.getXMLValue(recipientAddr3, false) %></Claim_Notice_Recipient_Addr_3>
          <Claim_Notice_Recipient_Addr_4><%=recipientAddr2 == null ? "" : recipientAddr3 == null ? "" : util.StringUtils.getXMLValue(recipientCityStateZip, false)  %></Claim_Notice_Recipient_Addr_4>
          <Claim_Notice_Recipient_Country><%=recipientCountry == null ? "" : util.StringUtils.getXMLValue(recipientCountry, false)%></Claim_Notice_Recipient_Country>        
        </Claim_Notice_Recipient_Data>
        <Claim_Notice_Check_Data>
          <Claim_Notice_Check_Num><%=check.CheckNumber%></Claim_Notice_Check_Num>
         <Claim_Notice_Check_Date><%=issueDate%></Claim_Notice_Check_Date>
         <Claim_Notice_Check_Amount><%=gw.api.util.StringUtil.formatNumber(check.NetAmount.Amount, "#,##0.00")%></Claim_Notice_Check_Amount>
         <Claim_Notice_Check_Payee_Name><%= util.StringUtils.getXMLValue(check.PayTo, false) %></Claim_Notice_Check_Payee_Name>
        </Claim_Notice_Check_Data>
        <Claim_Notice_Date><%=noticeDate%></Claim_Notice_Date>
       <Claim_Notice_Number><%=check.Claim.ClaimNumber%></Claim_Notice_Number>
       <Claim_Notice_Text><%=attemptNumber%></Claim_Notice_Text>
       <Claim_Notice_Document_ID><%=documentID%></Claim_Notice_Document_ID>
       <Claim_Notice_Adjuster_Name><%=adjusterSignature != null? adjusterSignature : adjusterName%></Claim_Notice_Adjuster_Name>
       <Claim_Notice_Adjuster_Title><%=adjusterJobTitle != null ? adjusterJobTitle : ""%></Claim_Notice_Adjuster_Title>
       <Claim_Notice_Adjuster_Company><%=util.StringUtils.getXMLValue(adjusterCompany, false)%></Claim_Notice_Adjuster_Company>
       <Claim_Notice_Adjuster_Email><%=adjusterEmail1 != null ? adjusterEmail1 :""%></Claim_Notice_Adjuster_Email>
       <Claim_Notice_Adjuster_Phone><%=adjusterTollFreePhone!=null? adjusterTollFreePhone : (adjusterWorkPhone!=null? adjusterWorkPhone:"") %></Claim_Notice_Adjuster_Phone>
       <Claim_Notice_Adjuster_BusinessUnit><%=util.StringUtils.getXMLValue(claimNoticeAdjusterBU, false)%></Claim_Notice_Adjuster_BusinessUnit>
       <Claim_Notice_Region><%=util.StringUtils.getXMLValue(region, false)%></Claim_Notice_Region>
    </Policy_Transaction>
</Policy_Application>
</ns1:Driver>
   <!-- Not used in initial release of escheat -->
   <!--<IntendedQueueCode>string</IntendedQueueCode>
   <PostalTracking>string</PostalTracking>
   <CustomerTracking>string</CustomerTracking>
   <DataFiles>
  <DataFile Filename="string" />
     <DataFile Filename="string" />
</DataFiles>
-->
</ns1:CreateTransactionBatchRequest>