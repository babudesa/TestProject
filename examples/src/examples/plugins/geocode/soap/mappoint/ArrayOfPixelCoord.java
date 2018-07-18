/**
 * ArrayOfPixelCoord.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.2.1 Jun 14, 2005 (09:15:57 EDT) WSDL2Java emitter.
 */

package examples.plugins.geocode.soap.mappoint;

public class ArrayOfPixelCoord  implements java.io.Serializable {
    private PixelCoord[] pixelCoord;

    public ArrayOfPixelCoord() {
    }

    public ArrayOfPixelCoord(
           PixelCoord[] pixelCoord) {
           this.pixelCoord = pixelCoord;
    }


    /**
     * Gets the pixelCoord value for this ArrayOfPixelCoord.
     * 
     * @return pixelCoord
     */
    public PixelCoord[] getPixelCoord() {
        return pixelCoord;
    }


    /**
     * Sets the pixelCoord value for this ArrayOfPixelCoord.
     * 
     * @param pixelCoord
     */
    public void setPixelCoord(PixelCoord[] pixelCoord) {
        this.pixelCoord = pixelCoord;
    }

    public PixelCoord getPixelCoord(int i) {
        return this.pixelCoord[i];
    }

    public void setPixelCoord(int i, PixelCoord _value) {
        this.pixelCoord[i] = _value;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof ArrayOfPixelCoord)) return false;
        ArrayOfPixelCoord other = (ArrayOfPixelCoord) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            ((this.pixelCoord==null && other.getPixelCoord()==null) || 
             (this.pixelCoord!=null &&
              java.util.Arrays.equals(this.pixelCoord, other.getPixelCoord())));
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
        if (getPixelCoord() != null) {
            for (int i=0;
                 i<java.lang.reflect.Array.getLength(getPixelCoord());
                 i++) {
                java.lang.Object obj = java.lang.reflect.Array.get(getPixelCoord(), i);
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
        new org.apache.axis.description.TypeDesc(ArrayOfPixelCoord.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ArrayOfPixelCoord"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("pixelCoord");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "PixelCoord"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "PixelCoord"));
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

