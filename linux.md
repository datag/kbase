---
title: Linux
---

# chroot into System

Simple `chroot` script/steps to "jump" into system for maintenance.

```shell
#!/usr/bin/env bash

set -e

DEVICE=/dev/sda5   # root filesystem
MNT=/mnt/tmp

mkdir $MNT
mount $DEVICE $MNT
mount -t proc proc $MNT/proc
mount -t sysfs sys $MNT/sys
mount --rbind /dev $MNT/dev

chroot $MNT /bin/bash

umount -l $MNT/dev
umount $MNT/sys
umount $MNT/proc
umount $MNT
```

## Kernel boot parameters

### Machine MSI PE60 6QE Notebook

| Param                                          | Value         |                                                                                                   |
| ---------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------- |
| `snd_hda_intel.power_save`                     | `0`           | Prevent crackling                                                                                 |
| `snd_hda_intel.power_save_controller`          | `N`           | Prevent crackling                                                                                 |
| `pci`                                          | `noaer`       | Disable PCIe Advanced Error Reporting                                                             |
| `intel_iommu`                                  | `on,igfx_off` | Fix HDMI audio by disabling internal GPU [1](https://wiki.archlinux.org/title/PCI_passthrough_via_OVMF) |
| <strike>`intel_idle.max_cstate`</strike>       | 7             |                                                                                                   |
| <strike>`nouveau.modeset`</strike>             | 0             |                                                                                                   |
| <strike>`i915.preliminary_hw_support`</strike> | 1             |                                                                                                   |

