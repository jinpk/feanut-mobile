# Include env for variables
include .env

# ANDROID

prebuild-android:
	cd android && ./gradlew clean
	cd android && ./gradlew --refresh-dependencies

build-android:
	cd android && ./gradlew assembleRelease

deploy-android-development:
	firebase appdistribution:distribute android/app/build/outputs/apk/release/app-release.apk  \
    --app 1:619040145320:android:e832af9667be2a4252e79d  \
    --release-notes "commit: $(shell git rev-parse --short HEAD)" --groups qa-team

# iOS

prebuild-ios:
	xcodebuild -workspace ios/mobile.xcworkspace -scheme mobile clean build

build-ios:
	xcodebuild -workspace ios/mobile.xcworkspace -scheme mobile  \
	-configuration Release archive
	-archivePath ios/build/outputs/ipa/feanut.xcarchive  
	
	xcodebuild -exportArchive -archivePath ios/build/outputs/ipa/feanut.xcarchive  \
	-exportPath  ios/build/outputs/ipa  -exportOptionsPlist ios/mobile/ExportOption.plist \
	-allowProvisioningUpdates

deploy-ios:
	xcrun altool --upload-app --file ios/build/outputs/ipa/feanut.ipa  \
	--type ios --apiIssuer "$(APPSTORE_API_ISSUER)" --apiKey "$(APPSTORE_API_KEY)"