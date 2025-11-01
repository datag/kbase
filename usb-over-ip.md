---
title: USB over IP
---

Share USB devices over network.

* https://usbip.sourceforge.net/
* https://wiki.archlinux.org/title/USB/IP
* German HOWTO: https://www.florian-diesch.de/doc/linux/usb-over-ip-mit-usbipd.html

## Server

```shell
apt install usbip

modprobe usbip_host      # Load kernel module
echo usbip_host >>/etc/modules

usbip list -l            # List exportable devices
usbipd -D                # Start usbip in daemon mode
usbip bind -b 2-1.2      # Export device 2-1.2
usbip list -r localhost  # List currently exported devices
```

## Client

```shell
apt install usbip

modprobe vhci-hcd                       # Load kernel module
echo vhci-hcd >>/etc/modules

usbip list -r 192.168.0.9               # List remotely exported devices
usbip attach -r 192.168.0.9 -b 2-1.2    # Attach remotely exported device 2-1.2
usbip port                              # List currently attached devices
```

