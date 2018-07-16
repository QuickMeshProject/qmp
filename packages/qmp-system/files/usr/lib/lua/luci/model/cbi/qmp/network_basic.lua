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
local ip = require "luci.ip"
local uci = luci.model.uci.cursor()


------------
-- Header --
------------
m = Map("qmp", "qMp basic network settings", translate("This page allows to configure the basic network settings of a qMp device, like the node mode or the mesh-wide public IPv4 address.") .. "<br/> <br/>" .. translate("You can check the on-line documentation at <a href=\"https://www.qmp.cat/Web_interface\">https://www.qmp.cat/Web_interface</a> for more information about the different options."))

-- Network mode change was requested, rebuild and reload page
if m:formvalue("cbid.qmp.roaming.ignore") ~= nil then
  if m:formvalue("cbid.qmp.roaming.ignore") ~= uci:get("qmp","roaming","ignore") then

    m:set("roaming", "ignore", m:formvalue("cbid.qmp.roaming.ignore"))

    -- if switching to natted, set LAN address to default 172.30.22.1/16
    -- and use the public mesh address with a /32 netmask
    if m:formvalue("cbid.qmp.roaming.ignore") == "0" then
      m:set("networks", "lan_netmask", "255.255.0.0")
      m:set("networks", "lan_address", "172.30.22.1")
      if uci:get("qmp","networks","bmx6_ipv4_address") ~= nil then
        bmx6ipv4address = uci:get("qmp","networks","bmx6_ipv4_address")
        bmx6ipv4 = string.sub( bmx6ipv4address, 1, string.find(bmx6ipv4address, "/" , 1 , true)-1 )
        m:set("networks", "bmx6_ipv4_address", bmx6ipv4 .. '/32')
      end

      -- if switching to public, set LAN address to the public mesh address with
      -- a /27 netmask by default; the public mesh address is generated on submit
    elseif m:formvalue("cbid.qmp.roaming.ignore") == "1" then
      m:set("networks", "lan_netmask", "255.255.255.224")
      m:set("networks", "lan_address", "10.30."..util.trim(util.exec("echo $((($(date +%M)*$(date +%S)%254)+1))"))..".1")
      if uci:get("qmp","networks","bmx6_ipv4_address") ~= nil then
        bmx6ipv4address = uci:get("qmp","networks","bmx6_ipv4_address")
        bmx6ipv4 = string.sub( bmx6ipv4address, 1, string.find(bmx6ipv4address, "/" , 1 , true)-1 )
        m:set("networks", "lan_address", bmx6ipv4)
      end
    end

    m.uci:save("qmp")
    luci.http.redirect(luci.dispatcher.build_url("qmp/configuration/network/basic"))
    return
  end
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
  roaming:value(i, nm)
  if i ~= uci:get("qmp","roaming","ignore") then
    nm_switch:depends("ignore", i)
  end
end


--------------------------------
-- Natted mode IPv4 addresses --
--------------------------------
if uci:get("qmp","roaming","ignore") == "0" then

  natted_mode = m:section(NamedSection, "networks", "qmp", translate("Mesh-wide public and private LAN IPv4 addresses (<em>natted</em> mode)"),
    translate("In <em>natted</em> mode, all qMp devices in the mesh network need a unique IPv4 address with a /32 netmask.") .. " " ..
    translate("Additionally, the LAN interfaces are put in the br-lan bridge interface, which is configured with a private IPv4 subnetwork behind a NAT."))
  natted_mode.addremove = false

  meshaddress = natted_mode:option(Value, "bmx6_ipv4_address", "Mesh-wide public IPv4 address", translate("Write the mesh-wide public IPv4 address for this device with a /32 netmask (recommended)."))
  if uci:get("qmp","networks","bmx6_ipv4_prefix24") ~= nil then
    meshaddress.default = uci:get("qmp","networks","bmx6_ipv4_prefix24") .. '.' .. util.trim(util.exec("echo $((($(date +%M)*$(date +%S)%254)+1))")) .. '/32'
  end
  meshaddress.datatype = "cidr4"
  meshaddress.optional = false
  meshaddress.rmempty = false

  lanaddress = natted_mode:option(Value, "lan_address", "Private LAN IPv4 address", translate("Write the private LAN IPv4 address for this device."))
  lanaddress.datatype = "ip4addr"
  lanaddress.default = "172.30.22.1"
  lanaddress.optional = false
  lanaddress.rmempty = false

  lannetmask = natted_mode:option(Value, "lan_netmask", "Private LAN IPv4 netmask", translate("Write the private LAN IPv4 netmask."))
  lannetmask.datatype = "ip4addr"
  lannetmask.default = "255.255.255.0"
  lannetmask.optional = false
  lannetmask.rmempty = false

  -------------------------------------
  -- Public mode public IPv4 address --
  -------------------------------------
elseif uci:get("qmp","roaming","ignore") == "1" then

  public_mode = m:section(NamedSection, "networks", "qmp", translate("Mesh-wide public IPv4 address and network mask (<em>public</em> mode)"),
    translate("In <em>public</em> mode, all qMp devices in the mesh network need a unique IPv4 address and a subnetwork mask.") .. " " ..
    translate("Specify the IPv4 address and subnetwork mask for this device, according to the planning of your community network or deployment.") .. " " ..
    translate("End-user devices will get an IPv4 address within the valid range determined by these two values."))
  public_mode.addremove = false

  lanaddress = public_mode:option(Value, "lan_address", "Mesh-wide public IPv4 address", translate("Write the mesh-wide public IPv4 address for this device."))
  lanaddress.default = "10.30."..util.trim(util.exec("echo $((($(date +%M)*$(date +%S)%254)+1))"))..".1"
  lanaddress.datatype="ip4addr"

  lannetmask = public_mode:option(Value, "lan_netmask", "IPv4 subnetwork mask", translate("Write the network mask to be used with the IPv4 address above."))
  lannetmask.datatype = "ip4addr"
  lannetmask.default = "255.255.255.224"
  lannetmask:value("255.255.0.0", "255.255.0.0 (/16, 65534 hosts)")
  lannetmask:value("255.255.255.0", "255.255.255.0 (/24, 254 hosts)")
  lannetmask:value("255.255.255.128", "255.255.255.128 (/25, 126 hosts)")
  lannetmask:value("255.255.255.192", "255.255.255.192 (/26, 62 hosts)")
  lannetmask:value("255.255.255.224", "255.255.255.224 (/27, 30 hosts)")
  lannetmask:value("255.255.255.240", "255.255.255.240 (/28, 14 hosts)")
  lannetmask:value("255.255.255.248", "255.255.255.248 (/29, 6 hosts)")
  lannetmask.datatype="ip4addr"

end


--------------------------
-- Commit
-------------------------

function m.on_commit(self,map)
  http.redirect("/luci-static/resources/qmp/wait_long.html")

  -- Public mode:
  -- generate public mesh address and publish the whole LAN to the mesh
  if uci:get("qmp","roaming","ignore") == "1" then
    local lanip = m:formvalue("cbid.qmp.networks.lan_address")
    local lanmask = m:formvalue("cbid.qmp.networks.lan_netmask")
    uci:set("qmp","networks","bmx6_ipv4_address",ip.IPv4(lanip,lanmask):string())
    uci:set("qmp","networks","publish_lan","1")

    -- Natted mode:
    -- unpublish the whole LAN from the mesh
  elseif uci:get("qmp","roaming","ignore") == "0" then
    uci:set("qmp","networks","publish_lan","0")
  end

  uci:commit("qmp")
  luci.sys.call('/etc/qmp/qmp_control.sh configure_all > /tmp/qmp_control_network.log &')
end


return m
