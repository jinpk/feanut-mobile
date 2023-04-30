import React, {useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import {SchoolTemplate} from '../../templates/school';
import {School} from '../../libs/interfaces/school';
import {routes} from '../../libs/common';
import {useSchool} from '../../hooks';

function ProfileEditSchool() {
  const schoolHooks = useSchool();
  const navigation = useNavigation();

  const handleItemPress = useCallback((school: School) => {
    navigation.navigate(routes.profileEditGrade, {
      school,
    });
  }, []);

  return (
    <SchoolTemplate
      data={schoolHooks.data.data}
      onBack={navigation.goBack}
      onItemPress={handleItemPress}
      onLoadMore={schoolHooks.onLoadMore}
      loading={schoolHooks.loading}
      onRefresh={schoolHooks.onRefresh}
      onKeyword={schoolHooks.onKeyword}
      keyword={schoolHooks.query.keyword || ''}
      fetching={schoolHooks.fetching}
    />
  );
}

export default ProfileEditSchool;
