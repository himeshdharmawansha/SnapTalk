import React from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function LoadingScreen() {
  const spinValue = new Animated.Value(0);

  React.useEffect(() => {
    const spin = () => {
      spinValue.setValue(0);
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => spin());
    };
    spin();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Animated.View style={[styles.logoIcon, { transform: [{ rotate: spin }] }]}>
          <Icon name="chat" size={50} color="#6366F1" />
        </Animated.View>
        <Text style={styles.logoText}>SnapTalk</Text>
        <Text style={styles.logoSubtext}>Connecting...</Text>
      </View>
      
      <View style={styles.loadingContainer}>
        <View style={styles.loadingDots}>
          <View style={[styles.dot, styles.dot1]} />
          <View style={[styles.dot, styles.dot2]} />
          <View style={[styles.dot, styles.dot3]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1220',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  
  logoIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#6366F1',
    shadowOpacity: 0.4,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  
  logoText: {
    color: '#F3F4F6',
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 12,
  },
  
  logoSubtext: {
    color: '#9CA3AF',
    fontSize: 18,
    fontWeight: '500',
    letterSpacing: 1,
  },
  
  loadingContainer: {
    alignItems: 'center',
  },
  
  loadingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#6366F1',
    marginHorizontal: 4,
  },
  
  dot1: {
    animationDelay: '0s',
  },
  
  dot2: {
    animationDelay: '0.2s',
  },
  
  dot3: {
    animationDelay: '0.4s',
  },
});
