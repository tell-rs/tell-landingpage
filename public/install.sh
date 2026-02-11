#!/usr/bin/env bash
# Tell installer script
# Usage: curl -sSfL https://tell.rs | bash
#
# Options (via env vars):
#   TELL_VERSION=0.1.0    Install specific version (default: latest)
#   TELL_INSTALL_DIR=...  Install directory (default: ~/.local/bin)

set -euo pipefail

# Configuration
DL_BASE="https://dl.tell.rs"
BINARY_NAME="tell"
DEFAULT_INSTALL_DIR="$HOME/.local/bin"

# Global for cleanup
CLEANUP_DIR=""

cleanup() {
    if [ -n "$CLEANUP_DIR" ] && [ -d "$CLEANUP_DIR" ]; then
        rm -rf "$CLEANUP_DIR"
    fi
}
trap cleanup EXIT

# Colors: Orange (brand) + Gray + Green (success) + Red (errors)
setup_colors() {
    if [ -t 1 ]; then
        ORANGE='\033[38;5;209m'  # Brand color - coral/orange
        GREEN='\033[0;32m'       # Success checkmarks only
        RED='\033[0;31m'         # Errors only
        GRAY='\033[0;90m'        # Secondary text
        NC='\033[0m'
    else
        ORANGE=''
        GREEN=''
        RED=''
        GRAY=''
        NC=''
    fi
}

# Print the Tell ASCII art logo
print_logo() {
    printf "\n${ORANGE}"
    cat << 'EOF'
████████╗███████╗██╗     ██╗
╚══██╔══╝██╔════╝██║     ██║
   ██║   █████╗  ██║     ██║
   ██║   ██╔══╝  ██║     ██║
   ██║   ███████╗███████╗███████╗
   ╚═╝   ╚══════╝╚══════╝╚══════╝
EOF
    printf "${NC}\n"
}

# Print a progress bar (real bytes tracking)
print_progress() {
    local bytes="$1"
    local length="$2"
    [ "$length" -gt 0 ] || return 0

    local width=40
    local percent=$(( bytes * 100 / length ))
    [ "$percent" -gt 100 ] && percent=100
    local on=$(( percent * width / 100 ))
    local off=$(( width - on ))

    local filled=""
    local empty=""
    local i=0
    while [ $i -lt $on ]; do
        filled="${filled}█"
        i=$((i + 1))
    done
    i=0
    while [ $i -lt $off ]; do
        empty="${empty}░"
        i=$((i + 1))
    done

    printf "\r${ORANGE}%s${GRAY}%s${NC} ${GRAY}%3d%%${NC}" "$filled" "$empty" "$percent" >&4
}

# Unbuffered sed for real-time parsing
unbuffered_sed() {
    if echo | sed -u -e "" >/dev/null 2>&1; then
        sed -nu "$@"
    elif echo | sed -l -e "" >/dev/null 2>&1; then
        sed -nl "$@"
    else
        local pad
        pad="$(printf "\n%512s" "")"
        sed -ne "s/$/\\${pad}/" "$@"
    fi
}

# Download with real progress tracking using curl --trace-ascii
download_with_progress() {
    local url="$1"
    local output="$2"

    if [ -t 2 ]; then
        exec 4>&2
    else
        exec 4>/dev/null
    fi

    local progress_tmp="${TMPDIR:-/tmp}/tell_trace_$$"
    rm -f "$progress_tmp"
    mkfifo "$progress_tmp"

    printf "\033[?25l" >&4

    trap 'trap - RETURN; rm -f "$progress_tmp"; printf "\033[?25h" >&4; exec 4>&-' RETURN

    (
        curl --trace-ascii "$progress_tmp" -s -L -o "$output" "$url"
    ) &
    local curl_pid=$!

    unbuffered_sed \
        -e 'y/ACDEGHLNORTV/acdeghlnortv/' \
        -e '/^0000: content-length:/p' \
        -e '/^<= recv data/p' \
        "$progress_tmp" | \
    {
        local length=0
        local bytes=0

        while IFS=" " read -r -a line; do
            [ "${#line[@]}" -lt 2 ] && continue
            local tag="${line[0]} ${line[1]}"

            if [ "$tag" = "0000: content-length:" ]; then
                length="${line[2]}"
                length=$(echo "$length" | tr -d '\r')
                bytes=0
            elif [ "$tag" = "<= recv" ]; then
                local size="${line[3]}"
                bytes=$(( bytes + size ))
                if [ "$length" -gt 0 ]; then
                    print_progress "$bytes" "$length"
                fi
            fi
        done
    }

    wait $curl_pid
    local ret=$?
    printf "\n" >&4
    return $ret
}

# Simple download without progress
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

success() {
    printf "${GREEN}✓${NC} %s\n" "$1"
}

error() {
    printf "${RED}✗${NC} %s\n" "$1" >&2
    exit 1
}

detect_os() {
    case "$(uname -s)" in
        Linux*)  echo "linux" ;;
        Darwin*) echo "macos" ;;
        MINGW*|MSYS*|CYGWIN*) error "Windows is not supported. Use WSL instead." ;;
        *) error "Unsupported operating system: $(uname -s)" ;;
    esac
}

detect_arch() {
    case "$(uname -m)" in
        x86_64|amd64) echo "amd64" ;;
        aarch64|arm64) echo "arm64" ;;
        *) error "Unsupported architecture: $(uname -m)" ;;
    esac
}

get_latest_version() {
    local url="${DL_BASE}/latest.txt"

    if command -v curl >/dev/null 2>&1; then
        curl -fsSL "$url" 2>/dev/null | tr -d '[:space:]'
    elif command -v wget >/dev/null 2>&1; then
        wget -qO- "$url" 2>/dev/null | tr -d '[:space:]'
    else
        error "curl or wget is required"
    fi
}

verify_checksum() {
    local file="$1"
    local checksum_file="$2"

    if command -v sha512sum >/dev/null 2>&1; then
        echo "$(cat "$checksum_file")  $file" | sha512sum -c - >/dev/null 2>&1
    elif command -v shasum >/dev/null 2>&1; then
        echo "$(cat "$checksum_file")  $file" | shasum -a 512 -c - >/dev/null 2>&1
    else
        return 0
    fi
}

get_install_dir() {
    if [ -n "${TELL_INSTALL_DIR:-}" ]; then
        echo "$TELL_INSTALL_DIR"
    else
        mkdir -p "$DEFAULT_INSTALL_DIR"
        echo "$DEFAULT_INSTALL_DIR"
    fi
}

detect_shell() {
    if [ -n "${SHELL:-}" ]; then
        basename "$SHELL"
    else
        echo "sh"
    fi
}

get_shell_config() {
    local shell_name="$1"

    case "$shell_name" in
        zsh)  echo "$HOME/.zshrc" ;;
        bash)
            if [ -f "$HOME/.bash_profile" ]; then
                echo "$HOME/.bash_profile"
            else
                echo "$HOME/.bashrc"
            fi
            ;;
        fish) echo "$HOME/.config/fish/config.fish" ;;
        *)    echo "$HOME/.profile" ;;
    esac
}

add_to_path() {
    local dir="$1"
    local shell_name
    local config_file
    shell_name=$(detect_shell)
    config_file=$(get_shell_config "$shell_name")

    # Already in PATH
    case ":$PATH:" in
        *":$dir:"*) return 0 ;;
    esac

    # Already in config
    if [ -f "$config_file" ] && grep -q "$dir" "$config_file" 2>/dev/null; then
        return 0
    fi

    # Add to config
    case "$shell_name" in
        fish)
            mkdir -p "$(dirname "$config_file")"
            printf '\n# Tell\nfish_add_path %s\n' "$dir" >> "$config_file"
            ;;
        *)
            printf '\n# Tell\nexport PATH="%s:$PATH"\n' "$dir" >> "$config_file"
            ;;
    esac

    printf "${GREEN}✓${NC} Added to PATH\n"
}

main() {
    setup_colors
    print_logo

    local os arch version install_dir
    os=$(detect_os)
    arch=$(detect_arch)
    version="${TELL_VERSION:-}"
    [ -z "$version" ] && version=$(get_latest_version)
    install_dir=$(get_install_dir)

    [ -z "$version" ] && error "Could not determine version to install"

    printf "${GRAY}Installing ${NC}${ORANGE}tell${NC} ${GRAY}v%s...${NC}\n\n" "$version"

    # Build artifact name
    local base_url="${DL_BASE}/v${version}"
    local artifact="tell-${version}-${os}-${arch}.tgz"

    # Create temp directory
    CLEANUP_DIR=$(mktemp -d)

    # Download with progress
    if [ -t 2 ] && download_with_progress "${base_url}/${artifact}" "${CLEANUP_DIR}/${artifact}"; then
        : # Success
    else
        curl -fsSL "${base_url}/${artifact}" -o "${CLEANUP_DIR}/${artifact}" || \
        wget -q "${base_url}/${artifact}" -O "${CLEANUP_DIR}/${artifact}" || \
        error "Download failed"
    fi

    # Verify (silent, just skip if no checksum)
    if download "${base_url}/${artifact}.sha512" "${CLEANUP_DIR}/${artifact}.sha512" 2>/dev/null; then
        verify_checksum "${CLEANUP_DIR}/${artifact}" "${CLEANUP_DIR}/${artifact}.sha512" || \
        error "Checksum verification failed"
    fi

    # Extract and install
    tar -xzf "${CLEANUP_DIR}/${artifact}" -C "${CLEANUP_DIR}"
    local binary
    binary=$(find "${CLEANUP_DIR}" -name "${BINARY_NAME}" -type f | head -1)
    [ -z "$binary" ] && error "Binary not found in archive"

    cp "$binary" "${install_dir}/${BINARY_NAME}"
    chmod +x "${install_dir}/${BINARY_NAME}"

    printf "\n${GREEN}✓${NC} Installed to ${ORANGE}%s/${BINARY_NAME}${NC}\n" "${install_dir/$HOME/~}"
    add_to_path "$install_dir"

    # Track install (anonymous, runs in background)
    curl -s "https://tell.rs/api/install?v=${version}&os=${os}&arch=${arch}" >/dev/null 2>&1 &

    # Next steps
    printf "\nTo start: ${ORANGE}tell${NC}\n"
    printf "${GRAY}https://tell.rs/docs${NC}\n\n"
}

main "$@"
