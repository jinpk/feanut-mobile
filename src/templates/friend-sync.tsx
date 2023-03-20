import React, {PropsWithChildren} from 'react';
import {StyleSheet, View} from 'react-native';
import {WithLocalSvg} from 'react-native-svg';
import {Button} from '../components/button';
import {TextButton} from '../components/button/text-button';
import {Gif} from '../components/image';
import {Text} from '../components/text';
import colors from '../libs/colors';
import {gifs, svgs} from '../libs/images';

type FriendSyncTemplateProps = PropsWithChildren<{
  title: string;
  icon: number;
  onFindByEamil: () => void;
  onKakaoSync: () => void;
}>;

function FriendSyncTemplate(props: FriendSyncTemplateProps): JSX.Element {
  return (
    <View style={styles.root}>
      <View style={styles.body}>
        <Gif source={props.icon} />
        <Text mt={14} size={18} weight="bold" align="center">
          {props.title}
        </Text>
      </View>

      {props.children}

      <Button
        onPress={props.onKakaoSync}
        leftIcon={
          <WithLocalSvg
            asset={svgs.kakao}
            style={{marginLeft: -17}}
            width={85}
            height={42}
          />
        }
        color={colors.kakao}
        title="카카오톡 친구 동기화"
        mx={16}
      />

      <Text size={12} color={colors.darkGrey} my={27}>
        또는
      </Text>

      <View style={styles.emailWrap}>
        <TextButton
          onPress={props.onFindByEamil}
          title="이메일로 친구 찾기"
          color={colors.darkGrey}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emailWrap: {
    marginBottom: 76,
  },
});

export default FriendSyncTemplate;
