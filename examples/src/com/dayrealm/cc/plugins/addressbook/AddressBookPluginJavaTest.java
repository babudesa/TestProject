package com.dayrealm.cc.plugins.addressbook;

import com.guidewire.cc.plugin.addressbook.IAddressBookAdapter;
import com.guidewire.pl.plugin.InitializablePlugin;
import com.guidewire.pl.plugin.addressbook.AddressBookRemotableSearchResultSpec;
import com.guidewire.cc.external.entity.*;
import com.guidewire.cc.external.typelist.PrimaryPhoneType;
import com.guidewire.cc.external.typelist.ContactMatchResultType;
import com.guidewire.cc.external.typelist.ContactSearchResultType;
import com.guidewire.pl.plugin.search.RemotableSearchResultSpec;
import com.guidewire.external.entity.EntityFactory;
import com.guidewire.logging.LoggerCategory;
import com.guidewire.util.ArgCheck;


import java.util.HashMap;
import java.util.Map;
import java.rmi.RemoteException;

/**
 * QA test java plugin for IAddressBookAdapter.
 * <p>
 * <b>Summary:</b>
 * <p>
 * This plugin just provide basic functionalities, and only can be used for <b>Person</b> type, and can't deal with other contact type and other entity e.g. address
 * <ul>
 * <li> The plugin creates a new person, find potential matches, remove a person, and search person
 * <li> All the above information are written by GW's logger to console and log file, which is specified in logging.properties.
 * </ul>
 * <p>
 * <b>Setup:</b>
 * <ul>
 * <li> Compile this file, and put the class to appserver's \\config\plugins\QAPlugins\classes directory.
 * <li> In config.xml, add the following code to &lt;plugin-registry&gt; section:
 * <p>
 * <code>
 * &lt;plugin-java javaclass="com.dayrealm.cc.plugins.java.AddressBook.QAAddressBookTestJavaPlugin" name="IAddressBookAdapter" plugindir="QAPlugins"/&gt;
 * </code>
 * <li> In config.xml, comment out:
 * <p>
 * &lt;plugin-java javaclass="com.guidewire.pl.plugin.addressbook.internal.AddressBookDemoAdapter" name="IAddressBookAdapter"/&gt;
 * </ul>
 * <b>Usage:</b>
 * <ul>
 * <li> Login in as a user who has 'Create address book contacts' role e.g. admin
 * <li> Hit 'Address Book' top menu
 * <li> Put location 'City' to 'San mateo', the plugin will provide one search results with Name 'QA PluginTestXXX' (XXX-is a random number)
 * <p> In log file, the plugin provides the following msg:  search method in QAAddressBookTestJavaPlugin is called
 * <li> Click on the search result link,  this opens up the contact detail.  This contact has 'First name' = 'QA', LastName='PluginTestXXX', and Tax ID='XXX'. (XXX-is a random number)
 *  <p> In log file, the plugin provides the following msg:  retrieve method in QAAddressBookTestJavaPlugin is called
 *  <li> Go to 'New Person' side menu -> other, fill out First name, last name, and tax ID (currenly the plugin only use these 3 fields), hit 'Update Address Book'
 * <p>  This invokes findPotentialMatches method in Plugin. 2 contacts named as the newly creating person show up in 'Matching contacts' panel. but these two persons have different TaxID and phone #.
 * <li> Hit 'Create New Contact', a new person is created
 * <p> In log file, the plugin provides the following messages:
 * <p> updateOrCreate method in QAAddressBookTestJavaPlugin is called
 * <p> lookup method in QAAddressBookTestJavaPlugin is called
 * <li> Hit 'Delete', UI goes back to 'Search Address Book' page
 * <p>  In log file, the plugin provides the following messages:
 * <p>  updateOrCreate method in QAAddressBookTestJavaPlugin is called
 * <p> Remove the contact: XXX XXX
 * </ul>
 * <b>Future:</b>
 * <ul>
 * <li> Implement findDefinitiveMatch() method
 * <li> Expand the implment
 *
 * @author tlin
 */

//<plugin-java javaclass="com.dayrealm.cc.plugins.java.AddressBook.QAAddressBookTestJavaPlugin" name="IAddressBookAdapter" plugindir="QAPlugins"/>
public class AddressBookPluginJavaTest implements IAddressBookAdapter, InitializablePlugin {

  private LoggerCategory _logger = null;
  private EntityFactory _entityFactory;
  private HashMap _hashMap;
  private Map _params;

  public AddressBookPluginJavaTest() {
    _logger = LoggerCategory.PLUGIN;
    _logger.info("*** AddressBookPluginJavaTest is called ***");
    _entityFactory = EntityFactory.getEntityFactory();
    _hashMap = new HashMap();

  }

  public void setParameters(Map params) {
    _params =  params;
    /*if (params != null) {
    if (params.containsKey("findPotentialMatches")) {
      _logger.info("findPotentialMatches = " + params.get( "findPotentialMatches" ));
      _findPotentialMatches = (String) params.get( "findPotentialMatches" );
    } else {
      _logger.info("Cant find param findPotentialMatches" );
    }
    }*/
  }


  public Contact retrieveContact(String addressBookUID, ContactRelationshipSpec contactRelationshipSpec) {
    ArgCheck.nonNull(addressBookUID, "addressBookUID");
    _logger.info("retriveContact method in AddressBookPluginJavaTest is called");
    Contact contact = (Contact) _hashMap.get(addressBookUID);
    // need to clone the contact, can't simply display from hashMap
    return clone(contact);
  }

  public Contact retrieveRelatedContacts(Contact contact, ContactRelationshipSpec contactRelationshipSpec) throws RemoteException {
    return contact;
  }

  public ContactSearchResult searchContact(ContactSearchCriteria searchCriteria, AddressBookRemotableSearchResultSpec searchResultSpec) {
        _logger.info("**search method in AddressBookPluginxJavaTest is called**");
        ContactSearchResult searchResult = (ContactSearchResult) EntityFactory.getEntityFactory().newEntity(ContactSearchResult.class);
        Person contact = (Person) _entityFactory.newEntity(Person.class);
        String city = searchCriteria.getCity();
        if (city != null && city.equalsIgnoreCase("San Mateo")) {
          contact = createAndStorePerson(null, null, null, null, null, null);
        } else {
          /*For CC-26855's regression
          throw new RuntimeException("Msg from QAPlugin: Do not have this message");*/
          contact = createAndStorePerson(null, null, null, null, null, "San Jose");
        }
        searchResult.setResults(new Contact[] {contact});
        searchResult.setTotalResults(new Integer("1"));
        searchResult.setSearchResultType(ContactSearchResultType.SUCCESS);
        return searchResult;

    }

    public ContactFindMatchResult findDefinitiveMatch(Contact contact) {
    _logger.info("findDefinitiveMatch method in AddressBookPluginJavaTest is called");
    //_logger.info("findDefinitiveMatches = " + _findPotentialMatches);

    ContactFindMatchResult matchResult = (ContactFindMatchResult) _entityFactory.newEntity(ContactFindMatchResult.class);
    if (_params.containsKey("findDefinitiveMatch") || _params.containsKey("retriveContact")) {
      String taxID = contact.getTaxID();
      String workPhone = contact.getWorkPhone();
      if (contact instanceof Person) {
        String   firstName = ((Person) contact).getFirstName();
        String  lastName = ((Person) contact).getLastName();
        if(taxID == null) {taxID = "111-22-3333";}
        if(workPhone == null) {workPhone = "111-111-3333";}
        Person person = createAndStorePerson(firstName, lastName, taxID, workPhone, null, null);
        Contact clonedPerson = clone(person);
     //   clonedPerson.setAddressBookFingerprint("test");
        matchResult.setContact(clonedPerson);  //matchResult.setContact(clone(person ));
      } else {
        _logger.info("No implementation for subtype other than person");
        matchResult.setContact(null);
      }
      matchResult.setResultType(ContactMatchResultType.PLAUSIBLE_MATCH);
    }
    return matchResult;
  }

    public ContactSearchResult findPotentialMatches(Contact contact, AddressBookRemotableSearchResultSpec searchResultSpec) {
        _logger.info("findPotentialMatches method in AddressBookPluginJavaTest is called");
    ContactSearchResult searchResult = (ContactSearchResult) EntityFactory.getEntityFactory().newEntity(ContactSearchResult.class);
    if (_params.containsKey("findPotentialMatch")) {
      //ContactWithTravelInfo contactWithTravelInfo[] = {(ContactWithTravelInfo) _entityFactory.newEntity(ContactWithTravelInfo.class), (ContactWithTravelInfo) _entityFactory.newEntity(ContactWithTravelInfo.class)};
      Person[] contactArray = {(Person)_entityFactory.newEntity(Person.class), (Person)_entityFactory.newEntity(Person.class)};
      String oTaxID = contact.getTaxID();
      String prefixTaxID = oTaxID.substring( 0, oTaxID.length() - 4 );
      String suffix1 = "7890";
      String suffix2 = "6789";
      String taxID[] = {prefixTaxID + suffix1, prefixTaxID + suffix2};
      String prefixWorkPhone = oTaxID.substring( 0, 3 ) + "-" + oTaxID.substring( 0, 3 ) + "-";
      String workPhone[] = {prefixWorkPhone + suffix1, prefixWorkPhone + suffix2};
      String firstName, lastName;
      if (contact instanceof Person) {
        firstName = ((Person) contact).getFirstName();
        lastName = ((Person) contact).getLastName();
        for (int i = 0; i < contactArray.length; i++) {
          contactArray[i] = (createAndStorePerson(firstName, lastName, taxID[i], workPhone[i], null, null));
          searchResult.setContact(clone(contactArray[i]));
        }
        searchResult.setResults(contactArray);
        searchResult.setTotalResults(new Integer(contactArray.length));
      } else {
        _logger.info("No implementation for subtype other than person");
        searchResult.setResults(contactArray);
        searchResult.setTotalResults(new Integer("0"));
      }
      searchResult.setResultType(ContactMatchResultType.POSSIBLE_MATCH);
    }
    return searchResult;
    }

  public ContactUpdateResult submitUpdates(UpdateBatch updateBatch, Contact _contact) {
    _logger.info("**submitUpdates method in AddressBookPluginJavaTest is called**");
    Map beanTempPair = new HashMap();      /*<Bean>, String>*/
    ContactUpdateResult updateResult = (ContactUpdateResult) _entityFactory.newEntity(ContactUpdateResult.class);
    CreateUpdateOp createOps[] = updateBatch.getCreateUpdateOps();
    _logger.info("CreateUpdateOp is called in submitUpdates");
    for (int i = 0; i < createOps.length; i++) {
      String entityTypeName = createOps[i].getEntityTypeName();
      String objectUId = createOps[i].getObjectUId();
      try {
        Class entityTypeClass = Class.forName("com.guidewire.cc.external.entity." + entityTypeName);
        // During creating a contact from UI, user may create another entity e.g. address. Only ObjectUId: UpdateBatchTempId:1 creates a contact object
        if (objectUId.equalsIgnoreCase("UpdateBatchTempId:1") && entityTypeName.equalsIgnoreCase("Person")) {
          java.util.Random generator1 = new java.util.Random(System.currentTimeMillis());
          int _randomNum1 = generator1.nextInt(1000000000);
          Person contact = (Person) _entityFactory.newEntity(entityTypeClass);
          String addressbookUID = Integer.toString(_randomNum1);
          contact.setAddressBookUID(addressbookUID);
          _hashMap.put(addressbookUID, contact);
          beanTempPair.put(objectUId, contact);
          // need to convert tempID to permID.
          TempToPermEntry tempToPermEntry = (TempToPermEntry) _entityFactory.newEntity(TempToPermEntry.class);
          tempToPermEntry.setTempId(objectUId);
          tempToPermEntry.setPermId(addressbookUID);
          updateResult.setTempToPermEntrys(new TempToPermEntry[]{tempToPermEntry});
        }
      } catch (ClassNotFoundException e) {
        _logger.info("Can't find the " + entityTypeName + " class");
        e.printStackTrace();
      }
    }

    //update the fields
    FieldChangeUpdateOp[]   updateOps = updateBatch.getFieldChangeUpdateOps();
    _logger.info("FieldChangeUpdateOp is called in submitUpdates");
    for (int i = 0; i < updateOps.length; i++) {
      //String entityTypeName = updateOps[i].getEntityTypeName();
      String objectUId = updateOps[i].getObjectUId();
      if (updateOps[i].getEntityTypeName().equalsIgnoreCase("person")) {

        String field = updateOps[i].getField();
        String updateValue = updateOps[i].getValue();
        //get contact from beanTempPair when create a new contact
        Contact contact = (Contact) beanTempPair.get(objectUId);
        //get contact from hashmap when edit existing contact. In FieldChangeUpdate, the objectUId is the addressBookUID
        if (contact == null) {
          //        contact = (Contact) _hashMap.get(objectUId);
          contact = _contact;
          System.out.println("The phone number is: " + contact.getPrimaryPhoneValue());
        }
        // To simplify implementation, only take 3 fields from user's UI input, which are all string object
        if ((field.equalsIgnoreCase("FirstName") || field.equalsIgnoreCase("LastName") || field.equalsIgnoreCase("TaxID")) && (updateValue != null))
        {
          if (field.equalsIgnoreCase("LastName") ) {
            contact.setFieldValue(field, "QA_Java" + updateValue);
          } else {
            contact.setFieldValue(field, updateValue);
          }
        }
        // can't use the approach below to update all fields. since updateOps[i].getValue() returns string,
        // contact.setFieldValue takes 2 para: a string, and an object. So need to depends on the field, convert
        // the string to its object type e.g. the value of preferred field is need to change to boolean
        /*  String field=updateOps[i].getField();
       String updateValue =updateOps[i].getValue();
       if(updateValue == null){continue;}
       contact.setFieldValue(field, updateValue);*/
      }
    }

    // delete a contact
    DeleteUpdateOp[] deleteOps = updateBatch.getDeleteUpdateOps();
    _logger.info("DeleteUpdateOp is called in submitUpdates");
    for (int i = 0; i < deleteOps.length; i++) {
      _logger.info("deleteOp in deleteOps");
      //String entityTypeName = deleteOps[i].getEntityTypeName();
      // in deleteUpdateOp, the value of obejctUId for a contact is the same value as its addressBookUID
      String objectUId = deleteOps[i].getObjectUId();
      if (deleteOps[i].getEntityTypeName().equalsIgnoreCase("person")) {
        //   Contact contact = (Contact) _hashMap.get(objectUId);
        Person contact =(Person) _contact;
        _logger.info("Remove the contact: " + contact.getFirstName() + contact.getLastName() + contact.getTaxID());
        _hashMap.remove(objectUId);
        updateResult.setContact(contact);
      }
    }
    return updateResult;
  }

  // The following comment shows in the original plugin implementation, by Emily.
  // This method doesn't work. Need to implement later
  // To invoke this in UI: Go to one claim's parties involved page, select one contact, hit link
  // If AdddressBook doesn't have this contact, and the login user has permission to create new contact, the contact is created in addressbook
  // And UI says 'This contact is linked to the Address Book and In Sync'. If the login user doesn't have the permission, an error msg should shows
  // this person doesn't have permission.
  // If Addressbook already has definitiveMatch (means the same first name, last name, and TaxId for person), ??
  // If AddressBook has potential match (means the same first name, last name, but different taxId for person), ??


  /* ============================================Private methods =======================================================*/
  private Person createPerson(String firstName, String lastName, String taxID, String workPhone, String addressBookUID) {
    // Person person = (Person) PluginTools.getEntityFactory().newEntity(Person.class);
    Person person = (Person) _entityFactory.newEntity(Person.class);
    java.util.Random generator = new java.util.Random(System.currentTimeMillis());
    int randomNum = generator.nextInt(1000000000);
    int fourDigitsRandomNum =generator.nextInt(10000);
    if (fourDigitsRandomNum<1000) { fourDigitsRandomNum += 1000;}
    int threeDigitsRandomNum =generator.nextInt(1000);
    if (threeDigitsRandomNum<100) { threeDigitsRandomNum += 100;}
    int twoDigitsRandomNum =generator.nextInt(100);
    if (twoDigitsRandomNum<10) { twoDigitsRandomNum += 10;}

    if (firstName == null) {
      firstName = "QA";
    }
    if (lastName == null) {
      lastName = "PluginJavaTest" + randomNum;
    }
    if (taxID == null) {
      taxID = threeDigitsRandomNum + "-" + twoDigitsRandomNum + "-" + fourDigitsRandomNum;
    }
    if (workPhone == null) {
      workPhone = threeDigitsRandomNum + "-" + threeDigitsRandomNum + "-" + fourDigitsRandomNum;
    }
    if (addressBookUID == null) {
      addressBookUID = "QA_P" + Integer.toString(randomNum);
    }

    person.setFirstName(firstName);
    person.setLastName(lastName);
    person.setTaxID(taxID);
    person.setWorkPhone(workPhone);
    person.setPrimaryPhone(PrimaryPhoneType.WORK);
    person.setAddressBookUID(addressBookUID);

    return person;
  }


  private Person createAndStorePerson(String firstName, String lastName, String taxID, String workPhone, String addressBookUID, String city) {
    Person person = (Person) _entityFactory.newEntity(Person.class);
    person = createPerson(firstName, lastName, taxID, workPhone, addressBookUID);
    //register this person to hashmap for lookup
    _hashMap.put(person.getAddressBookUID(), person);
    return person;
  }


  private Contact clone(Contact contact) {

    if (contact instanceof Person) {
      String firstName = ((Person) contact).getFirstName();
      String lastName = ((Person) contact).getLastName();
      String addressbookUID = ((Person) contact).getAddressBookUID();
      String taxID = ((Person) contact).getTaxID();
      String workPhone = ((Person) contact).getWorkPhone();

      return createPerson(firstName, lastName, taxID, workPhone, addressbookUID);
    } else {
      _logger.info("Only person is cloned.");
    }
    return null;
  }
}
