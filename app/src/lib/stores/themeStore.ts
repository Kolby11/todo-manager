import { browser } from '$app/environment';
import { get, writable, type Writable } from 'svelte/store';

export enum THEME {
	light = 'light',
	dark = 'dark',
	purple = 'purple'
}

const getInitialTheme = (): THEME => {
	if (browser) {
		return (localStorage.getItem('theme') as THEME) || THEME.light;
	}
	return THEME.light;
};

export const theme: Writable<THEME> = writable(getInitialTheme());

function applyThemeClass(value: THEME) {
	if (browser) {
		document.documentElement.classList.add('theme-' + value);

		const themesToRemove = Object.values(THEME).filter((theme) => theme !== value);
		themesToRemove.forEach((theme) => {
			document.documentElement.classList.remove('theme-' + theme);
		});
	}
}

if (browser) {
	applyThemeClass(get(theme));
}

theme.subscribe((value) => {
	if (browser) {
		localStorage.setItem('theme', value);
		applyThemeClass(value);
	}
});
