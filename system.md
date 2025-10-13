---
title: System
---

## GPT

[(source)](https://www.dedoimedo.com/computers/gpt-disk-backup-partition-table.html)

### Backup

```shell
sgdisk --backup=<file> <device>
```

### Restore

```shell
sgdisk --load-backup=<backup file> <target device>
```

## Images

### Create empty sparse file

```shell
truncate -s 128G test.img
```

[(source)](https://www.systutorials.com/handling-sparse-files-on-linux/)

## Dig holes (make sparse again)

```shell
fallocate -v -d test.img
```

[(source)](https://www.systutorials.com/handling-sparse-files-on-linux/#comment-170695)


## fsarchiver backup

```shell
fsarchiver savefs test.fsa /dev/mmcblk0p1 -v -j8 -Z15
```

## fsarchiver "extract"

```shell
truncate -s 10G test.img
losetup /dev/loop1 test.img    # OR find and use free loop device: losetup -f --show test.img
fsarchiver restfs test.fsa id=0,dest=/dev/loop1
```


## Grub2

Reinstall on system [[source](https://superuser.com/questions/376470/how-to-reinstall-grub2-efi#comment1546454_721045)]:

```shell
sudo grub-install --target=x86_64-efi --efi-directory=/boot/efi
```

Reinstall grub2 using another system:

```shell
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

### Maintenance-free custom Grub2 screen

https://help.ubuntu.com/community/MaintenanceFreeCustomGrub2Screen

### Fix issue with multi-boot

https://help.ubuntu.com/community/MaintenanceFreeCustomGrub2Screen#If_you_multiboot_mutiple_Linux_installs_and_want_one_Grub_to_control_all_of_your_OSs

On secondary system do:

```shell
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

## Customize system-rescue ISO

Download ISO and script [sysrescue-customize](https://www.system-rescue.org/scripts/sysrescue-customize/).

```shell
sudo apt install xorriso squashfs-tools

sysrescue-customize --unpack --source=systemrescue-12.02-amd64.iso --dest=systemrescue-12.02-iso
# do modifications
sysrescue-customize --rebuild --source=systemrescue-12.02-iso --dest=systemrescue-12.02-amd64-DE-zsh.iso
```

Modifying defaults ([Booting SystemRescue](https://www.system-rescue.org/manual/Booting_SystemRescue/)):

Edit `filesystem/sysrescue.d/100-defaults.yaml` and these:

```yaml
global:
    # ...
    setkmap: "de-latin1-nodeadkeys"
    rootshell: "/bin/zsh"
```

## ODROID MBR & bootloader backup

[(source)](https://forum.odroid.com/viewtopic.php?t=22930)


```shell
sfdisk -l /dev/mmcblk0
# find start of first partition, e.g. 49152
dd if=/dev/mmcblk0 of=mbr-bootloader.bin bs=512 count=49151   # start minus 1 sector
```

Restore bootloader only:

```shell
dd if=mbr-bootloader.bin of=/dev/mmcblk0 bs=512 skip=1 seek=1
```

Restore bootstrap code:

```shell
dd if=mbr-bootloader.bin of=/dev/mmcblk0 bs=446 count=1
```

