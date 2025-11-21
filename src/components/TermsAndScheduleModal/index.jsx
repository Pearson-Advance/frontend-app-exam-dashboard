import React from 'react';
import PropTypes from 'prop-types';
import { ModalDialog } from '@edx/paragon';
import TermsConditions from 'components/TermsConditions';
import IdentityForm from 'components/form';

const TermsAndScheduleModal = ({
  isOpen,
  onClose,
  termsAccepted,
  onAcceptTerms,
  onSubmit,
}) => {
  const handleCancel = () => onClose();
  const handlePrevious = () => onAcceptTerms(false);

  React.useEffect(() => () => { onAcceptTerms(false); }, [onAcceptTerms]);

  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title=""
      hasCloseButton
      isFullscreenOnMobile={false}
      isOverflowVisible={false}
    >
      <ModalDialog.Body className="p-0 py-lg-5 hide-overflow-xp-0 p-lg-5">
        {!termsAccepted ? (
          <TermsConditions onAccept={() => onAcceptTerms(true)} onCancel={handleCancel} />
        ) : (
          <IdentityForm onSubmit={onSubmit} onCancel={handleCancel} onPrevious={handlePrevious} />
        )}
      </ModalDialog.Body>
    </ModalDialog>
  );
};

TermsAndScheduleModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  termsAccepted: PropTypes.bool.isRequired,
  onAcceptTerms: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default TermsAndScheduleModal;
