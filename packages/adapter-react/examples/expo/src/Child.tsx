import { Picker } from '@react-native-picker/picker'
import React, { ChangeEventHandler, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Animated, Dimensions, Easing, Linking, NativeSyntheticEvent, StyleSheet, Text, TextInput, TextInputChangeEventData, useWindowDimensions, View } from 'react-native'
import { useI18nContext } from './i18n/i18n-react'
import type { Locales } from './i18n/i18n-types'
import { locales } from './i18n/i18n-util'
import { loadLocaleAsync } from './i18n/i18n-util.async'
import { setUserLocale } from './locale-storage'
import Logo from './Logo'

export default function Child() {
	const styles = useStyles();

	const { locale, LL, setLocale } = useI18nContext()

	const [name, setName] = useState('John')

	const onLocaleSelected = useCallback((locale: Locales) => {
		setUserLocale(locale)
			.then(async locale => { await loadLocaleAsync(locale); return locale })
			.then(setLocale)
	}, [])

	// Animated spinning logo
	const spinAnimation = useRef(new Animated.Value(0)).current;
	useEffect(() => {
		Animated.loop(
			Animated.timing(
				spinAnimation,
				{
					toValue: 1,
					duration: 12000,
					easing: Easing.linear,
					useNativeDriver: true
				}
			)
		).start();
	}, [spinAnimation])
	const spin = spinAnimation.interpolate({
		inputRange: [0, 1],
		outputRange: ['0deg', '360deg']
	})

	return (
		<View style={styles.appHeader}>
			<Text style={[styles.body, styles.marginEnd]}>{LL.SELECTED_LOCALE()}</Text>
			<Picker
				selectedValue={locale}
				onValueChange={onLocaleSelected}
				style={styles.picker}
				itemStyle={styles.pickerItem}
			>
				<Picker.Item label={LL.CHOOSE_LOCALE()} value={undefined} enabled={false}/>
				{locales.map(localeOption => (
					<Picker.Item key={localeOption} label={localeOption} value={localeOption}/>
				))}
			</Picker>

			<View style={styles.divider}/>
			<Text style={styles.header}>{LL.HI({ name })}</Text>
			<View style={{flexDirection: 'row'}}>
				<Text style={[styles.body, styles.marginEnd]}>{LL.YOUR_NAME()}</Text>
				<TextInput style={[styles.body, styles.textInput]} value={name} onChangeText={setName}/>
			</View>

			<View style={styles.divider}/>
			<Text style={styles.header}>{LL.TODAY({ date: new Date() })}</Text>

			<View style={styles.divider}/>
			<Animated.View style={{transform: [{rotate: spin}] }}><Logo style={styles.logo}/></Animated.View>

			<Text style={styles.body}>{LL.EDIT_AND_SAVE()}</Text>

			<Text style={[styles.header, styles.hyperlink]} onPress={() => Linking.openURL('https://docs.expo.dev/')}>
				{LL.LEARN_EXPO()}
			</Text>
		</View>
	)
}

const useStyles = () => {
	const {height, width} = useWindowDimensions();
	const vh = height/100;
	const vw = width/100;
	const vmin = Math.min(height, width)/100;

	return useMemo(() => StyleSheet.create({
		appHeader: {
			backgroundColor: '#282c34',
			minHeight: 100*vh,
			alignItems: 'center',
			justifyContent: 'center',
		},

		body: {
			fontSize: 7.5 + 1.5*vmin,
			color: 'white'
		},

		header: {
			fontSize: 10 + 2*vmin,
			color: 'white'
		},

		picker: {
			backgroundColor: 'white',
			width: 30*vmin,
			fontSize: 7.5 + 1.5*vmin,
		},

		pickerItem: {
			fontSize: 7.5 + 1.5*vmin,
		},

		textInput: {
			backgroundColor: 'white',
			color: 'black',
			width: 30*vmin
		},

		marginEnd: {
			marginEnd: 2*vmin
		},

		hyperlink: {
			color: '#61dafb',
		},

		logo: {
			height: 40*vmin,
			width: 40*vmin
		},

		divider: {
			height: 1,
			width: 2*vw,
			marginVertical: 2*vmin,
			backgroundColor: 'white'
		}
	}), [])
};