package util.EFTAccountInformation;
uses java.lang.Integer
uses gw.api.util.StringUtil

class RoutingNumber
{
  construct()
  {
  }
  
  public static function isRoutingNumberValid( ABAnumber : String ) : boolean{
    
       /* The Checksum Algorithm ABA(American Banker's Association) NUMBER.
         Here's how the algorithm works. First the code strips out any non-numeric 
         characters (like dashes or spaces) and makes sure the resulting string's length is nine digits,
         7 8 9 4 5 6 1 2 4 = 789456124
         Then we multiply the first digit by 3, the second by 7, the third by 1, 
         the fourth by 3, the fifth by 7, the sixth by 1, etc., and add them all up.
        (7 x 3) + (8 x 7) + (9 x 1) +
        (4 x 3) + (5 x 7) + (6 x 1) +
        (1 x 3) + (2 x 7) + (4 x 1) = 160 

        Use your browser's View Source option to see the full source code. 
        If this sum is an integer multiple of 10 (e.g., 10, 20, 30, 40, 50,...) then the number is valid, 
        as far as the checksum is concerned.

        Here's the JavaScript code that sums the digits, where t represents 
        the ABA routing number as a string of digits.
      */

      // Run through each digit and calculate the total.

      var n = 0;
      // do not process a null routing number
      if (ABAnumber == null){return true}
      
      // If the routing number is longer than 9 digit, then it is not a valid number
      if (ABAnumber.length() >  9 ){ return false}
      
      
      //Routing number is required to be length = 9; padd the routing number with prefix zero
      if (ABAnumber.length() < 9 ){
          var paddLength = 9 - ABAnumber.length()
          for ( a in paddLength){
            ABAnumber = "0" + ABAnumber
          }
      }
  
      //  for ( i = 0; i < t.length; i += 3) {
      var i = 0
      while ( i  < ABAnumber.length() ) {
           /* Returns the character at the specified index. An index ranges from 0 to length() - 1. 
              The first character of the sequence is at index 0, the next at index 1, and so on, 
              as for array indexing.
           */
    
           var char1 = gw.api.util.StringUtil.charAt(ABAnumber, i ) 
           var char2 = gw.api.util.StringUtil.charAt( ABAnumber, i+1 )
           var char3 = gw.api.util.StringUtil.charAt( ABAnumber, i+2 )
           n = n + Integer.parseInt( char1, 10 ) * 3 +
                   Integer.parseInt( char2, 10 ) * 7 +
                   Integer.parseInt( char3, 10 ) * 1 
           // increment the index
           i = i + 3
      }

      // If the resulting sum is an even multiple of ten (but not zero),
      // the aba routing number is good.
      // use modulo operations of 10
      if (n != 0 && n % 10 == 0){
        return true
      }
      else{
        return false;
      }
  }
}
