
      <table border="1" cellpadding="0" cellspacing="0" style="margin: 5; border-collapse: collapse" bordercolor="#111111" width="auto">

        <tr>
          <td class="largeDayName">
            <%= model.getDayNameLong( 1 ) %>
          </td>
          <td class="largeDayName">
            <%= model.getDayNameLong( 2 ) %>
          </td>
          <td class="largeDayName">
            <%= model.getDayNameLong( 3 ) %>
          </td>
          <td class="largeDayName">
            <%= model.getDayNameLong( 4 ) %>
          </td>
          <td class="largeDayName">
            <%= model.getDayNameLong( 5 ) %>
          </td>
          <td class="largeDayName">
            <%= displaykey.Web.Calendar.Day.Weekend(model.getDayNameMedium( 6 ), model.getDayNameMedium( 0 )) %>
          </td>
        </tr>


          <% for( var days in model.getMatrix() index iWeek ) {
                if( days == null ) {
                  break;
                }
          %>
        <tr>
          <%    for( var day in days index i ) {
                  if( i == 6 ) {
                    break;
                }
          %>
            <td>
              <div class='<%= getLargeDateBoxClass( i, day ) %>' style='<%= shouldBoldenBorder( i, day ) ? "border: 1px solid black;" : "" %>'>
                <table cellpadding="0" cellspacing="0" width="100%" height="100%">
                  <tr>
                    <td class="<%= getLargeDateLineClass( day ) %>"
                        onmouseenter="this.style.fontWeight = 'bold';"
                        onmouseleave="this.style.fontWeight = 'normal';"
                        onclick="Events.invokeEvent( '<%= _id %>', true, 'year=<%= day.Year%>&month=<%= day.Month%>&today=0&selectedDay=<%= day.DayOfMonth%>' )">
                   <% if( i == 5 ) { %>
                        <%= (days[6].DayOfMonth == 1) ? displaykey.Web.Calendar.Day.Weekend(displaykey.Web.Calendar.Day.Format(day.DayOfMonth), displaykey.Web.Calendar.Day.Format(days[6].format( "MMMM d" )))
                                                      : displaykey.Web.Calendar.Day.Weekend(displaykey.Web.Calendar.Day.Format(day.DayOfMonth), displaykey.Web.Calendar.Day.Format(days[6].DayOfMonth)) %>
                   <% } else { %>
                        <%= (i == 0 && day.Month != model.Month) ||
                            (day.DayOfMonth == 1) ? displaykey.Web.Calendar.Day.Format(day.format( "MMMM d" ))
                                                  : displaykey.Web.Calendar.Day.Format(day.DayOfMonth) %>
                   <% } %>
                    </td>
                  </tr>

                   <% if( i == 5 ) { %>
                      <tr>
                        <td valign="top" class="largeWeekend1DateContent">
                          <table width="100%">
                            <tr>
                              <td class="largeDateContentEvent">
                                <% for( var event in day.Events ) { %>
                                <div class="linkDateContentEventLineWeekendContainer">
                                      <div nowrap="true" class="largeDateContentEventLine">
                                          <% renderLink( event ); %>
                                      </div>
                                 <% } %>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>

                      <tr>
                        <td valign="top" class="largeWeekend2DateContent">
                          <table width="100%">
                            <tr>
                              <td class="largeDateContentEvent">
                                <div class="linkDateContentEventLineWeekendContainer">
                                 <% for( var event in days[6].Events ) { %>
                                  <div nowrap="true" class="largeDateContentEventLine">
                                    <% renderLink( event ); %>
                                  </div>
                                 <% } %>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                   <% } else { %>
                      <tr>
                        <td valign="top" class="largeDateContent">
                          <table width="100%">
                            <tr>
                              <td class="largeDateContentEvent">
                                <div class="linkDateContentEventLineContainer">
                                 <%
                                   for( var event in day.Events index count ) {
                                     if (count == 4 ) { %>
                                       <div nowrap="true" class="largeDateContentEventLine" align='center'>
                                         <a href="" onclick="Events.invokeEvent( '<%= _id %>', true, 'year=<%= day.Year%>&month=<%= day.Month%>&today=0&selectedDay=<%= day.DayOfMonth%>' )"><%= displaykey.JSP.LitigationCalendar.MoreEvents %> (<%=day.Events.length-4%>)</a>
                                       </div>
                                  <%  break;
                                     }
                                  %>
                                    <div nowrap="true" class="largeDateContentEventLine">
                                      <% renderLink( event ); %>
                                    </div>
                                 <% } %>
                                </div>

                              </td>
                            </tr>
                          </table>

                        </td>
                      </tr>

                   <% } %>

                </table>

              </div>
            </td>
      <% } %>
         </tr>
    <% } %>

    </table>

  <% if( model.OrderedEventContexts.length > 0 ) { %>
    <tr>
      <td align="center">
        <table border="0" style="border: 1px solid black;" cellpadding="0" cellspacing="0" style="margin: 5;" bordercolor="#111111" width="auto">
          <tr>
            <td>
              <table border="0" style="border-collapse: collapse" cellpadding="0" cellspacing="5" width="100%" height="100%">
              <% for(e in model.OrderedEventContexts) { e.prepareDisplayNames() }
                 for( e in model.OrderedEventContexts index iCtx ) {
                   if( iCtx >= model.OrderedEventContexts.length/2 ) {
                     continue;
                   } %>
                <tr>
                  <td nowrap="true" class="largeDateContentEvent">
                   <%= e.Id + " : " + e.NoteDescription %>
                  </td>
                </tr>
              <% } %>
              </table>
            </td>
            <td>
              <table border="0" style="border-collapse: collapse" cellpadding="0" cellspacing="5" width="100%" height="100%">
              <% for( e in model.OrderedEventContexts index iCtx ) {
                   if( iCtx < model.OrderedEventContexts.length/2 ) {
                     continue;
                   } %>
                <tr>
                  <td nowrap="true" class="largeDateContentEvent">
                   <%= e.Id + " : " + e.NoteDescription %>
                  </td>
                </tr>
              <% } %>
              </table>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  <% } %>

<%
  function shouldBoldenBorder( iColumn : Number,
                               day : com.guidewire.cc.web.calendar.DayModel ) : Boolean
  {
    if( iColumn == 5 )
    {
      if( day.Today || day.Next.Today )
      {
        return true;
      }
    }
    else if( day.Today )
    {
      return true;
    }
    return false;
  }

  function getLargeDateBoxClass( iColumn : Number,
                                 day : com.guidewire.cc.web.calendar.DayModel ) : String
  {
    if( iColumn == 5 )
    {
      if( day.Selected || day.Next.Selected )
      {
        return "largeDateBoxSelectedDay";
      }
      else
      {
        var iDelta = model.getDaysFromSelectedDay( day );
        if( iDelta > 0 && iDelta < 7 )
        {
          return "largeDateBoxSelectedWeek";
        }
        else if( day.Month != model.Month )
        {
          return "largeDateBoxOtherMonth";
        }
        else
        {
          return "largeDateBox";
        }
      }
    }
    else
    {
      if( day.Selected )
      {
        return "largeDateBoxSelectedDay";
      }
      else
      {
        var iDelta = model.getDaysFromSelectedDay( day );
        if( iDelta > 0 && iDelta < 7 )
        {
          return "largeDateBoxSelectedWeek";
        }
        else if( day.Month != model.Month )
        {
          return "largeDateBoxOtherMonth";
        }
        else
        {
          return "largeDateBox";
        }
      }
    }
  }



  function getLargeDateLineClass( day : com.guidewire.cc.web.calendar.DayModel ) : String
  {
    if( day.isCritical( 1 ) )
    {
      return "largeDateLineCritical1";
    }
    else
    {
      return "largeDateLine";
    }
  }

  function getLinkDateContentEventLineClass( event : com.guidewire.cc.web.calendar.EventModel ) : String
  {
    if( event.isCritical( 1 ) )
    {
      return "linkDateContentEventLineCritical";
    }
    else
    {
      return "linkDateContentEventLine";
    }
  }


%>

<% function renderLink( event : com.guidewire.cc.web.calendar.EventModel ) {
     if( event.Action != null && event.Action.length() > 0 ) { %>
     <a class="<%= getLinkDateContentEventLineClass( event ) %>"
        href="javascript:Events.invokeEvent( '<%= _id %>', true, '<%= event.Action %>' )"
        title="<%= event.ShortLabel %>">
       <%= event.CalendarDisplay %></a>
  <% } else { %>
     <span class="<%= getLinkDateContentEventLineClass( event ) %>"
           title="<%= event.ShortLabel %>"">
       <%= event.CalendarDisplay %></span>
  <% } %>
<% } %>
