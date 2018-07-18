/**
 * ArrayOfHotArea.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.2.1 Jun 14, 2005 (09:15:57 EDT) WSDL2Java emitter.
 */

package examples.plugins.geocode.soap.mappoint;

public class ArrayOfHotArea  implements java.io.Serializable {
    private HotArea[] hotArea;

    public ArrayOfHotArea() {
    }

    public ArrayOfHotArea(
           HotArea[] hotArea) {
           this.hotArea = hotArea;
    }


    /**
     * Gets the hotArea value for this ArrayOfHotArea.
     * 
     * @return hotArea
     */
    public HotArea[] getHotArea() {
        return hotArea;
    }


    /**
     * Sets the hotArea value for this ArrayOfHotArea.
     * 
     * @param hotArea
     */
    public void setHotArea(HotArea[] hotArea) {
        this.hotArea = hotArea;
    }

    public HotArea getHotArea(int i) {
        return this.hotArea[i];
    }

    public void setHotArea(int i, HotArea _value) {
        this.hotArea[i] = _value;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof ArrayOfHotArea)) return false;
        ArrayOfHotArea other = (ArrayOfHotArea) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            ((this.hotArea==null && other.getHotArea()==null) || 
             (this.hotArea!=null &&
              java.util.Arrays.equals(this.hotArea, other.getHotArea())));
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
        if (getHotArea() != null) {
            for (int i=0;
                 i<java.lang.reflect.Array.getLength(getHotArea());
                 i++) {
                java.lang.Object obj = java.lang.reflect.Array.get(getHotArea(), i);
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
        new org.apache.axis.description.TypeDesc(ArrayOfHotArea.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ArrayOfHotArea"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("hotArea");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "HotArea"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "HotArea"));
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
