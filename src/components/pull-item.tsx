import React, {memo, useMemo} from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Source} from 'react-native-fast-image';
import {colors, emotionBackgorundColor, emotions, pngs} from '../libs/common';
import {Gender} from '../libs/interfaces';
import {Text} from './text';
import {Gif} from './image';

type PollingItemProps = {
  source?: Source;
  gender: Gender;
  name?: string;
  isOpened: boolean;
  time: string;
  index: number;
  emotion: emotions;
  contentText: string;
  onPress: () => void;

  selectMode?: boolean;
  onSelect?: () => void;
  selected?: boolean;
};

export const PullItem = memo(function (props: PollingItemProps): JSX.Element {
  const backgroundColor = useMemo(() => {
    return emotionBackgorundColor[props.emotion];
  }, [props.emotion]);

  const renderContent = () => {
    return (
      <>
        <Gif size={28} source={props.isOpened ? pngs.opened : pngs.closed} />
        <View style={styles.contentName}>
          <View style={styles.row}>
            <Image
              source={props.gender === 'male' ? pngs.male : pngs.female}
              style={
                props.gender === 'male' ? styles.genderMale : styles.gender
              }
            />
            <Text color={colors.white} ml={14}>
              {props.isOpened
                ? props.name
                : props.gender === 'male'
                ? '남자'
                : '여자'}
            </Text>
          </View>
          <Text
            mt={7.25}
            color={colors.white}
            size={props.contentText?.split('\n').length === 3 ? 14 : 16}
            weight="bold">
            {props.contentText}
          </Text>
        </View>
        <View style={styles.time}>
          <Text color={colors.white} weight="medium" size={10}>
            {props.time}
          </Text>
        </View>

        <View style={styles.figureWrap}>
          <Image
            source={pngs[`pull-list-${props.emotion}`]}
            style={styles.figure}
          />
        </View>
      </>
    );
  };

  if (props.selectMode) {
    return (
      <TouchableWithoutFeedback onPress={props.onSelect}>
        <View style={styles.selectModeWrap}>
          <View
            style={[
              styles.selection,
              props.selected && styles.selectionSelected,
            ]}>
            {props.selected && <View style={styles.selected} />}
          </View>
          <View
            style={[
              styles.root,
              {backgroundColor, flex: 1},
              props.index === 0 && styles.rootFirst,
            ]}>
            {renderContent()}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[
        styles.root,
        {backgroundColor},
        props.index === 0 && styles.rootFirst,
      ]}>
      {renderContent()}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    overflow: 'hidden',
    marginHorizontal: 16,
    paddingHorizontal: 15,
    marginBottom: 15,
    paddingTop: 18,
    paddingBottom: 17,
  },
  selectModeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  contentName: {
    marginLeft: 20,
  },
  rootFirst: {
    marginTop: 16,
  },
  time: {
    position: 'absolute',
    right: 15,
    top: 20,
  },
  row: {flexDirection: 'row', alignItems: 'center'},
  gender: {
    width: 10,
    height: 18,
    marginLeft: 7,
  },
  genderMale: {width: 14, height: 14, marginLeft: 4},
  figureWrap: {
    zIndex: -1,
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
  },
  figure: {
    height: '100%',
    resizeMode: 'stretch',
  },
  selection: {
    width: 18,
    height: 18,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.darkGrey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    backgroundColor: colors.primary,
    width: 11.25,
    height: 11.25,
    borderRadius: 100,
  },
  selectionSelected: {
    borderColor: colors.primary,
  },
});
