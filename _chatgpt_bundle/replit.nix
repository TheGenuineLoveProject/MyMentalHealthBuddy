{ pkgs }:

{
  deps = [
    pkgs.gnutar
    pkgs.zip
    pkgs.u-root-cmds
    pkgs.splat
    pkgs.yakut
    pkgs.imagemagick_light
    pkgs.killall
    pkgs.nodejs
    pkgs.postgresql
    pkgs.openssl
  ];
}