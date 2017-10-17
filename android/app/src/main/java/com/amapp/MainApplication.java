package com.amapp;

import android.app.Application;

import com.RNFetchBlob.RNFetchBlobPackage;
import com.beefe.picker.PickerViewPackage;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.getui.reactnativegetui.GetuiPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.microsoft.codepush.react.CodePush;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        protected String getJSBundleFile() {
            return CodePush.getJSBundleFile();
        }

        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
//                    new BaiduMapPackage(getApplicationContext()),
                    new GetuiPackage(),
//                    new CodePush(null, getApplicationContext(), BuildConfig.DEBUG),
                    new CodePush(getResources().getString(BuildConfig.DEBUG ? R.string.reactNativeCodePush_androidDeploymentKey_debug : R.string.reactNativeCodePush_androidDeploymentKey_release), getApplicationContext(), BuildConfig.DEBUG),
                    new PickerViewPackage(),
                    new RNFetchBlobPackage(),
                    new RCTCameraPackage(),
                    new RNDeviceInfo()
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
    }
}
