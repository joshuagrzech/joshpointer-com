# LayeredWaveShader Component

A React Three.js component that renders a multi-layered wave shader effect with customizable colors and properties.

## Features

- **Multi-layered Waves**: Four different wave layers with unique parameters
- **Gradient Functions**: Smooth gradient transitions for realistic wave effects
- **Customizable Colors**: Four color parameters (primary, secondary, accent, background) that control the shader's color palette
- **Interactive**: Mouse interaction support for dynamic effects
- **Performance Optimized**: Efficient shader implementation with proper WebGL compatibility
- **Flexible Props**: Same interface as ShaderBackground with additional color customization

## Usage

### Basic Usage

```tsx
import LayeredWaveShader from '@/components/three/LayeredWaveShader';

// Basic usage with default colors
<LayeredWaveShader />

// With custom colors
<LayeredWaveShader
  primaryColor="#1A4B8C"   // Deep blue
  secondaryColor="#19A7CE" // Light blue
  accentColor="#FFFFFF"    // White
  backgroundColor="#0D1B2A" // Dark blue
  speed={0.1}
  intensity={1.2}
  interactive={true}
/>
```

### Using the Demo Component

```tsx
import LayeredWaveShaderDemo from '@/components/three/LayeredWaveShaderDemo';

// Use predefined presets
<LayeredWaveShaderDemo preset="ocean" />
<LayeredWaveShaderDemo preset="sunset" />
<LayeredWaveShaderDemo preset="aurora" />
<LayeredWaveShaderDemo preset="coral" />
<LayeredWaveShaderDemo preset="deep" />

// Custom colors
<LayeredWaveShaderDemo
  preset="custom"
  customColors={{
    primaryColor: "#FF0000",
    secondaryColor: "#00FF00",
    accentColor: "#0000FF",
    backgroundColor: "#000000"
  }}
/>
```

## Props

| Prop                   | Type                        | Default         | Description                           |
| ---------------------- | --------------------------- | --------------- | ------------------------------------- |
| `shader`               | `'layeredwave' \| 'custom'` | `'layeredwave'` | Shader type to use                    |
| `customVertexShader`   | `string`                    | `undefined`     | Custom vertex shader code             |
| `customFragmentShader` | `string`                    | `undefined`     | Custom fragment shader code           |
| `uniforms`             | `Record<string, any>`       | `{}`            | Additional uniforms to pass to shader |
| `resolution`           | `number`                    | `1024`          | Shader resolution                     |
| `intensity`            | `number`                    | `1.0`           | Shader intensity multiplier           |
| `speed`                | `number`                    | `1.0`           | Animation speed multiplier            |
| `interactive`          | `boolean`                   | `true`          | Enable mouse interaction              |
| `primaryColor`         | `THREE.Color \| string`     | `'#1A4B8C'`     | Primary wave color                    |
| `secondaryColor`       | `THREE.Color \| string`     | `'#19A7CE'`     | Secondary wave color                  |
| `accentColor`          | `THREE.Color \| string`     | `'#FFFFFF'`     | Accent color for highlights           |
| `backgroundColor`      | `THREE.Color \| string`     | `'#0D1B2A'`     | Background color                      |

## Color Parameters

The shader uses a four-color system for creating rich layered wave effects:

- **primaryColor**: Main wave color for the background gradient
- **secondaryColor**: Secondary color for mouse interaction effects
- **accentColor**: Highlight color for wave peaks and intensity
- **backgroundColor**: Base background color for the gradient

The colors are blended based on the wave intensity and mouse interaction.

## Shader Details

The shader implements a multi-layered wave effect with:

- **Four Wave Layers**: Each with unique frequency, amplitude, and phase parameters
- **Gradient Functions**: Smooth transitions between color values
- **Spatial Blending**: Waves are combined to create complex patterns
- **Mouse Interaction**: Dynamic effects based on mouse position
- **Time-based Animation**: Continuous wave movement and evolution

### Wave Layer Parameters

Each wave layer has different characteristics:

- **Wave 1**: High frequency, moderate amplitude
- **Wave 2**: Medium frequency, high amplitude
- **Wave 3**: Medium-high frequency, moderate amplitude
- **Wave 4**: High frequency, high amplitude

## Performance Considerations

- Uses `AdditiveBlending` for better visual effects
- Implements proper depth testing and writing
- Optimized for WebGL compatibility
- Supports both desktop and mobile rendering

## Examples

### Ocean Theme

```tsx
<LayeredWaveShader
  primaryColor="#1A4B8C"
  secondaryColor="#19A7CE"
  accentColor="#FFFFFF"
  backgroundColor="#0D1B2A"
  speed={0.1}
  intensity={1.0}
/>
```

### Sunset Theme

```tsx
<LayeredWaveShader
  primaryColor="#FF6B35"
  secondaryColor="#F7931E"
  accentColor="#FFD93D"
  backgroundColor="#2C1810"
  speed={0.15}
  intensity={1.2}
/>
```

### Aurora Theme

```tsx
<LayeredWaveShader
  primaryColor="#00FF7F"
  secondaryColor="#40E0D0"
  accentColor="#9370DB"
  backgroundColor="#0A1A2A"
  speed={0.12}
  intensity={1.1}
/>
```

### Coral Theme

```tsx
<LayeredWaveShader
  primaryColor="#FF6B6B"
  secondaryColor="#FF8E8E"
  accentColor="#FFE5E5"
  backgroundColor="#2A0A0A"
  speed={0.08}
  intensity={0.9}
/>
```

### Deep Theme

```tsx
<LayeredWaveShader
  primaryColor="#2C3E50"
  secondaryColor="#34495E"
  accentColor="#ECF0F1"
  backgroundColor="#0A0A0A"
  speed={0.05}
  intensity={0.8}
/>
```

## Integration with Existing Code

The component follows the same pattern as `ShaderBackground` and can be used as a drop-in replacement:

```tsx
// Replace ShaderBackground with LayeredWaveShader
<ShaderBackground shader="waves" />

// Becomes:
<LayeredWaveShader
  primaryColor="#1A4B8C"
  secondaryColor="#19A7CE"
  accentColor="#FFFFFF"
  backgroundColor="#0D1B2A"
/>
```

## Shader Algorithm

The shader creates layered waves through:

1. **Gradient Function**: Smooth transitions between wave values
2. **Wave Generation**: Four different wave functions with unique parameters
3. **Layer Combination**: All waves are added together for complex patterns
4. **Color Blending**: Background gradient mixed with wave highlights
5. **Mouse Interaction**: Dynamic effects based on mouse position

The result is a sophisticated multi-layered wave effect that creates realistic ocean-like animations with customizable colors and smooth transitions.
