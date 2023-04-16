# BUILD Requirement

## iOS

1. .env 파일 설정
```bash
APPSTORE_API_KEY=
APPSTORE_API_ISSUER=
```

2. APPSTORE Private Key 설정
```bash
cp AuthKey_{APPSTORE_API_KEY}.p8 ~/.private_keys/AuthKey_{APPSTORE_API_KEY}.p8
```

3. ios/mobile.xcodeproj/project.pbxproj 버전 설정
```bash
CURRENT_PROJECT_VERSION =
MARKETING_VERSION = 
```

4. BUILD & DEPLOY with Makefile


## iOS 


### react-native-fast-image

Fast Image .podspec의 SDWebImage 5.11.1 version이 특정 iOS 기기에서 
GIF frame 계산 오류가 있어 매우 빠르게 보임.

아래 버전으로 수정 필요

```bash
# /node_modules/react-native-fast-image/RNFastImage.podspec
-  s.dependency 'SDWebImage', '~> 5.11.1'
+  s.dependency 'SDWebImage', '~> 5.15.3'
```