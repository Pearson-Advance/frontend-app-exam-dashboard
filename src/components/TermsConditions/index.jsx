import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form } from '@edx/paragon';
import { Button } from 'react-paragon-topaz';

import { termsText } from 'components/TermsConditions/termsText';
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

  return (
    <Form onSubmit={handleContinueButton}>
      <div className="terms-section">
        <h3>Terms and Conditions</h3>
        <p>For security reasons, we need the following information to verify your identity</p>
        <div className="p-4 terms-content">
          {termsText()}
        </div>
        <div className="d-flex py-3 flex-column align-items-end">
          <Form.Checkbox
            name="terms"
            checked={checked}
            onChange={(e) => {
              setChecked(e.target.checked);
              setShowError(false);
            }}
          >
            I have read and agree to the above terms and conditions
          </Form.Checkbox>
          {showError && <p className="text-danger">You must accept to continue</p>}
        </div>
      </div>
      <div className="d-flex justify-content-between">
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
          className="btntpz btn btn-outline-primary"
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
