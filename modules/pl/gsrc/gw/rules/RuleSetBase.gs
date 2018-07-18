package gw.rules

uses com.guidewire.commons.profiler.Profiler
uses com.guidewire.commons.profiler.ProfilerConstants
uses gw.api.profiler.ProfilerTag
uses com.guidewire.pl.system.logging.PLLoggerCategory
uses com.guidewire.commons.entity.type.ThreadLocalBundleProvider
uses com.guidewire.commons.entity.BundleProvider

uses java.lang.StringBuffer
uses java.lang.RuntimeException
uses java.lang.ThreadLocal
uses java.util.Stack
uses gw.lang.reflect.IMethodInfo
uses gw.lang.reflect.gs.IGosuClass

class RuleSetBase
{
  private construct()
  {
  }
  
  /**
   * Exception class used to stop execution when a rule is marked as stopping
   * execution.
   */
  static class StopExecutionException extends RuntimeException {
  }
  
  private static var _currentSession = new ThreadLocal<Stack<ExecutionSession>>()

  // Evil, evil, evil hack to turn off rules.
  private static var _shouldRunRules = true;
  
  static property get CurrentSession() : ExecutionSession {
    return _currentSession.get() == null || _currentSession.get().isEmpty() ? null : _currentSession.get().peek()
  }
  
  protected static function _invoke(ruleSession : ExecutionSession, bean : Object, ruleSetName : String, ruleSetType : Type) : ExecutionSession {
    if (!_shouldRunRules) {
      return null;
    }
    if (_currentSession.get() == null) {
      _currentSession.set(new Stack<ExecutionSession>())
    }
    ruleSession.RuleSetName = ruleSetName
    var stopped = false
    _currentSession.get().push( ruleSession )
    var setframe = Profiler.push(ProfilerTag.EXECUTE_RULES_TAG)
    setframe.setPropertyValue(ProfilerConstants.RULE_NAME, ruleSetName)
    setThreadLocalBundle( bean )
    try {
      executeRules( bean, new RuleIterator(ruleSetType), new boolean[] {false} )
    } catch (e : StopExecutionException) {
      stopped = true;
    } finally {
      clearThreadLocalBundle()
      Profiler.pop(setframe)
      _currentSession.get().pop()
      if (_currentSession.get().isEmpty()) {
        _currentSession.set( null )
      }
      logRulesetExit( ruleSetType, bean, stopped );
    }
    return ruleSession
  }
  
  private static function executeCondition(bean : Object, rule : IGosuClass) : boolean {
    CurrentSession.RunningRuleType = rule
    try {
      var method = findMethod(rule, "doCondition")
      if (method == null) {
        throw "Could not find doCondition on type " + rule
      }
      return method.CallHandler.handleCall( null, {bean} ) as boolean
    } finally {
        CurrentSession.RunningRuleType = null;
    }
  }
  
  private static function executeAction(bean : Object, action : Action, rule : IGosuClass) {
    CurrentSession.RunningRuleType = rule
    try {
      var method = findMethod( rule, "doAction")
      if (method == null) {
        throw "Could not find doAction on type " + rule
      }
      method.CallHandler.handleCall( null, {bean, action} )
    } finally {
        CurrentSession.RunningRuleType = null;
    }
  }
  
  private static function findMethod(type : IGosuClass, name : String) : IMethodInfo {
    var methods = type.TypeInfo.DeclaredMethods
    foreach (m in methods) {
      if (m.DisplayName == name) {
        return m
      }
    }
    
    return null
  }
  
  private static function executeRules(bean : Object, rules : RuleIterator, continueToNextRootLevelRule : boolean[]) {
    logRuleGroupExecution(rules.RuleTree, bean)
    while (rules.hasNextSibling()) {
      var compiledRule = rules.nextSibling()
      var frame = Profiler.push(ProfilerTag.EXECUTE_RULE_TAG)
      var bSatisfied : boolean
      try {
        frame.setPropertyValue(ProfilerConstants.RULE_NAME, compiledRule.Name)
        bSatisfied = executeCondition(bean, compiledRule)
        frame.setPropertyValue(ProfilerConstants.RULE_SATISFIED, bSatisfied ? "true" : "false")
        logRuleExecution(compiledRule, bean, bSatisfied)
        if (bSatisfied) {
          var bStop = false
          var exitType : ExitCode = null
          try {
            executeAction(bean, Action.getInstance(), compiledRule)
          } catch (e : AbortExecutionException) {
            exitType = e.ExitCode
          }
          if (exitType != null) {
            switch(exitType) {
              case ExitCode.EXIT:
                throw new StopExecutionException()
              case ExitCode.EXIT_AFTER:
                bStop = true
                break
              case ExitCode.EXIT_TO_NEXT:
                continue
              case ExitCode.EXIT_TO_NEXT_PARENT:
                return
              case ExitCode.EXIT_TO_NEXT_ROOT:
                if (rules.Root) {
                  continue
                } else {
                  continueToNextRootLevelRule[0] = true
                  return
                }
            }
          }
          if (rules.hasChildren()) {
            executeRules(bean, rules.children(), continueToNextRootLevelRule)
            if (continueToNextRootLevelRule[0]) {
              if (rules.Root) {
                continueToNextRootLevelRule[0] = false
                continue
              }
              return
            }
          }
          if (bStop) {
            throw new StopExecutionException()
          }
        }
      } finally {
        Profiler.pop(frame)
      }
    }
  }
  
  private static function logRuleGroupExecution(ruleTree : Type, bean : Object) {
    if (PLLoggerCategory.RULE_ENGINE.isDebugEnabled()) {
      var logName = getObjectNameForLog(bean)
      PLLoggerCategory.RULE_ENGINE.debug(logName + " Executing rules in " + ruleTree)
    }
  }
  
  private static function logRuleExecution(rule : Type, bean : Object, conditionSatisfied : boolean) {
    if (PLLoggerCategory.RULE_ENGINE.isDebugEnabled()) {
      try {
        var message = new StringBuffer()
        message.append(getObjectNameForLog(bean))
        message.append(" Rule [")
        message.append(rule.Name).append("]")
        if (conditionSatisfied) {
          var prefix = message.toString()
          message.append(" satisfied")
          PLLoggerCategory.RULE_ENGINE.debug(message.toString())
          message.setLength(0)
          message.append(prefix)
          PLLoggerCategory.RULE_ENGINE.debug(message.toString())
        } else {
          message.append(" not satisfied")
          PLLoggerCategory.RULE_ENGINE.debug(message.toString())
        }
        } catch (t) {
          PLLoggerCategory.RULE_ENGINE.debug("Error logging debug info. This will not effect rule execution.", t)
        }
    }
  }
  
  private static function logRulesetExit(ruleSetType : Type, bean : Object, stopped : boolean) {
    if (PLLoggerCategory.RULE_ENGINE.isDebugEnabled()) {
      var logName = getObjectNameForLog(bean)
      if (stopped) {
        PLLoggerCategory.RULE_ENGINE.debug(logName + " Stop " + ruleSetType.Name)
      } else {
        PLLoggerCategory.RULE_ENGINE.debug(logName + " Rule execution finished " + ruleSetType.Name)
      }
    }
  }

  private static function getObjectNameForLog(bean : Object) : String {
    if (bean typeis KeyableBean) {
      return "[" + (typeof bean).RelativeName + "(" + bean.ID + ")]"
    } else {
      return "[" + (typeof bean).RelativeName + "]"
    }
  }

  private static function setThreadLocalBundle( bean : Object ) 
  {
    if( bean typeis com.guidewire.commons.entity.Bean and not ( bean ).Bundle.ReadOnly )
    {
      ThreadLocalBundleProvider.set( bean )
    }
    else
    {
      ThreadLocalBundleProvider.set( null as BundleProvider )
    }
  }

  private static function clearThreadLocalBundle() 
  {
    ThreadLocalBundleProvider.clear()
  }

}
