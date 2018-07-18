/**
 * ViewByScale.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.2.1 Jun 14, 2005 (09:15:57 EDT) WSDL2Java emitter.
 */

package examples.plugins.geocode.soap.mappoint;

public class ViewByScale  extends MapView  implements java.io.Serializable {
    private java.lang.Double mapScale;
    private LatLong centerPoint;

    public ViewByScale() {
    }

    public ViewByScale(
           java.lang.Double mapScale,
           LatLong centerPoint) {
           this.mapScale = mapScale;
           this.centerPoint = centerPoint;
    }


    /**
     * Gets the mapScale value for this ViewByScale.
     * 
     * @return mapScale
     */
    public java.lang.Double getMapScale() {
        return mapScale;
    }


    /**
     * Sets the mapScale value for this ViewByScale.
     * 
     * @param mapScale
     */
    public void setMapScale(java.lang.Double mapScale) {
        this.mapScale = mapScale;
    }


    /**
     * Gets the centerPoint value for this ViewByScale.
     * 
     * @return centerPoint
     */
    public LatLong getCenterPoint() {
        return centerPoint;
    }


    /**
     * Sets the centerPoint value for this ViewByScale.
     * 
     * @param centerPoint
     */
    public void setCenterPoint(LatLong centerPoint) {
        this.centerPoint = centerPoint;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof ViewByScale)) return false;
        ViewByScale other = (ViewByScale) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = super.equals(obj) && 
            ((this.mapScale==null && other.getMapScale()==null) || 
             (this.mapScale!=null &&
              this.mapScale.equals(other.getMapScale()))) &&
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
        if (getMapScale() != null) {
            _hashCode += getMapScale().hashCode();
        }
        if (getCenterPoint() != null) {
            _hashCode += getCenterPoint().hashCode();
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(ViewByScale.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ViewByScale"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("mapScale");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "MapScale"));
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

