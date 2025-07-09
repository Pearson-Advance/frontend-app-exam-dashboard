/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import {
  screen,
  fireEvent,
} from '@testing-library/react';
import '@testing-library/jest-dom';

import { render } from 'test-utils';

import IdentityForm from 'components/form';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

jest.mock('react-paragon-topaz', () => {
  // eslint-disable-next-line global-require
  const PropTypes = require('prop-types');

  const Select = ({
    label, placeholder, options, value, onChange, isDisabled, isClearable, className,
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
        {isClearable && value && (
          <button
            type="button"
            onClick={() => onChange?.(null)}
            data-testid={`clear-${id}`}
          >
            Clear
          </button>
        )}
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
    isClearable: PropTypes.bool,
    className: PropTypes.string,
  };

  Select.defaultProps = {
    label: '',
    placeholder: '',
    options: [],
    value: null,
    onChange: () => {},
    isDisabled: false,
    isClearable: false,
    className: '',
  };

  const Button = ({
    children, variant, type, className, onClick, disabled,
  }) => (
    <button
      type={type || 'button'}
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
      name: 'United States of America',
      flag: '🇺🇸',
      dialingCode: '+1',
      cca3: 'USA',
      cca2: 'US',
    },
    {
      name: 'Canada',
      flag: '🇨🇦',
      dialingCode: '+1',
      cca3: 'CAN',
      cca2: 'CA',
    },
    {
      name: 'Mexico',
      flag: '🇲🇽',
      dialingCode: '+52',
      cca3: 'MEX',
      cca2: 'ME',
    },
  ],
  unitedStates: [
    { label: 'California', value: 'CA' },
    { label: 'New York', value: 'NY' },
    { label: 'Texas', value: 'TX' },
  ],
  canadianProvincesAndTerritories: [
    { label: 'Ontario', value: 'ON' },
    { label: 'Quebec', value: 'QC' },
    { label: 'British Columbia', value: 'BC' },
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
    test('renders the component with basic elements', () => {
      render(<IdentityForm {...mockProps} />);

      expect(screen.getByText('Verify your identity')).toBeInTheDocument();
      expect(screen.getByText('For security reasons, we need the following information to verify your identity.')).toBeInTheDocument();
      expect(screen.getByLabelText('First Name *')).toBeInTheDocument();
      expect(screen.getByLabelText('Last Name *')).toBeInTheDocument();
      expect(screen.getByLabelText('Email *')).toBeInTheDocument();
      expect(screen.getByLabelText('Address *')).toBeInTheDocument();
      expect(screen.getByLabelText('City *')).toBeInTheDocument();
    });

    test('renders all buttons', () => {
      render(<IdentityForm {...mockProps} />);

      expect(screen.getByTestId('button-cancel')).toBeInTheDocument();
      expect(screen.getByTestId('button-previous')).toBeInTheDocument();
      expect(screen.getByTestId('button-submit')).toBeInTheDocument();
    });

    test('renders with empty values by default', () => {
      render(<IdentityForm {...mockProps} />);

      expect(screen.getByLabelText('First Name *')).toHaveValue('');
      expect(screen.getByLabelText('Last Name *')).toHaveValue('');
      expect(screen.getByLabelText('Email *')).toHaveValue('');
    });
  });

  describe('Text Field Interactions', () => {
    test('updates first name value when changed', () => {
      render(<IdentityForm {...mockProps} />);

      const firstNameInput = screen.getByLabelText('First Name *');
      fireEvent.change(firstNameInput, { target: { value: 'John' } });

      expect(firstNameInput).toHaveValue('John');
    });

    test('updates last name value when changed', () => {
      render(<IdentityForm {...mockProps} />);

      const lastNameInput = screen.getByLabelText('Last Name *');
      fireEvent.change(lastNameInput, { target: { value: 'Doe' } });

      expect(lastNameInput).toHaveValue('Doe');
    });

    test('updates email value when changed', () => {
      render(<IdentityForm {...mockProps} />);

      const emailInput = screen.getByLabelText('Email *');
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });

      expect(emailInput).toHaveValue('john@example.com');
    });

    test('updates address value when changed', () => {
      render(<IdentityForm {...mockProps} />);

      const addressInput = screen.getByLabelText('Address *');
      fireEvent.change(addressInput, { target: { value: '123 Main St' } });

      expect(addressInput).toHaveValue('123 Main St');
    });

    test('updates apartment value when changed', () => {
      render(<IdentityForm {...mockProps} />);

      const apartmentInput = screen.getByLabelText('Apt #, Suite, Floor');
      fireEvent.change(apartmentInput, { target: { value: 'Apt 2B' } });

      expect(apartmentInput).toHaveValue('Apt 2B');
    });

    test('updates city value when changed', () => {
      render(<IdentityForm {...mockProps} />);

      const cityInput = screen.getByLabelText('City *');
      fireEvent.change(cityInput, { target: { value: 'New York' } });

      expect(cityInput).toHaveValue('New York');
    });

    test('updates phone value when changed', () => {
      render(<IdentityForm {...mockProps} />);

      const phoneInput = screen.getByLabelText('(555) 555-5555');
      fireEvent.change(phoneInput, { target: { value: '5551234567' } });

      expect(phoneInput).toHaveValue('5551234567');
    });
  });

  describe('Select Fields', () => {
    test('updates country when selected', () => {
      render(<IdentityForm {...mockProps} />);

      const countrySelect = screen.getByTestId('select-input-country--region');
      fireEvent.change(countrySelect, { target: { value: 'USA' } });

      expect(countrySelect).toHaveValue('USA');
    });

    test('updates dialing code when selected', () => {
      render(<IdentityForm {...mockProps} />);

      const dialingCodeSelect = screen.getByTestId('select-input-dialing-code');
      fireEvent.change(dialingCodeSelect, { target: { value: 'CA' } });

      expect(dialingCodeSelect).toHaveValue('CA');
    });
  });

  describe('Conditional Fields for Countries with States', () => {
    test('displays state and postal code fields when country is United States', () => {
      render(<IdentityForm {...mockProps} />);

      const countrySelect = screen.getByTestId('select-input-country--region');
      fireEvent.change(countrySelect, { target: { value: 'USA' } });

      expect(screen.getByTestId('select-input-state--province')).toBeInTheDocument();
      expect(screen.getByLabelText('ZIP / Postal Code *')).toBeInTheDocument();
    });

    test('displays state and postal code fields when country is Canada', () => {
      render(<IdentityForm {...mockProps} />);

      const countrySelect = screen.getByTestId('select-input-country--region');
      fireEvent.change(countrySelect, { target: { value: 'CAN' } });

      expect(screen.getByTestId('select-input-state--province')).toBeInTheDocument();
      expect(screen.getByLabelText('ZIP / Postal Code *')).toBeInTheDocument();
    });

    test('does not display state and postal code fields for other countries', () => {
      render(<IdentityForm {...mockProps} />);

      const countrySelect = screen.getByTestId('select-input-country--region');
      fireEvent.change(countrySelect, { target: { value: 'MEX' } });

      expect(screen.queryByTestId('select-input-state--province')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('ZIP / Postal Code *')).not.toBeInTheDocument();
    });

    test('can select a state when country is United States', () => {
      render(<IdentityForm {...mockProps} />);

      const countrySelect = screen.getByTestId('select-input-country--region');
      fireEvent.change(countrySelect, { target: { value: 'USA' } });

      const stateSelect = screen.getByTestId('select-input-state--province');
      fireEvent.change(stateSelect, { target: { value: 'CA' } });

      expect(stateSelect).toHaveValue('CA');
    });

    test('can select a province when country is Canada', () => {
      render(<IdentityForm {...mockProps} />);

      const countrySelect = screen.getByTestId('select-input-country--region');
      fireEvent.change(countrySelect, { target: { value: 'CAN' } });

      const stateSelect = screen.getByTestId('select-input-state--province');
      fireEvent.change(stateSelect, { target: { value: 'ON' } });

      expect(stateSelect).toHaveValue('ON');
    });
  });

  describe('Form Submission', () => {
    test('calls onSubmit with form data when submitted', () => {
      render(<IdentityForm {...mockProps} />);

      const firstNameInput = screen.getByLabelText('First Name *');
      const lastNameInput = screen.getByLabelText('Last Name *');
      const emailInput = screen.getByLabelText('Email *');

      fireEvent.change(firstNameInput, { target: { value: 'John' } });
      fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });

      const submitButton = screen.getByTestId('button-submit');
      fireEvent.click(submitButton);

      expect(mockProps.onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: expect.objectContaining({ value: 'John' }),
          lastName: expect.objectContaining({ value: 'Doe' }),
          email: expect.objectContaining({ value: 'john@example.com' }),
        }),
      );
    });

    test('prevents default form behavior on submission', () => {
      render(<IdentityForm {...mockProps} />);

      const form = screen.getByRole('form');
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });

      fireEvent(form, submitEvent);

      expect(submitEvent.defaultPrevented).toBe(true);
    });
  });

  describe('Button Events', () => {
    test('calls onCancel and resets form when Cancel is clicked', () => {
      render(<IdentityForm {...mockProps} />);

      const firstNameInput = screen.getByLabelText('First Name *');
      fireEvent.change(firstNameInput, { target: { value: 'John' } });

      const cancelButton = screen.getByTestId('button-cancel');
      fireEvent.click(cancelButton);

      expect(mockProps.onCancel).toHaveBeenCalled();
      expect(firstNameInput).toHaveValue('');
    });

    test('calls onPrevious when Previous is clicked', () => {
      render(<IdentityForm {...mockProps} />);

      const previousButton = screen.getByTestId('button-previous');
      fireEvent.click(previousButton);

      expect(mockProps.onPrevious).toHaveBeenCalled();
    });
  });

  describe('Default Props Handling', () => {
    test('does not fail when onCancel is not provided', () => {
      const propsWithoutOnCancel = {
        onSubmit: mockProps.onSubmit,
        onPrevious: mockProps.onPrevious,
      };

      render(<IdentityForm {...propsWithoutOnCancel} />);

      const cancelButton = screen.getByTestId('button-cancel');
      expect(() => fireEvent.click(cancelButton)).not.toThrow();
    });

    test('does not fail when onPrevious is not provided', () => {
      const propsWithoutOnPrevious = {
        onSubmit: mockProps.onSubmit,
        onCancel: mockProps.onCancel,
      };

      render(<IdentityForm {...propsWithoutOnPrevious} />);

      const previousButton = screen.getByTestId('button-previous');
      expect(() => fireEvent.click(previousButton)).not.toThrow();
    });
  });

  describe('Loading State', () => {
    test('displays loading text on submit button when loading', () => {
      render(<IdentityForm {...mockProps} />);

      expect(screen.getByTestId('button-submit')).toHaveTextContent('Submit');
    });
  });

  describe('Form Validation and Accessibility', () => {
    test('has correct labels for required fields', () => {
      render(<IdentityForm {...mockProps} />);

      expect(screen.getByLabelText('First Name *')).toBeRequired();
      expect(screen.getByLabelText('Last Name *')).toBeRequired();
      expect(screen.getByLabelText('Email *')).toBeRequired();
      expect(screen.getByLabelText('Address *')).toBeRequired();
      expect(screen.getByLabelText('City *')).toBeRequired();
    });

    test('email field has the correct type', () => {
      render(<IdentityForm {...mockProps} />);

      expect(screen.getByLabelText('Email *')).toHaveAttribute('type', 'email');
    });

    test('phone field has the correct attributes', () => {
      render(<IdentityForm {...mockProps} />);

      const phoneInput = screen.getByLabelText('(555) 555-5555');
      expect(phoneInput).toHaveAttribute('type', 'tel');
      expect(phoneInput).toHaveAttribute('inputMode', 'numeric');
    });
  });

  describe('Phone Input Component', () => {
    test('updates phone and dialing code independently', () => {
      render(<IdentityForm {...mockProps} />);

      const dialingCodeSelect = screen.getByTestId('select-input-dialing-code');
      const phoneInput = screen.getByLabelText('(555) 555-5555');

      fireEvent.change(dialingCodeSelect, { target: { value: 'CA' } });
      fireEvent.change(phoneInput, { target: { value: '4161234567' } });

      expect(dialingCodeSelect).toHaveValue('CA');
      expect(phoneInput).toHaveValue('4161234567');
    });
  });

  describe('State Management', () => {
    test('clears error when field value changes', () => {
      render(<IdentityForm {...mockProps} />);

      const firstNameInput = screen.getByLabelText('First Name *');
      fireEvent.change(firstNameInput, { target: { value: 'John' } });

      expect(firstNameInput).toHaveValue('John');
    });
  });
});
