import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form } from '@openedx/paragon';
import { Button } from 'react-paragon-topaz';

import { TermsText } from 'components/TermsConditions/TermsText';
import './index.scss';

const TermsConditions = ({ onAccept, onCancel }) => {
  const [checked, setChecked] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleContinueButton = (e) => {
    e.preventDefault();
    if (!checked) {
      setShowError(true);
      return;
    }
    onAccept();
  };

  const handleCheckboxChange = (e) => {
    setChecked(e.target.checked);
    setShowError(false);
  };

  return (
    <Form className="border rounded" onSubmit={handleContinueButton}>
      <div className="p-5">
        <h2 className="mb-4">Terms and Conditions</h2>
        <p className="lead mb-4">For security reasons, we need the following information to verify your identity</p>
        <div className="mb-4 p-5 border rounded">
          {TermsText()}
        </div>
        <div className="d-flex flex-column align-items-end">
          <div>
            <Form.Checkbox
              name="terms"
              checked={checked}
              onChange={handleCheckboxChange}
              isInvalid={showError}
            >
              I have read and agree to the above terms and conditions
            </Form.Checkbox>
            {showError && (
              <Form.Control.Feedback type="invalid">
                You must agree to the terms and conditions to continue.
              </Form.Control.Feedback>
            )}
          </div>
        </div>
      </div>
      <div className="p-4 d-flex justify-content-between border-top">
        <div className="d-flex justify-content-start">
          <Button
            variant="tertiary"
            type="button"
            className="p-3"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
        <div className="d-flex justify-content-end">
          <Button
            className="p-3"
            variant="outline-primary"
            type="submit"
          >
            Continue
          </Button>
        </div>
      </div>
    </Form>
  );
};

TermsConditions.propTypes = {
  onAccept: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default TermsConditions;
