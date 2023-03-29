import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Keyboard,
  LayoutChangeEvent,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {colors} from '../libs/common';

type KeyboardLayoutProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
}>;

export const KeyboardLayout = (props: KeyboardLayoutProps) => {
  const [rootHeight, setRootHeight] = useState(0);
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    let listener: any = Keyboard.addListener('keyboardDidShow', e => {
      setKeyboardHeight(e.endCoordinates.height);
      setScrollEnabled(true);
    });
    let listener2: any = Keyboard.addListener('keyboardDidHide', e => {
      setScrollEnabled(false);
    });
    return () => {
      listener.remove();
      listener = null;

      listener2.remove();
      listener2 = null;
    };
  }, []);

  const handleRootLayout = useCallback((event: LayoutChangeEvent) => {
    setRootHeight(event.nativeEvent.layout.height);
  }, []);

  return (
    <View style={[styles.root, props.style]} onLayout={handleRootLayout}>
      <ScrollView
        ref={scrollRef}
        keyboardShouldPersistTaps="handled"
        style={{backgroundColor: props.backgroundColor || colors.white}}
        showsVerticalScrollIndicator={false}
        scrollEnabled={scrollEnabled}>
        {Boolean(rootHeight) && (
          <View style={[styles.content, {height: rootHeight}]}>
            {props.children}
          </View>
        )}
        {scrollEnabled && (
          <View
            style={{height: keyboardHeight}}
            onLayout={() => {
              scrollRef.current?.scrollToEnd({animated: true});
            }}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {flex: 1},
  content: {
    alignSelf: 'stretch',
  },
});
