/**
 * CountryRegionInfo.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.2.1 Jun 14, 2005 (09:15:57 EDT) WSDL2Java emitter.
 */

package examples.plugins.geocode.soap.mappoint;

public class CountryRegionInfo  implements java.io.Serializable {
    private int entityID;
    private LatLong latLong;
    private java.lang.String iso2;
    private java.lang.String iso3;
    private java.lang.String friendlyName;
    private java.lang.String officialName;

    public CountryRegionInfo() {
    }

    public CountryRegionInfo(
           int entityID,
           LatLong latLong,
           java.lang.String iso2,
           java.lang.String iso3,
           java.lang.String friendlyName,
           java.lang.String officialName) {
           this.entityID = entityID;
           this.latLong = latLong;
           this.iso2 = iso2;
           this.iso3 = iso3;
           this.friendlyName = friendlyName;
           this.officialName = officialName;
    }


    /**
     * Gets the entityID value for this CountryRegionInfo.
     * 
     * @return entityID
     */
    public int getEntityID() {
        return entityID;
    }


    /**
     * Sets the entityID value for this CountryRegionInfo.
     * 
     * @param entityID
     */
    public void setEntityID(int entityID) {
        this.entityID = entityID;
    }


    /**
     * Gets the latLong value for this CountryRegionInfo.
     * 
     * @return latLong
     */
    public LatLong getLatLong() {
        return latLong;
    }


    /**
     * Sets the latLong value for this CountryRegionInfo.
     * 
     * @param latLong
     */
    public void setLatLong(LatLong latLong) {
        this.latLong = latLong;
    }


    /**
     * Gets the iso2 value for this CountryRegionInfo.
     * 
     * @return iso2
     */
    public java.lang.String getIso2() {
        return iso2;
    }


    /**
     * Sets the iso2 value for this CountryRegionInfo.
     * 
     * @param iso2
     */
    public void setIso2(java.lang.String iso2) {
        this.iso2 = iso2;
    }


    /**
     * Gets the iso3 value for this CountryRegionInfo.
     * 
     * @return iso3
     */
    public java.lang.String getIso3() {
        return iso3;
    }


    /**
     * Sets the iso3 value for this CountryRegionInfo.
     * 
     * @param iso3
     */
    public void setIso3(java.lang.String iso3) {
        this.iso3 = iso3;
    }


    /**
     * Gets the friendlyName value for this CountryRegionInfo.
     * 
     * @return friendlyName
     */
    public java.lang.String getFriendlyName() {
        return friendlyName;
    }


    /**
     * Sets the friendlyName value for this CountryRegionInfo.
     * 
     * @param friendlyName
     */
    public void setFriendlyName(java.lang.String friendlyName) {
        this.friendlyName = friendlyName;
    }


    /**
     * Gets the officialName value for this CountryRegionInfo.
     * 
     * @return officialName
     */
    public java.lang.String getOfficialName() {
        return officialName;
    }


    /**
     * Sets the officialName value for this CountryRegionInfo.
     * 
     * @param officialName
     */
    public void setOfficialName(java.lang.String officialName) {
        this.officialName = officialName;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof CountryRegionInfo)) return false;
        CountryRegionInfo other = (CountryRegionInfo) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            this.entityID == other.getEntityID() &&
            ((this.latLong==null && other.getLatLong()==null) || 
             (this.latLong!=null &&
              this.latLong.equals(other.getLatLong()))) &&
            ((this.iso2==null && other.getIso2()==null) || 
             (this.iso2!=null &&
              this.iso2.equals(other.getIso2()))) &&
            ((this.iso3==null && other.getIso3()==null) || 
             (this.iso3!=null &&
              this.iso3.equals(other.getIso3()))) &&
            ((this.friendlyName==null && other.getFriendlyName()==null) || 
             (this.friendlyName!=null &&
              this.friendlyName.equals(other.getFriendlyName()))) &&
            ((this.officialName==null && other.getOfficialName()==null) || 
             (this.officialName!=null &&
              this.officialName.equals(other.getOfficialName())));
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
        _hashCode += getEntityID();
        if (getLatLong() != null) {
            _hashCode += getLatLong().hashCode();
        }
        if (getIso2() != null) {
            _hashCode += getIso2().hashCode();
        }
        if (getIso3() != null) {
            _hashCode += getIso3().hashCode();
        }
        if (getFriendlyName() != null) {
            _hashCode += getFriendlyName().hashCode();
        }
        if (getOfficialName() != null) {
            _hashCode += getOfficialName().hashCode();
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(CountryRegionInfo.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "CountryRegionInfo"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("entityID");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "EntityID"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
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
        elemField.setFieldName("iso2");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "Iso2"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("iso3");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "Iso3"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("friendlyName");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "FriendlyName"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("officialName");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "OfficialName"));
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

