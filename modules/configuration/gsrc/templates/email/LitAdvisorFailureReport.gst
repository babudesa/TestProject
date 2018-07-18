<% uses util.gaic.LitAdvisorReport.LitAdvisorFailureReportItem%>
<%@ params(checkReportItems : List<LitAdvisorFailureReportItem>) %>
<html>
  <head>
    <style type="text/css">
      th.color {background-color:DarkGray;}
      td.color1 {background-color:#e4e7e7;}
      td.center {text-align:center;}
      th,td,h3,h4 {font-family:Calibri}
    </style>
  </head>
  <body>
    <%  var bodyStr = new java.lang.StringBuilder()
    try{      
      if(checkReportItems.HasElements){
        /**Check Status Report Items**/
        //build table and header row for check report items  
        bodyStr.append("<H3>ClaimCenter - LitAdvisor Missing Payment Status Report:<font color=\"red\">" + checkReportItems.Count + "</font></H3>")
        bodyStr.append("<table border=\"1\" width=\"100%\">")
        bodyStr.append("<tr><th class=\"color\">#</th>")
        bodyStr.append("<th class=\"color\">ClaimNumber</th>")
        bodyStr.append("<th class=\"color\">TaxID</th>")
        bodyStr.append("<th class=\"color\">MatterID</th>")
        bodyStr.append("<th class=\"color\">InvoiceNumber</th>")
        bodyStr.append("<th class=\"color\">OriginalAmount</th>")
        bodyStr.append("<th class=\"color\">PaymentAmount</th>")
        bodyStr.append("<th class=\"color\">RecycleCount</th>")
        bodyStr.append("<th class=\"color\">ErrorMessage</th>")
        bodyStr.append("<th class=\"color\">ReceivedTime</th>")
        bodyStr.append("<th class=\"color\">LastUpdateTime</th>")
        bodyStr.append("<th class=\"color\">BusinessUnit</th></tr>")
       
        //build check report item rows 
        var count=1                   
        for(reportItem in checkReportItems){    
          bodyStr.append("<tr>")
          bodyStr.append("<td class=\"color1\" align=\"center\"> "+ count + " </td>")
          count++
          bodyStr.append("<td>" + reportItem.ClaimNumber + "</td>")
          bodyStr.append("<td>" + reportItem.TaxID +"</td>")
          bodyStr.append("<td>" + reportItem.MatterID + "</td>") 
          bodyStr.append("<td>" + reportItem.InvoiceNumber + "</td>") 
          bodyStr.append("<td>" + reportItem.OriginalAmount+ "</td>")
          bodyStr.append("<td>" + reportItem.PaymentAmount + "</td>") 
          bodyStr.append("<td>" + reportItem.RecycleCount + "</td>") 
          bodyStr.append("<td>" + reportItem.ErrorMessage+ "</td>") 
          bodyStr.append("<td>" + reportItem.ReceivedTime + "</td>") 
          bodyStr.append("<td>" + reportItem.LastUpdateTime + "</td>") 
          bodyStr.append("<td>" + reportItem.BusinessUnit + "</td>") 
          
          bodyStr.append("</tr>")
        }
        
        bodyStr.append("</table><br/><br/>")
      }else{
        bodyStr.append("<h3>All payments were successfully sent to the LitAdvisor Error Report.</h3><br/>") 
      }
    }catch(e){
      throw e 
    }
    %>
    ${bodyStr.toString()}    
  </body>
</html> 










