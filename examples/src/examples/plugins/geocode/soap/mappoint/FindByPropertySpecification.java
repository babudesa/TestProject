/**
 * FindByPropertySpecification.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.2.1 Jun 14, 2005 (09:15:57 EDT) WSDL2Java emitter.
 */

package examples.plugins.geocode.soap.mappoint;

public class FindByPropertySpecification  implements java.io.Serializable {
    private java.lang.String dataSourceName;
    private FindFilter filter;
    private FindOptions options;

    public FindByPropertySpecification() {
    }

    public FindByPropertySpecification(
           java.lang.String dataSourceName,
           FindFilter filter,
           FindOptions options) {
           this.dataSourceName = dataSourceName;
           this.filter = filter;
           this.options = options;
    }


    /**
     * Gets the dataSourceName value for this FindByPropertySpecification.
     * 
     * @return dataSourceName
     */
    public java.lang.String getDataSourceName() {
        return dataSourceName;
    }


    /**
     * Sets the dataSourceName value for this FindByPropertySpecification.
     * 
     * @param dataSourceName
     */
    public void setDataSourceName(java.lang.String dataSourceName) {
        this.dataSourceName = dataSourceName;
    }


    /**
     * Gets the filter value for this FindByPropertySpecification.
     * 
     * @return filter
     */
    public FindFilter getFilter() {
        return filter;
    }


    /**
     * Sets the filter value for this FindByPropertySpecification.
     * 
     * @param filter
     */
    public void setFilter(FindFilter filter) {
        this.filter = filter;
    }


    /**
     * Gets the options value for this FindByPropertySpecification.
     * 
     * @return options
     */
    public FindOptions getOptions() {
        return options;
    }


    /**
     * Sets the options value for this FindByPropertySpecification.
     * 
     * @param options
     */
    public void setOptions(FindOptions options) {
        this.options = options;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof FindByPropertySpecification)) return false;
        FindByPropertySpecification other = (FindByPropertySpecification) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            ((this.dataSourceName==null && other.getDataSourceName()==null) || 
             (this.dataSourceName!=null &&
              this.dataSourceName.equals(other.getDataSourceName()))) &&
            ((this.filter==null && other.getFilter()==null) || 
             (this.filter!=null &&
              this.filter.equals(other.getFilter()))) &&
            ((this.options==null && other.getOptions()==null) || 
             (this.options!=null &&
              this.options.equals(other.getOptions())));
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
        if (getDataSourceName() != null) {
            _hashCode += getDataSourceName().hashCode();
        }
        if (getFilter() != null) {
            _hashCode += getFilter().hashCode();
        }
        if (getOptions() != null) {
            _hashCode += getOptions().hashCode();
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(FindByPropertySpecification.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "FindByPropertySpecification"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("dataSourceName");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "DataSourceName"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("filter");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "Filter"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "FindFilter"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("options");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "Options"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "FindOptions"));
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
