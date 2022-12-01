import AsyncStorage from '@react-native-async-storage/async-storage';
import { rejects } from 'assert';
import { Locales } from './i18n/i18n-types';
import { isLocale } from './i18n/i18n-util';

const LOCALE_KEY = '@user-locale';

/**
 * Gets the locale, previous stored into local storage.
 * 
 * Returns the locale that was stored, or the passed-in default if none was stored.
 */
export const getUserLocale = async (defaultLocale: Locales) => {
	try {
		const value = await AsyncStorage.getItem(LOCALE_KEY)
		if (value !== null && isLocale(value)) {
			return value;
		}
	} catch(e) {
		console.error('Error reading from local storage', e);
	}

	return defaultLocale
}

/**
 * Sets a locale into local storage.
 * 
 * Returns the locale back if it was stored successfully, or rejects the promise if not.
 */
export const setUserLocale = async (value: Locales) => {
	try {
		await AsyncStorage.setItem(LOCALE_KEY, value)
		return value
	} catch (e) {
		console.error('Error reading from local storage', e);
		throw e;
	}
}
