import React, { useMemo } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Button } from 'react-paragon-topaz';

import {
  ERROR_CODES,
  ERROR_MESSAGES,
  WORKFLOWS,
  REDIRECT_URLS,
  BUTTON_LABELS,
  BUTTON_LABELS_MAP,
} from 'features/utils/constants';

import './index.scss';

const ExamErrorSSO = () => {
  const location = useLocation();
  const history = useHistory();

  const params = new URLSearchParams(location.search);
  const errorCode = params.get('s');
  const workflow = params.get('w');

  const message = useMemo(() => {
    if (!errorCode) { return ERROR_MESSAGES[ERROR_CODES.GENERIC]; }
    return ERROR_MESSAGES[errorCode] ?? ERROR_MESSAGES[ERROR_CODES.GENERIC];
  }, [errorCode]);

  const redirectMap = {
    [WORKFLOWS.PASSTHROUGH]: () => {
      window.location.href = REDIRECT_URLS.IT_SPECIALIST;
    },
    [WORKFLOWS.DASHBOARD]: () => {
      history.push(REDIRECT_URLS.DASHBOARD);
    },
    default: () => {
      history.push(REDIRECT_URLS.HOME);
    },
  };

  const handleRedirect = redirectMap[workflow] ?? redirectMap.default;

  const buttonLabel = BUTTON_LABELS_MAP[workflow] ?? BUTTON_LABELS.DASHBOARD;

  return (
    <div className="exam-sso-error-page">
      <h1 className="error-title">An error has occurred</h1>
      <p className="error-message">{message}</p>

      <Button
        type="button"
        variant="outline-primary"
        onClick={handleRedirect}
      >
        {buttonLabel}
      </Button>
    </div>
  );
};

export default ExamErrorSSO;
