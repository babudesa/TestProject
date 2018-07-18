package gw.plugin.policy.impl
uses java.lang.Exception

class PolicyNotUniqueException extends Exception
{
  construct( msg : String )
  {
    super(msg)
  }
}
