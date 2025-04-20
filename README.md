# kbase

## GPT

[(source)](https://www.dedoimedo.com/computers/gpt-disk-backup-partition-table.html)

### Backup

```bash
sgdisk --backup=<file> <device>
```

### Restore

```bash
sgdisk --load-backup=<backup file> <target device>
```

## Images

### Create empty sparse file

```bash
truncate -s 128G test.img
```

[(source)](https://www.systutorials.com/handling-sparse-files-on-linux/)

## Dig holes (make sparse again)

```bash
fallocate -v -d test.img
```

[(source)](https://www.systutorials.com/handling-sparse-files-on-linux/#comment-170695)


## fsarchiver backup

```bash
fsarchiver savefs test.fsa /dev/mmcblk0p1 -v -j8 -Z15
```

## fsarchiver "extract"

```bash
truncate -s 10G test.img
losetup /dev/loop1 test.img    # OR find and use free loop device: losetup -f --show test.img
fsarchiver restfs test.fsa id=0,dest=/dev/loop1
```


## Grub2

Reinstall on system

https://superuser.com/questions/376470/how-to-reinstall-grub2-efi#comment1546454_721045

  sudo grub-install --target=x86_64-efi --efi-directory=/boot/efi

Reinstall grub2 using another system:

```bash
mkdir /mnt/rootfs
mount /dev/sdX1 /mnt/rootfs
mount /dev/sdX2 /mnt/rootfs/boot/efi
mount -t proc proc /mnt/rootfs/proc
mount --rbind /sys /mnt/rootfs/sys   # use rbind so /sys/firmware/efi/efivars is populated
mount --rbind /dev /mnt/rootfs/dev
chroot /mnt/rootfs /bin/bash

(chroot) export PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin   # depending on system
(chroot) grub-install /dev/sdX
(chroot) update-grub2
```

### Maintenance free custom Gub2 screen

https://help.ubuntu.com/community/MaintenanceFreeCustomGrub2Screen

### Fix issue with multi-boot

https://help.ubuntu.com/community/MaintenanceFreeCustomGrub2Screen#If_you_multiboot_mutiple_Linux_installs_and_want_one_Grub_to_control_all_of_your_OSs

On secondary system do:
```
sudo dpkg-reconfigure grub-efi-amd64     # if not installed, install first
# unselect installing into device
```

## Secure boot thumb drive without valid signature

  1. rename original bootx64.efi to loader.efi
  2. rename PreLoader.efi to bootx64.efi
  3. and it put HashTool.efi in /efi/boot directory
  4. (if "Failed to start loader"): "Enroll Hash" for "loader.efi"

[(download)](https://blog.hansenpartnership.com/linux-foundation-secure-boot-system-released/)
[(source)](https://gitlab.com/systemrescue/systemrescue-sources/-/issues/50)


## ODROID MBR & bootloader backup

[(source)](https://forum.odroid.com/viewtopic.php?t=22930)


```bash
sfdisk -l /dev/mmcblk0
# find start of first partition, e.g. 49152
dd if=/dev/mmcblk0 of=mbr-bootloader.bin bs=512 count=49151   # start minus 1 sector
```

Restore bootloader only:

```bash
dd if=mbr-bootloader.bin of=/dev/mmcblk0 bs=512 skip=1 seek=1
```

Restore bootstrap code:

```bash
dd if=mbr-bootloader.bin of=/dev/mmcblk0 bs=446 count=1
```


## BTRFS


### Balance

```bash
btrfs fi usage /media/dominik/DATA
btrfs balance start -dusage=70 -musage=70 /media/dominik/DATA
btrfs balance status /media/dominik/DATA
```

### Snapshot send/receive

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

## rsync

```bash
rsync -ahSAXH --delete --info=progress2 [ssh-host:]src/ dst

# -a archive
# -h human
# -S sparse
# -A ACLs
# -X xattrs
# -H hard links
```

## Graphics

### Remove EXIF meta data

```bash
# remove all meta data
exiftool -all= my-image.jpg

# remove meta data and replace image
exiftool -overwrite_original -all= my-image.jpg
```


## Audio

### Rip YouTube video/playlist to MP3

```
youtube-dl -x --audio-quality 0  --audio-format mp3 https://www.youtube.com/watch?v={YT_CODE}
```

## VHS video capture (w/o deinterlacing)

```shell
ffmpeg -f alsa -thread_queue_size 4096 -ar 48000 -ac 2 -i hw:1 -f v4l2 -thread_queue_size 4096 -input_format yuyv422 -framerate 25 -i /dev/video0 -vf format=yuv420p -c:v libx264 -preset slow -crf 21 -vprofile baseline -c:a aac -y video.mp4
```
