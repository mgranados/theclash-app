import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar, TouchableOpacity } from 'react-native';

const getCategory = (category) => {
    switch(category){
        case 'CREDIT_CARD':
            return "Tarjeta de credito"
            break;
          case 'LOAN_ACCOUNT':
            return "Préstamo"
            break;
          case 'CHECKING_ACCOUNT':
            return "Cheques"
            break;
          default:
            return "Sin categoria"
    }
}

const getEmoji = (category) => {
    switch(category){
        case 'CREDIT_CARD':
            return "💳"
            break;
          case 'LOAN_ACCOUNT':
            return "🏦"
            break;
          case 'CHECKING_ACCOUNT':
            return "💰"
            break;
          default:
            return ""
    }
}

const Item = ({ title, category, number }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{getEmoji(category)}{' '}{title}</Text>
    <Text style={styles.subtitle}>{getCategory(category)}</Text>
    <Text style={styles.subtitle}>{number}</Text>
  </View>
);

const AccountsList = ({navigation}) => {
    const [accountsData, setAccountsData] = useState([]);
    const [isLoading, setLoading] = useState(true);

    const getAccounts = async () => {
        try {
         const response = await fetch('http://127.0.0.1:5000/accounts');
         const json = await response.json();
         setAccountsData(json.accounts);
       } catch (error) {
         console.error(error);
       } finally {
         setLoading(false);
       }
     }
     useEffect(() => {
        getAccounts();
      }, []);
    
    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => {
                navigation.navigate('Transactions', { account_id: item.id, number: item.number })
            }}
        >
            <Item title={item.name} category={item.category} number={item.number} />
        </TouchableOpacity>
    );

    return (
    <SafeAreaView style={styles.container}>
        {isLoading ? <ActivityIndicator/> : (
            <FlatList
                data={accountsData}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
        )}
    </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 30,
  },
  item: {
    backgroundColor: '#66D7EB',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
  subtitle: {
      fontSize: 14,
  }
});

export default AccountsList