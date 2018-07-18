package gw.datatype.presentation
uses gw.datatype.handler.IDatePresentationHandler
uses gw.lang.reflect.IPropertyInfo
uses gw.datatype.DisplayCalendar

class JapaneseImperialCalendarPresentationHandler implements IDatePresentationHandler
{
  override function getCalendar( ctx: Object, prop: IPropertyInfo ) : DisplayCalendar
  {
    return JAPANESEIMPERIAL
  }

  override function getDisplayFormat( p0: Object, p1: IPropertyInfo ) : String
  {
    return null
  }
}