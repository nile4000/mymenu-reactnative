import {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, TextInput, useTheme} from 'react-native-paper';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {useAlerts} from 'react-native-paper-alerts';

import {useAppSettings} from '../../components/AppSettings';

function EmailPassword(): JSX.Element {
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const theme = useTheme();
  const appSettings = useAppSettings();
  const Alert = useAlerts();

  async function attemptSignIn() {
    if (!email || !password) {
      return;
    }

    try {
      setLoading(true);
      await auth().signInWithEmailAndPassword(email, password);
    } catch (e) {
      setLoading(false);
      const error = e as FirebaseAuthTypes.PhoneAuthError;
      Alert.alert(
        appSettings.t('login-error'),
        appSettings.t(error.code ?? 'unknownError'),
        [{text: appSettings.t('OK')}],
      );
    }
  }

  const styles = StyleSheet.create({
    signinButton: {
      alignSelf: 'center',
      // backgroundColor: theme.colors.primary,
      width: 300,
    },
    form: {
      flex: 1,
      padding: 40,
      textAlign: 'center',
      justifyContent: 'center',
      alignSelf: 'stretch',
    },
    button: {
      color: theme.colors.primary,
      marginVertical: 20,
    },
  });

  const maskTheme = {
    ...theme,
    colors: {
      background: 'transparent',
      placeholder: theme.colors.primary,
    },
  };

  return (
    <View style={styles.form}>
      <TextInput
        value={email}
        label={appSettings.t('emailLabel')}
        theme={maskTheme}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        autoComplete="email"
      />
      <TextInput
        autoCapitalize="none"
        secureTextEntry
        value={password}
        label={appSettings.t('passwordLabel')}
        theme={maskTheme}
        onChangeText={setPassword}
        autoComplete="password"
      />
      <Button
        disabled={loading || !email || !password}
        style={[styles.button, styles.signinButton]}
        icon="lock"
        mode={loading ? 'text' : 'contained'}
        onPress={() => (loading ? null : attemptSignIn())}
        loading={loading}>
        {loading
          ? appSettings.t('signInSigningIn')
          : appSettings.t('signInSignIn')}
      </Button>
    </View>
  );
}

export default EmailPassword;
