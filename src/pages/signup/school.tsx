import React, {useCallback} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {SignUpRequest} from '../../libs/interfaces';
import {SchoolTemplate} from '../../templates/school';
import {School} from '../../libs/interfaces/school';
import {routes} from '../../libs/common';
import {useSchool} from '../../hooks';

type SignUpSchoolProps = RouteProp<
  {SignUpSchool: {payload: SignUpRequest}},
  'SignUpSchool'
>;

function SignUpSchool() {
  const schoolHooks = useSchool();
  const navigation = useNavigation();
  const {params} = useRoute<SignUpSchoolProps>();

  const handleItemPress = useCallback(
    (school: School) => {
      navigation.navigate(routes.signupGrade, {
        school,
        payload: params.payload,
      });
    },
    [params],
  );

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

export default SignUpSchool;
