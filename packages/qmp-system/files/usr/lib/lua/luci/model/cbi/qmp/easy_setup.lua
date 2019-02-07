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
m = SimpleForm("qmp", translate("qMp easy setup"), translate("This page provides a fast and simple way to configure the basic settings of a qMp device.") .. " " .. translate("Use the form below to specify the required settings, such as the node mode, name or identifier, IP address and interface operation modes.") .. "<br/> <br/>" .. translate("You can check the on-line documentation at <a href=\"https://www.qmp.cat/Web_interface\">https://www.qmp.cat/Web_interface</a> for more information about the different options."))

---------------------------
-- Device identification --
---------------------------

-- Device name
local devicename_help
local devicename_help = m:field(DummyValue,"_devicename_help")
devicename_help.rawhtml = true
devicename_help.default = "<legend>"..translate("Device identification").."</legend>".."<br/> <br/>"..translate("Choose a name for this device. It will be used to identify it in the mesh network.").."<br/> <br/>"

local devicename = m:field(Value, "_devicename", " ", translate("Use only alphanumeric characters, dots, dashes and underscores."))
devicename.datatype="hostname"
devicename.optional=false
devicename.default="MyMeshDevice"

if uciout:get("qmp","node","device_name") ~= nil then
  devicename.default=uciout:get("qmp","node","device_name")
end


-- Community network name
local communityname_help
communityname_help = m:field(DummyValue,"_communityname_help")
communityname_help.rawhtml = true
communityname_help.default = translate("Select the name of the community network this device belongs to.") .. "<br/> <br/>"

local communityname = m:field(Value, "_communityname", " ", translate("Select a predefined community network from the list, type your own name or leave it blank."))
communityname.datatype="string"
communityname:value("Bogotá Mesh","Bogotá Mesh")
communityname:value("DigitalMerthyr","Digital Merthyr")
communityname:value("Guifi.net","Guifi.net")
communityname:value("NYCMesh","NYC Mesh")

if uciout:get("qmp","node","community_name") ~= nil then
  communityname.default=uciout:get("qmp","node","community_name")
end


-- Mesh network name
local guifimeshname = m:field(Value, "_guifimeshname", " ", translate("Select a predefined mesh network, type your own name or leave it blank."))
guifimeshname:depends("_communityname","Guifi.net")
guifimeshname.datatype="string"
guifimeshname.default="GuifiSants"
guifimeshname:value("GuifiBaix", "Baix Llobregat (GuifiBaix)")
guifimeshname:value("Bellvitge", "Bellvitge (HW)")
guifimeshname:value("GraciaSenseFils", "Gràcia Sense Fils (GSF)")
guifimeshname:value("PoblenouSenseFils", "Poblenou Sense Fils (P9SF)")
guifimeshname:value("Quesa", "Quesa (QUESA)")
guifimeshname:value("Raval", "Raval (RAV)")
guifimeshname:value("GuifiSants", "Sants-Les Corts-UPC (GS)")
guifimeshname:value("SantAndreu", "Sant Andreu (SAND)")
guifimeshname:value("Vallcarca", "Vallcarca (VKK)")

if uciout:get("qmp","node","mesh_name") ~= nil then
  guifimeshname.default=uciout:get("qmp","node","mesh_name")
end

-- Guifi device
local guifideviceid = m:field(Value, "_guifideviceid", " ", translate("Device ID in Guifi.net's web site. Use numbers only."))
guifideviceid:depends({_communityname = "Guifi.net"})
guifideviceid.datatype="uinteger"

if uciout:get("qmp","node","device_id") ~= nil then
  guifideviceid.default=uciout:get("qmp","node","device_id")
end


----------------------------------------
-- Node mode and public IPv4 address  --
----------------------------------------

-- Node mode
local mode_help
mode_help = m:field(DummyValue,"mode_help")
mode_help.rawhtml = true
mode_help.default = "<legend>" .. translate("Node mode and mesh-wide public IPv4 address") .. "</legend>" .. "<br/> <br/>" ..
  translate("The <em>node mode</em> option defines whether qMp makes the devices connected to the LAN interfaces of the node visible to the rest of the mesh network or hidden behind a NAT.") .. " " ..
  translate("Static, long-term deployments such as <em>community networks</em> usually choose <em>public</em> mode, whereas quick, temporal or ephemeral deployments usually choose <em>natted</em> mode.") .. "<br/> <br/>" ..
  translate("Choose an operating mode for this node:") .. "<br/> <br/>" ..
  translate("· <em>public</em> mode, for making local devices connected to this node accessible from anywhere in the mesh network") .. "<br/>" ..
  translate("· <em>natted</em> mode, for keeping local devices connected to this node hidden from the rest of the mesh by a NAT") .. "<br/> <br/>"

nodemode = m:field(ListValue, "_nodemode", translate(" "), translate("Select <em>public</em> or <em>natted</em> mode."))
nodemode:value("community","public")
nodemode:value("roaming","natted")

local networkmode
if uciout:get("qmp","roaming","ignore") == "1" then
  local ipv4 = uciout:get("qmp","networks","bmx6_ipv4_address")
  if ipv4 ~= nil then
   local ipv4mask = string.find(ipv4,"/")
  end
  if ipv4mask ~= nil then
    ipv4 = string.sub(ipv4,1,ipv4mask-1)
  end
  -- This caused issue #465 and doesn't make much sense here... (ToDo: investigate further)
  -- if ipv4 == uciout:get("qmp","networks","lan_address") then
    networkmode="community"
  -- end
else
  networkmode="roaming"
end
nodemode.default=networkmode


-- Mesh IPv4 address (natted)
local roaming_ipaddress_help
roaming_ipaddress_help = m:field(DummyValue,"roaming_ipaddress_help")
roaming_ipaddress_help.rawhtml = true
roaming_ipaddress_help:depends("_nodemode","roaming")
roaming_ipaddress_help.default = translate("In <em>natted</em> mode, all qMp devices in the mesh network need a unique IPv4 address with a /32 netmask.") .. " " ..
  translate("If unsure about which one to select, leave the field blank and a random one will be assigned automatically.").."<br/> <br/>"

local nodeip_roaming =  m:field(Value, "_nodeip_roaming", " ", translate("Write the mesh-wide public IPv4 address for this device with a /32 netmask, or leave it blank to get a random one."))
nodeip_roaming:depends("_nodemode","roaming")
nodeip_roaming.datatype="cidr4"

local rip = uciout:get("qmp","networks","bmx6_ipv4_address")
if rip == nil or #rip < 7 then
  rip = uciout:get("bmx6","general","tun4Address")
  if rip == nil or #rip < 7 then
    rip = ""
  end
end

nodeip_roaming.default=rip


-- Mesh IPv4 address (public)
local community_addressing_help
community_addressing_help = m:field(DummyValue,"community_addressing_help")
community_addressing_help.rawhtml = true
community_addressing_help:depends("_nodemode","community")
community_addressing_help.default = "<strong>" .. " " .. "</strong>" .. "<br/> <br/>" ..
  translate("In <em>public</em> mode, all qMp devices in the mesh network need a unique IPv4 address and a subnetwork mask.") .. " " ..
  translate("Specify the IP address and the subnetwork mask for this device, according to the planning of your community network or deployment.") .. " " ..
  translate("End-user devices will get an IPv4 address within the valid range determined by these two values.").."<br/> <br/>"

local nodeip = m:field(Value, "_nodeip", " ", translate("Main IPv4 address for this device."))
nodeip:depends("_nodemode","community")
nodeip.optional=false
nodeip.datatype="ip4addr"

local pip = uciout:get("qmp","networks","bmx6_ipv4_address")
if pip == nil or #pip < 7 then
  pip = uciout:get("bmx6","general","tun4Address")
  if pip == nil or #pip < 7 then
    pip = "10.30."..util.trim(util.exec("echo $((($(date +%M)*$(date +%S)%254)+1))"))..".1"
  end
end

if string.find(pip, "/") then
  pip = string.sub(pip, 0, string.find(pip, "/") -1)
end

nodeip.default=pip





-- Mesh IPv4 netmask (public)
local nodemask = m:field(Value, "_nodemask"," ", translate("Network mask to be used with the IPv4 address above."))
nodemask:depends("_nodemode","community")
nodemask.default = "255.255.255.224"
nodemask:value("255.255.255.0", "255.255.255.0 (/24, 254 hosts)")
nodemask:value("255.255.255.128", "255.255.255.128 (/25, 126 hosts)")
nodemask:value("255.255.255.192", "255.255.255.192 (/26, 62 hosts)")
nodemask:value("255.255.255.224", "255.255.255.224 (/27, 30 hosts)")
nodemask:value("255.255.255.240", "255.255.255.240 (/28, 14 hosts)")
nodemask:value("255.255.255.248", "255.255.255.248 (/29, 6 hosts)")
nodemask.datatype="ip4addr"

if networkmode == "community" then
  nodeip.default=uciout:get("qmp","networks","lan_address")
  nodemask.default=uciout:get("qmp","networks","lan_netmask")
end


------------------------
-- Network interfaces --
------------------------

-- Wired interfaces
local wired_interface_mode_help
wired_interface_mode_help = m:field(DummyValue,"wired_interface_mode_help")
wired_interface_mode_help.rawhtml = true
wired_interface_mode_help.default = "<legend>" .. translate("Network interfaces") .. "</legend>" .. "<br/> <br/>" ..
  translate("Select the working mode of the wired network interfaces") .. ":<br/> <br/>" ..
  translate("· <em>LAN</em> mode is used to provide connectivity to end-users (a DHCP server will be enabled to assign IP addresses to the devices connecting)") .. "<br/>" ..
  translate(" · <em>WAN</em> mode is used on interfaces connected to an Internet up-link or any other gateway connection") .. "<br/>" ..
  translate(" · <em>None</em>, to not use the interface neither as LAN nor as WAN") .. "<br/> <br/>" ..
  translate(" · <em>Mesh via wired interface</em> is used to expand the mesh network when connecting the wired interface to other qMp devices") .. "<br/> <br/>"

-- Get list of devices {{ethernet}{wireless}}
devices = qmpinfo.get_devices()

-- Ethernet devices
nodedevs_eth = {}
nodedevs_ethmesh = {}

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

  emeshmode = m:field(ListValue, "_" .. v.."mesh", translatef("Mesh via <strong>%s</strong>",v))
  emeshmode:value("Mesh", translate("Yes"))
  emeshmode:value("none", translate("No"))

  if is_a(v, "mesh_devices") then
    emeshmode.default = "Mesh"
  else
    emeshmode.default = "none"
  end

  nodedevs_eth[i] = {v,emode}
  nodedevs_ethmesh[i] = {v,emeshmode}
end


-- Wireless interfaces
local wireless_interface_mode_help
wireless_interface_mode_help = m:field(DummyValue,"wireless_interface_mode_help")
wireless_interface_mode_help.rawhtml = true
wireless_interface_mode_help.default = translate("Select the working mode of the wireless network interfaces:") .. "<br/> <br/>" ..
  translate("· <em>802.11s (mesh)</em> mode is used to link with other mesh nodes operating in <strong>current 802.11s mesh</strong> mode") .."<br/>" ..
  translate("· <em>802.11s (mesh) + Ad hoc (legacy mesh)</em> mode is used to link with other mesh nodes operating in <strong>current 802.11s mesh</strong> or in <strong>legacy ad hoc mesh</strong> mode. Use this one for <strong>backwards compatibility</strong> with old qMp deployments.") .."<br/>" ..
  translate("· <em>Ad hoc (legacy mesh)</em> mode is used to link with other mesh nodes operating in <strong>legacy ad hoc mesh</strong> mode") .. "<br/>" ..
  translate("· <em>AP (mesh)</em> mode is used to create an access point for other mesh nodes to connect as clients") .. "<br/>" ..
  translate("· <em>Client (mesh)</em> mode is used to link with a mesh node operating in AP mode") .. "<br/>" ..
  translate("· <em>AP (LAN)</em> mode is used to generate an access point for end users' devices") .. "<br/>" ..
  translate("· <em>Client (WAN)</em> mode is used to link work as a client of an access point providing an up-link Internet access") .. "<br/>"..
  translate("· <em>Ad hoc (mesh) + AP (LAN)</em> combines both modes on a single interface") .. "<br/>" ..
  translate("· <em>802.11s (mesh) + AP (LAN)</strong> combines both modes on a single interface").."<br/> <br/>"

nodedevs_wifi = {}

for i,v in ipairs(devices.wifi) do
  wmode = m:field(ListValue, "_"..v.."_mode", translatef("Wireless interface <strong>%s</strong>",v))
  wmode:value("80211s","802.11s (mesh)")
  wmode:value("80211s_adhoc","802.11s (mesh) + Ad hoc (legacy mesh)")
  wmode:value("adhoc","Ad hoc (legacy mesh)")
  wmode:value("ap","Access point (mesh)")
  wmode:value("client","Client (mesh)")
  wmode:value("aplan","Access point (LAN)")
  wmode:value("clientwan","Client (WAN)")
  wmode:value("adhoc_ap","Ad hoc (mesh) + access point (LAN)")
  wmode:value("80211s_aplan","802.11s (mesh) + access point (LAN)")
  wmode:value("none","Disabled")
  wmode.default = "80211s_aplan"

  wchan = m:field(ListValue, "_".. v.."_chan", translate("Channel"))
  for _,ch in ipairs(qmpinfo.get_channels(v)) do
    wchan:value(ch.channel, ch.channel)
    if ch.ht40p then wchan:value(ch.channel .. '+', ch.channel .. '+') end
    if ch.ht40m then wchan:value(ch.channel .. '-', ch.channel .. '-') end
    if ch.channel < 15 then wchan:value(ch.channel .. 'b', ch.channel .. 'b') end
  end

  -- Check if the device is adhoc_ap mode, then Mode=AP MeshAll=1
  uciout:foreach("qmp","wireless", function (s)
    if s.device == v then
      if s.mode ~= nil then
        wmode.default = s.mode
        wchan.default = s.channel
      end
    end
  end)

  nodedevs_wifi[i] = {v,wmode,wchan}
end



function nodemode.write(self, section, value)
  local device_name = devicename:formvalue(section)
  local mode = nodemode:formvalue(section)
  local nodeip = nodeip:formvalue(section)
  local nodemask = nodemask:formvalue(section)
  local nodeip_roaming = nodeip_roaming:formvalue(section)

  local community_name = communityname:formvalue(section)
  if community_name == "Guifi.net" then
    local mesh_name = guifimeshname:formvalue(section)
    local device_id = guifideviceid:formvalue(section)
    uciout:set("qmp","node","mesh_name",mesh_name)
    uciout:set("qmp","node","device_id",device_id)
  end
  uciout:set("qmp","node","community_name",community_name)


  if mode == "community" then
    uciout:set("qmp","roaming","ignore","1")
    uciout:set("qmp","networks","publish_lan","1")
    uciout:set("qmp","networks","lan_address",nodeip)
    uciout:set("qmp","networks","bmx6_ipv4_address",ip.IPv4(nodeip,nodemask):string())
    uciout:set("qmp","networks","lan_netmask",nodemask)
    uciout:set("qmp","node","device_name",device_name)
    uciout:set("qmp","node","community_name",community_name)

  else
    uciout:set("qmp","roaming","ignore","0")
    uciout:set("qmp","networks","publish_lan","0")
    uciout:set("qmp","networks","lan_address","172.30.22.1")
    uciout:set("qmp","networks","lan_netmask","255.255.0.0")
    uciout:set("qmp","networks","bmx6_ipv4_prefix24","10.202.0")
    uciout:set("qmp","node","device_name",device_name)
    if nodeip_roaming == nil then
      uciout:set("qmp","networks","bmx6_ipv4_address","")
    else
      uciout:set("qmp","networks","bmx6_ipv4_address",nodeip_roaming)
    end

  end

  local i,v,devmode,devname
  local lan_devices = ""
  local wan_devices = ""
  local mesh_devices = ""
  local meshall = "1"

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

  for i,v in ipairs(nodedevs_wifi) do
    devname = v[1]
    devmode = v[2]:formvalue(section)
    devchan = v[3]:formvalue(section)


    if (devmode == "AP" and meshall == "1") or devmode == "Mesh" then
      mesh_devices = mesh_devices..devname.." "
    elseif devmode == "AP" and meshall ~= "1" then
      lan_devices = lan_devices..devname.." "
    end

    function setwmode(s)
      if s.device == devname then
        uciout:set("qmp",s['.name'],"mode",devmode)
        uciout:set("qmp",s['.name'],"channel",devchan)
      end
    end
    uciout:foreach("qmp","wireless",setwmode)
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
