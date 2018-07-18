require 'Setup'
require 'common/LoginLogoutMethods'

class CCLoginLogout < Test::Unit::TestCase

  def test_loginLogout
    LoginLogoutMethods.login('su')

    $ie.frame(:name, "top_frame").button(:id, "TabBar:DesktopTab").click
	wait_until {$ie.frame(:name, "top_frame").select_list(:id, "DesktopActivities:DesktopActivitiesScreen:DesktopActivitiesLV:DesktopActivitiesFilter").exists?}
    assert($ie.frame(:name, "top_frame").contains_text("Activities"))

    $ie.frame(:name, "top_frame").button(:id, "TabBar:SearchTab").click
	wait_until {$ie.frame(:name, "top_frame").link(:id, "Search:MenuLinks:Search_ActivitySearch").exists?}
    assert($ie.frame(:name, "top_frame").contains_text("Search"))

    $ie.frame(:name, "top_frame").button(:id, "TabBar:AddressBookTab").click
	wait_until {$ie.frame(:name, "top_frame").select_list(:id, "AddressBookSearch:AddressBookSearchScreen:AddressBookSearchDV:ContactSubtype").exists?}
    assert($ie.frame(:name, "top_frame").contains_text("Search Address Book"))

    LoginLogoutMethods.logout()
  end
end