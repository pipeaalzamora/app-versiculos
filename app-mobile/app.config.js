export default {
  expo: {
    name: "Biblia-help",
    slug: "versiculos-biblicos",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#F5F7FA"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.pipeaalzamora.bibliahelp",
      config: {
        googleMobileAdsAppId: "ca-app-pub-9533784425967946~7514255091"
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#F5F7FA"
      },
      config: {
        googleMobileAdsAppId: "ca-app-pub-9533784425967946~7514255091"
      },
      package: "com.pipeaalzamora.bibliahelp",
      versionCode: 1,
      permissions: [
        "INTERNET"
      ]
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      eas: {
        projectId: "499431ab-ef9a-46b1-9d65-ef6ca881e832"
      }
    },
    plugins: [
      [
        "react-native-google-mobile-ads",
        {
          androidAppId: "ca-app-pub-9533784425967946~7514255091",
          iosAppId: "ca-app-pub-9533784425967946~7514255091",
          delayAppMeasurementInit: false
        }
      ]
    ]
  }
};
