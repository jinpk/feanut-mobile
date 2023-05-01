import React, {PropsWithChildren, useCallback, useEffect, useRef} from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {constants} from '../libs/common';

type PagerProps = PropsWithChildren<{
  page: number;
  onPageChange: (page: number) => void;
}>;

export default function Pager(props: PagerProps) {
  const pagerRef = useRef<ScrollView>(null);

  useEffect(() => {
    pagerRef.current?.scrollTo({
      x: (props.page - 1) * constants.screenWidth,
    });
  }, [props.page]);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      props.onPageChange(
        Math.round(
          parseFloat(
            String(
              e.nativeEvent.contentOffset.x /
                e.nativeEvent.layoutMeasurement.width,
            ),
          ),
        ) + 1,
      );
    },
    [],
  );

  return (
    <View style={styles.root}>
      <ScrollView
        onMomentumScrollEnd={handleScroll}
        ref={pagerRef}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        horizontal>
        {React.Children.map(props.children, (child, index) => {
          return React.cloneElement(child, {
            style: {...child.props.style, ...styles.view},
            key: index.toString(),
            onLayout: () => {
              if (index + 1 === props.page) {
                pagerRef.current?.scrollTo({
                  x: (props.page - 1) * constants.screenWidth,
                });
              }
            },
          });
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  view: {
    width: constants.screenWidth,
  },
});
