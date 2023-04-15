VERSION := $(shell git rev-parse --short HEAD)

prebuild-android:
	cd android && ./gradlew clean
	cd android && ./gradlew --refresh-dependencies

build-android:
	cd android && ./gradlew assembleRelease

prebuild-ios:
	xcodebuild -workspace ios/mobile.xcworkspace -scheme mobile clean build

build-ios:
	xcodebuild -workspace ios/mobile.xcworkspace -scheme mobile  \
	-archivePath ios/build/outputs/ipa/feanut.xcarchive archive  
	
	xcodebuild -exportArchive -archivePath ios/build/outputs/ipa/feanut.xcarchive  \
	-exportPath  ios/build/outputs/ipa  -exportOptionsPlist ios/mobile/ExportOption.plist

deploy-android-development:
	firebase appdistribution:distribute android/app/build/outputs/apk/release/app-release.apk  \
    --app 1:619040145320:android:e832af9667be2a4252e79d  \
    --release-notes "commit: $(VERSION)" --groups qa-team

deploy-ios-development:
	firebase appdistribution:distribute ios/build/outputs/ipa/feanut.ipa  \
    --app 1:619040145320:ios:4c2038c1c7659a3452e79d  \
    --release-notes "commit: $(VERSION)" --groups qa-team