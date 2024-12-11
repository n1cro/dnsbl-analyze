import React, { useState } from 'react';
import { Tabs, Tab, Container } from '@mui/material';
import ReportForm from '../components/ReportForm';
import ReportTable from '../components/ReportTable';
import TabPanel from '../components/TabPanel';

const ReportsPage: React.FC = () => {
	const [tabValue, setTabValue] = useState<number>(0);

	const handleChangeTab = (_: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
	};

	return (
		<Container maxWidth="lg" sx={{ mt: 4 }}>
			<Tabs value={tabValue} onChange={handleChangeTab} aria-label="tabs">
				<Tab label="Scan" />
				<Tab label="Reports" />
			</Tabs>

			<TabPanel value={tabValue} index={0}>
				<ReportForm />
			</TabPanel>

			<TabPanel value={tabValue} index={1}>
				<ReportTable />
			</TabPanel>
		</Container>
	);
};

export default ReportsPage;
