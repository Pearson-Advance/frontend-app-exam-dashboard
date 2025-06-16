import React from 'react';
import { getConfig } from '@edx/frontend-platform';
import { Header } from 'react-paragon-topaz';
import { Container } from '@edx/paragon';

const SchedulePage = () => (
  <>
    <Header
      src={`${getConfig().LOGO_URL}`}
      logoUrl={`${getConfig().LMS_BASE_URL}`}
    />
    <div className="pageWrapper p-4">
      <Container size="xl" className="bg-white rounded p-2">
        <h1>Schedule Page</h1>
      </Container>
    </div>
  </>
);

export default SchedulePage;
