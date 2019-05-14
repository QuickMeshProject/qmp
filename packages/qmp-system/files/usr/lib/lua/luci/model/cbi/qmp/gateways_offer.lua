--[[
  Copyright © 2019 Quick Mesh Project - https://www.qmp.cat
  SPDX-License-Identifier: GPL-3.0-or-later
--]]

local sys = require "luci.sys"
local http = require "luci.http"
local uci = luci.model.uci.cursor()

------------
-- Header --
------------
m = Map("gateways", "qMp gateways", translate("This page allows configuring the type of tunnels or gateways this qMp node must search for from other nodes in the mesh, and which gateways (e.g., an Internet connection) can offer to the other nodes in the mesh..")
  .. "<br/> <br/>"
  .. translate("You can check the on-line documentation at <a href=\"https://www.qmp.cat/Web_interface\">https://www.qmp.cat/Web_interface</a> for more information about the different options."))

gw_section = m:section(TypedSection, "infogateway",
  translate("Gateways to offer"),
  translate("Use this tab to configure the gateways and network announcements your node will offer to other nodes in the mesh (e.g., to share an Internet connection, to offer a route to a specific subnetwork).")
  .. "<br/> <br/><strong>"..translate("Use with care!").."</strong> "
  .. translate("Publising incorrect announcements might cause other nodes to lose Internet connection or render the mesh network inoperative."))

----------------------
-- Gateways section --
----------------------

-- Get the gateways to offer
gw_names = {}
uci:foreach('gateways', 'gateway', function (s)
  local name = s[".name"]
  local gwtype = uci:get('gateways', name, 'type')
  if (name ~= nil and gwtype == 'offer') then
    table.insert(gw_names, name)
  end
end)

for _,gw in ipairs(gw_names) do

  gw_section = m:section(NamedSection, gw, "Gateway section", 'Gateway "' .. gw .. '"')

  -- Default parameters
  ignore = gw_section:option(Flag,"ignore", "<b>"..translate("Enabled").."</b>", translate("Enable this rule"))
  ignore.default="0"
  ignore.disabled="1"
  ignore.enabled="0"

  type = gw_section:option(ListValue,"type", "<b>"..translate("Type").."</b>",translate("offer = announce some specific network in the mesh, search = look for some specific network"))
  -- type:value("search","search")
  type:value("offer","offer")
  type.optional = false
  type.hidden = true

  network = gw_section:option(Value,"network", "<b>"..translate("Network").."</b>",translate("network to be offered/searched. NETWORK/PREFIX must be specified, for example 10.0.0.0/8 or 0.0.0.0/0"))
  network.optional = false

  -- Optional parameters (not using all BMX6 tun options)
  local gwoptions = {
  {["name"]="bandwidth", ["help"]="network bandwidth (bits/sec) (default: 1000, range: [36..128849018880])"},
  }

  for _,o in ipairs(gwoptions) do
  	if o.name ~= nil then
  		value = gw_section:option(Value, o.name, translate(o.name), translate(o.help))
  		value.optional = true
  		value.rmempty = true
  		value:depends("type","offer")
  	end
  end

end

function m.on_commit(self,map)
  http.redirect("/luci-static/resources/qmp/wait_short.html")
  uci:commit("gateways")
	luci.sys.call('/etc/qmp/qmp_control.sh configure_gw > /tmp/qmp_control_system.log &')
end

return m
