package libraries.Exposure_Entity;
uses java.util.ArrayList;

enhancement TypeOfLoss : entity.Exposure {
  //Returns the Type of Loss values for all sublines
  //
  //Author Stephanie Przygocki - Sprint 10 - 1/3/08

  function getTOLValues():List{
    var result:List = new ArrayList();
    switch (this.Coverage.SublineExt){
      case "001":
        util.TypeOfLoss.Subline001.returnList( result, this );
        break;
      case "002":
        util.TypeOfLoss.Subline002.returnList(result, this);
        break;
      case "010":
        util.TypeOfLoss.Subline010.returnList( result, this );
        break;
      case "090":
        util.TypeOfLoss.Subline090.returnList( result, this );
        break;
      case "100":
        util.TypeOfLoss.Subline100.returnList( result, this );
        break;
      case "105":
        util.TypeOfLoss.Subline105.returnList( result, this );
        break
      case "106":
        util.TypeOfLoss.Subline106.returnList( result, this );
        break
      case "116":
        util.TypeOfLoss.Subline116.returnList( result, this );
        break;
      case "136":
        util.TypeOfLoss.Subline136.returnList( result, this );
        break;
      case "156":
        util.TypeOfLoss.Subline156.returnList( result, this );
        break;
      case "176":
        util.TypeOfLoss.Subline176.returnList( result, this );
        break;
      case "196":
        util.TypeOfLoss.Subline196.returnList( result, this );
        break;
      case "317":
        util.TypeOfLoss.Subline317.returnList( result, this );
        break; 
      case "470":
        util.TypeOfLoss.Subline470.returnList( result, this );
        break 
      case "325":
        util.TypeOfLoss.Subline325.returnList( result, this );
        break;
      case "332":
        util.TypeOfLoss.Subline332.returnList( result, this );
        break;
      case "334":      
        util.TypeOfLoss.Subline334.returnList( result, this );
        break;
      case "336":
        util.TypeOfLoss.Subline336.returnList( result, this );
        break;
      case "337":
        util.TypeOfLoss.Subline337.returnList( result, this );
        break;
      case "338":
        util.TypeOfLoss.Subline338.returnList( result, this );
        break;
      case "339":
        util.TypeOfLoss.Subline339.returnList( result, this );
        break;
      case "342":
        util.TypeOfLoss.Subline342.returnList( result, this );
        break;
      case "350":
        util.TypeOfLoss.Subline350.returnList( result, this );
        break;
      case "365":
        util.TypeOfLoss.Subline365.returnList( result, this );
        break;
      case "392":
        util.TypeOfLoss.Subline392.returnList( result, this );
        break;
      case "443":
        util.TypeOfLoss.Subline443.returnList( result, this );
        break;
      case "496":
        util.TypeOfLoss.Subline496.returnList( result, this );
        break;
      case "611":
        util.TypeOfLoss.Subline611.returnList( result, this );
        break;
      case "615":
        util.TypeOfLoss.Subline615.returnList( result, this );
        break;
      case "618":
        util.TypeOfLoss.Subline618.returnList( result, this );
        break;
      case "620":
        util.TypeOfLoss.Subline620.returnList( result, this );
        break;
      case "621":
        util.TypeOfLoss.Subline621.returnList( result, this );
        break;
      case "622":
        util.TypeOfLoss.Subline622.returnList( result, this );
        break;
      case "623":
        util.TypeOfLoss.Subline623.returnList( result, this );
        break;
      case "625":
        util.TypeOfLoss.Subline625.returnList( result, this );
        break;
      case "635":
        util.TypeOfLoss.Subline635.returnList( result, this );
        break;
       case "810":
        util.TypeOfLoss.Subline810.returnList( result, this );
        break;
      case "920":
        if(this.LossLocationExt!=null){
          util.TypeOfLoss.Subline920.returnList( result, this );
        }
        break 
      case "965":
        util.TypeOfLoss.Subline965.returnList( result, this );
        break;
      case "970":
        util.TypeOfLoss.Subline970.returnList( result, this )
        break;
      default:
        break
    }
    return result
  }

  function getTOLTypeList() : String {
    return "TypeOfLossExt";
  }
}
