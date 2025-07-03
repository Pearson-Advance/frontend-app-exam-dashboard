import React, { useState } from 'react';
import { getConfig } from '@edx/frontend-platform';
import { Header } from 'react-paragon-topaz';
import { Container } from '@edx/paragon';
import { logError } from '@edx/frontend-platform/logging';

import { countries } from 'constants';
import { updateUserData } from 'features/data/api';
import TermsConditions from 'components/TermsConditions';
import IdentityForm from 'components/form';

const buildUserPayload = (formData) => {
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

  const handleCancelTerms = () => {
    window.location.href = 'https://www.pearsonvue.com/us/en/itspecialist.html';
  };

  const handleFormSubmit = async (formData) => {
    const payload = buildUserPayload(formData);

    try {
      await updateUserData(payload);
      window.location.href = `${getConfig().WEBNG_PLUGIN_API_BASE_URL}/appointment/schedule`;
    } catch (error) {
      logError(error);
    }
  };

  return (
    <>
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
          {acceptedTerms && <IdentityForm onSubmit={handleFormSubmit} />}
        </Container>
      </div>
    </>
  );
};

export default SchedulePage;
