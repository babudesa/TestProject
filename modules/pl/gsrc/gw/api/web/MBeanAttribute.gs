package gw.api.web

class MBeanAttribute
{
  private var _attribute : com.guidewire.pl.plugin.management.Attribute;
  private var _mBean : com.guidewire.pl.plugin.management.GWMBean
  private var _mBeansData : gw.api.tools.MBeansData
  
  construct(mBeansData : gw.api.tools.MBeansData, mBean : com.guidewire.pl.plugin.management.GWMBean, attribute : com.guidewire.pl.plugin.management.Attribute)
  {
    _attribute = attribute;
    _mBeansData = mBeansData;
    _mBean = mBean
    print("Creating MBeanAttribute: ${_attribute.Name}=${_attribute.Value}")
  }
  
  property get Name() : String {
    return _attribute.Name
  }
  
  property get Value() : Object {
    return _attribute.Value
  }

  property set Value(aValue : String) {
    _attribute = _mBeansData.newAttributeFromValue(_mBean, _attribute, aValue)
    _mBean.setAttribute(_attribute)
  }

}
