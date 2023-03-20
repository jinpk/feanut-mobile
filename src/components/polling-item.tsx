import React, {useMemo} from 'react';
import {
  ImageSourcePropType,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import colors from '../libs/colors';
import {Avatar} from './avatar';
import {BadgeButton} from './button';
import {Text} from './text';

type PollingItemProps = {};

export function PollingItem(props: PollingItemProps): JSX.Element {
  const source = useMemo((): ImageSourcePropType | undefined => {
    if (Math.floor(Math.random() * 100) > 50) {
      return undefined;
    }
    return {
      uri: 'https://t3.ftcdn.net/jpg/02/36/48/86/360_F_236488644_opXVvD367vGJTM2I7xTlsHB58DVbmtxR.jpg',
    };
  }, []);

  return (
    <TouchableWithoutFeedback>
      <View style={styles.root}>
        <Avatar
          source={source}
          defaultLogo={Math.floor(Math.random() * 100) > 50 ? 'm' : 'w'}
        />
        <View style={styles.content}>
          <View style={styles.contentName}>
            <Text>친구가 나를 칭찬했어요.</Text>
            <Text color={colors.darkGrey} size={10}>
              3초 전
            </Text>
          </View>
          <Text size={12} mt={1} color={colors.darkGrey}>
            남사친
          </Text>
          <BadgeButton mt={14} title="자세히" />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingTop: 7,
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginLeft: 30,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.mediumGrey,
  },
  contentName: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
