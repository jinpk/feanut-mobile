import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, RefreshControl, StyleSheet, View} from 'react-native';
import {FriendItem} from '../../components';
import {SearchInput} from '../../components/input';
import {colors} from '../../libs/common';
import {Friend} from '../../libs/interfaces';
import {ActivityIndicator} from 'react-native';

type FreidnsListTemplateProps = {
  data: Friend[];

  onItemPress?: (item: Friend, index: number) => void;
  onItemButtonPress?: (item: Friend, index: number) => void;

  onLoadMore: () => void;
  onRefresh: () => void;
  loading: boolean;

  onKeyword: (text: string) => void;
  keyword: string;

  totalCount: number;
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
          onPress={() => {
            if (props.onItemPress) {
              props.onItemPress(item, index);
            }
          }}
          onButtonPress={() => {
            if (props.onItemButtonPress) {
              props.onItemButtonPress(item, index);
            }
          }}
          button={item.hidden ? '활성' : '숨김'}
          buttonColor={item.hidden ? colors.blue : colors.darkGrey}
        />
      );
    },
    [],
  );

  const handleGetItemLayout = useCallback((_: any, index: number) => {
    return {length: 57, offset: 57 * index, index};
  }, []);

  return (
    <FlatList
      data={props.data}
      extraData={props.data}
      keyExtractor={handleKeyExtractor}
      renderItem={handleRenderItem}
      contentContainerStyle={styles.list}
      keyboardShouldPersistTaps='handled'
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
          onRefresh={props.onRefresh}
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
  loading: {position: 'absolute', alignSelf: 'center'},
  labelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingWrap: {position: 'absolute', bottom: 0, alignSelf: 'center'},
});
/**<FriendItem
                    name="연락처 동기화"
                    button="동기화"
                    buttonColor={colors.blue}
                    onButtonPress={props.onSyncContact}
                    icon={
                      <View style={styles.sync}>
                        <WithLocalSvg
                          width={16}
                          height={16}
                          asset={svgs.sync}
                        />
                      </View>
                    }
                  /> */
