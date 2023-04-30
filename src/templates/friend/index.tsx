import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, RefreshControl, StyleSheet, View} from 'react-native';
import {FriendItem} from '../../components';
import {SearchInput} from '../../components/input';
import {colors} from '../../libs/common';
import {Friend} from '../../libs/interfaces';
import {ActivityIndicator} from 'react-native';

type FreidnsListTemplateProps = {
  onBack: () => void;
  hiddenFriend: boolean;
  data: Friend[];
  onItemPress: (item: Friend, index: number) => void;
  onHide: (item: Friend, index: number) => void;
  onUnHide: (item: Friend, index: number) => void;
  onSyncContact: () => void;
  onLoadMore: () => void;
  onHiddenFriend: () => void;
  onRefresh: () => void;
  loading: boolean;
  onKeyword: (text: string) => void;
  keyword: string;

  totalCount: number;

  synchronizing: boolean;
};

export const FreidnsListTemplate = (props: FreidnsListTemplateProps) => {
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    setKeyword(props.keyword || '');
  }, [props.keyword]);

  useEffect(() => {
    let tm = setTimeout(() => {
      props.onKeyword(keyword);
    }, 500);
    return () => {
      clearTimeout(tm);
    };
  }, [keyword]);

  const handleKeyExtractor = useCallback((item: Friend, index: number) => {
    return index.toString();
  }, []);

  const handleRenderItem = useCallback(
    ({item, index}: {item: Friend; index: number}) => {
      return (
        <FriendItem
          {...item}
          onPress={
            !item.hidden
              ? () => {
                  props.onItemPress(item, index);
                }
              : undefined
          }
          onButtonPress={() => {
            if (item.hidden) {
              props.onUnHide(item, index);
            } else {
              props.onHide(item, index);
            }
          }}
          button={item.hidden ? '활성' : '숨김'}
          buttonColor={item.hidden ? colors.blue : colors.darkGrey}
        />
      );
    },
    [],
  );

  const handleRefresh = useCallback(() => {
    props.onRefresh();
  }, []);

  const handleGetItemLayout = useCallback((_: any, index: number) => {
    return {length: 57, offset: 57 * index, index};
  }, []);

  return (
    <FlatList
      style={styles.root}
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
        <View
          style={[
            styles.loadingWrap,
            {opacity: props.data.length && props.loading ? 1 : 0},
          ]}>
          <ActivityIndicator color={colors.primary} />
        </View>
      }
      refreshControl={
        <RefreshControl
          tintColor={colors.primary}
          refreshing={false}
          onRefresh={handleRefresh}
        />
      }
      ListHeaderComponent={
        <>
          <SearchInput
            value={keyword}
            onChange={setKeyword}
            maxLength={10}
            placeholder="검색"
            returnKeyType="search"
            mx={16}
            mt={15}
            mb={15}
          />
          {props.loading && props.totalCount === 0 && (
            <ActivityIndicator color={colors.primary} />
          )}
        </>
      }
    />
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
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
  labelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingWrap: {position: 'absolute', bottom: 0, alignSelf: 'center'},
});
