#!/usr/bin/env lua

require "ubus"
require "uloop"
require "lunced.tools"
require "lunced.local"
require "lunced.bmx6"
require "lunced.nettest"

JSON = (loadfile "/usr/share/lunced/JSON.lua")()
RUNDIR = "/var/run/lunced"
STATFILE = "/proc/self/stat"
PIDFILE = "lunced.pid"

if arg[1] ~= nil and arg[1] ~= "lunced" then
    PIDFILE = "" .. arg[1] .. ".pid"
end

local fstat = assert(io.open(STATFILE, "r"))
local pid = fstat:read("*number")
fstat:close()

os.execute("mkdir -p " .. RUNDIR)

local fpid = assert(io.open( RUNDIR .. "/" .. PIDFILE, "w+"))
io.output(fpid)
io.write(pid)
io.write("\n")
fpid:close()

local selfInfo = {}

uloop.init()

local timeout = 10
local testTimeout = 26
local tries = 2
local testTries = 1
local conn = ubus.connect()
if not conn then
	error("Failed to connect to ubus")
end

local lunced_method = {
	lunced = {
		--[[bmx6FlushAll = {
			function(req)
				conn:reply(req, lunced_bmx6_flushAll());
				debugMsg("Call to function 'bmx6FlushAll'")
			end, { }
		},--]]
		bmx6All = {
			function(req)
				conn:reply(req, lunced_bmx6_all());
				debugMsg("Call to function 'bmx6All'")
			end, { }
		},
		bmx6Descriptors = {
			function(req)
				conn:reply(req, lunced_bmx6_descriptors());
				debugMsg("Call to function 'bmx6Descriptors'")
			end, { }
		},
		bmx6Interfaces = {
			function(req)
				conn:reply(req, lunced_bmx6_interfaces());
				debugMsg("Call to function 'bmx6Interfaces'")
			end, { }
		},
		bmx6Links = {
			function(req)
				conn:reply(req, lunced_bmx6_links());
				debugMsg("Call to function 'bmx6Links'")
			end, { }
		},
		bmx6SetMetricAlgo = {
			function(req, msg)
				for k,v in pairs(msg) do
					if tostring(k) == "algorithm" and v ~= "" then
						for l,w in pairs(msg) do
							if tostring(l) == "rxExpNumerator" and w ~= "" then
								for m,x in pairs(msg) do
									if tostring(m) == "rxExpDivisor" and x ~= "" then
										for n,y in pairs(msg) do
											if tostring(n) == "txExpNumerator" and y ~= "" then
												for o,z in pairs(msg) do
													if tostring(o) == "txExpDivisor" and z ~= "" then
				         								conn:reply(req, lunced_bmx6_set_metricAlgo(tostring(v), tostring(w), tostring(x), tostring(y), tostring(z) ));
				         							end
				         						end
				         					end
				         				end
				         			end
				         		end
				        	end
						end
					end
				end
				debugMsg("Call to function 'bmx6SetMetricAlgo'")
			end, {algorithm = ubus.STRING, rxExpNumerator = ubus.STRING, rxExpDivisor = ubus.STRING, txExpNumerator = ubus.STRING, txExpDivisor = ubus.STRING}
		},
		bmx6Options = {
			function(req)
				conn:reply(req, lunced_bmx6_options());
				debugMsg("Call to function 'bmx6Options'")
			end, { }
		},
		bmx6Originators = {
			function(req)
				conn:reply(req, lunced_bmx6_originators());
				debugMsg("Call to function 'bmx6Originators'")
			end, { }
		},
		bmx6Parameters = {
			function(req)
				conn:reply(req, lunced_bmx6_parameters());
				debugMsg("Call to function 'bmx6Parameters'")
			end, { }
		},
		--[[bmx6Version = {
			function(req)
				conn:reply(req, lunced_bmx6_version());
				debugMsg("Call to function 'bmx6Version'")
			end, { }
		},--]]
		bmx6Status = {
			function(req)
				conn:reply(req, lunced_bmx6_status());
				debugMsg("Call to function 'bmx6Status'")
			end, { }
		},
		listnodes = {
			function(req, msg)
				-- get nodes
				conn:reply(req, lunced_bmx6_nodes(selfInfo));
				debugMsg("Call to function 'nodes'")
			end, { nodes = ubus.STRING }
		},
		neighbours = {
			function(req)
				conn:reply(req, lunced_bmx6_neighbours(selfInfo));
				debugMsg("Call to function 'neighbours'")
			end, { nodes = ubus.STRING }
		},
		nettestBandwidth = {
			function(req, msg)
				local parameters = " "
				for k,v in pairs(msg) do
					if tostring(k) == "address" and v ~= "" then
						for l,w in pairs(msg) do
							if tostring(l) == "parameters" and w ~= "" then
								parameters = tostring(w)
							end
						end
						debugMsg("Call to function 'nettestBandwidth'")
						conn:reply(req, lunced_nettest_bandwidth(tostring(v), parameters));
					end
				end
			end, {address = ubus.STRING, parameters = ubus.STRING}
		},
		nettestPing = {
			function(req, msg)
				local parameters = " "
				for k,v in pairs(msg) do
					if tostring(k) == "address" and v ~= "" then
						for l,w in pairs(msg) do
							if tostring(l) == "parameters" and w ~= "" then
								parameters = tostring(w)
							end
						end
						debugMsg("Call to function 'nettestPing'")
						conn:reply(req, lunced_nettest_ping(tostring(v), parameters));
					end
				end
			end, {address = ubus.STRING, parameters = ubus.STRING}
		},
		nettestIperf3 = {
			function(req, msg)
				local action = "stop"
				for k,v in pairs(msg) do
					if tostring(k) == "action" and v ~= "" then
						action = tostring(v);
					end
				end
				debugMsg("Call to function 'nettestIperf3'")
				conn:reply(req, lunced_nettest_iperf3(action));
			end, {action = ubus.STRING}
		},
		self = {
			function(req)
				conn:reply(req, lunced_bmx6_local(selfInfo));
				debugMsg("Call to function 'self'")
			end, {id = ubus.STRING, name = ubus.STRING }
		},
		systemBoard = {
			function(req)
				conn:reply(req, conn:call("system", "board", {}));
				debugMsg("Call to function 'systemBoard'")
			end, { }
		},
		systemInfo = {
			function(req)
				conn:reply(req, conn:call("system", "info", {}));
				debugMsg("Call to function 'systemInfo'")
			end, { }
		},
		version = {
			function(req)
				conn:reply(req, lunced_local_version(selfInfo) );
				debugMsg("Call to function 'version'")
			end, { version = ubus.STRING }
		},
		reply = {
			function(req, msg)
				debugMsg("Call to function 'reply'")
				local action = "status"
				local address = "::1"
				local algorithm = ""
				local cmd = ""
				local data = ""
				local rxExpNumerator = ""
				local rxExpDivisor = ""
				local txExpNumerator = ""
				local txExpDivisor = ""
				local parameters = " "
				local url = ""

				for k,v in pairs(msg) do
					if tostring(k) == "id" then
						toIP = uuid2ipv6(tostring(v))
					end
					if tostring(k) == "cmd" then
						cmd = tostring(v)
					end
					if tostring(k) == "algorithm" then
						algorithm = tostring(v)
					end
					if tostring(k) == "rxExpNumerator" then
						rxExpNumerator = tostring(v)
					end
					if tostring(k) == "rxExpDivisor" then
						rxExpDivisor = tostring(v)
					end
					if tostring(k) == "txExpNumerator" then
						txExpNumerator = tostring(v)
					end
					if tostring(k) == "txExpDivisor" then
						txExpDivisor = tostring(v)
					end
					if tostring(k) == "address" then
						address = tostring(v)
						-- print("ADDRESS: " .. address)
					end
					if tostring(k) == "parameters" then
						parameters = tostring(v)
					end
					if tostring(k) == "action" then
						action = tostring(v)
					end
				end

				if selfInfo.id == nil then
					 lunced_bmx6_getSelfInfo(selfInfo)
				end

				if toIP == uuid2ipv6(selfInfo.id) then
					if cmd =="bmx6FlushAll" then
						data = lunced_bmx6_flushAll(selfInfo)
					elseif cmd =="bmx6All" then
						data = lunced_bmx6_all(selfInfo)
					elseif cmd =="bmx6Descriptors" then
						data = lunced_bmx6_descriptors(selfInfo)
					elseif cmd =="bmx6Interfaces" then
						data = lunced_bmx6_interfaces(selfInfo)
					elseif cmd =="bmx6Links" then
						data = lunced_bmx6_links(selfInfo)
					elseif cmd =="bmx6SetMetricAlgo" then
						data = lunced_bmx6_set_metricAlgo(algorithm, rxExpNumerator, rxExpDivisor, txExpNumerator, txExpDivisor)
					elseif cmd =="bmx6Options" then
						data = lunced_bmx6_options(selfInfo)
					elseif cmd =="bmx6Originators" then
						data = lunced_bmx6_originators(selfInfo)
					elseif cmd =="bmx6Parameters" then
						data = lunced_bmx6_parameters(selfInfo)
					elseif cmd =="bmx6Version" then
						data = lunced_bmx6_version(selfInfo)
					elseif cmd =="bmx6Status" then
						data = lunced_bmx6_status(selfInfo)
					elseif cmd == "listnodes" then
						data = lunced_bmx6_nodes(selfInfo)
					elseif cmd == "nettestBandwidth" then
						data = lunced_nettest_bandwidth(address, parameters)
					elseif cmd == "nettestIperf3" then
						data = lunced_nettest_iperf3(action)
					elseif cmd == "nettestPing" then
						data = lunced_nettest_ping(address, parameters)
					elseif cmd == "neighbours" then
						data = lunced_bmx6_neighbours(selfInfo)
					elseif cmd == "self" then
						data = lunced_bmx6_local(selfInfo)
					elseif cmd == "version" then
						data = lunced_local_version(selfInfo)
					end

				elseif node_in_nodes(ipv62uuid(toIP), lunced_bmx6_nodes(selfInfo).nodes) then
					command = ""

					if cmd == "bmx6SetMetricAlgo" then
						command = "/usr/bin/wget --no-check-certificate -T ".. timeout .." -t " .. tries .. " -qO - http://[" .. tostring(toIP) .. "]/cgi-bin/lunced?cmd=" .. tostring(cmd) .. "'&'algorithm=" .. tostring(algorithm) .. "'&'rxExpNumerator=" .. tostring(rxExpNumerator) .. "'&'rxExpDivisor=" .. tostring(rxExpDivisor) .. "'&'txExpNumerator=" .. tostring(txExpNumerator) .. "'&'txExpDivisor=" .. tostring(txExpDivisor)
						print(command)

					elseif cmd == "nettestBandwidth" then
						command = "/usr/bin/wget --no-check-certificate -T ".. testTimeout .." -t " .. tries .. " -qO - http://[" .. tostring(toIP) .. "]/cgi-bin/lunced?cmd=" .. tostring(cmd) .. "'&'address=" .. tostring(address) .. "'&'parameters=" .. "'" .. tostring(parameters) .. "'"
						print(command)

					elseif cmd == "nettestPing" then
						command = "/usr/bin/wget --no-check-certificate -T ".. testTimeout .." -t " .. tries .. " -qO - http://[" .. tostring(toIP) .. "]/cgi-bin/lunced?cmd=" .. tostring(cmd) .. "'&'address=" .. tostring(address) .. "'&'parameters=" .. "'" .. tostring(parameters) .. "'"
						print(command)

					elseif cmd == "nettestIperf3" then
						command = "/usr/bin/wget --no-check-certificate -T ".. timeout .." -t " .. tries .. " -qO - http://[" .. tostring(toIP) .. "]/cgi-bin/lunced?cmd=" .. tostring(cmd) .. "'&'action=" .. tostring(action)
						print(command)

					elseif cmd == "bmx6infoDescriptions" then
						command = "/usr/bin/wget --no-check-certificate -T ".. timeout .." -t " .. tries .. " -qO - http://[" .. tostring(toIP) .. "]/cgi-bin/bmx6-info?descriptions/all"
						print (command)

					elseif cmd == "bmx6infoInterfaces" then
						command = "/usr/bin/wget --no-check-certificate -T ".. timeout .." -t " .. tries .. " -qO - http://[" .. tostring(toIP) .. "]/cgi-bin/bmx6-info?interfaces"
						print(command)

					elseif cmd == "bmx6infoLinks" then
						command = "/usr/bin/wget --no-check-certificate -T ".. timeout .." -t " .. tries .. " -qO - http://[" .. tostring(toIP) .. "]/cgi-bin/bmx6-info?links"
						print(command)

					elseif cmd == "bmx6infoOptions" then
						command = "/usr/bin/wget --no-check-certificate -T ".. timeout .." -t " .. tries .. " -qO - http://[" .. tostring(toIP) .. "]/cgi-bin/bmx6-info?options"
						print(command)

					elseif cmd == "bmx6infoParameters" then
						command = "/usr/bin/wget --no-check-certificate -T ".. timeout .." -t " .. tries .. " -qO - http://[" .. tostring(toIP) .. "]/cgi-bin/bmx6-info?parameters"
						print(command)

					elseif cmd == "bmx6infoOriginators" then
						command = "/usr/bin/wget --no-check-certificate -T ".. timeout .." -t " .. tries .. " -qO - http://[" .. tostring(toIP) .. "]/cgi-bin/bmx6-info?originators/all"
						print(command)

					elseif cmd == "bmx6infoStatus" then
						command = "/usr/bin/wget --no-check-certificate -T ".. timeout .." -t " .. tries .. " -qO - http://[" .. tostring(toIP) .. "]/cgi-bin/bmx6-info?status"
						print(command)

					else
						command = "/usr/bin/wget --no-check-certificate -T ".. timeout .." -t " .. tries .. " -qO - http://[" .. tostring(toIP) .. "]/cgi-bin/lunced?cmd=" .. tostring(cmd)
						print(command)
					end

					local dataString = run(command)

					if dataString == "" then
						dataString = errorCode(100)
					end

					if string.sub(dataString, 1, 1) == "[" then
						data = JSON:decode('{ "data" :'..dataString..'}')
					else
						data = JSON:decode(dataString)
					end

				else
					data = JSON:decode(errorCode(101))
				end

				if data ~= "" then
					conn:reply(req, data )
				end
			end, { cmd = ubus.STRING }
		}
	}
}

if arg[1] ~= nil and arg[1] ~= "lunced" then
    lunced_method[arg[1]] = lunced_method['lunced']
end
conn:add(lunced_method)

uloop.run()
