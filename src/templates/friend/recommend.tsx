/** feature */
import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors, svgs} from '../../libs/common';
import {Text} from '../../components/text';
import {School} from '../../libs/interfaces/school';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSyncContacts} from '../../hooks';
import {FriendItem, Information} from '../../components';
import {WithLocalSvg} from 'react-native-svg';
import {Button} from '../../components/button';

type FreidnsRecommendTemplateProps = {
  focused: boolean;
  school?: School;
};

export const FreindRecommendTemplate = (
  props: FreidnsRecommendTemplateProps,
) => {
  const syncContacts = useSyncContacts();
  const insets = useSafeAreaInsets();
  const hasSchool = Boolean(props.school?.code);
  const [type, setType] = useState<'school' | 'contact'>(
    hasSchool ? 'school' : 'contact',
  );

  const [contactPermission, setContactPermission] = useState(false);

  const [data, setData] = useState({
    list: [],
    total: 0,
  });

  useEffect(() => {
    setData({list: [], total: 0});
  }, [type]);

  useEffect(() => {
    if (props.focused && type === 'contact') {
      syncContacts.checkPermissions().then(setContactPermission);
    }
  }, [type, props.focused]);

  useEffect(() => {
    if (contactPermission && type === 'contact') {
      syncContacts.fetchContacts().then(r => {

      });
    }
  }, [type, contactPermission]);

  /** Flatlist */
  const renderKeyExtractor = useCallback((item: any, index: number) => {
    return index.toString();
  }, []);

  const handleRenderItem = useCallback((args: {item: any; index: number}) => {
    return null;
  }, []);

  const renderListHeaderComponent = useCallback(() => {
    return (
      <>
        {type === 'contact' && !contactPermission && (
          <>
            <Text mt={60} weight="bold" size={18} align="center">
              {'연락처 접근 허용 후\n내 연락처의 친구를 추가할 수 있어요!'}
            </Text>
            <Button
              onPress={() => {
                syncContacts.checkPermissions().then(r => {
                  setContactPermission(r);
                  if (!r) {
                    Alert.alert(
                      '연락처 읽기 실패',
                      '설정에서 feanut 연락처 접근 허용후 다시 시도해 주세요.',
                      [
                        {
                          text: '설정',
                          isPreferred: true,
                          onPress: () => {
                            Linking.openSettings();
                          },
                        },
                        {text: '다음에', style: 'cancel'},
                      ],
                    );
                  }
                });
              }}
              radius="m"
              px={30}
              alignSelf="center"
              mt={60}
              title="연락처 접근 허용하기"
            />
          </>
        )}
      </>
    );
  }, [type, contactPermission]);

  return (
    <View style={styles.root}>
      <View style={styles.types}>
        {hasSchool && (
          <TouchableOpacity
            onPress={() => {
              setType('school');
            }}
            style={styles.type}>
            <Text>내 학교 친구</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => {
            setType('contact');
          }}
          style={styles.type}>
          <Text>내 연락처</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        contentContainerStyle={{paddingBottom: insets.bottom}}
        data={data.list}
        extraData={data}
        keyExtractor={renderKeyExtractor}
        renderItem={handleRenderItem}
        ListHeaderComponent={renderListHeaderComponent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.white,
    flex: 1,
  },
  types: {
    flexDirection: 'row',
    marginHorizontal: 16,
    borderBottomWidth: 0.5,
    paddingBottom: 10,
    paddingTop: 20,
    borderBottomColor: colors.mediumGrey,
  },
  type: {
    backgroundColor: colors.mediumGrey,
    color: colors.black,
    marginRight: 10,
    paddingHorizontal: 10,
    borderRadius: 20,
    paddingVertical: 6,
  },
  list: {},

  sync: {
    borderRadius: 100,
    width: 42,
    height: 42,
    backgroundColor: colors.lightGrey,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
