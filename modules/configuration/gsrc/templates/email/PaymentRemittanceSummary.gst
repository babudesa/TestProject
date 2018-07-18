<%@ params(check : Check) %>
<html>
  <head>
    <style type="text/css">
      th.color {background-color:DarkGray;}
      td.center {text-align:center;}
    </style>
  </head>
  <body>
    <%    
      var bodyStr = new java.lang.StringBuilder()
      bodyStr.append("<table border=\"1\" width=\"50%\">")
      bodyStr.append("<tr><th class=\"color\">Check Number</th><th class=\"color\">Check Date</th><th class=\"color\">Check Amount</th><th class=\"color\">Statement of Account</th></tr>")
      bodyStr.append("<tr><td class=\"center\">" + check.CheckNumber)
      bodyStr.append("</td><td class=\"center\">" + check.CreateTime)
      bodyStr.append("</td><td class=\"center\">" + check.BulkInvoiceItem.BulkInvoice.ReportableAmount)
      bodyStr.append("</td><td class=\"center\">" + check.Memo + "</td></tr>")          
      bodyStr.append("</table><br/><br/>")
    %>
    ${bodyStr != null ? bodyStr.toString() : ""}
  </body>
</html> 