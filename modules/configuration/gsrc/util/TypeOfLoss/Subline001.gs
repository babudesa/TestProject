package util.TypeOfLoss

class Subline001 {

  construct() {

  }

  public static function returnList(codeList : List, exposure : Exposure) {
    var edwParent = util.TypeOfLoss.helperFunctions.getEDWParentCode(exposure.Coverage.Type).toUpperCase()
    
    switch(edwParent){
      case "FIBASICCVG":
        codeList.add( TypeOfLossExt.TC_11_00384 )  //11 - Dishonesty of Regular Employees
        break
      case "FORGERY":
      case "FORGCHECK":
      case "SECURITIES":
        codeList.add( TypeOfLossExt.TC_49_00385 )  //49 - All Other Covered Under Forgery Insuring Agreements D and E
        break
      case "EXTORTPERS":
      case "EXTORTPROP":
      case "FUNDFRAUD":
      case "MORTGAGE":
      case "AUDITEXP":
      case "CHECKMONEY":
      case "CNTRCTRS":
      case "TRADELOSS":
      case "AGNTFIDLTY":
        codeList.add( TypeOfLossExt.TC_99_00386 )  //99 - All Other Not Otherwise Classified
        break
      case "CRP":
        if(exposure.Coverage.State == "TX"){
         codeList.add( TypeOfLossExt.TC_99_00386 )  //99 - All Other Not Otherwise Classified 
        } else{
         codeList.add( TypeOfLossExt.TC_19_00397 ) // 19 - All other covered  under Fidelity Insuring Agreegment
         codeList.add( TypeOfLossExt.TC_49_00385 ) // 49 - All other covered under Forgery Insuring Agreements D and E
         codeList.add( TypeOfLossExt.TC_29_00398 ) // 29 - All other covered under On Premises Insuring Agreement
         codeList.add( TypeOfLossExt.TC_39_00399 ) // 39 - All other covered under In Transit Inusuring Agreement
         codeList.add( TypeOfLossExt.TC_99_00386 ) // 99 - All Other Not Otherwise Classified
         codeList.add( TypeOfLossExt.TC_24_00400 ) // 24 - Burglary (On Premises Insuring Agreement)
         codeList.add( TypeOfLossExt.TC_13_00401 ) // 13 - Data Processing Organizations - covered as employees (Fidelity Insuring Agreement)
         codeList.add( TypeOfLossExt.TC_11_00402 ) // 11 - Dishonesty of Regular Employees (Fidelity Insuring Aggreement)
         codeList.add( TypeOfLossExt.TC_48_00403 ) // 48 - Manipulation of Electronic Funds Transfer System when covered uuder Forgery or Alteration Insuring Agreement
         codeList.add( TypeOfLossExt.TC_32_00404 ) // 32 - Misplacement or Mysterious Unexplainable Disappearance (In Transit Insuring Agreement)
         codeList.add( TypeOfLossExt.TC_22_00405 ) // 22 - Misplacement or Mysterious Unexplainable Disappearance (On Premises Insuring Agreement)
         codeList.add( TypeOfLossExt.TC_37_00406 ) // 37 - Robbery or Hold-Up (In Transit Insuring Agreement)
         codeList.add( TypeOfLossExt.TC_25_00407 ) // 25 - Robbery or Hold-Up (On Premises Insuring Agreement) 
        }
        break;
      default:
        codeList.add( TypeOfLossExt.TC_99_00386 )  //99 - All Other Not Otherwise Classified
        break
    }
  }
}
