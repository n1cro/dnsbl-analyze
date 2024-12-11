import React from 'react';
import { Autocomplete, TextField, Chip } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

interface BlocklistSelectProps {
	name: string;
	blocklistOptions: string[];
}

const SELECT_ALL = 'Select all';

const BlocklistSelect: React.FC<BlocklistSelectProps> = ({ name, blocklistOptions }) => {
	const {
		control,
		setValue,
		getValues,
		clearErrors,
		formState: { errors }
	} = useFormContext();

	const handleBlocklistsChange = (value: string[]) => {
		const hasSelectAll = value.includes(SELECT_ALL);
		if (hasSelectAll) {
			const currentSelections = getValues(name) || [];
			if (currentSelections.length === blocklistOptions.length) {
				setValue(name, []);
			} else {
				setValue(name, blocklistOptions);
			}
		} else {
			setValue(name, value);
		}

		clearErrors(name);
	};

	return (
		<Controller
			name={name}
			control={control}
			render={({ field }) => (
				<Autocomplete
					{...field}
					multiple
					options={[SELECT_ALL, ...blocklistOptions]}
					value={field.value || []}
					onChange={(_, value) => handleBlocklistsChange(value)}
					renderInput={(params) => (
						<TextField
							{...params}
							variant="outlined"
							label="Search blocklist"
							error={!!errors[name]}
							helperText={errors[name]?.message as string}
						/>
					)}
					renderTags={(value: readonly string[], getTagProps) =>
						value.map((option: string, index: number) => (
							<Chip
								variant="outlined"
								label={option}
								{...getTagProps({ index })}
								key={option}
							/>
						))
					}
				/>
			)}
		/>
	);
};

export default BlocklistSelect;
