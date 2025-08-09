// src/components/FilterToggles.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ToggleSwitch from './ToggleSwitch';

export default function FilterToggles({
  showVeg,
  showNonVeg,
  onToggleVeg,
  onToggleNonVeg,
  mainCourseCount = 0,
  selectedCategory = '',
  toggleSize = { width: 52, height: 32, knobSize: 28 },
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {`${selectedCategory} Selected (${
          typeof mainCourseCount === 'number' ? mainCourseCount : 0
        })`}
      </Text>

      <View style={styles.toggleGroup}>
        <View style={styles.toggleItem}>
          <ToggleSwitch
            value={showVeg}
            onToggle={onToggleVeg}
            color="#539A64"
            width={toggleSize.width}
            height={toggleSize.height}
            knobSize={toggleSize.knobSize}
          />
        </View>

        <View style={styles.toggleItem}>
          <ToggleSwitch
            value={showNonVeg}
            onToggle={onToggleNonVeg}
            color="#E2574C"
            width={toggleSize.width}
            height={toggleSize.height}
            knobSize={toggleSize.knobSize}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginTop: 8,
    marginBottom: 6,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    marginLeft: 6,
  },
  toggleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleItem: {
    marginHorizontal: 4,
  },
});
