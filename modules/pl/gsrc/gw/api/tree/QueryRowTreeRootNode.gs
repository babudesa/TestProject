package gw.api.tree

class QueryRowTreeRootNode extends SimpleTreeNode
{
  
  construct(modelData : java.util.List,
            loadChildrenFunc : block(o:Object) : gw.api.database.IQueryResult) {
    super(null)
    createChildNodes(modelData, loadChildrenFunc, null, null)
  }
  
  construct(modelData : java.util.List,
            loadChildrenFunc : block(o:Object) : gw.api.database.IQueryResult,
            numChildrenFunc : block(o:Object) : int) {
    super(null)
    createChildNodes(modelData, loadChildrenFunc, numChildrenFunc, null)
  }

  construct(modelData : java.util.List,
            loadChildrenFunc : block(o:Object) : gw.api.database.IQueryResult,
            expandByDefault : block(o:Object) : boolean) {
    super(null)
    createChildNodes(modelData, loadChildrenFunc, null, expandByDefault)
  }
  
  construct(modelData : java.util.List,
            loadChildrenFunc : block(o:Object) : gw.api.database.IQueryResult,
            numChildrenFunc : block(o:Object) : int,
            expandByDefault : block(o:Object) : boolean) {
    super(null)
    createChildNodes(modelData, loadChildrenFunc, numChildrenFunc, expandByDefault)
  }

  construct(modelData : java.util.List,
          loadChildrenFunc : block(o:Object) : gw.api.database.IQueryResult,
          expandToDepth : int) {
    super(null)
    createChildNodes(modelData, loadChildrenFunc, null, null)
    expandChildrenToDepth(expandToDepth)
  }

  construct(modelData : java.util.List,
          loadChildrenFunc : block(o:Object) : gw.api.database.IQueryResult,
          numChildrenFunc : block(o:Object) : int,
          expandToDepth : int) {
    super(null)
    createChildNodes(modelData, loadChildrenFunc, numChildrenFunc, null)
    expandChildrenToDepth(expandToDepth)
  }
  
  private function createChildNodes(modelData : java.util.List,
            loadChildrenFunc : block(o:Object) : gw.api.database.IQueryResult,
            numChildrenFunc : block(o:Object) : int,
            expandByDefault : block(o:Object) : boolean) {
    if(modelData != null) {    
      modelData.each(\x -> addChild(new QueryLazyLoadingTreeNode(x,
        loadChildrenFunc,
        numChildrenFunc == null ? \ c -> loadChildrenFunc(c).getCount() : numChildrenFunc,
        expandByDefault == null ? \ c -> false : expandByDefault)))
    }
  }

  private function expandChildrenToDepth(expandToDepth : int) {
    if(expandToDepth > 0) {
      Children.each( \ c -> expandRecursively(c, expandToDepth - 1) )
    }
  }

  private function expandRecursively(node : TreeNode, expandToDepth : int) {
    if(!node.Expanded) {
      node.toggle()
    }
    if(expandToDepth > 0) {
      node.Children.each( \ c -> expandRecursively( c, expandToDepth - 1 ) )
    }
  }
}
