import React from 'react'
import { StyleSheet, Text, View } from 'react-native';

export const LoadingNotification = () => {
      return (
            <View style={styles.loading}>
                  <Text style={styles.loadingText}>Loading...</Text>
            </View>
      )
}

const styles = StyleSheet.create({
      loading: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 20,
            paddingBottom: 20
      },
      loadingText: {    
            fontSize: 20,
            fontWeight: 'bold',
            color: '#949FB7'
      }
})