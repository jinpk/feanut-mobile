import dynamicLinks from '@react-native-firebase/dynamic-links';
import {configs} from '../common/configs';

async function buildReferralDynamicLink(referralUserId: string) {
  const link = await dynamicLinks().buildShortLink(
    {
      link: `${configs.referralLinkUrl}?${configs.referralLinkUserIdKey}=${referralUserId}`,
      domainUriPrefix: 'https://feanut.page.link',
      android: {
        packageName: 'com.feanut.android',
      },
      ios: {
        bundleId: 'com.feanut.ios',
        iPadBundleId: 'com.feanut.ios',
        appStoreId: configs.appStoreId,
      },
      analytics: {
        campaign: 'referral',
      },
      social: {
        title: '마음을 전하는 3초',
        descriptionText: 'feanut에서 만나요!',
        imageUrl: `${configs.assetBaseUrl}/preview/referral.jpg`,
      },
    },
    dynamicLinks.ShortLinkType.SHORT,
  );

  return link;
}

export async function getMyReferralLink(referralUserId: string) {
  return await buildReferralDynamicLink(referralUserId);
}
