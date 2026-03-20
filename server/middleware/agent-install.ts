import { defineEventHandler, getRequestHeader, getRequestURL, setResponseHeader } from "h3";

const agentInstallScript = `#!/usr/bin/env bash
# Witness installer
# Usage: curl -sSfL https://tell.rs/agent | bash
#
# Options (via bash -s --):
#   --token KEY            API key or install token
#   --server URL           Tell server URL (for self-hosted)
#   --endpoint HOST:PORT   TCP data endpoint override
#   --version VERSION      Install specific version (default: latest)
#
# Env vars:
#   WITNESS_VERSION=0.1.1  Install specific version

set -euo pipefail

REPO="tell-rs/witness"
BINARY_NAME="witness"
INSTALL_DIR="/usr/local/bin"
CONFIG_DIR="/etc/tell"
CONFIG_FILE="\${CONFIG_DIR}/agent.toml"
SERVICE_FILE="/etc/systemd/system/witness.service"

TOKEN=""
SERVER=""
ENDPOINT=""
VERSION="\${WITNESS_VERSION:-latest}"

# --- Parse arguments ---

while [[ \$# -gt 0 ]]; do
    case "\$1" in
        --token)    TOKEN="\$2";    shift 2 ;;
        --server)   SERVER="\$2";   shift 2 ;;
        --endpoint) ENDPOINT="\$2"; shift 2 ;;
        --version)  VERSION="\$2";  shift 2 ;;
        *) echo "Unknown option: \$1"; exit 1 ;;
    esac
done

# --- Colors ---

if [ -t 1 ]; then
    GREEN='\\033[0;32m'
    RED='\\033[0;31m'
    GRAY='\\033[0;90m'
    NC='\\033[0m'
else
    GREEN='' RED='' GRAY='' NC=''
fi

ok()    { printf "\${GREEN}✓\${NC} %s\\n" "\$1"; }
fail()  { printf "\${RED}✗\${NC} %s\\n" "\$1" >&2; exit 1; }

# --- Detect platform ---

ARCH=\$(uname -m)
case "\$ARCH" in
    x86_64|amd64) ARCH="x86_64" ;;
    aarch64|arm64) ARCH="aarch64" ;;
    *) fail "Unsupported architecture: \$ARCH" ;;
esac

OS=\$(uname -s | tr '[:upper:]' '[:lower:]')
[[ "\$OS" != "linux" ]] && fail "Unsupported OS: \$OS (only Linux)"

printf "\\n\${GRAY}Installing \${NC}witness\${GRAY}...\${NC}\\n\\n"

# --- Resolve version ---

if [[ "\$VERSION" == "latest" ]]; then
    VERSION=\$(curl -sSf "https://api.github.com/repos/\${REPO}/releases/latest" | grep '"tag_name"' | sed -E 's/.*"v?([^"]+)".*/\\1/')
    [[ -z "\$VERSION" ]] && fail "Could not determine latest version"
fi

# --- Download ---

ARTIFACT="witness-\${VERSION}-linux-\${ARCH}.tgz"
URL="https://github.com/\${REPO}/releases/download/v\${VERSION}/\${ARTIFACT}"
TMP=\$(mktemp -d)
trap 'rm -rf "\$TMP"' EXIT

curl -fsSL "\$URL" -o "\${TMP}/\${ARTIFACT}" || fail "Download failed: \$URL"
ok "Downloaded witness v\${VERSION} (\${ARCH})"

# Verify checksum
if curl -fsSL "\${URL}.sha512" -o "\${TMP}/checksum" 2>/dev/null; then
    if command -v sha512sum >/dev/null 2>&1; then
        echo "\$(cat "\${TMP}/checksum")  \${TMP}/\${ARTIFACT}" | sha512sum -c - >/dev/null 2>&1 || fail "Checksum mismatch"
    elif command -v shasum >/dev/null 2>&1; then
        echo "\$(cat "\${TMP}/checksum")  \${TMP}/\${ARTIFACT}" | shasum -a 512 -c - >/dev/null 2>&1 || fail "Checksum mismatch"
    fi
    ok "Verified checksum"
fi

# --- Install ---

tar -xzf "\${TMP}/\${ARTIFACT}" -C "\${TMP}"
BINARY=\$(find "\${TMP}" -name "\${BINARY_NAME}" -type f | head -1)
[[ -z "\$BINARY" ]] && fail "Binary not found in archive"

mv "\$BINARY" "\${INSTALL_DIR}/\${BINARY_NAME}"
chmod +x "\${INSTALL_DIR}/\${BINARY_NAME}"
ok "Installed to \${INSTALL_DIR}/\${BINARY_NAME}"

# --- Create user ---

if ! id -u witness >/dev/null 2>&1; then
    useradd --system --no-create-home --shell /usr/sbin/nologin witness
    ok "Created witness user"
fi

# Add witness to adm group for log file access
if getent group adm >/dev/null 2>&1; then
    usermod -aG adm witness 2>/dev/null && ok "Added witness to adm group" || true
fi

# --- Systemd service ---

tee "\$SERVICE_FILE" > /dev/null <<'UNIT'
[Unit]
Description=Witness Agent
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
ExecStart=/usr/local/bin/witness --config /etc/tell/agent.toml
ExecReload=/bin/kill -HUP $MAINPID
Restart=always
RestartSec=5
User=witness
Group=witness
ReadOnlyPaths=/proc /sys /var/log
StateDirectory=witness

[Install]
WantedBy=multi-user.target
UNIT

systemctl daemon-reload
ok "Installed systemd service"

# --- Configure ---

if [[ -n "\$TOKEN" ]]; then
    SETUP_ARGS="--token \$TOKEN"
    [[ -n "\$SERVER" ]]   && SETUP_ARGS="\$SETUP_ARGS --server \$SERVER"
    [[ -n "\$ENDPOINT" ]] && SETUP_ARGS="\$SETUP_ARGS --endpoint \$ENDPOINT"
    "\${INSTALL_DIR}/\${BINARY_NAME}" setup \$SETUP_ARGS --force
    ok "Configured"
    systemctl enable --now witness
    ok "Started witness"
    printf "\\nVerify:\\n"
    printf "  systemctl status witness\\n\\n"
else
    printf "\\nConfigure:\\n"
    printf "  witness setup --token YOUR_API_KEY\\n"
    printf "\\nThen start:\\n"
    printf "  systemctl enable --now witness\\n\\n"
fi
`;

export default defineEventHandler((event) => {
  const userAgent = getRequestHeader(event, "user-agent") || "";
  const url = getRequestURL(event);

  if (url.pathname === "/agent" && (userAgent.toLowerCase().includes("curl") || userAgent.toLowerCase().includes("wget"))) {
    setResponseHeader(event, "content-type", "text/plain; charset=utf-8");
    return agentInstallScript;
  }
});
