import React, { useCallback, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  Button,
  Col,
  IconButton,
  Icon,
  Dropdown,
} from '@edx/paragon';
import { MoreVert } from '@edx/paragon/icons';

import './index.scss';
import {
  examStatus,
  EXAM_STATUS_UI_STYLES,
} from 'features/utils/constants';
import { handleGetVoucherDetails } from 'features/utils/globals';
import ExamInfoModal from 'components/ExamInfoModal';

const allowedStatuses = [examStatus.COMPLETE, examStatus.SCHEDULED];

const ExamCard = ({
  examId,
  title,
  status,
  image,
  examDetails,
  dropdownItems,
}) => {
  const {
    text = '',
    class: customClass = '',
    badge = '',
  } = EXAM_STATUS_UI_STYLES[status] || {};

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [infoData, setInfoData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const cacheRef = useRef(null);

  const handleOpenDetails = useCallback(async () => {
    setIsModalOpen(true);

    if (cacheRef.current) {
      setInfoData(cacheRef.current);
      return;
    }

    setIsLoading(true);

    try {
      const voucherDetails = await handleGetVoucherDetails(examId);

      cacheRef.current = voucherDetails;
      setInfoData(voucherDetails);
    } catch (error) {
      const errorData = [{
        title: 'Error',
        description: 'Failed to load details',
      }];
      setInfoData(errorData);
    } finally {
      setIsLoading(false);
    }
  }, [examId]);

  const handleCloseDetails = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <>
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
          <Card.Footer className="px-4 pb-4 d-flex flex-column">
            <div className="custom-card-separator" />
            <Button onClick={handleOpenDetails} className="m-0" id="custom-card-button-voucher-details">
              Voucher Details
            </Button>
          </Card.Footer>
        </Card>
      </Col>

      <ExamInfoModal
        isOpen={isModalOpen}
        onClose={handleCloseDetails}
        title={title}
        data={infoData}
        isLoading={isLoading}
      />
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
  dropdownItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      iconClass: PropTypes.string,
      onClick: PropTypes.func.isRequired,
      disabled: PropTypes.bool,
    }),
  ),
  examId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

ExamCard.defaultProps = {
  image: null,
  dropdownItems: null,
};

export default ExamCard;
