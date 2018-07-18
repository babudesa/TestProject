package gw.plugin.ccabintegration.impl

uses java.util.ArrayList
uses java.util.Collection
uses org.w3c.dom.Document
uses org.w3c.dom.Element
uses org.w3c.dom.NodeList

uses javax.xml.parsers.DocumentBuilderFactory
uses java.io.File
uses gw.api.util.DisplayableException
uses soap.abintegration.entity.ObjectFilter
uses soap.abintegration.entity.FieldFilter

class ObjectFilterBuilder {
  public static function buildObjectFilter(file : File) : ObjectFilter {
    var documentBuilderFactory = DocumentBuilderFactory.newInstance()
    var document : Document = null
    try {
      var documentBuilder = documentBuilderFactory.newDocumentBuilder()
      // TODO pdalbora 26-Apr-2005 -- Parse with validation against the data-mapping.xsd.
      //InputStream in = ObjectFilterBuilder.class.getResourceAsStream(objectFilterFileName);
      document = documentBuilder.parse(file)
    } catch (e) {
      throw new DisplayableException("Unable to create ObjectFilter", e.Cause)
    }

    var fieldFilterList : Collection = new ArrayList()
    var fieldFilters = document.getElementsByTagName("FieldFilter")
    var i : int = 0
    while(i < fieldFilters.getLength()) {
      var fieldFilter = fieldFilters.item(i) as Element
      var entityName = fieldFilter.getAttribute("entity")
      var fieldNames : Collection = new ArrayList()
      var fieldNameElements = fieldFilter.getElementsByTagName("Field")
      var j : int = 0
      while(j < fieldNameElements.getLength()) {
        var fieldName = fieldNameElements.item(j) as Element
        fieldNames.add(fieldName.getFirstChild().getNodeValue())
        j = j + 1
      }
      var fFilter = new FieldFilter()
      fFilter.EntityName = entityName
      fFilter.FieldNames = fieldNames as String[]
      fieldFilterList.add(fFilter);
      i = i + 1
    }

    var objectFilter = new ObjectFilter()
    var fieldFilterArray = new FieldFilter[fieldFilterList.size()]
    for( fieldFilter in fieldFilterList index k ) {
      fieldFilterArray[k] = fieldFilter as FieldFilter
    }
    objectFilter.FieldFilters = fieldFilterArray
    return objectFilter
  }
}
