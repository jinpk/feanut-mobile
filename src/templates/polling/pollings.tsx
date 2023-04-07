import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  Alert,
  Animated,
  ScrollView,
  StyleSheet,
  useAnimatedValue,
  View,
} from 'react-native';
import {Polling} from '../../components/poll';
import {constants} from '../../libs/common';
import {InternalPolling} from '../../libs/interfaces/polling';

interface PollingRefStore {
  currentPollingIndex: number;
  pollingsCount: number;
  selected: boolean;
  pollingId?: string;
}

type PollingsTemplateProps = {
  onVote: () => void;
  onSkip: (pollingId: string) => void;
  onShuffle: (pollingId: string) => void;
  onFriendSelected: (pollingId: string, friendProfileId: string) => void;

  pollings: InternalPolling[];
  currentPollingIndex: number;
  initialPollingIndex: number;
};

function PollingsTemplate(props: PollingsTemplateProps) {
  const scollRef = useRef<ScrollView>(null);

  const opacity = useAnimatedValue(0);

  // stored poll information
  const pollingRefStore = useRef<PollingRefStore>({
    currentPollingIndex: 0,
    pollingsCount: 0,
    selected: false,
  });
  useEffect(() => {
    pollingRefStore.current.currentPollingIndex = props.currentPollingIndex;
    pollingRefStore.current.pollingsCount = props.pollings.length;
    const currenPolling = props.pollings[props.currentPollingIndex];
    pollingRefStore.current.pollingId = currenPolling?.pollingId;
    pollingRefStore.current.selected = currenPolling
      ? Boolean(currenPolling.selectedProfileId)
      : false;
  }, [props.pollings, props.currentPollingIndex]);

  const [layoutInitedCount, setLayoutInitedCount] = useState(0);

  // 폴링 index 스크롤 이동
  useEffect(() => {
    scollRef.current?.scrollTo({
      animated: true,
      x: constants.screenWidth * props.currentPollingIndex,
    });
  }, [props.currentPollingIndex, props.pollings.length]);

  const isFriendSelected = useMemo(() => {
    return Boolean(
      props.pollings[props.currentPollingIndex]?.selectedProfileId,
    );
  }, [props.currentPollingIndex, props.pollings]);

  // 첫번째 투표에서만 친구 선택하면 다음 투표 스크롤 가이드
  useEffect(() => {
    if (isFriendSelected && props.currentPollingIndex < 1) {
      let tm = setTimeout(() => {
        scollRef.current?.scrollTo({
          x: props.currentPollingIndex * constants.screenWidth + 80,
          animated: true,
        });
        clearTimeout(tm);
        tm = setTimeout(() => {
          scollRef.current?.scrollTo({
            x: props.currentPollingIndex * constants.screenWidth,
            animated: true,
          });
        }, 1000);
      }, 1000);

      return () => {
        clearTimeout(tm);
      };
    }
  }, [isFriendSelected, props.currentPollingIndex]);

  useEffect(() => {
    if (layoutInitedCount === props.pollings.length) {
      scollRef.current?.scrollTo({
        animated: false,
        x: constants.screenWidth * props.initialPollingIndex,
      });
      Animated.timing(opacity, {
        duration: 1000,
        useNativeDriver: true,
        toValue: 1,
      }).start(result => {
        if (!result.finished) {
          opacity.setValue(1);
        }
      });
    } else {
      opacity.setValue(0);
    }
  }, [layoutInitedCount, props.pollings.length, props.initialPollingIndex]);

  return (
    <Animated.View style={[styles.root, {opacity}]}>
      <ScrollView
        horizontal
        ref={scollRef}
        pagingEnabled
        scrollEnabled={false}
        removeClippedSubviews
        showsHorizontalScrollIndicator={false}>
        {props.pollings.map((x, i) => {
          return (
            <View
              style={styles.polling}
              key={i.toString()}
              onLayout={() => {
                setLayoutInitedCount(prev => prev + 1);
              }}>
              {Boolean(x.pollingId) && (
                <Polling
                  focused={props.currentPollingIndex === i}
                  emotion={x.emotion || ''}
                  title={x.title || ''}
                  iconURI={x.emojiURI!}
                  friends={x.friends}
                  selectedFriend={x.selectedProfileId}
                  onSelected={(friendProfileId: string) => {
                    props.onFriendSelected(x.pollingId!, friendProfileId);
                  }}
                  onSkip={() => {
                    props.onSkip(x.pollingId!);
                  }}
                  onShuffle={() => {
                    props.onShuffle(x.pollingId!);
                  }}
                  onNext={() => {
                    // 친구선택후 다음투표로 이동 가능
                    if (!pollingRefStore.current.selected) {
                      Alert.alert(
                        '투표 알림',
                        '질문을 건너뛰거나 친구를 투표해 주세요!',
                      );
                    } else {
                      // 투표 저장
                      props.onVote();
                    }
                  }}
                />
              )}
            </View>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  polling: {
    flex: 1,
    width: constants.screenWidth,
  },
});

export default PollingsTemplate;
