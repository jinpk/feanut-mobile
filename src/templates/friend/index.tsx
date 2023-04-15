import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {WithLocalSvg} from 'react-native-svg';
import {Divider, FriendItem} from '../../components';
import {SearchInput} from '../../components/input';
import {Text} from '../../components/text';
import {BackTopBar} from '../../components/top-bar';
import {colors, svgs} from '../../libs/common';
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

  const renderHeader = () => {
    return (
      <View>
        <SearchInput
          value={keyword}
          onChange={setKeyword}
          maxLength={10}
          placeholder="검색"
          returnKeyType="search"
          mx={16}
          mb={15}
        />

        {props.hiddenFriend && (
          <View style={styles.labelWrap}>
            <Text color={colors.darkGrey} size={12} ml={16}>
              {props.keyword ? '검색 결과' : '숨김친구'}
            </Text>
            <Text color={colors.darkGrey} weight="medium" ml={2} size={12}>
              {props.totalCount}
            </Text>
          </View>
        )}
        {!props.hiddenFriend && (
          <View>
            {props.keyword?.length === 0 && (
              <>
                <Text color={colors.darkGrey} size={12} mx={16}>
                  동기화
                </Text>
                <Divider mt={8} mb={7.5} mx={16} />
                <FriendItem
                  name="연락처 동기화"
                  button="동기화"
                  buttonColor={colors.blue}
                  buttonLoading={props.synchronizing}
                  onButtonPress={props.onSyncContact}
                  icon={
                    <View style={styles.sync}>
                      <WithLocalSvg width={16} height={16} asset={svgs.sync} />
                    </View>
                  }
                />
              </>
            )}

            <View
              style={[
                styles.labelWrap,
                {marginTop: props.keyword?.length > 0 ? 0 : 22.5},
              ]}>
              <Text color={colors.darkGrey} size={12} ml={16}>
                {props.keyword ? '검색 결과' : '친구'}
              </Text>
              <Text color={colors.darkGrey} weight="medium" ml={2} size={12}>
                {props.totalCount}
              </Text>
            </View>
            <Divider mt={8} mb={7.5} mx={16} />
          </View>
        )}
      </View>
    );
  };

  const handleKeyExtractor = useCallback((item: Friend, index: number) => {
    return index.toString();
  }, []);

  const handleRenderItem = useCallback(
    ({item, index}: {item: Friend; index: number}) => {
      return (
        <FriendItem
          {...item}
          onPress={() => {
            props.onItemPress(item, index);
          }}
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
      <Text weight="bold" size={18} mt={16} ml={16} mb={7}>
        {props.hiddenFriend ? '숨김친구 목록' : '친구 목록'}
      </Text>

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
            <ActivityIndicator color={colors.primary} />
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
  labelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
