/**
 * SegmentOptions.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.2.1 Jun 14, 2005 (09:15:57 EDT) WSDL2Java emitter.
 */

package examples.plugins.geocode.soap.mappoint;

public class SegmentOptions  implements java.io.Serializable {
    private SegmentPreference preference;
    private java.lang.Boolean calculateSegmentMapView;
    private java.lang.Boolean calculateDirectionMapView;

    public SegmentOptions() {
    }

    public SegmentOptions(
           SegmentPreference preference,
           java.lang.Boolean calculateSegmentMapView,
           java.lang.Boolean calculateDirectionMapView) {
           this.preference = preference;
           this.calculateSegmentMapView = calculateSegmentMapView;
           this.calculateDirectionMapView = calculateDirectionMapView;
    }


    /**
     * Gets the preference value for this SegmentOptions.
     * 
     * @return preference
     */
    public SegmentPreference getPreference() {
        return preference;
    }


    /**
     * Sets the preference value for this SegmentOptions.
     * 
     * @param preference
     */
    public void setPreference(SegmentPreference preference) {
        this.preference = preference;
    }


    /**
     * Gets the calculateSegmentMapView value for this SegmentOptions.
     * 
     * @return calculateSegmentMapView
     */
    public java.lang.Boolean getCalculateSegmentMapView() {
        return calculateSegmentMapView;
    }


    /**
     * Sets the calculateSegmentMapView value for this SegmentOptions.
     * 
     * @param calculateSegmentMapView
     */
    public void setCalculateSegmentMapView(java.lang.Boolean calculateSegmentMapView) {
        this.calculateSegmentMapView = calculateSegmentMapView;
    }


    /**
     * Gets the calculateDirectionMapView value for this SegmentOptions.
     * 
     * @return calculateDirectionMapView
     */
    public java.lang.Boolean getCalculateDirectionMapView() {
        return calculateDirectionMapView;
    }


    /**
     * Sets the calculateDirectionMapView value for this SegmentOptions.
     * 
     * @param calculateDirectionMapView
     */
    public void setCalculateDirectionMapView(java.lang.Boolean calculateDirectionMapView) {
        this.calculateDirectionMapView = calculateDirectionMapView;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof SegmentOptions)) return false;
        SegmentOptions other = (SegmentOptions) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            ((this.preference==null && other.getPreference()==null) || 
             (this.preference!=null &&
              this.preference.equals(other.getPreference()))) &&
            ((this.calculateSegmentMapView==null && other.getCalculateSegmentMapView()==null) || 
             (this.calculateSegmentMapView!=null &&
              this.calculateSegmentMapView.equals(other.getCalculateSegmentMapView()))) &&
            ((this.calculateDirectionMapView==null && other.getCalculateDirectionMapView()==null) || 
             (this.calculateDirectionMapView!=null &&
              this.calculateDirectionMapView.equals(other.getCalculateDirectionMapView())));
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
        if (getPreference() != null) {
            _hashCode += getPreference().hashCode();
        }
        if (getCalculateSegmentMapView() != null) {
            _hashCode += getCalculateSegmentMapView().hashCode();
        }
        if (getCalculateDirectionMapView() != null) {
            _hashCode += getCalculateDirectionMapView().hashCode();
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(SegmentOptions.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "SegmentOptions"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("preference");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "Preference"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "SegmentPreference"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("calculateSegmentMapView");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "CalculateSegmentMapView"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "boolean"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("calculateDirectionMapView");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "CalculateDirectionMapView"));
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

