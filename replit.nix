{ pkgs }: {
  deps = [
    pkgs.nodejs-20_x
    pkgs.nodePackages.pnpm
    pkgs.postgresql_15
  ];

  env = {
    NODE_ENV = "production";
    PNPM_HOME = "/home/runner/.local/share/pnpm";
  };
}