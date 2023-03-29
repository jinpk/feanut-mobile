import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {WithLocalSvg} from 'react-native-svg';
import {Divider, FriendItem} from '../../components';
import {Gif} from '../../components/image';
import {SearchInput} from '../../components/input';
import {Text} from '../../components/text';
import {BackTopBar} from '../../components/top-bar';
import {colors, gifs, svgs} from '../../libs/common';
import {Friend} from '../../libs/interfaces';

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
};

export const FreidnsListTemplate = (props: FreidnsListTemplateProps) => {
  const insets = useSafeAreaInsets();
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    setKeyword(props.keyword || '');
  }, [props.keyword]);

  useEffect(() => {
    if (keyword && keyword.length < 2) {
      return;
    }
    let tm = setTimeout(() => {
      props.onKeyword(keyword);
    }, 1000 );
    return () => {
      clearTimeout(tm);
    };
  }, [keyword]);

  const renderHeader = useCallback(() => {
    return (
      <View>
        {props.hiddenFriend && (
          <View>
            <Text color={colors.darkGrey} size={12} mx={16}>
              숨김친구
            </Text>
            <Divider mt={8} mb={7.5} mx={16} />
          </View>
        )}
        {!props.hiddenFriend && (
          <View>
            <Text color={colors.darkGrey} size={12} mx={16}>
              동기화
            </Text>
            <Divider mt={8} mb={7.5} mx={16} />
            <FriendItem
              name="연락처 동기화"
              button="동기화"
              buttonColor={colors.blue}
              onButtonPress={props.onSyncContact}
              icon={
                <View style={styles.sync}>
                  <WithLocalSvg width={16} height={16} asset={svgs.sync} />
                </View>
              }
            />
            <Text color={colors.darkGrey} size={12} mx={16} mt={22.5}>
              친구
            </Text>
            <Divider mt={8} mb={7.5} mx={16} />
          </View>
        )}
      </View>
    );
  }, [props.hiddenFriend]);

  const handleKeyExtractor = useCallback((item: Friend, index: number) => {
    return index.toString();
  }, []);

  const handleItemPress = useCallback(
    (item: Friend, index: number) => () => {
      props.onItemPress(item, index);
    },
    [],
  );

  const handleRenderItem = useCallback(
    ({item, index}: {item: Friend; index: number}) => {
      return (
        <FriendItem
          {...item}
          onPress={handleItemPress(item, index)}
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
    <View style={styles.root}>
      <BackTopBar
        logo
        onBack={props.onBack}
        rightComponent={
          !props.hiddenFriend ? (
            <TouchableOpacity
              onPress={props.onHiddenFriend}
              style={styles.hiddenFriend}>
              <Text color={colors.darkGrey}>숨김친구</Text>
            </TouchableOpacity>
          ) : undefined
        }
      />
      <Text weight="bold" size={18} mt={16} ml={16}>
        {props.hiddenFriend ? '숨김친구 목록' : '친구 목록'}
      </Text>

      <SearchInput
        value={keyword}
        onChange={setKeyword}
        maxLength={10}
        placeholder="검색"
        mt={7}
        returnKeyType="search"
        mx={16}
        mb={15}
      />

      <FlatList
        data={props.data}
        extraData={props.data}
        ListHeaderComponent={renderHeader}
        keyExtractor={handleKeyExtractor}
        renderItem={handleRenderItem}
        contentContainerStyle={styles.list}
        onEndReached={props.onLoadMore}
        bounces={true}
        onEndReachedThreshold={0.1}
        getItemLayout={handleGetItemLayout}
        ListFooterComponent={
          props.data.length && props.loading ? (
            <Gif
              size={24}
              source={gifs.dolphin}
              style={[styles.loading, {bottom: insets.bottom + 5}]}
            />
          ) : undefined
        }
        refreshControl={
          <RefreshControl
            tintColor={colors.primary}
            refreshing={false}
            onRefresh={handleRefresh}
          />
        }
      />
    </View>
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
});
