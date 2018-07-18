package Plugins.claimnumgen

uses gw.api.system.database.SequenceUtil
uses java.util.Properties
uses java.io.StringReader

class ClaimNumGeneratorPlugin implements gw.plugin.claimnumbergen.IClaimNumGenAdapter {
  construct() {
  }
  
  public override function generateNewClaimNumber( templateData : String ) : String {
    var prop = new Properties();
    prop.load(new StringReader(templateData))
    var manualClaim = prop.getProperty("ManualClaimNum")
    if (manualClaim.length == 9) { 
    	return manualClaim
    } else {
      return buildClaimNumber("ClaimNumberSequence","")
    }
  }
  
  public override function generateTempClaimNumber( templateData : String ) : String {
    return buildClaimNumber( "TempClaimNumberSequence","T")
  }
  
  public override function cancelNewClaimNumber ( templateData : String, claimNumber : String) : void {
  }  	 									 
  
  private function buildClaimNumber( seqName : String, startChar : String ) : String {
    var leadChar = new String[] { "A","B","C","D","E","F","G" } 
    var limit = 1000000000 
    var prefixNumber:String 
    var tempPrefixNumber:String 
    var environment = gw.api.system.server.ServerUtil.getEnv()
    if (environment != null) {
      environment = environment.toLowerCase()
    }
    //print("Testing Claim number");
    var seqno = SequenceUtil.next( 10, seqName )
    
    var leadCharIdx = (seqno-(seqno % limit))/limit
   // print("Testing Claim number2");
    var claimNumber = "0000000" + seqno
    var tempClaimNumber = "0000000"+ seqno
    
    // assuming ANNNNNNNN format for claim number and TNNNNNNNN format for Tempclaimnumber for each environment     
    if ( environment == "local") {
      tempPrefixNumber="1"
      prefixNumber="1"
    } else if ( environment == "dev") {
      tempPrefixNumber="2"
      prefixNumber="2"
    } else if ( environment == "dev1") {
      tempPrefixNumber="3"
      prefixNumber="3"
    } else if( environment == "dev2") {
      tempPrefixNumber="4"
      prefixNumber="4"
    } else if( environment == "int") {
      tempPrefixNumber="5"
      prefixNumber="5"
    } else if( environment == "int2") {
      tempPrefixNumber="6"
      prefixNumber="6"
    } else if( environment == "cert") {
      tempPrefixNumber="7"
      prefixNumber="7"
    } else if( environment == "dev3") {
      tempPrefixNumber="8"
      prefixNumber="8"
    } else if( environment == "dev4") {
      tempPrefixNumber="1"
      prefixNumber="1"
      leadCharIdx = leadCharIdx + 1;
    } else if( environment == "dev5") {
      tempPrefixNumber="2"
      prefixNumber="2"
      leadCharIdx = leadCharIdx + 1;
    } else if( environment == "dev6") {
      tempPrefixNumber="3"
      prefixNumber="3"
      leadCharIdx = leadCharIdx + 1;
    } else if( environment == "dev7") {
      tempPrefixNumber="4"
      prefixNumber="4"
      leadCharIdx = leadCharIdx + 1;
    } else if( environment == "dev8") {
      tempPrefixNumber="5"
      prefixNumber="5"
      leadCharIdx = leadCharIdx + 1;
    } else if( environment == "int3") {
      tempPrefixNumber="6"
      prefixNumber="6"
      leadCharIdx = leadCharIdx + 1;
    } else if( environment == "dev9") {
      tempPrefixNumber="7"
      prefixNumber="7"
      leadCharIdx = leadCharIdx + 1;
    } else {
      tempPrefixNumber="0"
      prefixNumber="0"
    }
        
   // if the claim was cancled then it generate temporary claim number else it generate claim number 
    if (startChar.length() > 0) {
   // print("Testing Claim number3");     
      return startChar+tempPrefixNumber+tempClaimNumber.substring( claimNumber.length()-7 )
    }
    //print("Testing Claim number4");
    return leadChar[(leadCharIdx as int)]+prefixNumber+claimNumber.substring( claimNumber.length()-7 )
  } 
}
