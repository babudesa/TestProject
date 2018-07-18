/**
 * FindResults.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.2.1 Jun 14, 2005 (09:15:57 EDT) WSDL2Java emitter.
 */

package examples.plugins.geocode.soap.mappoint;

public class FindResults  implements java.io.Serializable {
    private int numberFound;
    private int startIndex;
    private ArrayOfFindResult results;
    private double topScore;

    public FindResults() {
    }

    public FindResults(
           int numberFound,
           int startIndex,
           ArrayOfFindResult results,
           double topScore) {
           this.numberFound = numberFound;
           this.startIndex = startIndex;
           this.results = results;
           this.topScore = topScore;
    }


    /**
     * Gets the numberFound value for this FindResults.
     * 
     * @return numberFound
     */
    public int getNumberFound() {
        return numberFound;
    }


    /**
     * Sets the numberFound value for this FindResults.
     * 
     * @param numberFound
     */
    public void setNumberFound(int numberFound) {
        this.numberFound = numberFound;
    }


    /**
     * Gets the startIndex value for this FindResults.
     * 
     * @return startIndex
     */
    public int getStartIndex() {
        return startIndex;
    }


    /**
     * Sets the startIndex value for this FindResults.
     * 
     * @param startIndex
     */
    public void setStartIndex(int startIndex) {
        this.startIndex = startIndex;
    }


    /**
     * Gets the results value for this FindResults.
     * 
     * @return results
     */
    public ArrayOfFindResult getResults() {
        return results;
    }


    /**
     * Sets the results value for this FindResults.
     * 
     * @param results
     */
    public void setResults(ArrayOfFindResult results) {
        this.results = results;
    }


    /**
     * Gets the topScore value for this FindResults.
     * 
     * @return topScore
     */
    public double getTopScore() {
        return topScore;
    }


    /**
     * Sets the topScore value for this FindResults.
     * 
     * @param topScore
     */
    public void setTopScore(double topScore) {
        this.topScore = topScore;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof FindResults)) return false;
        FindResults other = (FindResults) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            this.numberFound == other.getNumberFound() &&
            this.startIndex == other.getStartIndex() &&
            ((this.results==null && other.getResults()==null) || 
             (this.results!=null &&
              this.results.equals(other.getResults()))) &&
            this.topScore == other.getTopScore();
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
        _hashCode += getNumberFound();
        _hashCode += getStartIndex();
        if (getResults() != null) {
            _hashCode += getResults().hashCode();
        }
        _hashCode += new Double(getTopScore()).hashCode();
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(FindResults.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "FindResults"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("numberFound");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "NumberFound"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("startIndex");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "StartIndex"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("results");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "Results"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "ArrayOfFindResult"));
        elemField.setMinOccurs(0);
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("topScore");
        elemField.setXmlName(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "TopScore"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "double"));
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

