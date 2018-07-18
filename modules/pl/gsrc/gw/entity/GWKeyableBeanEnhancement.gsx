package gw.entity
uses java.util.Map
uses java.util.HashMap
uses java.util.Set
uses java.util.HashSet
uses java.util.ArrayList

enhancement GWKeyableBeanEnhancement : entity.KeyableBean
{
  /**
   *  Makes a copy of the current bean.  This method will also deep copy all owned arrays in this object graph.
   *
   **/
  @Returns("A copy of the current bean and a deep copy of all owned array elements")
  function copy() : KeyableBean {
    return copy(\ field ->field typeis IArrayPropertyInfo && field.Owned)
  }
  
  /**
   *  Makes a copy of the current bean.  This method will also deep copy all properties where shouldCopy(<Property>) returns true.
   *
   *  For example, the above copy method simply calls this method with the block:
   *    \ field ->field typeis IArrayPropertyInfo && field.Owned
   *
   **/
  @Returns("A copy of the current bean and a deep copy of all properties where shouldCopy(<Property>) returns true.")
  function copy(shouldCopy : block(field : IEntityPropertyInfo):Boolean) : KeyableBean {
    return copy(this, new HashSet<Key>(), new HashMap<Key, KeyableBean>(), shouldCopy)
  }
  
  private static function copy(thisPtr : KeyableBean, newBeans : Set<Key>, newBeanMap : Map<Key, KeyableBean> , shouldCopy : block(field : IEntityPropertyInfo) : Boolean) : KeyableBean {
    var bean = newBeanMap.get(thisPtr.ID)
    if (bean == null) {
      bean = thisPtr.shallowCopy() as KeyableBean
      newBeans.add(bean.ID)
      newBeanMap.put(thisPtr.ID, bean)
      for (epi in (typeof bean).TypeInfo.Properties) {
        if (epi typeis ILinkPropertyInfo && shouldCopy(epi)) {
          var childBean = epi.Accessor.getValue( thisPtr ) as entity.KeyableBean
          var childCopy = childBean == null ? null : copy(childBean, newBeans, newBeanMap, shouldCopy)
          bean.setFieldValue( epi.Name, childCopy )
        } else if (epi typeis IArrayPropertyInfo && shouldCopy(epi)) {
          var childBeans = epi.Accessor.getValue( thisPtr ) as entity.KeyableBean[]
          var childClones = new ArrayList<KeyableBean>()
          for (cb in childBeans index i) {
            if (!newBeans.contains( cb.ID )) {
              childClones.add(copy( cb, newBeans, newBeanMap, shouldCopy ))
            }
          }

          bean.setFieldValue( epi.Name, childClones.toTypedArray() )
        }
      }
    }
    
    return bean
  }
}
