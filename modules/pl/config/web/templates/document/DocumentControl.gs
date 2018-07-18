<html>
<head>
  <title>Document Control</title>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta http-equiv="Cache-Control" content="no-cache">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">
</head>
<body onLoad="startDocumentOperations()">
<script>

function get_window_top (){
  if (window.top.selenium_myiframe ) {
    return window.top.selenium_myiframe;
  } else {
      return window.top;
  }
}

// Document operations use DocumentUtil from the main frame, so this is
// invoked after the containing frameset and all sibling frames have been loaded
// to avoid a race condition (PL-18010)
function initDocumentOperations() {
<% if (allowActiveX) { %>
  var window_top = get_window_top();
  if (window_top.top_frame && window_top.top_frame.DocumentUtil && window_top.top_frame.DocumentUtil.initDocumentOperations) {
    var localizedErrorMessage = "<%= localizedFailedToLoadControlMessage %>"
    window_top.top_frame.DocumentUtil.initDocumentOperations(localizedErrorMessage);
  } else {
    window.alert("<%= localizedFailedToInitializeDocumentAssistantMessage %>");
  }
<% } %>
}

function startDocumentOperations() {
  <% printContent(extraJavascript, false) %>
}

function resumeDocumentOperations() {
  var window_top = get_window_top();
  if (window_top.top_frame && window_top.top_frame.DocumentUtil && window_top.top_frame.DocumentUtil.resumeDocumentOperations) {
    window_top.top_frame.DocumentUtil.resumeDocumentOperations();
  }
  <% printContent(extraJavascript, false) %>
}
</script>
<%-- Omit the ActiveX control and upload form if the server is so configured --%>
<% if (allowActiveX) { %>
  <form name="fileUploadForm" action="<%=docUploadAction%>" method="post" enctype="multipart/form-data">
    <input name="docId" type="hidden" id="docId"/>
    <input name="fileContent" type="file" id="fileContent" size="60"/>
  </form>
<%--
  NOTE: The following is an ActiveX object. It is vital that the CLASSID be kept
        in sync with the CLSID specified in the sample TemplateRunner.HTM file.

  To use the other activex control:
  CLASSID="CLSID:089B6F3C-6AD8-4C0B-BCF8-C6A131A3D0F9"
<% if (allowActiveXAutoInstall) { %>
  CODEBASE="<%= activexCodebase %>/GuidewireDocumentAssistantConfigurable.CAB#version=2,1,0,53">
<% } %>
--%>
<OBJECT ID="templateRunner"
  CLASSID="CLSID:5041E209-98FB-46B4-9769-2C06D7C39CB8"
<% if (allowActiveXAutoInstall) { %>
  CODEBASE="<%= activexCodebase %>/GuidewireDocumentAssistant.CAB#version=2,0,0,53"
<% } %>
  STYLE="visibility:hidden"
  UNSELECTABLE="on"
  WIDTH="0"
  HEIGHT="0">
  <param name="_ExtentX" value="4207">
  <param name="_ExtentY" value="3334">
</OBJECT>
<% } %>
</body>
</html>
