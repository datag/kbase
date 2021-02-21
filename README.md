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

Reinstall grub2 using another system:

```bash
mkdir /mnt/rootfs
mount /dev/sdX1 /mnt/rootfs
mount /dev/sdX2 /mnt/rootfs/boot/efi
mount -t proc proc proc /mnt/rootfs/proc
mount --rbind /sys /mnt/rootfs/sys   # use rbind so /sys/firmware/efi/efivars is populated
mount --rbind /dev /mnt/rootfs/dev
chroot /mnt/rootfs /bin/bash

(chroot) export PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin   # depending on system
(chroot) grub-install /dev/sdX
(chroot) update-grub2
```

## Secure boot thumb drive without valid signature

  1. rename original bootx64.efi to loader.efi
  2. rename PreLoader.efi to bootx64.efi
  3. and it put HashTool.efi in /efi/boot directory
  4. (if "Failed to start loader"): "Enroll Hash" for "loader.efi"

[(download)](https://blog.hansenpartnership.com/linux-foundation-secure-boot-system-released/)
[(source)](https://gitlab.com/systemrescue/systemrescue-sources/-/issues/50)



## Graphics

### Remove EXIF meta data

```bash
# remove all meta data
exiftool -all= my-image.jpg

# remove meta data and replace image
exiftool -overwrite_original -all= my-image.jpg
```


