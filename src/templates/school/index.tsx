import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, RefreshControl, StyleSheet, View} from 'react-native';
import {SearchInput} from '../../components/input';
import {BackTopBar} from '../../components/top-bar';
import {colors, gifs, pngs} from '../../libs/common';
import {ActivityIndicator} from 'react-native';
import {School} from '../../libs/interfaces/school';
import {SchoolItem} from '../../components/school-item';
import {Gif} from '../../components/image';
import {Text} from '../../components/text';
import {Divider} from '../../components';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type SchoolTemplateProps = {
  onBack: () => void;
  data: School[];

  onItemPress: (item: School, index: number) => void;
  onLoadMore: () => void;
  onRefresh: () => void;
  loading: boolean;

  onKeyword: (text: string) => void;
  keyword: string;
  fetching: boolean;
};

export const SchoolTemplate = (props: SchoolTemplateProps) => {
  const insets = useSafeAreaInsets();
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

  const handleKeyExtractor = useCallback((item: School, index: number) => {
    return index.toString();
  }, []);

  const handleRenderItem = useCallback(
    ({item, index}: {item: School; index: number}) => {
      return (
        <SchoolItem
          name={item.name}
          address={item.sido + ' ' + item.sigungu}
          join={item.joinedCount}
          onPress={() => {
            props.onItemPress(item, index);
          }}
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
    <View style={[styles.root, {paddingBottom: insets.bottom}]}>
      <BackTopBar onBack={props.onBack} />
      <Text weight="bold" size={18} mt={15} mx={16}>
        학교를 선택해 주세요
      </Text>
      <SearchInput
        value={keyword}
        onChange={setKeyword}
        maxLength={10}
        placeholder="학교 검색"
        returnKeyType="search"
        mx={16}
        mt={24}
      />

      <Divider mx={16} mt={8} />

      <FlatList
        data={props.data}
        extraData={props.data}
        keyboardShouldPersistTaps="handled"
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
        ListEmptyComponent={
          <View style={styles.empty}>
            {props.fetching || (keyword && props.loading) ? (
              <ActivityIndicator color={colors.primary} />
            ) : !props.fetching && keyword ? (
              <>
                <Gif source={gifs.hatchingChick} />
                <Text align="center" mt={14}>
                  검색된 학교가 없어요
                </Text>
              </>
            ) : (
              <>
                <Gif source={pngs.school} size={54} />
                <Text align="center" mt={14}>
                  학교를 등록하고{'\n'}
                  학교 친구들과 소통해보세요!
                </Text>
              </>
            )}
          </View>
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
  loading: {position: 'absolute', alignSelf: 'center'},
  labelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingWrap: {position: 'absolute', bottom: 0, alignSelf: 'center'},
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '33%',
  },
});
