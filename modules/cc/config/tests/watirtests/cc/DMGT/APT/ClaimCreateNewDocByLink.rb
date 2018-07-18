# Created by IntelliJ IDEA.
# User: kzhang
# Date: Sep 12, 2007
#Configuration:  CC OOTB
# Description: Verify creating new document by link an existing document to a claim
# Required input: Creat a new claim
# Expected result: an existing document is added to claim
## Test steps:
#   *Create a new person auto claim
#   *Link a Excle file to the newly created claim
#   *Verify the Excle file is added on the document page
# Modified by:
# Date modified: 

require 'Setup'
require 'common/LoginLogoutMethods'
require 'common/ClaimMethods'

class ClaimCreateNewDocByLink < Test::Unit::TestCase

  $docPage = "Claim:MenuLinks:Claim_ClaimDocumentsGroup"
  $claimAction = "Claim:ClaimMenuActions"
  $claimNewDocumentMenuItemSet_Link = "Claim:ClaimMenuActions:ClaimMenuActions_NewDocument:ClaimNewDocumentMenuItemSet:ClaimNewDocumentMenuItemSet_Link"
  $documentDetailsInputSet = "ClaimNewDocumentLinkedWorksheet:NewDocumentLinkedScreen:DocumentDetailsInputSet"
  $documentAttachmentDV = "ClaimNewDocumentLinkedWorksheet:NewDocumentLinkedScreen:DocumentAttachmentDV"
  $update = "ClaimNewDocumentLinkedWorksheet:NewDocumentLinkedScreen:Update"
  
             
  $currentDir = ""
  $fileDirectory = ""

  def test_ClaimCreateNewDocByLink

     #Select file to link using
    $currentDir = File.expand_path(File.dirname(__FILE__))
    $fileDirectory =  $currentDir.gsub(/\//, '\\')
    
    
    LoginLogoutMethods.login('su')
    ClaimMethods.createQuickAutoClaim()

    #Go to Decuments page
    wait_until {$ie.frame(:name, "top_frame").link(:id, $docPage).exists?}
    $ie.frame(:name, "top_frame").link(:id, $docPage).click

    # Create new document by link existing doc
    wait_until {$ie.frame(:name, "top_frame").span(:id, $claimAction).exists?}
    $ie.frame(:name, "top_frame").span(:id, $claimAction).click

    wait_until {$ie.frame(:name, "top_frame").span(:id, $claimNewDocumentMenuItemSet_Link).exists?}
    $ie.frame(:name, "top_frame").span(:id, $claimNewDocumentMenuItemSet_Link).click
    $ie.frame(:name, "top_frame").select_list(:id, $documentDetailsInputSet + ":Status").select("Approved")
    $ie.frame(:name, "top_frame").select_list(:id, $documentDetailsInputSet + ":Type").select("Statement")
    $ie.frame(:name, "top_frame").link(:id, $documentAttachmentDV + ":Attachment").click_no_wait
    

    #Select file to link using
    autoit = WIN32OLE.new('AutoItX3.Control')

    $title="Choose file"
    $lookIn_id=1137
    $fileName_id = 1148
    $open_id = 1
    $fileName = "test_XLS_data.xls"

    puts $currentDir
    puts $fileDirectory
    puts $fileName
    
    #Select file directory
    autoit.WinWait("Choose file", nil, 15)
    autoit.WinActive("Choose file")
    assert_equal(1, autoit.WinExists($title))
    autoit.ControlFocus($title, "", $fileName_id)
    autoit.ControlClick($title, "", $fileName_id, 1)
    autoit.ControlSetText($title, "", $fileName_id, $fileDirectory)
    autoit.ControlClick($title, "", $open_id, 1)
    autoit.ControlSend($title, "", $open_id, "!o")
    
    #Set file name
    autoit.WinWait("Choose file", nil, 5)
    autoit.WinActive("Choose file")
    autoit.ControlFocus($title, "", $fileName_id)
    autoit.ControlClick($title, "", $fileName_id, 1)
    autoit.ControlSetText($title, "", $fileName_id, $fileName)
    autoit.ControlFocus($title, "", $open_id)
    autoit.ControlClick($title, "", $open_id, 1)
    autoit.ControlSend($title, "", $open_id, "!o")
        

    #Click Update button to add linked document to claim
    sleep (5)
    #checking to make sure that the choose file window is closed before moving on
    assert_equal(0, autoit.WinExists($title))
    
    wait_until {$ie.frame(:name, "top_frame").button(:id, $update).exists?}
    $ie.frame(:name, "top_frame").button(:id, $update).click
   
    #wait_until {!$ie.frame(:name, "top_frame").button(:id, $update).exists?}
    sleep (5)
    #Assert the document is added to claim
    assert($ie.frame(:name, "top_frame").contains_text("test_XLS_data"))
  end
end