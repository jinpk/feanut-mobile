import React, {useCallback} from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {WithLocalSvg} from 'react-native-svg';
import {Divider, FriendItem} from '../../components';
import {Text} from '../../components/text';
import {BackTopBar} from '../../components/top-bar';
import {colors, svgs} from '../../libs/common';
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
};

export const FreidnsListTemplate = (props: FreidnsListTemplateProps) => {
  const renderHeader = useCallback(() => {
    if (props.hiddenFriend) {
      return (
        <View>
          <Text color={colors.darkGrey} size={12} mx={16}>
            숨김친구
          </Text>
          <Divider mt={8} mb={7.5} mx={16} />
        </View>
      );
    } else {
      return (
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
      );
    }
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
      <Text weight="bold" size={18} mt={16} mb={30} ml={16}>
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
});
