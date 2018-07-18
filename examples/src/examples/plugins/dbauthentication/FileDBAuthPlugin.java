package examples.plugins.dbauthentication;

import com.guidewire.pl.plugin.dbauth.DBAuthenticationPlugin;

/**
 * Simple class that returns a username/password pair with a null username and a db password retrieved
 * from a file specified by the "filename" property.
 */

public class FileDBAuthPlugin extends FileDBAuthPluginBase implements DBAuthenticationPlugin {
}
