import {
  Autocomplete,
  TextField,
  AutocompleteProps,
  FormControl,
  FormHelperText
} from '@mui/material';
import React from 'react';
import { Control, Controller, FieldValues } from 'react-hook-form';

type RarityFieldAutocompleteProps<T, U extends boolean | undefined> = Omit<
  AutocompleteProps<T, U, false, false>,
  'renderInput'
>;

interface GenericAutocompleteProps<T, U extends boolean | undefined>
  extends RarityFieldAutocompleteProps<T, U> {
  errorMessage?: string;
  fieldKey: string;
  label: string;
  options: T[];
  control: Control<any>;
}

const GenericAutocomplete = <T, U extends boolean | undefined = false>({
  label,
  fieldKey,
  errorMessage,
  options,
  control,
  ...props
}: GenericAutocompleteProps<T, U>) => (
  <Controller
    render={({ field: { value, onChange } }) => (
      <FormControl fullWidth>
        <Autocomplete
          disablePortal
          options={options}
          renderInput={(params) => <TextField {...params} label={label} />}
          onChange={(e, data) => onChange(data)}
          value={value}
          {...props}
        />
        <FormHelperText color="error" error={!!errorMessage}>
          {errorMessage}
        </FormHelperText>
      </FormControl>
    )}
    name={fieldKey}
    control={control}
  />
);

export default GenericAutocomplete;
