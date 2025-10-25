{ pkgs }:

{
  deps = [
    pkgs.nodejs-18_x
    pkgs.bashInteractive
    pkgs.git
    pkgs.openssl
    pkgs.cacert
    pkgs.python3    # optional: helps compile native addons
  ];

  env = {
    NODE_ENV = "development";
  };
}