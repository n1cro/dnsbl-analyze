import React, { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { Box, Button, Chip, Modal, Typography, Stack } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
	ReportResponse,
	BlocklistItem,
	ReportItem,
	ReportStatus
} from '../common/interfaces';

const fetchReports = async () => {
	const response = await fetch('/api/report');
	const data: ReportResponse = await response.json();
	return data?.reports || [];
};

const ReportTable: React.FC = () => {
	const [reports, setReports] = useState<ReportItem[]>([]);
	const [currentBlocklist, setCurrentBlocklist] = useState<BlocklistItem | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [paginationModel, setPaginationModel] = useState({
		pageSize: 25,
		page: 0
	});

	const loadReports = async () => {
		setIsLoading(true);

		try {
			const data = await fetchReports();
			setReports(data);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		loadReports();
	}, []);

	const handleOpenModal = (blocklist: BlocklistItem) => {
		setCurrentBlocklist(blocklist);
	};

	const handleCloseModal = () => {
		setCurrentBlocklist(null);
	};

	const formatDate = (date: string | null): string => {
		if (!date) return 'N/A';
		return format(new Date(date), 'yy-MM-dd HH:mm:ss');
	};

	const preparedRows = useMemo(() => {
		return reports.map((report) => {
			const blocklistData = report.blocklists.reduce((acc, blocklist) => {
				acc[blocklist.id] = blocklist;
				return acc;
			}, {} as Record<string, BlocklistItem>);

			return { ...report, blocklistData };
		});
	}, [reports]);

	const blocklistColumns = useMemo(() => {
		const uniqueBlocklists = new Set(
			reports.flatMap((report) => report.blocklists.map((blocklist) => blocklist.id))
		);

		return Array.from(uniqueBlocklists).map((blocklistId) => ({
			field: blocklistId,
			headerName: blocklistId,
			width: 150,
			renderCell: (params: GridRenderCellParams<any, Date>) => {
				const blocklist = params.row.blocklistData[blocklistId];
				if (!blocklist) return null;

				return (
					<Button
						variant="text"
						onClick={() => handleOpenModal(blocklist)}
						sx={{ textTransform: 'none' }}
					>
						View ({blocklist.ipList.length})
					</Button>
				);
			}
		}));
	}, [reports]);

	const renderStatusChip = (status: string) => {
		if (status === ReportStatus.PROCESSED) {
			return (
				<Chip
					icon={<CheckCircleIcon />}
					variant="outlined"
					label="Processed"
					color="success"
				/>
			);
		}

		return (
			<Chip icon={<ScheduleIcon />} variant="outlined" label="Queued" color="warning" />
		);
	};

	const staticColumns: GridColDef[] = [
		{ field: 'name', headerName: 'Name', width: 120 },
		{ field: 'cidr', headerName: 'CIDR', width: 150 },
		{
			field: 'status',
			headerName: 'Status',
			width: 100,
			renderCell: (params) => renderStatusChip(params.value)
		},
		{
			field: 'createdAt',
			headerName: 'Started At',
			width: 160,
			valueGetter: (value) => formatDate(value)
		},
		{
			field: 'processedAt',
			headerName: 'Processed At',
			width: 160,
			valueGetter: (value) => formatDate(value)
		}
	];

	const ipColumns: GridColDef[] = [{ field: 'ip', headerName: 'IP Address', width: 300 }];
	const ipRows = currentBlocklist
		? currentBlocklist.ipList.map((ip, index) => ({
				id: index + paginationModel.page * 10 + 1,
				ip
		  }))
		: [];

	return (
		<Box sx={{ mt: 4 }}>
			<Stack
				direction="row"
				justifyContent="space-between"
				alignItems="center"
				sx={{ mb: 2 }}
			>
				<Typography variant="h6">Reports</Typography>
				<Button
					variant="outlined"
					startIcon={<RefreshIcon />}
					onClick={loadReports}
					disabled={isLoading}
				>
					Refresh
				</Button>
			</Stack>
			<DataGrid
				rows={preparedRows}
				columns={[...staticColumns, ...blocklistColumns]}
				pageSizeOptions={[25, 50, 100]}
				loading={isLoading}
				getRowId={(row) => row.id}
				disableRowSelectionOnClick
				initialState={{
					sorting: {
						sortModel: [{ field: 'createdAt', sort: 'desc' }]
					}
				}}
			/>

			<Modal open={!!currentBlocklist} onClose={handleCloseModal}>
				<Box
					sx={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						width: 800,
						bgcolor: 'background.paper',
						boxShadow: 24,
						p: 4,
						borderRadius: 2
					}}
				>
					<Typography variant="h6" sx={{ mb: 2 }}>
						Blocklist: {currentBlocklist?.id}
					</Typography>
					<Box sx={{ height: 500 }}>
						<DataGrid
							rows={ipRows}
							columns={ipColumns}
							pageSizeOptions={[25, 50, 100, { value: -1, label: 'All' }]}
							paginationMode="server"
							rowCount={currentBlocklist?.ipList.length || 0}
							paginationModel={paginationModel}
							onPaginationModelChange={setPaginationModel}
							disableRowSelectionOnClick
						/>
					</Box>
					<Button variant="contained" onClick={handleCloseModal} sx={{ mt: 2 }}>
						Close
					</Button>
				</Box>
			</Modal>
		</Box>
	);
};

export default ReportTable;
