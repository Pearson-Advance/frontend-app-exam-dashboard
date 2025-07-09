import React, { useState } from 'react';
import { getConfig } from '@edx/frontend-platform';
import { Header } from 'react-paragon-topaz';
import { Container, Toast } from '@edx/paragon';

import { countries } from 'constants';
import { updateUserData } from 'features/data/api';
import TermsConditions from 'components/TermsConditions';
import IdentityForm from 'components/form';

const formatUserPayload = (formData) => {
  const phoneCountryCode = countries.find(
    (c) => c.cca2 === formData.dialingCode.value,
  )?.dialingCode?.replace('+', '') || '1';

  return {
    email: formData.email.value,
    first_name: formData.firstName.value,
    last_name: formData.lastName.value,
    postal_code: formData.postalCode.value,
    phone_country_code: phoneCountryCode,
    state: formData.state.value,
    profile: {
      country: formData.country.value,
      city: formData.city.value,
      mailing_address: formData.address.value,
      phone_number: formData.phone.value,
    },
  };
};

const SchedulePage = () => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });

  const handleCancelTerms = () => {
    window.location.href = 'https://www.pearsonvue.com/us/en/itspecialist.html';
  };

  const handleFormSubmit = async (formData) => {
    const payload = formatUserPayload(formData);

    try {
      await updateUserData(payload);
      window.location.href = `${getConfig().WEBNG_PLUGIN_API_BASE_URL}/appointment/schedule`;
    } catch (error) {
      const { customAttributes } = error || {};
      const { httpErrorResponseData, httpErrorStatus } = customAttributes || {};

      if (httpErrorStatus === 400) {
        setToast({
          show: true,
          message: httpErrorResponseData,
        });
      } else {
        setToast({
          show: true,
          message: 'Internal server error',
        });
      }
    }
  };

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
      <Header
        src={getConfig().LOGO_URL}
        logoUrl={getConfig().LMS_BASE_URL}
      />
      <div className="pageWrapper p-3">
        <Container size="xl" className="bg-white rounded p-0">
          {!acceptedTerms && (
            <TermsConditions
              onAccept={() => setAcceptedTerms(true)}
              onCancel={handleCancelTerms}
            />
          )}
          {acceptedTerms
            && (
            <IdentityForm
              onSubmit={handleFormSubmit}
              onCancel={handleCancelTerms}
              onPrevious={() => setAcceptedTerms(false)}
            />
            )}
        </Container>
      </div>
    </>
  );
};

export default SchedulePage;
