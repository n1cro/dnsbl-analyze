import React, { useState } from 'react';
import { TextField, Box, Chip, Button } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { errorMessages } from '../common/constants/errorMessages';

interface CidrListProps {
	name: string;
}

const CidrList: React.FC<CidrListProps> = ({ name }) => {
	const [cidrInput, setCidrInput] = useState<string>('');
	const {
		setValue,
		getValues,
		setError,
		clearErrors,
		formState: { errors }
	} = useFormContext();

	const cidrRegex = new RegExp(
		'^(25[0-5]|2[0-4]\\d|[01]?\\d?\\d)' +
			'(\\.(25[0-5]|2[0-4]\\d|[01]?\\d?\\d)){3}' +
			'\\/(3[0-2]|[12]\\d|\\d)$'
	);

	const handleAddCIDR = () => {
		const trimmed = cidrInput.trim();

		if (!cidrRegex.test(trimmed)) {
			setError(name, { type: 'manual', message: errorMessages.cidr.invalidFormat });
			return;
		}

		const targets = getValues(name) || [];
		if (targets.includes(trimmed)) {
			setError(name, { type: 'manual', message: errorMessages.cidr.duplicate });
			return;
		}

		clearErrors(name);
		setValue(name, [...targets, trimmed]);
		setCidrInput('');
	};

	const handleRemoveCIDR = (cidrToRemove: string) => {
		const targets = getValues(name);
		const updatedTargets = targets.filter((item: string) => item !== cidrToRemove);
		setValue(name, updatedTargets);

		if (updatedTargets.length === 0) {
			setError(name, { type: 'manual', message: errorMessages.cidr.minLength });
		} else {
			clearErrors(name);
		}
	};

	return (
		<Box>
			<Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
				<TextField
					label="CIDR (e.g. 178.37.224.0/24)"
					variant="outlined"
					value={cidrInput}
					onChange={(e) => {
						setCidrInput(e.target.value);
						clearErrors(name);
					}}
					error={!!errors[name]}
					helperText={errors[name]?.message as string}
					fullWidth
				/>
				<Button
					variant="contained"
					size="large"
					sx={{
						height: '56px',
						minWidth: '100px'
					}}
					onClick={handleAddCIDR}
				>
					Add
				</Button>
			</Box>

			<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
				{getValues(name)?.map((cidr: string, index: number) => (
					<Chip key={index} label={cidr} onDelete={() => handleRemoveCIDR(cidr)} />
				))}
			</Box>
		</Box>
	);
};

export default CidrList;
