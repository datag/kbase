---
title: Utils
---

## rsync

```shell
rsync -ahSAXH --numeric-ids --delete --info=progress2 [ssh-host:]src/ dst

# -a archive
# -h human
# -S sparse
# -A ACLs
# -X xattrs
# -H hard links

# --numeric-ids     Use numeric IDs for user/group instead of mapping by name
# --delete          Delete files in *dst* that aren't in *src (CAUTION!)
# --info=progress2  Modern progress bar
```

