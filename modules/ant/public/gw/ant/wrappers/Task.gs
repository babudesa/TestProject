package gw.ant.wrappers

uses gw.ant.ScriptEnv

abstract class Task<T extends org.apache.tools.ant.Task>
{
  protected var _task : T

  construct( initTask : T )
  {
    _task = initTask
    _task.setProject( ScriptEnv.get().Project )
    _task.setTaskName( _task.Class.SimpleName.toLowerCase() )
  }

  function execute()
  {
    _task.execute()
  }
}
