--[[
  qMp - Quick Mesh Project - https://www.qmp.cat
  Copyright © 2011-2017 Fundació Privada per a la Xarxa Oberta, Lliure i Neutral, guifi.net

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program. If not, see <http://www.gnu.org/licenses/>.
--]]

local sys = require "luci.sys"
local http = require "luci.http"
local uci = luci.model.uci.cursor()


------------
-- Header --
------------
m = Map("qmp", "qMp advanced network settings", translate("This page allows to configure the advanced network settings of a qMp device, like IPv4 and IPv6 addresses, prefixes, DHCP behaviour, etc.") .. "<br/> <br/>" .. translate("You can check the on-line documentation at <a href=\"https://www.qmp.cat/Web_interface\">https://www.qmp.cat/Web_interface</a> for more information about the different options."))

ethernet_interfaces = { 'eth', 'ath', 'wlan' }
wireless_interfaces = { 'ath', 'wlan' }

eth_section = m:section(NamedSection, "networks", "qmp", translate("IP addressing"), translate("Use this section to modify the advanced network settings that are not displayed in the qMp easy setup page."))
eth_section.addremove = False

-- Option: DNS
eth_section:option(Value, "dns", "DNS nameservers",translate("Define the nameservers to use.").." "..translate("Separate them with a blank space"))

-- Option: lan addresses
eth_section:option(Value, "lan_address", "LAN IP address",translate("IPv4 address for the LAN interfaces."))

-- Option: lan netmask
lannetmask=eth_section:option(Value, "lan_netmask", "LAN netmask",translate("IPv4 netmask for the LAN interfaces."))
lannetmask.datatype="ip4addr"

-- Option: publish lan
--eth_section:option(Flag, "publish_lan", "Publish LAN", "Publish LAN network through the mesh")

-- Option: disable dhcp lan
eth_section:option(Flag, "disable_lan_dhcp", "Disable DHCP server in LAN",
translate("Disable DHCP server in LAN network (not recommended)."))

-- Option: disable dhcp mesh
eth_section:option(Flag, "disable_mesh_dhcp", "Disable DHCP server in MESH",
translate("Disable DHCP server in MESH network devices."))

-- Option bmx6_ipv4_address
eth_section:option(Value, "bmx6_ipv4_address", "Main IPv4 address",
translate("Main IPv4 address used in bmx6. Leave it blank to get a random one."))

-- Option: bmx6_ipv4_prefix24
eth_section:option(Value, "bmx6_ipv4_prefix24", "Random-IPv4 prefix 24",
translate("Network prefix used to calculate a random IP address if the field above is left blank (example: 10.40.50)."))

-- Option: bmx6_ripe_prefix48
eth_section:option(Value, "bmx6_ripe_prefix48", "Main IPv6 prefix",
translate("If you have a global IPv6 48bits prefix, specify it here. Otherwise leave it blank."))

-- Option force_internet
fint = eth_section:option(ListValue, "force_internet", "Force internet",
translate("Use it if you want force the system to share/unshare Internet (it is recommended to leave it as disabled)"))
fint:value("","disabled")
fint:value("1","yes")
fint:value("0","no")


----------------------------
-- Non overlapping
---------------------------
overlapping_section = m:section(NamedSection, "roaming", "qmp", translate("Roaming mode"))
overlapping_section.addremove = False

ignore = overlapping_section:option(ListValue, "ignore", translate("Roaming"),translate("If roaming mode is enabled, each node will provide its LAN clients with IP addresses from different /24 pools in the same /16 subnetwork.").." "..translate("Leave it disabled for community networks or long-term deployments."))
ignore:value("1","no")
ignore:value("0","yes")

-- Option: dhcp_offset
overlapping_section:option(Value, "dhcp_offset", "DHCP offset",
translate("Offset to calculate the first IP to give via DHCP"))

-- Option: Leassetime
overlapping_section:option(Value, "qmp_leasetime", "DHCP lease time",translate("Lease time for the DHCP server"))


----------------------
-- Special settings
----------------------
special_section = m:section(NamedSection, "interfaces", "qmp", translate("Special settings"), translate("Use this section to disable VLAN tagging in certain interfaces or to exclude them from qMp."))
special_section.addremove = False

no_vlan = special_section:option(Value, "no_vlan_devices", translate("VLAN-untagged devices"),translate("Devices that will not be used with VLAN tagging (it is recommended to leave it blank)"))
ignore_devs = special_section:option(Value, "ignore_devices", translate("Excluded devices"),translate("Devices that will not be used by qMp"))


--------------------------
-- Commit
-------------------------
function m.on_commit(self,map)
  http.redirect("/luci-static/resources/qmp/wait_long.html")
  uci:commit("qmp")
	luci.sys.call('/etc/qmp/qmp_control.sh configure_all > /tmp/qmp_control_network.log &')
end


return m
