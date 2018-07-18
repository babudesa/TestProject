// ExcelMergeAndClose.js
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!
//!! Note: This file is part of a generated file. The dynamic part of this file
//!! includes the variables _arg1 and _arg2. Each of these variables is a
//!! literal string containing escaped character codes representing binary data.
//!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// The CSV file MUST:
// - Have a header line as the first line in the file.
// - Use commas to delimit header names and data fields.
// - Enclose in double quotes any data fields including commas e.g., Data1,Data2,"Data3,Data3a,Data3b",Data4
// - Escape a double quote with another double quote e.g., Data1,Data2,He's ""fast"",Data4

//
// The first cmd line arg, if present, specifies the file to save to.
//
var strSaveAsFile = WScript.Arguments.length > 0 ? WScript.Arguments( 0 ) : null;

var oMapper = new ExcelDataMapper();
oMapper.putValues();

var fso = new ActiveXObject( "Scripting.FileSystemObject" );
var folderPath = fso.GetParentFolderName(strSaveAsFile);
var baseName = fso.GetBaseName(strSaveAsFile) + ".xls";
if (!fso.FolderExists(folderPath)) {
  // Make sure the sub-folder, if any, exists
  fso.CreateFolder(folderPath);
}

try {
   oMapper.oExcel.Workbooks(baseName).Close(0);
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
oMapper.oBook.SaveAs( strSaveAsFile );

if (oMapper.oExcelNew) {
   oMapper.oBook.Application.Quit();
} else {
   oMapper.oExcel.Workbooks(baseName).Close(0);
}

// Delete the intermediate files
try {
   fso.DeleteFile( oMapper.strExcelFile );
}
catch(e) {
   // Ignore
}
try {
   fso.DeleteFile( oMapper.strCsvFile );
}
catch(e) {
   // Ignore
}

function ExcelDataMapper()
{
  this.strExcelFile = _arg1;
  this.strExcelFile = loadTemplateIntoTempFile( this.strExcelFile, ".xls" );
  this.strCsvFile = _arg2;
  this.strCsvFile = loadDataIntoTempFile( this.strCsvFile, ".txt" );

  // Start a new workbook in Excel
  this.oExcel = null;
  this.oExcelNew = false;
 
  // Reuse existing instance of Excel if it is already running
  try {
     this.oExcel = GetObject("", "Excel.Application");
  } catch (e) {
     try {
         this.oExcel = GetObject("new:Excel.Application");
     } catch (e) {
         WScript.Echo("Could not launch Excel: " + e.message);
         WScript.Quit(1);
     }
     this.oExcelNew = true;
  }

  this.oBook = this.oExcel.Workbooks.Open( this.strExcelFile );

  this.strWhitespace = " \r\n\t\b\f";

  // Add data to cells of the first worksheet in the new workbook
  this.oSheet = this.oBook.Worksheets( 1 );

  this.putValues = function()
  {
     var ForReading = 1;

     var fso = new ActiveXObject( "Scripting.FileSystemObject" );
     var f = fso.OpenTextFile( this.strCsvFile, ForReading, false, -1 ); // open as unicode
     if (!f.AtEndOfStream) { // The file might be empty if there are no fields in the document
       var header =  this.parseLine( f.ReadLine() );
       // Read the remaining of the file instead of just a line in case some data contains a new-line char.
       var data = this.parseLine( this.readData( f ) );

       for( i = 0; i < header.length; i++ )
       {
         try
         {
           this.oSheet.Range( header[i] ).Value = data[i];
         }
         catch( e )
         {
           WScript.Echo( "Exception: " + e + "\n\nError assigning field: " + header[i] + "\nThe field or cell could not be found." );
         }
       }
     }
    f.Close();
  }

  this.readData = function( textStream )
  {
     var dataString = "";
     if( !textStream.AtEndOfStream ) {
       do
       {
         dataString += textStream.ReadLine();
         if( !textStream.AtEndOfStream )
         {
           dataString += "\n";
         }
         else
         {
           break;
         }
       } while( true );
     }
     return dataString;
  }

  this.parseLine = function( line )
  {
    var astrNames = new Array();
    var iNameCount = 0;
    var strName = "";
    var bQuoteStart = false;
    var bNonQuote = false;
    for( i = 0; i < line.length; i++ )
    {
      var c = line.charAt( i );

      if( !bNonQuote )
      {
        if( !bQuoteStart )
        {
          if( this.strWhitespace.indexOf( c ) >= 0 )
          {
            continue;
          }

          if( c == '"' )
          {
            if( i+1 < line.length )
            {
              c = line.charAt( i+1 );
              if( c != '"' )
              {
                bQuoteStart = true;
                continue;
              }
            }
          }
        }
      }

      if( c != '"' )
      {
        if( !bQuoteStart && (c == ',') )
        {
          astrNames[iNameCount++] = strName;
          strName = "";
          bQuoteStart = false;
          bNonQuote = false;
          continue;
        }

        strName += c;
        bNonQuote = true;
      }
      else // c == '"'
      {
        if( ++i < line.length )
        {
          c = line.charAt( i );
          if( c == '"' )
          {
            strName += c;
          }
          else
          {
            bQuoteStart = false;
            i--;
          }
        }
      }
    }

    astrNames[iNameCount] = strName;

    return astrNames;
  }
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
