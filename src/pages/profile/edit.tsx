import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef} from 'react';
import {useForm} from 'react-hook-form';
import {Alert} from 'react-native';
import {useProfileImage} from '../../hooks';
import {localImageURIToBlob, postFile, putObject} from '../../libs/api/common';
import {getMyProfile, patchProfile} from '../../libs/api/profile';
import {PatchProfileRequest, ProfileForm} from '../../libs/interfaces';
import {useProfileStore} from '../../libs/stores';
import ProfileEditTemplate from '../../templates/profile/edit';
import {getObjectURLByKey} from '../../libs/common/file';

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

  const apiLoadingRef = useRef(false);

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
        uri: getObjectURLByKey(profile.profileImageKey, '150'),
      });
    } else {
      form.setValue('profileImage', null);
    }
  }, [profile]);

  const onSubmit = useCallback(async (data: ProfileForm) => {
    if (apiLoadingRef.current) {
      return;
    }

    apiLoadingRef.current = true;

    try {
      const params: PatchProfileRequest = {
        name: data.name.trim(),
        statusMessage: (data.statusMessage || '').trim(),
      };

      if (data.profileImage?.fileName) {
        const imageData = await localImageURIToBlob(data.profileImage.uri);
        const fileResponse = await postFile({
          purpose: 'profileimage',
          contentType: imageData.type,
        });
        params.imageFileId = fileResponse.fileId;
        await putObject(fileResponse.signedUrl, imageData);
      } else if (!data.profileImage) {
        params.imageFileId = null;
      }
      await patchProfile(profile.id, params);
      getMyProfile().then(update);
      navigation.goBack();
    } catch (error: any) {
      Alert.alert(error.message || error);
    }

    apiLoadingRef.current = false;
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
