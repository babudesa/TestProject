// AcrobatMergeAndWait.js
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!
//!! Note: This file is part of a generated file. The dynamic part of this file
//!! includes the variables _arg1 and _arg2. Each of these variables is a
//!! literal string containing escaped character codes representing binary data.
//!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//
// The first cmd line arg, if present, specifies the file to save to.
//
var strSaveAsFile = WScript.Arguments.length > 0 ? WScript.Arguments( 0 ) : null;

var strPdf = loadTemplateIntoTempFile( _arg1, ".pdf" );
var strFdf = loadDataIntoTempFile( _arg2, ".fdf" );

var ForReading = 1;
var ForWriting = 2;
var TemporaryFolder = 2;

var fso = new ActiveXObject( "Scripting.FileSystemObject" );
var stream = fso.OpenTextFile( strFdf, ForReading, false, -1 ); //open as unicode
var strContents = stream.ReadAll();
stream.Close();
strContents = strContents.replace( "_TeMpFiLe_", strPdf );

var outstream = new ActiveXObject( "ADODB.Stream" );
outstream.Type = 2;  // adTypeText
outstream.CharSet = "utf-16"; // This is a hex-encoded string, so this charset should be ok
outstream.Open();
outstream.WriteText( strContents );
outstream.SaveToFile( strFdf, 2 );
outstream.Close();

var WshShell = new ActiveXObject( "WScript.Shell" );
try
{
  WshShell.Run( "cmd /C start /B " + strFdf, 1, true );
}
catch( e )
{
  // Windows 98 has "command" as the name of the command shell
  WshShell.Run( "command /C start " + strFdf, 1, true );
}

function loadTemplateIntoTempFile( binData, strExt )
{
  var stream = new ActiveXObject( "ADODB.Stream" );
  stream.Type = 2;  // adTypeText
  stream.CharSet = "iso-8859-1"; // This is a hex-encoded string, so this charset should be ok
  stream.Open();
  stream.WriteText( binData );
  var strTempFile = createTempFile( strExt );
  stream.SaveToFile( strTempFile, 2 );
  stream.Close();

  return strTempFile
}

function loadDataIntoTempFile( binData, strExt )
{
  var stream = new ActiveXObject( "ADODB.Stream" );
  stream.Type = 2;  // adTypeText
  stream.CharSet = "iso-8859-1"; // This is a hex-encoded string, so this charset should be ok
  stream.Open();
  stream.WriteText( binData );
  var strTempFile = createTempFile( strExt );
  stream.SaveToFile( strTempFile, 2 );
  stream.Close();

  return strTempFile
}

function createTempFile( strExt )
{
  var fso = new ActiveXObject( "Scripting.FileSystemObject" );
  var folder = getOrCreateGwTempFolder();
  var strFile = fso.GetTempName();
  strFile = clipBeforeLastDot( strFile );
  strFile += strExt;
  return folder.Path + "\\" + strFile;
}

function getOrCreateGwTempFolder()
{
  var fso = new ActiveXObject( "Scripting.FileSystemObject" );
  var TemporaryFolder = 2;
  var tempFolder = fso.GetSpecialFolder( TemporaryFolder );
  var gwTemp = fso.BuildPath( tempFolder.Path, "Guidewire" );
  if( !fso.FolderExists( gwTemp ) )
  {
    tempFolder = fso.CreateFolder( gwTemp );
  }
  else
  {
    tempFolder = fso.GetFolder( gwTemp );
  }
  return tempFolder;
}

function clipBeforeLastDot( strSource )
{
  var iDotIndex = strSource.lastIndexOf( "." );
  if( iDotIndex >= 0 )
  {
    strSource = strSource.substring( 0, iDotIndex );
  }
  return strSource;
}
