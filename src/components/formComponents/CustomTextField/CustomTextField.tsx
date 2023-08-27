import type { TextFieldProps } from '@mui/material';
import { TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';

interface NameFieldProps {
  label: string;
  onUpdate: (val: string) => void;
  value: string;
  replacementRegex?: RegExp;
}

const MAX_NAME_LENGTH = 60 as const;

const NameField: React.FC<NameFieldProps & TextFieldProps> = ({
  label,
  onUpdate,
  value,
  replacementRegex = /[^0-9a-z ]/gi,
  ...props
}) => {
  const [inputValue, setInputValue] = useState<string>('');

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const updateInput: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const value = event.target.value
      .replace(replacementRegex, '')
      .substring(0, MAX_NAME_LENGTH);

    try {
      onUpdate(value);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <TextField
      {...props}
      label={label}
      onChange={updateInput}
      value={inputValue}
      inputProps={{ maxLength: MAX_NAME_LENGTH }}
    />
  );
};

export default NameField;
