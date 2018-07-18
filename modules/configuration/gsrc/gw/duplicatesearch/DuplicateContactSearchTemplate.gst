<%@ params(helper : gw.api.util.DuplicateSearchHelper, contact : Contact) %>
<%
/*********************************************************************************************************************
 * GScript template used to create the SQL query for finding duplicate contacts
 *
 * INPUT: helper -- an instance of DuplicateSearchHelper, which has utility methods for constructing SQL
 *        contact -- the contact we are testing for duplicates
 * OUTPUT: The SQL that should produce a list of contact IDs that match this contact, or an empty list if none match 
 *********************************************************************************************************************
 */
%>
Select cc_contact_head.ID col0
  FROM cc_contact cc_contact_head
  WHERE cc_contact_head.Retired = 0
<%
  // If the contact subtype is person (ID=1) than search on the person fields, else search on the company fields
  if (contact typeis Person) {
%>
    AND cc_contact_head.LastNameDenorm = <%= helper.makeParam("Person.LastName", contact.LastName) %>
    AND cc_contact_head.FirstNameDenorm = <%= helper.makeParam("Person.FirstName", contact.FirstName) %>
    AND cc_contact_head.subtype = 1
<% } else { %>
    AND cc_contact_head.NameDenorm = <%= helper.makeParam("Contact.Name", contact.Name) %>
    AND cc_contact_head.subtype = 2
<% } %>
