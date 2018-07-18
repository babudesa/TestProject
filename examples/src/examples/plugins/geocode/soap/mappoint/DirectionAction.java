/**
 * DirectionAction.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.2.1 Jun 14, 2005 (09:15:57 EDT) WSDL2Java emitter.
 */

package examples.plugins.geocode.soap.mappoint;

public class DirectionAction implements java.io.Serializable {
    private java.lang.String _value_;
    private static java.util.HashMap _table_ = new java.util.HashMap();

    // Constructor
    protected DirectionAction(java.lang.String value) {
        _value_ = value;
        _table_.put(_value_,this);
    }

    public static final java.lang.String _Other = "Other";
    public static final java.lang.String _Depart = "Depart";
    public static final java.lang.String _Arrive = "Arrive";
    public static final java.lang.String _TurnLeft = "TurnLeft";
    public static final java.lang.String _TurnRight = "TurnRight";
    public static final java.lang.String _BearLeft = "BearLeft";
    public static final java.lang.String _BearRight = "BearRight";
    public static final java.lang.String _Merge = "Merge";
    public static final java.lang.String _Continue = "Continue";
    public static final java.lang.String _TurnBack = "TurnBack";
    public static final java.lang.String _TakeRoundabout = "TakeRoundabout";
    public static final java.lang.String _ConstructionDelay = "ConstructionDelay";
    public static final java.lang.String _ConstructionStop = "ConstructionStop";
    public static final java.lang.String _NameChange = "NameChange";
    public static final java.lang.String _LeftLeft = "LeftLeft";
    public static final java.lang.String _LeftRight = "LeftRight";
    public static final java.lang.String _RightLeft = "RightLeft";
    public static final java.lang.String _RightRight = "RightRight";
    public static final java.lang.String _TakeRamp = "TakeRamp";
    public static final java.lang.String _TakeRampLeft = "TakeRampLeft";
    public static final java.lang.String _TakeRampRight = "TakeRampRight";
    public static final java.lang.String _KeepStraight = "KeepStraight";
    public static final java.lang.String _KeepLeft = "KeepLeft";
    public static final java.lang.String _KeepRight = "KeepRight";
    public static final DirectionAction Other = new DirectionAction(_Other);
    public static final DirectionAction Depart = new DirectionAction(_Depart);
    public static final DirectionAction Arrive = new DirectionAction(_Arrive);
    public static final DirectionAction TurnLeft = new DirectionAction(_TurnLeft);
    public static final DirectionAction TurnRight = new DirectionAction(_TurnRight);
    public static final DirectionAction BearLeft = new DirectionAction(_BearLeft);
    public static final DirectionAction BearRight = new DirectionAction(_BearRight);
    public static final DirectionAction Merge = new DirectionAction(_Merge);
    public static final DirectionAction Continue = new DirectionAction(_Continue);
    public static final DirectionAction TurnBack = new DirectionAction(_TurnBack);
    public static final DirectionAction TakeRoundabout = new DirectionAction(_TakeRoundabout);
    public static final DirectionAction ConstructionDelay = new DirectionAction(_ConstructionDelay);
    public static final DirectionAction ConstructionStop = new DirectionAction(_ConstructionStop);
    public static final DirectionAction NameChange = new DirectionAction(_NameChange);
    public static final DirectionAction LeftLeft = new DirectionAction(_LeftLeft);
    public static final DirectionAction LeftRight = new DirectionAction(_LeftRight);
    public static final DirectionAction RightLeft = new DirectionAction(_RightLeft);
    public static final DirectionAction RightRight = new DirectionAction(_RightRight);
    public static final DirectionAction TakeRamp = new DirectionAction(_TakeRamp);
    public static final DirectionAction TakeRampLeft = new DirectionAction(_TakeRampLeft);
    public static final DirectionAction TakeRampRight = new DirectionAction(_TakeRampRight);
    public static final DirectionAction KeepStraight = new DirectionAction(_KeepStraight);
    public static final DirectionAction KeepLeft = new DirectionAction(_KeepLeft);
    public static final DirectionAction KeepRight = new DirectionAction(_KeepRight);
    public java.lang.String getValue() { return _value_;}
    public static DirectionAction fromValue(java.lang.String value)
          throws java.lang.IllegalArgumentException {
        DirectionAction enumeration = (DirectionAction)
            _table_.get(value);
        if (enumeration==null) throw new java.lang.IllegalArgumentException();
        return enumeration;
    }
    public static DirectionAction fromString(java.lang.String value)
          throws java.lang.IllegalArgumentException {
        return fromValue(value);
    }
    public boolean equals(java.lang.Object obj) {return (obj == this);}
    public int hashCode() { return toString().hashCode();}
    public java.lang.String toString() { return _value_;}
    public java.lang.Object readResolve() throws java.io.ObjectStreamException { return fromValue(_value_);}
    public static org.apache.axis.encoding.Serializer getSerializer(
           java.lang.String mechType, 
           java.lang.Class _javaType,  
           javax.xml.namespace.QName _xmlType) {
        return 
          new org.apache.axis.encoding.ser.EnumSerializer(
            _javaType, _xmlType);
    }
    public static org.apache.axis.encoding.Deserializer getDeserializer(
           java.lang.String mechType, 
           java.lang.Class _javaType,  
           javax.xml.namespace.QName _xmlType) {
        return 
          new org.apache.axis.encoding.ser.EnumDeserializer(
            _javaType, _xmlType);
    }
    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(DirectionAction.class);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://s.mappoint.net/mappoint-30/", "DirectionAction"));
    }
    /**
     * Return type metadata object
     */
    public static org.apache.axis.description.TypeDesc getTypeDesc() {
        return typeDesc;
    }

}

