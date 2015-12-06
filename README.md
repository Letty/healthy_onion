# Healthy Onion
## Or showing the disagreement of the tor directory authorities

There are a few thousand relays in the Tor network that clients can choose from to build circuits. All these relays need to register at a small number of central directory authorities to announce themselves and their capabilities in the network. The directory authorities exchange their views of the relays in the network, and the capabilities of each, once per hour and then publish a new network status consensus that clients use to build circuits.

In theory, the directory authorities would unanimously agree that a given relay does or does not have a given capability, but in practice, they don't.  In most cases it's sufficient if a majority of directory authorities agrees on a capability, though thin majorities make the network less robust than it could be against single directory failures or opinion changes.

The following graph shows how much the directory authorities disagree about certain capabilities.  If all the directory authorities agree on a capability, this is displayed in dark green.  If all of them agree that a relay does not have a capability, which may also be a perfectly valid case, this is shown in bright white.  But everything in between, displayed in brown or yellow, can be considered unhealthy for the network and may indicate problems in the underlying algorithms.