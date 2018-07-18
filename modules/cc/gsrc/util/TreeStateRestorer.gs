package util
uses gw.api.admin.CCOrganizationTreeNode
uses java.util.HashSet
uses gw.api.tree.TreeNode
uses java.util.Set

@ReadOnly
class TreeStateRestorer
{
  construct()
  {
  }
  
 static function restoreTreeState(originalNode : CCOrganizationTreeNode) : CCOrganizationTreeNode{
    var result = new CCOrganizationTreeNode()
    if (originalNode == null){
      return result
    }
    else {
      //Spider through the original tree, and put all expanded items into a hashset
      var expandedNodeSet = new HashSet()
      findExpandedNodes(originalNode, expandedNodeSet)
      setExpandedNodes(result, expandedNodeSet)
      return result
    }    
  }
  
  static function findExpandedNodes(originalNode: TreeNode, expandedNodes: Set){
     if (originalNode.Expanded){
        if (originalNode.Data typeis KeyableBean ){
          var keyableData = originalNode.Data          
          expandedNodes.add( keyableData.PublicID + keyableData.IntrinsicType)
          var children = originalNode.Children
          for (child in children){
             findExpandedNodes(child, expandedNodes) 
          }        
        }
     }
  }

  static function setExpandedNodes(originalNode:TreeNode, expandedNodes: Set){
     if ((!originalNode.Leaf) && (originalNode.Data typeis KeyableBean)){
        var keyableData = originalNode.Data as KeyableBean
        if (expandedNodes.contains( keyableData.PublicID + keyableData.IntrinsicType)) {
          if (!originalNode.Expanded){
             originalNode.toggle()
          }
          for (child in originalNode.Children){
             setExpandedNodes(child, expandedNodes)
          }
        }
     }
  }
  
}
