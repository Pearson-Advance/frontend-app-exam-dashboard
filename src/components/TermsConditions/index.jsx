import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form } from '@edx/paragon';
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
    <Form onSubmit={handleContinueButton}>
      <div className="terms-section">
        <h3 className="pt-2">Terms and Conditions</h3>
        <p className="pb-2 description-text">For security reasons, we need the following information to verify your identity</p>
        <div className="p-4 terms-content">
          {TermsText()}
        </div>
        <div className="d-flex pt-4 flex-column align-items-end">
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
      <div className="d-flex justify-content-between section-buttons">
        <Button
          type="button"
          className="btntpz btn-text btn-tertiary mr-2"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="outline-primary"
        >
          Continue
        </Button>
      </div>
    </Form>
  );
};

TermsConditions.propTypes = {
  onAccept: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default TermsConditions;
