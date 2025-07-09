# Development Guide

## Hot Reloading Issues

If you're experiencing issues where changes don't appear without clearing cache and hard reloading, here are the solutions:

### Quick Fixes

1. **Use the clean development script:**
   ```bash
   yarn dev:clean
   # or
   npm run dev:clean
   ```

2. **Use the fast development mode:**
   ```bash
   yarn dev:fast
   # or
   npm run dev:fast
   ```

3. **Run the helper script:**
   ```bash
   ./scripts/dev-helper.sh
   ```

### Manual Cache Clearing

If the above doesn't work, manually clear caches:

```bash
# Clear Next.js cache
rm -rf .next

# Clear browser cache (in browser dev tools)
# Press Ctrl+Shift+R (Cmd+Shift+R on Mac) for hard reload

# Clear node_modules cache (if needed)
rm -rf node_modules/.cache
```

### Browser-Specific Solutions

#### Chrome/Edge
1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

#### Firefox
1. Open DevTools (F12)
2. Go to Network tab
3. Check "Disable cache" checkbox
4. Hard refresh (Ctrl+Shift+R)

#### Safari
1. Open DevTools
2. Go to Network tab
3. Check "Disable caches" checkbox
4. Hard refresh (Cmd+Option+R)

### Why This Happens

The issues you're experiencing are caused by:

1. **Aggressive Caching**: The original configuration had very aggressive cache headers
2. **Three.js WebGL Context**: React Three Fiber maintains WebGL contexts that don't always update properly
3. **Dynamic Imports**: Components using `ssr: false` can cause hydration issues
4. **Shader Compilation**: WebGL shaders are compiled and cached by the browser

### Configuration Changes Made

The following changes have been implemented to improve hot reloading:

1. **Development-specific cache headers** in `next.config.mjs`
2. **Development configuration** in `src/lib/dev-config.ts`
3. **Force re-rendering** in development mode
4. **WebGL context optimization** for development
5. **Performance settings** optimized for development

### Best Practices

1. **Use the development scripts** provided above
2. **Keep browser dev tools open** with cache disabled during development
3. **Use the Network tab** to monitor cache behavior
4. **Restart the dev server** if changes still don't appear

### Troubleshooting

If you're still having issues:

1. Check the browser console for WebGL errors
2. Verify that the development configuration is being applied
3. Try a different browser
4. Clear all browser data for the development domain
5. Restart your development environment

### Production vs Development

The configuration automatically switches between development and production settings:

- **Development**: No caching, lower performance settings, debug logging
- **Production**: Full caching, optimized performance, no debug logging

This ensures optimal performance in production while maintaining good development experience. 