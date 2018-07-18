package util.custom_Ext;

uses java.util.Comparator;
uses java.lang.Character;
uses  java.math.BigInteger;
uses java.lang.Object;


public class AlphanumericSorting implements Comparator {

  override public function compare(firstObjToCompare : Object, secondObjToCompare : Object) : int {         
    var firstString : String = firstObjToCompare.toString();         
    var secondString : String = secondObjToCompare.toString();           
    if (secondString == null || firstString == null) {             
      return 0;         
    }           
    var lengthFirstStr = firstString.length();         
    var lengthSecondStr = secondString.length();           
    var index1 : int = 0;         
    var index2 : int= 0;           
    while (index1 < lengthFirstStr && index2 < lengthSecondStr) {             
      var ch1 : char = firstString.charAt(index1);             
      var ch2 : char = secondString.charAt(index2);               
      var space1 : char[] = new char[lengthFirstStr];             
      var space2 : char[] = new char[lengthSecondStr];               
      var loc1 : int = 0;             
      var loc2 : int = 0;               
      do {                 
        space1[loc1] = ch1;                 
        index1++;
        loc1++;                   
        if (index1 < lengthFirstStr) {                     
          ch1 = firstString.charAt(index1);                 
        } else {                     
          break;                 
        }            
      } while (Character.isDigit(ch1) == Character.isDigit(space1[0]));               
      do {                 
        space2[loc2] = ch2;                 
        index2++;   
        loc2++;                
        if (index2 < lengthSecondStr) {                     
          ch2 = secondString.charAt(index2);                 
        } else {                     
          break;                 
        }             
      } while (Character.isDigit(ch2) == Character.isDigit(space2[0]));               
      var str1 : String = new String(space1);             
      var str2 : String = new String(space2);               
      var result : int;              
      if (Character.isDigit(space1[0]) && Character.isDigit(space2[0])) {                 
        var firstNumberToCompare : BigInteger = new BigInteger(str1.trim());             
        var secondNumberToCompare : BigInteger = new BigInteger(str2.trim());         
        result = firstNumberToCompare.compareTo(secondNumberToCompare);            
      } else {                 
        result = str1.trim().compareTo(str2.trim());             
      }               
      if (result != 0) {                 
        return result;             
      }         
    }
    return lengthFirstStr - lengthSecondStr;     
  } 
}
