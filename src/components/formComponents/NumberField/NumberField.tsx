import type { TextFieldProps } from '@mui/material';
import { TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';

interface NumberFieldProps {
  label: string;
  onUpdate: (val: number) => void;
  value: number;
}

const NumberField: React.FC<NumberFieldProps & TextFieldProps> = ({
  onUpdate,
  value,
  label,
  ...props
}) => {
  const [inputValue, setInputValue] = useState<string>(value.toString() || '');

  useEffect(() => {
    setInputValue(value !== 0 ? value.toString() : '');
  }, [value]);

  const updateInput: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const strValue = event.target.value
      .replace(/[^0-9.]/gi, '')
      .substring(0, 15);

    try {
      const valueAsNumber = parseFloat(strValue);
      onUpdate(!Number.isNaN(valueAsNumber) ? valueAsNumber : 0);
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
      inputProps={{ maxLength: 15 }}
    />
  );
};

export default NumberField;
