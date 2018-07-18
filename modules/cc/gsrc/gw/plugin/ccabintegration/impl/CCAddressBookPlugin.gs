 package gw.plugin.ccabintegration.impl

uses com.guidewire.modules.ConfigFileAccess
uses com.guidewire.cc.system.config.CCConfigResourceKeys
uses com.guidewire.pl.plugin.addressbook.AddressBookRemotableSearchResultSpec
uses java.util.HashSet
uses java.util.Map
uses soap.abintegration.entity.ObjectFilter
uses gw.api.addressbook.Counter
uses soap.abintegration.api.IContactAPI
uses java.lang.StringBuilder
uses gw.plugin.integration.mapping.TypelistNotFoundException
uses gw.api.soap.GWAuthenticationHandler
uses gw.plugin.integration.utils.ErrorGenerator
uses gw.plugin.integration.utils.ErrorGeneratorImpl
uses gw.plugin.addressbook.IAddressBookAdapter
uses gw.plugin.InitializablePlugin
uses gw.api.util.DisplayableException
uses gw.plugin.addressbook.ABAuthenticationPlugin
uses java.util.concurrent.locks.ReentrantLock
uses gw.api.system.PLLoggerCategories
uses gw.util.ILogger
uses gw.plugin.Plugins
uses gw.api.util.mapping.GWObjectUtils
uses gw.api.util.mapping.ObjectConverter


class CCAddressBookPlugin implements IAddressBookAdapter, InitializablePlugin {
  var _logger : ILogger as readonly LOGGER = new PLLoggerCategories(PLLoggerCategories.PLUGIN, "AddressBook")
  var _objectConverterFactory : ObjectConverterFactory
  var _searchFilter : ObjectFilter
  var _relatedContactFilter : ObjectFilter
  var _errorGenerator : ErrorGenerator
  static var _api : IContactAPI
  static var _lock = new ReentrantLock()
  
  var _username : String
  var _password : String
  
  construct() {    
    _objectConverterFactory = new ObjectConverterFactoryImpl()
    _errorGenerator = new ErrorGeneratorImpl("Contact")
    
    var configFileAccess = ConfigFileAccess.INSTANCE.get()
    var searchFilterFile = configFileAccess.getFile( CCConfigResourceKeys.SEARCH_FILTER )
    var relatedContactFilterFile = configFileAccess.getFile( CCConfigResourceKeys.RELATED_CONTACT_FILTER )
    _searchFilter = ObjectFilterBuilder.buildObjectFilter(searchFilterFile)
    _relatedContactFilter = ObjectFilterBuilder.buildObjectFilter(relatedContactFilterFile)
    
    var verfErrString = pluginVerification( Contact, _objectConverterFactory.getCCToAB(), new HashSet(), "Contact (Contact)" )
    if( verfErrString != null ) {
      _logger.warn( verfErrString )
    }
    
    verfErrString = pluginVerification( Contact, _objectConverterFactory.getABToCC(), new HashSet(), "ABContact (ABContact)" )
    if( verfErrString != null ) {
      _logger.warn( verfErrString )
    }
  }
  
  override function setParameters(params : Map) {
    if( Boolean.valueOf( params.get( "authPlugin" ) as String ) ) {
      var plugin = Plugins.get(ABAuthenticationPlugin)
      var up = plugin.retrieveUsernameAndPassword( params )
      _username = up.Username
      _password = up.Password
    } else {
      _username = params.get( "username" ) as String
      _password = params.get( "password" ) as String
    }
  }
 
  override function retrieveContact(addressBookId : String, contactRelationshipSpec : ContactRelationshipSpec) : Contact {
    Counter.incrementCount("retrieveContact")
    var retrieveOp = new RetrieveOperation(_objectConverterFactory, getContactAPI(), _relatedContactFilter)
    var retContact = retrieveOp.retrieveContact(addressBookId, contactRelationshipSpec)
    _logger.info("Retrieved contact from AB (Contact Center) with AddressBookUID " + addressBookID + ": " + retContact)
    return retContact
  }

  override function retrieveRelatedContacts( contact : Contact, spec: ContactRelationshipSpec ) : Contact {
    Counter.incrementCount("retrieveContact")
    var retrieveOp = new RetrieveOperation(_objectConverterFactory, getContactAPI(), _relatedContactFilter)
    return retrieveOp.retrieveRelatedContacts(contact, spec)
  }

  /**
   * Searches for all contacts that match the given search criteria. Results are specified by the given
   * SearchResultSpec.
   *
   * @param searchCriteria   defines the requirements of the search
   * @param searchResultSpec defines requirements for the returned results
   * @Throws DisplayableException
   */
  override function searchContact(searchCriteria : ContactSearchCriteria,
                         remotableSearchResultSpec : AddressBookRemotableSearchResultSpec) : ContactSearchResult {
    Counter.incrementCount("searchContact")                           
    var searchOp = new SearchOperation(_objectConverterFactory, getContactAPI(), _searchFilter)
    return searchOp.searchContact(searchCriteria, remotableSearchResultSpec)
  }

  override function submitUpdates(updateBatch : UpdateBatch, contact : Contact) : ContactUpdateResult {
    Counter.incrementCount("submitUpdates")
    var updateOp = new UpdateOperation(_objectConverterFactory, getContactAPI())
    return updateOp.updateBatch(updateBatch, _errorGenerator)

  }

  override function findDefinitiveMatch(contact : Contact) : ContactFindMatchResult {
    Counter.incrementCount("findDefinitiveMatch")
    var findDefinitiveMatchOp = new FindDefinitiveMatchOperation(_objectConverterFactory, getContactAPI())
    return findDefinitiveMatchOp.findDefinitiveMatch(contact)
  }

  /**
   * Searches for all contacts that potentially match the given contact data. Results are specified by the given
   * SearchResultSpec.
   *
   * @param contactData      the contact which must be matched approximately
   * @param searchResultSpec defines requirements for the returned results
   */
  override function findPotentialMatches(contact : Contact, searchResultSpec : AddressBookRemotableSearchResultSpec) : ContactSearchResult {
    Counter.incrementCount("findPotentialMatches")
    var findPotentialMatchesOp = new FindPotentialMatchesOperation(_objectConverterFactory, getContactAPI(), _searchFilter)
    return findPotentialMatchesOp.findPotentialMatches(contact, searchResultSpec)
  }

  // ---------------------------------------------------------- Private Methods

  private function getContactAPI() : IContactAPI {
    if (_api == null) {
      _lock.lock()
      try {
        _api = new soap.abintegration.api.IContactAPI()
        _api.addHandler(new GWAuthenticationHandler( _username, _password ))
      } catch (e) {
        throw new DisplayableException("Error obtaining IContactAPI", e.Cause)
      } finally {
        _lock.unlock()
      }
    }
    return _api
  }
  
   /**
   * This function will start from the given class (cls) and recursively check all of the typelist under it.
   * It makes sure that all of the typecodes used under cls are covertible by the given converter.
   * However, here is a list of special cases that we hardcoded into the function:
   *  1) the typelist "com.guidewire.cc.external.typelist.Contact" is skipped
   *  2) the attribute "createUser" and "updateUser" are skipped because they are generated property that will not be exported
   * @param cls - class to start from
   * @param objConv - Object converter used to convert the typecodes
   * @param map - this map contains all of the typelists and entities that had been visited so far
   * @param chainOfProperties - this string contains the chain of properties that lead us here. This string is printed to the logger when a problem is encountered
   * @return null if verification is successful. otherwise, it returns the error string to be logged.
   * @throws ReflectionException
   */
  static function pluginVerification(cls : Type, 
                                   objConv : ObjectConverter, 
                                   map : HashSet, 
                                   chainOfProperties : String) : String {
    // First get the contact class and find all of its typelists
    var errStrBuf = new StringBuilder()
    
    //var iterator = BeanInfoCache.INSTANCE.iterateProperties(cls);
    var properties = cls.TypeInfo.Properties
    map.add(cls);
    for(prop in properties) {
      var propertyType = prop.Type;
      if(GWObjectUtils.isEnumType(propertyType) && !map.contains(propertyType)) {
        // This is a special case! why? TODO: answer this question PT
        
        //IT is not legal to reference an external typelist inside a gosu class.  http://jira/jira/browse/PL-6825
        //This whole method needs to be rewritten
        
        //if( propertyType typeis com.guidewire.cc.external.typelist.Contact ){
        //  // Contact subtype in CC does not correspond to AB
        //  continue; // TODO: Make this more general than just checking for this special case. PT
        //}
        // get all of the typekeys in this typelist and try to convert them
        //var typekeys = EnumerationCache.INSTANCE.getEnumValues(propertyType);
        var typekeys = propertyType.TypeInfo.Properties
        for (typekey in typekeys) {
          if( GWObjectUtils.isEnumType( typeof typekey ) ) {
            // If convert returns Non-null, then we assume it converted correctly
            var errMsg = "Could not convert typecode \"" + GWObjectUtils.getCode(typekey) + "\" from typelist \"" + propertyType.Name + "\" under the chain: " + chainOfProperties;
            try {
              objConv.convert(typekey, propertyType)
            } catch (e : TypelistNotFoundException) {
              // Since one of the typecodes (should be the first one) tells us that we can't find the typelist, we break out the for-loop for this typelist
                break
            } catch(e) {
              errStrBuf.append(errMsg).append("\n")
            }
          }
        }
        map.add(propertyType)
      } else if(GWObjectUtils.isGWClass(propertyType)) {
        // The following properties are skipped because they are Autogenerated and they are not exported to AB
        if(prop.Name.equals("createUser") || prop.Name.equals("updateUser")) {
          continue
        }
        // We need to recursively look into this
        if(!map.contains(propertyType)) {
          var newChainOfProperties = chainOfProperties + " -> " + prop.Name + "(" + propertyType.RelativeName + ")"
          var ret = pluginVerification(propertyType, objConv, map, newChainOfProperties)
          if(ret != null) {
            errStrBuf.append(ret)
          }
        }
      }
    }
    return (errStrBuf.length() == 0 ? null : errStrBuf.toString())
  } 
}
