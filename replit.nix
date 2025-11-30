{ pkgs }:

{
  deps = [
    pkgs.yakut
    pkgs.imagemagick_light
    pkgs.killall
    pkgs.nodejs
    pkgs.postgresql
    pkgs.openssl
  ];
}