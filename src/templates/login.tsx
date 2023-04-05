import React from 'react';
import {useEffect, useRef} from 'react';
import {Controller, UseFormReturn} from 'react-hook-form';
import {
  GestureResponderEvent,
  KeyboardAvoidingView,
  StatusBar,
  StyleSheet,
  TextInput as RNTextInput,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {WithLocalSvg} from 'react-native-svg';
import {Button} from '../components/button';
import {TextButton} from '../components/button/text-button';
import {Errors} from '../components/errors';
import {Gif} from '../components/image';
import {TextInput} from '../components/input';
import {colors, constants, gifs, svgs} from '../libs/common';
import {LoginForm} from '../libs/interfaces';
import {useKeyboardShown} from '../hooks/use-keyboard';

type LoginTemplateProps = {
  form: UseFormReturn<LoginForm>;

  onFindPassword: (e: GestureResponderEvent) => void;
  onFirst: (e: GestureResponderEvent) => void;
  onSubmit: () => void;
};

function LoginTemplate(props: LoginTemplateProps): JSX.Element {
  const keyboardShown = useKeyboardShown();
  const insets = useSafeAreaInsets();
  const usernameRef = useRef<RNTextInput>(null);
  const passwordRef = useRef<RNTextInput>(null);

  const hasUsername = props.form.watch().hasUsername;

  const handleUsernamePress = () => {
    if (hasUsername) {
      props.form.setValue('password', '');
      props.form.clearErrors('password');
      props.form.setValue('hasUsername', false);
      usernameRef.current?.focus();
    }
  };

  useEffect(() => {
    if (hasUsername) {
      passwordRef.current?.focus();
    }
  }, [hasUsername]);

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      {...(constants.platform === 'ios' ? {behavior: 'padding'} : undefined)}>
      <View style={[styles.root, {paddingTop: insets.top}]}>
        <StatusBar barStyle="dark-content" backgroundColor={'#fff'} />
        <View style={styles.body}>
          <View style={[styles.header]}>
            <WithLocalSvg width={58} height={30} asset={svgs.logo} />
            <WithLocalSvg
              width={76}
              height={20}
              style={styles.logo}
              fill={colors.dark}
              asset={svgs.logoLetterBlack}
            />

            <Gif source={gifs.wavingHand} style={styles.waving} />
          </View>

          <View>
            <Controller
              control={props.form.control}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  inputRef={usernameRef}
                  disabled={hasUsername}
                  onPress={handleUsernamePress}
                  disabledAutoCapitalize
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  disabledBorderBottomRadius={hasUsername}
                  disabledBorderBottom={hasUsername}
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    props.onSubmit();
                  }}
                  placeholder="feanut ID를 입력해 주세요"
                />
              )}
              name="username"
            />
            {hasUsername && (
              <Controller
                control={props.form.control}
                render={({field: {onChange, onBlur, value}}) => (
                  <TextInput
                    disabledBorderTopRadius
                    inputRef={passwordRef}
                    secureTextEntry
                    disabledAutoCapitalize
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    returnKeyType="next"
                    onSubmitEditing={() => {
                      props.onSubmit();
                    }}
                    placeholder="비밀번호"
                  />
                )}
                name="password"
              />
            )}
            <View style={styles.inputToolbar}>
              <View>
                <Errors
                  mt={15}
                  errors={[
                    props.form.formState.errors.username?.message as string,
                    props.form.formState.errors.password?.message as string,
                  ]}
                />
              </View>

              <View style={styles.tools}>
                {!hasUsername && (
                  <TextButton
                    fontSize={12}
                    hiddenBorder
                    onPress={props.onFirst}
                    title="feanut이 처음이신가요?"
                  />
                )}
                {hasUsername && (
                  <TextButton
                    color={colors.darkGrey}
                    hiddenBorder
                    onPress={props.onFindPassword}
                    title="비밀번호를 잊으셨나요?"
                  />
                )}
              </View>
            </View>
          </View>

          <Button
            disabled={
              Boolean(props.form.formState.errors.username) ||
              Boolean(props.form.formState.errors.password)
            }
            onPress={props.onSubmit}
            title={hasUsername ? '로그인' : '시작하기'}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  inputToolbar: {
    flexDirection: 'row',
    minHeight: 42,
    justifyContent: 'space-between',
  },
  keyboardView: {
    flex: 1,
  },
  root: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  header: {
    alignItems: 'center',
  },
  logo: {marginTop: 9},
  waving: {
    marginTop: 50,
  },
  body: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'space-around',
  },
  tools: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {},
});

export default LoginTemplate;
