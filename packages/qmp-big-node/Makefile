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

QMP_FEED_DIR?=$(CURDIR)

QMP_GIT_BRANCH?=$(shell git -C $(QMP_FEED_DIR) rev-parse --abbrev-ref HEAD)
QMP_GIT_REV?=$(shell git -C $(QMP_FEED_DIR) rev-parse --short HEAD)
QMP_GIT_DATE?=$(shell git -C $(QMP_FEED_DIR) log -1 --format=%cd --date=format:%Y%m%d)
QMP_GIT_TIME?=$(shell git -C $(QMP_FEED_DIR) log -1 --format=%cd --date=format:%H%M)

QMP_RELEASE?=4.2
QMP_PKGRELEASE=r$(QMP_GIT_DATE)_$(QMP_GIT_TIME)
QMP_CODENAME?=Macondo
QMP_BUILDDATE:=$(shell date +%Y%m%d-%H%M)

PKG_NAME:=qmp-big-node
PKG_VERSION:=$(QMP_RELEASE)-$(QMP_PKGRELEASE)
PKG_RELEASE:=$(QMP_CODENAME)-$(QMP_GIT_REV)
PKG_LICENSE:=GPL-3.0+

PKG_BUILD_DIR:=$(BUILD_DIR)/$(PKG_NAME)

include $(INCLUDE_DIR)/package.mk

define Package/qmp-big-node
  TITLE:=Quick Mesh Project (qMp) full-featured node (8+ MB flash)
  SECTION:=net
  CATEGORY:=qMp
  URL:=https://qmp.cat
  DEPENDS:= +qmp-small-node \
	+qmp-tinyproxy +tinymce \
	+openssl-util +luci-ssl \
	+lsof +wget +bmon +bwm-ng +ebtables +pv
endef

define Package/qmp-big-node/description
 This metapackage provides a full-blown qMp node with all the features and extra
 addons:
  - qMp system configuration files and scripts
  - BMX6 routing protocol
  - Full LuCI web interface (via HTTPS with SSL)
  - IP/TCP utils
  - LibreMap and b6m tools
  - SNMP and Munin
  - IP over IP tunneling support
  - Tinyproxy with captive portal

 It is intended to be used on devices with more than 8 MB of flash.
endef

define Build/Prepare
	mkdir -p $(PKG_BUILD_DIR)
endef

define Build/Configure
endef

define Build/Compile
endef

define Package/qmp-big-node/install
	$(INSTALL_DIR) $(1)/etc/qmp
endef

$(eval $(call BuildPackage,qmp-big-node))
