<%@ params(history : ScriptToolHistoryExt) %>
<html>
  <head>
    <style type="text/css">
      th.color {background-color:DarkGray;}
      td.center {text-align:center;}
    </style>
  </head>
  <body>
    <%
      var modBeans : java.lang.StringBuilder      
      if(history.BundleAsString != null){
        
        var xmlBundle = util.scripttool.ScriptToolAudit.Bundle.parse(history.BundleAsString)
        
        if(xmlBundle.ModifiedBeans.Count > 0){
          var xmlBean : util.scripttool.ScriptToolAudit.Bean
          var xmlField : util.scripttool.ScriptToolAudit.Field
          modBeans = new java.lang.StringBuilder()
          
          //limit the number of modified beans to display to prevent generating a huge email
          var beanLimit = 25
          var beanList = (xmlBundle.ModifiedBeans.Count > beanLimit ? xmlBundle.ModifiedBeans.subList(0, beanLimit) : xmlBundle.ModifiedBeans)
          modBeans.append("<h3>Modified Beans</h3>")
          if(beanList.Count < xmlBundle.ModifiedBeans.Count)
            modBeans.append("<b>Only the first " + beanLimit + " modified beans are displayed below. To see the entire bundle, please view the appropriate database record.</b><br/><br/>")
          
          for(b in beanList){
            //add bean level info
            modBeans.append("<b>Type: </b>" + b.type + "<br/>")
            modBeans.append("<b>PublicID: </b>" + b.publicID + "<br/>")        
            modBeans.append("<b>Operation: </b>" + b.operation + "<br/><br/>")       
            modBeans.append("<table border=\"1\" width=\"50%\">")
            modBeans.append("<tr><th class=\"color\">Field Name</th><th class=\"color\">Old Value</th><th class=\"color\">New Value</th></tr>")
            
            //add field level info
            for(f in b.fields){
              modBeans.append("<tr><td class=\"center\">" + f.name + "</td><td class=\"center\">" + f.oldValue.Text + "</td><td class=\"center\">" + f.newValue.Text + "</td></tr>")          
            }
                                  
            modBeans.append("</table><br/><br/>")
          }
        }
      }
    %>
    <b>Executing User: </b><br/>${history.ExecutingUser}<br/><br/>
    <b>Ticket Number: </b><br/>${history.TicketNum}<br/><br/>
    <b>Comments: </b><br/>${gw.util.GosuEscapeUtil.escapeForHTML(history.Comments)}<br/><br/>
    <b>Script: </b><br/>${gw.util.GosuEscapeUtil.escapeForHTML(history.Script)}<br/><br/>
    <b>Standard Error/Output: </b><br/>${gw.util.GosuEscapeUtil.escapeForHTML(history.StdErrOut)}<br/><br/>
    ${modBeans != null ? modBeans.toString() : ""}
    
  </body>
</html> 