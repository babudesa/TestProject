<%@ params(messageContent : String) %>

<Matter>
    <Admin>
        <Time><%=gw.api.util.DateUtil.currentDate()%></Time>
        <UniqueID/>  
    </Admin>  
    <%=messageContent%>    
</Matter>