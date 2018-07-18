package util.custom_Ext;

uses java.util.Date;

//reutrns the date in XML standard
class DateTime
{
  static function getTimeStamp():String
  {
    //this functions returns the current time in XML format
    var df = new java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ")
    var cal = java.util.GregorianCalendar.getInstance();
    var temp = df.format( cal.getTime() ); 
    
    temp = temp.substring( 0, temp.length()-2) + ":" + temp.substring( temp.length()-2, temp.length());
    
    
    return temp;
  }

//formats time stamp to XML standards
 static function formatTimeXML(date : Date ):String
  {
    var df = new java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ");
    var temp = df.format( date );

    temp= temp.substring( 0, temp.length()-2) + ":" + temp.substring( temp.length()-2, temp.length());
 
    return temp;
  }
  
  static function formatOpenTimeXML( date : Date, hr : int ) : String
  {
    uses java.util.Calendar;
    uses java.util.Date;
    uses java.util.GregorianCalendar;
	
    var serviceStartDate : Calendar = GregorianCalendar.getInstance();
    serviceStartDate.setTime( date );
	
    var year : int = serviceStartDate.get(Calendar.YEAR);
    var month : int = serviceStartDate.get(Calendar.MONTH);
    var day : int = serviceStartDate.get(Calendar.DAY_OF_MONTH);
    var hour : int = serviceStartDate.get(Calendar.HOUR_OF_DAY) - hr;
    var minute : int = serviceStartDate.get(Calendar.MINUTE);
	
    serviceStartDate.set( year, month, day, hour, minute );
	
    var df = new java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ");
    var temp = df.format( serviceStartDate.Time );
    temp= temp.substring( 0, temp.length()-2) + ":" + temp.substring( temp.length()-2, temp.length());
 
    return temp;
  }
    
  /*Calculates the Animal Age and returns the number
  Author: Kris Boyd
  Date: 5/27/2008
  Updated: -
  EM10 Defect: 653 - 5/27/2008
  */
  static function getAge(animalAge : int) : int{
    var age : int = 0;
    age = gw.api.util.DateUtil.getYear( gw.api.util.DateUtil.currentDate()) - animalAge
    return age
  }
  
  /*Format date for better display -- single date (MM/dd/yyyy)
  Author: Kris Boyd
  Date: 8/28/2008
  Updated: -
  */
  static function formatDate(date : Date) : String{
    var df = new java.text.SimpleDateFormat("MM/dd/yyyy")
    
    return df.format(date)
  }
  
  /*Format multiple dates into a displayable string -- two dates (MM/dd/yyyy - MM/dd/yyyy)
  Author: Kris Boyd
  Date: 8/28/2008
  Updated: -
  */
  static function formatDateString(date1 : Date, date2 : Date) : String{
    var df = new java.text.SimpleDateFormat("MM/dd/yyyy")
    
    return df.format(date1) + " - " + df.format(date2)
  }
  
  /*Check to see if first date comes before the second date
  Author: Kris Boyd
  Date: 8/28/2008
  Updated: -
  */
  static function isDateBefore(firstDate : Date, secondDate : Date) : boolean{
    if(firstDate!=null and secondDate!=null){
      if(gw.api.util.DateUtil.compareIgnoreTime(firstDate, secondDate) < 0){
        return true;
      }
    }
    return false;
  }
  
  /*Check to see if first date comes after second date
  Author: Kris Boyd
  Date: 8/28/2008
  Updated: -
  */
  static function isDateAfter(firstDate : Date, secondDate : Date) : boolean{
    if(firstDate!=null and secondDate!=null){
      if(gw.api.util.DateUtil.compareIgnoreTime(firstDate, secondDate) > 0){
        return true;
      }
    }
    return false;
  }
}
