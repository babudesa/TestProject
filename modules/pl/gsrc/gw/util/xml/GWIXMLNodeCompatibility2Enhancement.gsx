package gw.util.xml;

uses gw.xml.IXMLNode;
uses java.util.List;

@ReadOnly
/**
 * This enhancement serves only to preserve backwards compatibility with the old
 * gw.api.xml.IXMLNode object.  New methods should be added to gw.xml.IXMLNode and
 * implemented in gw.xml.AbstractXMLNode.
 */
enhancement GWIXMLNodeCompatibility2Enhancement<N extends IXMLNode> : gw.xml.IXMLNode<N>
{

  @Deprecated( "Use the where() method instead." )
  function find( condition(node:N):Boolean ) : List<N> {
    return this.findAll( condition )
  }
  
}
