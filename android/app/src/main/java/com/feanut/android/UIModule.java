package com.feanut.android;

import android.app.Activity;
import android.view.View;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class UIModule extends ReactContextBaseJavaModule {
    UIModule(ReactApplicationContext context){
        super(context);
    }



    @ReactMethod
    public void onFullscreen() {

        ReactApplicationContext context = getReactApplicationContext();
        Activity activity = context.getCurrentActivity();

        assert activity != null;
        activity.runOnUiThread(() -> {
            View decorView = context.getCurrentActivity().getWindow().getDecorView();
            int uiOptions = View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                    | View.SYSTEM_UI_FLAG_LAYOUT_STABLE;
            decorView.setSystemUiVisibility(uiOptions);
        });
    }

    @ReactMethod
    public void offFullscreen(String message, int duration) {
        ReactApplicationContext context = getReactApplicationContext();
        Activity activity = context.getCurrentActivity();

        assert activity != null;
        activity.runOnUiThread(() -> {
            View decorView = context.getCurrentActivity().getWindow().getDecorView();
            decorView.setSystemUiVisibility(0);
        });

    }


    @NonNull
    @Override
    public String getName() {
        return "UIModule";
    }
}
