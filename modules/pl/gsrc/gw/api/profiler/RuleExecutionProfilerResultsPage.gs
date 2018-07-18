package gw.api.profiler
uses gw.api.tree.RowTreeRootNode

class RuleExecutionProfilerResultsPage {
  var _data : ProfilerDataSource as Data
  var _stackTree : RowTreeRootNode as readonly StackTree
  var _stack : ProfilerStack
  var _filteredStacks : ProfilerStack[] as readonly RuleExecutionStacks

  construct(data1:ProfilerDataSource) {
     this.refresh(data1)
  }
  
  function refresh(data1:ProfilerDataSource) : boolean{
    _data = data1
    _filteredStacks = gw.api.profiler.ProfilerRuleExecutionHelperFactory.forProfilerStacks(_data.ProfilerStacks).SortedRuleExecutionStacks
    return true
  }
  
  property get HasRuleStacks() : boolean {
    return _filteredStacks.length > 0
  }
  
  function getDbmsReports(frame:ProfilerFrame) : DbmsReportZipProvider[] {
    return gw.api.profiler.ProfilerPageHelper.getDbmsReports( frame, _data).toTypedArray()
  }
  
  function isVisible(frame : ProfilerFrame) : boolean {
     print("isVisible")
     return gw.api.profiler.ProfilerRuleExecutionHelperFactory.forFrame(frame).isVisible()
  }
  
  function buildStackTree(value:ProfilerStack) : RowTreeRootNode {
    if (value != _stack) {
      _stack = value
      _stackTree = new RowTreeRootNode(_stack.EntryPointFrame.Children, \ f -> (f as gw.api.profiler.ProfilerFrame).Children, \ x -> true)
    }
    return _stackTree
  }
}
