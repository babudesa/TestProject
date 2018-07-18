/**
 * RouteHighlightColor.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.2.1 Jun 14, 2005 (09:15:57 EDT) WSDL2Java emitter.
 */

package examples.plugins.geocode.soap.mappoint;

public class RouteHighlightColor implements java.io.Serializable {
    private java.lang.String _value_;
    private static java.util.HashMap _table_ = new java.util.HashMap();

    // Constructor
    protected RouteHighlightColor(java.lang.String value) {
        _value_ = value;
        _table_.put(_value_,this);
    }

    public static final java.lang.String _DefaultColor = "DefaultColor";
    public static final java.lang.String _Green = "Green";
    public static final java.lang.String _Yellow = "Yellow";
    public static final java.lang.String _Cyan = "Cyan";
    public static final java.lang.String _Red = "Red";
    public static final RouteHighlightColor DefaultColor = new RouteHighlightColor(_DefaultColor);
    public static final RouteHighlightColor Green = new RouteHighlightColor(_Green);
    public static final RouteHighlightColor Yellow = new RouteHighlightColor(_Yellow);
    public static final RouteHighlightColor Cyan = new RouteHighlightColor(_Cyan);
    public static final RouteHighlightColor Red = new RouteHighlightColor(_Red);
    public java.lang.String getValue() { return _value_;}
    public static RouteHighlightColor fromValue(java.lang.String value)
          throws java.lang.IllegalArgumentException {
        RouteHighlightColor enumeration = (RouteHighlightColor)
            _table_.get(value);
        if (enumeration==null) throw new java.lang.IllegalArgumentException();
        return enumeration;
    }
    public static RouteHighlightColor fromString(java.lang.String value)
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
        new org.apache.axis.description.TypeDesc(RouteHighlightColor.class);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "RouteHighlightColor"));
    }
    /**
     * Return type metadata object
     */
    public static org.apache.axis.description.TypeDesc getTypeDesc() {
        return typeDesc;
    }

}

