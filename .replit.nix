{ pkgs }: {
  deps = [
    pkgs.nodejs_20
    pkgs.bashInteractive
    pkgs.git
    pkgs.openssl
    pkgs.python3
    pkgs.jq
  ];
  env = {
    NODE_ENV = "development";
  };
}