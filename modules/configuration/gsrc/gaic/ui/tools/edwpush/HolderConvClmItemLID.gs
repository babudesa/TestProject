package gaic.ui.tools.edwpush
uses java.lang.Long

/***
 * cprakash - 6/6/2016 - This class will hold the values retreived from EDW External Tables (trigger, holder)
 * and passes them to the Gosu Class to populate the information on the Claims Held with Load command ID for EDW Push
 */
class HolderConvClmItemLID {
 
  private var _loadcommandid : Long as readonly LoadCommandID;
  private var _noofclaims : int as readonly NoOfClaims;


 construct(lid : Long, numberofclaims : int  ) {
    _loadcommandid = lid
    _noofclaims = numberofclaims
   }

}
