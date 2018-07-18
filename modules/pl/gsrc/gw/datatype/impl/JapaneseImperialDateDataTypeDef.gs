package gw.datatype.impl

uses gw.datatype.impl.SimpleValueHandler
uses gw.datatype.impl.DateTimeConstraintsHandler
uses gw.datatype.impl.DatePersistenceHandler
uses gw.datatype.handler.IDataTypeValueHandler
uses java.util.Date
uses gw.datatype.handler.IDataTypeConstraintsHandler
uses gw.datatype.handler.IDataTypePersistenceHandler
uses gw.datatype.handler.IDataTypePresentationHandler
uses gw.datatype.presentation.JapaneseImperialCalendarPresentationHandler
uses gw.datatype.def.IDataTypeDef
uses gw.lang.reflect.IPropertyInfo
uses gw.datatype.def.IDataTypeDefValidationErrors

class JapaneseImperialDateDataTypeDef implements IDataTypeDef {

  override property get ValueHandler() : IDataTypeValueHandler
  {
    return new SimpleValueHandler( Date )
  }

  override property get ConstraintsHandler() : IDataTypeConstraintsHandler
  {
    return new DateTimeConstraintsHandler()
  }

  override property get PersistenceHandler() : IDataTypePersistenceHandler
  {
    return new DatePersistenceHandler()
  }

  override property get PresentationHandler() : IDataTypePresentationHandler
  {
    return new JapaneseImperialCalendarPresentationHandler()
  }

  override function validate( prop : IPropertyInfo, errors : IDataTypeDefValidationErrors )
  {
  }
}
