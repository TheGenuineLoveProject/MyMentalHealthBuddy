{ pkgs }:
{
  deps = with pkgs; [
    nodejs_22            # includes npm
    nodePackages.typescript
  ];
}
