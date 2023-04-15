VERSION := $(shell git rev-parse --short HEAD)

gradle-android:
	cd android && ./gradlew clean
	cd android && ./gradlew --refresh-dependencies

build-android:
	cd android && ./gradlew assembleRelease

deploy-android-development:
	firebase appdistribution:distribute android/app/build/outputs/apk/release/app-release.apk  \
    --app 1:619040145320:android:e832af9667be2a4252e79d  \
    --release-notes "version: $(VERSION)" --groups qa-team