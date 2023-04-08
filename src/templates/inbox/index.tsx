import dayjs from 'dayjs';
import {useCallback} from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Information, PullItem} from '../../components';
import {Text} from '../../components/text';
import {BackTopBar} from '../../components/top-bar';
import {colors, constants, gifs} from '../../libs/common';
import {PollingReceiveItem} from '../../libs/interfaces/polling';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import {configs} from '../../libs/common/configs';

dayjs.extend(utc);
dayjs.extend(timezone);

type InboxTemplateProps = {
  onBack: () => void;
  data: PollingReceiveItem[];
  onItemPress: (item: PollingReceiveItem, index: number) => void;
  onLoadMore: () => void;
  onRefresh: () => void;
  loading: boolean;
};

function InboxTemplate(props: InboxTemplateProps) {
  const insets = useSafeAreaInsets();

  const handleKeyExtractor = useCallback(
    (item: PollingReceiveItem, index: number) => {
      return index.toString();
    },
    [],
  );

  const handleRenderItem = useCallback(
    ({item, index}: {item: PollingReceiveItem; index: number}) => {
      let time = '';
      const seconds = dayjs().diff(dayjs(item.completedAt), 'seconds');
      if (seconds < 60) {
        time = `${seconds}초 전`;
      } else if (seconds / 60 < 60) {
        time = `${Math.floor(seconds / 60)}분 전`;
      } else if (seconds / 60 / 60 < 24) {
        time = `${Math.floor(seconds / 60 / 60)}시간 전`;
      } else if (seconds / 60 / 60 / 24 < 8) {
        time = `${Math.floor(seconds / 60 / 60 / 24)}일 전`;
      } else {
        time = dayjs(item.completedAt).format('YYYY-MM-DD');
      }

      return (
        <PullItem
          source={
            item.imageFileKey
              ? {uri: configs.cdnBaseUrl + '/' + item.imageFileKey}
              : undefined
          }
          onPress={() => {
            props.onItemPress(item, index);
          }}
          isOpened={Boolean(item.isOpened)}
          name={item.name}
          gender={item.gender}
          time={time}
        />
      );
    },
    [],
  );

  const handleRefresh = useCallback(() => {
    props.onRefresh();
  }, []);

  const handleGetItemLayout = useCallback((_: any, index: number) => {
    return {length: 85, offset: 85 * index, index};
  }, []);

  return (
    <View style={styles.root}>
      <BackTopBar logo onBack={props.onBack} />

      <Text weight="bold" size={18} mt={16} ml={16} mb={23}>
        수신함
      </Text>

      <FlatList
        data={props.data}
        extraData={props.data}
        keyExtractor={handleKeyExtractor}
        renderItem={handleRenderItem}
        contentContainerStyle={styles.list}
        onEndReached={props.onLoadMore}
        bounces={true}
        onEndReachedThreshold={0.1}
        getItemLayout={handleGetItemLayout}
        ListFooterComponent={
          props.data.length && props.loading ? (
            <ActivityIndicator color={colors.primary} />
          ) : undefined
        }
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          !props.loading ? (
            <View style={[styles.empty, {paddingTop: insets.top}]}>
              <Information
                icon={gifs.hatchingChick}
                message="회원님의 친구들이 투표하고 있어요!"
                subMessage={
                  '회원님이 투표에서 선택되면\n알림으로 알려드릴게요!'
                }
                markingText="알림"
              />
            </View>
          ) : undefined
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  empty: {
    marginTop: constants.screenHeight / 5,
  },
  list: {paddingBottom: 7.5},
  sync: {
    borderRadius: 100,
    width: 42,
    height: 42,
    backgroundColor: colors.lightGrey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hiddenFriend: {paddingHorizontal: 16, paddingVertical: 15},
  loading: {position: 'absolute', alignSelf: 'center'},
});

export default InboxTemplate;
