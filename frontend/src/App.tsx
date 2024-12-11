import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import ThemeContextProvider from './context/ThemeContext';
import ThemeSwitcher from './components/ThemeSwitcher';
import ReportsPage from './pages/ReportsPage';

const App: React.FC = () => {
	return (
		<ThemeContextProvider>
			<AppBar position="static">
				<Toolbar>
					<Box sx={{ flexGrow: 1 }}>
						<Typography variant="h6">DNSBL Reports</Typography>
					</Box>
					<ThemeSwitcher />
				</Toolbar>
			</AppBar>
			<ReportsPage />
		</ThemeContextProvider>
	);
};

export default App;
