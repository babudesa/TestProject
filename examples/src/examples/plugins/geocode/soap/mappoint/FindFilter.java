/**
 * FindFilter.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.2.1 Jun 14, 2005 (09:15:57 EDT) WSDL2Java emitter.
 */

package examples.plugins.geocode.soap.mappoint;

public class FindFilter  implements java.io.Serializable {
    private java.lang.String entityTypeName;
    private ArrayOfString propertyNames;
    private WhereClause whereClause;
    private ArrayOfSortProperty sortProperties;
    private FilterExpression expression;

    public FindFilter() {
    }

    public FindFilter(
           java.lang.String entityTypeName,
           ArrayOfString propertyNames,
           WhereClause whereClause,
           ArrayOfSortProperty sortProperties,
           FilterExpression expression) {
           this.entityTypeName = entityTypeName;
           this.propertyNames = propertyNames;
           this.whereClause = whereClause;
           this.sortProperties = sortProperties;
           this.expression = expression;
    }


    /**
     * Gets the entityTypeName value for this FindFilter.
     * 
     * @return entityTypeName
     */
    public java.lang.String getEntityTypeName() {
        return entityTypeName;
    }


    /**
     * Sets the entityTypeName value for this FindFilter.
     * 
     * @param entityTypeName
     */
    public void setEntityTypeName(java.lang.String entityTypeName) {
        this.entityTypeName = entityTypeName;
    }


    /**
     * Gets the propertyNames value for this FindFilter.
     * 
     * @return propertyNames
     */
    public ArrayOfString getPropertyNames() {
        return propertyNames;
    }


    /**
     * Sets the propertyNames value for this FindFilter.
     * 
     * @param propertyNames
     */
    public void setPropertyNames(ArrayOfString propertyNames) {
        this.propertyNames = propertyNames;
    }


    /**
     * Gets the whereClause value for this FindFilter.
     * 
     * @return whereClause
     */
    public WhereClause getWhereClause() {
        return whereClause;
    }


    /**
     * Sets the whereClause value for this FindFilter.
     * 
     * @param whereClause
     */
    public void setWhereClause(WhereClause whereClause) {
        this.whereClause = whereClause;
    }


    /**
     * Gets the sortProperties value for this FindFilter.
     * 
     * @return sortProperties
     */
    public ArrayOfSortProperty getSortProperties() {
        return sortProperties;
    }


    /**
     * Sets the sortProperties value for this FindFilter.
     * 
     * @param sortProperties
     */
    public void setSortProperties(ArrayOfSortProperty sortProperties) {
        this.sortProperties = sortProperties;
    }


    /**
     * Gets the expression value for this FindFilter.
     * 
     * @return expression
     */
    public FilterExpression getExpression() {
        return expression;
    }


    /**
     * Sets the expression value for this FindFilter.
     * 
     * @param expression
     */
    public void setExpression(FilterExpression expression) {
        this.expression = expression;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof FindFilter)) return false;
        FindFilter other = (FindFilter) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            ((this.entityTypeName==null && other.getEntityTypeName()==null) || 
             (this.entityTypeName!=null &&
              this.entityTypeName.equals(other.getEntityTypeName()))) &&
            ((this.propertyNames==null && other.getPropertyNames()==null) || 
             (this.propertyNames!=null &&
              this.propertyNames.equals(other.getPropertyNames()))) &&
            ((this.whereClause==null && other.getWhereClause()==null) || 
             (this.whereClause!=null &&
              this.whereClause.equals(other.getWhereClause()))) &&
            ((this.sortProperties==null && other.getSortProperties()==null) || 
             (this.sortProperties!=null &&
              this.sortProperties.equals(other.getSortProperties()))) &&
            ((this.expression==null && other.getExpression()==null) || 
             (this.expression!=null &&
              this.expression.equals(other.getExpression())));
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
        if (getEntityTypeName() != null) {
            _hashCode += getEntityTypeName().hashCode();
        }
        if (getPropertyNames() != null) {
            _hashCode += getPropertyNames().hashCode();
        }
        if (getWhereClause() != null) {
            _hashCode += getWhereClause().hashCode();
        }
        if (getSortProperties() != null) {
            _hashCode += getSortProperties().hashCode();
        }
        if (getExpression() != null) {
            _hashCode += getExpression().hashCode();
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(FindFilter.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "FindFilter"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("entityTypeName");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "EntityTypeName"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("propertyNames");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "PropertyNames"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ArrayOfString"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("whereClause");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "WhereClause"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "WhereClause"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("sortProperties");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "SortProperties"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ArrayOfSortProperty"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("expression");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "Expression"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "FilterExpression"));
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

