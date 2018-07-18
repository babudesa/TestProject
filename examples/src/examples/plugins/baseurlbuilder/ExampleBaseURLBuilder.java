package examples.plugins.baseurlbuilder;

import com.guidewire.pl.plugin.baseurlbuilder.IBaseURLBuilder;

/**
 * Example URL builder, for testing only. Very like the built in URL builder except that it upper
 * cases the scheme (HTTP or HTTPS). This doesn't have any effect but is useful for testing, to
 * see if the example URL builder is being called instead of the built in builder
 */
public class ExampleBaseURLBuilder extends ExampleBaseURLBuilderBase implements IBaseURLBuilder {
}
