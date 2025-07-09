import React from 'react';
import PropTypes from 'prop-types';
import { Form, Col } from '@edx/paragon';
import { Select } from 'react-paragon-topaz';

import { countries } from 'constants';

const baseSelectStyles = {
  minHeight: 50,
  maxHeight: 50,
};

const parsedPhoneCountries = countries?.map(country => ({
  label: `${JSON.parse(`"${country.flag}"`)} ${country.dialingCode}`,
  value: country.cca2,
}));

export const Input = ({
  id,
  label,
  type = 'text',
  required = false,
  value,
  error,
  isDisabled,
  isLoading,
  onChange,
  placeholder,
  inputMode,
  className = '',
  xs = 12,
  md = 6,
}) => (
  <Form.Group as={Col} xs={xs} md={md} controlId={id} isInvalid={!!error}>
    <Form.Control
      type={type}
      floatingLabel={label}
      placeholder={placeholder}
      required={required}
      disabled={isDisabled || isLoading}
      className={`${isDisabled || isLoading ? 'form-input-disabled' : 'form-input'} ${className}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      inputMode={inputMode}
    />
    {error && (
      <Form.Control.Feedback type="invalid">
        {error}
      </Form.Control.Feedback>
    )}
  </Form.Group>
);

export const SelectInput = ({
  id,
  label,
  placeholder,
  options,
  value,
  error,
  isDisabled,
  isLoading,
  onChange,
  isClearable = true,
  styles = {},
  className = '',
  xs = 12,
  md = 6,
}) => (
  <Form.Group as={Col} xs={xs} md={md} controlId={id} isInvalid={!!error}>
    <Select
      label={label}
      placeholder={placeholder}
      className={`form-select ${className}`}
      options={options}
      value={options?.find((option) => option.value === value)}
      onChange={(opt) => onChange(opt?.value || '')}
      isDisabled={isDisabled || isLoading}
      isClearable={isClearable}
      styles={{
        control: (base) => ({
          ...base,
          ...baseSelectStyles,
          ...styles.control,
        }),
        ...styles,
      }}
    />
    {error && (
      <Form.Control.Feedback type="invalid">
        {error}
      </Form.Control.Feedback>
    )}
  </Form.Group>
);

export const PhoneInput = ({
  dialingCodeValue,
  dialingCodeDisabled,
  phoneValue,
  phoneError,
  dialingCodeError,
  phoneDisabled,
  isLoading,
  onDialingCodeChange,
  onPhoneChange,
}) => (
  <Form.Group as={Col} xs={12} md={6} controlId="phone" isInvalid={!!phoneError}>
    <Form.Row>
      <div className="form-phone">
        <Col xs={5} md={3} className="px-0 pl-1">
          <Select
            label="Dialing code"
            className="form-input"
            placeholder="Select"
            options={parsedPhoneCountries}
            value={parsedPhoneCountries?.find((c) => c.value === dialingCodeValue)}
            onChange={(opt) => onDialingCodeChange(opt?.value || '')}
            isClearable
            isDisabled={dialingCodeDisabled || isLoading}
            styles={{
              control: (base) => ({
                ...base,
                ...baseSelectStyles,
                borderRight: 'none',
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
              }),
            }}
          />
        </Col>
        <Col xs={7} md={9} className="px-0">
          <Form.Control
            type="tel"
            inputMode="numeric"
            floatingLabel="(555) 555-5555"
            placeholder="(555) 555-5555"
            value={phoneValue}
            disabled={phoneDisabled || isLoading}
            className={`pr-1 form-phone-input ${phoneDisabled || isLoading ? 'form-input-disabled' : 'form-input'}`}
            onChange={(e) => onPhoneChange(e.target.value)}
            required
          />
          {(phoneError || dialingCodeError) && (
            <Form.Control.Feedback type="invalid">
              {phoneError || dialingCodeError}
            </Form.Control.Feedback>
          )}
        </Col>
      </div>
    </Form.Row>
  </Form.Group>
);

Input.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  required: PropTypes.bool,
  value: PropTypes.string.isRequired,
  error: PropTypes.string,
  isDisabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  inputMode: PropTypes.string,
  className: PropTypes.string,
  xs: PropTypes.number,
  md: PropTypes.number,
};

Input.defaultProps = {
  type: 'text',
  required: false,
  error: null,
  isDisabled: false,
  isLoading: false,
  placeholder: '',
  inputMode: 'text',
  className: '',
  xs: undefined,
  md: undefined,
};

SelectInput.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        country: PropTypes.string.isRequired,
        code: PropTypes.string.isRequired,
      }),
    ]),
  ).isRequired,
  value: PropTypes.string.isRequired,
  error: PropTypes.string,
  isDisabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  isClearable: PropTypes.bool,
  styles: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object,
    PropTypes.func,
  ])),
  className: PropTypes.string,
  xs: PropTypes.number,
  md: PropTypes.number,
};

SelectInput.defaultProps = {
  placeholder: '',
  error: null,
  isDisabled: false,
  isLoading: false,
  isClearable: false,
  styles: {},
  className: '',
  xs: undefined,
  md: undefined,
};

PhoneInput.propTypes = {
  dialingCodeValue: PropTypes.string.isRequired,
  dialingCodeDisabled: PropTypes.bool,
  phoneValue: PropTypes.string.isRequired,
  phoneError: PropTypes.string,
  dialingCodeError: PropTypes.string,
  phoneDisabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  onDialingCodeChange: PropTypes.func.isRequired,
  onPhoneChange: PropTypes.func.isRequired,
};

PhoneInput.defaultProps = {
  dialingCodeDisabled: false,
  phoneError: null,
  dialingCodeError: null,
  phoneDisabled: false,
  isLoading: false,
};
