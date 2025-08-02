{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = [
    pkgs.nodejs_18
  ];

  shellHook = ''
    # Optionally, set up any environment variables or other shell setup here
    export NODE_PATH=$(pwd)/node_modules
    echo "Node.js 18 environment is ready!"
  '';
}

