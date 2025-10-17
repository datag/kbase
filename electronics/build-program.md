---
title: Build/Program
---

AVR-Toolchain Linux von Atmel
-----------------------------

http://www.atmel.com/tools/atmelavrtoolchainforlinux.aspx

```shell
mkdir ~/local
tar xvf avr8-gnu-toolchain-3.5.4.1709-linux.any.x86_64.tar.gz -C ~/local
export PATH=$HOME/local/avr8-gnu-toolchain-linux_x86_64/bin:$PATH
avr-gcc --version
```

avr-libc Demo project
---------------------

http://www.nongnu.org/avr-libc/user-manual/group__demo__project.html


Programming w/ avrdude
----------------------

Mit USB-ISP-Dongle (Diamex-AVR); Beispielaufruf für ATMEGA16 Flash auslesen in Image:

```shell
avrdude -v -p m16 -P /dev/ttyACM0 -c stk500v2 -U flash:r:flash.bin:r
avrdude -v -p m16 -P /dev/ttyACM0 -c stk500v2 -U flash:r:flash.hex:i
```

und schreiben:

```shell
avrdude -v -p m16 -P /dev/ttyACM0 -c stk500v2 -U flash:w:main.hex
```

Makefile-Template
-----------------

[Mfile - A Makefile generator for AVR-GCC](http://www.sax.de/~joerg/mfile/)

1. Extract
2. Use `makefile_template` directly or `export MFILE_HOME=$(pwd) && wish mfile.tcl`

Alternativ WinAVR Makefile: http://www.mikrocontroller.net/articles/AVR-GCC-Tutorial/Exkurs_Makefiles
