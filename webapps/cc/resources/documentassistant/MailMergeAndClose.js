// MailMergeAndClose.js
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

var template = loadTemplateIntoTempFile( _arg1, ".doc" );
var data = loadDataIntoTempFile( _arg2, ".txt" )

// Reuse existing instance of Word if it is already running
var appNew = false;
var app = null;

try {
   app = GetObject("", "Word.Application");
} catch (e) {
   try {
       app = GetObject("new:Word.Application");
   } catch (e) {
       WScript.Echo("Could not launch Word: " + e.message);
       WScript.Quit(1);
   }
   appNew = true;
}

//Avoid security-based warnings; see http://support.microsoft.com/default.aspx?scid=KB;EN-US;825765
app.DisplayAlerts=false;

var objWord = app.Documents.Open( template, // FileName
                                  false,    // ConfirmConversions
                                  false,    // ReadOnly
                                  false,    // AddToRecentFiles
                                  "",       // PasswordDocument
                                  "",       // PasswordTemplate
                                  true,     // Revert
                                  "",       // WritePasswordDocument
                                  "",       // WritePasswordTemplate
                                  0,        // Format, wdOpenFormatAuto
                                  65001,    // Encoding, msoEncodingUTF8
                                  false );  // Visible

var iProtectionType = objWord.ProtectionType;
var fFieldText = new Array( new Array(), new Array() );
var iCount = 0;
if( iProtectionType != /*wdNoProtection*/ -1 )
{
  // Unprotect the document in case it has form fields i.e., forms are typically locked.
  objWord.Unprotect( _strTemplatePassword );

  //
  // Microsoft Word has a bug where it deletes Text Form Fields from a document
  // during a Mail Merge operation. There is a workaround documented at
  // http://support.microsoft.com/default.aspx?scid=kb;en-us;286841 that is
  // adapted here. Basically, the workaround is to replace the text form fields
  // ourselves with named plain text placeholders. After the merge we replace the
  // named placeholders with the text form fields, effectively preserving the
  // them across a mail merge operation.
  //

  var formFields = new Array( objWord.FormFields.Count );

  // Save a copy of the form fields to iterate over
  for( iIndex = 0; iIndex < objWord.FormFields.Count; iIndex++ )
  {
    formFields[iIndex] = objWord.FormFields.Item( iIndex+1 );
  }

  // Iterate over the text form fields in the mail merge template.
  for( iIndex = 0; iIndex < formFields.length; iIndex++ )
  {
    var field = formFields[iIndex];

    // If the form field is a text form field...
    if( field.Type == /*wdFieldFormTextInput*/ 70 )
    {
      // Place content and name of field into array.
      fFieldText[0][iCount] = field.Result
      fFieldText[1][iCount] = field.Name

      // Select the text form field.
      field.Select();

      // Replace it with placeholder text.
      app.Selection.TypeText( "<" + fFieldText[1][iCount] + "PlaceHolder>" );

      iCount++;
    }
  }
}

var fso = new ActiveXObject( "Scripting.FileSystemObject" );
var ForReading = 1;
var dataFile = fso.OpenTextFile( data, 1, false, -1 ); // open as Unicode
// Make sure the file is non-empty before opening it, to avoid errors
// If it is empty, then there's no merge to do, and we just leave the original
// document open, rather than a merged document
if (!dataFile.AtEndOfStream) {
  objWord.MailMerge.OpenDataSource( data );
  // Execute the mail merge.
  objWord.MailMerge.MainDocumentType = /* wdCatalog */ 3;
  objWord.MailMerge.Execute();
  app.ActiveDocument.ActiveWindow.Visible = false;

  // Close the template doc leaving the merged doc the only
  // doc left open. Note we have to set the template doc's
  // Saved property to true to fool Word into not prompting
  // on Close(). This only matters when Word is already open
  // before this script runs, not sure why. Also note we have
  // to set the Saved property *before* we activate the doc.
  objWord.Saved = true;
  objWord.Activate();
  objWord.Close( 0 );
}
dataFile.Close();
      
if( iProtectionType != /*wdNoProtection*/ -1 )
{
  // Find and Replace placeholders with form fields.
  doFindReplace( iCount, fFieldText );

  // Reprotect the document
  app.ActiveDocument.Protect( iProtectionType, true, _strTemplatePassword );
}

if( strSaveAsFile != null )
{
  var folderPath = fso.GetParentFolderName(strSaveAsFile);
  if (!fso.FolderExists(folderPath)) {
    // Make sure the sub-folder, if any, exists
    fso.CreateFolder(folderPath);
  }

  // Close and delete the previous version of the doc, if any
  objWord = app.ActiveDocument;
  try {
     app.Documents(strSaveAsFile).Close(0);
  }
  catch(e) {
     // Ignore
  }

  try {
     fso.DeleteFile( strSaveAsFile );
  }
  catch(e) {
     // Ignore
  }

  // Save the file to the cmd-line specified location
  objWord.SaveAs( strSaveAsFile );
  objWord.Close(0);

  if (appNew) {
    app.Quit()
  }
}

// Delete the intermediate files
try {
  fso.DeleteFile( template );
}
catch(e) {
  // Ignore
}

try {
  fso.DeleteFile( data );
}
catch(e) {
  // Ignore
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

function doFindReplace( iCount, fFieldText )
{
  // Go to top of document.
  app.Selection.HomeKey( /*wdStory*/ 6 );

  // Initialize Find.
  app.Selection.Find.ClearFormatting();

  with( app.Selection.Find )
  {
    Forward = true;
    Wrap = /*wdFindContinue*/ 1;
    Format = false;
    MatchCase = false;
    MatchWholeWord = false;
    MatchWildcards = false;
    MatchSoundsLike = false;
    MatchAllWordForms = false;

    // Loop form fields count.
    for( i = 0; i < iCount; i++ )
    {
      // Execute the find.
      while( Execute( "<" + fFieldText[1][i] + "PlaceHolder>" ) )
      {
        // Replace the placeholder with the form field.
        var fField = app.Selection.FormFields.Add( app.Selection.Range, /*wdFieldFormTextInput*/ 70 );

        // Restore form field contents and bookmark name.
        if (fFieldText[1][i].length > 0) {
          fField.Result = fFieldText[0][i];
          fField.Name = fFieldText[1][i];
        }
      }

      // Go to top of document for next find.
      app.Selection.HomeKey( /*wdStory*/ 6 );
    }
  }
}
