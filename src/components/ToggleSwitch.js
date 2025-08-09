// src/components/ToggleSwitch.js
import React, { useRef, useEffect } from 'react';
import {
  Animated,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
} from 'react-native';

export default function ToggleSwitch({
  value = false,
  onToggle = () => {},
  color = '#1D9D3A',
  width = 44,
  height = 28,
  knobSize = 28,
}) {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [value, anim]);

  const maxTranslate = width - knobSize;
  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [maxTranslate, 0],
  });
  const trackBg = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(0,0,0,0.06)', hexWithAlpha(color, 0.12)],
  });
  const knobBorder = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#d0d0d0', color],
  });
  const dotScale = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1],
  });
  const dotOpacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 1],
  });

  return (
    <TouchableWithoutFeedback
      onPress={onToggle}
      accessible
      accessibilityRole="button"
      accessibilityState={{ selected: value }}
    >
      <Animated.View
        style={[
          styles.track,
          {
            width,
            height,
            borderRadius: height / 2,
            backgroundColor: trackBg,
            padding: 2,
          },
        ]}
      >
        <Animated.View
          style={{
            width: knobSize,
            height: knobSize,
            transform: [{ translateX }],
          }}
        >
          <Animated.View
            style={[
              styles.knob,
              {
                width: knobSize,
                height: knobSize,
                borderRadius: Math.max(6, knobSize * 0.18),
                borderColor: knobBorder,
                borderWidth: 3,
                backgroundColor: '#fff',
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOpacity: 0.08,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 2 },
                elevation: 2,
              },
            ]}
          >
            <Animated.View
              style={{
                width: Math.floor(knobSize * 0.44),
                height: Math.floor(knobSize * 0.44),
                borderRadius: Math.floor((knobSize * 0.44) / 2),
                backgroundColor: color,
                transform: [{ scale: dotScale }],
                opacity: dotOpacity,
              }}
            />
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

function hexWithAlpha(hex, alpha = 0.12) {
  if (!hex) return `rgba(0,0,0,${alpha})`;
  if (hex.startsWith('#') && hex.length === 7) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }
  return hex;
}

const styles = StyleSheet.create({
  track: { justifyContent: 'center' },
  knob: {},
});
