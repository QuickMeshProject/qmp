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

PKG_NAME:=qmp-system
PKG_VERSION:=$(QMP_RELEASE)-$(QMP_PKGRELEASE)
PKG_RELEASE:=$(QMP_CODENAME)-$(QMP_GIT_REV)
PKG_LICENSE:=GPL-3.0+

PKG_BUILD_DIR:=$(BUILD_DIR)/$(PKG_NAME)

include $(INCLUDE_DIR)/package.mk

define Package/qmp-system
  TITLE:=Quick Mesh Project (qMp) system files
  SECTION:=net
  CATEGORY:=qMp
  URL:=https://qmp.cat
  DEPENDS:=+libuci-lua +lua +libiwinfo-lua +wpad-mini +kmod-ipt-nat +luci-base\
   +bmx6 +bmx6-uci-config +bmx6-json +gwck-qmp +ip +iw +iwinfo +bmx6-sms
endef

define Package/qmp-system/description
 This package contains the basic system files and scripts required for
 configuring and running a qMp node.

 To have a fully working qMp node, it is strongly recommended to install one of
 the following packages:
  - qmp-tiny-node: minimalistic node (4 MB flash devices)
  - qmp-small-node: standard node (8 MB flash devices)
  - qmp-big-node: full-featured node (8+ MB flash devices)
endef

define Build/Prepare
	mkdir -p $(PKG_BUILD_DIR)
endef

define Build/Configure
endef

define Build/Compile
endef

define Package/qmp-system/install
	$(CP) ./files/* $(1)/
	$(SED) 's,$$$$BRANCH,$(QMP_GIT_BRANCH),g' $(1)/etc/uci-defaults/qmp_banner
	$(SED) 's,$$$$REV,$(QMP_GIT_REV),g' $(1)/etc/uci-defaults/qmp_banner
	$(SED) 's,$$$$COD,$(QMP_CODENAME),g' $(1)/etc/uci-defaults/qmp_banner
	$(SED) 's,$$$$REL,$(QMP_RELEASE),g' $(1)/etc/uci-defaults/qmp_banner
	$(SED) 's,$$$$DATE,$(QMP_BUILDDATE),g' $(1)/etc/uci-defaults/qmp_banner
	chmod 755 $(1)/etc/init.d/qmp_autoconf
	date +%Y%m%d > $(1)/etc/qmp/qmp.version
	echo "QMP_ID=qMp" > $(1)/etc/qmp/qmp.release
	echo "QMP_CODENAME=$(QMP_CODENAME)" >> $(1)/etc/qmp/qmp.release
	echo "QMP_RELEASE=$(QMP_RELEASE)" >> $(1)/etc/qmp/qmp.release
	echo "QMP_BRANCH=$(QMP_GIT_BRANCH)" >> $(1)/etc/qmp/qmp.release
	echo "QMP_REVISION=$(QMP_GIT_REV)" >> $(1)/etc/qmp/qmp.release
	echo "QMP_BUILDDATE=$(QMP_BUILDDATE)" >> $(1)/etc/qmp/qmp.release
	echo "QMP_DESCRIPTION=\"qMp $(QMP_CODENAME) $(QMP_RELEASE), branch $(QMP_GIT_BRANCH) rev.$(QMP_GIT_REV)-$(QMP_BUILDDATE)\"" >> $(1)/etc/qmp/qmp.release
endef

$(eval $(call BuildPackage,qmp-system))
