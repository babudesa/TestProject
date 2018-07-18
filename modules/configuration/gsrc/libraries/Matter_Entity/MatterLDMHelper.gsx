package libraries.Matter_Entity
uses java.util.Date
uses java.util.ArrayList

enhancement MatterLDMHelper : entity.Matter {
  

  public function returnChangedField(fieldValue : Date, matterField: String,XMLtag : String):String{
    
    if(this.isFieldChanged(matterField) && fieldValue != null){
      return("<" + XMLtag + ">" + fieldValue + "</" + XMLtag + ">")
    } else if (this.isFieldChanged(matterField) && fieldValue == null){
      return("<" + XMLtag + "/>")
    } else{
      return("")
    } 
}

  public function returnChangedDate(current : Date, orignal : Date, XMLtag : String):String{
   if(current != orignal && current != null){
     return("<" + XMLtag + ">" + current + "</" + XMLtag + ">")
   } else if(current != orignal && current == null){
     return("<" + XMLtag + "/>")
   }
   return("")
  }
  
  //
  // Utility method, checks if any of the named fields of the given bean have changed
  //
  public static function fieldFromListChanged(bean : KeyableBean, fields : String[]) : boolean
  {
    if (bean != null)
    {
      for (field in fields)
      {
        //print(field)
        var prop =  bean.IntrinsicType.TypeInfo.getProperty(field) as java.lang.String;
        if (bean.isFieldChanged(prop))
        // as com.guidewire.commons.entity.type.EntityPropertyInfo))
        {
          return true;
        }
      }
    }
    return false;
  }

}