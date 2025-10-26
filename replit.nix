{ pkgs }: {
  deps = with pkgs; [
    nodejs_20
    nodePackages.npm
    nodePackages.typescript
    nodePackages.tsx
    nodePackages.vite
    nodePackages.concurrently
    nodePackages.kill-port
  ];
}
