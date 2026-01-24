import { defineEventHandler, getRequestHeader, getRequestURL, setResponseHeader } from "h3";

const installScript = `#!/bin/sh
set -e

# Tell installer
# Usage: curl -sL tell.rs | sh

REPO="anthropics/tell"
BINARY="tell"

detect_platform() {
  OS=$(uname -s | tr '[:upper:]' '[:lower:]')
  ARCH=$(uname -m)

  case "$OS" in
    linux) OS="linux" ;;
    darwin) OS="darwin" ;;
    mingw*|msys*|cygwin*) OS="windows" ;;
    *) echo "Unsupported OS: $OS" && exit 1 ;;
  esac

  case "$ARCH" in
    x86_64|amd64) ARCH="x86_64" ;;
    arm64|aarch64) ARCH="aarch64" ;;
    *) echo "Unsupported architecture: $ARCH" && exit 1 ;;
  esac

  echo "\${OS}-\${ARCH}"
}

main() {
  PLATFORM=$(detect_platform)

  echo "Installing Tell for $PLATFORM..."

  # Get latest release
  LATEST=$(curl -sL "https://api.github.com/repos/$REPO/releases/latest" | grep '"tag_name":' | sed -E 's/.*"([^"]+)".*/\\1/')

  if [ -z "$LATEST" ]; then
    echo "Failed to fetch latest release"
    exit 1
  fi

  echo "Latest version: $LATEST"

  # Download binary
  URL="https://github.com/$REPO/releases/download/$LATEST/tell-$PLATFORM"

  if [ "$PLATFORM" = "windows-x86_64" ]; then
    URL="$URL.exe"
    BINARY="tell.exe"
  fi

  echo "Downloading from $URL..."

  INSTALL_DIR="/usr/local/bin"
  if [ ! -w "$INSTALL_DIR" ]; then
    INSTALL_DIR="$HOME/.local/bin"
    mkdir -p "$INSTALL_DIR"
  fi

  curl -sL "$URL" -o "$INSTALL_DIR/$BINARY"
  chmod +x "$INSTALL_DIR/$BINARY"

  echo ""
  echo "Tell installed to $INSTALL_DIR/$BINARY"
  echo "Run 'tell --help' to get started"
}

main
`;

export default defineEventHandler((event) => {
  const userAgent = getRequestHeader(event, "user-agent") || "";
  const url = getRequestURL(event);

  // Only intercept root path requests from curl/wget
  if (url.pathname === "/" && (userAgent.toLowerCase().includes("curl") || userAgent.toLowerCase().includes("wget"))) {
    setResponseHeader(event, "content-type", "text/plain; charset=utf-8");
    return installScript;
  }
});
