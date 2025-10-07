import React from 'react';
import PropTypes from 'prop-types';
import { ModalDialog, Spinner } from '@edx/paragon';

import TermsConditions from 'components/TermsConditions';
import IdentityForm from 'components/form';

const MODAL_TYPES = {
  VOUCHER_DETAILS: 'voucher_details',
  TERMS_AND_SCHEDULE: 'terms_and_schedule',
};

const Modal = ({
  isOpen,
  onClose,
  modalType,
  examTitle,
  voucherDetails,
  isLoadingVoucher,
  termsAccepted,
  onAcceptTerms,
  onFormSubmit,
}) => {
  const handleCancel = () => {
    onClose();
  };

  const handlePrevious = () => {
    onAcceptTerms(false);
  };

  const renderDetails = () => (
    <>
      <ModalDialog.Header>
        <ModalDialog.Title>{examTitle}</ModalDialog.Title>
      </ModalDialog.Header>
      <ModalDialog.Body>
        {isLoadingVoucher ? (
          <div className="d-flex justify-content-center p-4">
            <Spinner animation="border" className="mie-3" screenReaderText="loading" />
          </div>
        ) : (
          <ul className="row d-flex flex-column px-1">
            {voucherDetails.map(({ title, description }) => (
              <li key={title} className="mb-2 d-flex align-items-center list-item text-truncate">
                <span className="col-sm-4 fw-semibold pr-0 text-truncate">{title}</span>
                <span className="col-sm-8 mb-0 pl-0 text-truncate">{description}</span>
              </li>
            ))}
          </ul>
        )}
      </ModalDialog.Body>
    </>
  );

  const renderTermsAndScheduleModal = () => (
    <ModalDialog.Body className="p-0 py-lg-5 hide-overflow-xp-0 p-lg-5">
      {!termsAccepted && (
        <TermsConditions
          onAccept={() => onAcceptTerms(true)}
          onCancel={handleCancel}
        />
      )}
      {termsAccepted && (
        <IdentityForm
          onSubmit={onFormSubmit}
          onCancel={handleCancel}
          onPrevious={handlePrevious}
        />
      )}
    </ModalDialog.Body>
  );

  const isTermsModal = modalType === MODAL_TYPES.TERMS_AND_SCHEDULE;
  const modalSize = isTermsModal ? 'xl' : 'md';

  return (
    <ModalDialog
      title={isTermsModal ? '' : 'Voucher Details'}
      isOpen={isOpen}
      onClose={onClose}
      hasCloseButton
      size={modalSize}
      isFullscreenOnMobile={false}
      isOverflowVisible={false}
    >
      {modalType === MODAL_TYPES.VOUCHER_DETAILS && renderDetails()}
      {modalType === MODAL_TYPES.TERMS_AND_SCHEDULE && renderTermsAndScheduleModal()}
    </ModalDialog>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  modalType: PropTypes.oneOf(Object.values(MODAL_TYPES)),
  examTitle: PropTypes.string,
  voucherDetails: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }),
  ),
  isLoadingVoucher: PropTypes.bool,
  termsAccepted: PropTypes.bool,
  onAcceptTerms: PropTypes.func.isRequired,
  onFormSubmit: PropTypes.func.isRequired,
};

Modal.defaultProps = {
  modalType: null,
  examTitle: '',
  voucherDetails: [],
  isLoadingVoucher: false,
  termsAccepted: false,
};

export { MODAL_TYPES };

export default Modal;
