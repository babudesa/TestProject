/**
 * Pushpin.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.2.1 Jun 14, 2005 (09:15:57 EDT) WSDL2Java emitter.
 */

package examples.plugins.geocode.soap.mappoint;

public class Pushpin  implements java.io.Serializable {
    private java.lang.String iconDataSource;
    private java.lang.String iconName;
    private java.lang.String label;
    private LatLong latLong;
    private java.lang.String pinID;
    private PixelCoord pixel;
    private boolean returnsHotArea;
    private boolean labelNearbyRoads;

    public Pushpin() {
    }

    public Pushpin(
           java.lang.String iconDataSource,
           java.lang.String iconName,
           java.lang.String label,
           LatLong latLong,
           java.lang.String pinID,
           PixelCoord pixel,
           boolean returnsHotArea,
           boolean labelNearbyRoads) {
           this.iconDataSource = iconDataSource;
           this.iconName = iconName;
           this.label = label;
           this.latLong = latLong;
           this.pinID = pinID;
           this.pixel = pixel;
           this.returnsHotArea = returnsHotArea;
           this.labelNearbyRoads = labelNearbyRoads;
    }


    /**
     * Gets the iconDataSource value for this Pushpin.
     * 
     * @return iconDataSource
     */
    public java.lang.String getIconDataSource() {
        return iconDataSource;
    }


    /**
     * Sets the iconDataSource value for this Pushpin.
     * 
     * @param iconDataSource
     */
    public void setIconDataSource(java.lang.String iconDataSource) {
        this.iconDataSource = iconDataSource;
    }


    /**
     * Gets the iconName value for this Pushpin.
     * 
     * @return iconName
     */
    public java.lang.String getIconName() {
        return iconName;
    }


    /**
     * Sets the iconName value for this Pushpin.
     * 
     * @param iconName
     */
    public void setIconName(java.lang.String iconName) {
        this.iconName = iconName;
    }


    /**
     * Gets the label value for this Pushpin.
     * 
     * @return label
     */
    public java.lang.String getLabel() {
        return label;
    }


    /**
     * Sets the label value for this Pushpin.
     * 
     * @param label
     */
    public void setLabel(java.lang.String label) {
        this.label = label;
    }


    /**
     * Gets the latLong value for this Pushpin.
     * 
     * @return latLong
     */
    public LatLong getLatLong() {
        return latLong;
    }


    /**
     * Sets the latLong value for this Pushpin.
     * 
     * @param latLong
     */
    public void setLatLong(LatLong latLong) {
        this.latLong = latLong;
    }


    /**
     * Gets the pinID value for this Pushpin.
     * 
     * @return pinID
     */
    public java.lang.String getPinID() {
        return pinID;
    }


    /**
     * Sets the pinID value for this Pushpin.
     * 
     * @param pinID
     */
    public void setPinID(java.lang.String pinID) {
        this.pinID = pinID;
    }


    /**
     * Gets the pixel value for this Pushpin.
     * 
     * @return pixel
     */
    public PixelCoord getPixel() {
        return pixel;
    }


    /**
     * Sets the pixel value for this Pushpin.
     * 
     * @param pixel
     */
    public void setPixel(PixelCoord pixel) {
        this.pixel = pixel;
    }


    /**
     * Gets the returnsHotArea value for this Pushpin.
     * 
     * @return returnsHotArea
     */
    public boolean isReturnsHotArea() {
        return returnsHotArea;
    }


    /**
     * Sets the returnsHotArea value for this Pushpin.
     * 
     * @param returnsHotArea
     */
    public void setReturnsHotArea(boolean returnsHotArea) {
        this.returnsHotArea = returnsHotArea;
    }


    /**
     * Gets the labelNearbyRoads value for this Pushpin.
     * 
     * @return labelNearbyRoads
     */
    public boolean isLabelNearbyRoads() {
        return labelNearbyRoads;
    }


    /**
     * Sets the labelNearbyRoads value for this Pushpin.
     * 
     * @param labelNearbyRoads
     */
    public void setLabelNearbyRoads(boolean labelNearbyRoads) {
        this.labelNearbyRoads = labelNearbyRoads;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof Pushpin)) return false;
        Pushpin other = (Pushpin) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            ((this.iconDataSource==null && other.getIconDataSource()==null) || 
             (this.iconDataSource!=null &&
              this.iconDataSource.equals(other.getIconDataSource()))) &&
            ((this.iconName==null && other.getIconName()==null) || 
             (this.iconName!=null &&
              this.iconName.equals(other.getIconName()))) &&
            ((this.label==null && other.getLabel()==null) || 
             (this.label!=null &&
              this.label.equals(other.getLabel()))) &&
            ((this.latLong==null && other.getLatLong()==null) || 
             (this.latLong!=null &&
              this.latLong.equals(other.getLatLong()))) &&
            ((this.pinID==null && other.getPinID()==null) || 
             (this.pinID!=null &&
              this.pinID.equals(other.getPinID()))) &&
            ((this.pixel==null && other.getPixel()==null) || 
             (this.pixel!=null &&
              this.pixel.equals(other.getPixel()))) &&
            this.returnsHotArea == other.isReturnsHotArea() &&
            this.labelNearbyRoads == other.isLabelNearbyRoads();
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
        if (getIconDataSource() != null) {
            _hashCode += getIconDataSource().hashCode();
        }
        if (getIconName() != null) {
            _hashCode += getIconName().hashCode();
        }
        if (getLabel() != null) {
            _hashCode += getLabel().hashCode();
        }
        if (getLatLong() != null) {
            _hashCode += getLatLong().hashCode();
        }
        if (getPinID() != null) {
            _hashCode += getPinID().hashCode();
        }
        if (getPixel() != null) {
            _hashCode += getPixel().hashCode();
        }
        _hashCode += (isReturnsHotArea() ? Boolean.TRUE : Boolean.FALSE).hashCode();
        _hashCode += (isLabelNearbyRoads() ? Boolean.TRUE : Boolean.FALSE).hashCode();
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(Pushpin.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "Pushpin"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("iconDataSource");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "IconDataSource"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("iconName");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "IconName"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("label");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "Label"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("latLong");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "LatLong"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "LatLong"));
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
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("pixel");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "Pixel"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "PixelCoord"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("returnsHotArea");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ReturnsHotArea"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "boolean"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("labelNearbyRoads");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "LabelNearbyRoads"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "boolean"));
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

