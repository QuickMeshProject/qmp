-- Network test commands

function lunced_nettest_bandwidth( address, parameters )
	if parameters == "" then parameters = " " end
	parameters = parameters:gsub('%%20', ' ')
	local result = run( 'iperf3 -c ' .. address .. ' -J ' .. parameters .. ' & pid=$!; sleep 23 && kill $pid' )
	if result == nil then
		return JSON:decode('{}')
	else
		return JSON:decode( string.gsub( result, "nan", 0 ) )
	end
end


function lunced_nettest_iperf3( action )
	if action == "stop" then
		run ('killall -9 iperf3')
		local pid = run( 'pidof iperf3' )
		if pid == "" then pid = -1 end
		local result = JSON:decode('{"pid": ' .. pid ..'}')
		return (result)
	elseif action == "start" then
		run ('iperf3 -sD')
		local pid = run( 'pidof iperf3' )
		if pid == "" then pid = -1 end
		local result = JSON:decode('{"pid": ' .. pid ..'}')
		return (result)
	elseif action == "restart" then
		run ('killall -9 iperf3')
		run ('iperf3 -sD')
		local pid = run( 'pidof iperf3' )
		if pid == "" then pid = -1 end
		local result = JSON:decode('{"pid": ' .. pid ..'}')
		return (result)
	elseif action == "installed" then
		local installed = run ('[ -x /usr/bin/iperf3 ] && echo true')
		if installed == "" then installed = 'false' end
		local result = JSON:decode('{"installed": ' .. installed ..'}')
		return (result)
	else
		local pid = run( 'pidof iperf3' )
		if pid == "" then pid = -1 end
		local result = JSON:decode('{"pid": ' .. pid ..'}')
		return (result)
	end
end


function lunced_nettest_ping( address, parameters )
	if parameters == "" then parameters = "-c 10" end
	parameters = parameters:gsub('%%20', ' ')
	local pingresult = run( 'ping6 ' .. parameters .. ' -W 25 -w 25 ' .. address )
	local result = JSON:decode('{"ping":"' .. pingresult .. '"}')
	return (result)
end


function lunced_nettest_oldping( address, pingCount, pingSize )
	local pingresult = run( 'ping6 -c ' .. pingCount .. ' -s ' .. pingSize .. ' -W 180 -w 180 ' .. address )
	local result = JSON:decode('{"ping":"' .. pingresult .. '"}')
	return (result)
end