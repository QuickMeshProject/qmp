-- BMX7 commands

function ipv62uuid(ipv6)
	ipv6 = string.gsub(ipv6,":","_")
	return(ipv6)
end

function uuid2ipv6(uuid)
	uuid = string.gsub(uuid,"_",":")
	return(uuid)
end

-- function localIP2uuid(ipv6)
--	return(string.gsub(ipv6,"",""))
-- end

--[[function lunced_bmx7_flushAll()
	local flushAll = os.execute('bmx7 -c --flushAll')
	return( flushAll )
end--]]

function lunced_bmx7_all()
	local all = JSON:decode('{"interfaces":' .. run('bmx7 -c --jshow interfaces') .. ', "links":' .. run('bmx7 -c --jshow links') .. ', "originators":' .. run('bmx7 -c --jshow originators') .. ', "status":' .. run('bmx7 -c --jshow status') .. '}')
	return( all )
end

function lunced_bmx7_descriptors()
	local descriptors
	 = JSON:decode(run('first=true; \
	 					 json="{\\\"descriptors\\\":["; \
	 					for file in /var/run/bmx7/json/descriptions/*; do \
	 						if [ "$first" == "true" ]; then \
	 							first=false; \
	 						else \
	 							json=$json","; \
	 						fi; \
	 						json=$json`cat $file`; \
	 					done; \
	 					json=$json"]}"; \
	 					echo $json'))
	return( descriptors )
end

function lunced_bmx7_interfaces()
	local interfaces = JSON:decode(run('bmx7 -c --jshow interfaces'))
	return( interfaces )
end

function lunced_bmx7_links()
	local links = JSON:decode(run('bmx7 -c --jshow links'))
	return( links )
end

function lunced_bmx7_set_metricAlgo(algorithm, rxExpNumerator, rxExpDivisor, txExpNumerator, txExpDivisor)
    local bmx7result = run('bmx7 -c --metricAlgo ' .. algorithm .. ' /rxExpNumerator ' .. rxExpNumerator .. ' /rxExpDivisor ' .. rxExpDivisor .. ' /txExpNumerator ' ..  txExpNumerator .. ' /txExpDivisor ' .. txExpDivisor)
    local result = JSON:decode('{"metricAlgo":"' .. bmx7result .. '"}')
    return (result)
end

function lunced_bmx7_options()
	local options = JSON:decode(run('cat /tmp/run/bmx7/json/options'))
	return( options )
end

function lunced_bmx7_originators()
	local originators = JSON:decode(run('bmx7 -c --jshow originators'))
	return( originators )
end

function lunced_bmx7_parameters()
	local parameters = JSON:decode(run('cat /tmp/run/bmx7/json/parameters'))
	return( parameters )
end

function lunced_bmx7_status()
	local status = JSON:decode(run('bmx7 -c --jshow status'))
	return( status )
end

--[[function lunced_bmx7_version()
	local version = JSON:decode(run('bmx7 -c --version'))
	return( parameters )
end--]]

function lunced_bmx7_nodes(sI)
	local nodes = JSON:decode(run('bmx7 -c --jshow originators'))
	local ret_nodes = {}
	ret_nodes['nodes'] = {}
	for i,v in ipairs(nodes.originators) do
		ret_nodes['nodes'][i] = ipv62uuid(v.primaryIp)
	end
	nodes = nil
	return( ret_nodes )
end

function lunced_bmx7_neighbours(sI)
	local links = JSON:decode(run('bmx7 -c --jshow links'))
	local nodes = JSON:decode(run('bmx7 -c --jshow originators'))
	local list_nodes = {}
	local ret_nodes = {}
	local counter = 1
	list_nodes['nodes'] = {}
	ret_nodes['nodes'] = {}

	if links ~= nil then
		for i,v in ipairs(links.links) do
			for o,b in ipairs(nodes.originators) do
				if v.name == b.name then
					list_nodes['nodes'][b.name] = ipv62uuid(b.primaryIp)
				end
			end
		end
		counter = 1
		for i,v in pairs(list_nodes.nodes) do
			ret_nodes['nodes'][counter] = v
			counter = counter + 1
		end
	end
	list_nodes = nil
	links = nil
	nodes = nil
	return( ret_nodes )
end

function lunced_bmx7_local(sI)
	local ret = {}
	if sI.id == nil then
		lunced_bmx7_getSelfInfo(sI)
	end
	ret['id'] = sI['id']
	ret['name'] = sI['name']
	return (ret)
end

function lunced_bmx7_version(sI)
	local ret = {}
	if sI.bmx7 == nil then
		lunced_bmx7_getSelfInfo(sI)
	end
	ret['bmx7'] = sI['bmx7']
	return (ret)
end

function lunced_bmx7_getSelfInfo(sI)
	local myinfo = JSON:decode(run("bmx7 -c --jshow status"))
	sI['id'] = ipv62uuid(myinfo.status.primaryIp)
	sI['name'] = myinfo.status.name
	sI['bmx7'] = myinfo.status.version
	myinfo = nil
end
