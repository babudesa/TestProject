<% uses util.gaic.documentstatusreport.DocumentStatusReportItem %>
<%@ params(checkReportItems : List<DocumentStatusReportItem>) %>
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
        bodyStr.append("<H3>Number of Unprocessed Documents: <font color=\"red\">" + checkReportItems.first().Unprocessed + "</font></H3>")
        if(checkReportItems.first().Unprocessed>50)
          bodyStr.append("<H5>Showing 50 documents out of " + checkReportItems.first().Unprocessed + ".</H5>")
        bodyStr.append("<table border=\"1\" width=\"100%\">")
        bodyStr.append("<tr><th class=\"color\">#</th>")
        bodyStr.append("<th class=\"color\">Document Creation Date</th>")
        bodyStr.append("<th class=\"color\">Claim Number</th>")
        bodyStr.append("<th class=\"color\">Document Name</th>")
        bodyStr.append("<th class=\"color\">ECF ID</th>")
        bodyStr.append("<th class=\"color\">Author</th>")
        bodyStr.append("<th class=\"color\">Central Print (CP)</th>")
        bodyStr.append("<th class=\"color\">CP Canceled</th>")
        bodyStr.append("<th class=\"color\">CP Successful</th></tr>")
        
        //build check report item rows 
        var count=1                   
        for(reportItem in checkReportItems){    
          bodyStr.append("<tr>")
          bodyStr.append("<td class=\"color1\" align=\"center\"> "+ count + " </td>")
          count++
          bodyStr.append("<td>" + reportItem.CreateTime + "</td>")
          bodyStr.append("<td class=\"color1\" align=\"center\">" + reportItem.ClaimNumber +"</td>")
          bodyStr.append("<td>" + reportItem.DocumentName +"</td>")
          bodyStr.append("<td class=\"color1\">" + reportItem.ECFID + "</td>")
          bodyStr.append("<td>" + reportItem.Author + "</td>") 
          bodyStr.append("<td class=\"color1\" align=\"center\">" + reportItem.CentralPrint + "</td>")
          bodyStr.append("<td class=\"center\">" + reportItem.CentralPrintCancel + "</td>")
          bodyStr.append("<td class=\"color1\" align=\"center\">" + reportItem.CentralPrintSuccess + "</td>")
          bodyStr.append("</tr>")
        }
        
        bodyStr.append("</table><br/><br/>")
      }else{
        bodyStr.append("<h3>All Documents are successfully processed to ECF!</h3><br/>") 
      }
    }catch(e){
      throw e 
    }
    %>
    ${bodyStr.toString()}    
  </body>
</html> 