import React, { useState } from 'react';
import { getConfig } from '@edx/frontend-platform';
import { Header } from 'react-paragon-topaz';
import { Container, Toast } from '@edx/paragon';

import { formatUserPayload } from 'features/utils/constants';
import { updateUserData, getScheduleUrl } from 'features/data/api';

import TermsConditions from 'components/TermsConditions';
import IdentityForm from 'components/form';

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
      const response = await getScheduleUrl();
      if (response?.data?.url) {
        window.location.href = response.data.url;
      } else {
        setToast({
          show: true,
          message: 'Unexpected response from the server.',
        });
      }
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
