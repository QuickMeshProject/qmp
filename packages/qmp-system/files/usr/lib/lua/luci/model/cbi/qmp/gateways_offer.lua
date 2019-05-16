--[[
  Copyright © 2011-2019 Quick Mesh Project - https://www.qmp.cat
  SPDX-License-Identifier: GPL-3.0-or-later
--]]

local sys = require "luci.sys"
local http = require "luci.http"
local uci = luci.model.uci.cursor()

------------
-- Header --
------------

m = Map("gateways", "qMp gateways", translate("This page allows configuring the type of tunnels or gateways this qMp node must search for from other nodes in the mesh, and which gateways (e.g., an Internet connection) can offer to the other nodes in the mesh.")
  .. "<br/> <br/>"
  .. translate("Use the <strong>Gateways to search for</strong> tab to configure the gateways and network announcements this qMp node must search for and fetch (e.g., to look for an Internet gateway, to fetch specific subnetwork announcements) from other nodes in the mesh network.")
  .. "<br/>"
  .. translate("Use the <strong>Gateways to offer</strong> to publish the gateways and network routes this qMp node will announce and offer and make available to the rest of nodes in the mesh (e.g., to publush a route to a specific subnetwork, to offer a shared Internet connection, etc.).")
  .. "<br/> <br/>"
  .. "<strong>"..translate("Proceed with care!").."</strong>".." "
  .. translate("Publising incorrect announcements might cause other nodes to lose Internet connection or render the mesh network inoperative.")
  .. "<br/> <br/>"
  .. translate("You can check the on-line documentation at <a href=\"https://www.qmp.cat/Web_interface\">https://www.qmp.cat/Web_interface</a> for more information about the different options.")
  .. "<hr>")

----------------------
-- Gateways section --
----------------------

-- Get the names of the gateways to offer
gw_names = {}
uci:foreach('gateways', 'gateway', function (s)
  local name = s[".name"]
  local gwtype = uci:get('gateways', name, 'type')
  if (name ~= nil and gwtype == 'offer') then
    table.insert(gw_names, name)
  end
end)

-- Optional parameters for search gateways (not using all BMX6 tun options, though)
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

-- Display all the offered gateways
for _,gw in ipairs(gw_names) do
gw_section = m:section(NamedSection, gw, 'gateway', 'Offered gateway "' .. gw .. '"')
  gw_section.addremove = true
  gw_section.anonymous = false

  -- Add their default parameters
  ignore = gw_section:option(Flag,"ignore", "<b>"..translate("Enabled").."</b>", translate("Enable this rule"))
  ignore.default="0"
  ignore.disabled="1"
  ignore.enabled="0"

  type = gw_section:option(ListValue,"type", "<b>"..translate("Type").."</b>",translate("offer = announce some specific network in the mesh, search = look for some specific network"))
  type:value("offer","offer")
  type.optional = false
  type.hidden = true

  network = gw_section:option(Value,"network", "<b>"..translate("Network").."</b>",translate("network to be offered/searched. NETWORK/PREFIX must be specified, for example 10.0.0.0/8 or 0.0.0.0/0"))
  network.optional = false

  for _,o in ipairs(gwoptions) do
  	if o.name ~= nil then
  		value = gw_section:option(Value, o.name, translate(o.name), translate(o.help))
  		value.optional = true
  		value.rmempty = true
  		value:depends("type","offer")
  	end
  end
end

--------------------------
-- New gateways section --
--------------------------

new_gw_section = m:section(TypedSection, "new_offer_gateway",
  translate("Add new gateways and routes to offer"),
  translate("Use this option to add new gateways this qMp node will offer to the rest of nodes in the mesh network (e.g., announce a subnetowrk, to share an Internet connection).")
  .."<br/>"
  ..translate('Use a <strong>unique name</strong> for the new gateway section, which is not being used neither in this tab or in the "Gateways to search for" tab.'))

new_gw_section.addremove = true
new_gw_section.anonymous = false

-- Add their default parameters
ignore = new_gw_section:option(Flag,"ignore", "<b>"..translate("Enabled").."</b>", translate("Enable this rule"))
ignore.default="1"
ignore.disabled="1"
ignore.enabled="0"

type = new_gw_section:option(ListValue,"type", "<b>"..translate("Type").."</b>",translate("offer = announce some specific network in the mesh, search = look for some specific network"))
type:value("offer","offer")
type.optional = false

network = new_gw_section:option(Value,"network", "<b>"..translate("Network").."</b>",translate("network to be offered/searched. NETWORK/PREFIX must be specified, for example 10.0.0.0/8 or 0.0.0.0/0"))
network.optional = false

for _,o in ipairs(gwoptions) do
  if o.name ~= nil then
    value = new_gw_section:option(Value, o.name, translate(o.name), translate(o.help))
    value.optional = true
    value.rmempty = true
    value:depends("type","offer")
  end
end

function m.on_commit(self,map)
  uci:commit("gateways")
  http.redirect("/luci-static/resources/qmp/wait_short.html")

  ogw = uci.cursor()
  ngw = uci.cursor()
  tgw = uci.cursor()

  ngw:foreach("gateways", "new_offer_gateway", function(n)
    local nname = n[".name"]

    -- search for an existing gateway with the same name before converting section type
    local dup = false
    local dupname = ""

    ogw:foreach("gateways", 'gateway', function (o)
      local oname = o[".name"]
      local nname_offer = nname.."_offer"
      if (nname_offer == oname) then
        dup = true
      end
    end)

    while (dup)
    do
      dupname = dupname .. "_dup"
      local this_dup = false
      ogw:foreach("gateways", 'gateway', function (o)
        local oname = o[".name"]
        local nname_dup_offer = nname..dupname.."_offer"
        if (nname_dup_offer == oname) then
          this_dup = true
        end
      end)
      dup = this_dup
    end

    local newname = nname..dupname
    if (nname:sub(-6,-1) ~= "_offer" ) then
      newname = newname .. "_offer"
    end

    ogw:set("gateways", newname, "gateway")
    ogw:set("gateways", newname, "ignore",
      tgw:get('gateways', nname, 'ignore'))
    ogw:set("gateways", newname, "type",
      tgw:get('gateways', nname, 'type'))
    ogw:set("gateways", newname, "network",
      tgw:get('gateways', nname, 'network'))

      for _,op in ipairs(gwoptions) do
        if op.name ~= nil then
          local opvalue = tgw:get("gateways", nname, op.name)
          if opvalue ~= nil then
            ogw:set("gateways", newname, op.name, opvalue)
          end
        end
      end

  end)

  ngw:foreach("gateways", "new_offer_gateway", function(n)
    local nname = n[".name"]
    tgw:delete("gateways", nname)
  end)


  uci:commit("gateways")
	luci.sys.call('/etc/qmp/qmp_control.sh configure_gw > /tmp/qmp_control_system.log &')
end

return m
