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
local ip = require "luci.ip"
local util = require "luci.util"
local uci  = require "luci.model.uci"
local uciout = luci.model.uci.cursor()

package.path = package.path .. ";/etc/qmp/?.lua"
qmpinfo = require "qmpinfo"


------------
-- Header --
------------
m = SimpleForm("qmp", translate("qMp wired network interfaces"), translate("This page allows to configure the operation mode of the wired network interfaces (i.e. Ethernet interfaces).") .. "<br/> <br/>" .. translate("You can check the on-line documentation at <a href=\"https://www.qmp.cat/Web_interface\">https://www.qmp.cat/Web_interface</a> for more information about the different options."))


------------------------
-- Network interfaces --
------------------------
-- Ethernet devices' mode
local wired_interface_mode_help
wired_interface_mode_help = m:field(DummyValue,"wired_interface_mode_help")
wired_interface_mode_help.rawhtml = true
wired_interface_mode_help.default = "<legend>" .. translate("Network modes") .. "</legend>" .. " </br>" ..
  translate("Select the working mode of the wired network interfaces") .. ":<br/> <br/>" ..
  translate("· <em>LAN</em> mode is used to provide connectivity to end-users (a DHCP server will be enabled to assign IP addresses to the devices connecting)") .. "<br/>" ..
  translate(" · <em>WAN</em> mode is used on interfaces connected to an Internet up-link or any other gateway connection") .. "<br/>" ..
  translate(" · <em>None</em>, to not use the interface neither as LAN nor as WAN") .. "<br/>"

-- Get list of devices {{ethernet}{wireless}}
devices = qmpinfo.get_devices()

nodedevs_eth = {}

local function is_a(dev, what)
  local x
  for x in util.imatch(uciout:get("qmp", "interfaces", what)) do
    if dev == x then
      return true
    end
  end
  return false
end

for i,v in ipairs(devices.eth) do
  emode = m:field(ListValue, "_" .. v, translatef("Wired interface <strong>%s</strong>",v))
  emode:value("Lan", translate("LAN"))
  emode:value("Wan", translate("WAN"))
  emode:value("none", translate("None"))

  if is_a(v, "lan_devices") then
    emode.default = "Lan"
  elseif is_a(v, "wan_devices") then
    emode.default = "Wan"
  else
    emode.default = "none"
  end

  nodedevs_eth[i] = {v,emode}
end


-- Cabled mesh
local wired_interface_mesh_help
wired_interface_mesh_help = m:field(DummyValue,"wired_interface_mesh_help")
wired_interface_mesh_help.rawhtml = true
wired_interface_mesh_help.default = "<legend>" .. translate("Mesh over cable") .. "</legend>" .. " </br>" ..
  translate("Select which wired devices will be used to expand the mesh via cable.") .. " " .. translate("<em>Mesh via wired interface</em> is used to expand the mesh network when connecting the wired interface to other qMp devices") .. "<br/> <br/>"

nodedevs_ethmesh = {}

for i,v in ipairs(devices.eth) do
  emeshmode = m:field(ListValue, "_" .. v .."mesh", translatef("Mesh via <strong>%s</strong>",v))
  emeshmode:value("Mesh", translate("Yes"))
  emeshmode:value("none", translate("No"))

  if is_a(v, "mesh_devices") then
    emeshmode.default = "Mesh"
  else
    emeshmode.default = "none"
  end

nodedevs_ethmesh[i] = {v,emeshmode}
end

function emode.write(self, section, value)

  local lan_devices = ""
  local wan_devices = ""
  local mesh_devices = ""

  -- Keep wireless devices unmodified
  for i,v in ipairs(devices.wifi) do
    if is_a(v, "lan_devices") then
      lan_devices = lan_devices .. v .. " "
    end
    if is_a(v, "wan_devices") then
      wan_devices = wan_devices .. v .. " "
    end
    if is_a(v, "mesh_devices") then
      mesh_devices = mesh_devices .. v .. " "
    end
  end

  for i,v in ipairs(nodedevs_eth) do
    devname = v[1]
    devmode = v[2]:formvalue(section)

    if devmode == "Lan" then
      lan_devices = lan_devices..devname.." "
    elseif devmode == "Wan" then
      wan_devices = wan_devices..devname.." "
    end
  end

  for i,v in ipairs(nodedevs_ethmesh) do
    devname = v[1]
    devmode = v[2]:formvalue(section)

    if devmode == "Mesh" then
      mesh_devices = mesh_devices..devname.." "
    end
  end

  uciout:set("qmp","interfaces","lan_devices",lan_devices)
  uciout:set("qmp","interfaces","wan_devices",wan_devices)
  uciout:set("qmp","interfaces","mesh_devices",mesh_devices)

  uciout:commit("qmp")
  apply()
end

function apply(self)
  http.redirect("/luci-static/resources/qmp/wait_long.html")
  luci.sys.call('(qmpcontrol configure_wifi ; qmpcontrol configure_network) &')
end


return m
