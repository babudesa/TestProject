            <table border="0" cellpadding="5" cellspacing="0" style="border-collapse: collapse" width="100%">
              <tr>
                <td style="background-color: #e4e4da; border: 1px solid #c0c0c0; padding: 10;">
                  <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse" width="100%">
                    <tr>
                      <td class="dateNavigatorButton"
                          onclick="Events.invokeEvent( '<%= _id %>', true, 'year=<%= model.Year%>&month=<%= model.Month%>&today=0&selectedDay=1&monthOffset=-1' );">
                        <img src="images/date_prev.gif" width="13" height="13" alt="date_prev"/>
                      </td>
                      <td nowrap="true" class="dateNavigatorTitle">&nbsp;<%= model.Title %>&nbsp;</td>
                      <td class="dateNavigatorButton"
                          onclick="Events.invokeEvent( '<%= _id %>', true, 'year=<%= model.Year%>&month=<%= model.Month%>&today=0&selectedDay=1&monthOffset=1' );">
                        <img src="images/date_next.gif" width="13" height="13" alt="date_next"/>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="dateNavigatorSmallText">
                    <%= displaykey.JSP.LitigationCalendar.JumpTo %> <select class="dateNavigatorSmallText" name="JumpDate" size="1"
                              onchange="Events.invokeEvent( '<%= _id %>', true, this.options[this.selectedIndex].value )">
                      <option value="clearCalendarState=1"><%= displaykey.JSP.LitigationCalendar.Today %>
                      <option value="year=<%= model.Year%>&month=<%= model.Month%>&today=<%= model.Today %>&selectedDay=<%= model.selectedDay %>" selected><%= model.Title %>
                      <% for ( var i in 11 ) { %>
                        <option value="year=<%= model.getYear( i+1 )%>&month=<%= model.getMonth(  i+1 )%>&today=0&selectedDay=1"><%= model.getTitle(  i+1 ) %>
                      <% } %>
                    </select>
                  </div>
                </td>
              </tr>
            </table>
