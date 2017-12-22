#!/bin/bash
. options.conf
. options.conf.local

dirname="$release/ar71xx/mikrotik/ib"
filename="$dirname/.profiles.mk"

echo "File $filename will be patched"

[ ! -d $dirname ] && {
  echo "$dirname does not exist. Before applying this snippet you must have the imagebuilder ready."
  exit 1
}

[ ! -f $filename ] && {
  echo "$filename does not exist. Before applying this snippet you must have the profiles' packages listed."
  exit 1
}

sed -i -e 's/kmod-ath10k/kmod-ath10k-ct/g' $filename
sed -i -e 's/ath10k-firmware-qca988x/ath10k-firmware-qca988x-ct/g' $filename
sed -i -e 's/ath10k-firmware-qca9887/ath10k-firmware-qca9887-ct/g' $filename

#Ensure no double "-ct"s are appended
sed -i -e 's/kmod-ath10k-ct-ct/kmod-ath10k-ct/g' $filename
sed -i -e 's/ath10k-firmware-qca988x-ct-ct/ath10k-firmware-qca988x-ct/g' $filename
sed -i -e 's/ath10k-firmware-qca9887-ct-ct/ath10k-firmware-qca9887-ct/g' $filename

#( cd $base_feed && git apply $patch_file && {
#  echo "Patch applied, now you can use the special country US when you deploy a mesh network on International Waters"
#} || echo "Patch does not apply, maybe it is already applied or LEDE source has changed" )
