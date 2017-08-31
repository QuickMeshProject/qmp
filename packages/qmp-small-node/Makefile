#    Copyright (C) 2011 Fundacio Privada per a la Xarxa Oberta, Lliure i Neutral guifi.net
#
#    This program is free software; you can redistribute it and/or modify
#    it under the terms of the GNU General Public License as published by
#    the Free Software Foundation; either version 2 of the License, or
#    (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU General Public License for more details.
#
#    You should have received a copy of the GNU General Public License along
#    with this program; if not, write to the Free Software Foundation, Inc.,
#    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
#
#    The full GNU General Public License is included in this distribution in
#    the file called "COPYING".
#
# Contributors:
#	Pau Escrich <p4u@dabax.net>
#	Simó Albert i Beltran
#

include $(TOPDIR)/rules.mk
include $(INCLUDE_DIR)/kernel.mk

QMP_RELEASE?=trunk
QMP_PKGRELEASE=r20170831-2
QMP_CODENAME?=Kalimotxo
QMP_BUILDDATE:=$(shell date +%Y%m%d-%H%M)

PKG_NAME:=qmp-small-node
PKG_VERSION:=$(QMP_RELEASE)-$(QMP_PKGRELEASE)
PKG_RELEASE:=$(QMP_CODENAME)
PKG_LICENSE:=GPL-2.0+

PKG_BUILD_DIR:=$(BUILD_DIR)/$(PKG_NAME)

include $(INCLUDE_DIR)/package.mk

define Package/qmp-small-node
  TITLE:=Quick Mesh Project (qMp) standard node (8 MB flash)
  SECTION:=net
  CATEGORY:=qMp
  URL:=https://qmp.cat
  DEPENDS:= +qmp-tiny-node \
	+iputils-arping +iputils-clockdiff +tcpdump-mini +b6m +b6m-spread \
	+iputils-ping6 +mtr +netperf +luci-mod-admin-full \
	+munin-mesh +mini_snmpd +cgi-bin-zero +ipip +kmod-ipip +kmod-gre \
	+libremap-agent +luci-lib-libremap-contact +luci-lib-libremap-wireless \
	+luci +luci-lib-libremap-system +luci-lib-libremap-location \
	+luci-lib-libremap-bmx6 +luci-lib-libremap-qmp +bmx6-mdns
endef

define Package/qmp-small-node/description
 This metapackage provides a standard qMp node with the following features:
  - qMp system configuration files and scripts
  - BMX6 routing protocol
  - Full LuCI web interface
  - IP/TCP utils
  - LibreMap and b6m tools
  - SNMP and Munin
  - IP over IP tunneling support

 It is intended to be used on devices with 8 MB of flash or more.
endef


define Build/Configure
endef

define Build/Compile
endef

define Build/Prepare
	mkdir -p $(PKG_BUILD_DIR)
endef

define Package/qmp-small-node/install
	$(INSTALL_DIR) $(1)/etc/qmp
endef

$(eval $(call BuildPackage,qmp-small-node))
