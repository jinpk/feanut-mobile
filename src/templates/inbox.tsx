import {useCallback} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {PollingItem} from '../components';
import {Text} from '../components/text';

type InboxTemplateProps = {};

const data = [1, 2, 34, 5, 6, 7, 8, 9, 34, 5, 6, 7, 8, 9];
type RenderItem = {
  item: number;
  index: number;
};

function InboxTemplate(props: InboxTemplateProps): JSX.Element {
  const handleKeyExtractor = useCallback((item: number, index: number) => {
    return index.toString();
  }, []);
  const handleRenderItem = useCallback(({item, index}: RenderItem) => {
    return <PollingItem />;
  }, []);
  return (
    <View style={styles.root}>
      <Text weight="bold" size={18} mt={16} mb={23} ml={16}>
        수신함
      </Text>
      <FlatList
        data={data}
        keyExtractor={handleKeyExtractor}
        renderItem={handleRenderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 16,
  },
});

export default InboxTemplate;
