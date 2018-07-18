package libraries.PolicyLocation_Entity
uses java.util.ArrayList

enhancement ScheduledProperties : entity.PolicyLocation {
  public function getScheduledItems(itemType : String):PropertyItem[]{
    var items : List = new ArrayList()
    for(item in this.HighValueItems){
      if(item.ScheduledPropTypeExt == itemType){
        items.add( item )
      }
    }
    return items as PropertyItem[];
  }
}
