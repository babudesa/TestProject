////////////////////////////////////////////////////////////////////////////////
//
// The contents of this file belong in an ImageRight Workflow.
//
// This script fields new documents coming into ImageRight and links them to
// ClaimCenter.
//
////////////////////////////////////////////////////////////////////////////////

var test = new ActiveXObject( "WScript.Shell" );
//## DEBUG: test.popup( "1" );

//
// Create the ImageRight Workflow COM object
//
var objIRApp = new ActiveXObject( "irwfcom.IRApplication" );
//## DEBUG: test.popup( "2" );

//
// Get an IR_Connection
//
objIRApp.Connection.Connect( "WFCOM", "ADMIN" );
if( !objIRApp.Connection.IsConnected )
{
  objIRApp = null
  return "Couldn't connect to WFCom Object";
}

//## DEBUG: test.popup( "3" );

//
// Get the Document/Page Object
//
var objSrcPage = objIRApp.IRManager.GetPage( IRUSERKEY2 );
if( objSrcPage == null )
{
  objSrcPage = null;
  return "Couldn't get Page Object";
}
else
{
  //
  // Get the Description and Reason fields from the IR WF Com object
  //
  strDescription = objSrcPage.reason;
  strFileName = objSrcPage.fullfilename;
}

//## DEBUG: test.popup( strDescription );

var strref = null;
if( strDescription.charAt( 0 ) == "*" && strDescription.indexOf( ":" ) > 0 )
{
  strref = strDescription.substr( strDescription.indexOf( ":" ) + 1 );
}

var bOriginIsClaimCenter = strref != null && strref.charAt( 0 ) == '!';
if( bOriginIsClaimCenter )
{
  strref = strref.substr( 1 );
}
//## DEBUG: test.popup( strref );

var objConn = new ActiveXObject( "ADODB.Connection" );
//## DEBUG: test.popup( "a" );

//
// Establish a db connection to the imageright database.
// Assumptions:
// - The connection is on: Bering
// - The ImnageRight database is named: ImageRight
// - The database user is: sa (with no password)
//
objConn.open( "Provider=SQLOLEDB;Data Source=bering;Initial Catalog=ImageRight;User Id=sa;Use Procedure for Prepare=1;Auto Translate=True;" );
//## DEBUG: test.popup( "b" );

var strgetdocid = "select docid from document where tempdin = '" + IRUSERKEY2 + "'";
var objgetdocid = objConn.execute( strgetdocid );

//## DEBUG: test.popup( "DocId: " + objgetdocid(0) );

if( !objgetdocid.EOF )
{
  var strupdateref = "update document set userkey1 = '" + strref + "' where drawer = '" + IRDRAWER + "' and foldernumber = '" + IRFILE_NO + "' and docid = " + objgetdocid(0)
  var objupdateref = objConn.execute( strupdateref );
  objupdateref = null;
}
else
{
  return "Could not find docid for: " + IRUSERKEY2;
}

objgetdocid = null;
objConn.close();
objConn = null;

IRDESCRIPTION = IRDESCRIPTION.substr( 0, IRDESCRIPTION.indexOf( ":" ) );

//## DEBUG: test.popup( bOriginIsClaimCenter ? "ClaimCenter" : "External" );
//## DEBUG: test.popup( "IRDESCRIPTION: " + IRDESCRIPTION );
//## DEBUG:
//## DEBUG: var strParamInfo =   "Drawer:      " + IRDRAWER +
//## DEBUG: "\nFileNo:      " + IRFILE_NO +
//## DEBUG: "\nPackageType: " + IRPACKAGETYPE +
//## DEBUG: "\nDocType:     " + IRDOCTYPE +
//## DEBUG: "\nDescription: " + IRDESCRIPTION +
//## DEBUG: "\nName:        " + IRFILE_NAME +
//## DEBUG: "\nUserKey:     " + IRUSERKEY +
//## DEBUG: "\nUserKey2:    " + IRUSERKEY2;
//## DEBUG: test.popup( strParamInfo );
//## DEBUG: test.popup( "DocUID: " + strref );

if( !bOriginIsClaimCenter )
{
  //
  // Link this externally entered document to claim center.
  //
  var strExposure = "";
  var strClaimant = "";
  if( IRDESCRIPTION.toLowerCase().charAt( 0 ) == 'e' )
  {
    strExposure = " -Exposure " + IRDESCRIPTION.substr( 1 );
  }
  else if( IRDESCRIPTION.toLowerCase().charAt( 0 ) == 'c' )
  {
    strClaimant = " -Claimant " + IRDESCRIPTION.substr( 1 );
  }
  return test.Run( "c:\\imagewrt\\ClaimCenterIntegration\\run.bat -DocUID " + strref + " -Name "+ strref + " -Claim " + IRFILE_NO + strExposure + strClaimant, 0 );
}

return true;
