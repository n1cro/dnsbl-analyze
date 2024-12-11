import React, { useState } from 'react';
import { Box, TextField, Typography, Button, Alert } from '@mui/material';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ReportRequest } from '../common/interfaces';
import { errorMessages } from '../common/constants/errorMessages';
import CidrList from './CidrList';
import BlocklistSelect from './BlocklistSelect';

type FormInputs = Partial<ReportRequest>;

const schema = yup.object({
	targets: yup
		.array()
		.of(
			yup
				.string()
				.matches(
					/^(25[0-5]|2[0-4]\d|[01]?\d?\d)(\.(25[0-5]|2[0-4]\d|[01]?\d?\d)){3}\/(3[0-2]|[12]\d)$/,
					errorMessages.cidr.invalidFormat
				)
		)
		.min(1, errorMessages.cidr.minLength),
	blocklists: yup.array().of(yup.string()).min(1, errorMessages.blocklists.required),
	name: yup.string().optional()
});

const blocklists = [
	'zen.spamhaus.org',
	'pbl.spamhaus.org',
	'sbl.spamhaus.org',
	'xbl.spamhaus.org',
	'all.spamrats.com',
	'b.barracudacentral.org',
	'dnsbl.justspam.org',
	'all.s5h.net',
	'dnsbl.dronebl.org',
	'bl.mailspike.net'
];

const ReportForm: React.FC = () => {
	const methods = useForm<FormInputs>({
		resolver: yupResolver(schema as yup.ObjectSchema<FormInputs>),
		defaultValues: {
			targets: [],
			blocklists: [],
			name: ''
		},
		mode: 'onTouched'
	});
	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting }
	} = methods;

	const [error, setError] = useState<string | null>(null);

	const handleSubmitForm = async (data: FormInputs) => {
		setError(null);

		try {
			const response = await fetch('/api/report', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ ...data, name: data.name || 'default' })
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message);
			}

			methods.reset();
		} catch (error: any) {
			setError(error.message);
		}
	};

	return (
		<FormProvider {...methods}>
			<Box
				component="form"
				onSubmit={handleSubmit(handleSubmitForm)}
				sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
			>
				<Controller
					name="name"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							label="Report name (optional)"
							variant="outlined"
							error={!!errors.name}
							helperText={errors.name?.message}
							fullWidth
						/>
					)}
				/>

				<Typography variant="h6">CIDR Blocks:</Typography>
				<CidrList name="targets" />

				<Typography variant="h6">Blocklists:</Typography>
				<BlocklistSelect name="blocklists" blocklistOptions={blocklists} />

				{error && <Alert severity="error">{error}</Alert>}

				<Button
					variant="contained"
					color="primary"
					size="large"
					type="submit"
					disabled={isSubmitting}
				>
					{isSubmitting ? 'Sending...' : 'Start scan'}
				</Button>
			</Box>
		</FormProvider>
	);
};

export default ReportForm;
