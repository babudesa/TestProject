/**
 * ArrayOfMapImage.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.2.1 Jun 14, 2005 (09:15:57 EDT) WSDL2Java emitter.
 */

package examples.plugins.geocode.soap.mappoint;

public class ArrayOfMapImage  implements java.io.Serializable {
    private MapImage[] mapImage;

    public ArrayOfMapImage() {
    }

    public ArrayOfMapImage(
           MapImage[] mapImage) {
           this.mapImage = mapImage;
    }


    /**
     * Gets the mapImage value for this ArrayOfMapImage.
     * 
     * @return mapImage
     */
    public MapImage[] getMapImage() {
        return mapImage;
    }


    /**
     * Sets the mapImage value for this ArrayOfMapImage.
     * 
     * @param mapImage
     */
    public void setMapImage(MapImage[] mapImage) {
        this.mapImage = mapImage;
    }

    public MapImage getMapImage(int i) {
        return this.mapImage[i];
    }

    public void setMapImage(int i, MapImage _value) {
        this.mapImage[i] = _value;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof ArrayOfMapImage)) return false;
        ArrayOfMapImage other = (ArrayOfMapImage) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            ((this.mapImage==null && other.getMapImage()==null) || 
             (this.mapImage!=null &&
              java.util.Arrays.equals(this.mapImage, other.getMapImage())));
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
        if (getMapImage() != null) {
            for (int i=0;
                 i<java.lang.reflect.Array.getLength(getMapImage());
                 i++) {
                java.lang.Object obj = java.lang.reflect.Array.get(getMapImage(), i);
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
        new org.apache.axis.description.TypeDesc(ArrayOfMapImage.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ArrayOfMapImage"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("mapImage");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "MapImage"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "MapImage"));
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

