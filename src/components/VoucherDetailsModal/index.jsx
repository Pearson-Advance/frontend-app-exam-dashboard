import React from 'react';
import PropTypes from 'prop-types';
import { ModalDialog, Spinner } from '@edx/paragon';

const VoucherDetailsModal = ({
  isOpen,
  onClose,
  examTitle,
  voucherDetails,
  isLoading,
}) => (
  <ModalDialog
    title="Voucher Details"
    isOpen={isOpen}
    onClose={onClose}
    hasCloseButton
    size="md"
    isFullscreenOnMobile={false}
  >
    <ModalDialog.Header>
      <ModalDialog.Title>{examTitle}</ModalDialog.Title>
    </ModalDialog.Header>
    <ModalDialog.Body>
      {isLoading ? (
        <div className="d-flex justify-content-center p-4">
          <Spinner animation="border" screenReaderText="loading" />
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
  </ModalDialog>
);

VoucherDetailsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  examTitle: PropTypes.string.isRequired,
  voucherDetails: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }),
  ).isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default VoucherDetailsModal;
