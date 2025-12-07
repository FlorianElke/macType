# Config Files

This directory contains configuration files for your system.

## How it works

Files in this directory can be:

1. **Plain text files** - Just copied/symlinked directly (e.g., `zshrc`, `gitconfig`)
2. **TypeScript templates** - Files ending in `.ts` that export content dynamically

macType will symlink these files to their target locations on your system.

## Plain Files Example

```bash
# configs/zshrc
export PATH="$HOME/bin:$PATH"
alias ll='ls -lah'
```

Then in `config.ts`:

```typescript
files: {
  files: [
    {
      source: './configs/zshrc',
      target: '~/.zshrc',
      backup: true  // Creates .backup of existing file
    }
  ]
}
```

## TypeScript Templates Example

For dynamic content, use `.ts` files:

```typescript
// configs/gitconfig.ts
const gitconfig = `
[user]
  name = ${process.env.USER}
`;

export default gitconfig;
```
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
