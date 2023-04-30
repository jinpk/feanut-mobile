import React, {RefObject, useMemo} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {WithLocalSvg} from 'react-native-svg';
import {Text} from '../components/text';
import {BackTopBar} from '../components/top-bar';
import {colors, constants, emotions, svgs} from '../libs/common';
import ViewShot from 'react-native-view-shot';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {FeanutCard} from '../libs/interfaces/polling';
import {objectToArrWithSorting} from '../libs/common/utils';
import {FeanutCardItem} from '../components/feanut-card';

type FeanutCardTemplateProps = {
  drawViewRef: RefObject<ViewShot>;

  onBack: () => void;
  onShare: () => void;

  feanutCard?: FeanutCard;

  name: string;
};

function FeanutCardTemplate(props: FeanutCardTemplateProps) {
  const insets = useSafeAreaInsets();

  const list = useMemo(() => {
    if (!props.feanutCard) return [];
    return objectToArrWithSorting(props.feanutCard);
  }, [props.feanutCard]);

  return (
    <View style={styles.root}>
      <BackTopBar onBack={props.onBack} title={'피넛 카드'} />
      {list.length >= 1 && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <ViewShot
            ref={props.drawViewRef}
            style={styles.content}
            options={{format: 'jpg', quality: 0.7}}>
            <FeanutCardItem
              name={props.name}
              width={constants.screenWidth - 32}
              horizontalLarge
              emotion={list[0].key as emotions}
              value={list[0].value}
            />

            {list
              .filter((_, i) => i !== 0)
              .map((x, i) => {
                return (
                  <FeanutCardItem
                    mt={13}
                    mr={(i + 1) % 3 === 0 ? 0 : 13}
                    width={(constants.screenWidth - 58) / 3}
                    key={i.toString()}
                    emotion={x.key as emotions}
                    value={x.value}
                  />
                );
              })}
          </ViewShot>

          <TouchableOpacity
            onPress={props.onShare}
            style={[styles.share, {marginBottom: insets.bottom + 35}]}>
            <WithLocalSvg
              width={12}
              height={15}
              asset={svgs.share}
              //asset={props.me ? svgs.share : svgs.visitSNS}
              style={styles.shareIcon}
            />
            <Text size={12}>{'자랑하기'}</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: colors.white,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 20,
    flexWrap: 'wrap',
  },
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  body: {
    flex: 1,
    backgroundColor: colors.white,
  },
  share: {
    backgroundColor: colors.lightGrey,
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 21,
    paddingVertical: 14,
    alignSelf: 'center',
    paddingLeft: 55,
    paddingHorizontal: 43,
  },
  shareIcon: {
    position: 'absolute',
    left: 21,
  },
});

export default FeanutCardTemplate;
