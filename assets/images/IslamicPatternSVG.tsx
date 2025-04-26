import { View, StyleSheet } from "react-native"
import Svg, { Path, G, Defs, ClipPath, Rect } from "react-native-svg"

const IslamicPatternSVG = () => {
  return (
    <View style={styles.container}>
      <Svg width="100%" height="100%" viewBox="0 0 400 200">
        <Defs>
          <ClipPath id="clip">
            <Rect width="400" height="200" />
          </ClipPath>
        </Defs>
        <G clipPath="url(#clip)">
          {/* Geometric Islamic Pattern */}
          <Path d="M0,0 L40,0 L20,34.64 z" fill="#FFFFFF" opacity="0.1" transform="translate(0, 0)" />
          <Path d="M40,0 L80,0 L60,34.64 L20,34.64 z" fill="#FFFFFF" opacity="0.15" transform="translate(0, 0)" />
          <Path d="M80,0 L120,0 L100,34.64 L60,34.64 z" fill="#FFFFFF" opacity="0.1" transform="translate(0, 0)" />
          <Path d="M120,0 L160,0 L140,34.64 L100,34.64 z" fill="#FFFFFF" opacity="0.15" transform="translate(0, 0)" />
          <Path d="M160,0 L200,0 L180,34.64 L140,34.64 z" fill="#FFFFFF" opacity="0.1" transform="translate(0, 0)" />
          <Path d="M200,0 L240,0 L220,34.64 L180,34.64 z" fill="#FFFFFF" opacity="0.15" transform="translate(0, 0)" />
          <Path d="M240,0 L280,0 L260,34.64 L220,34.64 z" fill="#FFFFFF" opacity="0.1" transform="translate(0, 0)" />
          <Path d="M280,0 L320,0 L300,34.64 L260,34.64 z" fill="#FFFFFF" opacity="0.15" transform="translate(0, 0)" />
          <Path d="M320,0 L360,0 L340,34.64 L300,34.64 z" fill="#FFFFFF" opacity="0.1" transform="translate(0, 0)" />
          <Path d="M360,0 L400,0 L380,34.64 L340,34.64 z" fill="#FFFFFF" opacity="0.15" transform="translate(0, 0)" />

          {/* Second row (offset) */}
          <Path
            d="M20,34.64 L60,34.64 L40,69.28 L0,69.28 z"
            fill="#FFFFFF"
            opacity="0.15"
            transform="translate(-20, 0)"
          />
          <Path
            d="M60,34.64 L100,34.64 L80,69.28 L40,69.28 z"
            fill="#FFFFFF"
            opacity="0.1"
            transform="translate(-20, 0)"
          />
          <Path
            d="M100,34.64 L140,34.64 L120,69.28 L80,69.28 z"
            fill="#FFFFFF"
            opacity="0.15"
            transform="translate(-20, 0)"
          />
          <Path
            d="M140,34.64 L180,34.64 L160,69.28 L120,69.28 z"
            fill="#FFFFFF"
            opacity="0.1"
            transform="translate(-20, 0)"
          />
          <Path
            d="M180,34.64 L220,34.64 L200,69.28 L160,69.28 z"
            fill="#FFFFFF"
            opacity="0.15"
            transform="translate(-20, 0)"
          />
          <Path
            d="M220,34.64 L260,34.64 L240,69.28 L200,69.28 z"
            fill="#FFFFFF"
            opacity="0.1"
            transform="translate(-20, 0)"
          />
          <Path
            d="M260,34.64 L300,34.64 L280,69.28 L240,69.28 z"
            fill="#FFFFFF"
            opacity="0.15"
            transform="translate(-20, 0)"
          />
          <Path
            d="M300,34.64 L340,34.64 L320,69.28 L280,69.28 z"
            fill="#FFFFFF"
            opacity="0.1"
            transform="translate(-20, 0)"
          />
          <Path
            d="M340,34.64 L380,34.64 L360,69.28 L320,69.28 z"
            fill="#FFFFFF"
            opacity="0.15"
            transform="translate(-20, 0)"
          />
          <Path
            d="M380,34.64 L420,34.64 L400,69.28 L360,69.28 z"
            fill="#FFFFFF"
            opacity="0.1"
            transform="translate(-20, 0)"
          />

          {/* Repeat pattern for more rows */}
          {/* Third row */}
          <Path d="M0,69.28 L40,69.28 L20,103.92 z" fill="#FFFFFF" opacity="0.1" transform="translate(0, 0)" />
          <Path
            d="M40,69.28 L80,69.28 L60,103.92 L20,103.92 z"
            fill="#FFFFFF"
            opacity="0.15"
            transform="translate(0, 0)"
          />
          <Path
            d="M80,69.28 L120,69.28 L100,103.92 L60,103.92 z"
            fill="#FFFFFF"
            opacity="0.1"
            transform="translate(0, 0)"
          />
          <Path
            d="M120,69.28 L160,69.28 L140,103.92 L100,103.92 z"
            fill="#FFFFFF"
            opacity="0.15"
            transform="translate(0, 0)"
          />
          <Path
            d="M160,69.28 L200,69.28 L180,103.92 L140,103.92 z"
            fill="#FFFFFF"
            opacity="0.1"
            transform="translate(0, 0)"
          />
          <Path
            d="M200,69.28 L240,69.28 L220,103.92 L180,103.92 z"
            fill="#FFFFFF"
            opacity="0.15"
            transform="translate(0, 0)"
          />
          <Path
            d="M240,69.28 L280,69.28 L260,103.92 L220,103.92 z"
            fill="#FFFFFF"
            opacity="0.1"
            transform="translate(0, 0)"
          />
          <Path
            d="M280,69.28 L320,69.28 L300,103.92 L260,103.92 z"
            fill="#FFFFFF"
            opacity="0.15"
            transform="translate(0, 0)"
          />
          <Path
            d="M320,69.28 L360,69.28 L340,103.92 L300,103.92 z"
            fill="#FFFFFF"
            opacity="0.1"
            transform="translate(0, 0)"
          />
          <Path
            d="M360,69.28 L400,69.28 L380,103.92 L340,103.92 z"
            fill="#FFFFFF"
            opacity="0.15"
            transform="translate(0, 0)"
          />

          {/* Fourth row (offset) */}
          <Path
            d="M20,103.92 L60,103.92 L40,138.56 L0,138.56 z"
            fill="#FFFFFF"
            opacity="0.15"
            transform="translate(-20, 0)"
          />
          <Path
            d="M60,103.92 L100,103.92 L80,138.56 L40,138.56 z"
            fill="#FFFFFF"
            opacity="0.1"
            transform="translate(-20, 0)"
          />
          <Path
            d="M100,103.92 L140,103.92 L120,138.56 L80,138.56 z"
            fill="#FFFFFF"
            opacity="0.15"
            transform="translate(-20, 0)"
          />
          <Path
            d="M140,103.92 L180,103.92 L160,138.56 L120,138.56 z"
            fill="#FFFFFF"
            opacity="0.1"
            transform="translate(-20, 0)"
          />
          <Path
            d="M180,103.92 L220,103.92 L200,138.56 L160,138.56 z"
            fill="#FFFFFF"
            opacity="0.15"
            transform="translate(-20, 0)"
          />
          <Path
            d="M220,103.92 L260,103.92 L240,138.56 L200,138.56 z"
            fill="#FFFFFF"
            opacity="0.1"
            transform="translate(-20, 0)"
          />
          <Path
            d="M260,103.92 L300,103.92 L280,138.56 L240,138.56 z"
            fill="#FFFFFF"
            opacity="0.15"
            transform="translate(-20, 0)"
          />
          <Path
            d="M300,103.92 L340,103.92 L320,138.56 L280,138.56 z"
            fill="#FFFFFF"
            opacity="0.1"
            transform="translate(-20, 0)"
          />
          <Path
            d="M340,103.92 L380,103.92 L360,138.56 L320,138.56 z"
            fill="#FFFFFF"
            opacity="0.15"
            transform="translate(-20, 0)"
          />
          <Path
            d="M380,103.92 L420,103.92 L400,138.56 L360,138.56 z"
            fill="#FFFFFF"
            opacity="0.1"
            transform="translate(-20, 0)"
          />
        </G>
      </Svg>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
})

export default IslamicPatternSVG
