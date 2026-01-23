/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import {
  screen,
  fireEvent,
} from '@testing-library/react';

import { render } from 'test-utils';

import IdentityForm from 'components/form';

jest.mock('react-paragon-topaz', () => {
  // eslint-disable-next-line global-require
  const PropTypes = require('prop-types');

  const Select = ({
    label, placeholder, options, value, onChange, isDisabled, className,
  }) => {
    const id = (label || placeholder || 'select')
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    return (
      <div>
        <label>{label || placeholder}</label>
        <select
          disabled={isDisabled}
          className={className}
          value={value?.value || ''}
          onChange={(e) => {
            const selectedOption = options?.find(opt => opt.value === e.target.value);
            onChange?.(selectedOption || null);
          }}
          data-testid={`select-input-${id}`}
        >
          <option value="">{placeholder || 'Select'}</option>
          {options?.map((option) => (
            <option key={option.label} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  };

  Select.propTypes = {
    label: PropTypes.string,
    placeholder: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })),
    value: PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    }),
    onChange: PropTypes.func,
    isDisabled: PropTypes.bool,
    className: PropTypes.string,
  };

  Select.defaultProps = {
    label: '',
    placeholder: '',
    options: [],
    value: null,
    onChange: () => {},
    isDisabled: false,
    className: '',
  };

  const Button = ({
    children, variant, type, className, onClick, disabled,
  }) => (
    <button
      type={type || 'submit'}
      className={`btn ${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
      data-testid={`button-${children?.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {children}
    </button>
  );

  Button.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.string,
    type: PropTypes.string,
    className: PropTypes.string,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
  };

  Button.defaultProps = {
    variant: '',
    type: 'button',
    className: '',
    onClick: () => {},
    disabled: false,
  };

  return { Select, Button };
});

jest.mock('constants', () => ({
  countries: [
    {
      name: 'United States', flag: '🇺🇸', dialingCode: '+1', cca3: 'USA', cca2: 'US',
    },
    {
      name: 'Canada', flag: '🇨🇦', dialingCode: '+1', cca3: 'CAN', cca2: 'CA',
    },
    {
      name: 'Mexico', flag: '🇲🇽', dialingCode: '+52', cca3: 'MEX', cca2: 'ME',
    },
  ],
  unitedStates: [
    { label: 'California', value: 'CA' },
    { label: 'New York', value: 'NY' },
  ],
  canadianProvincesAndTerritories: [
    { label: 'Ontario', value: 'ON' },
    { label: 'Quebec', value: 'QC' },
  ],
}));

describe('IdentityForm', () => {
  const mockProps = {
    onCancel: jest.fn(),
    onSubmit: jest.fn(),
    onPrevious: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial Rendering', () => {
    test('renders base fields', () => {
      render(<IdentityForm {...mockProps} />);

      expect(screen.getByLabelText('First Name *')).toBeInTheDocument();
      expect(screen.getByLabelText('Last Name *')).toBeInTheDocument();
      expect(screen.getByLabelText('Email *')).toBeInTheDocument();
    });

    test('has correct initial values', () => {
      render(<IdentityForm {...mockProps} />);

      expect(screen.getByTestId('select-input-country--region')).toHaveValue('USA');
      expect(screen.getByTestId('select-input-dialing-code')).toHaveValue('US');
    });
  });

  describe('Conditional Fields (updated behavior)', () => {
    test('state and postal enabled for USA', () => {
      render(<IdentityForm {...mockProps} />);

      const state = screen.getByTestId('select-input-state--province');
      const postal = screen.getByLabelText('ZIP / Postal Code *');

      expect(state).not.toBeDisabled();
      expect(postal).not.toBeDisabled();
    });

    test('state and postal enabled for Canada', () => {
      render(<IdentityForm {...mockProps} />);

      fireEvent.change(screen.getByTestId('select-input-country--region'), {
        target: { value: 'CAN' },
      });

      const state = screen.getByTestId('select-input-state--province');
      const postal = screen.getByLabelText('ZIP / Postal Code *');

      expect(state).not.toBeDisabled();
      expect(postal).not.toBeDisabled();
    });

    test('state and postal disabled for other countries', () => {
      render(<IdentityForm {...mockProps} />);

      fireEvent.change(screen.getByTestId('select-input-country--region'), {
        target: { value: 'MEX' },
      });

      const state = screen.getByTestId('select-input-state--province');
      const postal = screen.getByLabelText('ZIP / Postal Code *');

      expect(state).toBeDisabled();
      expect(postal).toBeDisabled();
    });
  });

  describe('Interactions', () => {
    test('updates text inputs', () => {
      render(<IdentityForm {...mockProps} />);

      const input = screen.getByLabelText('First Name *');
      fireEvent.change(input, { target: { value: 'John' } });

      expect(input).toHaveValue('John');
    });

    test('updates select', () => {
      render(<IdentityForm {...mockProps} />);

      const select = screen.getByTestId('select-input-country--region');
      fireEvent.change(select, { target: { value: 'CAN' } });

      expect(select).toHaveValue('CAN');
    });
  });

  describe('Submission', () => {
    test('calls onSubmit', () => {
      render(<IdentityForm {...mockProps} />);

      fireEvent.change(screen.getByLabelText('First Name *'), {
        target: { value: 'John' },
      });

      fireEvent.click(screen.getByTestId('button-submit'));

      expect(mockProps.onSubmit).toHaveBeenCalled();
    });
  });

  describe('Buttons', () => {
    test('cancel works', () => {
      render(<IdentityForm {...mockProps} />);

      fireEvent.click(screen.getByTestId('button-cancel'));
      expect(mockProps.onCancel).toHaveBeenCalled();
    });

    test('previous works', () => {
      render(<IdentityForm {...mockProps} />);

      fireEvent.click(screen.getByTestId('button-previous'));
      expect(mockProps.onPrevious).toHaveBeenCalled();
    });
  });
});
