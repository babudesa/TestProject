/**
 * MapOptions.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.2.1 Jun 14, 2005 (09:15:57 EDT) WSDL2Java emitter.
 */

package examples.plugins.geocode.soap.mappoint;

public class MapOptions  implements java.io.Serializable {
    private RouteHighlightColor routeHighlightColor;
    private RouteHighlightColor constructionDelayHighlightColor;
    private RouteHighlightColor constructionClosureHighlightColor;
    private MapFontSize fontSize;
    private ImageFormat format;
    private java.lang.Boolean isOverviewMap;
    private MapReturnType returnType;
    private double panHorizontal;
    private double panVertical;
    private MapStyle style;
    private java.lang.Double zoom;
    private java.lang.Boolean preventIconCollisions;

    public MapOptions() {
    }

    public MapOptions(
           RouteHighlightColor routeHighlightColor,
           RouteHighlightColor constructionDelayHighlightColor,
           RouteHighlightColor constructionClosureHighlightColor,
           MapFontSize fontSize,
           ImageFormat format,
           java.lang.Boolean isOverviewMap,
           MapReturnType returnType,
           double panHorizontal,
           double panVertical,
           MapStyle style,
           java.lang.Double zoom,
           java.lang.Boolean preventIconCollisions) {
           this.routeHighlightColor = routeHighlightColor;
           this.constructionDelayHighlightColor = constructionDelayHighlightColor;
           this.constructionClosureHighlightColor = constructionClosureHighlightColor;
           this.fontSize = fontSize;
           this.format = format;
           this.isOverviewMap = isOverviewMap;
           this.returnType = returnType;
           this.panHorizontal = panHorizontal;
           this.panVertical = panVertical;
           this.style = style;
           this.zoom = zoom;
           this.preventIconCollisions = preventIconCollisions;
    }


    /**
     * Gets the routeHighlightColor value for this MapOptions.
     * 
     * @return routeHighlightColor
     */
    public RouteHighlightColor getRouteHighlightColor() {
        return routeHighlightColor;
    }


    /**
     * Sets the routeHighlightColor value for this MapOptions.
     * 
     * @param routeHighlightColor
     */
    public void setRouteHighlightColor(RouteHighlightColor routeHighlightColor) {
        this.routeHighlightColor = routeHighlightColor;
    }


    /**
     * Gets the constructionDelayHighlightColor value for this MapOptions.
     * 
     * @return constructionDelayHighlightColor
     */
    public RouteHighlightColor getConstructionDelayHighlightColor() {
        return constructionDelayHighlightColor;
    }


    /**
     * Sets the constructionDelayHighlightColor value for this MapOptions.
     * 
     * @param constructionDelayHighlightColor
     */
    public void setConstructionDelayHighlightColor(RouteHighlightColor constructionDelayHighlightColor) {
        this.constructionDelayHighlightColor = constructionDelayHighlightColor;
    }


    /**
     * Gets the constructionClosureHighlightColor value for this MapOptions.
     * 
     * @return constructionClosureHighlightColor
     */
    public RouteHighlightColor getConstructionClosureHighlightColor() {
        return constructionClosureHighlightColor;
    }


    /**
     * Sets the constructionClosureHighlightColor value for this MapOptions.
     * 
     * @param constructionClosureHighlightColor
     */
    public void setConstructionClosureHighlightColor(RouteHighlightColor constructionClosureHighlightColor) {
        this.constructionClosureHighlightColor = constructionClosureHighlightColor;
    }


    /**
     * Gets the fontSize value for this MapOptions.
     * 
     * @return fontSize
     */
    public MapFontSize getFontSize() {
        return fontSize;
    }


    /**
     * Sets the fontSize value for this MapOptions.
     * 
     * @param fontSize
     */
    public void setFontSize(MapFontSize fontSize) {
        this.fontSize = fontSize;
    }


    /**
     * Gets the format value for this MapOptions.
     * 
     * @return format
     */
    public ImageFormat getFormat() {
        return format;
    }


    /**
     * Sets the format value for this MapOptions.
     * 
     * @param format
     */
    public void setFormat(ImageFormat format) {
        this.format = format;
    }


    /**
     * Gets the isOverviewMap value for this MapOptions.
     * 
     * @return isOverviewMap
     */
    public java.lang.Boolean getIsOverviewMap() {
        return isOverviewMap;
    }


    /**
     * Sets the isOverviewMap value for this MapOptions.
     * 
     * @param isOverviewMap
     */
    public void setIsOverviewMap(java.lang.Boolean isOverviewMap) {
        this.isOverviewMap = isOverviewMap;
    }


    /**
     * Gets the returnType value for this MapOptions.
     * 
     * @return returnType
     */
    public MapReturnType getReturnType() {
        return returnType;
    }


    /**
     * Sets the returnType value for this MapOptions.
     * 
     * @param returnType
     */
    public void setReturnType(MapReturnType returnType) {
        this.returnType = returnType;
    }


    /**
     * Gets the panHorizontal value for this MapOptions.
     * 
     * @return panHorizontal
     */
    public double getPanHorizontal() {
        return panHorizontal;
    }


    /**
     * Sets the panHorizontal value for this MapOptions.
     * 
     * @param panHorizontal
     */
    public void setPanHorizontal(double panHorizontal) {
        this.panHorizontal = panHorizontal;
    }


    /**
     * Gets the panVertical value for this MapOptions.
     * 
     * @return panVertical
     */
    public double getPanVertical() {
        return panVertical;
    }


    /**
     * Sets the panVertical value for this MapOptions.
     * 
     * @param panVertical
     */
    public void setPanVertical(double panVertical) {
        this.panVertical = panVertical;
    }


    /**
     * Gets the style value for this MapOptions.
     * 
     * @return style
     */
    public MapStyle getStyle() {
        return style;
    }


    /**
     * Sets the style value for this MapOptions.
     * 
     * @param style
     */
    public void setStyle(MapStyle style) {
        this.style = style;
    }


    /**
     * Gets the zoom value for this MapOptions.
     * 
     * @return zoom
     */
    public java.lang.Double getZoom() {
        return zoom;
    }


    /**
     * Sets the zoom value for this MapOptions.
     * 
     * @param zoom
     */
    public void setZoom(java.lang.Double zoom) {
        this.zoom = zoom;
    }


    /**
     * Gets the preventIconCollisions value for this MapOptions.
     * 
     * @return preventIconCollisions
     */
    public java.lang.Boolean getPreventIconCollisions() {
        return preventIconCollisions;
    }


    /**
     * Sets the preventIconCollisions value for this MapOptions.
     * 
     * @param preventIconCollisions
     */
    public void setPreventIconCollisions(java.lang.Boolean preventIconCollisions) {
        this.preventIconCollisions = preventIconCollisions;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof MapOptions)) return false;
        MapOptions other = (MapOptions) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            ((this.routeHighlightColor==null && other.getRouteHighlightColor()==null) || 
             (this.routeHighlightColor!=null &&
              this.routeHighlightColor.equals(other.getRouteHighlightColor()))) &&
            ((this.constructionDelayHighlightColor==null && other.getConstructionDelayHighlightColor()==null) || 
             (this.constructionDelayHighlightColor!=null &&
              this.constructionDelayHighlightColor.equals(other.getConstructionDelayHighlightColor()))) &&
            ((this.constructionClosureHighlightColor==null && other.getConstructionClosureHighlightColor()==null) || 
             (this.constructionClosureHighlightColor!=null &&
              this.constructionClosureHighlightColor.equals(other.getConstructionClosureHighlightColor()))) &&
            ((this.fontSize==null && other.getFontSize()==null) || 
             (this.fontSize!=null &&
              this.fontSize.equals(other.getFontSize()))) &&
            ((this.format==null && other.getFormat()==null) || 
             (this.format!=null &&
              this.format.equals(other.getFormat()))) &&
            ((this.isOverviewMap==null && other.getIsOverviewMap()==null) || 
             (this.isOverviewMap!=null &&
              this.isOverviewMap.equals(other.getIsOverviewMap()))) &&
            ((this.returnType==null && other.getReturnType()==null) || 
             (this.returnType!=null &&
              this.returnType.equals(other.getReturnType()))) &&
            this.panHorizontal == other.getPanHorizontal() &&
            this.panVertical == other.getPanVertical() &&
            ((this.style==null && other.getStyle()==null) || 
             (this.style!=null &&
              this.style.equals(other.getStyle()))) &&
            ((this.zoom==null && other.getZoom()==null) || 
             (this.zoom!=null &&
              this.zoom.equals(other.getZoom()))) &&
            ((this.preventIconCollisions==null && other.getPreventIconCollisions()==null) || 
             (this.preventIconCollisions!=null &&
              this.preventIconCollisions.equals(other.getPreventIconCollisions())));
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
        if (getRouteHighlightColor() != null) {
            _hashCode += getRouteHighlightColor().hashCode();
        }
        if (getConstructionDelayHighlightColor() != null) {
            _hashCode += getConstructionDelayHighlightColor().hashCode();
        }
        if (getConstructionClosureHighlightColor() != null) {
            _hashCode += getConstructionClosureHighlightColor().hashCode();
        }
        if (getFontSize() != null) {
            _hashCode += getFontSize().hashCode();
        }
        if (getFormat() != null) {
            _hashCode += getFormat().hashCode();
        }
        if (getIsOverviewMap() != null) {
            _hashCode += getIsOverviewMap().hashCode();
        }
        if (getReturnType() != null) {
            _hashCode += getReturnType().hashCode();
        }
        _hashCode += new Double(getPanHorizontal()).hashCode();
        _hashCode += new Double(getPanVertical()).hashCode();
        if (getStyle() != null) {
            _hashCode += getStyle().hashCode();
        }
        if (getZoom() != null) {
            _hashCode += getZoom().hashCode();
        }
        if (getPreventIconCollisions() != null) {
            _hashCode += getPreventIconCollisions().hashCode();
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(MapOptions.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "MapOptions"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("routeHighlightColor");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "RouteHighlightColor"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "RouteHighlightColor"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("constructionDelayHighlightColor");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ConstructionDelayHighlightColor"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "RouteHighlightColor"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("constructionClosureHighlightColor");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ConstructionClosureHighlightColor"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "RouteHighlightColor"));
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
        elemField.setFieldName("format");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "Format"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ImageFormat"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("isOverviewMap");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "IsOverviewMap"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "boolean"));
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
        elemField.setFieldName("panHorizontal");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "PanHorizontal"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "double"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("panVertical");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "PanVertical"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "double"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("style");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "Style"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "MapStyle"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("zoom");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "Zoom"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "double"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("preventIconCollisions");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "PreventIconCollisions"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "boolean"));
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

