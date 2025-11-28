{ pkgs }:

{
  deps = [
    pkgs.killall
    pkgs.nodejs
    pkgs.postgresql
    pkgs.openssl
  ];
}