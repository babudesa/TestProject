#Date created: 11/1/2007
#Description: Contain methods to create FNOL new claim
# Modified by: Kui Zhang
# Date modified: 11/18/2007
# Modified due to UI change  

class ClaimMethods

  $FNOLWizardPolicyType = "FNOLWizard:FNOLWizard_FindPolicyScreen:FNOLWizardFindPolicyPanelSet:PolicyType"
  $FNOLWizardPolicySearch = "FNOLWizard:FNOLWizard_FindPolicyScreen:FNOLWizardFindPolicyPanelSet:Search_link"
  $FNOLWizardPolicySelect = "FNOLWizard:FNOLWizard_FindPolicyScreen:FNOLWizardFindPolicyPanelSet:PolicyResultLV:0:selectButton"
  $FNOLClaimLossDate = "FNOLWizard:FNOLWizard_FindPolicyScreen:FNOLWizardFindPolicyPanelSet:Claim_LossDate"
  $FNOLClaimReportByName = "FNOLWizard:AutoWorkersCompWizardStepSet:FNOLWizard_BasicInfoScreen:PanelRow:BasicInfoDetailViewPanelDV:ReportedBy_Name"
  $FNOLClaimReportByType = "FNOLWizard:AutoWorkersCompWizardStepSet:FNOLWizard_BasicInfoScreen:PanelRow:BasicInfoDetailViewPanelDV:Claim_ReportedByType"
  $FNOLDupClaim = "NewClaimDuplicatesWorksheet:NewClaimDuplicatesScreen:1"
  $FNOLDupClaimCloseButton = "NewClaimDuplicatesWorksheet:NewClaimDuplicatesScreen:NewClaimDuplicatesWorksheet_CloseButton"
  $FNOLDClaimescription = "FNOLWizard:AutoWorkersCompWizardStepSet:FNOLWizard_NewLossDetailsScreen:LossDetailsAddressDV:Description"
  $FNOLClaimLossCause = "FNOLWizard:AutoWorkersCompWizardStepSet:FNOLWizard_NewLossDetailsScreen:LossDetailsAddressDV:Claim_LossCause"
  $FNOLLossLocationName = "FNOLWizard:AutoWorkersCompWizardStepSet:FNOLWizard_NewLossDetailsScreen:LossDetailsAddressDV:AddressDetailInputSetRef:AddressInputSet:Address_Name"
  $FNOLGoToClaim = "NewClaimSaved:NewClaimSavedScreen:NewClaimSavedDV:GoToClaim"

   def ClaimMethods.createQuickAutoClaim()
     $currentDate = Time.now
     $specificDate = $currentDate +  (-86400)
     $specificDateString =  $specificDate.strftime("%m/%d/%Y %I:%M %p")

     # Create a new claim
     $ie.frame(:name, "top_frame").link(:id, "TabBar:ClaimTab_arrow").click
     wait_until {$ie.frame(:name, "top_frame").span(:id, "TabBar:ClaimTab:ClaimTab_FNOLWizard").exists?}
     $ie.frame(:name, "top_frame").span(:id, "TabBar:ClaimTab:ClaimTab_FNOLWizard").click

     # Search Policy
     wait_until {$ie.frame(:name, "top_frame").select_list(:id, $FNOLWizardPolicyType).exists?}
     $ie.frame(:name, "top_frame").select_list(:id, $FNOLWizardPolicyType).select("Personal auto")
     $ie.frame(:name, "top_frame").span(:id, $FNOLWizardPolicySearch).click
     wait_until {$ie.frame(:name, "top_frame").link(:id, $FNOLWizardPolicySelect).exists?}
     $ie.frame(:name, "top_frame").link(:id, $FNOLWizardPolicySelect).click

     $ie.frame(:name, "top_frame").text_field(:id, $FNOLClaimLossDate).set($specificDateString)
     $ie.frame(:name, "top_frame").button(:id, "FNOLWizard:Next").click

     # Basic information
     wait_until {$ie.frame(:name, "top_frame").select_list(:id, $FNOLClaimReportByName).exists?}
     $ie.frame(:name, "top_frame").select_list(:id, $FNOLClaimReportByName).select("Karen Egertson")
     $ie.frame(:name, "top_frame").select_list(:id, $FNOLClaimReportByType).select("Self")
     $ie.frame(:name, "top_frame").button(:id, "FNOLWizard:Next").click

     #Dulicate cliam check
     if $ie.frame(:name, "top_frame").div(:id, $FNOLDupClaim).exists?
       $ie.frame(:name, "top_frame").button(:id, $FNOLDupClaimCloseButton).click
       $ie.frame(:name, "top_frame").button(:id, "FNOLWizard:Next").click
     end

     # Add claim information
     wait_until {$ie.frame(:name, "top_frame").text_field(:id, $FNOLDClaimescription).exists?}
     $ie.frame(:name, "top_frame").text_field(:id, $FNOLDClaimescription).set("Create by watir test")
     $ie.frame(:name, "top_frame").select_list(:id, $FNOLClaimLossCause).select("Animal")
     $ie.frame(:name, "top_frame").select_list(:id, $FNOLLossLocationName).select("503 2nd Ave., San Diego, CA 92101")
     $ie.frame(:name, "top_frame").button(:id, "FNOLWizard:Finish").click

     # New claim saved
     wait_until {$ie.frame(:name, "top_frame").link(:id, $FNOLGoToClaim).exists?}
     $ie.frame(:name, "top_frame").link(:id, $FNOLGoToClaim).click     
   end 	
 end
