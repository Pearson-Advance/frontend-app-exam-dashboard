/* eslint-disable func-names, react/prop-types */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import Modal, { MODAL_TYPES } from 'components/Modal';

jest.mock('components/TermsConditions', () => function ({ onAccept, onCancel }) {
  return (
    <div data-testid="terms-conditions">
      <button type="button" onClick={onAccept}>Accept Terms</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </div>
  );
});

jest.mock('components/form', () => function ({ onSubmit, onCancel, onPrevious }) {
  return (
    <div data-testid="identity-form">
      <button type="button" onClick={() => onSubmit({ name: 'Test User' })}>Submit Form</button>
      <button type="button" onClick={onCancel}>Cancel Form</button>
      <button type="button" onClick={onPrevious}>Previous</button>
    </div>
  );
});

describe('ExamModal', () => {
  const mockOnClose = jest.fn();
  const mockOnAcceptTerms = jest.fn();
  const mockOnFormSubmit = jest.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onAcceptTerms: mockOnAcceptTerms,
    onFormSubmit: mockOnFormSubmit,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Voucher Details Modal', () => {
    test('renders voucher details modal with data', () => {
      const voucherDetails = [
        { title: 'Discount Code: ', description: 'ABC123' },
        { title: 'Expiry Date: ', description: '2025-12-31' },
      ];

      render(
        <Modal
          {...defaultProps}
          modalType={MODAL_TYPES.VOUCHER_DETAILS}
          examTitle="Test Exam"
          voucherDetails={voucherDetails}
          isLoadingVoucher={false}
        />,
      );

      expect(screen.getByText('Test Exam')).toBeInTheDocument();
      expect(screen.getByText('Discount Code:')).toBeInTheDocument();
      expect(screen.getByText('ABC123')).toBeInTheDocument();
      expect(screen.getByText('Expiry Date:')).toBeInTheDocument();
      expect(screen.getByText('2025-12-31')).toBeInTheDocument();
    });

    test('shows loading state when fetching voucher details', () => {
      render(
        <Modal
          {...defaultProps}
          modalType={MODAL_TYPES.VOUCHER_DETAILS}
          examTitle="Test Exam"
          voucherDetails={[]}
          isLoadingVoucher
        />,
      );

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    test('renders empty voucher details list', () => {
      render(
        <Modal
          {...defaultProps}
          modalType={MODAL_TYPES.VOUCHER_DETAILS}
          examTitle="Test Exam"
          voucherDetails={[]}
          isLoadingVoucher={false}
        />,
      );

      expect(screen.getByText('Test Exam')).toBeInTheDocument();
      const listItems = screen.queryAllByRole('listitem');
      expect(listItems).toHaveLength(0);
    });
  });

  describe('Terms and Schedule Modal', () => {
    test('renders terms conditions initially when terms not accepted', () => {
      render(
        <Modal
          {...defaultProps}
          modalType={MODAL_TYPES.TERMS_AND_SCHEDULE}
          termsAccepted={false}
        />,
      );

      expect(screen.getByTestId('terms-conditions')).toBeInTheDocument();
      expect(screen.queryByTestId('identity-form')).not.toBeInTheDocument();
    });

    test('renders identity form when terms accepted', () => {
      render(
        <Modal
          {...defaultProps}
          modalType={MODAL_TYPES.TERMS_AND_SCHEDULE}
          termsAccepted
        />,
      );

      expect(screen.getByTestId('identity-form')).toBeInTheDocument();
      expect(screen.queryByTestId('terms-conditions')).not.toBeInTheDocument();
    });

    test('calls onAcceptTerms when accept button is clicked', () => {
      render(
        <Modal
          {...defaultProps}
          modalType={MODAL_TYPES.TERMS_AND_SCHEDULE}
          termsAccepted={false}
        />,
      );

      const acceptButton = screen.getByText('Accept Terms');
      fireEvent.click(acceptButton);

      expect(mockOnAcceptTerms).toHaveBeenCalledWith(true);
    });

    test('calls onClose when cancel button is clicked in terms', () => {
      render(
        <Modal
          {...defaultProps}
          modalType={MODAL_TYPES.TERMS_AND_SCHEDULE}
          termsAccepted={false}
        />,
      );

      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    test('calls onFormSubmit when form is submitted', () => {
      render(
        <Modal
          {...defaultProps}
          modalType={MODAL_TYPES.TERMS_AND_SCHEDULE}
          termsAccepted
        />,
      );

      const submitButton = screen.getByText('Submit Form');
      fireEvent.click(submitButton);

      expect(mockOnFormSubmit).toHaveBeenCalledWith({ name: 'Test User' });
    });

    test('calls onClose when cancel button is clicked in form', () => {
      render(
        <Modal
          {...defaultProps}
          modalType={MODAL_TYPES.TERMS_AND_SCHEDULE}
          termsAccepted
        />,
      );

      const cancelButton = screen.getByText('Cancel Form');
      fireEvent.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    test('calls onAcceptTerms(false) when previous button is clicked', () => {
      render(
        <Modal
          {...defaultProps}
          modalType={MODAL_TYPES.TERMS_AND_SCHEDULE}
          termsAccepted
        />,
      );

      const previousButton = screen.getByText('Previous');
      fireEvent.click(previousButton);

      expect(mockOnAcceptTerms).toHaveBeenCalledWith(false);
    });
  });

  describe('Modal States', () => {
    test('does not render when isOpen is false', () => {
      const { container } = render(
        <Modal
          {...defaultProps}
          isOpen={false}
          modalType={MODAL_TYPES.VOUCHER_DETAILS}
        />,
      );

      expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
    });
  });
});
