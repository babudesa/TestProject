/**
 * DirectionType.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.2.1 Jun 14, 2005 (09:15:57 EDT) WSDL2Java emitter.
 */

package examples.plugins.geocode.soap.mappoint;

public class DirectionType implements java.io.Serializable {
    private java.lang.String _value_;
    private static java.util.HashMap _table_ = new java.util.HashMap();

    // Constructor
    protected DirectionType(java.lang.String value) {
        _value_ = value;
        _table_.put(_value_,this);
    }

    public static final java.lang.String _Driving = "Driving";
    public static final java.lang.String _Border = "Border";
    public static final java.lang.String _StartOfDay = "StartOfDay";
    public static final java.lang.String _EndOfDay = "EndOfDay";
    public static final java.lang.String _Warning = "Warning";
    public static final java.lang.String _Waypoint = "Waypoint";
    public static final DirectionType Driving = new DirectionType(_Driving);
    public static final DirectionType Border = new DirectionType(_Border);
    public static final DirectionType StartOfDay = new DirectionType(_StartOfDay);
    public static final DirectionType EndOfDay = new DirectionType(_EndOfDay);
    public static final DirectionType Warning = new DirectionType(_Warning);
    public static final DirectionType Waypoint = new DirectionType(_Waypoint);
    public java.lang.String getValue() { return _value_;}
    public static DirectionType fromValue(java.lang.String value)
          throws java.lang.IllegalArgumentException {
        DirectionType enumeration = (DirectionType)
            _table_.get(value);
        if (enumeration==null) throw new java.lang.IllegalArgumentException();
        return enumeration;
    }
    public static DirectionType fromString(java.lang.String value)
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
        new org.apache.axis.description.TypeDesc(DirectionType.class);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "DirectionType"));
    }
    /**
     * Return type metadata object
     */
    public static org.apache.axis.description.TypeDesc getTypeDesc() {
        return typeDesc;
    }

}

