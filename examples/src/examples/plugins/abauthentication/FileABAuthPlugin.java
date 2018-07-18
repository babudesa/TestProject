package examples.plugins.abauthentication;

import com.guidewire.pl.plugin.addressbook.ABAuthenticationPlugin;

/**
 * Simple class that returns a username/password pair with a null username and a db password retrieved
 * from a file specified by the "filename" property.
 */
public class FileABAuthPlugin extends FileABAuthPluginBase implements ABAuthenticationPlugin {
}
