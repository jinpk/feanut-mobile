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
import {useFriendStore, useUserStore} from '../libs/stores';
import useContact from '../hooks/use-contact';
import FriendFindItem from './friend-find-item';

type FriendFindFeatureProps = {
  focused: boolean;
};
type SectionType = 'contact' | 'school';

const initialContactQuery = {
  page: 1,
  limit: 20,
  loading: false,
};

function FriendFindFeature(props: FriendFindFeatureProps) {
  const increaseTotalCount = useFriendStore(s => s.actions.increaseTotalCount);
  const userId = useUserStore(s => s.user?.id);
  const navigation = useNavigation();
  /** 학교 */
  const mySchoolHook = useMySchool();
  const [schoolQuery, setSchoolQuery] = useState({
    page: 1,
    limit: 5,
    loading: false,
    schoolCode: '',
  });
  const [schoolData, setSchoolData] = useState<
    PagenatedResponse<UserRecommendation>
  >({
    data: [],
    total: 0,
  });

  useEffect(() => {
    if (
      !mySchoolHook.school ||
      !mySchoolHook.school?.code ||
      schoolQuery.loading
    ) {
      return;
    }
    setSchoolQuery(prev => ({
      ...prev,
      loading: true,
      schoolCode: mySchoolHook.school!.code,
    }));
  }, [mySchoolHook.school]);

  useEffect(() => {
    if (!schoolQuery.loading) {
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
      });
  }, [schoolQuery.page, schoolQuery.loading]);

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
      contactQuery.loading
    ) {
      return;
    }
    setContactQuery(prev => ({...prev, loading: true}));
  }, [contactQuery.page, contactHook.loading]);

  /** 조회 paging */
  useEffect(() => {
    if (contactQuery.loading) {
      contactHook
        .fetch(contactQuery.page, contactQuery.limit)
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
        });
    }
  }, [contactQuery.page, contactQuery.loading]);

  const handleRefresh = useCallback(() => {
    setSchoolQuery(prev => ({
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
        setSchoolQuery(prev => ({...prev, page: prev.page + 1, loading: true}));
      } else {
        setContactQuery(prev => ({...prev, page: prev.page + 1}));
      }
    },
    [],
  );

  const sections = useMemo(() => {
    const school = {
      title: '내 학교',
      type: 'school',
      data: schoolData.data,
    };
    const contact = {
      title: '내 연락처',
      type: 'contact',
      data: contactData.data,
    };
    return [school, contact];
  }, [schoolData.data, contactData.data]);

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
            });
          }}
          onAdd={() => {
            increaseTotalCount();
            if (type === 'school') {
              setSchoolQuery(prev => ({...prev, loading: true}));
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

  return (
    <View style={styles.root}>
      <SectionList
        showsVerticalScrollIndicator={false}
        sections={sections}
        keyExtractor={renderKeyExtractor}
        renderItem={handleRenderItem}
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
                </Text>
              </View>
              {section.type === 'contact' && contactHook.loading && (
                <ActivityIndicator color={colors.primary} />
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
