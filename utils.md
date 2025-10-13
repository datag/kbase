---
title: Utils
---

## rsync

```shell
rsync -ahSAXH --delete --info=progress2 [ssh-host:]src/ dst

# -a archive
# -h human
# -S sparse
# -A ACLs
# -X xattrs
# -H hard links
```

