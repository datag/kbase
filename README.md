# kbase

## rsync

### full clone

```bash
rsync -aHAXS --info=progress2 /the/source/ /the/destination    # Note the trailing slash for source!
```

```
--archive, -a            archive mode; equals -rlptgoD (no -H,-A,-X)
--hard-links, -H         preserve hard links
--acls, -A               preserve ACLs (implies --perms)
--xattrs, -X             preserve extended attributes
--sparse, -S             turn sequences of nulls into sparse blocks
```

[(source)](https://wiki.archlinux.org/index.php/rsync#File_system_cloning)

### quick deletion

```bash
mkdir empty
rsync -a --delete ./empty/ /path/to/directory/to/recursively/delete    # Note the trailing slash for source!
```

[(source)](https://serverfault.com/questions/183821/rm-on-a-directory-with-millions-of-files/513083#513083)


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
mount -o ro /dev/loop1 /mnt/test     # OR mount -o loop,ro test.img /mnt/test
losetup -d /dev/loop1
```


## ODROID

### Backup of MBR and bootloader

Bootloader resides in unallocated area behind the MBR.

```bash
sfdisk -l /dev/mmcblk0    # Note begin of 1st partition; assume 12345
dd if=/dev/mmcblk0 of=mbr-and-bootloader.bin bs=512 count=12345
```

[(source)](https://forum.odroid.com/viewtopic.php?t=22930)

