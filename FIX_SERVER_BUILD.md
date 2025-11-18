# Fix Server Build Issues

## Issue 1: Invalid eslint configuration
✅ **FIXED** - Removed `eslint` configuration from next.config.ts

## Issue 2: Missing lightningcss native binary for Linux

The build is failing because lightningcss needs platform-specific native binaries that aren't installed on the Linux server.

### Solution: Reinstall dependencies on the server

Run these commands on your server:

```bash
cd ~/projects/ubiqent-front

# Remove node_modules and lock files
rm -rf node_modules
rm package-lock.json

# Clean npm cache
npm cache clean --force

# Reinstall all dependencies (this will download Linux binaries)
npm install

# Try building again
npm run build
```

### Alternative: If above doesn't work

If the issue persists, you may need to explicitly install lightningcss:

```bash
# Install lightningcss with native binaries
npm install lightningcss-linux-x64-gnu --save-optional

# Or reinstall lightningcss
npm uninstall lightningcss
npm install lightningcss

# Then try building
npm run build
```

### Why this happens:

- `lightningcss` uses native binaries that are platform-specific
- The binary was built/cached for Windows on your local machine
- When you deploy to Linux server, it needs the Linux-specific binary
- Running `npm install` on the server downloads the correct Linux binary

### Best Practice for Future Deployments:

1. **Don't copy node_modules** from local to server
2. **Always run `npm install` on the server** after deploying code
3. Or use CI/CD that runs fresh install on deployment

### Quick Fix Commands (all in one):

```bash
cd ~/projects/ubiqent-front && \
rm -rf node_modules package-lock.json && \
npm cache clean --force && \
npm install && \
npm run build
```

## Issue 3: Middleware deprecation warning

The warning about "middleware" being deprecated is a false positive in Next.js 16.0.3. The `middleware.ts` file is the correct convention. You can safely ignore this warning.

If you want to suppress it, you can rename the file, but it's not necessary:

```bash
# Optional: Rename middleware to proxy (not recommended)
mv middleware.ts proxy.ts
```

## Build Process After Fixes:

Once you've run the commands above on the server, the build should complete successfully. The process will:

1. ✅ Skip ESLint checks (configuration removed)
2. ✅ Use correct lightningcss binary for Linux
3. ✅ Compile all pages including search, afrimation, etc. with Suspense boundaries
4. ✅ Generate optimized production build
