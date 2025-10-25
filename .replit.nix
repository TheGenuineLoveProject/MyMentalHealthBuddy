{ pkgs }: {
  deps = [
    pkgs.nodejs_20
    pkgs.bashInteractive
    pkgs.git
    pkgs.openssl
    pkgs.python3
    pkgs.glibcLocales
  ];

  env = {
    NODE_ENV = "development";
  };
}