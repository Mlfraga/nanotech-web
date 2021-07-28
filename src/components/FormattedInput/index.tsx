import React, { useEffect, useRef, useState } from 'react';
import { IconBaseProps } from 'react-icons/';
import { FiAlertCircle } from 'react-icons/fi';
import NumberFormat, {
  NumberFormatValues,
  NumberFormatProps,
} from 'react-number-format';

import { useField } from '@unform/core';

import { Container, Error } from './styles';

interface IFormattedInputProps extends NumberFormatProps {
  name: string;
  icon?: React.ComponentType<IconBaseProps>;
}

const FormattedInput: React.FC<IFormattedInputProps> = ({
  name,
  icon: Icon,
  defaultValue,
  ...rest
}) => {
  const inputRef = useRef<NumberFormat>(null);
  const [value, setValue] = useState<NumberFormatValues>({
    floatValue: undefined,
    value: defaultValue ? String(defaultValue) : '',
    formattedValue: '',
  });

  const { fieldName, error, registerField } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: value,
      path: 'value',
      clearValue: () =>
        setValue({
          floatValue: undefined,
          value: '',
          formattedValue: '',
        }),
    });
  }, [fieldName, value, registerField]);

  return (
    <Container isErrored={!!error}>
      {Icon && <Icon size={20} />}
      <NumberFormat
        {...rest}
        ref={inputRef}
        onValueChange={(values: NumberFormatValues) => {
          setValue(values);
        }}
        value={value.value}
      ></NumberFormat>
      {error && (
        <Error title={error}>
          <FiAlertCircle color="#c53030" size={20} />
        </Error>
      )}
    </Container>
  );
};

export default FormattedInput;
