import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Form, Toast, Icon } from '@edx/paragon';
import { Button } from 'react-paragon-topaz';
import { logError } from '@edx/frontend-platform/logging';
import { AppContext } from '@edx/frontend-platform/react';
import { WarningFilled } from '@edx/paragon/icons';

import { Input, PhoneInput, SelectInput } from 'components/form/components';
import { countries, unitedStates, canadianProvincesAndTerritories } from 'features/utils/constants';
import './index.scss';

const UNITED_STATES = 'USA';
const CANADA = 'CAN';

const states = {
  [UNITED_STATES]: unitedStates,
  [CANADA]: canadianProvincesAndTerritories,
};

const countryDivitionPlaceholder = {
  [UNITED_STATES]: 'State *',
  [CANADA]: 'Province / Territory *',
};

const getStateOptions = (country) => states[country] || [];

const parsedCountries = countries?.map(country => ({
  label: `${JSON.parse(`"${country.flag}"`)} ${country.name}`,
  value: country.cca3,
}));

const countriesWithStates = [UNITED_STATES, CANADA];

const FormHeader = () => (
  <Form.Row className="flex-column mb-4 pl-1">
    <h3 className="form-title mb-4">Verify your identity</h3>
    <p className="form-subtitle">
      <Icon src={WarningFilled} className="align-middle mr-1 text-danger icon-header" />
      <strong className="pl-4">
        IMPORTANT: You must enter your first/given and last/surname/family name exactly as it appears
        on the identification (ID) you will present at the test center.
      </strong>
      <br />
      If there is not an exact match, you will not be able to take your test and
      you will not be reimbursed for any fees paid.
    </p>
  </Form.Row>
);

const FormActions = ({ onCancel, onPrevious, isLoading }) => (
  <div className="d-flex justify-content-between border-top px-3 px-md-4 p-md-4 py-4">
    <div className="d-flex justify-content-start gap-2">
      <Button
        variant="tertiary"
        type="button"
        className="p-2 px-md-4 mr-1 mr-md-0"
        onClick={onCancel}
        disabled={isLoading}
      >
        Cancel
      </Button>
    </div>
    <div className="d-flex justify-content-end gap-2">
      <Button
        variant="primary"
        text
        type="button"
        className="mr-2 mr-md-3 p-2 px-md-4"
        onClick={onPrevious}
        disabled={isLoading}
      >
        Previous
      </Button>
      <Button
        className="p-2 px-md-4 py-3"
        variant="outline-primary"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? 'Submitting...' : 'Submit'}
      </Button>
    </div>
  </div>
);

const initialFormState = {
  firstName: { isDisabled: false, value: '', error: null },
  lastName: { isDisabled: false, value: '', error: null },
  email: { isDisabled: false, value: '', error: null },
  dialingCode: { isDisabled: false, value: UNITED_STATES, error: null },
  phone: { isDisabled: false, value: '', error: null },
  address: { isDisabled: false, value: '', error: null },
  apartment: { isDisabled: false, value: '', error: null },
  city: { isDisabled: false, value: '', error: null },
  state: { isDisabled: false, value: '', error: null },
  postalCode: { isDisabled: false, value: '', error: null },
  country: { isDisabled: false, value: '', error: null },
};

/**
 * Identity verification form component with local state management
 * @param {Object} props - Component props
 * @param {Function} props.onSubmit - Callback function called when form is submitted with form data
 * @param {Function} props.onCancel - Optional callback function called when cancel button is clicked
 * @param {Function} props.onPrevious - Optional callback function called when previous button is clicked
 * @returns {JSX.Element} The identity form component
 */
const IdentityForm = ({
  onSubmit,
  onCancel = () => {},
  onPrevious = () => {},
}) => {
  const { authenticatedUser } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    ...initialFormState,
    email: {
      value: authenticatedUser?.email,
      isDisabled: !!authenticatedUser?.email,
    },
  });
  const [toast, setToast] = useState({ show: false, message: '' });

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        value,
        error: null,
      },
    }));
  };

  const formatError = (val) => (Array.isArray(val) ? val.join(' ') : val || null);

  const showFormErrors = (rawErrors) => {
    let errors = rawErrors;

    if (typeof errors !== 'string') {
      logError('Unsupported error format', errors);
      return;
    }

    try {
      errors = JSON.parse(errors);
    } catch (e) {
      logError('Failed to parse form errors', errors);
      return;
    }

    setFormData({
      ...formData,
      firstName: { ...formData.firstName, error: formatError(errors.first_name) },
      lastName: { ...formData.lastName, error: formatError(errors.last_name) },
      email: { ...formData.email, error: formatError(errors.email) },
      dialingCode: { ...formData.dialingCode, error: formatError(errors.phone_country_code) },
      phone: { ...formData.phone, error: formatError(errors.profile?.phone_number) },
      address: { ...formData.address, error: formatError(errors.profile?.mailing_address) },
      city: { ...formData.city, error: formatError(errors.profile?.city) },
      state: { ...formData.state, error: formatError(errors.state) },
      postalCode: { ...formData.postalCode, error: formatError(errors.postal_code) },
      country: { ...formData.country, error: formatError(errors.country) },
    });
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      await onSubmit(formData);
    } catch (error) {
      logError(error);
      const { customAttributes } = error || {};
      const { httpErrorResponseData, httpErrorStatus } = customAttributes || {};

      if (httpErrorStatus === 400) {
        showFormErrors(httpErrorResponseData);
        setToast({
          show: true,
          message: 'The process could not be completed, review the errors and retry.',
        });
        return;
      }

      if (httpErrorStatus === 500) {
        setToast({
          show: true,
          message: 'Internal server error. Please try again later.',
        });
        return;
      }

      setToast({
        show: true,
        message: 'An unexpected error occurred. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(initialFormState);
    onCancel();
  };

  const showStateAndPostalCodeField = countriesWithStates.includes(formData.country.value);

  return (
    <>
      {toast.show && (
        <Toast
          onClose={() => setToast(prev => ({ ...prev, show: false }))}
          dismissible
          hasCloseButton
          className="mb-3"
        >
          {toast.message}
        </Toast>
      )}
      <Form onSubmit={handleSubmit} className="p-0 pt-3 form-wrapper" role="form">
        <div className="p-4">
          <FormHeader />

          <Form.Row className="d-flex flex-wrap">
            <Input
              id="firstName"
              label="First Name *"
              required
              value={formData.firstName.value}
              error={formData.firstName.error}
              isDisabled={formData.firstName.isDisabled}
              isLoading={isLoading}
              onChange={(value) => handleInputChange('firstName', value)}
            />

            <Input
              id="lastName"
              label="Last Name *"
              required
              value={formData.lastName.value}
              error={formData.lastName.error}
              isDisabled={formData.lastName.isDisabled}
              isLoading={isLoading}
              onChange={(value) => handleInputChange('lastName', value)}
            />
          </Form.Row>

          <Form.Row>
            <Input
              id="email"
              label="Email *"
              type="email"
              required
              value={formData.email.value}
              error={formData.email.error}
              isDisabled={formData.email.isDisabled}
              isLoading={isLoading}
              onChange={(value) => handleInputChange('email', value)}
            />

            <PhoneInput
              dialingCodeValue={formData.dialingCode.value}
              dialingCodeError={formData.dialingCode.error}
              dialingCodeDisabled={formData.dialingCode.isDisabled}
              phoneValue={formData.phone.value}
              phoneError={formData.phone.error}
              phoneDisabled={formData.phone.isDisabled}
              isLoading={isLoading}
              onDialingCodeChange={(value) => handleInputChange('dialingCode', value)}
              onPhoneChange={(value) => handleInputChange('phone', value)}
            />
          </Form.Row>

          <Form.Row>
            <Input
              id="address"
              label="Address *"
              required
              value={formData.address.value}
              error={formData.address.error}
              isDisabled={formData.address.isDisabled}
              isLoading={isLoading}
              onChange={(value) => handleInputChange('address', value)}
            />

            <Input
              id="apartment"
              label="Apt #, Suite, Floor"
              value={formData.apartment.value}
              error={formData.apartment.error}
              isDisabled={formData.apartment.isDisabled}
              isLoading={isLoading}
              onChange={(value) => handleInputChange('apartment', value)}
            />
          </Form.Row>

          <Form.Row>
            <Input
              id="city"
              label="City *"
              required
              value={formData.city.value}
              error={formData.city.error}
              isDisabled={formData.city.isDisabled}
              isLoading={isLoading}
              onChange={(value) => handleInputChange('city', value)}
            />

            {showStateAndPostalCodeField && (
              <SelectInput
                id="state"
                label="State / Province"
                placeholder={countryDivitionPlaceholder[formData.country.value] || 'State / Province *'}
                options={getStateOptions(formData.country.value)}
                value={formData.state.value}
                error={formData.state.error}
                isDisabled={formData.state.isDisabled}
                isLoading={isLoading}
                onChange={(value) => handleInputChange('state', value)}
              />
            )}
          </Form.Row>

          <Form.Row>
            {showStateAndPostalCodeField && (
              <Input
                id="postalCode"
                label="ZIP / Postal Code *"
                required
                value={formData.postalCode.value}
                error={formData.postalCode.error}
                isDisabled={formData.postalCode.isDisabled}
                isLoading={isLoading}
                onChange={(value) => handleInputChange('postalCode', value)}
              />
            )}

            <SelectInput
              id="country"
              label="Country / Region"
              placeholder="Country / Region *"
              className="form-input"
              options={parsedCountries}
              value={formData.country.value}
              error={formData.country.error}
              isDisabled={formData.country.isDisabled}
              isLoading={isLoading}
              onChange={(value) => handleInputChange('country', value)}
            />
          </Form.Row>
        </div>

        <FormActions
          onCancel={handleCancel}
          onPrevious={onPrevious}
          isLoading={isLoading}
        />
      </Form>
    </>
  );
};

FormActions.propTypes = {
  onCancel: PropTypes.func,
  onPrevious: PropTypes.func,
  isLoading: PropTypes.bool,
};

FormActions.defaultProps = {
  onCancel: null,
  onPrevious: null,
  isLoading: false,
};

IdentityForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  onPrevious: PropTypes.func,
};

IdentityForm.defaultProps = {
  onCancel: () => {},
  onPrevious: () => {},
};

export default IdentityForm;
