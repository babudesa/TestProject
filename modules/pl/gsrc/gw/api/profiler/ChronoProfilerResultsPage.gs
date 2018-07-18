package gw.api.profiler
uses gw.api.tree.RowTreeRootNode
uses java.util.Arrays

class ChronoProfilerResultsPage {
  var _data : ProfilerDataSource as Data
  var _stackTree : RowTreeRootNode as readonly StackTree
  var _stack : ProfilerStack

  construct(data1:ProfilerDataSource) {
     this.refresh(data1)
  }
  
  function refresh(data1:ProfilerDataSource) : boolean{
    _data = data1
    return true
  }
  
  property get ProfilerStacks() : ProfilerStack[] {
    return _data.ProfilerStacks
  }
  
  property get HasStacks() : boolean {
    return _data.ProfilerStacks.length > 0
  }
  
  function getDbmsReports(frame:ProfilerFrame) : DbmsReportZipProvider[] {
    return gw.api.profiler.ProfilerPageHelper.getDbmsReports( frame, _data).toTypedArray()
  }
  
  function buildStackTree(value:ProfilerStack) : RowTreeRootNode {
    this.Stack = value
    return this.StackTree
  }
  
  property set Stack(value:ProfilerStack) {
    if (_stack != value) {
      _stack = value
      _stackTree = new RowTreeRootNode(
        Arrays.asList({_stack.EntryPointFrame}), \ f -> (f as gw.api.profiler.ProfilerFrame).Children, \ x -> false
      )
    } 
  }
  
  property get Stack() : ProfilerStack {
    return _stack
  }
  

}
