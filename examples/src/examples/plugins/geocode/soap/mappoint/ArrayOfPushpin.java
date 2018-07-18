/**
 * ArrayOfPushpin.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.2.1 Jun 14, 2005 (09:15:57 EDT) WSDL2Java emitter.
 */

package examples.plugins.geocode.soap.mappoint;

public class ArrayOfPushpin  implements java.io.Serializable {
    private Pushpin[] pushpin;

    public ArrayOfPushpin() {
    }

    public ArrayOfPushpin(
           Pushpin[] pushpin) {
           this.pushpin = pushpin;
    }


    /**
     * Gets the pushpin value for this ArrayOfPushpin.
     * 
     * @return pushpin
     */
    public Pushpin[] getPushpin() {
        return pushpin;
    }


    /**
     * Sets the pushpin value for this ArrayOfPushpin.
     * 
     * @param pushpin
     */
    public void setPushpin(Pushpin[] pushpin) {
        this.pushpin = pushpin;
    }

    public Pushpin getPushpin(int i) {
        return this.pushpin[i];
    }

    public void setPushpin(int i, Pushpin _value) {
        this.pushpin[i] = _value;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof ArrayOfPushpin)) return false;
        ArrayOfPushpin other = (ArrayOfPushpin) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            ((this.pushpin==null && other.getPushpin()==null) || 
             (this.pushpin!=null &&
              java.util.Arrays.equals(this.pushpin, other.getPushpin())));
        __equalsCalc = null;
        return _equals;
    }

    private boolean __hashCodeCalc = false;
    public synchronized int hashCode() {
        if (__hashCodeCalc) {
            return 0;
        }
        __hashCodeCalc = true;
        int _hashCode = 1;
        if (getPushpin() != null) {
            for (int i=0;
                 i<java.lang.reflect.Array.getLength(getPushpin());
                 i++) {
                java.lang.Object obj = java.lang.reflect.Array.get(getPushpin(), i);
                if (obj != null &&
                    !obj.getClass().isArray()) {
                    _hashCode += obj.hashCode();
                }
            }
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(ArrayOfPushpin.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ArrayOfPushpin"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("pushpin");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "Pushpin"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "Pushpin"));
        elemField.setMinOccurs(0);
        elemField.setNillable(true);
        elemField.setMaxOccursUnbounded(true);
        typeDesc.addFieldDesc(elemField);
    }

    /**
     * Return type metadata object
     */
    public static org.apache.axis.description.TypeDesc getTypeDesc() {
        return typeDesc;
    }

    /**
     * Get Custom Serializer
     */
    public static org.apache.axis.encoding.Serializer getSerializer(
           java.lang.String mechType, 
           java.lang.Class _javaType,  
           javax.xml.namespace.QName _xmlType) {
        return 
          new  org.apache.axis.encoding.ser.BeanSerializer(
            _javaType, _xmlType, typeDesc);
    }

    /**
     * Get Custom Deserializer
     */
    public static org.apache.axis.encoding.Deserializer getDeserializer(
           java.lang.String mechType, 
           java.lang.Class _javaType,  
           javax.xml.namespace.QName _xmlType) {
        return 
          new  org.apache.axis.encoding.ser.BeanDeserializer(
            _javaType, _xmlType, typeDesc);
    }

}

