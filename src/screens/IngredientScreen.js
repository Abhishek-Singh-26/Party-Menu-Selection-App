import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

export default function IngredientScreen({ route, navigation }) {
  const { dish } = route.params;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.dishRow}>
        <View style={styles.dishTextContainer}>
          <Text style={styles.dishName} numberOfLines={1}>
            {dish.name}
          </Text>
          <Text style={styles.dishDesc} numberOfLines={3}>
            {dish.description}
          </Text>
        </View>

        <Image
          source={dish.image}
          style={styles.dishImage}
          resizeMode="contain"
        />
      </View>

      {/* Ingredients */}
      <Text style={styles.sectionTitle}>Ingredients</Text>
      <Text style={styles.subText}>For {dish.serves} people</Text>
      <View style={styles.separator} />

      {dish.ingredients.map((item, index) => (
        <View style={styles.ingredientRow} key={index}>
          <Text style={styles.ingredientName}>{item.name}</Text>
          <Text style={styles.ingredientQty}>{item.qty}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 30,
  },

  dishRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  dishTextContainer: {
    flex: 1.2,
    paddingRight: 20,
    paddingVertical: 8,
    minWidth: 190,
    marginTop: 34,
  },
  dishName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  dishDesc: {
    fontSize: 16,
    color: '#555',
    lineHeight: 25,
  },

  dishImage: {
    width: 220,
    height: 200,
    marginLeft: 12,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: -22,
    marginBottom: 6,
  },
  subText: {
    fontSize: 17,
    color: '#555',
    marginBottom: 6,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 8,
  },
  ingredientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  ingredientName: {
    fontSize: 15,
    color: '#222',
  },
  ingredientQty: {
    fontSize: 15,
    color: '#222',
  },
});
