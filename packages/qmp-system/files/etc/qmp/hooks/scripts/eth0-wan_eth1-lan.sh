#!/bin/sh
# Stage = [birth|firstboot|anyboot|preconf|postconf]
STAGE="$1"

[ "$STAGE" == "birth" ] && {
	echo "Configuring eth0 as wan+mesh and eth1.1 as lan+mesh"
	uci set qmp.interfaces.lan_devices="eth1.1"
	uci set qmp.interfaces.ignore_devices="eth1"
	uci set qmp.interfaces.wan_devices="eth0"
	uci set qmp.interfaces.mesh_devices="eth0 eth1.1"
	uci commit qmp
}
