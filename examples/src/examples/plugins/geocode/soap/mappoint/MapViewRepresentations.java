/**
 * MapViewRepresentations.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.2.1 Jun 14, 2005 (09:15:57 EDT) WSDL2Java emitter.
 */

package examples.plugins.geocode.soap.mappoint;

public class MapViewRepresentations  implements java.io.Serializable {
    private ViewByScale byScale;
    private ViewByHeightWidth byHeightWidth;
    private ViewByBoundingRectangle byBoundingRectangle;

    public MapViewRepresentations() {
    }

    public MapViewRepresentations(
           ViewByScale byScale,
           ViewByHeightWidth byHeightWidth,
           ViewByBoundingRectangle byBoundingRectangle) {
           this.byScale = byScale;
           this.byHeightWidth = byHeightWidth;
           this.byBoundingRectangle = byBoundingRectangle;
    }


    /**
     * Gets the byScale value for this MapViewRepresentations.
     * 
     * @return byScale
     */
    public ViewByScale getByScale() {
        return byScale;
    }


    /**
     * Sets the byScale value for this MapViewRepresentations.
     * 
     * @param byScale
     */
    public void setByScale(ViewByScale byScale) {
        this.byScale = byScale;
    }


    /**
     * Gets the byHeightWidth value for this MapViewRepresentations.
     * 
     * @return byHeightWidth
     */
    public ViewByHeightWidth getByHeightWidth() {
        return byHeightWidth;
    }


    /**
     * Sets the byHeightWidth value for this MapViewRepresentations.
     * 
     * @param byHeightWidth
     */
    public void setByHeightWidth(ViewByHeightWidth byHeightWidth) {
        this.byHeightWidth = byHeightWidth;
    }


    /**
     * Gets the byBoundingRectangle value for this MapViewRepresentations.
     * 
     * @return byBoundingRectangle
     */
    public ViewByBoundingRectangle getByBoundingRectangle() {
        return byBoundingRectangle;
    }


    /**
     * Sets the byBoundingRectangle value for this MapViewRepresentations.
     * 
     * @param byBoundingRectangle
     */
    public void setByBoundingRectangle(ViewByBoundingRectangle byBoundingRectangle) {
        this.byBoundingRectangle = byBoundingRectangle;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof MapViewRepresentations)) return false;
        MapViewRepresentations other = (MapViewRepresentations) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            ((this.byScale==null && other.getByScale()==null) || 
             (this.byScale!=null &&
              this.byScale.equals(other.getByScale()))) &&
            ((this.byHeightWidth==null && other.getByHeightWidth()==null) || 
             (this.byHeightWidth!=null &&
              this.byHeightWidth.equals(other.getByHeightWidth()))) &&
            ((this.byBoundingRectangle==null && other.getByBoundingRectangle()==null) || 
             (this.byBoundingRectangle!=null &&
              this.byBoundingRectangle.equals(other.getByBoundingRectangle())));
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
        if (getByScale() != null) {
            _hashCode += getByScale().hashCode();
        }
        if (getByHeightWidth() != null) {
            _hashCode += getByHeightWidth().hashCode();
        }
        if (getByBoundingRectangle() != null) {
            _hashCode += getByBoundingRectangle().hashCode();
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(MapViewRepresentations.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "MapViewRepresentations"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("byScale");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ByScale"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ViewByScale"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("byHeightWidth");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ByHeightWidth"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ViewByHeightWidth"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("byBoundingRectangle");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ByBoundingRectangle"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ViewByBoundingRectangle"));
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

