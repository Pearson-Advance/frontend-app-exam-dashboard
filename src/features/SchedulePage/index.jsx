import React, { useState } from 'react';
import { getConfig } from '@edx/frontend-platform';
import { Header } from 'react-paragon-topaz';
import { Container } from '@edx/paragon';

import TermsConditions from 'components/TermsConditions';

const SchedulePage = () => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleCancelTerms = () => {
    window.location.href = 'https://www.pearsonvue.com/us/en/itspecialist.html';
  };

  return (
    <>
      <Header
        src={getConfig().LOGO_URL}
        logoUrl={getConfig().LMS_BASE_URL}
      />
      <div className="pageWrapper p-4">
        <Container size="xl" className="bg-white rounded p-0">
          {!acceptedTerms && (
          <TermsConditions
            onAccept={() => setAcceptedTerms(true)}
            onCancel={handleCancelTerms}
          />
          )}
          {acceptedTerms && <div>Form Component</div>}
        </Container>
      </div>
    </>
  );
};

export default SchedulePage;
