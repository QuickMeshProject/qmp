FROM debian:latest

RUN apt-get update && apt-get install subversion build-essential libncurses5-dev zlib1g-dev gawk git ccache gettext libssl-dev xsltproc wget unzip python -y

WORKDIR /app

ENTRYPOINT ["/app/cooker"]
CMD ["--help"]
