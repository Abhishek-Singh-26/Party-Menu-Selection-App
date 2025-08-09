// src/components/SearchBar.js
import React from 'react';
import {
  View,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export default function SearchBar({ value, onChangeText, onBackPress }) {
  return (
    <View style={styles.searchContainer}>
      <TouchableOpacity
        onPress={onBackPress}
        style={styles.leftIconWrap}
        activeOpacity={0.7}
      >
        <Image
          source={require('../assets/icons/back.png')}
          style={styles.icon}
        />
      </TouchableOpacity>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search dish for your party......"
        style={styles.searchInput}
        autoCorrect={false}
        clearButtonMode="while-editing"
        returnKeyType="search"
      />

      <View style={styles.rightIconWrap}>
        <Image
          source={require('../assets/icons/search.png')}
          style={styles.searchIcon}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    marginHorizontal: 12,
    marginTop: 10,
    marginBottom: 8,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#d0d0d0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    elevation: 0,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  leftIconWrap: {
    padding: 6,
  },
  rightIconWrap: {
    padding: 6,
  },
  icon: {
    width: 14,
    height: 14,
    tintColor: '#1C1C1C',
    resizeMode: 'contain',
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: '#0E0D0D',
    resizeMode: 'contain',
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 8,
    fontSize: 16,
    color: '#333',
    paddingVertical: 6,
  },
});
