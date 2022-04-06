import React, { useEffect, useState }  from 'react';
import { ActivityIndicator, SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar } from 'react-native';

const Item = ({ title, status, amount_in_cents, currency, category }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.subtitle}>{status}</Text>
    <Text style={styles.amount}>{getPlusOrLess(category)} ${amount_in_cents / 100} {currency}</Text>
  </View>
);

const getPlusOrLess = (category) => {
    if (category === "Income & Payments") {
        return "+"
    }
    return "-"
}

const TransactionsList = ({ route }) => {
    const [transactionsData, setTransactionsData] = useState([]);
    const [isLoading, setLoading] = useState(true);

    const getTransactions = async () => {
        try {
         const response = await fetch('http://127.0.0.1:5000/transactions');
         const json = await response.json();
         setTransactionsData(json.transactions.filter(txn => txn.account_id === route.params.account_id));
       } catch (error) {
         console.error(error);
       } finally {
         setLoading(false);
       }
     }
     useEffect(() => {
        getTransactions();
      }, []);
    
    const renderItem = ({ item }) => (
        <Item title={item.description.toLowerCase()} category={item.category} status={item.status} amount_in_cents={item.amount_in_cents} currency={item.currency} />
    );

    return (
    <SafeAreaView style={styles.container}>
        {isLoading ? <ActivityIndicator/> : (
            <>
                <Text style={styles.viewTitle}>{route.params.number} ({transactionsData.length})</Text>
                <FlatList
                    title={route.params.number}
                    data={transactionsData}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                />
            </>
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
    backgroundColor: '#00b2ca',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 17,
  },
  subtitle: {
      fontSize: 14,
  },
  viewTitle: {
      fontSize: 30,
      padding: 20,
  }
});

export default TransactionsList