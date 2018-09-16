--[[
 Copyright (C) 2011 Fundacio Privada per a la Xarxa Oberta, Lliure i Neutral guifi.net

 This program is free software; you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation; either version 2 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License along
 with this program; if not, write to the Free Software Foundation, Inc.,
 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.

 The full GNU General Public License is included in this distribution in
 the file called "COPYING".
--]]

module("luci.controller.nc", package.seeall)

function index()

	local DEBUGMODE = false

	entry({"qmp","tools","graph"}, template("nc/graph"), "Network graph (alpha)", 20).dependent=false

	if DEBUGMODE == true then
		entry({"qmp","nc"}, template("nc/graph"), "Network characterization", 7).dependent=false
		entry({"qmp","nc","graph"}, template("nc/graph"), "Network graph (debug)", 2).dependent=false
		entry({"qmp","nc","local_id"}, call("local_id"), "Get local id", 10).dependent=false
		entry({"qmp","nc","ncd_version"}, call("ncd_version"), "Get NCD daemon version", 11).dependent=false
		entry({"qmp","nc","neighbours"}, call("neighbours"), "List local neighbours", 20).dependent=false
		entry({"qmp","nc","system_board"}, call("system_board"), "System: board", 21).dependent=false
		entry({"qmp","nc","system_info"}, call("system_info"), "System: info", 22).dependent=false
		entry({"qmp","nc","bmx6_flushAll"}, call("bmx6_flushAll"), "BMX6 -> Flush all", 30).dependent=false
		entry({"qmp","nc","bmx6_interfaces"}, call("bmx6_interfaces"), "BMX6: interfaces", 31).dependent=false
		entry({"qmp","nc","bmx6_links"}, call("bmx6_links"), "BMX6: links", 32).dependent=false
		entry({"qmp","nc","bmx6_originators"}, call("bmx6_originators"), "BMX6: originators", 33).dependent=false
		entry({"qmp","nc","bmx6_status"}, call("bmx6_status"), "BMX6: status", 34).dependent=false
		entry({"qmp","nc","bmx6_options"}, call("bmx6_options"), "BMX6: options", 35).dependent=false
		entry({"qmp","nc","bmx6_parameters"}, call("bmx6_parameters"), "BMX6: parameters", 36).dependent=false
		entry({"qmp","nc","bmx6_descriptors"}, call("bmx6_descriptors"), 'BMX6: descriptors', 37).dependent=false
		entry({"qmp","nc","set_bmx6_metricalgo"}, call("bmx6_setmetricalgo"), 'BMX6: set metric algorithm', 38).dependent=false
		entry({"qmp","nc","bmx6info_status"}, call("bmx6info_status"), "BMX6info: status", 40).dependent=false
		entry({"qmp","nc","bmx6info_links"}, call("bmx6info_links"), "BMX6info: links", 41).dependent=false
		entry({"qmp","nc","bmx6info_descriptions"}, call("bmx6info_descriptions"), "BMX6info: descriptions", 42).dependent=false
		entry({"qmp","nc","bmx6info_options"}, call("bmx6info_options"), "BMX6info: options", 43).dependent=false
		entry({"qmp","nc","bmx6info_originators"}, call("bmx6info_originators"), "BMX6info: originators", 44).dependent=false
		entry({"qmp","nc","nettest_bandwidth"}, call("nettest_bandwidth"), 'NetTest: bandwidth', 65).dependent=false
		entry({"qmp","nc","nettest_iperf3"}, call("nettest_iperf3"), 'NetTest: iperf3', 65).dependent=false
		entry({"qmp","nc","nettest_ping"}, call("nettest_ping"), 'NetTest: ping', 68).dependent=false
		entry({"qmp","nc","bmx6_all"}, call("bmx6_all"), "BMX6: get all", 98).dependent=false
		entry({"qmp","nc","test"}, template("nc/test"), "Test stuff", 99).dependent=false
	else
		entry({"qmp","nc"}, template("nc/graph"), nil, 7).dependent=false
		entry({"qmp","nc","local_id"}, call("local_id"), nil, 10).dependent=false
		entry({"qmp","nc","ncd_version"}, call("ncd_version"), nil, 11).dependent=false
		entry({"qmp","nc","neighbours"}, call("neighbours"), nil, 20).dependent=false
		entry({"qmp","nc","system_board"}, call("system_board"), nil, 21).dependent=false
		entry({"qmp","nc","system_info"}, call("system_info"), nil, 22).dependent=false
		entry({"qmp","nc","bmx6_flushAll"}, call("bmx6_flushAll"), nil, 30).dependent=false
		entry({"qmp","nc","bmx6_interfaces"}, call("bmx6_interfaces"), nil, 31).dependent=false
		entry({"qmp","nc","bmx6_links"}, call("bmx6_links"), nil, 32).dependent=false
		entry({"qmp","nc","bmx6_originators"}, call("bmx6_originators"), nil, 33).dependent=false
		entry({"qmp","nc","bmx6_status"}, call("bmx6_status"), nil, 34).dependent=false
		entry({"qmp","nc","bmx6_options"}, call("bmx6_options"), nil, 35).dependent=false
		entry({"qmp","nc","bmx6_parameters"}, call("bmx6_parameters"), nil, 36).dependent=false
		entry({"qmp","nc","bmx6_descriptors"}, call("bmx6_descriptors"), nil, 37).dependent=false
		entry({"qmp","nc","set_bmx6_metricalgo"}, call("bmx6_setmetricalgo"), nil, 38).dependent=false
		entry({"qmp","nc","bmx6info_status"}, call("bmx6info_status"), nil, 40).dependent=false
		entry({"qmp","nc","bmx6info_links"}, call("bmx6info_links"), nil, 41).dependent=false
		entry({"qmp","nc","bmx6info_descriptions"}, call("bmx6info_descriptions"), nil, 42).dependent=false
		entry({"qmp","nc","bmx6info_options"}, call("bmx6info_options"), nil, 43).dependent=false
		entry({"qmp","nc","bmx6info_originators"}, call("bmx6info_originators"), nil, 44).dependent=false
		entry({"qmp","nc","nettest_bandwidth"}, call("nettest_bandwidth"), nil, 65).dependent=false
		entry({"qmp","nc","nettest_iperf3"}, call("nettest_iperf3"), nil, 65).dependent=false
		entry({"qmp","nc","nettest_ping"}, call("nettest_ping"), nil, 68).dependent=false
		entry({"qmp","nc","bmx6_all"}, call("bmx6_all"), nil, 98).dependent=false
		entry({"qmp","nc","test"}, template("nc/test"), nil, 99).dependent=false
	end

end


function local_id()
 local ubus = require "ubus"
 local conn = ubus.connect()
 local result = conn:call("lunced", "self", {})
 luci.http.prepare_content("application/json")
 luci.http.write_json(result)
end


function ncd_version()
	nodeid = luci.http.formvalue("nodeid")
	local result

	if nodeid == nil then
		result = '{ "error" : "You must specify a node in the URL. Ex.: http://ip_address/cgi-bin/luci/;stok=deafbeef8coffebabe/qmp/nc/ncd_version/?nodeid=node12345" }'
 	else
 		local ubus = require "ubus"
 		local conn = ubus.connect()

		if nodeid == "local" then
			result = conn:call("lunced", "version", {})
		else
			result = conn:call("lunced", "reply", { cmd = "version", id = nodeid })
		end
 	end

	luci.http.prepare_content("application/json")
	luci.http.write_json(result)
end


function neighbours()
	nodeid = luci.http.formvalue("nodeid")
	local result

	if nodeid == nil then
		result = '{ "error" : "You must specify a node in the URL. Ex.: http://ip_address/cgi-bin/luci/;stok=deafbeef8coffebabe/qmp/nc/remote_neighbours/?nodeid=node12345" }'
 	else
 		local ubus = require "ubus"
 		local conn = ubus.connect()

		if nodeid == "local" then
			result = conn:call("lunced", "neighbours", {})
		else
			result = conn:call("lunced", "reply", { cmd = "neighbours", id = nodeid })
		end
 	end

	luci.http.prepare_content("application/json")
	luci.http.write_json(result)
end


function bmx6_flushAll()
	nodeid = luci.http.formvalue("nodeid")
	local result

	if nodeid == nil then
		result = '{ "error" : "You must specify a node in the URL. Ex.: http://ip_address/cgi-bin/luci/;stok=deafbeef8coffebabe/qmp/nc/remote_neighbours/?nodeid=node12345" }'
 	else
 		local ubus = require "ubus"
 		local conn = ubus.connect()

		if nodeid == "local" then
			result = conn:call("lunced", "bmx6FlushAll", {})
		else
			result = conn:call("lunced", "reply", { cmd = "bmx6FlushAll", id = nodeid })
		end
 	end

	luci.http.prepare_content("application/json")
	luci.http.write_json(result)
end


function bmx6_descriptors()
	nodeid = luci.http.formvalue("nodeid")
	local result

	if nodeid == nil then
		result = '{ "error" : "You must specify a node in the URL. Ex.: http://ip_address/cgi-bin/luci/;stok=deafbeef8coffebabe/qmp/nc/bmx6_descriptors/?nodeid=node12345" }'
 	else
 		local ubus = require "ubus"
 		local conn = ubus.connect()

		if nodeid == "local" then
			result = conn:call("lunced", "bmx6Descriptors", {})
		else
			result = conn:call("lunced", "reply", { cmd = "bmx6Descriptors", id = nodeid })
		end
 	end

	luci.http.prepare_content("application/json")
	luci.http.write_json(result)
end


function bmx6_interfaces()
	nodeid = luci.http.formvalue("nodeid")
	local result

	if nodeid == nil then
		result = '{ "error" : "You must specify a node in the URL. Ex.: http://ip_address/cgi-bin/luci/;stok=deafbeef8coffebabe/qmp/nc/remote_neighbours/?nodeid=node12345" }'
 	else
 		local ubus = require "ubus"
 		local conn = ubus.connect()

		if nodeid == "local" then
			result = conn:call("lunced", "bmx6Interfaces", {})
		else
			result = conn:call("lunced", "reply", { cmd = "bmx6Interfaces", id = nodeid })
		end
 	end

	luci.http.prepare_content("application/json")
	luci.http.write_json(result)
end


function bmx6_links()
	nodeid = luci.http.formvalue("nodeid")
	local result

	if nodeid == nil then
		result = '{ "error" : "You must specify a node in the URL. Ex.: http://ip_address/cgi-bin/luci/;stok=deafbeef8coffebabe/qmp/nc/remote_neighbours/?nodeid=node12345" }'
 	else
 		local ubus = require "ubus"
 		local conn = ubus.connect()

		if nodeid == "local" then
			result = conn:call("lunced", "bmx6Links", {})
		else
			result = conn:call("lunced", "reply", { cmd = "bmx6Links", id = nodeid })
		end
 	end

	luci.http.prepare_content("application/json")
	luci.http.write_json(result)
end


function bmx6_options()
	nodeid = luci.http.formvalue("nodeid")
	local result

	if nodeid == nil then
		result = '{ "error" : "You must specify a node in the URL. Ex.: http://ip_address/cgi-bin/luci/;stok=deafbeef8coffebabe/qmp/nc/bmx6_options/?nodeid=node12345" }'
 	else
 		local ubus = require "ubus"
 		local conn = ubus.connect()

		if nodeid == "local" then
			result = conn:call("lunced", "bmx6Options", {})
		else
			result = conn:call("lunced", "reply", { cmd = "bmx6Options", id = nodeid })
		end
 	end

	luci.http.prepare_content("application/json")
	luci.http.write_json(result)
end


function bmx6_originators()
	nodeid = luci.http.formvalue("nodeid")
	local result

	if nodeid == nil then
		result = '{ "error" : "You must specify a node in the URL. Ex.: http://ip_address/cgi-bin/luci/;stok=deafbeef8coffebabe/qmp/nc/remote_neighbours/?nodeid=node12345" }'
 	else
 		local ubus = require "ubus"
 		local conn = ubus.connect()

		if nodeid == "local" then
			result = conn:call("lunced", "bmx6Originators", {})
		else
			result = conn:call("lunced", "reply", { cmd = "bmx6Originators", id = nodeid })
		end
 	end

	luci.http.prepare_content("application/json")
	luci.http.write_json(result)
end


function bmx6_parameters()
	nodeid = luci.http.formvalue("nodeid")
	local result

	if nodeid == nil then
		result = '{ "error" : "You must specify a node in the URL. Ex.: http://ip_address/cgi-bin/luci/;stok=deafbeef8coffebabe/qmp/nc/bmx6_parameters/?nodeid=node12345" }'
 	else
 		local ubus = require "ubus"
 		local conn = ubus.connect()

		if nodeid == "local" then
			result = conn:call("lunced", "bmx6Parameters", {})
		else
			result = conn:call("lunced", "reply", { cmd = "bmx6Parameters", id = nodeid })
		end
 	end

	luci.http.prepare_content("application/json")
	luci.http.write_json(result)
end


function bmx6_setmetricalgo()
	nodeid = luci.http.formvalue("nodeid")
	algorithm = luci.http.formvalue("algorithm")
	rxExpNumerator = luci.http.formvalue("rxExpNumerator")
	rxExpDivisor = luci.http.formvalue("rxExpDivisor")
	txExpNumerator = luci.http.formvalue("txExpNumerator")
	txExpDivisor = luci.http.formvalue("txExpDivisor")
	local result

	if nodeid == nil then
		result = '{ "error" : "You must specify a node, the metric algorithm value and the exponents in the URL. Ex.: http://ip_address/cgi-bin/luci/;stok=deafbeef8coffebabe/qmp/nc/bmx6SetMetricAlgo/?nodeid=node12345&algorithm=16&rxExpNumerator=1&rxExpDivisor=2&txExpNumerator=1&txExpDivisor=1" }'
 	else
 		local ubus = require "ubus"
 		local conn = ubus.connect()

		if nodeid == "local" then
			result = conn:call("lunced", "bmx6SetMetricAlgo", {algorithm = algorithm, rxExpNumerator = rxExpNumerator, rxExpDivisor = rxExpDivisor, txExpNumerator = txExpNumerator, txExpDivisor = txExpDivisor })
		else
			result = conn:call("lunced", "reply", { cmd = "bmx6SetMetricAlgo", id = nodeid, algorithm = algorithm, rxExpNumerator = rxExpNumerator, rxExpDivisor = rxExpDivisor, txExpNumerator = txExpNumerator, txExpDivisor = txExpDivisor })
		end
 	end

	luci.http.prepare_content("application/json")
	luci.http.write_json(result)
end


function bmx6_status()
	nodeid = luci.http.formvalue("nodeid")
	local result

	if nodeid == nil then
		result = '{ "error" : "You must specify a node in the URL. Ex.: http://ip_address/cgi-bin/luci/;stok=deafbeef8coffebabe/qmp/nc/remote_neighbours/?nodeid=node12345" }'
 	else
 		local ubus = require "ubus"
 		local conn = ubus.connect()

		if nodeid == "local" then
			result = conn:call("lunced", "bmx6Status", {})
		else
			result = conn:call("lunced", "reply", { cmd = "bmx6Status", id = nodeid })
		end
 	end

	luci.http.prepare_content("application/json")
	luci.http.write_json(result)
end




function bmx6info_descriptions()
	nodeid = luci.http.formvalue("nodeid")
	local result

	if nodeid == nil then
		result = '{ "error" : "You must specify a node in the URL. Ex.: http://ip_address/cgi-bin/luci/;stok=deafbeef8coffebabe/qmp/nc/bmx6info_descriptions/?nodeid=node12345" }'
 	else
 		local ubus = require "ubus"
 		local conn = ubus.connect()

		result = conn:call("lunced", "reply", { cmd = "bmx6infoDescriptions", id = nodeid })
 	end

	luci.http.prepare_content("application/json")
	luci.http.write_json(result)
end


function bmx6info_links()
	nodeid = luci.http.formvalue("nodeid")
	local result

	if nodeid == nil then
		result = '{ "error" : "You must specify a node in the URL. Ex.: http://ip_address/cgi-bin/luci/;stok=deafbeef8coffebabe/qmp/nc/bmx6info_links/?nodeid=node12345" }'
 	else
 		local ubus = require "ubus"
 		local conn = ubus.connect()

		result = conn:call("lunced", "reply", { cmd = "bmx6infoLinks", id = nodeid })
 	end

	luci.http.prepare_content("application/json")
	luci.http.write_json(result)
end


function bmx6info_options()
	nodeid = luci.http.formvalue("nodeid")
	local result

	if nodeid == nil then
		result = '{ "error" : "You must specify a node in the URL. Ex.: http://ip_address/cgi-bin/luci/;stok=deafbeef8coffebabe/qmp/nc/bmx6info_options/?nodeid=node12345" }'
 	else
 		local ubus = require "ubus"
 		local conn = ubus.connect()

		result = conn:call("lunced", "reply", { cmd = "bmx6infoOptions", id = nodeid })
 	end

	luci.http.prepare_content("application/json")
	luci.http.write_json(result)
end


function bmx6info_originators()
	nodeid = luci.http.formvalue("nodeid")
	local result

	if nodeid == nil then
		result = '{ "error" : "You must specify a node in the URL. Ex.: http://ip_address/cgi-bin/luci/;stok=deafbeef8coffebabe/qmp/nc/bmx6info_originators/?nodeid=node12345" }'
 	else
 		local ubus = require "ubus"
 		local conn = ubus.connect()

		result = conn:call("lunced", "reply", { cmd = "bmx6infoOriginators", id = nodeid })
 	end

	luci.http.prepare_content("application/json")
	luci.http.write_json(result)
end


function bmx6info_status()
	nodeid = luci.http.formvalue("nodeid")
	local result

	if nodeid == nil then
		result = '{ "error" : "You must specify a node in the URL. Ex.: http://ip_address/cgi-bin/luci/;stok=deafbeef8coffebabe/qmp/nc/bmx6info_status/?nodeid=node12345" }'
 	else
 		local ubus = require "ubus"
 		local conn = ubus.connect()

		result = conn:call("lunced", "reply", { cmd = "bmx6infoStatus", id = nodeid })
 	end

	luci.http.prepare_content("application/json")
	luci.http.write_json(result)
end


function bmx6_all()
	nodeid = luci.http.formvalue("nodeid")
	local result

	if nodeid == nil then
		result = '{ "error" : "You must specify a node in the URL. Ex.: http://ip_address/cgi-bin/luci/;stok=deafbeef8coffebabe/qmp/nc/remote_neighbours/?nodeid=node12345" }'
 	else
 		local ubus = require "ubus"
 		local conn = ubus.connect()

		if nodeid == "local" then
			result = conn:call("lunced", "bmx6All", {})
		else
			result = conn:call("lunced", "reply", { cmd = "bmx6All", id = nodeid })
		end
 	end

	luci.http.prepare_content("application/json")
	luci.http.write_json(result)
end


function nettest_bandwidth()
	local nodeid = luci.http.formvalue("nodeid")
	local address = luci.http.formvalue("address")
	local parameters = luci.http.formvalue("parameters")
	local result

	if nodeid == nil or address == nil then
		result = '{ "error" : "You must specify the node to send the command to and the IP address to measure bandwidth against. Ex.: http://ip_address/cgi-bin/luci/;stok=deafbeef8coffebabe/qmp/nc/nettest_bandwidth/?nodeid=node12345&address=fd66:66:66:b:abcd:ff:dcba:0123&parameters=-t1" }'
 	else
 		local ubus = require "ubus"
 		local conn = ubus.connect()

		if nodeid == "local" then
			result = conn:call("lunced", "nettestBandwidth", {address = address, parameters = parameters})
		else
			result = conn:call("lunced", "reply", { cmd = "nettestBandwidth", id = nodeid, address = address, parameters = parameters })
		end
 	end

	luci.http.prepare_content("application/json")
	luci.http.write_json(result)
end


function nettest_iperf3()
	local nodeid = luci.http.formvalue("nodeid")
	local action = luci.http.formvalue("action")
	local result

	if nodeid == nil or action == nil then
		result = '{ "error" : "You must specify the node to send the command to and the action to perform. Ex.: http://ip_address/cgi-bin/luci/;stok=deafbeef8coffebabe/qmp/nc/nettest_iperf3/?nodeid=node12345&action=restart" }'
 	else
 		local ubus = require "ubus"
 		local conn = ubus.connect()

		if nodeid == "local" then
			result = conn:call("lunced", "nettestIperf3", {address = address, action = action})
		else
			result = conn:call("lunced", "reply", { cmd = "nettestIperf3", id = nodeid, action = action, parameters = parameters })
		end
 	end

	luci.http.prepare_content("application/json")
	luci.http.write_json(result)
end


function nettest_ping()
	local nodeid = luci.http.formvalue("nodeid")
	local address = luci.http.formvalue("address")
	local parameters = luci.http.formvalue("parameters")
	local result

	if nodeid == nil or address == nil then
		result = '{ "error" : "You must specify the node to send the command to and the IP address to measure ping against. Ex.: http://ip_address/cgi-bin/luci/;stok=deafbeef8coffebabe/qmp/nc/nettest_ping/?nodeid=node12345&address=fd66:66:66:b:abcd:ff:dcba:0123&parameters=-t1" }'
 	else
 		local ubus = require "ubus"
 		local conn = ubus.connect()

		if nodeid == "local" then
			result = conn:call("lunced", "nettestPing", {address = address, parameters = parameters})
		else
			result = conn:call("lunced", "reply", { cmd = "nettestPing", id = nodeid, address = address, parameters = parameters })
		end
 	end

	luci.http.prepare_content("application/json")
	luci.http.write_json(result)
end


function system_board()

	nodeid = luci.http.formvalue("nodeid")

	local result

	if nodeid == nil then
		result = '{ "error" : "You must specify a node in the URL. Ex.: http://ip_address/cgi-bin/luci/;stok=deafbeef8coffebabe/qmp/nc/system_board/?nodeid=node12345" }'
 	else
 		local ubus = require "ubus"
 		local conn = ubus.connect()

		if nodeid == "local" then
			result = conn:call("lunced", "systemBoard", {})
		else
			result = conn:call("lunced", "reply", { cmd = "systemBoard", id = nodeid })
		end
 	end

 	luci.http.prepare_content("application/json")
	luci.http.write_json(result)

end


function system_info()

	nodeid = luci.http.formvalue("nodeid")

	local result

	if nodeid == nil then
		result = '{ "error" : "You must specify a node in the URL. Ex.: http://ip_address/cgi-bin/luci/;stok=deafbeef8coffebabe/qmp/nc/system_board/?nodeid=node12345" }'
 	else
 		local ubus = require "ubus"
 		local conn = ubus.connect()

		if nodeid == "local" then
			result = conn:call("lunced", "systemInfo", {})
		else
			result = conn:call("lunced", "reply", { cmd = "systemInfo", id = nodeid })
		end
 	end

 	luci.http.prepare_content("application/json")
	luci.http.write_json(result)

end


function test(arg)
 local ifname = arg or "lan"

 -- establish ubus connection
 local ubus = require "ubus"
 local conn = ubus.connect()

 -- call an ubus procedure (ubus call network.interface.lan status)
 local lan = conn:call("network.interface." .. ifname, "status", {})

 -- set mimetype to app/json
 luci.http.prepare_content("application/json")

 -- dump received ubus data as json
 luci.http.write_json(lan)
end
