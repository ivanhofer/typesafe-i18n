import React, {useReducer} from 'react';
import {Button, SafeAreaView, StyleSheet, Text} from 'react-native';
import {useI18nContext} from './i18n/i18n-react';
import {Locales} from './i18n/i18n-types';
import {loadLocale} from './i18n/i18n-util.sync';

export const LocalizedComponent = () => {
  const {LL, locale, setLocale} = useI18nContext();

  const applyLocale = (it: Locales) => {
    loadLocale(it);
    setLocale(it);
    return it;
  };

  const [, toggleLocale] = useReducer(
    (currentLocale: Locales) => {
      const nextLocale: Locales = currentLocale === 'en' ? 'de' : 'en';

      return applyLocale(nextLocale);
    },
    locale,
    applyLocale,
  );

  return (
    <SafeAreaView style={styles.root}>
      <Text style={styles.textTitle}>typesafe-i18n: {locale}</Text>

      <Text style={styles.textBody}>{LL.HI({name: locale})}</Text>

      <Button onPress={toggleLocale} title="toggle locale" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
  },
  textTitle: {
    fontSize: 20,
  },
  textBody: {
    textAlign: 'center',
    marginVertical: 16,
  },
});
