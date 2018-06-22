

function run(command)
	debugMsg ("Try to execute: " .. command)
	local handle = io.popen(command)
	local result = handle:read("*a")
	handle:close()
	return result
end

function errorCode(num)
	return '{ "error" : "' .. tostring(num) .. '" , "msg" : "' .. errorMessage(num) .. '" }'
end

function debugMsg(msg)
	local debug = 0
	if debug == 1 then
		print (msg)
	end
end


function errorMessage(num)

	local result = nil

	if num == 100 then
		result = "The remote node returned did not reply, or replied with null content."
	elseif num == 101 then
		result = "The remote node is not in the known nodes list."
	else
		result = "Big error, bro!"
	end

	return result
end

--Check if node is in the nodes list
function node_in_nodes(node, nodes)
	local result = false

	for i,v in ipairs(nodes) do
		if v == node then
			result = true
			break
			end

	end

	return result
end