#!/bin/bash
. options.conf
. options.conf.local

OUTDIR="${1:-output}"
[ ! -d $OUTDIR ] && mkdir -p $OUTDIR
[ ! -d $OUTDIR/packages ] && mkdir -p $OUTDIR/packages
[ ! -d $OUTDIR/targers ] && mkdir -p $OUTDIR/targets

echo "-> Output directory: $OUTDIR"

for link in $OUTDIR/packages/*; do
  unlink $link 2>/dev/null
done
for link in $OUTDIR/targets/*; do
  unlink $link 2>/dev/null
done

for target in $(cat $targets_list); do
  for arch in $release/$target/sdk/bin/packages/*; do
    [ -d "$arch" ] && {
      echo "-> Creating symlink for $arch packages"
      ln -s $PWD/$arch $OUTDIR/packages/ 2>/dev/null
    }
  done
  for arch in $release/$target/sdk/bin/targets/*; do
    [ -d "$arch" ] && {
      echo "-> Creating symlink for $arch targets"
      ln -s $PWD/$arch $OUTDIR/targets/ 2>/dev/null
    }
  done
done
