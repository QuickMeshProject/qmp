#!/bin/sh /etc/rc.common
# requires ip ipv6calc awk sed grep
QMP_PATH="/etc/qmp"
SOURCE_FUNCTIONS=1

#######################
# Importing files
######################
if [ -z "$SOURCE_OPENWRT_FUNCTIONS" ]
then
	. /lib/functions.sh
	SOURCE_OPENWRT_FUNCTIONS=1
fi
. $QMP_PATH/qmp_common.sh
[ -z "$SOURCE_GW" ] && . $QMP_PATH/qmp_gw.sh
[ -z "$SOURCE_NET" ] && . $QMP_PATH/qmp_network.sh
[ -z "$SOURCE_SYS" ] && . $QMP_PATH/qmp_system.sh
[ -z "$SOURCE_WIRELESS" ] && . $QMP_PATH/qmp_wireless.sh
[ -z "$SOURCE_COMMON" ] && . $QMP_PATH/qmp_common.sh

qmp_get_llocal_for_dev() {
  local dev=$1
  ip a show dev $dev | awk '/inet6/{print $2}'
}

# returns primary device
qmp_get_primary_device() {
  local primary_mesh_device="$(uci get qmp.node.primary_device)"
  [ -z "$primary_mesh_device" ] &&
      {
      if ip link show dev eth0 > /dev/null; then
        primary_mesh_device="eth0"
      else
        primary_mesh_device="$(ip link show | awk '!/lo:/&&/^[0-9]?:/{sub(/:$/,"",$2); print $2; exit}')"
      fi
      [ -z "$primary_mesh_device" ] && echo "CRITICAL: No primary network device found, please define qmp.node.primary_device"
      }
  echo "$primary_mesh_device"
}

# check if a device exists
qmp_check_device() {
	ip link show $1 1> /dev/null 2>/dev/null
	return $?
}

# Function qmp_set_vlan()
#
# This function creates a VLAN interface on top of an interface in order to
# isolate the routing protocol traffic there:
#
#  - 802.1 VLANs are used for wireless interfaces.
#  - 802.1ad (QinQ) VLANs are used for wired devices since qMp > 3.2.1
qmp_set_vlan() {
  local iface="$1" # The physical interface
  local vid=$2     # The VLAN
  local liface=$3  # The logical interface lan/wan_X/mesh_Y

  echo "Setting VLAN $vid for interface $iface"
  [ -z "$iface" ] || [ -z "$vid" ] && return

  # Replace dots by underscores to use the interface name as part of another one
  local uiface="$(echo $iface | sed -r 's/\./_/g')"

	uci set network.${uiface}_${vid}=device
	local vtype=""
	# If $dev exists and is not wireless
  if [ -e "/sys/class/net/$dev" ] && [ ! -e "/sys/class/net/$dev/phy80211" ]; then
    # 802.1ad VLANs for wired interfaces
    uci set network.${uiface}_${vid}.type=8021ad
		vtype="ad"
		echo "VLAN $vid for interface $iface is of type 802.1ad (QinQ)"
  else
		# 802.1q VLANs for wireless interfaces
		uci set network.${uiface}_${vid}.type=8021q
		echo "VLAN $vid for interface $iface is of type 802.1q"
		vtype="q"
  fi

	uci set network.${uiface}_${vid}.name=${uiface}_${vid}
	if [ -e "/sys/class/net/$dev" ] && [ ! -e "/sys/class/net/$dev/phy80211" ]; then
		# VLANs for wired interfaces are configured directly on top of the physical
		# interface (e.g. eth0.2, eth1)
		uci set network.${uiface}_${vid}.ifname=${iface}
	else
		# VLANs for wireless interfaces need to be configured on top of the
		# logical interface the radio is put in (e.g. mesh_w0 for wlan0)
		uci set network.${uiface}_${vid}.ifname='@'${liface}
	fi
	uci set network.${uiface}_${vid}.vid=${vid}

  uci set network.${uiface}_${vid}_${vtype}=interface
  uci set network.${uiface}_${vid}_${vtype}.device=${uiface}_${vid}
  uci set network.${uiface}_${vid}_${vtype}.proto="none"
  uci set network.${uiface}_${vid}_${vtype}.auto=1
  uci commit network
}

# Function qmp_set_viface()
#
# This function creates a virtual dummy interface (e.g., mesh_e2) on top of a
# network device (e.g., eth2). This is needed for wired devices working only as
# MESH, which otherwise are not brought up even if they have link. Fixes #493.
qmp_set_viface() {
	local dev="${1}"		# The physical interface
	local viface="${2}"	# The virtual device

	echo "Setting virtual interface ${viface} for device ${dev}"
  [ -z "${dev}" ] || [ -z "${viface}" ] && return

  # Replace dots by underscores, in case there is any
  local viface="$(echo $viface | sed -r 's/\./_/g')"

	uci set network.${viface}="interface"
	uci set network.${viface}.device=${dev}
	uci set network.${viface}.auto=1
	uci set network.${viface}.proto="none"

	uci commit network
}

qmp_get_virtual_iface() {
	local device="$1"
	local viface=""

	# Is it the br-lan interface?
	if [ "$device" == "br-lan" ]; then
		viface="lan"
		if [ ! -e "/sys/class/net/$device/phy80211" ]; then
			echo $viface
			return
		fi
	fi

	# Is it in the LAN bridge, and not wireless?
	for l in $(qmp_get_devices lan); do
		if [ "$l" == "$device" ]; then
			viface="lan"
			if [ ! -e "/sys/class/net/$device/phy80211" ] && ! qmp_is_in "$device" $(qmp_get_wifi_devices); then
				qmp_log "LOG: 5"
				qmp_log "Viface: $viface"
				qmp_log "$device $viface"
				qmp_log "$(qmp_get_wifi_devices)"
				echo $viface
				return
			fi
		fi
	done

	qmp_log "LOG: 6"
	qmp_log "Viface: $viface"
	qmp_log "$device $viface"

	[ ! -e "/sys/class/net/$device/phy80211" ] && ! qmp_is_in "$device" $(qmp_get_wifi_devices) && [ -n "$viface" ] && {
		echo $viface;
		qmp_log "LOG: 7"
		qmp_log "Viface: $viface"
		qmp_log "$device $viface"
		echo "$viface"
		return;
	}

	# id_char are the two leading chararacters of the device name: [et]h0, [et]h0.2, [wl]an1a, [la]n1, [wa]n
	local id_char=$(echo $device | cut -c 1,2)
	# id_num is the number of the device: eth[0], eth[0,2] wlan[1]a
	local id_num=$(echo $device | tr -d "[A-z]" | tr - _ | tr . _)
	# id_extra are the extra characters after the number: eth0[], eth0.2[], wlan1[a]
	local id_extra=$(echo $device | sed -e 's/\.//g' | sed -e 's/^[a-z]*[0-9]*//g')

	# It it a WAN device?
	for w in $(qmp_get_devices wan); do
		if [ "$w" == "$device" ]; then
			viface="wan_${id_char}${id_num}"
			qmp_log "LOG: 8"
			qmp_log "Viface: $viface"
			qmp_log "$device $viface"
			echo $viface
			return
		fi
	done

	# Is it mesh?
	for w in $(qmp_get_devices mesh); do
		if [ "$w" == "$device" ]; then
			qmp_log "LOG: 9"
			viface="mesh_${id_char}${id_num}${id_extra}"
			qmp_log "Viface: $viface"
			qmp_log "$device $viface"
			echo "$viface"
			return
		fi
	done
}

# arg1=<mesh|lan|wan>, returns the devices which have to be configured in such mode
qmp_get_devices() {
  local devices=""

  if [ "$1" == "mesh" ]; then
		devices="$(uci get qmp.interfaces.mesh_devices 2>/dev/null)"
	fi

  if [ "$1" == "lan" ]; then
     devices="$(uci get qmp.interfaces.lan_devices 2>/dev/null)"
  fi

  if [ "$1" == "wan" ]; then
     devices="$(uci get qmp.interfaces.wan_devices 2>/dev/null)"
  fi

  echo "$devices"
}


# Scan and configure the network devices (lan, mesh and wan)
# if $1 is set to "force", it rescan all devices
qmp_configure_smart_network() {
	echo "---------------------------------------"
	echo "Starting smart networking configuration"
	echo "---------------------------------------"
	local force=$1
	local mesh=""
	local wan=""
	local lan=""
	local dev=""
	local phydevs=""
	local ignore_devs=""
	local novlan=""
	local default_lan=$(qmp_get_openwrt_default_network "lan")
	local default_wan=$(qmp_get_openwrt_default_network "wan")

	local all_sysclassnet_devices=""
	for dev in $(ls /sys/class/net/); do
		all_sysclassnet_devices="${dev} ${all_sysclassnet_devices}"
	done
	echo "Network devices detected in /sys/class/net:"
	echo " - ${all_sysclassnet_devices}"
	echo "OpenWrt default LAN interfaces:"
	echo " - ${default_lan}"
	echo "OpenWrt default WAN interfaces:"
	echo " - ${default_wan}"

	[ "$force" == "default" ] && {
		qmp_wait_for_interface_to_appear "br-lan"
		for dev in $default_lan; do
			qmp_wait_for_interface_to_appear "${dev}"
		done
		for dev in $default_wan; do
			qmp_wait_for_interface_to_appear "${dev}"
		done
	}

	[ "$force" != "force" ] && {
		ignore_devs="$(qmp_uci_get interfaces.ignore_devices) "
		[ -n "${ignore_devs}" ] && \
		echo "Devices to ignore in qMp config:"
		echo " - ${ignore_devs}"
	}

	# Detect physical devices in /sys/class/net
	for dev in $(ls /sys/class/net/); do
		[ -e /sys/class/net/$dev/device ] || [ dev == "eth0" ] && {
			local id
			local ignore=0

			# Check if device is in the qMp ignore list to skip it
				for id in $ignore_devs; do
					[ "$id" == "$dev" ] && ignore=1
				done

			# The device might be a wired device (e.g. eth0) with a managed switch to
			# drive several ports. If it uses the old switch driver, virtual switched
			# devices are named with a dot (e.g. eth0.1, eth0.2). We check for
			# switched device that has the current device as its upper physical device
			# and add them instead (processing eth0? => add eth0.1 and eth0.2)
			for sdev in $(ls /sys/class/net/$dev/ | grep upper_$dev. | cut -d "_" -f2); do
				phydevs="$phydevs $sdev"
				ignore=1
				# Add $dev to ignore list (only when different from $sdev, to avoid
				# adding wireless devices to it)
				[ "${dev}" != "${sdev}" ] && ignore_devs="$ignore_devs $dev"
			done

			# The device might be a wired device (e.g. eth0) with a managed switch to
			# drive several ports. If it uses the new DSA switch driver, virtual
			# switched devices are named like regular interfaces (e.g., lan1, lan2).
			# We check for the "dsa" subdirectory in the physical device to skip it.
			[ -e /sys/class/net/$dev/dsa ] && ignore=1 && ignore_devs="$ignore_devs $dev"

			if [ $ignore -eq 0 ]; then
				phydevs="$phydevs $dev"
			fi
		}
	done
	phydevs=$(for i in ${phydevs}; do echo $i | grep -v -e ".*ap$" | sed '/./,$!d'; done | sort -u | tr -d ' ' \t | xargs)
	ignore_devs=$(for i in ${ignore_devs}; do echo $i | grep -v -e ".*ap$" | sed '/./,$!d'; done | sort -u | tr -d ' ' \t | xargs)

	# Add OpenWrt defaults to phydevs when force or default is enabled
	( [ "$force" == "force" ] || [ "$force" == "default" ] ) && {
		phydevs="$(echo ${phydevs} ${default_lan} ${default_wan} | tr ' ' '\n' | sort -u | xargs)"
	}

	echo "Physical devices to process:"
	echo " - "${phydevs}
	[ -n "${ignore_devs}" ] && \
		echo "Devices to ignore:" && \
		echo " - "${ignore_devs}

	# if force is not enabled, we are not changing the existing lan/wan/mesh (only adding new ones)
	[ "$force" != "force" ] && {
		lan="$(qmp_uci_get interfaces.lan_devices)"
		wan="$(qmp_uci_get interfaces.wan_devices)"
		mesh="$(qmp_uci_get interfaces.mesh_devices)"
		novlan="$(qmp_uci_get interfaces.no_vlan_devices)"
	}

	local j=0
	local mode=""
	local cnt
	local cdev

	for dev in $phydevs; do
		# If force is enabled, do not check if the device is already configured
		[ "$force" != "force" ] && {

			cnt=0
			# If it is already configured, doing nothing
			for cdev in $lan; do
				[ "$cdev" == "$dev" ] && cnt=1
			done
			for cdev in $mesh; do
				[ "$cdev" == "$dev" ] && cnt=1
			done
			for cdev in $wan; do
				[ "$cdev" == "$dev" ] && cnt=1
			done
			[ $cnt -eq 1 ] && continue
		}

		# If the device is not configured already, assign its role acording to
		# OpenWrt's defaults. This avoids the per-device hooks that swapped roles
		for ddev in $default_lan; do
			[ "$dev" == "$ddev" ] && {
				lan="$dev $lan"
				mesh="$dev $mesh"
				novlan="$dev $novlan"
				continue
			}
		done
		for ddev in $default_wan; do
			[ "$dev" == "$ddev" ] && {
				wan="$dev $wan"
				mesh="$dev $mesh"
				novlan="$dev $novlan"
				continue
			}
		done

		# if it is a wifi device (actually, if it is not a non-wifi device)
		! ( [ -e "/sys/class/net/$dev" ] && [ ! -e "/sys/class/net/$dev/phy80211" ] ) && {
			j=0
			while qmp_uci_test qmp.@wireless[$j]; do
				[ "$(qmp_uci_get @wireless[$j].device)" == "$dev" ] && {
					mode="$(qmp_uci_get @wireless[$j].mode)"
					( [ "$mode" == "aplan" ] || [ "$mode" == "80211s_aplan" ] || [ "$mode" == "adhoc_ap" ] ) && lan="$dev $lan"
					( [ "$mode" == "80211s" ] || [ "$mode" == "80211s_aplan" ] || [ "$mode" == "80211s_adhoc" ] || [ "$mode" == "adhoc" ] || [ "$mode" == "adhoc_ap" ] ) && mesh="$dev $mesh"
					break
				}
				j=$(($j+1))
			done
		} && continue

		# If it's not wireless nor a default wan/lan, set it to mesh
		[ "$dev" != "$default_lan" ] && [ "$dev" != "$default_wan" ] && {
			inmesh="0"
			innovlan="0"
			# A small trick to avoid duplicates when $default_xan = "eth1 eth2" (e.g., APUs)
			for mdev in $mesh; do
				[ "$mdev" == "$dev" ] && inmesh="1"
			done
			[ "$inmesh" == "0" ] && mesh="$dev $mesh"

			for mdev in $novlan; do
				[ "$mdev" == "$dev" ] && innovlan="1"
			done
			[ "$innovlan" == "0" ] && novlan="$dev $novlan"
		}

	done

	echo ""
	echo "Smart network configuration result:"
	echo " - LAN: ${lan}"
	echo " - WAN: ${wan}"
	echo " - Mesh: ${mesh}"
	echo " - No VLAN: ${novlan}"
	echo " - Ignored: ${ignore_devs}"
	echo ""

	# Writes the devices to the config
	qmp_uci_set interfaces.lan_devices "$(echo $lan | sed -e s/"^ "//g -e s/" $"//g)"
	qmp_uci_set interfaces.mesh_devices "$(echo $mesh | sed -e s/"^ "//g -e s/" $"//g)"
	qmp_uci_set interfaces.wan_devices "$(echo $wan | sed -e s/"^ "//g -e s/" $"//g)"
	qmp_uci_set interfaces.no_vlan_devices "$(echo $novlan | sed -e s/"^ "//g -e s/" $"//g)"
	qmp_uci_set interfaces.ignore_devices "$ignore_devs"
}

qmp_get_openwrt_default_network() {
	local role=$1
	local board_file="/etc/board.json"
	local flen=$(wc -l $board_file | cut -d " " -f 1)

	[ "$role" != "lan" ] && [ "$role" != "wan" ] && return

	# Fix for #489 after introduction of UCI bridge model (OpenWrt >= 21.02)
	#grep -A${flen} "network" $board_file | grep -A${flen} $role | grep -m 1 -B${flen} "}" | grep -m 1 "ifname" | cut -d ":" -f2 | sed -e 's/^[ \t]*//' | cut -d '"' -f 2
	[ "$role" == "lan" ] && grep -A${flen} "network" $board_file | grep -A${flen} $role | grep -m 1 -B${flen} "}" | grep -m 1 "device" | cut -d ":" -f2 | sed -e 's/^[ \t]*//' | cut -d '"' -f 2
	[ "$role" == "lan" ] && cat /etc/board.json  | jsonfilter -e '@.network.lan.ports' | sed -e s/"\["//g | sed -e s/"]"//g | sed -e s/","//g | sed -e s/\"//g | sed -e s/"^ "//g
	[ "$role" == "wan" ] && grep -A${flen} "network" $board_file | grep -A${flen} $role | grep -m 1 -B${flen} "}" | grep -m 1 "device" | cut -d ":" -f2 | sed -e 's/^[ \t]*//' | cut -d '"' -f 2
}

qmp_attach_device_to_interface() {
	local device=$1
	local interface=$2
	local intype="$(qmp_uci_get_raw network.$interface.type)"
	# Fix for #489 after introduction of UCI bridge model (OpenWrt >= 21.02)
	local inucibrlan="$(qmp_uci_get_raw network.$interface.device)"
	local inucitype="$(qmp_uci_get_item_by_unnamed_section_type_and_name network device ${inucibrlan} type)"
	local brlanid="$(qmp_uci_get_unnamed_section_id_by_type_and_name network device ${inucibrlan})"

	echo "Attaching device $device to interface $interface"

	# is it a wifi device?
	if qmp_uci_test wireless.$device; then
		qmp_uci_set_raw wireless.$device.network=$interface
		echo " -> $device wireless attached to $interface"

	# if it is not
	else
			# Fix for #489 after introduction of UCI bridge model (OpenWrt >= 21.02)
			if [ "$intype" == "bridge" ] || [ "$inucitype" == "bridge" ]; then
				qmp_uci_add_list_raw network.$brlanid.ports=$device
				echo " -> $device attached to $interface bridge"
			else
				qmp_uci_set_raw network.$interface.device=$device
				echo " -> $device attached to $interface"
			fi
	fi
}

qmp_get_ip6_slow() {
  local addr_prefix="$1"
  local addr="$(echo $addr_prefix | awk -F'/' '{print $1}')"
  local mask="$(echo $addr_prefix | awk -F'/' '{print $2}')"

  echo "qmp_get_ip6_slow addr_prefix=$addr_prefix addr=$addr mask=$mask" 1>&2

  if [ -z "$mask" ] ; then
    mask="128"
  fi

  local addr_in=$addr
  local addr_out=""
  local found=0

  while ! [ -z "$addr_in" ] ; do

    addr_in=$( echo $addr_in | sed -e "s/^://g" )

    if echo "$addr_in" | grep "^:"  >/dev/null 2>&1 ; then

      if echo "$addr_in" | grep "::"  >/dev/null 2>&1 ; then
        echo "Invalid 1 IPv6 address $addr_prefix" 1>&2
        return 1
      fi

      addr_in=$( echo $addr_in | sed -e "s/^://g" )

      if [ -z "$addr_in" ] ; then
        addr_out="$addr_out::"
      else
        addr_out="$addr_out:"
      fi

    else

      local addr16="$(echo $addr_in | awk -F':' '{print $1}')"
      addr_in=$( echo $addr_in | sed -e "s/^$addr16//g" )

      if [ -z "$addr_out" ] ; then
	addr_out="$addr16"
      else
	addr_out="$addr_out:$addr16"
      fi

      if echo "$addr16" | grep '\.'  >/dev/null 2>&1 ; then
        found=$(( $found + 2 ))
      else
        found=$(( $found + 1 ))
      fi

    fi

  done

  if echo $addr_out | grep "::" >/dev/null 2>&1 && [ "$found" -lt "8" ] ; then

    local insert="0"
    for n in $( seq $found "6" ) ; do
      insert="$insert:0"
    done

    addr_out=$( echo $addr_out | sed -e "s/^::$/$insert/g" )
    addr_out=$( echo $addr_out | sed -e "s/^::/$insert:/g" )
    addr_out=$( echo $addr_out | sed -e "s/::$/:$insert/g" )
    addr_out=$( echo $addr_out | sed -e "s/::/:$insert:/g" )

  elif echo $addr_out | grep "::"  >/dev/null 2>&1 || [ "$found" != "8" ] ; then
    echo "Invalid 2 IPv6 address $addr_prefix found=$found" 1>&2
    return 1
  fi


#  echo "Correct IPv6 address $addr_prefix addr_out=$addr_out found=$found" 1>&2
  local pos=0
  addr_in=$addr_out
  addr_out=""

  while ! [ -z "$addr_in" ] ; do

    addr_in=$( echo $addr_in | sed -e "s/^://g" )

    local addr16="$( echo $addr_in | awk -F':' '{print $1}' )"
    addr_in=$( echo $addr_in | sed -e "s/^$addr16//g" )

    if echo $addr16 | grep '\.' >/dev/null 2>&1  ; then
      local ip1=$( echo $addr16 | awk -F'.' '{print $1}' )
      local ip2=$( echo $addr16 | awk -F'.' '{print $2}' )
      local ip3=$( echo $addr16 | awk -F'.' '{print $3}' )
      local ip4=$( echo $addr16 | awk -F'.' '{print $4}' )

#      echo "addr16=$addr16 ip1=$ip1 ip2=$ip2 ip3=$ip3 ip4=$ip4" 1>&2

      addr16=$( printf "%X" $(( $(( $ip1 * 0x100 )) + $ip2 )) )

      if [ -z "$ip4" ] ; then
        echo "Invalid 3 IPv6 address $addr_prefix" 1>&2
        return 1
      fi

      addr_in=$( printf "%X" $(( $(( $ip3 * 0x100 )) + $ip4 )) )$addr_in


    fi

    local prefix16
    if [ "$pos" -le "$mask" ] ; then

      if [ "$(( $pos + 16 ))" -le "$mask" ] ; then
	prefix16=$addr16
      else
	prefix16=$( printf "%X" $(( 0x$addr16 & 0xFFFF<<$(( $(( $pos + 16 )) - $mask )) )) )
      fi

    else
      prefix16="0"
    fi


    if [ -z "$addr_out" ] ; then
      addr_out="$prefix16"
    else
      addr_out="$addr_out:$prefix16"
    fi

    pos=$(( $pos + 16 ))

  done

  echo "$addr_out"
}

qmp_get_ip6_fast() {

  if ! [ -x /usr/bin/ipv6calc ] ; then
     qmp_get_ip6_slow $1
     return $?
  fi

  local addr_prefix="$1"
  local addr="$(echo $addr_prefix | awk -F'/' '{print $1}')"
  local mask="$(echo $addr_prefix | awk -F'/' '{print $2}')"

  if [ -z "$mask" ] ; then
    echo "qmp_get_ip6_fast: ERROR addr_prefix=$addr_prefix addr_long=$addr_long  addr=$fake_long mask=$mask" 1>&2
    return 1
    mask="128"
  fi

  local addr_long=$( ipv6calc -q  --in ipv6 $addr --showinfo -m 2>&1 | awk -F'=' '/IPV6=/{print $2}' )

  local fake_prefix16="20a2" # original input is manipulated because ipv6calc complains about reserved ipv6 addresses
  local addr_prefix16="$(echo $addr_long | awk -F':' '{print $1}')"
  local fake_long=$( echo $addr_long | sed -e "s/^$addr_prefix16/$fake_prefix16/g" )
  local fake_out

#  echo "qmp_get_ip6_fast: begin addr_prefix=$addr_prefix addr_long=$addr_long  addr=$fake_long mask=$mask" 1>&2

  if [ "$mask" -ge "0" ] &&  [ "$mask" -le "112" ] && [ "$(( $mask % 16))" = "0" ]; then

    fake_out="$( ipv6calc --in ipv6 $fake_long/$mask -F --printprefix --out ipv6addr 2>/dev/null )::/$mask"

  else

    if [ "$(( $mask % 16))" != "0" ]; then
      echo "ERROR addr_prefix=$1 mask=$mask must be multiple of 16" 1>&2
      return 1
    fi

    fake_out="$( ipv6calc --in ipv6 $fake_long/128 -F --printprefix --out ipv6addr 2>/dev/null )"
  fi

  echo $fake_out | sed -e "s/^$fake_prefix16/$addr_prefix16/g"

#  echo "qmp_get_ip6_fast: return addr_prefix=$addr_prefix addr_long=$addr_long  addr=$fake_long mask=$mask" 1>&2
}

qmp_calculate_ula96() {

  local prefix=$1
  local mac=$2
  local suffix=$3

  local prefix48=$( qmp_get_ip6_fast $prefix/128 )
  local suffix48=$( qmp_get_ip6_fast $suffix/128 )

# echo "qmp_calculate_ula96 suffix48=$suffix48" 1>&2

  local mac1="$( echo $mac | awk -F':' '{print $1}' )"
  local mac2="$( echo $mac | awk -F':' '{print $2}' )"
  local mac3="$( echo $mac | awk -F':' '{print $3}' )"
  local mac4="$( echo $mac | awk -F':' '{print $4}' )"
  local mac5="$( echo $mac | awk -F':' '{print $5}' )"
  local mac6="$( echo $mac | awk -F':' '{print $6}' )"

  local p1="$( echo $prefix48 | awk -F':' '{print $1}' )"
  local p2="$( echo $prefix48 | awk -F':' '{print $2}' )"
  local p3="$( echo $prefix48 | awk -F':' '{print $3}' )"

  local s1="$( echo $suffix48 | awk -F':' '{print $7}' )"
  local s2="$( echo $suffix48 | awk -F':' '{print $8}' )"

  printf "%X:%X:%X:%X:%X:%X:%X:%X\n" 0x$p1 0x$p2 0x$p3  $(( ( 0x$mac1 * 0x100 ) + 0x$mac2 ))  $(( ( 0x$mac3 * 0x100 ) + 0x$mac4 ))  $(( ( 0x$mac5 * 0x100 ) + 0x$mac6 ))  0x$s1 0x$s2

}

qmp_calculate_addr64() {

  local prefix=$1
  local node=$2
  local suffix=$3

  local prefix48=$( qmp_get_ip6_fast $prefix/128 )
  local suffix48=$( qmp_get_ip6_fast $suffix/128 )

  local p1="$( echo $prefix48 | awk -F':' '{print $1}' )"
  local p2="$( echo $prefix48 | awk -F':' '{print $2}' )"
  local p3="$( echo $prefix48 | awk -F':' '{print $3}' )"

  local s5="$( echo $suffix48 | awk -F':' '{print $5}' )"
  local s6="$( echo $suffix48 | awk -F':' '{print $6}' )"
  local s7="$( echo $suffix48 | awk -F':' '{print $7}' )"
  local s8="$( echo $suffix48 | awk -F':' '{print $8}' )"

  printf "%X:%X:%X:%X:%X:%X:%X:%X\n" 0x$p1 0x$p2 0x$p3   0x$node   0x$s5 0x$s6 0x$s7 0x$s8

}

qmp_get_ula96() {

  local prefix=$1
  local dev_mac=$2
  local suffix=$3
  local mask=$4

  local mac=$( qmp_get_mac_for_dev $dev_mac )
  local ula96=$( qmp_calculate_ula96 $prefix $mac $suffix )

  if [ -z "$mask" ] ; then
      echo "$ula96"
  else
      echo "$ula96/$mask"
  fi
}

qmp_get_addr64() {
  local prefix=$1
  local node=$2
  local suffix=$3
  local mask=$4
  local addr64=$( qmp_calculate_addr64 $prefix $node $suffix )
  echo "$addr64/$mask"
}

qmp_configure_prepare() {
  local conf=$1
   if ! [ -f /etc/config/$conf.orig ]; then
    echo "saving original config in: /etc/config/$conf.orig"
    cp /etc/config/$conf /etc/config/$conf.orig
  fi

  uci revert $conf
  echo "" > /etc/config/$conf
}

qmp_configure_network() {

  local conf="network"

  echo "-----------------------"
  echo "Configuring networking"
  echo "-----------------------"

  qmp_configure_prepare_network $conf

  # LoopBack device
  uci set $conf.loopback="interface"
  uci set $conf.loopback.ifname="lo"
  uci set $conf.loopback.proto="static"
  uci set $conf.loopback.ipaddr="127.0.0.1"
  uci set $conf.loopback.netmask="255.0.0.0"

  # WAN devices
  qmp_configure_wan
  # LAN devices
  qmp_configure_lan
  # MESH devices
  qmp_configure_mesh

  uci commit
}


qmp_remove_qmp_bmx6_tunnels()
{
	if echo "$1" | grep -q "^qmp_"
	then
		uci delete bmx6.$1
	fi
	uci commit bmx6
}

qmp_unconfigure_bmx6_gateways()
{
	config_load bmx6
	config_foreach qmp_remove_qmp_bmx6_tunnels tunInNet
	config_foreach qmp_remove_qmp_bmx6_tunnels tunDev
	config_foreach qmp_remove_qmp_bmx6_tunnels tunIn
	config_foreach qmp_remove_qmp_bmx6_tunnels tunOut
}

qmp_translate_configuration()
{
	orig_config=$1
	orig_section=$2
	orig_option=$3

	dest_config=$4
	dest_section=$5
	dest_option=${6:-$orig_option}

	value="$(uci -q get $orig_config.$orig_section.$orig_option)"
	if [ -n "$value" ]
	then
		uci set $dest_config.$dest_section.$dest_option="$value"
	fi
}

qmp_add_qmp_bmx6_tunnels()
{
	local section=$1
	local name="$section"
	local config=bmx6
	local ignore
	local t
	config_get ignore "$section" ignore

	[ "$ignore" = "1" ] && return

	local type="$(qmp_uci_get_raw gateways.$name.type)"
	qmp_log "Configuring gateway $name of type $type"
	[ -z "$name" ] && name="qmp_$gateway" || name="qmp_$name"

	if [ "$type" == "offer" ]
	then
		bmx6_type=tunIn
		uci set $config.$name="$bmx6_type"
		uci set $config.$name.$bmx6_type="$name"
		for t in \
			network \
			bandwidth
		do
			qmp_translate_configuration gateways $section $t $config $name
		done
	else
		bmx6_type=tunOut
		uci set $config.$name="$bmx6_type"
		uci set $config.$name.$bmx6_type="$section"
		for t in \
			network \
			srcNet \
			gwName \
			minPrefixLen \
			maxPrefixLen \
			hysteresis \
			rating \
			minBandwidth \
			tableRule \
			kernel \
			boot \
			static \
			zebra \
			system \
			connect \
			rip \
			ripng \
			ospf \
			ospf6 \
			isis \
			bgp \
			babel \
			olsr \
			exportDistance \
			srcType \
			gwId \
			ipMetric
		do
			qmp_translate_configuration gateways $section $t $config $name
		done
	fi

	gateway="$(($gateway + 1))"
}

qmp_configure_bmx6_gateways()
{
	qmp_unconfigure_bmx6_gateways
	config_load gateways
	gateway=0
	config_foreach qmp_add_qmp_bmx6_tunnels gateway
	uci commit bmx6
}


qmp_configure_bmx6() {
  local conf="bmx6"

  qmp_configure_prepare $conf
  uci set $conf.general="bmx6"
  uci set $conf.bmx6_config_plugin=plugin
  uci set $conf.bmx6_config_plugin.plugin=bmx6_config.so

  uci set $conf.bmx6_json_plugin=plugin
  uci set $conf.bmx6_json_plugin.plugin=bmx6_json.so

  uci set $conf.bmx6_sms_plugin=plugin
  uci set $conf.bmx6_sms_plugin.plugin=bmx6_sms.so

if [ -f /lib/bmx6_topology.so ]; then
  uci set $conf.bmx6_topology_plugin=plugin
  uci set $conf.bmx6_topology_plugin.plugin=bmx6_topology.so
fi

  # chat file must be syncronized using sms
  cfg_sms=$(uci add $conf syncSms)
  uci set $conf.${cfg_sms}.syncSms=chat

  uci set $conf.ipVersion=ipVersion
  uci set $conf.ipVersion.ipVersion="6"

  local primary_mesh_device="$(qmp_get_primary_device)"

  local device_id=$(qmp_get_id)
	device_id="$(echo -n $device_id | tr -cd 'ABCDEFabcdef0123456789' | tail -c 4)"
  if qmp_uci_test qmp.interfaces.mesh_devices &&
  qmp_uci_test qmp.networks.mesh_protocol_vids

    then
    local counter=1

  for dev in $(qmp_get_devices mesh); do
    echo "Configuring interface $dev in BMX6"

    for protocol_vid in $(uci get qmp.networks.mesh_protocol_vids); do
      local protocol_name="$(echo $protocol_vid | awk -F':' '{print $1}')"

      if [ "$protocol_name" = "bmx6" ] ; then
        # Check if the current device is configured as no-vlan
        local use_vlan=1
        for no_vlan_int in $(qmp_uci_get interfaces.no_vlan_devices); do
          [ "$no_vlan_int" == "$dev" ] && use_vlan=0
        done

        # Check if the protocol has VLAN tag configured
        local vid="$(echo $protocol_vid | awk -F':' '{print $2}')"
        [ -z "$vid" -o $vid -lt 1 ] && use_vlan=0

        # Check if the protocol has VLAN tag configured
        local vid="$(echo $protocol_vid | awk -F':' '{print $2}')"
        [ -z "$vid" -o $vid -lt 1 ] && use_vlan=0

        # If vlan tagging
        if [ $use_vlan -eq 1 ]; then
          # For interfaces like eth0.1, replace the dot with an underscore
          local viface="$(echo $dev | sed -r 's/\./_/g')"
          local ifname="${viface}_${vid}"

	# If not vlan tagging
		else
			local ifname="$dev"
		fi

		# If the interface is in the LAN bridge (br-lan) and does not use VLANed mesh, add the bridge instead
		if [ $(qmp_get_virtual_iface $dev) == "lan" ] && [ $use_vlan == "0" ]; then
			ifname="br-lan"
		fi

		uci set $conf.mesh_$counter="dev"
		uci set $conf.mesh_$counter.dev="$ifname"
		if [ -e "/sys/class/net/$dev" ] && [ ! -e "/sys/class/net/$dev/phy80211" ]; then
			uci set $conf.mesh_$counter.linklayer=1
		else
			uci set $conf.mesh_$counter.linklayer=2
		fi

	    if qmp_uci_test qmp.networks.bmx6_ipv4_address ; then
	      local bmx6_ipv4_netmask="$(echo $(uci get qmp.networks.bmx6_ipv4_address) | cut -s -d / -f2)"
	      local bmx6_ipv4_address="$(echo $(uci get qmp.networks.bmx6_ipv4_address) | cut -d / -f1)"
	      [ -z "$bmx6_ipv4_netmask" ] && bmx6_ipv4_netmask="32"
	      uci set $conf.general.tun4Address="$bmx6_ipv4_address/$bmx6_ipv4_netmask"
	      uci set $conf.tmain=tunDev
	      uci set $conf.tmain.tunDev=tmain
	      uci set $conf.tmain.tun4Address="$bmx6_ipv4_address/$bmx6_ipv4_netmask"

	    else
	      local ipv4_suffix24="$(qmp_get_id 8bit)"
	      local ipv4_prefix24="$(qmp_uci_get networks.bmx6_ipv4_prefix24)"
	      if [ $(echo -n "$ipv4_prefix24" | tr -d [0-9] | wc -c) -lt 2 ]; then
	      	ipv4_prefix24="${ipv4_prefix24}.0"
	      fi
	      uci set $conf.general.tun4Address="$ipv4_prefix24.$ipv4_suffix24/32"
	      uci set $conf.tmain=tunDev
	      uci set $conf.tmain.tunDev=tmain
	      uci set $conf.tmain.tun4Address="$ipv4_prefix24.$ipv4_suffix24/32"

	    fi
	    counter=$(( $counter + 1 ))
         fi

       done
    done
  fi


  if qmp_uci_test qmp.networks.bmx6_ripe_prefix48 ; then
    uci set $conf.general.tun6Address="$(uci get qmp.networks.bmx6_ripe_prefix48):$device_id:0:0:0:1/64"
    uci set $conf.tmain=tunDev
    uci set $conf.tmain.tunDev=tmain
    uci set $conf.tmain.tun6Address="$(qmp_uci_get networks.bmx6_ripe_prefix48):$device_id:0:0:0:1/64"
  fi

  qmp_configure_bmx6_gateways

  uci commit $conf
#  /etc/init.d/$conf restart
}

qmp_restart_firewall() {
	iptables -F
	iptables -F -t nat
	sh /etc/firewall.user
}

qmp_check_force_internet() {
	[ "$(qmp_uci_get networks.force_internet)" == "1" ] && qmp_gw_offer_default
	[ "$(qmp_uci_get networks.force_internet)" == "0" ] && qmp_gw_search_default
}

# Actively wait for br-lan to appear
qmp_wait_for_interface_to_appear() {
	maxwait=30
	while [ ! -e "/sys/class/net/${1}" ] && [ $maxwait -ge 0 ] ; do
		echo "Waiting for ${1} to appear"
		sleep 1
		echo $maxwait
		let "--maxwait"
	done
}

qmp_configure_initial() {
	qmp_hooks_exec firstboot
	qmp_configure_wifi_initial
	qmp_configure_wifi
	/etc/init.d/network reload
	/etc/init.d/network restart
	# Let WiFi devices start up
	sleep 5
	qmp_configure_smart_network default
}

qmp_configure() {
  qmp_configure_system
  qmp_set_services
  qmp_hooks_exec preconf
  qmp_check_force_internet
  qmp_configure_network
  qmp_configure_bmx6
  qmp_configure_lan_v6
  qmp_hooks_exec postconf
}
