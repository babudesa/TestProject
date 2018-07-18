package gw.api.profiler

uses gw.api.tree.LazyLoadingTreeNode
uses gw.api.tree.TreeNode
uses java.util.ArrayList
uses java.lang.Math

class ProfilerLazyLoadingTreeNode extends LazyLoadingTreeNode {
  private static final var MAX_CHILDREN = 40;
  
  private var _preLoadedChildren : java.util.List<Object>
  private var _nextIndex : int

  construct(modelData : Object, 
            loadChildrenFunc : block(o:Object) : java.util.List<?>,
            numChildrenFunc : block(o:Object) : int) {
    super(modelData, loadChildrenFunc, numChildrenFunc);
    _preLoadedChildren = null
    _nextIndex = 0;
  }

  private construct(modelData : Object,
                    loadChildrenFunc : block(o:Object) : java.util.List<?>,
                    numChildrenFunc : block(o:Object) : int,
                    preLoadedChildren : java.util.List<Object>,
                    nextIndex : int) {
    super(modelData, loadChildrenFunc, numChildrenFunc);
    _preLoadedChildren = preLoadedChildren
    _nextIndex = nextIndex;
  }

  override property get NumChildren() : int {
    if (_preLoadedChildren == null) {
      if (!(Data typeis ProfilerFrame)) {
        throw "Data is not a ProfilerFrame"
      }
      return Math.min(MAX_CHILDREN, _numChildrenFunc( Data ))
    } else {
      return Math.min(MAX_CHILDREN, _preLoadedChildren.Count - _nextIndex)
    }
  }

  override protected function loadChildren() : java.util.List<TreeNode> {
    if (_preLoadedChildren == null) {
      if (!(Data typeis ProfilerFrame)) {
        throw "Data is not a ProfilerFrame"
      }
      _preLoadedChildren = _loadChildrenFunc( Data )
    }
    if (_preLoadedChildren != null) {
      var numChildData = NumChildren
      var childNodes = new ArrayList<TreeNode>(numChildData)
      var toIndexExclusive = _nextIndex + numChildData
      var childData = _preLoadedChildren.subList(_nextIndex, toIndexExclusive)
      for (var d in childData) {
        childNodes.add( new ProfilerLazyLoadingTreeNode(d, _loadChildrenFunc, _numChildrenFunc) )
      }
      if (_preLoadedChildren.Count > toIndexExclusive) {
        // There's more
        childNodes.add( new ProfilerLazyLoadingTreeNode(displaykey.Web.Profiler.More,
                                                        _loadChildrenFunc, _numChildrenFunc, 
                                                        _preLoadedChildren, toIndexExclusive) )
      }
      return childNodes;
    } else {
      return null;
    }
  }
}
