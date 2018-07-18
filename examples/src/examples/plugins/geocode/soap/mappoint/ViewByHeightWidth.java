/**
 * ViewByHeightWidth.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.2.1 Jun 14, 2005 (09:15:57 EDT) WSDL2Java emitter.
 */

package examples.plugins.geocode.soap.mappoint;

public class ViewByHeightWidth  extends MapView  implements java.io.Serializable {
    private java.lang.Double height;
    private java.lang.Double width;
    private LatLong centerPoint;

    public ViewByHeightWidth() {
    }

    public ViewByHeightWidth(
           java.lang.Double height,
           java.lang.Double width,
           LatLong centerPoint) {
           this.height = height;
           this.width = width;
           this.centerPoint = centerPoint;
    }


    /**
     * Gets the height value for this ViewByHeightWidth.
     * 
     * @return height
     */
    public java.lang.Double getHeight() {
        return height;
    }


    /**
     * Sets the height value for this ViewByHeightWidth.
     * 
     * @param height
     */
    public void setHeight(java.lang.Double height) {
        this.height = height;
    }


    /**
     * Gets the width value for this ViewByHeightWidth.
     * 
     * @return width
     */
    public java.lang.Double getWidth() {
        return width;
    }


    /**
     * Sets the width value for this ViewByHeightWidth.
     * 
     * @param width
     */
    public void setWidth(java.lang.Double width) {
        this.width = width;
    }


    /**
     * Gets the centerPoint value for this ViewByHeightWidth.
     * 
     * @return centerPoint
     */
    public LatLong getCenterPoint() {
        return centerPoint;
    }


    /**
     * Sets the centerPoint value for this ViewByHeightWidth.
     * 
     * @param centerPoint
     */
    public void setCenterPoint(LatLong centerPoint) {
        this.centerPoint = centerPoint;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof ViewByHeightWidth)) return false;
        ViewByHeightWidth other = (ViewByHeightWidth) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = super.equals(obj) && 
            ((this.height==null && other.getHeight()==null) || 
             (this.height!=null &&
              this.height.equals(other.getHeight()))) &&
            ((this.width==null && other.getWidth()==null) || 
             (this.width!=null &&
              this.width.equals(other.getWidth()))) &&
            ((this.centerPoint==null && other.getCenterPoint()==null) || 
             (this.centerPoint!=null &&
              this.centerPoint.equals(other.getCenterPoint())));
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
        if (getHeight() != null) {
            _hashCode += getHeight().hashCode();
        }
        if (getWidth() != null) {
            _hashCode += getWidth().hashCode();
        }
        if (getCenterPoint() != null) {
            _hashCode += getCenterPoint().hashCode();
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(ViewByHeightWidth.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ViewByHeightWidth"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("height");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "Height"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "double"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("width");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "Width"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "double"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("centerPoint");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "CenterPoint"));
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

