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

module("luci.controller.qmp", package.seeall)

function index()
	local nixio = require "nixio"
	-- Making qmp as default
	local root = node()
	root.target = alias("qmp")
	root.index  = true

	-- Main window with auth enabled
	overview = entry({"qmp"}, template("admin_status/index"), "qMp", 1)
	overview.dependent = false
	overview.sysauth = "root"
	overview.sysauth_authenticator = "htmlauth"

	-- Menu entries
	entry({"qmp","status"}, template("admin_status/index"), "Status", 2).dependent=false

  entry({"qmp","configuration"}, cbi("qmp/easy_setup"), "Device configuration", 4).dependent=false
    entry({"qmp","configuration","easy_setup"}, form("qmp/easy_setup"), "qMp easy setup", 10).dependent=false
  entry({"qmp","configuration","node"}, cbi("qmp/node"), "Node settings", 20).dependent=false
  entry({"qmp","configuration","network"}, cbi("qmp/network_basic"), "Network settings", 30).dependent=false
    entry({"qmp","configuration","network","basic"}, cbi("qmp/network_basic"), "Basic settings", 31).dependent=false
    entry({"qmp","configuration","network","wired"}, form("qmp/network_wired"), "Wired interfaces", 32).dependent=false
    entry({"qmp","configuration","network","wireless"}, cbi("qmp/network_wireless"), "Wireless interfaces", 33).dependent=false
    entry({"qmp","configuration","network","advanced"}, cbi("qmp/network_adv"), "Advanced settings", 34).dependent=false
  entry({"qmp","configuration","services"}, cbi("qmp/services"), "qMp services", 40).dependent=false
  entry({"qmp","configuration","gateways"}, cbi("qmp/gateways_search"), "qMp gateways", 50).dependent=false
    entry({"qmp","configuration","gateways","search"}, cbi("qmp/gateways_search"), "Gateways to search for", 51).dependent=false
    entry({"qmp","configuration","gateways","offer"}, cbi("qmp/gateways_offer"), "Offered gateways", 52).dependent=false

	entry({"qmp","tools"}, call("action_tools"), "Tools", 5).dependent=false
	entry({"qmp","tools","tools"}, call("action_tools"), "Network testing", 1).dependent=false
  if nixio.fs.stat("/usr/lib/lua/luci/model/cbi/qmp/mdns.lua","type") ~= nil then
		entry({"qmp","tools","mDNS"}, cbi("qmp/mdns"), "DNS mesh", 1).dependent=false
	end
	-- entry({"qmp","tools","splash"}, call("action_splash"), "Splash", 2).dependent=false
	-- entry({"qmp","tools","map"}, call("action_map"), "Map", 3).dependent=false

	entry({"qmp","about"}, call("action_status"), "About", 9).dependent=false
end

function action_status()
	package.path = package.path .. ";/etc/qmp/?.lua"
	local qmp = require "qmpinfo"
	local ipv4 = qmp.get_ipv4()
	local hostname = qmp.get_hostname()
	local uname = qmp.get_uname()
	local version = qmp.get_version()

	luci.template.render("qmp/overview",{ipv4=ipv4,hostname=hostname,uname=uname,version=version})
end

function action_tools()
	package.path = package.path .. ";/etc/qmp/?.lua"
	local qmp = require "qmpinfo"
	local nodes = qmp.nodes()
	local key = qmp.get_key()
	luci.template.render("qmp/tools",{nodes=nodes,key=key})
end

function action_splash()
	luci.template.render("qmp/splash")
end

function action_map()
	luci.template.render("qmp/b6m")
end
