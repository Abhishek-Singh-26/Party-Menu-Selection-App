import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function CategoryTabs({
  categories = [],
  selectedCategory,
  onSelectCategory,
}) {
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        {categories.map(({ key, count }) => {
          const active = selectedCategory === key;
          return (
            <TouchableOpacity
              key={key}
              onPress={() => onSelectCategory(key)}
              style={[styles.tab, active && styles.tabActive]}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[styles.label, active && styles.labelActive]}
              >
                {`${key} ${typeof count === 'number' ? count : 0}`}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: 10,
    paddingHorizontal: 6,
    backgroundColor: 'transparent',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tab: {
    marginHorizontal: 4,
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#bdbdbd',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '40%',
  },
  tabActive: {
    backgroundColor: '#f59a45',
    borderColor: '#f59a45',
  },
  label: {
    fontSize: 13,
    color: '#333',
    fontWeight: '700',
    textAlign: 'center',
    flexShrink: 1,
  },
  labelActive: {
    color: '#fff',
  },
});
