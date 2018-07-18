/**
 * DataSourceCapabilityNull.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.2.1 Jun 14, 2005 (09:15:57 EDT) WSDL2Java emitter.
 */

package examples.plugins.geocode.soap.mappoint;

public class DataSourceCapabilityNull implements java.io.Serializable {
    private java.lang.String _value_;
    private static java.util.HashMap _table_ = new java.util.HashMap();

    // Constructor
    protected DataSourceCapabilityNull(java.lang.String value) {
        _value_ = value;
        _table_.put(_value_,this);
    }

    public static final java.lang.String _CanDrawMaps = "CanDrawMaps";
    public static final java.lang.String _CanFindPlaces = "CanFindPlaces";
    public static final java.lang.String _CanFindNearby = "CanFindNearby";
    public static final java.lang.String _CanRoute = "CanRoute";
    public static final java.lang.String _CanFindAddress = "CanFindAddress";
    public static final java.lang.String _HasIcons = "HasIcons";
    public static final java.lang.String _DataServiceQuery = "DataServiceQuery";
    public static final DataSourceCapabilityNull CanDrawMaps = new DataSourceCapabilityNull(_CanDrawMaps);
    public static final DataSourceCapabilityNull CanFindPlaces = new DataSourceCapabilityNull(_CanFindPlaces);
    public static final DataSourceCapabilityNull CanFindNearby = new DataSourceCapabilityNull(_CanFindNearby);
    public static final DataSourceCapabilityNull CanRoute = new DataSourceCapabilityNull(_CanRoute);
    public static final DataSourceCapabilityNull CanFindAddress = new DataSourceCapabilityNull(_CanFindAddress);
    public static final DataSourceCapabilityNull HasIcons = new DataSourceCapabilityNull(_HasIcons);
    public static final DataSourceCapabilityNull DataServiceQuery = new DataSourceCapabilityNull(_DataServiceQuery);
    public java.lang.String getValue() { return _value_;}
    public static DataSourceCapabilityNull fromValue(java.lang.String value)
          throws java.lang.IllegalArgumentException {
        DataSourceCapabilityNull enumeration = (DataSourceCapabilityNull)
            _table_.get(value);
        if (enumeration==null) throw new java.lang.IllegalArgumentException();
        return enumeration;
    }
    public static DataSourceCapabilityNull fromString(java.lang.String value)
          throws java.lang.IllegalArgumentException {
        return fromValue(value);
    }
    public boolean equals(java.lang.Object obj) {return (obj == this);}
    public int hashCode() { return toString().hashCode();}
    public java.lang.String toString() { return _value_;}
    public java.lang.Object readResolve() throws java.io.ObjectStreamException { return fromValue(_value_);}
    public static org.apache.axis.encoding.Serializer getSerializer(
           java.lang.String mechType, 
           java.lang.Class _javaType,  
           javax.xml.namespace.QName _xmlType) {
        return 
          new org.apache.axis.encoding.ser.EnumSerializer(
            _javaType, _xmlType);
    }
    public static org.apache.axis.encoding.Deserializer getDeserializer(
           java.lang.String mechType, 
           java.lang.Class _javaType,  
           javax.xml.namespace.QName _xmlType) {
        return 
          new org.apache.axis.encoding.ser.EnumDeserializer(
            _javaType, _xmlType);
    }
    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(DataSourceCapabilityNull.class);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "DataSourceCapability>null"));
    }
    /**
     * Return type metadata object
     */
    public static org.apache.axis.description.TypeDesc getTypeDesc() {
        return typeDesc;
    }

}

