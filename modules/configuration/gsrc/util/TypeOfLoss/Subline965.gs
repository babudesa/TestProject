package util.TypeOfLoss

class Subline965 {

  construct() {

  }

  public static function returnList(codeList : List, exposure : Exposure) {
    var edwParent = util.TypeOfLoss.helperFunctions.getEDWParentCode(exposure.Coverage.Type).toUpperCase()
    switch(edwParent){
      case "GUESTPRPLI":
      case "GUESTPRP":
      case "EXTORTION":
      case "COUNTRFEIT":
      case "COMPFRAUD":
      case "THFTDISDES":
      case "ROBURGOTH":
      case "PREMBURGLY":
      case "ROBURGMONY":
        codeList.add( TypeOfLossExt.TC_99_00386 )  //99 - All Other Not Otherwise Classified
        break
        //Defect 7521: Crime Coverages
      case  "EMPTHFTBKT":
        codeList.add( TypeOfLossExt.TC_11_00384)
        break
      default:
        codeList.add( TypeOfLossExt.TC_99_00386 )  //99 - All Other Not Otherwise Classified
        break
    }
  }

}
