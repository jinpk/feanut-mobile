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
import {colors, gifs} from '../../libs/common';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import {getObjectURLByKey} from '../../libs/common/file';
import {useIsFocused} from '@react-navigation/native';
import {Text} from '../../components/text';
import {PollingReceiveItemWrap} from '../../libs/interfaces/polling';

dayjs.extend(utc);
dayjs.extend(timezone);

type InboxTemplateProps = {
  data: PollingReceiveItemWrap[];
  onItemPress: (item: PollingReceiveItemWrap, index: number) => void;
  onLoadMore: () => void;
  onRefresh: () => void;
  loading: boolean;
  name: string;

  // select mode
  editMode?: boolean;
  onSelect?: (id: any) => void;
};

function InboxTemplate(props: InboxTemplateProps) {
  const insets = useSafeAreaInsets();
  const focused = useIsFocused();

  const handleKeyExtractor = useCallback(
    (item: PollingReceiveItemWrap, index: number) => {
      return index.toString();
    },
    [],
  );

  const handleRenderItem = useCallback(
    ({item, index}: {item: PollingReceiveItemWrap; index: number}) => {
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
          selected={item.selected}
          selectMode={props.editMode}
          onSelect={() => {
            if (props.onSelect) {
              props.onSelect(item._id);
            }
          }}
          index={index}
          contentText={item.contentText!}
          source={
            item.imageFileKey
              ? {uri: getObjectURLByKey(item.imageFileKey, '70')}
              : undefined
          }
          onPress={() => {
            props.onItemPress(item, index);
          }}
          isOpened={Boolean(item.isOpened)}
          name={item.name}
          gender={item.gender}
          time={time}
          emotion={item.emotion}
        />
      );
    },
    [focused],
  );

  const handleRefresh = useCallback(() => {
    props.onRefresh();
  }, []);

  const handleGetItemLayout = useCallback((_: any, index: number) => {
    return {length: 85, offset: 85 * index, index};
  }, []);

  return (
    <FlatList
      data={props.data}
      showsVerticalScrollIndicator={false}
      extraData={props.data}
      keyExtractor={handleKeyExtractor}
      renderItem={handleRenderItem}
      contentContainerStyle={styles.list}
      onEndReached={props.onLoadMore}
      bounces={true}
      onEndReachedThreshold={0.1}
      getItemLayout={handleGetItemLayout}
      ListFooterComponent={
        <View
          style={[
            styles.loadingWrap,
            {opacity: props.data.length && props.loading ? 1 : 0},
          ]}>
          <ActivityIndicator color={colors.primary} />
        </View>
      }
      ListHeaderComponent={
        !props.editMode && (
          <Text align="center" color={colors.darkGrey} mx={36} mt={15}>
            나를 투표한 친구를 확인하지 않은 투표는{'\n'}
            3일이 지나면 확인할 수 없어요.
          </Text>
        )
      }
      refreshControl={
        <RefreshControl
          tintColor={colors.primary}
          refreshing={false}
          onRefresh={handleRefresh}
        />
      }
      ListEmptyComponent={
        !props.editMode && !props.loading ? (
          <View style={[styles.empty, {paddingTop: insets.top}]}>
            <Information
              icon={gifs.hatchingChick}
              message={`친구들이 투표하고 있어요.`}
              subMessage={`${props.name} 님이 선택되면\n알림으로 알려드릴게요!`}
              markingText="알림"
            />
          </View>
        ) : undefined
      }
    />
  );
}

const styles = StyleSheet.create({
  empty: {
    marginTop: '40%',
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
  loadingWrap: {position: 'absolute', bottom: 0, alignSelf: 'center'},
});

export default InboxTemplate;
