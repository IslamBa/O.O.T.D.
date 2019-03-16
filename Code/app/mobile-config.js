App.accessRule('http://*');
App.accessRule('https://*');

App.info({
  id: 'com.meteor.ootd.app',
  name: 'OOTD',
  version: "0.0.1"
});

// App.setPreference('FullScreen', true);
App.setPreference('StatusBarOverlaysWebView', 'true');

App.icons({
    'android_mdpi': 'client/images/res/drawable-mdpi/ic_stat_o.png',
    'android_hdpi': 'client/images/res/drawable-hdpi/ic_stat_o.png',
    'android_xhdpi': 'client/images/res/drawable-xhdpi/ic_stat_o.png',
    'android_xxhdpi': 'client/images/res/drawable-xxhdpi/ic_stat_o.png',
    'android_xxxhdpi': 'client/images/res/drawable-xxhdpi/ic_stat_o.png'
  });
