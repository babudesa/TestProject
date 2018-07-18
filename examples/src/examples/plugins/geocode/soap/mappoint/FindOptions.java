/**
 * FindOptions.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.2.1 Jun 14, 2005 (09:15:57 EDT) WSDL2Java emitter.
 */

package examples.plugins.geocode.soap.mappoint;

public class FindOptions  implements java.io.Serializable {
    private FindRange range;
    private int searchContext;
    private java.lang.String[] resultMask;
    private java.lang.Double thresholdScore;

    public FindOptions() {
    }

    public FindOptions(
           FindRange range,
           int searchContext,
           java.lang.String[] resultMask,
           java.lang.Double thresholdScore) {
           this.range = range;
           this.searchContext = searchContext;
           this.resultMask = resultMask;
           this.thresholdScore = thresholdScore;
    }


    /**
     * Gets the range value for this FindOptions.
     * 
     * @return range
     */
    public FindRange getRange() {
        return range;
    }


    /**
     * Sets the range value for this FindOptions.
     * 
     * @param range
     */
    public void setRange(FindRange range) {
        this.range = range;
    }


    /**
     * Gets the searchContext value for this FindOptions.
     * 
     * @return searchContext
     */
    public int getSearchContext() {
        return searchContext;
    }


    /**
     * Sets the searchContext value for this FindOptions.
     * 
     * @param searchContext
     */
    public void setSearchContext(int searchContext) {
        this.searchContext = searchContext;
    }


    /**
     * Gets the resultMask value for this FindOptions.
     * 
     * @return resultMask
     */
    public java.lang.String[] getResultMask() {
        return resultMask;
    }


    /**
     * Sets the resultMask value for this FindOptions.
     * 
     * @param resultMask
     */
    public void setResultMask(java.lang.String[] resultMask) {
        this.resultMask = resultMask;
    }


    /**
     * Gets the thresholdScore value for this FindOptions.
     * 
     * @return thresholdScore
     */
    public java.lang.Double getThresholdScore() {
        return thresholdScore;
    }


    /**
     * Sets the thresholdScore value for this FindOptions.
     * 
     * @param thresholdScore
     */
    public void setThresholdScore(java.lang.Double thresholdScore) {
        this.thresholdScore = thresholdScore;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof FindOptions)) return false;
        FindOptions other = (FindOptions) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            ((this.range==null && other.getRange()==null) || 
             (this.range!=null &&
              this.range.equals(other.getRange()))) &&
            this.searchContext == other.getSearchContext() &&
            ((this.resultMask==null && other.getResultMask()==null) || 
             (this.resultMask!=null &&
              java.util.Arrays.equals(this.resultMask, other.getResultMask()))) &&
            ((this.thresholdScore==null && other.getThresholdScore()==null) || 
             (this.thresholdScore!=null &&
              this.thresholdScore.equals(other.getThresholdScore())));
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
        if (getRange() != null) {
            _hashCode += getRange().hashCode();
        }
        _hashCode += getSearchContext();
        if (getResultMask() != null) {
            for (int i=0;
                 i<java.lang.reflect.Array.getLength(getResultMask());
                 i++) {
                java.lang.Object obj = java.lang.reflect.Array.get(getResultMask(), i);
                if (obj != null &&
                    !obj.getClass().isArray()) {
                    _hashCode += obj.hashCode();
                }
            }
        }
        if (getThresholdScore() != null) {
            _hashCode += getThresholdScore().hashCode();
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(FindOptions.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "FindOptions"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("range");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "Range"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "FindRange"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("searchContext");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "SearchContext"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("resultMask");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ResultMask"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "FindResultMask"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("thresholdScore");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ThresholdScore"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "double"));
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

