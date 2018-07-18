package gw.api.tree
uses java.util.ArrayList;

class QueryLazyLoadingTreeNode extends AbstractLazyLoadingTreeNode
{
  var _loadChildrenFunc : block(o:Object) : gw.api.database.IQueryResult
  var _numChildrenFunc : block(o:Object) : int
  var _expandByDefault : block(o:Object) : boolean
  
  construct(modelData : Object, 
            loadChildrenFunc : block(o:Object) : gw.api.database.IQueryResult,
            numChildrenFunc : block(o:Object) : int) {
    super(modelData, false);
    _loadChildrenFunc = loadChildrenFunc
    _numChildrenFunc = numChildrenFunc
  }

  construct(modelData : Object,
            loadChildrenFunc : block(o:Object) : gw.api.database.IQueryResult,
            numChildrenFunc : block(o:Object) : int,
            expandByDefault : block(o:Object) : boolean) {
    super(modelData, expandByDefault == null ? false : expandByDefault(modelData));
    _loadChildrenFunc = loadChildrenFunc
    _numChildrenFunc = numChildrenFunc
    _expandByDefault = expandByDefault
  }
  
  override property get NumChildren() : int {
    return _numChildrenFunc( Data )
  }

  override protected function loadChildren() : java.util.List<TreeNode> {
    var childData = _loadChildrenFunc( Data )
    if (childData != null) {
      var childNodes = new ArrayList<TreeNode>(childData.getCount())
      for (var d in childData.iterator()) {
        childNodes.add( new QueryLazyLoadingTreeNode(d, _loadChildrenFunc, _numChildrenFunc, _expandByDefault) )
      }
      return childNodes;
    }
    return null;
  }
}
