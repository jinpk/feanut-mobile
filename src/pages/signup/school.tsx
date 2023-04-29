import React, {useCallback, useEffect, useState} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {SignUpRequest} from '../../libs/interfaces';
import {SchoolTemplate} from '../../templates/school';
import {getListSchool} from '../../libs/api/school';
import {
  GetListSchoolRequest,
  GetListSchoolResponse,
  School,
} from '../../libs/interfaces/school';
import {routes} from '../../libs/common';

type SignUpSchoolProps = RouteProp<
  {SignUpSchool: {payload: SignUpRequest}},
  'SignUpSchool'
>;

function SignUpSchool() {
  const navigation = useNavigation();
  const {params} = useRoute<SignUpSchoolProps>();
  const [query, setQuery] = useState<GetListSchoolRequest>({
    page: 1,
    limit: 20,
    keyword: '',
  });
  const [data, setData] = useState<GetListSchoolResponse>({
    data: [],
    total: 0,
  });
  const [loading, setLoading] = useState(false);

  const [fetching, setFetching] = useState(false);

  // 화면 첫 진입 시 조회 요청
  useEffect(() => {
    setLoading(true);
  }, []);

  //  조회
  useEffect(() => {
    if (loading && query.keyword && query.keyword.length >= 1) {
      console.log('fetch shcool', query);
      let tm = setTimeout(() => {
        setFetching(true);
        getListSchool(query)
          .then(result => {
            if (query.page === 1) {
              setData(result);
            } else {
              setData(prev => ({
                data: [...prev.data, ...result.data],
                total: result.total,
              }));
            }
            return;
          })
          .catch((error: any) => {
            if (__DEV__) {
              console.error(error);
            }
            return;
          })
          .finally(() => {
            setFetching(false);
            setLoading(false);
          });
      }, 300);
      return () => {
        clearTimeout(tm);
      };
    }
  }, [loading, query.page, query.keyword]);

  const handleItemPress = useCallback(
    (school: School) => {
      navigation.navigate(routes.signupGrade, {
        school,
        payload: params.payload,
      });
    },
    [params],
  );

  const handleLoadMore = useCallback(() => {
    if (loading) {
      return;
    }
    // 아이템 없어지면 리스트 최신화 필요
    if (data.data.length < data.total) {
      setQuery(prev => ({
        keyword: prev.keyword,
        page: query.page + 1,
        limit: 20,
      }));
      setLoading(true);
    }
  }, [loading, query, data.data.length, data.total]);

  const handleRefresh = useCallback(() => {
    setData({data: [], total: 0});
    setLoading(true);
  }, []);

  const handleKeyword = useCallback((keyword: string) => {
    if (!keyword) {
      setData({data: [], total: 0});
    }
    setQuery({page: 1, keyword: keyword || '', limit: 20});
    setLoading(true);
  }, []);

  return (
    <SchoolTemplate
      data={data.data}
      onBack={navigation.goBack}
      onItemPress={handleItemPress}
      onLoadMore={handleLoadMore}
      loading={loading}
      onRefresh={handleRefresh}
      onKeyword={handleKeyword}
      keyword={query.keyword || ''}
      fetching={fetching}
    />
  );
}

export default SignUpSchool;
