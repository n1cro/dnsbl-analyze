import React, { useContext } from 'react';
import { IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { ThemeContext } from '../context/ThemeContext';

const ThemeSwitcher: React.FC = () => {
	const themeContext = useContext(ThemeContext);

	if (!themeContext) {
		return null;
	}

	const { mode, toggleTheme } = themeContext;

	return (
		<IconButton onClick={toggleTheme} color="inherit">
			{mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
		</IconButton>
	);
};

export default ThemeSwitcher;
