/**
 * MapFontSize.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.2.1 Jun 14, 2005 (09:15:57 EDT) WSDL2Java emitter.
 */

package examples.plugins.geocode.soap.mappoint;

public class MapFontSize implements java.io.Serializable {
    private java.lang.String _value_;
    private static java.util.HashMap _table_ = new java.util.HashMap();

    // Constructor
    protected MapFontSize(java.lang.String value) {
        _value_ = value;
        _table_.put(_value_,this);
    }

    public static final java.lang.String _Smallest = "Smallest";
    public static final java.lang.String _Smaller = "Smaller";
    public static final java.lang.String _Medium = "Medium";
    public static final java.lang.String _Larger = "Larger";
    public static final java.lang.String _Largest = "Largest";
    public static final MapFontSize Smallest = new MapFontSize(_Smallest);
    public static final MapFontSize Smaller = new MapFontSize(_Smaller);
    public static final MapFontSize Medium = new MapFontSize(_Medium);
    public static final MapFontSize Larger = new MapFontSize(_Larger);
    public static final MapFontSize Largest = new MapFontSize(_Largest);
    public java.lang.String getValue() { return _value_;}
    public static MapFontSize fromValue(java.lang.String value)
          throws java.lang.IllegalArgumentException {
        MapFontSize enumeration = (MapFontSize)
            _table_.get(value);
        if (enumeration==null) throw new java.lang.IllegalArgumentException();
        return enumeration;
    }
    public static MapFontSize fromString(java.lang.String value)
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
        new org.apache.axis.description.TypeDesc(MapFontSize.class);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "MapFontSize"));
    }
    /**
     * Return type metadata object
     */
    public static org.apache.axis.description.TypeDesc getTypeDesc() {
        return typeDesc;
    }

}

