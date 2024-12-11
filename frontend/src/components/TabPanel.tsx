import React from 'react';
import { Box } from '@mui/material';

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
	return (
		<Box role="tabpanel" sx={{ display: value === index ? 'block' : 'none', p: 2 }}>
			{children}
		</Box>
	);
};

export default TabPanel;
