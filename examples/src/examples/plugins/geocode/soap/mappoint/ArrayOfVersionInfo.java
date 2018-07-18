/**
 * ArrayOfVersionInfo.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.2.1 Jun 14, 2005 (09:15:57 EDT) WSDL2Java emitter.
 */

package examples.plugins.geocode.soap.mappoint;

public class ArrayOfVersionInfo  implements java.io.Serializable {
    private VersionInfo[] versionInfo;

    public ArrayOfVersionInfo() {
    }

    public ArrayOfVersionInfo(
           VersionInfo[] versionInfo) {
           this.versionInfo = versionInfo;
    }


    /**
     * Gets the versionInfo value for this ArrayOfVersionInfo.
     * 
     * @return versionInfo
     */
    public VersionInfo[] getVersionInfo() {
        return versionInfo;
    }


    /**
     * Sets the versionInfo value for this ArrayOfVersionInfo.
     * 
     * @param versionInfo
     */
    public void setVersionInfo(VersionInfo[] versionInfo) {
        this.versionInfo = versionInfo;
    }

    public VersionInfo getVersionInfo(int i) {
        return this.versionInfo[i];
    }

    public void setVersionInfo(int i, VersionInfo _value) {
        this.versionInfo[i] = _value;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof ArrayOfVersionInfo)) return false;
        ArrayOfVersionInfo other = (ArrayOfVersionInfo) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            ((this.versionInfo==null && other.getVersionInfo()==null) || 
             (this.versionInfo!=null &&
              java.util.Arrays.equals(this.versionInfo, other.getVersionInfo())));
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
        if (getVersionInfo() != null) {
            for (int i=0;
                 i<java.lang.reflect.Array.getLength(getVersionInfo());
                 i++) {
                java.lang.Object obj = java.lang.reflect.Array.get(getVersionInfo(), i);
                if (obj != null &&
                    !obj.getClass().isArray()) {
                    _hashCode += obj.hashCode();
                }
            }
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(ArrayOfVersionInfo.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ArrayOfVersionInfo"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("versionInfo");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "VersionInfo"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "VersionInfo"));
        elemField.setMinOccurs(0);
        elemField.setNillable(true);
        elemField.setMaxOccursUnbounded(true);
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

