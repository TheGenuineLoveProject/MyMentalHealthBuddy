{ pkgs }:

{
  # --- Core Runtime ---
  deps = [
    pkgs.nodejs-20_x
    pkgs.nodePackages.npm
    pkgs.postgresql_15
  ];

  # --- Global Environment Variables ---
  env = {
    NODE_ENV = "production";
    PNPM_HOME = "/home/runner/.local/share/pnpm";
  };
}