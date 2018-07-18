/**
 * LatLongRectangle.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.2.1 Jun 14, 2005 (09:15:57 EDT) WSDL2Java emitter.
 */

package examples.plugins.geocode.soap.mappoint;

public class LatLongRectangle  implements java.io.Serializable {
    private LatLong southwest;
    private LatLong northeast;

    public LatLongRectangle() {
    }

    public LatLongRectangle(
           LatLong southwest,
           LatLong northeast) {
           this.southwest = southwest;
           this.northeast = northeast;
    }


    /**
     * Gets the southwest value for this LatLongRectangle.
     * 
     * @return southwest
     */
    public LatLong getSouthwest() {
        return southwest;
    }


    /**
     * Sets the southwest value for this LatLongRectangle.
     * 
     * @param southwest
     */
    public void setSouthwest(LatLong southwest) {
        this.southwest = southwest;
    }


    /**
     * Gets the northeast value for this LatLongRectangle.
     * 
     * @return northeast
     */
    public LatLong getNortheast() {
        return northeast;
    }


    /**
     * Sets the northeast value for this LatLongRectangle.
     * 
     * @param northeast
     */
    public void setNortheast(LatLong northeast) {
        this.northeast = northeast;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof LatLongRectangle)) return false;
        LatLongRectangle other = (LatLongRectangle) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            ((this.southwest==null && other.getSouthwest()==null) || 
             (this.southwest!=null &&
              this.southwest.equals(other.getSouthwest()))) &&
            ((this.northeast==null && other.getNortheast()==null) || 
             (this.northeast!=null &&
              this.northeast.equals(other.getNortheast())));
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
        if (getSouthwest() != null) {
            _hashCode += getSouthwest().hashCode();
        }
        if (getNortheast() != null) {
            _hashCode += getNortheast().hashCode();
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(LatLongRectangle.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "LatLongRectangle"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("southwest");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "Southwest"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "LatLong"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("northeast");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "Northeast"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "LatLong"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
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

