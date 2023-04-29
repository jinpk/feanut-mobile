import React from 'react';
import {Modal, StyleSheet, View} from 'react-native';
import {pngs} from '../../libs/common';
import {Button} from '../../components/button';
import {Text} from '../../components/text';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Gif} from '../../components/image';

type LegacyFriendshipModalTemplateProps = {
  visible: boolean;
  onClear: () => void;
};

export const LegacyFriendshipModalTemplate = (
  props: LegacyFriendshipModalTemplateProps,
): JSX.Element => {
  const insets = useSafeAreaInsets();
  return (
    <Modal animationType="slide" visible={props.visible}>
      <View
        style={[
          styles.topbar,
          {paddingTop: insets.top, paddingBottom: insets.bottom},
        ]}>
        <Text weight="bold" size={18}>
          공지사항
        </Text>
      </View>
      <View style={styles.content}>
        <Gif source={pngs.mailbox} />
        <Text weight="bold" size={18} align="center" my={45}>
          친구 추가 방법 변경 안내
        </Text>

        <Text lineHeight={17} align="center">
          안녕하세요. feanut입니다.
          {'\n'}
          {'\n'}
          회원님의 의견에 귀 기울여{'\n'}더 나은 서비스를 제공하기 위해
          {'\n'}
          친추 추가 방법을 개선하였습니다.{'\n'}
          {'\n'}
          하단의{' '}
          <Text weight="bold" align="center">
            친구 목록 초기화
          </Text>{' '}
          버튼을 눌러{'\n'}친구 목록 초기화 후{' '}
          <Text weight="bold" align="center">
            프로필 {'>'} 친구관리
          </Text>
          를 통해{'\n'}원하는 사람만 친구로 추가할 수 있습니다.{'\n'}
          {'\n'}
          항상 좋은 서비스를 제공할 수 있도록{'\n'}최선의 노력을 다하겠습니다.
          {'\n'}
          {'\n'}
          감사합니다.
        </Text>
      </View>
      <Button
        onPress={props.onClear}
        title="친구 목록 초기화"
        mx={16}
        my={16}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  topbar: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 53,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
