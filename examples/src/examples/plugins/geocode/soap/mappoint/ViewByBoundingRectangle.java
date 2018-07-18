/**
 * ViewByBoundingRectangle.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.2.1 Jun 14, 2005 (09:15:57 EDT) WSDL2Java emitter.
 */

package examples.plugins.geocode.soap.mappoint;

public class ViewByBoundingRectangle  extends MapView  implements java.io.Serializable {
    private LatLongRectangle boundingRectangle;

    public ViewByBoundingRectangle() {
    }

    public ViewByBoundingRectangle(
           LatLongRectangle boundingRectangle) {
           this.boundingRectangle = boundingRectangle;
    }


    /**
     * Gets the boundingRectangle value for this ViewByBoundingRectangle.
     * 
     * @return boundingRectangle
     */
    public LatLongRectangle getBoundingRectangle() {
        return boundingRectangle;
    }


    /**
     * Sets the boundingRectangle value for this ViewByBoundingRectangle.
     * 
     * @param boundingRectangle
     */
    public void setBoundingRectangle(LatLongRectangle boundingRectangle) {
        this.boundingRectangle = boundingRectangle;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof ViewByBoundingRectangle)) return false;
        ViewByBoundingRectangle other = (ViewByBoundingRectangle) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = super.equals(obj) && 
            ((this.boundingRectangle==null && other.getBoundingRectangle()==null) || 
             (this.boundingRectangle!=null &&
              this.boundingRectangle.equals(other.getBoundingRectangle())));
        __equalsCalc = null;
        return _equals;
    }

    private boolean __hashCodeCalc = false;
    public synchronized int hashCode() {
        if (__hashCodeCalc) {
            return 0;
        }
        __hashCodeCalc = true;
        int _hashCode = super.hashCode();
        if (getBoundingRectangle() != null) {
            _hashCode += getBoundingRectangle().hashCode();
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(ViewByBoundingRectangle.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ViewByBoundingRectangle"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("boundingRectangle");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "BoundingRectangle"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "LatLongRectangle"));
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

