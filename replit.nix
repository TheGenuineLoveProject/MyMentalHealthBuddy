{ pkgs }: {
    deps = [
        pkgs.nodejs-20_x
        pkgs.nodejs-20_x.pkgs.npm
        pkgs.vite
    ];
}