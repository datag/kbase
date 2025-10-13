---
title: Media
---

## Graphics

### Remove EXIF meta data

```shell
# remove all meta data
exiftool -all= my-image.jpg

# remove meta data and replace image
exiftool -overwrite_original -all= my-image.jpg

# try to remove only GPS related metadata
exiftool -overwrite_original -gps:all= -xmp:geotag= *
```


## Audio

### Rip YouTube video/playlist to MP3

```
youtube-dl -x --audio-quality 0  --audio-format mp3 https://www.youtube.com/watch?v={YT_CODE}
```

## VHS video capture (w/o deinterlacing)

```shell
ffmpeg -f alsa -thread_queue_size 4096 -ar 48000 -ac 2 -i hw:1 -f v4l2 -thread_queue_size 4096 -input_format yuyv422 -framerate 25 -i /dev/video0 -vf format=yuv420p -c:v libx264 -preset slow -crf 21 -vprofile baseline -c:a aac -y video.mp4
```

## PDF

### Reduce file size of scanned document

```shell
ps2pdf -dPDFSETTINGS=/ebook input.pdf output.pdf
```

### Remove password

```shell
qpdf -password=THE-PASSWORD -decrypt input.pdf output.pdf

# or

pdftk secured.pdf input_pw foopass output unsecured.pdf
```

### OCR PDF

``` shell
sudo apt install ocrmypdf tesseract-ocr-deu

ocrmypdf input.pdf output.pdf
```

### Join PDFs

```shell
pdftk in1.pdf in2.pdf cat output out1.pdf
```

