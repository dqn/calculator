FROM ubuntu:20.04

RUN apt-get update && apt-get upgrade -y && apt-get install -y --no-install-recommends \
  curl \
  gcc \
  make \
  binutils \
  libc6-dev \
  npm \
  nodejs
