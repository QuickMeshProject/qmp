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
qmpinfo = require "qmpinfo"


------------
-- Header --
------------
m = Map("qmp", translate("qMp wireless network interfaces"), translate("This page allows to configure the operation mode of the wireless network interfaces (i.e. WiFi interfaces).") .. "<br/> <br/>" .. translate("You can check the on-line documentation at <a href=\"https://www.qmp.cat/Web_interface\">https://www.qmp.cat/Web_interface</a> for more information about the different options."))

local uci = luci.model.uci.cursor()
local wdevs = qmpinfo.get_wifi_index()

for _,wdev in ipairs(wdevs) do
  mydev = uci:get("qmp",wdev,"device")
end

local iw = luci.sys.wifi.getiwinfo(mydev)


------------------------------
-- General wireless options --
------------------------------
s_wireless_main = m:section(NamedSection, "wireless", "qmp", translate("General wireless options"), "")
s_wireless_main.addremove = False

-- Country selection
local cl = iw and iw.countrylist

if cl and #cl > 0 then
  cc = s_wireless_main:option(ListValue, "country", translate("Country Code"), translate("Use ISO/IEC 3166 alpha2 country codes."))

  cc.default = tostring(iw and iw.country or "00")
  for _, s in ipairs(cl) do
    cc:value(s.alpha2, "%s - %s" %{ s.alpha2, s.name })
  end

else
  s_wireless_main:option(Value, "country", translate("Country Code"), translate("Use ISO/IEC 3166 alpha2 country codes2."))
end

-- BSSID
bssid = s_wireless_main:option(Value,"bssid","BSSID")

-- MRATE
mrate = s_wireless_main:option(Value,"mrate",translate("Multicast rate"))


-----------------------------
-- Section Wireless Device --
-----------------------------
for _,wdev in ipairs(wdevs) do

  mydev = uci:get("qmp",wdev,"device")

  s_wireless = m:section(NamedSection, wdev, "Wireless device", "Wireless device " .. mydev)
  s_wireless.addremove = False

  -- Device
  dev = s_wireless:option(DummyValue,"device","Device")

  -- MAC
  mac = s_wireless:option(DummyValue,"mac","MAC")

  -- Mode
  mode = s_wireless:option(ListValue,"mode","Mode")
  mode:value("80211s","802.11s (mesh)")
  mode:value("80211s_adhoc","802.11s (mesh) + Ad hoc (legacy mesh)")
  mode:value("adhoc","Ad hoc (legacy mesh)")
  mode:value("ap","Access point (mesh)")
  mode:value("client","Client (mesh)")
  mode:value("aplan","Access point (LAN)")
  mode:value("clientwan","Client (WAN)")
  mode:value("adhoc_ap","Ad hoc (mesh) + access point (LAN)")
  mode:value("80211s_aplan","802.11s (mesh) + access point (LAN)")
  mode:value("none","Disabled")
  mode.default = "80211s_aplan"

  -- Channel
  channel = s_wireless:option(ListValue,"channel","Channel",translate("WiFi channel to be used in this device.") .. " " ..translate ("Selecting channels with + or - enables 40MHz bandwidth."))
  mymode = m.uci:get("qmp",wdev,"mode")

  for _,ch in ipairs(qmpinfo.get_channels(mydev)) do
    if mymode ~= "adhoc" or ch.adhoc then
      channel:value(ch.channel, ch.channel)
      if ch.ht40p then channel:value(ch.channel .. '+', ch.channel .. '+') end
      if ch.ht40m then channel:value(ch.channel .. '-', ch.channel .. '-') end
      if ch.channel < 15 then channel:value(ch.channel .. 'b', ch.channel .. 'b') end
    end
  end

  -- Txpower
  txpower = s_wireless:option(ListValue,"txpower",translate("Transmission power (dBm)"),translate("Radio power in dBm. Each 3 dB increment doubles the power."))
  for _,t in ipairs(qmpinfo.get_txpower(mydev)) do
    txpower:value(t,t)
  end

  -- maxlength is documented but not implemented
  -- http://luci.subsignal.org/trac/wiki/Documentation/CBI#a.maxlengthnil
  -- http://luci.subsignal.org/trac/browser/luci/trunk/libs/web/luasrc/cbi.lua?rev=9834#L1463

  -- Network ESSID for adhoc
  local essid = s_wireless:option(Value,"name","Ad hoc ESSID",
    translate("ESSID (network name) to broadcast in ad hoc mode. Every node can use a different one."))
  essid.maxlength = 32
  essid.default = "qMp"
  essid:depends("mode","adhoc")
  essid:depends("mode","adhoc_ap")

  -- Network name for 80211s
  local mesh80211s = s_wireless:option(Value,"mesh80211s","802.11s network",
    translate("Name of the 802.11s mesh network. All the nodes must use the same network name."))
  mesh80211s.maxlength = 32
  mesh80211s.default = "qMp"
  mesh80211s:depends("mode","80211s")
  mesh80211s:depends("mode","80211s_aplan")

  -- Network ESSID for ap or client
  local essidap = s_wireless:option(Value,"essidap","AP ESSID",
    translate("Name of the WiFi network (ESSID) for access point or client mode."))
  essidap.maxlength = 27
  essidap.default = "qMp-AP"
  essidap:depends("mode","adhoc_ap")
  essidap:depends("mode","ap")
  essidap:depends("mode","aplan")
  essidap:depends("mode","client")
  essidap:depends("mode","clientwan")
  essidap:depends("mode","80211s_aplan")

  -- Network WPA2 key for ap or client
  local key=s_wireless:option(Value,"key","WPA2 key",
    translate("WPA2 key for AP or client modes. The minimum lenght is 8 characters.<br/>Leave blank to make it OPEN (recommended)"))
  key.default = ""
  key:depends("mode","ap")
  key:depends("mode","aplan")
  key:depends("mode","adhoc_ap")
  key:depends("mode","client")
  key:depends("mode","clientwan")
  key:depends("mode","80211s_aplan")

end


function m.on_commit(self,map)
  http.redirect("/luci-static/resources/qmp/wait_short.html")
  uci:commit("qmp")
  luci.sys.call('(/etc/qmp/qmp_control.sh configure_wifi ; /etc/init.d/network reload; /etc/init.d/gwck enabled && /etc/init.d/gwck restart)&')
end


-----------------------------
-- Reconfiguration section --
-----------------------------
s_wireless_reconfigure = m:section(NamedSection, "wireless", "qmp", translate("Reconfigure wireless"),
  translate("Use this button to rescan and reconfigure all wireless interfaces.") .. " " ..
  translate("This is useful in case new interfaces are added.") .. "<br/> <br/>" ..
  translate("<strong>All current wireless settings will be restored to the default ones.</strong>"))
s_wireless_main.addremove = False

-- Button Rescan Wifi devices
confwifi = s_wireless_reconfigure:option(Button, "_confwifi", translate("Reconfigure wireless interfaces"),translate("Rescan and reconfigure all devices. <strong>Current wireless settings will be restored to defaults.</strong>"))

function confwifi.write(self, section)
  luci.sys.call('/sbin/wifi down &')
  -- Delete all wireless sections from qmp config
  local delsecs = {}

  local cursor = luci.model.uci.cursor()
  cursor:foreach("qmp", "wireless", function(s)
    table.insert(delsecs, s[".name"])
  end
  )
  for k, v in pairs (delsecs) do
    cursor:delete("qmp", v)
  end
  cursor:save("qmp")
  cursor:commit("qmp")
  http.redirect("/luci-static/resources/qmp/wait_long.html")
  luci.sys.call('qmpcontrol reset_wifi > /tmp/qmp_control_reset_wifi.log &')
end


return m
