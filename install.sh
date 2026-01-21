#!/bin/sh
# Tell installer script
# Usage: curl -fsSL https://raw.githubusercontent.com/tell-rs/tell/main/install.sh | sh
#
# Options (via env vars):
#   TELL_VERSION=2.0.0    Install specific version (default: latest)
#   TELL_INSTALL_DIR=...  Install directory (default: /usr/local/bin or ~/.local/bin)

set -e

# Configuration
GITHUB_OWNER="tell-rs"
GITHUB_REPO="tell"
BINARY_NAME="tell"

# Colors (disabled if not terminal)
if [ -t 1 ]; then
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[0;33m'
    BLUE='\033[0;34m'
    NC='\033[0m' # No Color
else
    RED=''
    GREEN=''
    YELLOW=''
    BLUE=''
    NC=''
fi

info() {
    printf "${BLUE}==>${NC} %s\n" "$1"
}

success() {
    printf "${GREEN}==>${NC} %s\n" "$1"
}

warn() {
    printf "${YELLOW}warning:${NC} %s\n" "$1"
}

error() {
    printf "${RED}error:${NC} %s\n" "$1" >&2
    exit 1
}

# Detect OS
detect_os() {
    case "$(uname -s)" in
        Linux*)  echo "linux" ;;
        Darwin*) echo "macos" ;;
        MINGW*|MSYS*|CYGWIN*) error "Windows is not supported. Use WSL instead." ;;
        *) error "Unsupported operating system: $(uname -s)" ;;
    esac
}

# Detect architecture
detect_arch() {
    case "$(uname -m)" in
        x86_64|amd64) echo "amd64" ;;
        aarch64|arm64) echo "arm64" ;;
        *) error "Unsupported architecture: $(uname -m)" ;;
    esac
}

# Get latest version from GitHub API
get_latest_version() {
    local url="https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases/latest"

    if command -v curl >/dev/null 2>&1; then
        curl -fsSL "$url" | grep '"tag_name"' | sed -E 's/.*"v?([^"]+)".*/\1/'
    elif command -v wget >/dev/null 2>&1; then
        wget -qO- "$url" | grep '"tag_name"' | sed -E 's/.*"v?([^"]+)".*/\1/'
    else
        error "curl or wget is required"
    fi
}

# Download file
download() {
    local url="$1"
    local output="$2"

    if command -v curl >/dev/null 2>&1; then
        curl -fsSL "$url" -o "$output"
    elif command -v wget >/dev/null 2>&1; then
        wget -q "$url" -O "$output"
    else
        error "curl or wget is required"
    fi
}

# Verify SHA512 checksum
verify_checksum() {
    local file="$1"
    local checksum_file="$2"

    if command -v sha512sum >/dev/null 2>&1; then
        # Linux
        echo "$(cat "$checksum_file")  $file" | sha512sum -c - >/dev/null 2>&1
    elif command -v shasum >/dev/null 2>&1; then
        # macOS
        echo "$(cat "$checksum_file")  $file" | shasum -a 512 -c - >/dev/null 2>&1
    else
        warn "Cannot verify checksum (sha512sum/shasum not found)"
        return 0
    fi
}

# Determine install directory
get_install_dir() {
    if [ -n "$TELL_INSTALL_DIR" ]; then
        echo "$TELL_INSTALL_DIR"
    elif [ -w "/usr/local/bin" ]; then
        echo "/usr/local/bin"
    else
        # Fall back to user directory
        mkdir -p "$HOME/.local/bin"
        echo "$HOME/.local/bin"
    fi
}

# Check if directory is in PATH
check_path() {
    local dir="$1"
    case ":$PATH:" in
        *":$dir:"*) return 0 ;;
        *) return 1 ;;
    esac
}

# Main installation
main() {
    local os=$(detect_os)
    local arch=$(detect_arch)
    local version="${TELL_VERSION:-$(get_latest_version)}"
    local install_dir=$(get_install_dir)

    if [ -z "$version" ]; then
        error "Could not determine version to install"
    fi

    info "Installing Tell v${version} for ${os}/${arch}"

    # Construct download URL based on OS
    # Artifact format: tell-{version}-{os}-{arch}.tgz
    local base_url="https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/releases/download/v${version}"
    local artifact=""

    case "$os" in
        linux)
            artifact="tell-${version}-linux-${arch}.tgz"
            ;;
        macos)
            if [ "$arch" = "arm64" ]; then
                artifact="tell-${version}-macos-arm64.tgz"
            else
                error "macOS Intel is not supported. Apple Silicon (M1/M2/M3/M4) required."
            fi
            ;;
    esac

    # Create temp directory
    local tmp_dir=$(mktemp -d)
    trap "rm -rf '$tmp_dir'" EXIT

    # Download
    info "Downloading ${artifact}..."
    download "${base_url}/${artifact}" "${tmp_dir}/${artifact}"

    # Verify checksum
    info "Verifying checksum..."
    download "${base_url}/${artifact}.sha512" "${tmp_dir}/${artifact}.sha512"
    if verify_checksum "${tmp_dir}/${artifact}" "${tmp_dir}/${artifact}.sha512"; then
        success "Checksum verified"
    else
        error "Checksum verification failed"
    fi

    # Extract and install
    info "Installing to ${install_dir}..."
    tar -xzf "${tmp_dir}/${artifact}" -C "${tmp_dir}"
    # Find the binary (might be in root or subdirectory)
    local binary=$(find "${tmp_dir}" -name "${BINARY_NAME}" -type f | head -1)
    if [ -z "$binary" ]; then
        error "Binary not found in archive"
    fi
    cp "$binary" "${install_dir}/${BINARY_NAME}"

    chmod +x "${install_dir}/${BINARY_NAME}"

    success "Tell v${version} installed to ${install_dir}/${BINARY_NAME}"

    # Check PATH
    if ! check_path "$install_dir"; then
        echo ""
        warn "${install_dir} is not in your PATH"
        echo ""
        echo "Add it to your shell profile:"
        echo ""
        echo "  # For bash (~/.bashrc or ~/.bash_profile)"
        echo "  export PATH=\"${install_dir}:\$PATH\""
        echo ""
        echo "  # For zsh (~/.zshrc)"
        echo "  export PATH=\"${install_dir}:\$PATH\""
        echo ""
        echo "  # For fish (~/.config/fish/config.fish)"
        echo "  set -gx PATH ${install_dir} \$PATH"
        echo ""
    fi

    # Verify installation
    if command -v "${BINARY_NAME}" >/dev/null 2>&1 || [ -x "${install_dir}/${BINARY_NAME}" ]; then
        echo ""
        success "Installation complete! Run 'tell --help' to get started."
    fi
}

main "$@"
