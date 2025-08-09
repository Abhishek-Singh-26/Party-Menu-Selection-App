// src/components/DishBottomModal.js
import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';

const SCREEN = Dimensions.get('window');
const PLACEHOLDER = require('../assets/icons/modalImage.png');

export default function DishBottomModal({
  visible,
  dish,
  onClose,
  onToggleAddRemove,
  added,
  onOpenIngredients,
}) {
  if (!dish) return null;

  const imageSource = dish.image
    ? typeof dish.image === 'string'
      ? { uri: dish.image }
      : dish.image
    : PLACEHOLDER;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      {/* Bottom sheet container */}
      <View style={styles.container}>
        <View style={styles.handleWrap}>
          <View style={styles.handle} />
        </View>

        <ScrollView
          style={styles.sheet}
          contentContainerStyle={{ paddingBottom: 36 }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              paddingHorizontal: 20,
              borderRadius: 20,
              overflow: 'hidden',
            }}
          >
            <Image
              source={imageSource}
              style={{
                width: '100%',
                height: SCREEN.height * 0.22,
                borderRadius: 20,
                // no padding here — let the container handle it
              }}
              resizeMode="cover"
            />
          </View>

          <View style={styles.content}>
            <View style={styles.titleRow}>
              <View style={{ flex: 1 }}>
                <View style={styles.titleAndBadge}>
                  <Text style={styles.title}>{dish.name}</Text>
                  <View
                    style={[
                      styles.vegOuter,
                      {
                        borderColor:
                          (dish.type || '').toUpperCase() === 'VEG'
                            ? '#539A64'
                            : '#E2574C',
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.vegInner,
                        {
                          backgroundColor:
                            (dish.type || '').toUpperCase() === 'VEG'
                              ? '#539A64'
                              : '#E2574C',
                        },
                      ]}
                    />
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  added && styles.actionButtonActive,
                ]}
                onPress={() => onToggleAddRemove && onToggleAddRemove(dish)}
                activeOpacity={0.85}
              >
                <Text
                  style={[styles.actionText, added && styles.actionTextActive]}
                >
                  {added ? 'Remove' : 'Add +'}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.description}>
              <Text style={styles.subtitle}>
                {dish.category?.name ?? '—'}{' '}
                {dish.serves ? `Serves ${dish.serves}` : ''}
              </Text>
              {dish.description || 'No description available.'}
            </Text>

            <TouchableOpacity
              style={styles.ingredientRow}
              onPress={() => onOpenIngredients && onOpenIngredients(dish)}
            >
              <Image
                source={require('../assets/icons/bottom.png')}
                style={{ width: 22, height: 18, marginRight: 8 }}
              />
              <Text style={styles.ingredientText}>Ingredient</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: '#00000066',
  },

  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: SCREEN.height * 0.92,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },

  handleWrap: {
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: 'transparent',
  },
  handle: {
    width: 48,
    height: 4,
    borderRadius: 3,
    backgroundColor: '#ddd',
  },

  sheet: {
    backgroundColor: 'transparent',
  },

  topImage: {
    width: '100%',
    height: SCREEN.height * 0.22,
    paddingHorizontal: 20,
    borderRadius: 18,
  },

  content: {
    padding: 18,
    backgroundColor: '#fff',
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  titleAndBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: { fontSize: 22, fontWeight: '800', color: '#111', marginRight: 8 },
  subtitle: { fontSize: 17, color: '#1C1C1C', fontWeight: 700 },
  vegOuter: {
    width: 14,
    height: 14,
    borderWidth: 1.2,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
  },
  vegInner: { width: 7, height: 7, borderRadius: 3 },
  actionButton: {
    marginLeft: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    alignSelf: 'flex-start',
  },
  actionButtonActive: {
    backgroundColor: '#fff',
  },
  actionText: { color: '#73AE78', fontWeight: '800' },
  actionTextActive: { color: '#FF941A' },
  description: {
    marginTop: 6,
    color: '#666',
    lineHeight: 20,
    fontSize: 15,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },
  ingredientText: { color: '#f59a45', fontWeight: '700', fontSize: 16 },
});
