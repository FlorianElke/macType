# Config Files

This directory contains TypeScript files that generate configuration files for your system.

## How it works

1. Write your config files in TypeScript (e.g., `zshrc.ts`)
2. Export a string (or a function that returns a string)
3. macType will generate the actual file and symlink it to the target location

## Example

```typescript
// configs/zshrc.ts
const zshrc = `
# My .zshrc configuration
export PATH="$HOME/bin:$PATH"
`;

export default zshrc;
```

Then in `config.ts`:

```typescript
files: {
  files: [
    {
      source: './configs/zshrc.ts',
      target: '~/.zshrc',
      backup: true  // Creates a backup of existing file
    }
  ]
}
```

## Advantages

- Type-safe configuration files
- Use TypeScript for dynamic generation
- Version control your dotfiles
- Automatic symlinking
- Backup protection
