/* eslint-disable func-names, react/prop-types */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TermsAndScheduleModal from 'components/TermsAndScheduleModal';

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

describe('TermsAndScheduleModal', () => {
  const mockOnClose = jest.fn();
  const mockOnAcceptTerms = jest.fn();
  const mockOnSubmit = jest.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    examTitle: 'Test Exam',
    termsAccepted: false,
    onAcceptTerms: mockOnAcceptTerms,
    onSubmit: mockOnSubmit,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders TermsConditions when terms not accepted', () => {
    render(<TermsAndScheduleModal {...defaultProps} termsAccepted={false} />);
    expect(screen.getByTestId('terms-conditions')).toBeInTheDocument();
    expect(screen.queryByTestId('identity-form')).not.toBeInTheDocument();
  });

  test('renders IdentityForm when terms accepted', () => {
    render(<TermsAndScheduleModal {...defaultProps} termsAccepted />);
    expect(screen.getByTestId('identity-form')).toBeInTheDocument();
    expect(screen.queryByTestId('terms-conditions')).not.toBeInTheDocument();
  });

  test('calls onAcceptTerms when accept button is clicked', () => {
    render(<TermsAndScheduleModal {...defaultProps} termsAccepted={false} />);
    fireEvent.click(screen.getByText('Accept Terms'));
    expect(mockOnAcceptTerms).toHaveBeenCalledWith(true);
  });

  test('calls onClose when cancel button is clicked in terms', () => {
    render(<TermsAndScheduleModal {...defaultProps} termsAccepted={false} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('calls onSubmit when form is submitted', () => {
    render(<TermsAndScheduleModal {...defaultProps} termsAccepted />);
    fireEvent.click(screen.getByText('Submit Form'));
    expect(mockOnSubmit).toHaveBeenCalledWith({ name: 'Test User' });
  });

  test('calls onClose when cancel button is clicked in form', () => {
    render(<TermsAndScheduleModal {...defaultProps} termsAccepted />);
    fireEvent.click(screen.getByText('Cancel Form'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('calls onAcceptTerms(false) when previous is clicked', () => {
    render(<TermsAndScheduleModal {...defaultProps} termsAccepted />);
    fireEvent.click(screen.getByText('Previous'));
    expect(mockOnAcceptTerms).toHaveBeenCalledWith(false);
  });

  test('does not render dialog when isOpen is false', () => {
    const { container } = render(
      <TermsAndScheduleModal {...defaultProps} isOpen={false} />,
    );
    expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
  });
});
