#    Copyright (C) 2014-2018 Routek S.L. - https://www.routek.net
#
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU General Public License as published by
#    the Free Software Foundation, either version 3 of the License, or
#    (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU General Public License for more details.
#
#    You should have received a copy of the GNU General Public License
#    along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
#    The full GNU General Public License is included in this package in
#    the file called "COPYING".
#
#    Contributors:
#        Agustí Moll Garcia <agusti@routek.net>
#        Roger Pueyo Centelles <rogerpueyo@routek.net>
#

include $(TOPDIR)/rules.mk

QMP_FEED_DIR?=$(CURDIR)

QMP_GIT_BRANCH?=$(shell git -C $(QMP_FEED_DIR) rev-parse --abbrev-ref HEAD)
QMP_GIT_REV?=$(shell git -C $(QMP_FEED_DIR) rev-parse --short HEAD)
QMP_GIT_DATE?=$(shell git -C $(QMP_FEED_DIR) log -1 --format=%cd --date=format:%Y%m%d)
QMP_GIT_TIME?=$(shell git -C $(QMP_FEED_DIR) log -1 --format=%cd --date=format:%H%M)

QMP_RELEASE?=4.2
QMP_PKGRELEASE=r$(QMP_GIT_DATE)_$(QMP_GIT_TIME)
QMP_CODENAME?=Macondo
QMP_BUILDDATE:=$(shell date +%Y%m%d-%H%M)

PKG_NAME:=qmp-ncd
PKG_VERSION:=$(QMP_RELEASE)-$(QMP_PKGRELEASE)
PKG_RELEASE:=$(QMP_CODENAME)-$(QMP_GIT_REV)
PKG_LICENSE:=GPL-3.0+

PKG_BUILD_DIR:=$(BUILD_DIR)/$(PKG_NAME)-$(PKG_VERSION)


include $(INCLUDE_DIR)/package.mk


define Package/qmp-ncd
    TITLE:=Network Characterization daemon
		SECTION:=net
    CATEGORY:=qMp
    URL:=http://dev.qmp.cat/projects/nc
    DEPENDS:=+lua +liblua +libubox-lua +libubus-lua +ubus +iperf3 +wget
endef

define Package/qmp-ncd/description
    Network Characterization is a tool to monitor nodes in a Community Network, display collected data in a user-friendly manner and perform administrative tasks.
    This package provides the daemon, built in Lua, that communicates via Ubus with other processes of the local node and via JSON over HTTP with other nodes in the network.
endef

define Build/Prepare
        mkdir -p $(PKG_BUILD_DIR)
endef

define Build/Configure
endef

define Build/Compile
endef

define Package/qmp-ncd/install
        $(CP) ./files/* $(1)/
endef

$(eval $(call BuildPackage,qmp-ncd))
