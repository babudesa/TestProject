package com.guidewire.cc.plugin.messaging;

import com.guidewire.pl.plugin.PluginCallbackHandler;

import java.util.Map;

/**
 * Base implementation of the MessageReply interface that stores local copies
 * of the supplied PluginCallbackHandler and MessageFinder instances.
 * Subclasses will use these to look up and acknowledge messages.
 */
public abstract class MessageReplyBase implements MessageReply {
  protected PluginCallbackHandler _pluginCallbackHandler;
  protected MessageFinder _messageFinder;

  public void initTools(PluginCallbackHandler pluginCallbackHandler, MessageFinder messageFinder) {
    _pluginCallbackHandler = pluginCallbackHandler;
    _messageFinder = messageFinder;
  }
}