<%@ params(contacts : List<Contact>) %>
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
      if(contacts.HasElements){
        /** Duplicate Address Items**/
        //build table and header row for duplicate address items          
        bodyStr.append("<table border=\"1\" width=\"0%\">")
        bodyStr.append("<tr><th class=\"color\">Vendor Name</th>")
        bodyStr.append("<th class=\"color\">TaxID</th>")
        
        //build duplcate address item rows                    
        for(contact in contacts){    
          bodyStr.append("<tr>")
          bodyStr.append("<td class=\"left\">" + contact.Name +"</td>")
          bodyStr.append("<td class=\"center\">" + contact.TaxID + "</td>")
          bodyStr.append("</tr>")
        }
        
        bodyStr.append("</table><br/><br/>")
      }
    }catch(e){
      throw e 
    }
    %>
    ${bodyStr.toString()}    
  </body>
</html> 