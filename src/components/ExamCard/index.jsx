import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  Button,
  Col,
  ModalDialog,
  useToggle,
  IconButton,
  Icon,
  Toast,
  Dropdown,
} from '@edx/paragon';
import { MoreVert } from '@edx/paragon/icons';

import './index.scss';
import { examStatus, EXAM_STATUS_UI_STYLES, formatUserPayload } from 'features/utils/constants';
import { updateUserData, getScheduleUrl } from 'features/data/api';

import TermsConditions from 'components/TermsConditions';
import IdentityForm from 'components/form';

const allowedStatuses = [examStatus.COMPLETE, examStatus.SCHEDULED];

const ExamCard = ({
  title,
  status,
  image,
  examDetails,
  additionalExamDetails,
  dropdownItems,
  hideVoucherButton,
}) => {
  const [isTermsOpen, openTerms, closeTerms] = useToggle(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isOpen, open, close] = useToggle(false);
  const [toast, setToast] = useState({ show: false, message: '' });

  const {
    text = '',
    class: customClass = '',
    badge = '',
  } = EXAM_STATUS_UI_STYLES[status] || {};

  const handleOnCancel = () => {
    closeTerms();
    setAcceptedTerms(false);
  };

  const handleFormSubmit = async (formData) => {
    const payload = formatUserPayload(formData);

    try {
      await updateUserData(payload);
      const response = await getScheduleUrl();
      if (response?.data?.url) {
        window.location.href = response.data.url;
      } else {
        setToast({
          show: true,
          message: 'Unexpected response from the server.',
        });
      }
    } catch (error) {
      const { customAttributes } = error || {};
      const { httpErrorResponseData, httpErrorStatus } = customAttributes || {};

      if (httpErrorStatus === 400) {
        setToast({
          show: true,
          message: httpErrorResponseData,
        });
      } else {
        setToast({
          show: true,
          message: 'Internal server error',
        });
      }
    }
  };

  return (
    <>
      <Toast
        onClose={() => setToast(prev => ({ ...prev, show: false }))}
        dismissible
        hasCloseButton
        className="mb-3"
        show={toast.show}
      >
        {toast.message}
      </Toast>
      <Col xs={12} md={6} className="mb-4">
        <Card className="card-wrapper w-100">
          <div className={`card-header-background ${customClass}`}>
            <span className={`custom-badge ${badge}`}>{text}</span>
            {image && <div className="card-header-image" style={{ backgroundImage: `url(${image})` }} />}
          </div>
          <div className="card-header-container">
            <h2 className="px-4 text-truncate custom-card-header">{title}</h2>
            {
            (dropdownItems?.length > 0 && allowedStatuses.includes(status)) && (
              <Dropdown id="dropdown-overlay">
                <Dropdown.Toggle
                  id="dropdown-toggle"
                  as={IconButton}
                  src={MoreVert}
                  iconAs={Icon}
                  variant="primary"
                  alt="menu"
                />
                <Dropdown.Menu>
                  {dropdownItems.map(({
                    label,
                    iconClass,
                    onClick,
                    disabled,
                  }) => (
                    <Dropdown.Item key={label} onClick={onClick} className="text-truncate" disabled={disabled}>
                      {iconClass && <i className={`${iconClass} mr-2`} />}
                      { disabled ? 'Operation in process...' : label }
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            )
          }
          </div>
          <Card.Section className="px-4">
            <div className="custom-card-separator" />
            <ul className="row d-flex flex-column px-1 mb-0" id="exam-details-list">
              {examDetails.map(({ title: itemTitle, description }) => (
                <li key={itemTitle} className="mb-2 mb-md-0 d-flex align-items-center list-item text-truncate">
                  <span className="col-3 col-xxl-2 fw-semibold pr-0 text-truncate" title={itemTitle}>{itemTitle}</span>
                  <span className="col-sm-10 col-md-9 mb-0 pl-0 custom-text-wrap" title={description}>{description}</span>
                </li>
              ))}
            </ul>
          </Card.Section>
          {
          (status === examStatus.CANCELED || !hideVoucherButton) && (
            <Card.Footer className="px-4 pb-4 d-flex flex-column">
              <div className="custom-card-separator" />
              {status === examStatus.CANCELED && (
                <Button onClick={openTerms} className="m-0" id="custom-card-button-schedule">
                  Schedule Exam
                </Button>
              )}
              {!hideVoucherButton && (
                <Button onClick={open} className="m-0" id="custom-card-button-voucher-details">
                  Voucher Details
                </Button>
              )}
            </Card.Footer>
          )
        }
        </Card>
        <ModalDialog
          title="Voucher Details"
          isOpen={isOpen}
          onClose={close}
          hasCloseButton
          isFullscreenOnMobile={false}
          isOverflowVisible={false}
        >
          <ModalDialog.Header>
            <ModalDialog.Title>{title}</ModalDialog.Title>
          </ModalDialog.Header>
          <ModalDialog.Body>
            <ul className="row d-flex flex-column px-1">
              {additionalExamDetails.map(({ title: detailTitle, description }) => (
                <li key={detailTitle} className="mb-2 d-flex align-items-center list-item text-truncate">
                  <span className="col-sm-4 fw-semibold pr-0 text-truncate">{detailTitle}</span>
                  <span className="col-sm-8 mb-0 pl-0 text-truncate">{description}</span>
                </li>
              ))}
            </ul>
          </ModalDialog.Body>
        </ModalDialog>
        <ModalDialog
          title=""
          isOpen={isTermsOpen}
          onClose={handleOnCancel}
          hasCloseButton
          size="xl"
          isFullscreenOnMobile={false}
          isOverflowVisible={false}
        >
          <ModalDialog.Body className="p-0 py-lg-5 hide-overflow-xp-0 p-lg-5">
            {!acceptedTerms && (
            <TermsConditions
              onAccept={() => setAcceptedTerms(true)}
              onCancel={handleOnCancel}
            />
            )}
            {acceptedTerms
            && (
            <IdentityForm
              onSubmit={handleFormSubmit}
              onCancel={handleOnCancel}
              onPrevious={() => setAcceptedTerms(false)}
            />
            )}
          </ModalDialog.Body>
        </ModalDialog>
      </Col>
    </>
  );
};

ExamCard.propTypes = {
  title: PropTypes.string.isRequired,
  status: PropTypes.oneOf(Object.values(examStatus)).isRequired,
  image: PropTypes.string,
  examDetails: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }),
  ).isRequired,
  additionalExamDetails: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }),
  ),
  dropdownItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      iconClass: PropTypes.string,
      onClick: PropTypes.func.isRequired,
    }),
  ),
  hideVoucherButton: PropTypes.bool,
};

ExamCard.defaultProps = {
  image: null,
  dropdownItems: null,
  additionalExamDetails: [],
  hideVoucherButton: false,
};

export default ExamCard;
