/**
 * HotArea.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.2.1 Jun 14, 2005 (09:15:57 EDT) WSDL2Java emitter.
 */

package examples.plugins.geocode.soap.mappoint;

public class HotArea  implements java.io.Serializable {
    private PixelRectangle iconRectangle;
    private PixelRectangle labelRectangle;
    private java.lang.String pinID;

    public HotArea() {
    }

    public HotArea(
           PixelRectangle iconRectangle,
           PixelRectangle labelRectangle,
           java.lang.String pinID) {
           this.iconRectangle = iconRectangle;
           this.labelRectangle = labelRectangle;
           this.pinID = pinID;
    }


    /**
     * Gets the iconRectangle value for this HotArea.
     * 
     * @return iconRectangle
     */
    public PixelRectangle getIconRectangle() {
        return iconRectangle;
    }


    /**
     * Sets the iconRectangle value for this HotArea.
     * 
     * @param iconRectangle
     */
    public void setIconRectangle(PixelRectangle iconRectangle) {
        this.iconRectangle = iconRectangle;
    }


    /**
     * Gets the labelRectangle value for this HotArea.
     * 
     * @return labelRectangle
     */
    public PixelRectangle getLabelRectangle() {
        return labelRectangle;
    }


    /**
     * Sets the labelRectangle value for this HotArea.
     * 
     * @param labelRectangle
     */
    public void setLabelRectangle(PixelRectangle labelRectangle) {
        this.labelRectangle = labelRectangle;
    }


    /**
     * Gets the pinID value for this HotArea.
     * 
     * @return pinID
     */
    public java.lang.String getPinID() {
        return pinID;
    }


    /**
     * Sets the pinID value for this HotArea.
     * 
     * @param pinID
     */
    public void setPinID(java.lang.String pinID) {
        this.pinID = pinID;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof HotArea)) return false;
        HotArea other = (HotArea) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            ((this.iconRectangle==null && other.getIconRectangle()==null) || 
             (this.iconRectangle!=null &&
              this.iconRectangle.equals(other.getIconRectangle()))) &&
            ((this.labelRectangle==null && other.getLabelRectangle()==null) || 
             (this.labelRectangle!=null &&
              this.labelRectangle.equals(other.getLabelRectangle()))) &&
            ((this.pinID==null && other.getPinID()==null) || 
             (this.pinID!=null &&
              this.pinID.equals(other.getPinID())));
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
        if (getIconRectangle() != null) {
            _hashCode += getIconRectangle().hashCode();
        }
        if (getLabelRectangle() != null) {
            _hashCode += getLabelRectangle().hashCode();
        }
        if (getPinID() != null) {
            _hashCode += getPinID().hashCode();
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(HotArea.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "HotArea"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("iconRectangle");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "IconRectangle"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "PixelRectangle"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("labelRectangle");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "LabelRectangle"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "PixelRectangle"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("pinID");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "PinID"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
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

