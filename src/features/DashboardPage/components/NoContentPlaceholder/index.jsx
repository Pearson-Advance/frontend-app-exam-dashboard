import React from 'react';
import PropTypes from 'prop-types';

const NoContentPlaceholder = ({ title, description }) => (
  <div className="no-content-placeholder-container">
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

NoContentPlaceholder.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
};

NoContentPlaceholder.defaultProps = {
  title: 'No exams found',
  description: 'It looks like you don\'t have exams or vouchers.',
};

export default NoContentPlaceholder;
