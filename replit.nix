{ pkgs }:
{
  deps = with pkgs; [
    nodejs_22          # Includes npm v10+
    nodePackages.typescript
    nodePackages.npm
  ];
}
