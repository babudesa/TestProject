package libraries.Document_Entity

enhancement Document_get20 : entity.Document {
  function get20(document:Document): String
  {
   var description=this.Description;
    if( this.Description  != NULL and this.Description.length() > 20 ){
      return description.substring( 0,20 );
    }
    return this.Description;
   }
}
