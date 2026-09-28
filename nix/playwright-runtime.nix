{ pkgs ? import <nixpkgs> {} }:

let
  runtimeLibs = with pkgs; [
    glib
    nspr
    nss

    atk
    at-spi2-atk
    at-spi2-core

    dbus
    cups

    xorg.libxcb
    libxkbcommon

    alsa-lib
    mesa

    xorg.libX11
    xorg.libXext
    xorg.libXcomposite
    xorg.libXdamage
    xorg.libXfixes
    xorg.libXrandr

    cairo
    pango

    expat
    systemd
  ];

  browserLibraryPath =
    pkgs.lib.makeLibraryPath runtimeLibs;

in

pkgs.mkShell {
  packages = runtimeLibs;

  shellHook = ''
    export MMHB_BROWSER_LIBRARY_PATH="${browserLibraryPath}"
    export LD_LIBRARY_PATH="$MMHB_BROWSER_LIBRARY_PATH:''${LD_LIBRARY_PATH:-}"
  '';
}
