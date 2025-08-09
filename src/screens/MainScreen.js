import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import CategoryTabs from '../components/CategoryTabs';
import SearchBar from '../components/SearchBar';
import FilterToggles from '../components/FilterToggles';
import { sampleDishes } from '../data/sampleDishes';
import SummaryFooter from '../components/SummaryFooter';
import DishBottomModal from '../components/DishBottomModal';

const MEAL_TYPES = ['Starter', 'Main Course', 'Dessert', 'Sides'];
const PLACEHOLDER = require('../assets/icons/dish.png');

function normalizeMealType(raw) {
  if (!raw) return null;
  const s = String(raw).trim().toLowerCase();
  if (s.includes('main')) return 'Main Course';
  if (s.includes('starter')) return 'Starter';
  if (s.includes('dessert')) return 'Dessert';
  if (s.includes('side')) return 'Sides';
  return null;
}

function getTypeStr(item) {
  return (item?.type ?? '').toString().trim().toUpperCase();
}
function isNonVeg(item) {
  const t = getTypeStr(item);
  return /(^|[^A-Z])NON[\s_\-]*VEG($|[^A-Z])/.test(t) || t === 'NON';
}
function isVeg(item) {
  const t = getTypeStr(item);
  if (isNonVeg(item)) return false;
  return /\bVEG\b/.test(t) || /^VEG/.test(t);
}

function DishCard({ item, imageStyle, resizeMode = 'cover' }) {
  const [uri, setUri] = useState(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const candidate = item?.image || item?.category?.image || null;
    if (!candidate) {
      setUri(null);
      setLoading(false);
      setFailed(false);
      return;
    }
    let active = true;
    setFailed(false);
    setLoading(true);
    Image.prefetch(candidate)
      .then(() => {
        if (!active) return;
        setUri(candidate);
      })
      .catch(err => {
        console.warn('[DishCard] prefetch failed', candidate, err);
        if (!active) return;
        setUri(candidate);
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [item?.image, item?.category?.image]);

  if (!uri || failed) {
    return (
      <Image source={PLACEHOLDER} style={imageStyle} resizeMode={resizeMode} />
    );
  }

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      {loading ? <ActivityIndicator size="small" /> : null}
      <Image
        source={{ uri }}
        style={imageStyle}
        resizeMode={resizeMode}
        onError={e => {
          console.warn('[DishCard] onError', uri, e.nativeEvent);
          setFailed(true);
        }}
        onLoad={() => setLoading(false)}
      />
    </View>
  );
}

export default function MainScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState('Main Course');
  const [selectedMap, setSelectedMap] = useState({});
  const [selectedCounts, setSelectedCounts] = useState(() =>
    MEAL_TYPES.reduce((acc, m) => ({ ...acc, [m]: 0 }), {}),
  );
  const [expandedMap, setExpandedMap] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showVeg, setShowVeg] = useState(true);
  const [showNonVeg, setShowNonVeg] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);

  const openModal = useCallback(item => {
    setSelectedDish(item);
    setModalVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
    setSelectedDish(null);
  }, []);

  const categories = useMemo(
    () => MEAL_TYPES.map(m => ({ key: m, count: selectedCounts[m] || 0 })),
    [selectedCounts],
  );

  const filtered = useMemo(() => {
    const q = (searchQuery || '').trim().toLowerCase();
    return (sampleDishes || []).filter(d => {
      const mt = normalizeMealType(d.mealType);
      if (mt !== selectedCategory) return false;

      const itemIsVeg = isVeg(d);
      const itemIsNonVeg = isNonVeg(d);

      if (!showVeg && !showNonVeg) return false;
      if (showVeg && !showNonVeg && !itemIsVeg) return false;
      if (showNonVeg && !showVeg && !itemIsNonVeg) return false;

      if (!q) return true;
      const name = String(d.name || '').toLowerCase();
      const description = String(d.description || '').toLowerCase();
      const categoryName = String(d.category?.name || '').toLowerCase();
      return (
        name.includes(q) || description.includes(q) || categoryName.includes(q)
      );
    });
  }, [selectedCategory, searchQuery, showVeg, showNonVeg]);

  const onSelectCategory = useCallback(cat => setSelectedCategory(cat), []);

  const toggleAddRemoveSafe = useCallback(dish => {
    const id = dish.id?.toString?.() ?? String(Math.random());
    const mt = normalizeMealType(dish.mealType);
    setSelectedMap(prevMap => {
      const exists = !!prevMap[id];
      setSelectedCounts(prevCounts => ({
        ...prevCounts,
        [mt]: exists
          ? Math.max(0, (prevCounts[mt] || 0) - 1)
          : (prevCounts[mt] || 0) + 1,
      }));
      const next = { ...prevMap };
      if (exists) delete next[id];
      else next[id] = true;
      return next;
    });
  }, []);


  const renderItem = ({ item }) => {
    const id = item.id?.toString?.();
    const added = !!selectedMap[id];
    const expanded = !!expandedMap[id];

    return (
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={() => openModal(item)}
        style={styles.row}
      >
        <View style={styles.left}>
          <View style={styles.headerRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.title}>{item.name}</Text>
              <View
                style={[
                  styles.vegOuter,
                  {
                    borderColor:
                      item.type?.toUpperCase() === 'VEG'
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
                        item.type?.toUpperCase() === 'VEG'
                          ? '#539A64'
                          : '#E2574C',
                    },
                  ]}
                />
              </View>
            </View>
          </View>

          <Text style={styles.description} numberOfLines={expanded ? 10 : 2}>
            {item.description}
          </Text>

          {item.description && item.description.length > 30 ? (
            <TouchableOpacity onPress={() => openModal(item)}>
              <Text style={styles.readMore}>Read More</Text>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            style={styles.ingredientRow}
            onPress={() =>
              navigation.navigate('Ingredients', {
                dish: {
                  name: 'Fried Avocado Tacos',
                  description:
                    'Panco fried avocado, Mayo,Panco fried avocado, Mayo,Panco fried avocado, Mayo, ',
                  serves: 2,
                  image: require('../assets/icons/ing.png'),
                  ingredients: [
                    { name: 'Cauliflower', qty: '01 Pc' },
                    { name: 'Mustard oil', qty: '1/2 litres' },
                    { name: 'Cauliflower', qty: '01 Pc' },
                    { name: 'Tomato', qty: '01 Pc' },
                  ],
                },
              })
            }
          >
            <Image
              source={require('../assets/icons/Group.png')}
              style={{ width: 20, height: 15 }}
            />
            <Text style={styles.ingredientText}>Ingredient</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.right}>
          <DishCard
            item={item}
            imageStyle={styles.dishImage}
            resizeMode="cover"
          />
          <TouchableOpacity
            onPress={() => toggleAddRemoveSafe(item)}
            style={[
              styles.addButton,
              added ? styles.removeButton : styles.addButton,
            ]}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.addButtonText,
                added ? styles.removeButtonText : styles.addButtonText,
              ]}
            >
              {added ? 'Remove' : 'Add +'}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onBackPress={() => setSearchQuery('')}
      />
      <CategoryTabs
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
      />
      <FilterToggles
        showVeg={showVeg}
        showNonVeg={showNonVeg}
        onToggleVeg={() => setShowVeg(s => !s)}
        onToggleNonVeg={() => setShowNonVeg(s => !s)}
        mainCourseCount={selectedCounts[selectedCategory] || 0}
        selectedCategory={selectedCategory}
      />
      <View style={styles.cuisineHeader}>
        <Text style={styles.cuisineLabel}>
          {(() => {
            const names = Array.from(
              new Set(filtered.map(d => d.category?.name).filter(Boolean)),
            );
            if (names.length === 0) return '—';
            if (names.length === 1) return names[0];
            return 'Multiple Cuisines';
          })()}
        </Text>
        <Text style={styles.cuisineCount}>{filtered.length} items</Text>
      </View>
      <FlatList
        data={filtered}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        removeClippedSubviews={false}
        initialNumToRender={8}
        windowSize={9}
        maxToRenderPerBatch={10}
        keyboardDismissMode="on-drag"
      />
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <SummaryFooter
          counts={selectedCounts}
          total={Object.values(selectedCounts).reduce((a, b) => a + b, 0)}
          onContinue={() => {}}
        />
      </View>

      <DishBottomModal
        visible={modalVisible}
        dish={selectedDish}
        onClose={closeModal}
        onToggleAddRemove={d => {
          toggleAddRemoveSafe(d);
        }}
        added={!!selectedDish && !!selectedMap[String(selectedDish.id)]}
        onOpenIngredients={d => {
          closeModal();
          navigation.navigate('Ingredients', {
            dish: {
              name: 'Fried Avocado Tacos',
              description:
                'Panco fried avocado, Mayo,Panco fried avocado, Mayo,Panco fried avocado, Mayo, ',
              serves: 2,
              image: require('../assets/icons/ing.png'),
              ingredients: [
                { name: 'Cauliflower', qty: '01 Pc' },
                { name: 'Mustard oil', qty: '1/2 litres' },
                { name: 'Cauliflower', qty: '01 Pc' },
                { name: 'Tomato', qty: '01 Pc' },
              ],
            },
          });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  cuisineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  cuisineLabel: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1C',
    marginHorizontal: 10,
  },
  cuisineCount: { fontSize: 13, color: '#666' },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: 10,
    marginVertical: 2,
  },
  left: { flex: 1, paddingRight: 12 },
  right: { width: 110, alignItems: 'center' },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '700', color: '#111', marginRight: 6 },
  vegOuter: {
    width: 12,
    height: 12,
    borderWidth: 1.5,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    marginLeft: 6,
  },
  vegInner: { width: 6, height: 6, borderRadius: 3 },
  description: { marginTop: 6, fontSize: 14, color: '#666', lineHeight: 20 },
  readMore: { marginTop: 6, color: '#333', fontWeight: '700' },
  ingredientRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  ingredientText: { color: '#f59a45', fontWeight: '700', fontSize: 14 },
  dishImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: '#ddd',
  },
  addButton: {
    position: 'absolute',
    bottom: -10,
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  addButtonText: { color: '#2a9d6f', fontWeight: '700' },
  removeButton: { backgroundColor: '#fff', borderColor: 'transparent' },
  removeButtonText: { color: '#f59a45' },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#e6e6e6',
    marginVertical: 18,
    marginHorizontal: 8,
  },
});
