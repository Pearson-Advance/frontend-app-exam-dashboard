import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  Button,
  Col,
  ModalDialog,
  useToggle,
  IconButton,
  Icon,
  Dropdown,
} from '@edx/paragon';
import { MoreVert } from '@edx/paragon/icons';

import './index.scss';
import { examStatus } from 'features/utils/constants';

const statusTextMap = {
  complete: 'Complete',
  scheduled: 'Scheduled',
  unscheduled: 'Unscheduled',
};

const statusClassMap = {
  complete: 'completed-background',
  scheduled: 'scheduled-background',
  unscheduled: 'unscheduled-background',
};

const statusStyleMap = {
  complete: 'badge-complete',
  scheduled: 'badge-scheduled',
  unscheduled: 'badge-unscheduled',
};

const allowedStatuses = [examStatus.COMPLETE, examStatus.SCHEDULED];

const ExamCard = ({
  title,
  status,
  image,
  examDetails,
  additionalExamDetails,
  onScheduleExam,
  dropdownItems,
  hideFooter,
}) => {
  const [isOpen, open, close] = useToggle(false);
  const statusClass = statusClassMap[status] || '';
  const statusText = statusTextMap[status] || '';
  const statusStyle = statusStyleMap[status] || '';

  return (
    <Col xs={12} md={6} className="mb-4">
      <Card className="card-wrapper w-100">
        <div className={`card-header-background ${statusClass}`}>
          <span className={`custom-badge ${statusStyle}`}>{statusText}</span>
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
          <ul className="row d-flex flex-column px-1" id="exam-details-list">
            {examDetails.map(({ title: itemTitle, description }) => (
              <li key={itemTitle} className="mb-2 d-flex align-items-center list-item text-truncate">
                <span className="col-sm-2 col-md-3 fw-semibold pr-0 text-truncate" title={itemTitle}>{itemTitle}</span>
                <span className="col-sm-10 col-md-9 mb-0 pl-0 text-truncate" title={description}>{description}</span>
              </li>
            ))}
          </ul>
        </Card.Section>
        {!hideFooter && (
          <Card.Footer className="px-4 pb-4 d-flex flex-column">
            <div className="custom-card-separator" />
            {status === examStatus.UNSCHEDULED ? (
              <Button onClick={onScheduleExam} className="m-0" id="custom-card-button-schedule">
                Schedule Exam
              </Button>
            ) : (
              <Button onClick={open} className="m-0" id="custom-card-button-voucher-details">
                Voucher Details
              </Button>
            )}
          </Card.Footer>
        )}
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
    </Col>
  );
};

ExamCard.propTypes = {
  title: PropTypes.string.isRequired,
  status: PropTypes.oneOf([examStatus.COMPLETE, examStatus.SCHEDULED, examStatus.UNSCHEDULED]).isRequired,
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
  onScheduleExam: PropTypes.func,
  dropdownItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      iconClass: PropTypes.string,
      onClick: PropTypes.func.isRequired,
    }),
  ),
  hideFooter: PropTypes.bool,
};

ExamCard.defaultProps = {
  image: null,
  dropdownItems: null,
  onScheduleExam: () => {},
  additionalExamDetails: [],
  hideFooter: false,
};

export default ExamCard;
