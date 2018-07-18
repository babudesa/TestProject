package gw.api;

uses com.guidewire.cc.system.rule.ClientAction;
uses gw.util.concurrent.LazyVar

class Utilities {

  static var _oldUtil = LazyVar.make(\ -> new ClientAction())
    
  private construct() {
  }
  
  static property get Old() : ClientAction {
    return _oldUtil.get()
  }
}
