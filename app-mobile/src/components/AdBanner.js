import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { IDS_ADMOB } from '../config/constantes';
import { useAppStore } from '../store/useAppStore';
import { TEMAS } from '../config/constantes';

const adUnitId = __DEV__ 
  ? TestIds.ADAPTIVE_BANNER 
  : Platform.OS === 'android' 
    ? IDS_ADMOB.android.banner
    : IDS_ADMOB.ios.banner;

export default function AdBanner() {
  const { theme } = useAppStore();
  const colors = TEMAS[theme] || TEMAS.claro;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 8,
  },
});
