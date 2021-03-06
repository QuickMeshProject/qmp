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

package.path = package.path .. ";/etc/qmp/?.lua"

local sys = require "luci.sys"
local http = require "luci.http"
local uci = luci.model.uci.cursor()
local qmpinfo = require "qmpinfo"
local util = require "luci.util"

devices = qmpinfo.get_devices()

devname = uci:get("qmp","node","device_name")
devid = uci:get("qmp","node","device_id")
meshname = uci:get("qmp","node","mesh_name")

if (devname == nil or devname == '') then
  devname = "qMp"
end

if (devid == nil or devid == '') then
  devid = "0000"
end

if (meshname == nil or meshname == '') then
  meshname = "GS"
end

m = Map("qmp", "qMp node settings", translate("This page allows to configure the basic node settings, like the device identification, location and contact details.") .. "<br/> <br/>" .. translate("You can check the on-line documentation at <a href=\"https://www.qmp.cat/Web_interface\">https://www.qmp.cat/Web_interface</a> for more information about the different options."))

device_section = m:section(NamedSection, "node", "qmp", translate("Device identification"), translate("The following settings are used to identify the device all over the mesh network."))
device_section.addremove = False

device_name = device_section:option(Value,"device_name", translate("Device name"), translate("Use only alphanumeric characters, dots, dashes and underscores."))
device_name.datatype = "hostname"
device_name.optional = false
device_name.rmempty = false
device_name.default = "qMp"

community_name = device_section:option(Value, "community_name", translate ("Community Network name"), translate("Select a predefined community network from the list, type your own name or leave it blank."))
community_name.datatype="string"
community_name:value("Bogotá Mesh","Bogotá Mesh")
community_name:value("DigitalMerthyr","Digital Merthyr")
community_name:value("Guifi.net","Guifi.net")
community_name:value("NYCMesh","NYC Mesh")

guifimesh_name = device_section:option(Value, "mesh_name", translate ("Mesh Network name"), translate("Select a predefined community subnetwork or type your own name (optional)."))
guifimesh_name:depends("community_name","Guifi.net")
guifimesh_name.datatype="string"
guifimesh_name.default="GS"
guifimesh_name:value("GB", "Baix Llobregat - GuifiBaix (GB)")
guifimesh_name:value("HW", "Bellvitge (HW)")
guifimesh_name:value("GSF", "Gràcia Sense Fils (GSF)")
guifimesh_name:value("P9SF", "Poblenou Sense Fils (P9SF)")
guifimesh_name:value("QS", "Quesa (QS)")
guifimesh_name:value("RAV", "Raval (RAV)")
guifimesh_name:value("GS", "GuifiSants-Les Corts-UPC (GS)")
guifimesh_name:value("SAND", "Sant Andreu (SAND)")
guifimesh_name:value("VV", "Vallcarca (VKK)")
guifimesh_name:value("LHER", "La Herguijuela (LHER)")
guifimesh_name:value("CPD", "Cepeda la Mora (CPD)")

prepend_cnm = device_section:option(Flag, "prepend_cnm", translate("Prepend mesh ID"),translatef("Prepend the mesh network ID to the device name (e.g., %s-%s-%s)", meshname, devname, devid))
prepend_cnm:depends("community_name","Guifi.net")
prepend_cnm.default = 1
prepend_cnm.optional = false
prepend_cnm.rmempty = false

device_id = device_section:option(Value,"device_id", translate("Device ID"), translate("The ID of this device in the mesh network (optional). Use hexadecimal characters only."))
device_id:depends("community_name","Guifi.net")
device_id.datatype = "string"
device_id.optional = false
device_id.rmempty = false

append_id = device_section:option(Flag, "append_id", translate("Append ID"),translatef("Append the device ID to the device name (e.g., %s-%s)", devname, devid))
append_id:depends("community_name","Guifi.net")
append_id.default = 1
append_id.optional = false
append_id.rmempty = false


interface_section = m:section(NamedSection, "node", "qmp", translate("Primary interface"), translate("The following setting is used to auto-configure internal aspects of your device."))
interface_section.addremove = False

primary_device = interface_section:option(Value,"primary_device", translate("Primary network interface"), translate("The name of the node's primary network interface. The last four digits of this device's MAC address will be appended to the node name."))
primary_device.datatype = "network"
primary_device.optional = false
primary_device.rmempty = false
primary_device.default = "eth0"
for k,v in pairs (devices) do
  for l,w in pairs(v) do
    primary_device:value(w, w)
  end
end


location_section = m:section(NamedSection, "node", "qmp", translate("Device location"), translate("The following settings are used to geolocate the device on tools like <a href=\"http://libremap.guifi.net\">LibreMap</a>."))
location_section.addremove = False

geopos_lat = location_section:option(Value,"latitude", translate("Latitude"), translate("Use a dot as the decimal separator (ex.: 7.51)"))
geopos_lat.datatype = "range(-90, 90)"
geopos_lat.optional = true
geopos_lat.rmempty = false
geopos_lat.default = "0"

geopos_lon = location_section:option(Value,"longitude", translate("Longitude"), translate("Use a dot as the decimal separator (ex.: 76.83)"))
geopos_lon.datatype = "range(-180, 180)"
geopos_lon.optional = true
geopos_lon.rmempty = false
geopos_lon.default = "0"

geopos_elv = location_section:option(Value,"elevation", translate("Elevation"), translate("Node elevation, relative to the ground level, in meters (optional). Use a dot as the decimal separator (ex.: 20.5)"))
geopos_elv.datatype = "range(-11034, 300000)"
geopos_elv.optional = true
geopos_elv.rmempty = false
geopos_elv.default = "0"

contact_section = m:section(NamedSection, "node", "qmp", translate("Contact information"), translate("The contact information can be used to reach the owner of a node."))
contact_section.addremove = False

contact = contact_section:option(Value,"contact", translate("Contact e-mail"), translate("An e-mail to contact you if needed (optional)."))
contact.datatype = string
contact.optional = true
contact.rmempty = false
contact.default = "admin@qmp.cat"

------------
-- Commit --
------------
function m.on_commit(self,map)
	http.redirect("/luci-static/resources/qmp/wait_short.html")
	uci:commit("qmp")
	luci.sys.call('/etc/qmp/qmp_control.sh configure_system > /tmp/qmp_control_system.log &')
end

return m
