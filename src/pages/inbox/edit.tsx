import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useMemo} from 'react';
import {useInbox} from '../../hooks';
import {colors, routes} from '../../libs/common';
import {PollingReceiveItem} from '../../libs/interfaces/polling';
import InboxTemplate from '../../templates/inbox';
import {useProfileStore} from '../../libs/stores';
import {TouchableOpacity, View} from 'react-native';
import {BackTopBar} from '../../components/top-bar';
import {StyleSheet} from 'react-native';
import {Text} from '../../components/text';

function InboxEdit(): JSX.Element {
  const navigation = useNavigation();
  const inbox = useInbox();
  const name = useProfileStore(s => s.profile.name);

  const handleItemPress = useCallback((item: PollingReceiveItem, _: number) => {
    navigation.navigate(routes.inboxDetail, {pollingId: item._id});
  }, []);

  const selectedCount = useMemo(() => {
    return inbox.pulls.filter(x => x.selected).length;
  }, [inbox.pulls]);

  return (
    <View style={styles.root}>
      <BackTopBar
        onBack={navigation.goBack}
        title="편집"
        rightComponent={
          <TouchableOpacity
            onPress={inbox.deletePulls}
            disabled={!selectedCount || inbox.deleting}
            style={styles.deletion}>
            <Text mr={2} color={colors.primary}>
              {selectedCount}
            </Text>
            <Text>선택삭제</Text>
          </TouchableOpacity>
        }
      />
      <InboxTemplate
        editMode
        onSelect={inbox.select}
        data={inbox.pulls}
        onItemPress={handleItemPress}
        onLoadMore={inbox.nextPage}
        loading={inbox.loading}
        onRefresh={inbox.refresh}
        name={name}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  deletion: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
});

export default InboxEdit;
