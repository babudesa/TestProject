package gw.command
uses gw.api.databuilder.UserBuilder

class NewUser extends BaseCommand {
  function withDefault() {
    var numUsers = find(u in User).getCount()
    var user = new UserBuilder()
      .withName("testuser", numUsers+1 as String)
      .create(Bundle)
    Bundle.commit()
    pcf.UserDetailPage.go(user)
  }
}
