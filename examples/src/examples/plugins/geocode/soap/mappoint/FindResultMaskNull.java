/**
 * FindResultMaskNull.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.2.1 Jun 14, 2005 (09:15:57 EDT) WSDL2Java emitter.
 */

package examples.plugins.geocode.soap.mappoint;

public class FindResultMaskNull implements java.io.Serializable {
    private java.lang.String _value_;
    private static java.util.HashMap _table_ = new java.util.HashMap();

    // Constructor
    protected FindResultMaskNull(java.lang.String value) {
        _value_ = value;
        _table_.put(_value_,this);
    }

    public static final java.lang.String _LatLongFlag = "LatLongFlag";
    public static final java.lang.String _EntityFlag = "EntityFlag";
    public static final java.lang.String _AddressFlag = "AddressFlag";
    public static final java.lang.String _BestMapViewFlag = "BestMapViewFlag";
    public static final java.lang.String _MatchDetailsFlag = "MatchDetailsFlag";
    public static final FindResultMaskNull LatLongFlag = new FindResultMaskNull(_LatLongFlag);
    public static final FindResultMaskNull EntityFlag = new FindResultMaskNull(_EntityFlag);
    public static final FindResultMaskNull AddressFlag = new FindResultMaskNull(_AddressFlag);
    public static final FindResultMaskNull BestMapViewFlag = new FindResultMaskNull(_BestMapViewFlag);
    public static final FindResultMaskNull MatchDetailsFlag = new FindResultMaskNull(_MatchDetailsFlag);
    public java.lang.String getValue() { return _value_;}
    public static FindResultMaskNull fromValue(java.lang.String value)
          throws java.lang.IllegalArgumentException {
        FindResultMaskNull enumeration = (FindResultMaskNull)
            _table_.get(value);
        if (enumeration==null) throw new java.lang.IllegalArgumentException();
        return enumeration;
    }
    public static FindResultMaskNull fromString(java.lang.String value)
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
        new org.apache.axis.description.TypeDesc(FindResultMaskNull.class);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "FindResultMask>null"));
    }
    /**
     * Return type metadata object
     */
    public static org.apache.axis.description.TypeDesc getTypeDesc() {
        return typeDesc;
    }

}

