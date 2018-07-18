# Created by IntelliJ IDEA.
# User: kzhang
# Date: Sep 12, 2007
# Configuration:  CC OOTB
# Description: Verify creating new document by Indicating the existence of a particular document on a claim
# Required input: Creat a new claim
# Expected result: create new document by Indicating the existence of a particular document on a claim
## Test steps:
#   *Create a new person auto claim
#   *Create a new document by Indicating the existence of a particular document
#   *Verify the text file is added on the document page
# Modified by:
# Date modified:

require 'Setup'
require 'common/LoginLogoutMethods'
require 'common/ClaimMethods'

class ClaimCreateNewDocByExist < Test::Unit::TestCase

  $docPage = "Claim:MenuLinks:Claim_ClaimDocumentsGroup"
  $claimAction = "Claim:ClaimMenuActions"
  $claimNewDocumentMenuItemSet_IndicateExists = "Claim:ClaimMenuActions:ClaimMenuActions_NewDocument:ClaimNewDocumentMenuItemSet:ClaimNewDocumentMenuItemSet_IndicateExists"
  $documentExistenceDetailsInputSet = "ClaimNewDocumentExistsWorksheet:NewDocumentExistsScreen:DocumentExistenceDetailsInputSet"
  $update = "ClaimNewDocumentExistsWorksheet:NewDocumentExistsScreen:Update"
  $docName = "Create new document by indicating an existing document"

  def test_ClaimCreateNewDocByExist
    LoginLogoutMethods.login('su')
    ClaimMethods.createQuickAutoClaim()

    #Go to Decuments page
    wait_until {$ie.frame(:name, "top_frame").link(:id, $docPage).exists?}
    $ie.frame(:name, "top_frame").link(:id, $docPage).click

    # Create new document by template
    $ie.frame(:name, "top_frame").span(:id, $claimAction).click

    wait_until {$ie.frame(:name, "top_frame").span(:id, $claimNewDocumentMenuItemSet_IndicateExists).exists?}
    $ie.frame(:name, "top_frame").span(:id, $claimNewDocumentMenuItemSet_IndicateExists).click
    
    wait_until {$ie.frame(:name, "top_frame").text_field(:id, $documentExistenceDetailsInputSet + ":Name").exists?}
    $ie.frame(:name, "top_frame").text_field(:id, $documentExistenceDetailsInputSet + ":Name").set($docName)
    $ie.frame(:name, "top_frame").text_field(:id, $documentExistenceDetailsInputSet + ":Description").set($docName)
    $ie.frame(:name, "top_frame").select_list(:id, $documentExistenceDetailsInputSet + ":Status").select("Approved")
    $ie.frame(:name, "top_frame").select_list(:id, $documentExistenceDetailsInputSet + ":Type").select("Statement")

    $ie.frame(:name, "top_frame").button(:id, $update).click

    #Verify new document is created on the claim
    assert($ie.frame(:name, "top_frame").contains_text($docName))
  end
end

