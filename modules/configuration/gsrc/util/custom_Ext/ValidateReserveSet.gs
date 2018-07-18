package util.custom_Ext

class ValidateReserveSet {

   private var _validationMessage : String;
   private var _rejectReserve : Boolean;
  
    construct()
    {
      ValidationMessage = null
      RejectReserve = false
    }
  
    public property set ValidationMessage(msg : String){
      _validationMessage = msg;
    }
    
    public property get ValidationMessage() : String { 
      return _validationMessage;
    }
    
     public property set RejectReserve(reject : Boolean){
      _rejectReserve = reject;
    }
    
    public property get RejectReserve() : Boolean { 
      return _rejectReserve;
    }

}
