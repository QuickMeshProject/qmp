#!/bin/sh

# This script checks if the wireless devices configured in /etc/config/qmp are
# operating in the channel they are configured to. It is useful to go back to
# the configured channel if DFS switches the device to another one.

# Make sure there is at least one wireless device configured
lastdev=$(uci -q get qmp.@wireless[-1].device)
if [ $lastdev ]; then

	# Iterate through all the configured devices
	i=0
	while [ $i -ge 0 ]; do

		# Get qMp device configuration parameters
		qmpdev=$(uci -q get qmp.@wireless[${i}].device)
		qmpmode=$(uci -q get qmp.@wireless[${i}].mode)
		qmpchannel=$(uci -q get qmp.@wireless[${i}].channel)

		# Check the device is not disabled in qMp, skip it otherwise
		if [ "$qmpmode" != "none" ]; then

			wifiradio=$(uci -q get wireless.$qmpdev.device)
			if [ $wifiradio ]; then

				wifichannel=$(uci get wireless.${wifiradio}.channel)

				if [ $wifichannel ]; then
					iwchannel=$(iw dev $qmpdev info | grep channel | sed -e 's/^[ \t]*//' | cut -d ' ' -f 2)

					# Trim the HT40 upper/lower channel extension info (i.e., the + or - symbols)
					qmpchannelnum=$(echo ${qmpchannel} | sed -e 's/[-+]*//g')
					wifichannelnum=$(echo ${wifichannel} | sed -e 's/[-+]*//g')

					# Check that channel configurations in /etc/config/qmp and /etc/config/wireless match
					if [ "$qmpchannelnum" == "$wifichannelnum" ]; then

						# If iw does not report a channel, or if it reports a channel different to the one
						# configured in /etc/config/wireless, reset the wifi
						if [ ! $iwchannel ] || [ $wifichannelnum -ne $iwchannel ]; then
							wifi
							exit 0
						fi
					fi
				fi
			fi

		fi

		if [ "$(uci -q get qmp.@wireless[${i}].device)" == "$(uci -q get qmp.@wireless[-1].device)" ]; then
			i=-1
		else
			let i=$i+1
		fi
	done
fi
