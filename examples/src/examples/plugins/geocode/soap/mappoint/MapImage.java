/**
 * MapImage.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.2.1 Jun 14, 2005 (09:15:57 EDT) WSDL2Java emitter.
 */

package examples.plugins.geocode.soap.mappoint;

public class MapImage  implements java.io.Serializable {
    private ArrayOfHotArea hotAreas;
    private MimeData mimeData;
    private MapViewRepresentations view;
    private java.lang.String url;

    public MapImage() {
    }

    public MapImage(
           ArrayOfHotArea hotAreas,
           MimeData mimeData,
           MapViewRepresentations view,
           java.lang.String url) {
           this.hotAreas = hotAreas;
           this.mimeData = mimeData;
           this.view = view;
           this.url = url;
    }


    /**
     * Gets the hotAreas value for this MapImage.
     * 
     * @return hotAreas
     */
    public ArrayOfHotArea getHotAreas() {
        return hotAreas;
    }


    /**
     * Sets the hotAreas value for this MapImage.
     * 
     * @param hotAreas
     */
    public void setHotAreas(ArrayOfHotArea hotAreas) {
        this.hotAreas = hotAreas;
    }


    /**
     * Gets the mimeData value for this MapImage.
     * 
     * @return mimeData
     */
    public MimeData getMimeData() {
        return mimeData;
    }


    /**
     * Sets the mimeData value for this MapImage.
     * 
     * @param mimeData
     */
    public void setMimeData(MimeData mimeData) {
        this.mimeData = mimeData;
    }


    /**
     * Gets the view value for this MapImage.
     * 
     * @return view
     */
    public MapViewRepresentations getView() {
        return view;
    }


    /**
     * Sets the view value for this MapImage.
     * 
     * @param view
     */
    public void setView(MapViewRepresentations view) {
        this.view = view;
    }


    /**
     * Gets the url value for this MapImage.
     * 
     * @return url
     */
    public java.lang.String getUrl() {
        return url;
    }


    /**
     * Sets the url value for this MapImage.
     * 
     * @param url
     */
    public void setUrl(java.lang.String url) {
        this.url = url;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof MapImage)) return false;
        MapImage other = (MapImage) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            ((this.hotAreas==null && other.getHotAreas()==null) || 
             (this.hotAreas!=null &&
              this.hotAreas.equals(other.getHotAreas()))) &&
            ((this.mimeData==null && other.getMimeData()==null) || 
             (this.mimeData!=null &&
              this.mimeData.equals(other.getMimeData()))) &&
            ((this.view==null && other.getView()==null) || 
             (this.view!=null &&
              this.view.equals(other.getView()))) &&
            ((this.url==null && other.getUrl()==null) || 
             (this.url!=null &&
              this.url.equals(other.getUrl())));
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
        if (getHotAreas() != null) {
            _hashCode += getHotAreas().hashCode();
        }
        if (getMimeData() != null) {
            _hashCode += getMimeData().hashCode();
        }
        if (getView() != null) {
            _hashCode += getView().hashCode();
        }
        if (getUrl() != null) {
            _hashCode += getUrl().hashCode();
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(MapImage.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "MapImage"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("hotAreas");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "HotAreas"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ArrayOfHotArea"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("mimeData");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "MimeData"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "MimeData"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("view");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "View"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "MapViewRepresentations"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("url");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "Url"));
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

