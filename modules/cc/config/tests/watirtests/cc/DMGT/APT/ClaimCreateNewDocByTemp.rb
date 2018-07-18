# Created by IntelliJ IDEA.
# User: kzhang
# Date: Sep 12, 2007
# Configuration:  CC OOTB
# Description: Verify creating new document by teamplate on a claim
# Required input: Creat a new claim
# Expected result: create new document by teamplate on a claim
## Test steps:
#   *Create a new person auto claim
#   *Create a new document by teamplate
#   *Verify the text file is added on the document page
# Modified by:
# Date modified:

require 'Setup'
require 'common/LoginLogoutMethods'
require 'common/ClaimMethods'

class ClaimCreateNewdocByTemp < Test::Unit::TestCase

  $docPage = "Claim:MenuLinks:Claim_ClaimDocumentsGroup"
  $claimAction = "Claim:ClaimMenuActions"
  $claimNewDocumentMenuItemSet_Create = "Claim:ClaimMenuActions:ClaimMenuActions_NewDocument:ClaimNewDocumentMenuItemSet:ClaimNewDocumentMenuItemSet_Create"
  $documentDetailsInputSet = "ClaimNewDocumentFromTemplateWorksheet:NewDocumentFromTemplateScreen:NewTemplateDocumentDV:DocumentDetailsInputSet"
  $customrUpdate = "ClaimNewDocumentFromTemplateWorksheet:NewDocumentFromTemplateScreen:NewDocumentFromTemplate_CustomUpdate"
  $select = "DocumentTemplateSearchPopup:DocumentTemplateSearchScreen:DocumentTemplateSearchResultLV:0:_Select"
  $createDocument = "ClaimNewDocumentFromTemplateWorksheet:NewDocumentFromTemplateScreen:NewTemplateDocumentDV:CreateDocument"
  
   def test_ClaimCreateNewDocByTemp
     LoginLogoutMethods.login('su')
     ClaimMethods.createQuickAutoClaim()

     #Go to Decuments page
     wait_until {$ie.frame(:name, "top_frame").link(:id, $docPage).exists?}
     $ie.frame(:name, "top_frame").link(:id, $docPage).click

     # Create new document by template
     wait_until {$ie.frame(:name, "top_frame").button(:id, $claimAction).exists?}
     $ie.frame(:name, "top_frame").span(:id, $claimAction).click

     wait_until {$ie.frame(:name, "top_frame").span(:id, $claimNewDocumentMenuItemSet_Create).exists?}
     $ie.frame(:name, "top_frame").span(:id, $claimNewDocumentMenuItemSet_Create).click

     $ie.frame(:name, "top_frame").image(:alt, "Search...").click

     wait_until {$ie.frame(:name, "top_frame").link(:id, $select).exists?}
     $ie.frame(:name, "top_frame").link(:id, $select).click

     $ie.frame(:name, "top_frame").select_list(:id, $documentDetailsInputSet + ":Status").select("Approved")

     $ie.frame(:name, "top_frame").button(:id, $createDocument).click
     sleep(8)
     
     # Acrobat Reader window is open
          autoit = WIN32OLE.new('AutoItX3.Control')
          oldvalue = autoit.Opt("WinTitleMatchMode", 2)
     
          $title = autoit.WinGetTitle "Adobe", ""
          puts "Full title read was: " +  $title
          autoit.WinWait($title, nil, 5)
          autoit.WinActive($title)
          assert_equal(1, autoit.WinExists($title))
          autoit.WinKill($title)
	
     
     wait_until {$ie.frame(:name, "top_frame").button(:id, $customrUpdate).exists?}
     $ie.frame(:name, "top_frame").button(:id, $customrUpdate).click

     #Verify new document is created on the claim     
     wait_until {$ie.frame(:name, "top_frame").link(:id, "ClaimDocuments:Claim_DocumentsScreen:DocumentsLV:0:Name").exists?}
     assert($ie.frame(:name, "top_frame").contains_text("Acrobat Sample"))

     LoginLogoutMethods.logout()
  end
end