// OpenTmpFile.js
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!
//!! Note: This file is part of a generated file. The dynamic part of this file
//!! includes the variables _arg1. This variable is
//!! the full path of the file to be opened
//!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//
// The first cmd line arg, if present, specifies the file to save to.
//
var strDocFilename = _arg1;

var fso = new ActiveXObject("Scripting.FileSystemObject");
if (checkFolder(fso.GetParentFolderName(strDocFilename))) {
  var f = fso.GetFile(strDocFilename);
  var shortPath = f.ShortPath;

  var pos = strDocFilename.lastIndexOf( "." );
  if (pos != 0 && checkExtension(strDocFilename.substring(pos + 1))) {
    var WshShell = new ActiveXObject( "WScript.Shell" );
    try {
      WshShell.Run( "cmd /C start /B " + shortPath , 0 );
    }
    catch( e ) {
      // Windows 98 has "command" as the name of the command shell
      WshShell.Run( "command /C start " + shortPath , 0 );
    }
  }
}

// see also TemplateRunner.ctl
function checkExtension( ext ) {
  if (ext == "txt") return true;
  if (ext == "xml") return true;
  if (ext == "bmp") return true;
  if (ext == "rtf") return true;
  if (ext == "jpg") return true;
  if (ext == "csv") return true;
  if (ext == "log") return true;
  if (ext == "tiff")return true;
  if (ext == "tif") return true;
  if (ext == "html")return true;
  if (ext == "htm") return true;
  if (ext == "pdf") return true;
  if (ext == "doc") return true;
  if (ext == "xls") return true;
  if (ext == "docx") return true;// application/vnd.openxmlformats-officedocument.wordprocessingml.document
  if (ext == "xlsx") return true;// application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
  if (ext == "ps") return true;// application/postscript
  if (ext == "rtx") return true;// text/richtext
  if (ext == "wav") return true;// audio/wav
  if (ext == "wma") return true;// audio/x-ms-wma
  if (ext == "mdi") return true;// image/vnd.ms-modi
  if (ext == "gif") return true;// image/gif
  if (ext == "png") return true;// image/x-png
  if (ext == "mov") return true;// video/quicktime
  if (ext == "mpg") return true;//
  if (ext == "mpeg") return true;// video/mpeg
  if (ext == "avi") return true;// video/x-msvideo
  if (ext == "pps") return true;// application/vnd.ms-powerpoint
  if (ext == "ppt") return true;// application/vnd.ms-powerpoint
  if (ext == "pptx") return true;// application/vnd.openxmlformats-officedocument.presentationml.presentation
  return false;
}

// see also TemplateRunner.ctl
function checkFolder( strFolderPath ) {
    var fso = new ActiveXObject( "Scripting.FileSystemObject" );
    var TemporaryFolder = 2;
    var tempFolder = fso.GetSpecialFolder( TemporaryFolder );
    var gwTemp = fso.BuildPath( tempFolder.Path, "Guidewire" );
    if( !fso.FolderExists(gwTemp) ) {
      return false;
    }
    if ( !fso.FolderExists(strFolderPath)) {
      return false;
    }
    var gwTempFolder = fso.GetFolder(gwTemp);
    var gwTempAbsPath = gwTempFolder.ShortPath;
    var wkFolder = fso.getFolder(strFolderPath);
    var wkAbsPath = wkFolder.ShortPath;
    var rtn = wkAbsPath.indexOf(gwTempAbsPath);
    return rtn >= 0;
}
