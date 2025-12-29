import React, {useContext, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {PurchasesContext} from '../context/PurchasesContext/purchasesContext';
import {AuthContext} from '../context/authContext/authContext';
import ButtonGoBack from '../components/ButtonGoBack';
import LogoSofy from '../components/LogoSofy';
import {colors} from '../theme/globalTheme';

export default function SeeStateMyProducts({navigation}: any) {
  const {amountOfCompliments, amountOfSuperLikes, consume, getBalanceProducts} =
    useContext(PurchasesContext);
  const {idUserForChats} = useContext(AuthContext);

  useEffect(() => {
    if (idUserForChats) {
      getBalanceProducts(idUserForChats);
    }
  }, [idUserForChats]);

  const handleConsume = async (field: 'compliments' | 'superlike') => {
    if (!idUserForChats) {
      Alert.alert('Error', 'User not identified');
      return;
    }

    try {
      const response = await consume(idUserForChats, field);
      Alert.alert('Success', response.message);
    } catch (error: any) {
      const errorMessage = error.error?.message || error.message || 'Error';
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ButtonGoBack navigation={navigation} />
        <LogoSofy />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>My Products</Text>

        <View style={styles.itemContainer}>
          <Text style={styles.itemTitle}>Compliments</Text>
          <Text style={styles.itemCount}>{amountOfCompliments}</Text>
          <TouchableOpacity
            style={styles.consumeButton}
            onPress={() => handleConsume('compliments')}>
            <Text style={styles.consumeButtonText}>-</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.itemContainer}>
          <Text style={styles.itemTitle}>Super Likes</Text>
          <Text style={styles.itemCount}>{amountOfSuperLikes}</Text>
          <TouchableOpacity
            style={styles.consumeButton}
            onPress={() => handleConsume('superlikes')}>
            <Text style={styles.consumeButtonText}>-</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 40,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: colors.backgroundSecondary,
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  itemCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginRight: 20,
  },
  consumeButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  consumeButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 26,
  },
});
