<table valign="top" border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse" bordercolor="#c0c0c0" width="100%">
  <tr>
    <td>
      <table valign="top" align="left" border="1" cellpadding="0" cellspacing="0" style="border-collapse: collapse" bordercolor="#111111" width="auto">
        <tr>
          <td width="100%">
            <!-- Week Navigator -->
            <table border="0" cellpadding="10" cellspacing="0" style="border-collapse: collapse" bordercolor="#111111" width="100%">
              <tr>
                <td class="weekNavigatorButton"
                    onclick="Events.invokeEvent( '<%= _id %>', true, 'year=<%= model.Year%>&month=<%= model.Month%>&today=0&selectedDay=<%= model.SelectedDay %>&weekOffset=-1' )">
                  <img src="images/week_prev.gif" width="8" height="9" alt="week_prev"/>
                </td>
                <td nowrap="true" class="weekNavigatorTitle">
                  <%= model.WeekTitle %>
                </td>
                <td class="weekNavigatorButton"
                    onclick="Events.invokeEvent( '<%= _id %>', true, 'year=<%= model.Year%>&month=<%= model.Month%>&today=0&selectedDay=<%= model.SelectedDay %>&weekOffset=1' );">
                  <img src="images/week_next.gif" width="8" height="9" alt="week_next"/>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td width="100%" class="calendarWeek">
            <!-- Week Days -->
            <table border="0" cellpadding="5" cellspacing="0" style="border-collapse: collapse" bordercolor="#111111" width="100%">
            <% for( day in model.SelectedDaysForFullWeek index iDay ) { %>
                <tr>
                  <td>
                    <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse" bordercolor="#c0c0c0" width="100%">
                      <tr>
                        <td nowrap="true" class="weekDayTitle">
                          <%= day.format() %>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <% if( day.Events.length == 0 ) { %>
                            <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse" bordercolor="#c0c0c0" width="100%">
                              <tr>
                                <td valign="top" class="weekNoEvents" style="padding-right: 6;">
                                  -- <%= displaykey.JSP.LitigationCalendar.NoEvents %> --
                                </td>
                              </tr>
                            </table>
                          <% } else {  %>
                            <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse" bordercolor="#c0c0c0" width="100%">
                            <% var iEvent = 0;
                               for( var ev in day.Events ) {
                                 var eventList : java.util.List;
                                 if( ev.ChildCount > 0 ) {
                                     eventList = ev.Children;
                                 } else {
                                   var collections : java.util.Collections;
                                   eventList = collections.singletonList( ev );
                                 }
                                 for( var event in (eventList as com.guidewire.cc.web.calendar.EventModel[]) ) {
                                   iEvent = iEvent + 1;
                            %>
                                <tr>
                                  <td valign="top" style="padding-right: 6;">
                                    <img id="collapseDay<%= iDay %>Event<%= iEvent %>" src="images/collapse.gif" width="11" height="11" alt="<%= gw.api.domain.DisplayKey.getDisplayKeyValue( "JSP.LitigationCalendar.Collapse.Tooltip" ) %>" style='display=<%= day.Selected ? "inline" : "none" %>; cursor="hand";'
                                         onclick='document.all["day<%= iDay %>Event<%= iEvent %>"].style.display = "none";
                                                  expandDay<%= iDay %>Event<%= iEvent %>.style.display = "inline";
                                                  this.style.display = "none";
                                                  document.all["time1Interval<%= iDay %>Event<%= iEvent %>"].style.display = "inline";
                                                  document.all["time2Interval<%= iDay %>Event<%= iEvent %>"].style.display = "none";'/>
                                    <img id="expandDay<%= iDay %>Event<%= iEvent %>" src="images/expand.gif" width="11" height="11" alt=""<%= gw.api.domain.DisplayKey.getDisplayKeyValue( "JSP.LitigationCalendar.Expand.Tooltip" ) %>"" style='display=<%= day.Selected ? "none" : "inline" %>; cursor="hand";'
                                         onclick='document.all["day<%= iDay %>Event<%= iEvent %>"].style.display = "inline";
                                                  collapseDay<%= iDay %>Event<%= iEvent %>.style.display = "inline";
                                                  this.style.display = "none";
                                                  document.all["time1Interval<%= iDay %>Event<%= iEvent %>"].style.display = "none";
                                                  document.all["time2Interval<%= iDay %>Event<%= iEvent %>"].style.display = "inline";'/>
                                  </td>


                                  <td id="time1Interval<%= iDay %>Event<%= iEvent %>" nowrap="true" class="<%= getWeekContentEventLineCriticalClass( event ) %>" style='display=<%= !day.Selected ? "inline" : "none" %>; padding-top: 3;' valign="top">
                                    <%= event.EventTimeDisplay %>
                                  </td>
                                  <td id="time2Interval<%= iDay %>Event<%= iEvent %>" nowrap="false" class="<%= getWeekContentEventLineCriticalClass( event ) %>" style='display=<%= day.Selected ? "inline" : "none" %>; padding-top: 3;' valign="top">
                                    <%= event.EventTimeDisplay %>
                                  </td>
                                  <td valign="top" style="padding-top: 3;">
                                    <div class="longWeekDisplay">
                                      <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse" width="100%">
                                        <tr>
                                          <td nowrap="true" class="dateNavigatorSmallText" valign="center">
                                            <a class="<%= getWeekContentEventLineCriticalClass( event ) %>" href="javascript:Events.invokeEvent( '<%= _id %>', true, '<%= event.Action %>' )"><li><%= event.LongWeekDisplay %></li></a>
                                          </td>
                                        </tr>

                                        <tr id="day<%= iDay %>Event<%= iEvent %>" style='display=<%= day.Selected ? "inline" : "none" %>' >
                                          <td colspan="2" style="padding-bottom: 3;" >
                                            <table border="1" cellpadding="0" cellspacing="0" style="border-collapse: collapse;" bordercolor="#c0c0c0" width="auto">
                                            <% for( propertyKey in event.Context.PropertyKeys ) { %>
                                              <tr>
                                                <td class="weekPropertyName" nowrap="true">
                                                  <%= gw.api.domain.DisplayKey.getDisplayKeyValue( propertyKey ) %>
                                                </td>
                                                <td class="weekPropertyValue" nowrap="true">
                                                  <%= event.Context.getProperty( propertyKey ) %>
                                                </td>
                                              </tr>
                                            <% }%>
                                            </table>
                                          </td>
                                        </tr>
                                      </table>
                                    </div>
                                  </td>
                                </tr>
                              <% } %>
                            <% } %>
                            </table>
                          <% } %>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
            <% } %>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>

<%
  function getWeekContentEventLineCriticalClass( event : com.guidewire.cc.web.calendar.EventModel ) : String
  {
    if( event.isCritical( 1 ) )
    {
      return "weekContentEventLineCritical";
    }
    else
    {
      return "dateNavigatorSmallText";
    }
  }

%>
