import React, { createContext, useState, useMemo, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

interface ThemeContextProps {
	mode: 'light' | 'dark';
	toggleTheme: () => void;
}

const STORAGE_KEY = 'theme';

export const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

const ThemeContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [mode, setMode] = useState<ThemeContextProps['mode']>(() => {
		const savedTheme = localStorage.getItem(STORAGE_KEY);
		if (savedTheme === 'light' || savedTheme === 'dark') {
			return savedTheme;
		}
		return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	});

	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, mode);
	}, [mode]);

	const toggleTheme = () => {
		setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
	};

	const theme = useMemo(
		() =>
			createTheme({
				palette: {
					mode
				}
			}),
		[mode]
	);

	return (
		<ThemeContext.Provider value={{ mode, toggleTheme }}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				{children}
			</ThemeProvider>
		</ThemeContext.Provider>
	);
};

export default ThemeContextProvider;
