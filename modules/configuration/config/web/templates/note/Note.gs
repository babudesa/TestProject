<tr>
  <td><img src="images/trans_pixel.gif" width="3" height="3"></td>
  <td valign="top" class="copy" nowrap="true"><b><%=displaykey.Web.NoteTemplate.By%></b> <% AuthorLink.render(RenderContext) %></td>
  <td valign="top" class="copy" nowrap="true"><%= Libraries.String.formatDate(Note.authoringdate,"medium") +  " " + Libraries.String.formatTime(Note.authoringdate,"short")%></td>
  <%if(Note.Topic != "wrong_file"){ %><td valign="top" class="copy" nowrap="true"><% EditLink.render(RenderContext) %></td> <% }%>
  <td valign="top" class="copy" nowrap="true"><% PrintLink.render(RenderContext) %></td>
  <td valign="top" class="copy" nowrap="true"></td>  
  <td><img src="images/trans_pixel.gif" width="3" height="3"></td>
</tr>
<tr>
  <td><img src="images/trans_pixel.gif" width="3" height="3"></td>
  <td valign="top" class="copy" nowrap="true" style="word-wrap:break-word"><b><%=displaykey.Web.NoteTemplate.RelatedTo%></b> <%= Note.NoteRelatedTo %></td>
  <td valign="top" class="copy" nowrap="true"><b><%=displaykey.Web.NoteTemplate.AllowExternalViewing%></b> <%= Note.AllowExternalViewing ? displaykey.Java.NameValueView.Boolean.True : displaykey.Java.NameValueView.Boolean.False %></td>
  <td valign="top" class="copy" nowrap="true"></td>
  <td></td>
  <td><img src="images/trans_pixel.gif" width="3" height="3"></td>
</tr>
<tr>
  <td><img src="images/trans_pixel.gif" width="3" height="3"></td>
  <td valign="top" class="copy" nowrap="true" style="word-wrap:break-word"><b><%=displaykey.Web.NoteTemplate.Topic%></b> <%= Note.Topic.Name %></td>
  <td valign="top" class="copy" nowrap="true"></td>
  <td></td>
  <td><img src="images/trans_pixel.gif" width="3" height="3"></td>
</tr>
<tr>
  <td></td>
  <td valign="top" colspan="3" width="100%"><table border="0" cellspacing="0" cellpadding="0" style="table-layout:fixed">
    <tr><td class="copy" style="word-wrap:break-word"><b><%=displaykey.Web.NoteTemplate.Subject%></b> <%= Note.subject != null ? Note.subject : "" %></td></tr>
  </table></td>
  <td></td>
  <td></td>
</tr>
<tr>
  <td></td>
  <td valign="top" colspan="3" width="100%"><table border="0" cellspacing="0" cellpadding="0" style="table-layout:fixed">
    <tr><td class="copy" style="word-wrap:break-word"> <% printContent( NoteBody, false) %></td></tr>
  </table></td>
  <td></td>
  <td></td>
</tr>

<tr>
 <td></td>
  <td colspan="3" width="100%" align="center"><img src="images/rule_pixel.gif" alt="horizontal rule" width="98%" height="1" style="margin-top:6px;margin-bottom:1px"></td>
 <td></td>
 <td></td>
</tr>
<tr>
  <td width="3"><img src="images/trans_pixel.gif" width="3" height="3"></td>
</tr>

