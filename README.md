# macType

A TypeScript framework for managing Homebrew packages and macOS settings with declarative configuration and idempotent operations.

## Quick Start

Install macType with a single command:

```bash
curl -fsSL https://raw.githubusercontent.com/FlorianElke/macType/main/bootstrap.sh | bash
```

Then edit your config and apply:

```bash
# Edit your configuration
vim ~/.config/macType/config.ts

# Preview changes
mactype diff

# Apply configuration
mactype apply
```

## Features

- **TypeScript Configuration**: Use TypeScript config files with full IntelliSense and type checking
- **Config File Management**: Manage all your dotfiles (zshrc, vimrc, etc.) in TypeScript with automatic generation and symlinking
- **Declarative Configuration**: Define your desired system state in a configuration file
- **Idempotent Operations**: Running the same configuration multiple times is safe - only applies necessary changes
- **Beautiful Output**: Colored terminal output with progress indicators and clear summaries
- **Diff Preview**: See exactly what will change before applying with `mactype diff`
- **Dry Run Mode**: Test your configuration without making any changes
- **Strict Mode**: Optionally enforce exact package lists (remove unlisted packages)
- **Homebrew Integration**: Manage both packages and casks
- **Mac App Store Integration**: Install and manage App Store applications using `mas` CLI
- **macOS Settings**: Configure system preferences via the `defaults` command
- **Global Binary**: Install once, use anywhere with `mactype` command

## Installation

### Quick Install (One Command)

The easiest way to install macType is with a single curl command:

```bash
curl -fsSL https://raw.githubusercontent.com/FlorianElke/macType/main/bootstrap.sh | bash
```

This will:
- Clone the repository to `~/.local/macType`
- Install Xcode Command Line Tools (includes git)
- Install Homebrew (if not already installed)
- Install mas CLI for App Store management
- Install nvm and Node.js 22
- Install npm dependencies and build the project
- Link the `mactype` command globally
- Create the config directory at `~/.config/macType`
- Copy example TypeScript config and dotfile templates
- Set up TypeScript support with IntelliSense

### Manual Installation

If you prefer to clone the repository manually:

```bash
git clone https://github.com/FlorianElke/macType.git ~/.local/macType
cd ~/.local/macType
./init.sh
```

### Development Setup

For development, clone to any directory and run:

```bash
git clone https://github.com/FlorianElke/macType.git
cd macType
./install.sh
```

This will:
- Install npm dependencies
- Build the project
- Link the `mactype` command globally

Then initialize your configuration:

```bash
./init.sh
```

**Note**: On a fresh macOS install, a dialog will appear to install Xcode Command Line Tools. Click "Install" and wait for it to complete.

### Manual Installation

If you prefer to install manually:

```bash
# 1. Install Xcode Command Line Tools (if not already installed)
xcode-select --install

# 2. Install Homebrew (if not already installed)
# Visit https://brew.sh for instructions

# 3. Install mas CLI
brew install mas

# 4. Install and build macType
npm install
npm run build

# 5. Link globally
npm link

# 6. Initialize config directory
./init.sh
```

### Uninstall

To remove the global binary:

```bash
./uninstall.sh
```

## Usage

### CLI Commands

After installing globally, use the `mactype` command:

Preview changes without applying (recommended first step):
```bash
mactype diff
```

Apply your default configuration (`~/.config/macType/config.ts`):
```bash
mactype apply
```

Apply a specific configuration:
```bash
mactype apply /path/to/config.ts
```

Dry run to see what would change:
```bash
mactype apply --dry-run
```

Verbose output:
```bash
mactype apply --verbose
```

Strict mode (removes packages not in config):
```bash
mactype apply --strict
```

Search for Mac App Store applications:
```bash
mactype search "Xcode"
```

Show help:
```bash
mactype --help
```

### Command Options

**`mactype diff [config]`**
- Shows what changes would be applied without executing them
- Options:
  - `-s, --strict` - Show removals for packages not listed in config

**`mactype apply [config]`**
- Applies the configuration to your system
- Options:
  - `-d, --dry-run` - Show what would be changed without applying
  - `-v, --verbose` - Show detailed output including error messages
  - `-s, --strict` - Remove packages not listed in config (default: false)

**`mactype search <query>`**
- Search for Mac App Store applications
- Returns app ID, name, version, and ready-to-use config snippet
- Example: `mactype search "Xcode"`
- Requires `mas` CLI (automatically installed with `./init.sh`)

### Configuration File Format

macType uses TypeScript for configuration, providing **IntelliSense and type checking**.

By default, macType looks for your configuration at `~/.config/macType/config.ts`.

**TypeScript Support**: After running `./init.sh`, TypeScript IntelliSense is automatically available in your config files. The initialization script:
- Creates a `package.json` in `~/.config/macType/`
- Links the `mactype` package for type definitions
- Sets up `tsconfig.json` for optimal TypeScript support

This means you get full autocomplete and type checking when editing `config.ts` in VS Code or any TypeScript-aware editor!

```typescript
import { Configuration } from 'mactype';

const config: Configuration = {
  // Homebrew packages and casks
  brew: {
    packages: [
      'git',
      'node',
      'wget',
      'mas', // Required for App Store app management
    ],
    casks: [
      'visual-studio-code',
      'google-chrome',
    ],
  },

  // Mac App Store applications
  appstore: {
    apps: [
      { id: 497799835, name: 'Xcode' },
      { id: 1295203466, name: 'Microsoft Remote Desktop' },
    ],
  },

  // macOS system settings
  macos: {
    settings: [
      {
        domain: 'com.apple.dock',
        key: 'autohide',
        value: true,
        type: 'bool',
      },
      {
        domain: 'com.apple.dock',
        key: 'tilesize',
        value: 48,
        type: 'int',
      },
    ],
  },

  // Config files (dotfiles)
  files: {
    files: [
      {
        source: './configs/zshrc.ts',
        target: '~/.zshrc',
        backup: true  // Create backup of existing file
      },
      {
        source: './configs/vimrc.ts',
        target: '~/.vimrc',
        backup: true
      }
    ]
  }
};

export default config;
```

### Managing Dotfiles with TypeScript

You can write your dotfiles in TypeScript for better maintainability:

```typescript
// configs/zshrc.ts
const zshrc = `
# My .zshrc configuration
export PATH="$HOME/bin:$PATH"

# Aliases
alias ll='ls -lah'
alias gs='git status'

# Load syntax highlighting
if [ -f /opt/homebrew/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh ]; then
  source /opt/homebrew/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
fi
`;

export default zshrc;
```

Or use a function for dynamic generation:

```typescript
// configs/gitconfig.ts
export default function() {
  const username = process.env.USER || 'unknown';

  return `
[user]
  name = ${username}
  email = ${username}@example.com

[core]
  editor = vim
`;
}
```

When you run `mactype apply`:
1. TypeScript configs are compiled to plain text files
2. Files are saved in `.generated/` directory
3. Symlinks are created pointing to the generated files
4. Existing files are backed up if `backup: true`

### Managing Mac App Store Applications

macType can manage App Store applications using the `mas` CLI tool.

**Prerequisites**:
```bash
brew install mas
```

**Finding App IDs**:

1. Using mactype CLI (recommended):
```bash
mactype search "Xcode"
```
Output:
```
📱 Searching App Store...

Found 1 app(s):

Xcode
  ID: 497799835
  Version: 14.2
  Config: { id: 497799835, name: 'Xcode' }

💡 Copy the config line to your appstore.apps array
```

2. Using mas CLI directly:
```bash
mas search "Xcode"
# Output: 497799835  Xcode (14.2)
```

3. From App Store URL:
   - Visit the app on https://apps.apple.com
   - The ID is in the URL: `https://apps.apple.com/app/id497799835`

**Configuration Example**:
```typescript
appstore: {
  apps: [
    { id: 497799835, name: 'Xcode' },
    { id: 1295203466, name: 'Microsoft Remote Desktop' },
    { id: 1569813296, name: '1Password for Safari' },
  ]
}
```

**Important Notes**:
- You must be signed into the Mac App Store
- The `mas` CLI cannot uninstall apps (macOS limitation)
- In strict mode, unlisted apps will be flagged but not removed
- Some apps may require manual first-time setup

### macOS Settings Types

When configuring macOS settings, you can specify the type:

- `bool` - Boolean values (true/false)
- `int` - Integer numbers
- `float` - Floating point numbers
- `string` - Text values
- `array` - Arrays of values
- `dict` - Dictionary/object values

If no type is specified, the framework will infer it from the value.

## How It Works

1. **Read Configuration**: Loads your desired state from the JSON config file
2. **Read Current State**: Queries the system for current Homebrew packages and macOS settings
3. **Generate Diff**: Compares desired vs current state and identifies changes needed
4. **Apply Changes**: Only applies the necessary changes to reach the desired state

### Package Management Modes

#### Non-Strict Mode (Default)

By default, macType only ensures the packages in your config are installed. It won't remove packages that aren't listed, allowing you to manage additional packages manually.

This is ideal when you want macType to ensure certain packages are present without interfering with other tools or manual installations.

#### Strict Mode

When using the `--strict` flag, macType enforces an exact match - any packages or casks not in your config will be removed.

This is useful for ensuring a completely reproducible environment or for CI/CD pipelines.

### Installation Output

macType shows **live installation progress** during package installations:

**Normal Mode** (default):
- Shows only important messages (Installing, Downloading, Installed, Errors)
- Keeps output clean and readable
- Perfect for daily use

```bash
mactype apply
```

Output example:
```
🚀 Applying changes...

  ✓ Installed package: wget
   ==> Downloading wget...
   ==> Pouring wget--1.21.3.arm64_ventura.bottle.tar.gz
   ==> Installed wget

  ✓ Installed cask: google-chrome
   ==> Downloading Google Chrome...
   ==> Installing Google Chrome
```

**Verbose Mode**:
- Shows complete installation output from Homebrew/mas
- Useful for debugging issues
- Shows all details

```bash
mactype apply --verbose
```

### Example Output

macType now features beautiful colored output with progress indicators:

```
╔═══════════════════════════════════╗
║       macType Configuration       ║
╚═══════════════════════════════════╝

📋 Config loaded from: /Users/you/.config/macType/config.json

🔍 Reading current system state...
⚙️  Generating diff...

╔═══════════════════════════════════╗
║           CHANGES DIFF            ║
╚═══════════════════════════════════╝

📦 Homebrew Packages:
  ✓ wget

⚙️  macOS Settings:
  ↻ com.apple.dock autohide: false → true
  ✓ com.apple.dock tilesize = 48

🚀 Applying changes...

  ✓ Installed package: wget
  ✓ Updated setting: com.apple.dock autohide = true
  ✓ Added setting: com.apple.dock tilesize = 48

╔═══════════════════════════════════╗
║             SUMMARY               ║
╚═══════════════════════════════════╝

✓ Success: 3

🎉 All changes applied successfully!
```

## Running Multiple Times

The framework is designed to be idempotent. If you run it multiple times with the same configuration:

1. **First run**: Will install packages and configure settings as needed
2. **Second run**: Will detect no changes needed and exit quickly

This makes it safe to run repeatedly and perfect for automation or setup scripts.

## Programmatic Usage

You can also use macType programmatically in your TypeScript code:

```typescript
import { MacType } from './mactype';

const mactype = new MacType();

await mactype.run('~/.config/macType/config.ts', {
  dryRun: false,
  verbose: true,
  strict: false
});
```

## Common macOS Settings

Here are some useful macOS settings you can configure:

### Dock
- `com.apple.dock autohide` - Auto-hide the Dock
- `com.apple.dock tilesize` - Icon size (16-128)
- `com.apple.dock minimize-to-application` - Minimize windows into app icon

### Finder
- `com.apple.finder ShowPathbar` - Show path bar
- `com.apple.finder ShowStatusBar` - Show status bar
- `NSGlobalDomain AppleShowAllExtensions` - Show all file extensions

### Screenshots
- `com.apple.screencapture location` - Screenshot save location
- `com.apple.screencapture type` - Screenshot format (png, jpg, etc.)

### Trackpad
- `com.apple.AppleMultitouchTrackpad Clicking` - Tap to click
- `com.apple.driver.AppleBluetoothMultitouch.trackpad TrackpadThreeFingerDrag` - Three finger drag

## Requirements

- macOS
- Homebrew (automatically installed by `init.sh`)
- Node.js 22+ (automatically installed via nvm by `init.sh`)

## Troubleshooting

### macOS Settings Not Applying

Some settings require restarting the affected application or logging out. For example, Dock settings:

```bash
killall Dock
```

For Finder settings:

```bash
killall Finder
```

### Finding macOS Settings

To discover available settings:

```bash
# List all settings for a domain
defaults read com.apple.dock

# Read a specific setting
defaults read com.apple.dock autohide

# Find domains containing "dock"
defaults domains | tr ',' '\n' | grep -i dock
```

### Permission Issues

Some operations may require administrator privileges. Ensure you have the necessary permissions or run with `sudo` if needed.

## License

MIT
