import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  SectionList,
  StyleSheet,
  View,
} from 'react-native';
import {Text} from '../components/text';
import {colors, routes} from '../libs/common';
import {useMySchool} from '../hooks';
import {getUserRecommendation} from '../libs/api/users';
import {PagenatedResponse, UserRecommendation} from '../libs/interfaces';
import {useNavigation} from '@react-navigation/native';
import {TextButton} from '../components/button/text-button';
import {useFriendStore} from '../libs/stores';
import useContact from '../hooks/use-contact';
import FriendFindItem from './friend-find-item';
import {SearchInput} from '../components/input';

type FriendFindFeatureProps = {
  focused: boolean;
  userId: string;
};
type SectionType = 'contact' | 'school';

const initialContactQuery = {
  page: 1,
  keyword: '',
  limit: 20,
  loading: false,
};

function FriendFindFeature(props: FriendFindFeatureProps) {
  const increaseTotalCount = useFriendStore(s => s.actions.increaseTotalCount);
  const userId = props.userId;
  const navigation = useNavigation();
  /** 학교 */
  const mySchoolHook = useMySchool(props.userId);
  const [schoolQuery, setSchoolQuery] = useState({
    page: 1,
    limit: 5,
    loading: false,
    schoolCode: '',
    keyword: '',
  });
  const [schoolData, setSchoolData] = useState<
    PagenatedResponse<UserRecommendation>
  >({
    data: [],
    total: 0,
  });

  useEffect(() => {
    if (!mySchoolHook.school || !mySchoolHook.school?.code) {
      return;
    }
    setSchoolQuery(prev => ({
      ...prev,
      schoolCode: mySchoolHook.school!.code,
    }));
  }, [mySchoolHook.school]);

  useEffect(() => {
    if (!schoolQuery.schoolCode || schoolQuery.loading || !props.focused) {
      return;
    }
    setSchoolQuery(prev => ({
      ...prev,
      loading: true,
    }));
  }, [schoolQuery.schoolCode, props.focused]);

  useEffect(() => {
    if (!schoolQuery.loading || !schoolQuery.schoolCode) {
      return;
    }
    getUserRecommendation({
      ...schoolQuery,
    })
      .then(res => {
        if (schoolQuery.page === 1) {
          setSchoolData(res);
        } else {
          setSchoolData(prev => ({
            data: [
              ...prev.data,
              ...res.data.filter(x => {
                return prev.data.findIndex(p => p.profileId === x.profileId) >=
                  0
                  ? false
                  : true;
              }),
            ],
            total: res.total,
          }));
        }
        return;
      })
      .finally(() => {
        setSchoolQuery(prev => ({...prev, loading: false}));
        if (schoolQuery.keyword) {
          setSearching(false);
        }
      });
  }, [schoolQuery.page, schoolQuery.loading, schoolQuery.keyword]);

  /** 연락처 */
  const contactHook = useContact();
  const [contactQuery, setContactQuery] = useState(initialContactQuery);
  const [contactData, setContactData] = useState<
    PagenatedResponse<UserRecommendation>
  >({
    data: [],
    total: 0,
  });

  const [contactPermission, setContactPermission] = useState<
    'pending' | 'granted' | 'denied'
  >('pending');

  /** 연락처 권한 확인 및 권한 허용 시 연락처 동기화 */
  useEffect(() => {
    if (props.focused) {
      contactHook.checkPermissions().then(granted => {
        setContactPermission(granted ? 'granted' : 'denied');
        if (granted) {
          contactHook.storeContacts();
        }
      });
    }
  }, [props.focused]);

  /** 연락처 권한 허용 ok 및 동기화 완료시 호출 준비 */
  useEffect(() => {
    if (
      contactPermission !== 'granted' ||
      contactHook.loading ||
      contactQuery.loading ||
      !props.focused
    ) {
      return;
    }
    setContactQuery(prev => ({...prev, loading: true}));
  }, [contactQuery.page, contactHook.loading, props.focused]);

  /** 조회 paging */
  useEffect(() => {
    if (contactQuery.loading) {
      contactHook
        .fetch(contactQuery.page, contactQuery.limit, contactQuery.keyword)
        .then(res => {
          if (contactQuery.page === 1) {
            setContactData(res);
          } else {
            setContactData(prev => ({
              data: [
                ...prev.data,
                ...res.data.filter(x => {
                  return prev.data.findIndex(
                    p => p.phoneNumber === x.phoneNumber,
                  ) >= 0
                    ? false
                    : true;
                }),
              ],
              total: res.total,
            }));
          }
        })
        .finally(() => {
          // 조회 완료시 loading false
          setContactQuery(prev => ({...prev, loading: false}));
          if (contactQuery.keyword) {
            setSearching(false);
          }
        });
    }
  }, [contactQuery.page, contactQuery.loading, contactQuery.keyword]);

  /** List Handler */
  const handleRefresh = useCallback(() => {
    setSearching(false);
    setKeyword('');
    setSchoolQuery(prev => ({
      keyword: '',
      page: 1,
      limit: 5,
      loading: true,
      schoolCode: prev.schoolCode,
    }));
    setContactQuery({
      ...initialContactQuery,
      loading: true,
    });
  }, []);

  const handleLoadMore = useCallback(
    (type: SectionType) => () => {
      if (type === 'school') {
        if (schoolData.data.length !== schoolQuery.limit * schoolQuery.page) {
          // 이미 친구추가한 경우 refetch
          setSchoolQuery(prev => ({
            ...prev,
            page: prev.page,
            loading: true,
          }));
        } else {
          setSchoolQuery(prev => ({
            ...prev,
            page: prev.page + 1,
            loading: true,
          }));
        }
      } else {
        setContactQuery(prev => ({...prev, page: prev.page + 1}));
      }
    },
    [schoolData, schoolQuery],
  );

  const renderKeyExtractor = useCallback(
    (item: UserRecommendation, i: number) => {
      return item.userId + item.phoneNumber + i;
    },
    [],
  );

  const handleRenderItem = useCallback(
    ({
      item,
      section: {type},
    }: {
      item: UserRecommendation;
      index: number;
      section: any;
    }) => {
      return (
        <FriendFindItem
          item={item}
          userId={userId!}
          onPress={() => {
            navigation.navigate(routes.profile, {
              profileId: item.profileId,
              contactName: type === 'contact' && item.name,
            });
          }}
          onAdd={() => {
            increaseTotalCount();
            if (type === 'school') {
              setSchoolData(prev => ({
                ...prev,
                total: prev.total - 1,
                data: prev.data.filter(x => x.profileId !== item.profileId),
              }));
            } else {
              contactHook.removeItem(item.phoneNumber!);
              setContactQuery(prev => ({...prev, loading: true}));
              setContactData(prev => ({
                ...prev,
                total: prev.total - 1,
                data: prev.data.filter(x => x.phoneNumber !== item.phoneNumber),
              }));
            }
          }}
        />
      );
    },
    [userId],
  );

  /** 검색 */
  const [keyword, setKeyword] = useState('');
  const [searching, setSearching] = useState(false);

  const handleChangeKeyword = useCallback((keyword: string) => {
    if (!keyword) {
      handleRefresh();
    }
    setKeyword(keyword);
  }, []);

  const handleSearch = useCallback((keyword: string) => {
    setSchoolQuery(prev => ({
      ...prev,
      page: 1,
      keyword,
      loading: true,
    }));
    setContactQuery(prev => ({
      ...prev,
      page: 1,
      keyword,
      loading: true,
    }));
  }, []);

  useEffect(() => {
    if (keyword) {
      setSearching(true);
      setSchoolData({data: [], total: 0});
      setContactData({data: [], total: 0});
      let tm = setTimeout(() => {
        handleSearch(keyword);
      }, 1000);
      return () => {
        clearTimeout(tm);
        if (!keyword) {
          console.log('clear');
          handleRefresh();
        }
      };
    }
  }, [keyword]);

  const sections = useMemo(() => {
    const school = {
      title: '내 학교',
      type: 'school',
      data: schoolData.data,
      total: schoolData.total,
    };
    const contact = {
      title: '내 연락처',
      type: 'contact',
      total: contactData.total,
      data: contactData.data,
    };
    return [school, contact];
  }, [schoolData.data, schoolData.total, contactData.data, contactData.total]);

  return (
    <View style={styles.root}>
      <SectionList
        showsVerticalScrollIndicator={false}
        sections={sections}
        keyExtractor={renderKeyExtractor}
        renderItem={handleRenderItem}
        ListHeaderComponent={
          <SearchInput
            value={keyword}
            onChange={handleChangeKeyword}
            maxLength={10}
            placeholder="검색"
            returnKeyType="search"
            mx={16}
            mt={15}
            mb={15}
          />
        }
        refreshControl={
          <RefreshControl
            tintColor={colors.primary}
            refreshing={false}
            onRefresh={handleRefresh}
          />
        }
        renderSectionHeader={({section}) => {
          return (
            <>
              <View style={styles.sectionHeader}>
                <Text size={12} color={colors.darkGrey}>
                  {section.title}
                  {` ${section.total}명`}
                </Text>
              </View>
              {(searching ||
                (section.type === 'contact' && contactHook.loading)) && (
                <ActivityIndicator
                  style={{marginTop: 10}}
                  color={colors.primary}
                />
              )}
            </>
          );
        }}
        renderSectionFooter={({section}) => {
          if (
            section.type === 'school' &&
            schoolData.total <= schoolData.data.length
          ) {
            return null;
          }
          if (
            section.type === 'contact' &&
            contactData.total <= contactData.data.length
          ) {
            return null;
          }

          return (
            <View style={styles.more}>
              {section.type === 'school' &&
              schoolQuery.loading &&
              schoolQuery.page > 1 ? (
                <ActivityIndicator color={colors.primary} />
              ) : (
                <TextButton
                  onPress={handleLoadMore(section.type as SectionType)}
                  color={colors.darkGrey}
                  title="더보기"
                />
              )}
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1},
  sectionHeader: {
    borderBottomWidth: 0.5,
    backgroundColor: colors.white,
    marginBottom: 7.5,
    borderBottomColor: colors.mediumGrey,
    marginHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  more: {alignSelf: 'center', padding: 8},
});

export default memo(FriendFindFeature, (p, c) => p.focused === c.focused);
