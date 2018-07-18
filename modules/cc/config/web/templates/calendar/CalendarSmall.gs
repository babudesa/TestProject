<table border="0" cellpadding="1" cellspacing="0" width="auto">
  <tr>
	  <td valign="top">
	  	<table border="1" cellpadding="1" cellspacing="0" style="border-collapse: collapse" bordercolor="#c0c0c0" width="auto">
        <tr>
          <td class="smallDateLine" colspan="7"
               onclick="Events.invokeEvent( '<%= _id %>', true, 'year=<%= nextMonth1.Year %>&month=<%= nextMonth1.Month %>&today=0&selectedDay=1' )">
              <%= nextMonth1.Title %>
          </td>
        </tr>
                <% for( var days in nextMonth1.getMatrix() ) {
                     if( days == null ) {
                       break;
                     }
                   %>
         <tr>
                  <% for( var day in days index i ) {
                       if( i == 6 ) {
                         break;
                       } %>
                       <td class="<%= getSmallDateBoxClass( nextMonth1, day ) %>"
                           onclick="Events.invokeEvent( '<%= _id %>', true, 'year=<%= day.Year %>&month=<%= day.Month %>&today=0&selectedDay=<%= day.DayOfMonth %>' )"
                           onmouseenter="this.style.fontWeight = 'bold';"
                           onmouseleave="this.style.fontWeight = 'normal';">
                         <%= i == 5 ? displaykey.Web.Calendar.Day.Weekend(day.DayOfMonth, days[6].DayOfMonth) : day.DayOfMonth %>
                       </td>
                  <% } %>
        </tr>
                <% } %>
		</table>
	    </td>

           <td valign="top">
            <!-- small calendar -->
              <table border="1" cellpadding="1" cellspacing="0" style="border-collapse: collapse" bordercolor="#c0c0c0" width="auto">
                    <tr>
                      <td class="smallDateLine" colspan="7"
                          onclick="Events.invokeEvent( '<%= _id %>', true, 'year=<%= nextMonth2.Year %>&month=<%= nextMonth2.Month %>&today=0&selectedDay=1' )">
                        <%= nextMonth2.Title %>
                      </td>
                    </tr>
                <% for( var days in nextMonth2.getMatrix() ) {
                     if( days == null ) {
                       break;
                     }
                   %>
                     <tr>
                  <% for( var day in days index i ) {
                       if( i == 6 ) {
                         break;
                       } %>
                       <td class="<%= getSmallDateBoxClass( nextMonth2, day ) %>"
                           onclick="Events.invokeEvent( '<%= _id %>', true, 'year=<%= day.Year %>&month=<%= day.Month %>&today=0&selectedDay=<%= day.DayOfMonth %>' )"
                           onmouseenter="this.style.fontWeight = 'bold';"
                           onmouseleave="this.style.fontWeight = 'normal';">
                         <%= i == 5 ? day.DayOfMonth + "/" + days[6].DayOfMonth : day.DayOfMonth %>
                       </td>
                  <% } %>
                     </tr>
                <% } %>
              </table>
	     </td>
	    </tr>
	   </table>
<%

  function getSmallDateBoxClass( smallMonthModel : com.guidewire.cc.web.calendar.MonthModel,
                                 day : com.guidewire.cc.web.calendar.DayModel ) : String
  {
    if( day.Month != smallMonthModel.Month )
    {
      return "smallDateContentOtherMonth";
    }
    else if( day.isCritical( 1 ) )
    {
      return "smallDateContentCritical1";
    }
    else
    {
      return "smallDateContent";
    }
  }

%>
