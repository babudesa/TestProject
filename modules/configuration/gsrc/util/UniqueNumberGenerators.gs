package util
uses gw.api.system.database.SequenceUtil

class UniqueNumberGenerators {

  construct() {
  }

  public static function generateNationalBankCheckNumber() : String {
    // Generating National Bank Check numbers for each Environment (check number start with 3) - dpenmetsa
    var chkNum : String;
    var tempNumber = 300000001;
    var startNatCityCheckNumber = 3000000000;
    var environment = gw.api.system.server.ServerUtil.getEnv()
    if (environment != null) {
      environment = environment.toLowerCase()
    }

    if( environment == "local") {
      startNatCityCheckNumber = 3100000000;
    } else if( environment == "dev") {
      startNatCityCheckNumber = 3200000000;
    } else if( environment == "dev1") {
      startNatCityCheckNumber = 3300000000;
    } else if( environment == "dev2") {
      startNatCityCheckNumber = 3400000000;
    } else if( environment == "int") {
      startNatCityCheckNumber = 3500000000;
    } else if( environment == "int2") {
      startNatCityCheckNumber = 3600000000;
    } else if( environment == "cert") {
      startNatCityCheckNumber = 3700000000;
    } else if( environment == "dev3") {
      startNatCityCheckNumber = 3800000000;
    } else if( environment == "dev4") {
      startNatCityCheckNumber = 4100000000;
    } else if( environment == "dev5") {
      startNatCityCheckNumber = 4200000000;
    } else if( environment == "dev6") {
      startNatCityCheckNumber = 4300000000;
    } else if( environment == "dev7") {
      startNatCityCheckNumber = 4400000000;
    } else if( environment == "dev8") {
      startNatCityCheckNumber = 4500000000;
    } else if( environment == "int3") {
      startNatCityCheckNumber = 4600000000;
    } else {
      startNatCityCheckNumber = 3000000000;
    }

    var newCheckNumber = SequenceUtil.next( tempNumber, "NatCityCheckNumberSeq" );
    chkNum = startNatCityCheckNumber + ( newCheckNumber % tempNumber) as java.lang.String;

    return chkNum;
  }

  public static function genetateRBCCheckNumber() : String {
    // Generating RBC Check numbers for each Environment (check number start with 1) - dpenmetsa
    var chkRBCNum : String;
    var tempNumber = 10000001;
    var format = "00"
    var startRBCCheckNumber = 10000000;
    var environment = gw.api.system.server.ServerUtil.getEnv();
    if (environment != null) {
      environment = environment.toLowerCase();
    }

    if( environment == "local") {
      startRBCCheckNumber = 11000000;
    } else if( environment == "dev") {
      startRBCCheckNumber = 12000000;
    } else if( environment == "dev1") {
      startRBCCheckNumber = 13000000;
    } else if( environment == "dev2") {
      startRBCCheckNumber = 14000000;
    } else if( environment == "int") {
      startRBCCheckNumber = 15000000;
    } else if( environment == "int2") {
      startRBCCheckNumber = 16000000;
    } else if( environment == "cert") {
      startRBCCheckNumber = 17000000;
    } else if( environment == "dev3") {
      startRBCCheckNumber = 18000000;
    } else if( environment == "int3") {
      startRBCCheckNumber = 26000000; 
    } else if( environment == "dev4") {
      startRBCCheckNumber = 21000000; 
    } else if( environment == "dev5") {
      startRBCCheckNumber = 22000000; 
    } else if( environment == "dev6") {
      startRBCCheckNumber = 23000000; 
    } else if( environment == "dev7") {
      startRBCCheckNumber = 24000000; 
    } else if( environment == "dev8") {
      startRBCCheckNumber = 25000000;   
    } else {
      startRBCCheckNumber = 10000000;
    }

    var newCheckNumber = SequenceUtil.next( tempNumber, "RBCCheckNumberSeq" );
    chkRBCNum = startRBCCheckNumber + (newCheckNumber % tempNumber) as java.lang.String;

    return format+chkRBCNum;
  }

  public static function generateCashReceiptNumber() : String {
    // asuming 1NNNNNNNN format
    var format = "00000000" ;
    var prefix="1" ;
    var s = format + SequenceUtil.next(10, "CashReceiptNumberSeq") ;
    var numStr = prefix + s.substring(s.length()-8) ;
    return numStr ;
  }

  static function generateBulkInvoiceNumber() : String {
    var environment = gw.api.system.server.ServerUtil.getEnv();
    if (environment != null) {
      environment = environment.toLowerCase();
    }
    // assuming BIN0000000000
    var bulkNum = "0000000000";
    if( environment == "local") {
      bulkNum = "1000000000";
    } else if( environment == "dev") {
      bulkNum = "2000000000";
    } else if( environment == "dev1") {
      bulkNum = "3000000000";
    } else if( environment == "dev2") {
      bulkNum = "4000000000";
    } else if( environment == "int") {
      bulkNum = "5000000000";
    } else if( environment == "int2") {
      bulkNum = "6000000000";
    } else if( environment == "cert") {
      bulkNum = "7000000000";
    } else if( environment == "dev3") {
      bulkNum = "8000000000";
    } else if( environment == "dev4") {
      bulkNum = "1100000000";
    } else if( environment == "dev5") {
      bulkNum = "1200000000";
    } else if( environment == "dev6") {
      bulkNum = "1300000000";
    } else if( environment == "dev7") {
      bulkNum = "1400000000";
    } else if( environment == "dev8") {
      bulkNum = "1500000000";
    } else if( environment == "int3") {
      bulkNum = "1600000000";
    } else {
      bulkNum = "0000000000";
    }
    var numStr = new java.text.DecimalFormat(bulkNum).format( SequenceUtil.next(1, "bulk"), new java.lang.StringBuffer("BIN"), new java.text.FieldPosition(0) ).toString()

    return numStr;
  }

  public static function generateEFTCheckNumber(bank:String) : String{
    // assuming E1NNNNNNNN format for RBC
    //         E3NNNNNNNN format for NationalCity
    var prefixNumber:String ;
    var format = "0000000" ;
    var seqNo:long;
    var numStr:String ;
    var s:String ;
    var limit = 100000000 ;
    var leadChar = new String[] { "E","F"} ;
    var environment = gw.api.system.server.ServerUtil.getEnv();
    if (environment != null) {
      environment = environment.toLowerCase();
    }

    switch (bank) {
      case "RBC" :
	seqNo = SequenceUtil.next(10, "RBCEFTCheckNumberSeq" ) ;
	prefixNumber="1" ;

	if( environment == "local") {
	  prefixNumber="11";
	} else if( environment == "dev") {
	  prefixNumber="12"
	} else if( environment == "dev1") {
	  prefixNumber="13";
	} else if( environment == "dev2") {
	  prefixNumber="14"
	} else if( environment == "int") {
	  prefixNumber="15"
	} else if( environment == "int2") {
	  prefixNumber="16"
	} else if( environment == "cert") {
	  prefixNumber="17"
	} else if( environment == "dev3") {
	  prefixNumber="18"
	} else if( environment == "int3") {
	  prefixNumber="26"
	} else if( environment == "dev4") {
	  prefixNumber="21"
	} else if( environment == "dev5") {
	  prefixNumber="22"
	} else if( environment == "dev6") {
	  prefixNumber="23"
	} else if( environment == "dev7") {
	  prefixNumber="24"
	} else if( environment == "dev8") {
	  prefixNumber="25"
	
	} else {
	  prefixNumber="1";
	}
	//s=format+gw.api.system.database.SequenceUtil.next(10, 1, "RBCEFTCheckNumberSeq") ;
	//numStr=eftPrefix+prefixRBC+s.substring(s.length()-8) ;
	break ;
      case "NationalCity" :
	seqNo = SequenceUtil.next(10, "NatCityEFTCheckNumberSeq" ) ;
	prefixNumber="3" ;

	if( environment == "local") {
	  prefixNumber="31";
	} else if( environment == "dev") {
	  prefixNumber="32"
	} else if( environment == "dev1") {
	  prefixNumber="33";
	} else if( environment == "dev2") {
	  prefixNumber="34"
	} else if( environment == "int") {
	  prefixNumber="35"
	} else if( environment == "int2") {
	  prefixNumber="36"
	} else if( environment == "cert") {
	  prefixNumber="37"
	} else if( environment == "dev3") {
	  prefixNumber="38"
	} else if( environment == "int3") {
	  prefixNumber="46"
	} else if( environment == "dev4") {
	  prefixNumber="41"
	} else if( environment == "dev5") {
	  prefixNumber="42"
	} else if( environment == "dev6") {
	  prefixNumber="43"
	} else if( environment == "dev7") {
	  prefixNumber="44"
	} else if( environment == "dev8") {
	  prefixNumber="45"
	} else {
	  prefixNumber="3";
	}
	//s=format+gw.api.system.database.SequenceUtil.next(10, 1, "NatCityEFTCheckNumberSeq") ;
	//numStr=eftPrefix+prefixNatCity+s.substring(s.length()-8) ;
	break ;
      default: // defaults to NationalCity
	seqNo = SequenceUtil.next(10, "NatCityEFTCheckNumberSeq" ) ;
	prefixNumber="3" ;
	if( environment == "local") {
	  prefixNumber="31";
	}
	else if( environment == "dev") {
	  prefixNumber="32"
	} else if( environment == "dev1") {
	  prefixNumber="33";
	} else if( environment == "dev2") {
	  prefixNumber="34"
	} else if( environment == "int") {
	  prefixNumber="35"
	} else if( environment == "int2") {
	  prefixNumber="36"
	} else if( environment == "cert") {
	  prefixNumber="37"
	} else if( environment == "dev3") {
	  prefixNumber="38"
	} else if( environment == "int3") {
	  prefixNumber="46"
	} else if( environment == "dev4") {
	  prefixNumber="41"
	} else if( environment == "dev5") {
	  prefixNumber="42"
	} else if( environment == "dev6") {
	  prefixNumber="43"
	} else if( environment == "dev7") {
	  prefixNumber="44"
	} else if( environment == "dev8") {
	  prefixNumber="45"
	
	} else {
	  prefixNumber="3";
	}
	//s=format+gw.api.system.database.SequenceUtil.next(10, 1, "NatCityEFTCheckNumberSeq") ;
	//numStr=eftPrefix+prefixNatCity+s.substring(s.length()-8) ;
	break ;
    }

    s = format + seqNo;
    var leadCharIdx = (seqNo-(seqNo % limit))/limit ;
    var eftPrefix = leadChar[(leadCharIdx as int)] ;
    numStr = eftPrefix + prefixNumber+s.substring(s.length()-7) ;
    return numStr ;
  }

  public static function generateEDWUniqueID() : String {
  // asuming 1NNNNNNNNNNN format
    var environment = gw.api.system.server.ServerUtil.getEnv();
    if (environment != null) {
      environment = environment.toLowerCase();
    }
    var format = "00000000000" ;
    var prefix="1" ;
    //var s=format+gw.api.system.database.SequenceUtil.next(11, 1, "EDWSeq") ;
    var s = format + SequenceUtil.next(11, "EDWSeq") ;

    if( environment == "local") {
      prefix="11";
    } else if( environment == "dev") {
      prefix="12";
    } else if( environment == "dev1") {
      prefix="13";
    } else if( environment == "dev2") {
      prefix="14";
    } else if( environment == "int") {
      prefix="15";
    } else if( environment == "int2") {
      prefix="16";
    } else if( environment == "dev3") {
      prefix="18";
    } else if( environment == "int3") {
      prefix="26";
    } else if( environment == "cert") {
      prefix="37";
    } else if( environment == "dev4") {
      prefix="21";
    } else if( environment == "dev5") {
      prefix="22";
    } else if( environment == "dev6") {
      prefix="23";
    } else if( environment == "dev7") {
      prefix="24";
    } else if( environment == "dev8") {
      prefix="25";
    } else {
      prefix="1";
    }
    var numStr = prefix + s.substring(s.length()-9) ;

    return numStr ;
  }


  /**
   * Function generates unique number for Legal Actions
   * The number begins with the same starting number in all environments.
   *
   * @return unique number for Legal Action ID
   */
    public static function generateLegalActionIDNumber() : String {

	var startLegalActionIDNumber = 5000000001;
	var newLegalActionID = SequenceUtil.next(startLegalActionIDNumber, "LegalActionIDSequence");

	return newLegalActionID as java.lang.String;
    }


   /**
   * Function generates unique number for Matter Assignment ID Numbers
   * The number sequence begins with the same starting number in all environments.
   *
   * @return unique number for Assignment ID
   */
    public static function generateAssignmentIDNumber() : String {

	var startAssignmentIDNumber = 1000000001;
	var newAssignmentIDNumber = SequenceUtil.next(startAssignmentIDNumber, "AssignmentIDSequence");

	return newAssignmentIDNumber as java.lang.String;
    }

}
