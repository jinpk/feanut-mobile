import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {WithLocalSvg} from 'react-native-svg';
import colors from '../libs/colors';
import {svgs, gifs} from '../libs/images';
import {Gif} from '../components/image';
import {Text} from '../components/text';
import {PollFriendItem} from '../components';

type PollingTemplateProps = {
  backgroundColor: string;
  pointColor: string;
};

function PollingTemplate(props: PollingTemplateProps): JSX.Element {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState(null);
  return (
    <View style={[styles.root, {backgroundColor: props.backgroundColor}]}>
      <View style={[styles.header, {paddingTop: insets.top + 7}]}>
        <WithLocalSvg
          width={67}
          height={35}
          color={props.pointColor}
          asset={svgs.logoSimple}
        />
      </View>
      <View style={styles.body}>
        <View style={styles.titleArea}>
          <Gif source={gifs.fire} />
          <Text
            color={colors.white}
            mt={15}
            weight="bold"
            size={27}
            align="center">
            심적으로 나를{'\n'}
            편안하게 만들어 주는 친구는?
          </Text>
        </View>
        <View>
          <PollFriendItem
            percent={selected === null ? undefined : 30}
            selected={selected === 0}
            color={props.pointColor}
            onPress={() => {
              setSelected(s => (s === null ? 0 : null));
            }}
            mb={15}
          />
          <PollFriendItem
            percent={selected === null ? undefined : 10}
            selected={selected === 1}
            color={props.pointColor}
            onPress={() => {
              setSelected(s => (s === null ? 1 : null));
            }}
            mb={15}
          />
          <PollFriendItem
            percent={selected === null ? undefined : 60}
            selected={selected === 2}
            color={props.pointColor}
            onPress={() => {
              setSelected(s => (s === null ? 2 : null));
            }}
            mb={15}
          />
          <PollFriendItem
            percent={selected === null ? undefined : 95}
            selected={selected === 3}
            color={props.pointColor}
            onPress={() => {
              setSelected(s => (s === null ? 3 : null));
            }}
          />
        </View>
      </View>

      <View style={[styles.footer, {paddingBottom: insets.bottom + 20}]}>
        <TouchableOpacity style={styles.footerButton}>
          <WithLocalSvg width={20} height={16} asset={svgs.shuffle} />
          <Text ml={7} color={colors.white} size={12}>
            질문 건너뛰기
          </Text>
        </TouchableOpacity>

        <View style={styles.footerDivider} />

        <TouchableOpacity style={styles.footerButton}>
          <WithLocalSvg width={14} height={14} asset={svgs.refresh} />
          <Text ml={7} color={colors.white} size={12}>
            친구 다시찾기
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {flex: 1, alignItems: 'center', justifyContent: 'space-evenly'},
  titleArea: {
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerDivider: {
    width: 1,
    height: 18,
    backgroundColor: colors.white,
    marginHorizontal: 30,
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default PollingTemplate;
