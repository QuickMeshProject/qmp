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

local sys = require("luci.sys")
local http = require "luci.http"
local util = require "luci.util"

local uciout = uci.cursor()

m = Map("qmp", "qMp basic network settings", translate("This page allows to configure the basic network settings qMp device, like the node mode or the mesh-wide public IPv4 address.") .. "<br/> <br/>" .. translate("You can check the on-line documentation at <a href=\"https://www.qmp.cat/Web_interface\">https://www.qmp.cat/Web_interface</a> for more information about the different options."))


-- Network mode change was requested, rebuild interface config and reload page
if m:formvalue("cbid.configuration.network.basic._switch") then
	-- Get new protocol
	   local ptype = m:formvalue("cbid.configuration.network.basic.ignore" % net:name()) or "-"

		-- reload page
		luci.http.redirect(luci.dispatcher.build_url("qmp/configuration/network/advanced", arg[1]))
		return
end

---------------
-- Node mode --
---------------
node_mode = m:section(NamedSection, "roaming", "qmp", translate("Node mode"),
            translate("The <em>node mode</em> option defines whether qMp makes the devices connected to the LAN interfaces of the node visible to the rest of the mesh network or hidden behind a NAT.") .. " " ..
            translate("Static, long-term deployments such as <em>community networks</em> usually choose <em>public</em> mode, whereas quick, temporal or ephemeral deployments usually choose <em>natted</em> mode.") .. "<br/> <br/>" ..
            translate("Choose an operating mode for this node:") .. "<br/> <br/>" ..
            translate("· <em>public</em> mode, for making local devices connected to this node accessible from anywhere in the mesh network") .. "<br/>" ..
            translate("· <em>natted</em> mode, for keeping local devices connected to this node hidden from the rest of the mesh by a NAT") .. "<br/> <br/>")
node_mode.addremove = false

roaming = node_mode:option(ListValue, "ignore", " ", translate("Select <em>public</em> or <em>natted</em> mode."))

nm_switch = node_mode:option(Button, "_switch")
nm_switch.title      = translate("Really switch mode?")
nm_switch.inputtitle = translate("Switch mode")
nm_switch.inputstyle = "apply"

rv = {}
rv["0"] = translate("natted")
rv["1"] = translate("public")

local i, nm
for i, nm in pairs(rv) do
  roaming:value(i, i.."-"..nm)
  if i ~= uciout:get("qmp","roaming","ignore") then
     nm_switch:depends("ignore", i)
    end
end


-------------------------------------
-- Natted mode public IPv4 address --
-------------------------------------
if  uciout:get("qmp","roaming","ignore") == "0" then

  public_address = m:section(NamedSection, "networks", "qmp", translate("Mesh-wide public IPv4 address and network mask (natted)"), translate("TODO"))
  public_address.addremove = false

  -- Option bmx6_ipv4_address
  nodeip = public_address:option(Value, "bmx6_ipv4_address", "Main IPv4 address", translate("TODO."))

elseif uciout:get("qmp","roaming","ignore") == "1" then

    public_address = m:section(NamedSection, "networks", "qmp", translate("Mesh-wide public IPv4 address and network mask (public)"), translate("TODO"))
    public_address.addremove = false

    -- Option bmx6_ipv4_address
    lanaddress = public_address:option(Value, "lan_address", "Main IPv4 address", translate("TODO."))
    lanaddress.default = "10.30."..util.trim(util.exec("echo $((($(date +%M)*$(date +%S)%254)+1))"))..".1"

end



--------------------------
-- Commit
-------------------------

function m.on_commit(self,map)
--	http.redirect("/luci-static/resources/qmp/wait_long.html")
	--luci.sys.call('/etc/qmp/qmp_control.sh configure_all > /tmp/qmp_control_network.log &')
end


return m
