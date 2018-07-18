package gw.api.assignment.examples
uses gw.api.assignment.DynamicGroupAssignmentStrategy
uses java.util.Set
uses java.util.HashSet
uses gw.api.assignment.DynamicAssignmentUtil
uses java.util.Collections

@Export
class GroupSearchCriteriaAssignmentStrategy implements DynamicGroupAssignmentStrategy
{
  private var _searchCriteria : GroupSearchCriteria
  construct(searchCriteria : GroupSearchCriteria)
  {
    _searchCriteria = searchCriteria
  }

  override function getCandidateGroups( assignable: Assignable, group: Group, p2: boolean ) : Set
  {
    var groups = new HashSet<Group>()
    if (group != null) {
      _searchCriteria.ParentGroup = group
    }
    for (g in _searchCriteria.performSearch().iterator()) {
      groups.add(g as Group)
    }
    return groups
  }

  override function getLocksForAssignable( assignable: Assignable, candidates: Set ) : Set
  {
    
    var assignmentState : DynamicAssignmentState = DynamicAssignmentUtil.getOrCreateDynamicAssignmentState(_searchCriteria, null)
    
    return Collections.singleton( assignmentState ) 

  }

  override function findGroupToAssign( assignable: Assignable, candidates: Set, locks: Set ) : Group
  {
      var chosenGroup : Group  
  
      var lock = (locks.iterator().next()) as DynamicAssignmentState //See getLocksForAssignable below, we know this has exactly one element
      // TODO pdalbora 11-Mar-2008 -- The DynamicGroupAssignmentStrategy interface should declare typed Sets, so that
      // we don't have to do this cast.
      chosenGroup = DynamicAssignmentUtil.findRoundRobinGroupAssignment(lock, candidates as Set<Group>, assignable)

      if (chosenGroup == null) {
        return null
      } else {
        return chosenGroup
      }

  }

  override function getAssignmentToken( assignable: Assignable ) : Object
  {
    return assignable
  }

  override function rollbackAssignment( p0: Assignable, p1: Object ) : boolean
  {
    return false
  }

}
