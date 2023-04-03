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

type LoginTemplateProps = {
  form: UseFormReturn<LoginForm>;

  onFindPassword: (e: GestureResponderEvent) => void;
  onFirst: (e: GestureResponderEvent) => void;
  onSubmit: (e: GestureResponderEvent) => void;
};

function LoginTemplate(props: LoginTemplateProps): JSX.Element {
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
        <View style={styles.header}>
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

        <View style={styles.body}>
          <View style={styles.inputWrap}>
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
                    placeholder="비밀번호"
                  />
                )}
                name="password"
              />
            )}
            <Errors
              errors={[
                props.form.formState.errors.username?.message as string,
                props.form.formState.errors.password?.message as string,
              ]}
            />
          </View>

          {!hasUsername && (
            <View style={styles.tools}>
              <TextButton
                hiddenBorder
                onPress={props.onFirst}
                title="feanut이 처음이신가요?"
              />
            </View>
          )}

          {hasUsername && (
            <View style={styles.tools}>
              <TextButton
                color={colors.darkGrey}
                hiddenBorder
                onPress={props.onFindPassword}
                title="비밀번호를 잊으셨나요?"
              />
            </View>
          )}
        </View>
        <View style={[styles.button]}>
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
  keyboardView: {
    flex: 1,
  },
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
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
    alignSelf: 'stretch',
    paddingHorizontal: 16,
  },
  inputWrap: {
    marginBottom: 15,
    alignSelf: 'stretch',
  },
  tools: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    alignSelf: 'stretch',
    marginHorizontal: 16,
  },
});

export default LoginTemplate;
