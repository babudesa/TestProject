/**
 * LineDriveMapOptions.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.2.1 Jun 14, 2005 (09:15:57 EDT) WSDL2Java emitter.
 */

package examples.plugins.geocode.soap.mappoint;

public class LineDriveMapOptions  implements java.io.Serializable {
    private ImageFormat format;
    private MapReturnType returnType;
    private MapFontSize fontSize;
    private PaletteType paletteType;
    private java.lang.String destinationIconDataSource;
    private java.lang.String destinationIconName;

    public LineDriveMapOptions() {
    }

    public LineDriveMapOptions(
           ImageFormat format,
           MapReturnType returnType,
           MapFontSize fontSize,
           PaletteType paletteType,
           java.lang.String destinationIconDataSource,
           java.lang.String destinationIconName) {
           this.format = format;
           this.returnType = returnType;
           this.fontSize = fontSize;
           this.paletteType = paletteType;
           this.destinationIconDataSource = destinationIconDataSource;
           this.destinationIconName = destinationIconName;
    }


    /**
     * Gets the format value for this LineDriveMapOptions.
     * 
     * @return format
     */
    public ImageFormat getFormat() {
        return format;
    }


    /**
     * Sets the format value for this LineDriveMapOptions.
     * 
     * @param format
     */
    public void setFormat(ImageFormat format) {
        this.format = format;
    }


    /**
     * Gets the returnType value for this LineDriveMapOptions.
     * 
     * @return returnType
     */
    public MapReturnType getReturnType() {
        return returnType;
    }


    /**
     * Sets the returnType value for this LineDriveMapOptions.
     * 
     * @param returnType
     */
    public void setReturnType(MapReturnType returnType) {
        this.returnType = returnType;
    }


    /**
     * Gets the fontSize value for this LineDriveMapOptions.
     * 
     * @return fontSize
     */
    public MapFontSize getFontSize() {
        return fontSize;
    }


    /**
     * Sets the fontSize value for this LineDriveMapOptions.
     * 
     * @param fontSize
     */
    public void setFontSize(MapFontSize fontSize) {
        this.fontSize = fontSize;
    }


    /**
     * Gets the paletteType value for this LineDriveMapOptions.
     * 
     * @return paletteType
     */
    public PaletteType getPaletteType() {
        return paletteType;
    }


    /**
     * Sets the paletteType value for this LineDriveMapOptions.
     * 
     * @param paletteType
     */
    public void setPaletteType(PaletteType paletteType) {
        this.paletteType = paletteType;
    }


    /**
     * Gets the destinationIconDataSource value for this LineDriveMapOptions.
     * 
     * @return destinationIconDataSource
     */
    public java.lang.String getDestinationIconDataSource() {
        return destinationIconDataSource;
    }


    /**
     * Sets the destinationIconDataSource value for this LineDriveMapOptions.
     * 
     * @param destinationIconDataSource
     */
    public void setDestinationIconDataSource(java.lang.String destinationIconDataSource) {
        this.destinationIconDataSource = destinationIconDataSource;
    }


    /**
     * Gets the destinationIconName value for this LineDriveMapOptions.
     * 
     * @return destinationIconName
     */
    public java.lang.String getDestinationIconName() {
        return destinationIconName;
    }


    /**
     * Sets the destinationIconName value for this LineDriveMapOptions.
     * 
     * @param destinationIconName
     */
    public void setDestinationIconName(java.lang.String destinationIconName) {
        this.destinationIconName = destinationIconName;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof LineDriveMapOptions)) return false;
        LineDriveMapOptions other = (LineDriveMapOptions) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            ((this.format==null && other.getFormat()==null) || 
             (this.format!=null &&
              this.format.equals(other.getFormat()))) &&
            ((this.returnType==null && other.getReturnType()==null) || 
             (this.returnType!=null &&
              this.returnType.equals(other.getReturnType()))) &&
            ((this.fontSize==null && other.getFontSize()==null) || 
             (this.fontSize!=null &&
              this.fontSize.equals(other.getFontSize()))) &&
            ((this.paletteType==null && other.getPaletteType()==null) || 
             (this.paletteType!=null &&
              this.paletteType.equals(other.getPaletteType()))) &&
            ((this.destinationIconDataSource==null && other.getDestinationIconDataSource()==null) || 
             (this.destinationIconDataSource!=null &&
              this.destinationIconDataSource.equals(other.getDestinationIconDataSource()))) &&
            ((this.destinationIconName==null && other.getDestinationIconName()==null) || 
             (this.destinationIconName!=null &&
              this.destinationIconName.equals(other.getDestinationIconName())));
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
        if (getFormat() != null) {
            _hashCode += getFormat().hashCode();
        }
        if (getReturnType() != null) {
            _hashCode += getReturnType().hashCode();
        }
        if (getFontSize() != null) {
            _hashCode += getFontSize().hashCode();
        }
        if (getPaletteType() != null) {
            _hashCode += getPaletteType().hashCode();
        }
        if (getDestinationIconDataSource() != null) {
            _hashCode += getDestinationIconDataSource().hashCode();
        }
        if (getDestinationIconName() != null) {
            _hashCode += getDestinationIconName().hashCode();
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(LineDriveMapOptions.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "LineDriveMapOptions"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("format");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "Format"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ImageFormat"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("returnType");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ReturnType"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "MapReturnType"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("fontSize");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "FontSize"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "MapFontSize"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("paletteType");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "PaletteType"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "PaletteType"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("destinationIconDataSource");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "DestinationIconDataSource"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("destinationIconName");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "DestinationIconName"));
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

