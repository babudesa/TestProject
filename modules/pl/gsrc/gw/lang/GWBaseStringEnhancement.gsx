package gw.lang;

uses org.apache.commons.lang.StringUtils
uses com.guidewire.util.FileUtil
uses java.io.File

@ReadOnly
enhancement GWBaseStringEnhancement : java.lang.String  //## todo: should this enhance CharSequence instead?
{    
  function writeTo( file : File ) {
    FileUtil.write( file, this )
  }

  static function isEmpty( str : String ) : boolean {
    return StringUtils.isEmpty( str )
  }

}
