package gw.api.tree

//uses java.util.List - Use fully qualified class name in code to avoid "List" being resolved into "ArrayList"
uses java.util.ArrayList


class LazyLoadingTreeNode extends AbstractLazyLoadingTreeNode {
  protected var _loadChildrenFunc : block(o:Object) : java.util.List<?>
  protected var _numChildrenFunc : block(o:Object) : int
  private var _expandByDefault : block(o:Object) : boolean
  
  construct(modelData : Object, 
            loadChildrenFunc : block(o:Object) : java.util.List<?>,
            numChildrenFunc : block(o:Object) : int) {
    super(modelData, false);
    _loadChildrenFunc = loadChildrenFunc
    _numChildrenFunc = numChildrenFunc
  }

  construct(modelData : Object,
            loadChildrenFunc : block(o:Object) : java.util.List<?>,
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
      var childNodes = new ArrayList<TreeNode>(childData.size())
      for (var d in childData) {
        childNodes.add( new LazyLoadingTreeNode(d, _loadChildrenFunc, _numChildrenFunc, _expandByDefault) )
      }
      return childNodes;
    }
    return null;
  }
}