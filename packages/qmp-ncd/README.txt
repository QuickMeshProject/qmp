Lua Network Characterization Daemon (Lunced)
--------------------------------------------

Lunced is an OpenWrt daemon written in Lua for the NC tool of the Confine OC2 project. It provides information to the NC web user interface about the node itself via Ubus and other nodes in the network using JSON over HTTP.



Requirements
------------

Lunced needs the libubox-lua package. You can install it on your node by typing:

opkg update
opkg install libubox-lua



Installation
------------

Copy the contents of the packages/lunced/files folder to the / on your device. Then enable the daemon (/etc/init.d/lunced enable) and start it (/etc/init.d/lunced start).
