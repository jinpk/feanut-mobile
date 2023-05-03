import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {colors} from '../../libs/common';
import {BackTopBar} from '../../components/top-bar';
import {useNavigation} from '@react-navigation/native';
import {Text} from '../../components/text';
import {useUserStore} from '../../libs/stores';
import {getMe} from '../../libs/api/users';
import FriendFindFeature from '../../features/friend-find';
import {User} from '../../libs/interfaces';
import {Button} from '../../components/button';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export default function SignUpFriend() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const login = useUserStore(s => s.actions.login);
  const [me, setMe] = useState<User>();

  useEffect(() => {
    let tm: User;
    getMe().then(me => {
      tm = me;
      setMe(me);
    });
    return () => {
      if (tm) {
        login(tm);
      }
    };
  }, []);

  return (
    <View style={[styles.root, {paddingBottom: insets.bottom}]}>
      <BackTopBar onBack={navigation.goBack} />
      <Text weight="bold" size={18} mb={10} mt={15} mx={16}>
        친구를 4명 이상 선택해 주세요
      </Text>
      {me && <FriendFindFeature focused userId={me.id} />}
      {me && (
        <Button
          mx={16}
          my={16}
          title="시작하기"
          onPress={() => {
            login(me);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: colors.white},
});
