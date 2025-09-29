import React, { useState } from 'react';
import { Container } from '@edx/paragon';

import { scheduleExam } from 'features/utils/globals';

import TermsConditions from 'components/TermsConditions';
import IdentityForm from 'components/form';

const SchedulePage = () => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleCancelTerms = () => {
    window.location.href = 'https://www.pearsonvue.com/us/en/itspecialist.html';
  };

  const handleFormSubmit = (formData) => scheduleExam({ formData });

  return (
    <div className="pageWrapper p-3">
      <Container size="xl" className="bg-white rounded p-0">
        {
          !acceptedTerms && (
          <TermsConditions
            onAccept={() => setAcceptedTerms(true)}
            onCancel={handleCancelTerms}
          />
          )
        }
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
  );
};

export default SchedulePage;
