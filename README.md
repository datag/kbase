# kbase

## GPT

### Backup

```bash
sgdisk --backup=<file> <device>
```

### Restore

```bash
sgdisk --load-backup=<backup file> <target device>
```

https://www.dedoimedo.com/computers/gpt-disk-backup-partition-table.html

## Images

### Create empty sparse file

```bash
truncate -s 128G test.img
```

https://www.systutorials.com/handling-sparse-files-on-linux/

## Dig holes (make sparse again)

```bash
fallocate -v -d test.img
```

https://www.systutorials.com/handling-sparse-files-on-linux/#comment-170695


## fsarchiver backup

```bash
fsarchiver savefs test.fsa /dev/mmcblk0p1 -v -j8 -Z15
```

## fsarchiver "extract"

```bash
truncate -s 10G test.img
losetup /dev/loop1 test.img
fsarchiver restfs test.fsa id=0,dest=/dev/loop1
```

