{ pkgs }: {
  deps = [
    pkgs.nodejs-slim
    pkgs.nodePackages.npm
    pkgs.nodePackages.typescript
    pkgs.nodePackages.eslint
    pkgs.bashInteractive
  ];
  env = {
    NODE_ENV = "development";
  };
}
