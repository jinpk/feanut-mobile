import React, {useCallback, useMemo} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {WithLocalSvg} from 'react-native-svg';
import colors from '../libs/colors';
import {svgs, gifs} from '../libs/images';
import {Gif} from '../components/image';
import {Text} from '../components/text';
import {PollFriendItem} from '../components';
import emotions, {
  emotionBackgorundColor,
  emotionPointColor,
} from '../libs/emotions';

export type PollingFriendValue = string;

interface PollingFriend {
  value: PollingFriendValue;
}

type PollingTemplateProps = {
  emotion: emotions;
  focused: boolean;
  selectedFriend: PollingFriendValue;
  onFriendSelected: (value: PollingFriendValue) => void;
  friends: PollingFriend[];
};

function PollingTemplate(props: PollingTemplateProps): JSX.Element {
  const insets = useSafeAreaInsets();

  const handleFriendSelect = useCallback(
    (friend: PollingFriend) => () => {
      props.onFriendSelected(friend.value);
    },
    [props.onFriendSelected],
  );

  const backgroundColor = useMemo((): string => {
    return emotionBackgorundColor[props.emotion];
  }, [props.emotion]);

  const pointColor = useMemo((): string => {
    return emotionPointColor[props.emotion];
  }, [props.emotion]);

  const renderFigure = useCallback(() => {
    type svgProps = {
      asset: number;
      style: object;
    };
    const svgProps: svgProps = {
      asset: 0,
      style: {},
    };
    if (props.emotion === emotions.happiness) {
      svgProps.asset = svgs.figureHappiness;
      svgProps.style = figureStyles.rightBottom;
    } else if (props.emotion === emotions.gratitude) {
      svgProps.asset = svgs.figureGratitude;
      svgProps.style = figureStyles.leftBottom;
    } else if (props.emotion === emotions.serenity) {
      svgProps.asset = svgs.figureSerenity;
      svgProps.style = figureStyles.rightBottom;
    } else if (props.emotion === emotions.interest) {
      svgProps.asset = svgs.figureInterest;
      svgProps.style = figureStyles.leftBottom;
    } else if (props.emotion === emotions.hope) {
      svgProps.asset = svgs.figureHope;
      svgProps.style = figureStyles.rightBottom;
    } else if (props.emotion === emotions.pride) {
      svgProps.asset = svgs.figurePride;
      svgProps.style = figureStyles.rightBottom;
    } else if (props.emotion === emotions.amusement) {
      svgProps.asset = svgs.figureAmusement;
      svgProps.style = figureStyles.leftBottom;
    } else if (props.emotion === emotions.inspiration) {
      svgProps.asset = svgs.figureInspiration;
      svgProps.style = figureStyles.rightBottom;
    } else if (props.emotion === emotions.awe) {
      svgProps.asset = svgs.figureAwe;
      svgProps.style = figureStyles.leftBottom;
    } else if (props.emotion === emotions.love) {
      svgProps.asset = svgs.figureLove;
      svgProps.style = figureStyles.leftBottom;
    }

    return <WithLocalSvg {...svgProps} />;
  }, [props.emotion]);

  return (
    <View style={[styles.root, {backgroundColor}]}>
      {renderFigure()}
      <View style={[styles.header, {paddingTop: insets.top + 7}]}>
        <WithLocalSvg
          width={67}
          height={35}
          color={pointColor}
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
          {props.friends.map((x, i) => {
            return (
              <PollFriendItem
                key={i.toString()}
                percent={props.selectedFriend ? 30 : undefined}
                selected={props.selectedFriend === x.value}
                color={pointColor}
                onPress={handleFriendSelect(x)}
                mb={i === 3 ? 0 : 15}
              />
            );
          })}
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

const figureStyles = StyleSheet.create({
  rightBottom: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  leftBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
});

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
