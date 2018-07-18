<% uses util.gaic.checkstatusreport.CheckStatusReportItem %>
<% uses util.gaic.checkstatusreport.BulkInvoiceStatusReportItem %>
<%@ params(checkReportItems : List<CheckStatusReportItem>, bulkReportItems : List<BulkInvoiceStatusReportItem>) %>
<html>
  <head>
    <style type="text/css">
      th.color {background-color:DarkGray;}
      td.center {text-align:center;}
    </style>
  </head>
  <body>
    <%  var bodyStr = new java.lang.StringBuilder()
    try{      
      if(checkReportItems.HasElements){
        /**Check Status Report Items**/
        //build table and header row for check report items          
        bodyStr.append("<table border=\"1\" width=\"100%\">")
        bodyStr.append("<tr><th class=\"color\">Claim Business Unit</th>")
        bodyStr.append("<th class=\"color\">Claim Group</th>")
        bodyStr.append("<th class=\"color\">Claim Number</th>")
        bodyStr.append("<th class=\"color\">Check Number</th>")
        bodyStr.append("<th class=\"color\">Net Check Amount</th>")
        bodyStr.append("<th class=\"color\">Create Time</th>")
        bodyStr.append("<th class=\"color\">Adjuster's Name</th>")
        bodyStr.append("<th class=\"color\">Adjuster's Supervisor</th>")
        bodyStr.append("<th class=\"color\">Reason</th></tr>")
        
        //build check report item rows                    
        for(reportItem in checkReportItems){    
          bodyStr.append("<tr>")
          bodyStr.append("<td class=\"center\">" + reportItem.BusinessLine +"</td>")
          bodyStr.append("<td class=\"center\">" + reportItem.AssignedClaimGroup + "</td>")
          bodyStr.append("<td class=\"center\">" + reportItem.ClaimNumber + "</td>")
          bodyStr.append("<td class=\"center\">" + reportItem.CheckNumber + "</td>")
          bodyStr.append("<td class=\"center\">" + reportItem.CheckTotal + "</td>")
          bodyStr.append("<td class=\"center\">" + reportItem.CreateTime + "</td>")        
          bodyStr.append("<td class=\"center\">" + reportItem.AdjusterName + "</td>")
          bodyStr.append("<td class=\"center\">" + reportItem.AdjusterSupervisor + "</td>")
          bodyStr.append("<td class=\"center\">" + reportItem.Condition.Reason + "</td>") 
          bodyStr.append("</tr>")
        }
        
        bodyStr.append("</table><br/><br/>")
      }else{
        bodyStr.append("<h3>No Checks found meeting specified conditions.</h3></br>") 
      }
      
      if(bulkReportItems.HasElements){
        /**Bulk Invoice Status Report Items**/      
        //build the table and header row for bulk invoice report items
        bodyStr.append("<table border=\"1\" width=\"100%\">")
        bodyStr.append("<tr><th class=\"color\">Bulk Invoice Number</th>")
        bodyStr.append("<th class=\"color\">Bulk Invoice Type</th>")
        bodyStr.append("<th class=\"color\">Check Number</th>")
        bodyStr.append("<th class=\"color\">Net Check Amount</th>")
        bodyStr.append("<th class=\"color\">Creation Time</th>")
        bodyStr.append("<th class=\"color\">Created by User</th>")
        bodyStr.append("<th class=\"color\">Payee</th>")
        bodyStr.append("<th class=\"color\">Reason</th></tr>") 
      
        //build bulk invoice item rows
        for(reportItem in bulkReportItems){    
          bodyStr.append("<tr>")
          bodyStr.append("<td class=\"center\">" + reportItem.InvoiceNumber + "</td>")
          bodyStr.append("<td class=\"center\">" + reportItem.InvoiceType.DisplayName + "</td>")
          bodyStr.append("<td class=\"center\">" + reportItem.CheckNumber + "</td>")
          bodyStr.append("<td class=\"center\">" + reportItem.NetAmount + "</td>")
          bodyStr.append("<td class=\"center\">" + reportItem.CreateTime + "</td>")
          bodyStr.append("<td class=\"center\">" + reportItem.CreateUserName + "</td>")
          bodyStr.append("<td class=\"center\">" + reportItem.PayeeName + "</td>")                
          bodyStr.append("<td class=\"center\">" + reportItem.Condition.Reason + "</td>")
          bodyStr.append("</tr>")
        }
      
        bodyStr.append("</table><br/><br/>")            
      }else{
        bodyStr.append("<h3>No Bulk Invoices found meeting specified conditions.</h3></br>")        
      }
    }catch(e){
      throw e 
    }
    %>
    ${bodyStr.toString()}    
  </body>
</html> 