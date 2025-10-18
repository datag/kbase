---
title: QEMU
---

* https://wiki.debian.org/QEMU
* https://en.wikibooks.org/wiki/QEMU/Images

```shell
qemu-img create -f qcow2 debian.qcow 2G
qemu-system-x86_64 -hda debian.qcow -cdrom debian-testing-amd64-netinst.iso -boot d -m 512 --enable-kvm
```

