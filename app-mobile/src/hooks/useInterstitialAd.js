import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';
import { IDS_ADMOB, CONFIGURACION } from '../config/constantes';

const adUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : Platform.OS === 'android'
    ? IDS_ADMOB.android.intersticial
    : IDS_ADMOB.ios.intersticial;

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: false,
});

export default function useInterstitialAd() {
  const [loaded, setLoaded] = useState(false);
  const [searchCount, setSearchCount] = useState(0);

  useEffect(() => {
    const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      setLoaded(true);
    });

    const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      setLoaded(false);
      interstitial.load();
    });

    interstitial.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
    };
  }, []);

  const showAdIfReady = () => {
    setSearchCount(prev => {
      const newCount = prev + 1;
      
      if (newCount >= CONFIGURACION.FRECUENCIA_ANUNCIOS && loaded) {
        interstitial.show();
        return 0;
      }
      
      return newCount;
    });
  };

  return { showAdIfReady };
}
