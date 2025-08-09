import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from './src/screens/MainScreen';
import IngredientScreen from './src/screens/IngredientScreen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  View,
  Platform,
  StatusBar,
} from 'react-native';

const Stack = createNativeStackNavigator();

function CustomHeader({ navigation }) {
  const statusBarHeight =
    Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.customHeader, { paddingTop: statusBarHeight }]}
    >
      <View style={styles.headerContent}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.leftTouch}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Image
            source={require('./src/assets/icons/back.png')}
            style={styles.backIcon}
          />
          <Text style={styles.title}>Ingredient List</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Menu"
            component={MainScreen}
            options={{ title: 'Party Menu' }}
          />

          <Stack.Screen
            name="Ingredients"
            component={IngredientScreen}
            options={({ navigation }) => ({
              header: () => <CustomHeader navigation={navigation} />,
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  customHeader: {
    backgroundColor: '#fff',
    borderBottomWidth: 0,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,

    zIndex: 10,
  },

  headerContent: {
    height: 56,
    justifyContent: 'center',
  },

  leftTouch: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },

  backIcon: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
  },

  title: {
    fontFamily: 'Open Sans',
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 8,
    color: '#000',
  },
});

export default App;
