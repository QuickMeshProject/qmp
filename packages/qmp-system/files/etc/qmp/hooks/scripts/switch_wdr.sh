#!/bin/sh
# Stage = [boot|pre|post]
STAGE="$1"

[ "$STAGE" == "boot" ] && {

echo "Configuring TPlink WDR switch [INET|LAN|LAN|LAN|MESH]"

uci delete network.@switch[0]
uci add network switch

uci delete network.@switch_vlan[2]
uci delete network.@switch_vlan[1]
uci delete network.@switch_vlan[0]

uci add network switch_vlan > /dev/null
uci add network switch_vlan > /dev/null
uci add network switch_vlan > /dev/null

uci set network.@switch[0]=switch
uci set network.@switch[0].name=eth0
uci set network.@switch[0].reset=1
uci set network.@switch[0].enable_vlan=1
uci set network.@switch_vlan[0]=switch_vlan
uci set network.@switch_vlan[0].device=eth0
uci set network.@switch_vlan[0].vlan=1
uci set network.@switch_vlan[0].vid=1
uci set network.@switch_vlan[0].ports="0t 2 3 4"
uci set network.@switch_vlan[1]=switch_vlan
uci set network.@switch_vlan[1].device=eth0
uci set network.@switch_vlan[1].vlan=2
uci set network.@switch_vlan[1].ports="0t 1"
uci set network.@switch_vlan[1].vid=2
uci set network.@switch_vlan[2]=switch_vlan
uci set network.@switch_vlan[2].device=eth0
uci set network.@switch_vlan[2].vlan=3
uci set network.@switch_vlan[2].ports="0t 5t"
uci set network.@switch_vlan[2].vid=12

uci commit network
}