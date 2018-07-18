package gw.rules

uses java.util.ArrayList
uses java.io.File
uses java.util.NoSuchElementException
uses gw.lang.reflect.gs.IGosuClass
uses gw.lang.reflect.gs.IFileSystemGosuClassRepository
uses java.lang.IllegalStateException
uses java.util.concurrent.ConcurrentHashMap

class RuleIterator
{
  private static var ORDER_FILE_NAME = "order.txt"
  private static var RULE_DIR_SUFFIX = "_dir"
  
  private static var _orderFileCache = new ConcurrentHashMap<Type, File>()
  
  var _childTypes : List<IGosuClass>
  var _currNode = -1
  var _nodeType : Type as readonly RuleTree
  var _isRoot : boolean as readonly Root
  
  construct(nodeType : Type)
  {
    _isRoot = true
    _nodeType = nodeType
    _childTypes = new ArrayList<IGosuClass>()
    var moduleOfRootNode = getModuleForType( nodeType as IGosuClass )
    var orderFile = getOrderFile(nodeType)
    if (orderFile != null) {
      orderFile.eachLine( \ subType -> {
        if (subType.HasContent) {
          var type = Type.forName( nodeType.Name + RULE_DIR_SUFFIX + "." + subType ) as IGosuClass
          var module = getModuleForType( type )
          if (moduleOfRootNode.equals( module ) &&
              type.TypeInfo.getAnnotation( RuleDisabled ).isEmpty()) {
            _childTypes.add(type)
          }
        }
      })
    }
  }

  construct(nodeType : Type, isRoot : boolean)
  {
    _isRoot = isRoot
    _nodeType = nodeType
    _childTypes = new ArrayList<IGosuClass>()
    var moduleOfRootNode = getModuleForType( nodeType as IGosuClass )
    var orderFile = getOrderFile(nodeType)
    if (orderFile != null) {
      orderFile.eachLine( \ subType -> {
        if (subType.HasContent) {
          var type = Type.forName( nodeType.Name + RULE_DIR_SUFFIX + "." + subType ) as IGosuClass
          var module = getModuleForType( type )
          if (moduleOfRootNode.equals( module ) &&
              type.TypeInfo.getAnnotation( RuleDisabled ).isEmpty()) {
            _childTypes.add(type)
          }
        }
      })
    }
  }

  private function getModuleForType(type : IGosuClass) : String {
    var sourceFileHandle = type.SourceFileHandle as IFileSystemGosuClassRepository.IFileSystemSourceFileHandle
    var file = new File( sourceFileHandle.FileInfo.FilePath )
    var rulesDir = com.guidewire.pl.config.PLConfigResourceKeys.NEW_RULE_DIR.getDir()
    var rootDir = rulesDir.getRootDirForFile( file )
    if (rootDir == null) {
      if (com.guidewire.pl.system.server.InitTab.isRunningTests()) {
        var testClassDir = com.guidewire.pl.config.PLConfigResourceKeys.GOSU_TEST_DIR.getDir()
        rootDir = testClassDir.getRootDirForFile( file )
        return testClassDir.getModuleForDir( rootDir )
      } else {
        throw new IllegalStateException("Not a rule: " + type);
      }
    } else {
      return rulesDir.getModuleForDir( rootDir )
    }
  }

  public function hasNextSibling() : boolean {
    return _currNode +1 < _childTypes.Count
  }
  
  public function nextSibling() : IGosuClass {
    if (!hasNextSibling()) {
      throw new NoSuchElementException()
    }
    _currNode = _currNode +1
    return _childTypes[_currNode]
  }
  
  public function hasChildren() : boolean {
    return _currNode >= 0 && getOrderFile(_childTypes[_currNode]) != null
  }
  
  public function children() : RuleIterator {
    return _currNode < 0 ? null : new RuleIterator(_childTypes[_currNode], false)
  }

  private function getOrderFile(parentType : Type) : File {
    var orderFile = _orderFileCache.get(parentType)
    if (orderFile == null) {
      orderFile = parentType.TypeLoader.getResourceFile( parentType.Name.replace( ".", "/" ) + RULE_DIR_SUFFIX + "/" + ORDER_FILE_NAME)
      if (orderFile != null and orderFile.exists()) {
        _orderFileCache.put(parentType, orderFile)
        return orderFile
      }
    }
    return orderFile
  }
}
