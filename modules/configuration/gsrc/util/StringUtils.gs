package util
uses org.apache.axis.components.encoding.XMLEncoderFactory
uses java.util.regex.ASCII


class StringUtils {

  construct() {

  }
  
  static function getStringValue(value:String) : String {
    if (value != null) { 
      return value;
    } else {
      return "";
    }
  }

  static function getXMLValue(value:String, upperCase:boolean) : String {
    if (value == null) {
      return "";
    } else {
      if (upperCase) {
        return XMLEncoderFactory.getDefaultEncoder().encode(value.toUpperCase());
      } else {
        return XMLEncoderFactory.getDefaultEncoder().encode(value);
      }
    }
  }
  
  static function formatCollection(listToFormat : List) : String {
    var formattedList : String = ""
    if(listToFormat.HasElements){
      for(item in listToFormat){
        if(item!=listToFormat.last() and item.toString()!=""){
          formattedList += item + ", "
        } else {
          formattedList += item
        }
      }
    }
    return formattedList
  }
  
  static function removeDecimal(locationInEditMode : boolean, numberToFormat : java.lang.Double) : String {
    var result = ""
    if(numberToFormat!=null and numberToFormat.toString()!=""){
      if(locationInEditMode==false){
        result = gw.api.util.StringUtil.formatNumber(numberToFormat, "$#,##0")
      } else {
        if(util.custom_Ext.ValidateCoverageAmounts.validateCoverageAmount(numberToFormat)==true){
          result = gw.api.util.StringUtil.formatNumber(numberToFormat, "###0")
        } else {
          result = gw.api.util.StringUtil.formatNumber(numberToFormat, "###0.00")
        }
      }
    }
    return result
  }
  
  
 static function getDisplayNameWithoutFormer(name:String):String{
  var displayName= util.StringUtils.getStringValue(name)  
   if(displayName!="" && displayName.contains("(Former)")){
    return displayName.remove("(Former)")
  }else{
    return displayName
  }
}

static function getDisplayNameWithoutFormerAndClosed(name:String):String{
   var displayName= util.StringUtils.getStringValue(name)
  
   if(displayName!="" && displayName.contains("(Closed)")){
    displayName = displayName.remove("(Closed)")
   }
   if(displayName!="" && displayName.contains("(Former)")){
    displayName = displayName.remove("(Former)")
   } 
   return displayName
}

//Splits the pay to the order of name into 2 sets, each with a max of 40 characters
  static function splitName(stringToSplit : String) : String[]{
    var retString : String[] = new String[2];
  
    retString[0] = "";
    retString[1] = "";
  
    if(stringToSplit.length() <= 40){
      retString[0] = stringToSplit
    }else{
      var tempString : String = "";
      var token : java.util.StringTokenizer = new java.util.StringTokenizer(stringToSplit, " ");
      var breakLength : int = 0;
      var tooBig : boolean = false;
      while(token.hasMoreTokens()){
        //store next token in a string variable
        tempString = token.nextToken();
        //find out the length of the first pay to line and add it to the length of the next token, add 1 for the space that will come with it
        breakLength = retString[0].length() + tempString.length() + 1;
    
        //If the length of the line is greater than or equal to 40, then it is too large to fit on the one line and needs to move to the second
        if(breakLength >= 40){
          tooBig = true;
        }
    
        //If the length is not too big for the first line yet
        if(!tooBig){
          //If this is the first token, obmit the space, otherwise add the temp string to the end of the first line
          if(retString[0].length() == 0){
            retString[0] = tempString;
          }else{
            retString[0] = retString[0] + " " + tempString;
          }
        //If the length is too big for the first line, store the rest of the string in the second line
        }else{
          //If this is the first token, obmit the space, otherwise add the temp string to the end of the second line
          if(retString[1].length() == 0){
            retString[1] = tempString;
          }else{
            retString[1] = retString[1] + " " + tempString;
          }
        }
      }//end while
      //If the previous code did not run, just split the string on the 40th character
      if(retString[0].length() == 0){
        retString[0] = stringToSplit.substring( 0, 40 );
        retString[1] = stringToSplit.substring( 39, stringToSplit.length() );
      }
      if(retString[1].length() > 40){
        retString[1] = retString[1].substring( 0, 40 )
      }
    }//end if/else
    return retString;
  }
  
    /* 
  *  This function accepts a two strings as input and returning String array with length 40 charecter each line
  *  Defect #6205 
  *  02/20/2014
  *  Naga Venkata Dasari
  */
  
  
  static function splitAddressLine3(stringToSplit1: String,stringToSplit2 : String) : String[]{
     var stringToSplit:String=""
       if(stringToSplit1!=null && stringToSplit2!=null){
         stringToSplit=stringToSplit1+" "+stringToSplit2
       }else if(stringToSplit2 == null){
         stringToSplit=stringToSplit1
       }
     var retString : String[] = new String[3];
       retString[0] = "";
       retString[1] = "";
       retString[2] = "";
  
     if(stringToSplit.length() <= 40){
           retString[0] = stringToSplit
     }else{
          var tempString : String = "";
          var token : java.util.StringTokenizer = new java.util.StringTokenizer(stringToSplit, " ");
          var breakLength : int = 0;
          var breakLength1 : int = 0;
          var tooBig : boolean = false;
          var tooBig1 : boolean = false;
     while(token.hasMoreTokens()){
     //store next token in a string variable
            tempString = token.nextToken();
     //find out the length of the first pay to line and add it to the length of the next token, add 1 for the space that will come with it
           breakLength = retString[0].length() + tempString.length() + 1;
           breakLength1 = retString[1].length() + tempString.length() + 1;
        
    //If the length of the line is greater than or equal to 40, then it is too large to fit on the one line and needs to move to the second
        if(breakLength >= 40){
           tooBig = true;
        }
         if(breakLength1 >= 40){
          tooBig1 = true;
         }
    //If the length is not too big for the first line yet
        if(!tooBig){
    //If this is the first token, obmit the space, otherwise add the temp string to the end of the first line
          if(retString[0].length() == 0){
                retString[0] = tempString;
            }else{
                retString[0] = retString[0] + " " + tempString;
            }
    //If the length is too big for the first line, store the rest of the string in the second line
            }else if(!tooBig1){
    //If this is the first token, obmit the space, otherwise add the temp string to the end of the second line
          if(retString[1].length() == 0){
                retString[1] = tempString;
           }else{
                retString[1] = retString[1] + " " + tempString;
           }
           }else{
           if(retString[2].length() == 0){
             retString[2] = tempString;
            }else{
             retString[2] = retString[2] + " " + tempString;
            }
          }
      }//end while
      //If the previous code did not run, just split the string on the 40th character
      if(retString[0].length() == 0){
         retString[0] = stringToSplit.substring( 0, 40 );
         retString[1] = stringToSplit.substring( 39, stringToSplit.length() );
      }
      if(retString[2].length() > 40){
         retString[2] = retString[2].substring( 0, 40 )
      }
    }//end if/else
    return retString;
  }
  
  static function getCityStateZip(city:String,State:String,postalcode:String):String{
    var cityStateZip = new java.lang.StringBuffer();
    if (city != null and city.length() > 25) {
      cityStateZip.append(city.substring(0, 25)+", "+State+" "+postalcode)
      }else{
        cityStateZip.append(city+", "+State+" "+postalcode)
      }
      return cityStateZip as java.lang.String
      
  }
  
  /* 11/21/14 */
  static function formatArray(listToFormat : String[]) : String {
    var formattedList : String = ""
    if(listToFormat == null) return formattedList
      for(item in listToFormat index i){
        if(i != 0){
          formattedList +=  ", "
        }
          formattedList += item
        }
     return formattedList
  }
  
  
  static function equals(str1 : String, str2 : String ) : boolean {
     return str1 == null ? str2 == null : str1.equals(str2);
  }
  
}



