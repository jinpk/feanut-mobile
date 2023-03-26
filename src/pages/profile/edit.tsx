import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {Alert} from 'react-native';
import {useProfileImage} from '../../hooks';
import {postFile, putObject} from '../../libs/api/common';
import {getMyProfile, patchProfile} from '../../libs/api/profile';
import {configs} from '../../libs/common/configs';
import {PatchProfileRequest, ProfileForm} from '../../libs/interfaces';
import {useProfileStore} from '../../libs/stores';
import ProfileEditTemplate from '../../templates/profile/edit';

const initialFormValues: ProfileForm = {
  name: '',
  profileImage: null,
  statusMessage: '',
};

function ProfileEdit(): JSX.Element {
  const navigation = useNavigation();
  const profile = useProfileStore(s => s.profile);
  const update = useProfileStore(s => s.actions.update);
  const form = useForm<ProfileForm>({
    defaultValues: initialFormValues,
  });

  const profileImage = useProfileImage();

  const handleProfileImage = useCallback(() => {
    profileImage.open(asset => {
      form.setValue('profileImage', asset);
    });
  }, [profileImage]);

  useEffect(() => {
    form.setValue('name', profile.name);
    form.setValue('statusMessage', profile.statusMessage);
    if (profile.profileImageKey) {
      form.setValue('profileImage', {
        uri: configs.cdnBaseUrl + '/' + profile.profileImageKey,
      });
    } else {
      form.setValue('profileImage', null);
    }
  }, [profile]);

  const onSubmit = useCallback(async (data: ProfileForm) => {
    let needImageUpdate = false;

    if (data.profileImage && data.profileImage.fileName) {
      needImageUpdate = true;
    }

    try {
      const params: PatchProfileRequest = {
        name: data.name,
        statusMessage: data.statusMessage || '',
      };
      if (needImageUpdate) {
        const fileResponse = await postFile({
          purpose: 'profileimage',
          contentType: data.profileImage.type,
        });
        params.imageFileId = fileResponse.fileId;
        await putObject(
          fileResponse.signedUrl,
          data.profileImage.uri,
          data.profileImage.type,
        );
      } else {
        params.imageFileId = null;
      }
      await patchProfile(profile.id, params);
      getMyProfile().then(update);
      navigation.goBack();
    } catch (error: any) {
      Alert.alert(error.message || error);
    }
  }, []);

  return (
    <ProfileEditTemplate
      form={form}
      onBack={navigation.goBack}
      profile={profile}
      onProfileImage={handleProfileImage}
      onComplete={form.handleSubmit(onSubmit)}
    />
  );
}

export default ProfileEdit;
