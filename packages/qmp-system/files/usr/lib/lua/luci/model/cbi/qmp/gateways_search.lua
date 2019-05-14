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

new_gw_section = m:section(TypedSection, "new_gw",
  translate("Gateways to search for"),
  translate("Use this tab to configure the gateways and network announcements your node must fetch (e.g., to look for an Internet gateway, to fetch specific subnetwork announcements).")
  .. "<br/> <br/><strong>"..translate("Use with care!").."</strong> "
  .. translate("Publising incorrect announcements might cause other nodes to lose Internet connection or render the mesh network inoperative."))

----------------------
-- Gateways section --
----------------------

-- Get the gateways to search for
gw_names = {}
uci:foreach('gateways', 'gateway', function (s)
  local name = s[".name"]
  local gwtype = uci:get('gateways', name, 'type')
  if (name ~= nil and gwtype == 'search') then
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
  type:value("search","search")
  -- type:value("offer","offer")
  type.optional = false
  type.hidden = true

  network = gw_section:option(Value,"network", "<b>"..translate("Network").."</b>",translate("network to be offered/searched. NETWORK/PREFIX must be specified, for example 10.0.0.0/8 or 0.0.0.0/0"))
  network.optional = false

  -- Optional parameters (not using all BMX6 tun options)
  local gwoptions = {
  {["name"]="address", ["help"]=""},
  {["name"]="gwName", ["help"]="force your node to choose a specific gateway by specifying its hostname (such as qMp0012)"},
  {["name"]="minPrefixLen", ["help"]="minimum prefix length for accepting advertised tunnel network (value 129 = network prefix length)"},
  {["name"]="maxPrefixLen", ["help"]="maximum prefix length for accepting advertised tunnel network (value 129 = network prefix length)"},
  {["name"]="srcNet", ["help"]="additional source address range to be routed via tunnel ({NETWORK}/{PREFIX-LENGTH})"},
  {["name"]="srcType", ["help"]="tunnel ip allocation mechanism (0 = static/global, 1 = static, 2 = auto, 3 = AHCP)"},
  {["name"]="bandwidth", ["help"]="network bandwidth (bits/sec) (default: 1000, range: [36..128849018880])"},
  {["name"]="minBandwidth", ["help"]="minimum bandwidth (bits/sec) beyond which GW's advertised bandwidth is ignored (default: 100000, range: [36..128849018880])"},
  {["name"]="rating", ["help"]="Default rating is 100. Smaller rating (from 0 to 99) gives low priority to the gateway. Higher rating (>100) gives more priority."},
  {["name"]="tunDev", ["help"]="incoming tunnel interface name to be used"},
  {["name"]="exportDistance", ["help"]=""},
  {["name"]="allowOverlappingPrefix", ["help"]="allow overlapping other tunRoutes with worse tunMetric but larger prefix length"},
  {["name"]="breakOverlappingPrefix", ["help"]="let this tunRoute break other tunRoutes with better tunMetric but smaller prefix length"},
  {["name"]="tableRule", ["help"]="ip rules tabel and preference to maintain matching tunnels ({PREF}/{TABLE})"},
  {["name"]="ipMetric", ["help"]="ip metric for local routing table entries"},
  {["name"]="hysteresis", ["help"]="specify in percent how much the metric to an alternative GW must be better than current GW"}
  }

  for _,o in ipairs(gwoptions) do
  	if o.name ~= nil then
  		value = gw_section:option(Value, o.name, translate(o.name), translate(o.help))
  		value.optional = true
  		value.rmempty = true
  		value:depends("type","search")
  	end
  end

end

function m.on_commit(self,map)
  http.redirect("/luci-static/resources/qmp/wait_short.html")
  uci:commit("gateways")
	luci.sys.call('/etc/qmp/qmp_control.sh configure_gw > /tmp/qmp_control_system.log &')
end

return m
