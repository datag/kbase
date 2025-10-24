---
title: BTRFS
---

## Balance

```shell
btrfs fi usage /media/dominik/DATA
btrfs balance start -dusage=70 -musage=70 /media/dominik/DATA
btrfs balance status /media/dominik/DATA
```

## Snapshot send/receive

```shell
# Create read-only snapshot
sudo btrfs subvolume snapshot -r /mnt/source-drive/@ /mnt/source-drive/snapshots/@_2025-04-20

# Mount backup drive (here: with compression enabled)
sudo mount -o noatime,compress=zstd LABEL=Misc-Backup /mnt/misc-backup

sudo mkdir -p /mnt/misc-backup/snapshots/@

# Initial
sudo btrfs send /mnt/source-drive/snapshots/@_2025-04-20 | sudo btrfs receive /mnt/misc-backup/snapshots/@

# Incremental
sudo btrfs send -p /mnt/source-drive/snapshots/@_2025-04-20 /mnt/source-drive/snapshots/@_2025-04-21 | sudo btrfs receive /mnt/misc-backup/snapshots/@
```

## Ubuntu 23.04+ encrypted BTRFS setup

[Torsten Bronger](https://gitlab.com/bronger) created the procedure/script [btrfs-encrypt-root](https://gitlab.com/bronger/btrfs-encrypt-root) that brings back the option of having the accustomed BTRFS filesystem layout using `@` and `@home` combined with filesystem encryption.

I verified the script and used it successfully (*if it didn't exist, I might have written it myself*).

```shell
wget https://gitlab.com/bronger/btrfs-encrypt-root/-/raw/master/btrfs-encrypt-root.sh

# Usage: btrfs-encrypt-root [--enlarge | --only-subvols] {root-dev} {boot-dev} [{efi-dev}]
sudo sh btrfs-encrypt-root.sh --enlarge sda3 sda2 sda1
```

