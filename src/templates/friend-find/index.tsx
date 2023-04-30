import {
  ActivityIndicator,
  RefreshControl,
  SectionList,
  StyleSheet,
  TouchableOpacity,
  ViewBase,
} from 'react-native';
import {View} from 'react-native';
import {colors, svgs} from '../../libs/common';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {Text} from '../../components/text';
import {useMySchool} from '../../hooks/use-my-school';
import {TextButton} from '../../components/button/text-button';
import {useContacts} from '../../hooks/use-contacts';
import {FriendItem} from '../../components';
import {WithLocalSvg} from 'react-native-svg';

type FriendFindTemplateProps = {
  focused: boolean;
};

const initialQuery = {
  page: 1,
  limit: 4,
  loading: true,
};

const initialData: {list: any[]; total: number} = {
  list: [],
  total: 0,
};

export default function FriendFindTemplate(props: FriendFindTemplateProps) {
  const mySchool = useMySchool();
  const contactHook = useContacts();
  const [contactQuery, setContactQuery] = useState(initialQuery);
  const [contactData, setContactData] = useState(initialData);

  useEffect(() => {
    if (props.focused) {
      handleRefresh();
      contactHook.checkPermissions();
    }
  }, [props.focused]);

  /** 내 연락처 동기화 */
  useEffect(() => {
    if (props.focused && contactQuery.loading && contactHook.granted) {
      contactHook.initContacts().then(() => {
        console.log('fetch contacts:', contactQuery.page);
        contactHook
          .fetchContacts(contactQuery.page, contactQuery.limit)
          .then(result => {
            if (contactQuery.page === 1) {
              setContactData({list: result.list, total: result.total});
            } else {
              setContactData(prev => ({
                list: [...prev.list, ...result.list],
                total: result.total,
              }));
            }
            setContactQuery(prev => ({...prev, loading: false}));
          });
      });
    }
  }, [
    props.focused,
    contactHook.granted,
    contactQuery.page,
    contactQuery.limit,
    contactQuery.loading,
  ]);

  const renderKeyExtractor = useCallback((i: string, index: number) => {
    return index.toString();
  }, []);

  const handleRefresh = useCallback(() => {
    setContactQuery(initialQuery);
    setContactData(initialData);
    contactHook.checkPermissions();
  }, []);

  const handleLoadMore = useCallback(
    (type: string) => (e: any) => {
      if (type === 'contact') {
        if (contactQuery.loading) return;
        setContactQuery(prev => ({
          ...prev,
          page: prev.page + 1,
          loading: true,
        }));
      }
    },
    [contactQuery.loading],
  );

  const sections = useMemo(() => {
    const school = {title: '내 학교', data: [], type: 'school'};
    const contact = {
      title: '내 연락처',
      data: contactData.list,
      type: 'contact',
    };

    if (!mySchool.school?.code) return [contact];

    return [school, contact];
  }, [mySchool, contactData]);

  return (
    <View style={styles.root}>
      <SectionList
        refreshControl={
          <RefreshControl
            tintColor={colors.primary}
            refreshing={false}
            onRefresh={handleRefresh}
          />
        }
        sections={sections}
        keyExtractor={renderKeyExtractor}
        renderItem={({item}) => {
          return (
            <FriendItem
              name={item.name}
              button="친구 추가"
              buttonColor={colors.blue}
              onButtonPress={() => {}}
            />
          );
        }}
        renderSectionHeader={({section: {title, type}}) => (
          <>
            <View style={styles.sectionHeader}>
              <Text color={colors.darkGrey} mb={8} mt={14} size={12}>
                {title}
              </Text>
            </View>
            {type === 'contact' && !contactHook.granted && (
              <FriendItem
                name="연락처 동기화"
                button="동기화"
                buttonColor={colors.blue}
                onButtonPress={() => {
                  contactHook.checkPermissions(true);
                }}
                icon={
                  <View style={styles.syncIcon}>
                    <WithLocalSvg width={16} height={16} asset={svgs.sync} />
                  </View>
                }
              />
            )}
          </>
        )}
        renderSectionFooter={({section: {type}}) => {
          if (
            type === 'contact' &&
            contactData.total > contactData.list.length
          ) {
            console.log(contactQuery.loading);
            if (contactQuery.loading) return <ActivityIndicator />;
            return (
              <TouchableOpacity
                onPress={handleLoadMore(type)}
                style={styles.more}>
                <View style={styles.moreText}>
                  <Text color={colors.darkGrey}>더보기</Text>
                </View>
              </TouchableOpacity>
            );
          }

          return null;
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  sectionHeader: {
    marginHorizontal: 16,
    borderBottomWidth: 0.5,
    marginBottom: 7.5,
    borderBottomColor: colors.mediumGrey,
  },
  more: {
    alignSelf: 'center',
    padding: 8,
    marginBottom: 20,
  },
  moreText: {
    borderBottomWidth: 1,
    borderBottomColor: colors.darkGrey,
  },
  syncIcon: {
    borderRadius: 100,
    width: 42,
    height: 42,
    backgroundColor: colors.lightGrey,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
