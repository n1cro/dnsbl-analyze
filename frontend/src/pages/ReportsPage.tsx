import React from 'react';
import { Container } from '@mui/material';
import ReportForm from '../components/ReportForm';
import ReportTable from '../components/ReportTable';

const ReportsPage: React.FC = () => {
	return (
		<Container maxWidth={false} sx={{ mt: 4 }}>
			<ReportForm />
			<ReportTable />
		</Container>
	);
};

export default ReportsPage;
