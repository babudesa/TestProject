/**
 * DriverProfile.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.2.1 Jun 14, 2005 (09:15:57 EDT) WSDL2Java emitter.
 */

package examples.plugins.geocode.soap.mappoint;

public class DriverProfile  implements java.io.Serializable {
    private java.lang.Integer dayStartTime;
    private java.lang.Integer dayEndTime;

    public DriverProfile() {
    }

    public DriverProfile(
           java.lang.Integer dayStartTime,
           java.lang.Integer dayEndTime) {
           this.dayStartTime = dayStartTime;
           this.dayEndTime = dayEndTime;
    }


    /**
     * Gets the dayStartTime value for this DriverProfile.
     * 
     * @return dayStartTime
     */
    public java.lang.Integer getDayStartTime() {
        return dayStartTime;
    }


    /**
     * Sets the dayStartTime value for this DriverProfile.
     * 
     * @param dayStartTime
     */
    public void setDayStartTime(java.lang.Integer dayStartTime) {
        this.dayStartTime = dayStartTime;
    }


    /**
     * Gets the dayEndTime value for this DriverProfile.
     * 
     * @return dayEndTime
     */
    public java.lang.Integer getDayEndTime() {
        return dayEndTime;
    }


    /**
     * Sets the dayEndTime value for this DriverProfile.
     * 
     * @param dayEndTime
     */
    public void setDayEndTime(java.lang.Integer dayEndTime) {
        this.dayEndTime = dayEndTime;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof DriverProfile)) return false;
        DriverProfile other = (DriverProfile) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            ((this.dayStartTime==null && other.getDayStartTime()==null) || 
             (this.dayStartTime!=null &&
              this.dayStartTime.equals(other.getDayStartTime()))) &&
            ((this.dayEndTime==null && other.getDayEndTime()==null) || 
             (this.dayEndTime!=null &&
              this.dayEndTime.equals(other.getDayEndTime())));
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
        if (getDayStartTime() != null) {
            _hashCode += getDayStartTime().hashCode();
        }
        if (getDayEndTime() != null) {
            _hashCode += getDayEndTime().hashCode();
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(DriverProfile.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "DriverProfile"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("dayStartTime");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "DayStartTime"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("dayEndTime");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "DayEndTime"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
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

