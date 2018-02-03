import React from 'react';
import PropTypes from 'prop-types';
import './style.css';

const ClaimItem = ({ employee, claimItem }) => {
  const {
    claim_item_id,
    manager_first_name, 
    manager_last_name,
    manager_email,
    description, 
    amount,
    comment, 
    expense_type,
    image_url,
    has_receipt
  } = claimItem;
  return (
    <div>
    </div>
  );
}

ClaimItem.propTypes = {
  claimItem: PropTypes.shape({
    claim_item_id: PropTypes.number.isRequired,
    manager_first_name: PropTypes.string.isRequired,
    manager_last_name: PropTypes.string.isRequired,
    manager_email: PropTypes.string.isRequired,
    description: PropTypes.string,
    amount: PropTypes.number.isRequired,
    comment: PropTypes.string,
    expense_type: PropTypes.string,
    image_url: PropTypes.string,
    has_receipt: PropTypes.bool.isRequired
  }).isRequired,
  employee: PropTypes.shape({
    employee_id: PropTypes.number.isRequired,
    employee_first_name: PropTypes.string.isRequired,
    employee_last_name: PropTypes.string,
    employee_email: PropTypes.string
  }).isRequired
}

export default ClaimItem;