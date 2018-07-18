<div>
  <table>
    <tr>
      <td valign="top">


        <table border="1" valign="top" cellpadding="0" cellspacing="0" style="border-collapse: collapse" bordercolor="#c0c0c0" width="auto">
          <tr>
            <td colspan="6">

              <!-- Calendar controls (list view lists, navigation ctrl, small calendars) -->
              <table valign="top" border="0" cellpadding="5" cellspacing="0" style="border-collapse: collapse" bordercolor="#c0c0c0" width="100%">
                <tr>
                  <td valign="top">
                    <%
                        gw.api.util.TemplateUtil.renderTemplate( "calendar/CalendarFilters", __renderContext, __valueProvider );
                     %>
                  </td>

                  <td valign="top" width="100%">
                    <!-- Date Navigator -->
                    <%
                      gw.api.util.TemplateUtil.renderTemplate( "calendar/CalendarTitleNavigator", __renderContext, __valueProvider );
                    %>
                  </td>

                  <td valign="top">
                    <!-- small calendar -->
                    <%
                      gw.api.util.TemplateUtil.renderTemplate( "calendar/CalendarSmall", __renderContext, __valueProvider );
                    %>
                  </td>

                </tr>
              </table> <!-- End of Calendar controls (list view lists, navigation ctrl, small calendars) -->

            </td>
          </tr>

          <tr>
            <td align="center">

              <%
                gw.api.util.TemplateUtil.renderTemplate( "calendar/CalendarMonth", __renderContext, __valueProvider );
              %>

            </td>
          </tr>
        </table> <!-- End of Calendar controls (list view lists, navigation ctrl, small calendars), and big month calendar -->

      </td>

      <!-- Weekview Calendar -->
      <td valign="top">
      <%
        gw.api.util.TemplateUtil.renderTemplate( "calendar/CalendarWeek", __renderContext, __valueProvider );
      %>
      </td>

      <td width="100%">
        &nbsp;
      </td>
    </tr>

  </table>
</div>

