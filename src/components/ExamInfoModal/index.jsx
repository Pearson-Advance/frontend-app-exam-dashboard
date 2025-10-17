import React from 'react';
import PropTypes from 'prop-types';
import { ModalDialog, Spinner } from '@edx/paragon';

import './index.scss';

const ExamInfoModal = ({
  isOpen, onClose, title, data, isLoading,
}) => (
  <ModalDialog
    isOpen={isOpen}
    onClose={onClose}
    title={title}
    hasCloseButton
    size="md"
    isFullscreenOnMobile={false}
  >
    <ModalDialog.Header>
      <ModalDialog.Title>{title}</ModalDialog.Title>
    </ModalDialog.Header>
    <ModalDialog.Body>
      {isLoading ? (
        <div className="d-flex justify-content-center p-4">
          <Spinner animation="border" screenReaderText="loading" />
        </div>
      ) : (
        <ul className="row d-flex flex-column px-1 modal-body-content">
          {data.map(({ title: itemTitle, description }) => (
            <li key={itemTitle} className="mb-2 d-flex align-items-center list-item text-truncate">
              <span className="col-sm-4 fw-semibold pr-0 text-truncate">{itemTitle}</span>
              <span className="col-sm-8 mb-0 pl-0 text-truncate">{description}</span>
            </li>
          ))}
        </ul>
      )}
    </ModalDialog.Body>
  </ModalDialog>
);

ExamInfoModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }),
  ).isRequired,
  isLoading: PropTypes.bool,
};

ExamInfoModal.defaultProps = {
  isLoading: false,
};

export default ExamInfoModal;
