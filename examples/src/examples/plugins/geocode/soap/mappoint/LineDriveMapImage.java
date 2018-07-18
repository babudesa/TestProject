/**
 * LineDriveMapImage.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.2.1 Jun 14, 2005 (09:15:57 EDT) WSDL2Java emitter.
 */

package examples.plugins.geocode.soap.mappoint;

public class LineDriveMapImage  implements java.io.Serializable {
    private MimeData mimeData;
    private java.lang.String url;
    private MapViewRepresentations view;
    private int firstDirectionID;
    private int lastDirectionID;

    public LineDriveMapImage() {
    }

    public LineDriveMapImage(
           MimeData mimeData,
           java.lang.String url,
           MapViewRepresentations view,
           int firstDirectionID,
           int lastDirectionID) {
           this.mimeData = mimeData;
           this.url = url;
           this.view = view;
           this.firstDirectionID = firstDirectionID;
           this.lastDirectionID = lastDirectionID;
    }


    /**
     * Gets the mimeData value for this LineDriveMapImage.
     * 
     * @return mimeData
     */
    public MimeData getMimeData() {
        return mimeData;
    }


    /**
     * Sets the mimeData value for this LineDriveMapImage.
     * 
     * @param mimeData
     */
    public void setMimeData(MimeData mimeData) {
        this.mimeData = mimeData;
    }


    /**
     * Gets the url value for this LineDriveMapImage.
     * 
     * @return url
     */
    public java.lang.String getUrl() {
        return url;
    }


    /**
     * Sets the url value for this LineDriveMapImage.
     * 
     * @param url
     */
    public void setUrl(java.lang.String url) {
        this.url = url;
    }


    /**
     * Gets the view value for this LineDriveMapImage.
     * 
     * @return view
     */
    public MapViewRepresentations getView() {
        return view;
    }


    /**
     * Sets the view value for this LineDriveMapImage.
     * 
     * @param view
     */
    public void setView(MapViewRepresentations view) {
        this.view = view;
    }


    /**
     * Gets the firstDirectionID value for this LineDriveMapImage.
     * 
     * @return firstDirectionID
     */
    public int getFirstDirectionID() {
        return firstDirectionID;
    }


    /**
     * Sets the firstDirectionID value for this LineDriveMapImage.
     * 
     * @param firstDirectionID
     */
    public void setFirstDirectionID(int firstDirectionID) {
        this.firstDirectionID = firstDirectionID;
    }


    /**
     * Gets the lastDirectionID value for this LineDriveMapImage.
     * 
     * @return lastDirectionID
     */
    public int getLastDirectionID() {
        return lastDirectionID;
    }


    /**
     * Sets the lastDirectionID value for this LineDriveMapImage.
     * 
     * @param lastDirectionID
     */
    public void setLastDirectionID(int lastDirectionID) {
        this.lastDirectionID = lastDirectionID;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof LineDriveMapImage)) return false;
        LineDriveMapImage other = (LineDriveMapImage) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            ((this.mimeData==null && other.getMimeData()==null) || 
             (this.mimeData!=null &&
              this.mimeData.equals(other.getMimeData()))) &&
            ((this.url==null && other.getUrl()==null) || 
             (this.url!=null &&
              this.url.equals(other.getUrl()))) &&
            ((this.view==null && other.getView()==null) || 
             (this.view!=null &&
              this.view.equals(other.getView()))) &&
            this.firstDirectionID == other.getFirstDirectionID() &&
            this.lastDirectionID == other.getLastDirectionID();
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
        if (getMimeData() != null) {
            _hashCode += getMimeData().hashCode();
        }
        if (getUrl() != null) {
            _hashCode += getUrl().hashCode();
        }
        if (getView() != null) {
            _hashCode += getView().hashCode();
        }
        _hashCode += getFirstDirectionID();
        _hashCode += getLastDirectionID();
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(LineDriveMapImage.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "LineDriveMapImage"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("mimeData");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "MimeData"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "MimeData"));
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
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("view");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "View"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "MapViewRepresentations"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("firstDirectionID");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "FirstDirectionID"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("lastDirectionID");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "LastDirectionID"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
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

