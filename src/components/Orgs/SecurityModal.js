import React, { useState, createRef, useCallback } from 'react';
import { observer } from 'mobx-react';
import {
  FormFeedback,
  FormGroup,
  Input,
  Modal,
  ModalBody,
  Button,
} from 'reactstrap';

import isEmpty from 'is-empty';
import classNames from 'classnames';
import DatePicker from 'react-datepicker';

import LoadingOverlay from '../Common/LoadingOverlay';
import LaddaButton, { SLIDE_RIGHT, SM } from 'react-ladda';
import ReactSelectComponent from '../Common/ReactSelectComponent';
import Checkbox from '../Common/Checkbox';
import FormError from '../Common/FormError';
import IntegerInput from '../Common/IntegerInput';
import AddInputSymbol from '../Common/AddInputSymbol';
import RadioButton from '../Common/RadioButton';
import textContent from '../../data/const/textContent';
import { createSecurity } from '../../helpers/common';

import orgsStore from '../../stores/orgsStore';

import {
  dayCountConventionOptions,
  rankingOptions,
  formatOptions,
  denomValuesRange,
  percentValuesRange,
  COUPON_TYPE,
} from '../../data/const/constants';

import { MultipleDates } from '../Common/MultipleDates';
import DecimalInput from '../Common/DecimalInput';
import { stringToDateFormat } from 'helpers/date';

const modalStyle = { maxWidth: '650px', width: '100%' };
const customSecurityStyle = { width: '185px' };
const numeralDecimalScaleForRate = 3;
const maxLengthCusip = '9';
const maxLengthIsin = '35';

const SecurityModal = observer(({ isOpen, toggle }) => {
  const calendarMaturityRef = createRef();
  const calendarCommenceRef = createRef();
  const calendarIssDateRef = createRef();

  const [calendarMaturityIsOpen, setCalendarMaturityIsOpen] = useState(false);
  const [calendarCommerceIsOpen, setCalendarCommerceIsOpen] = useState(false);
  const [calendarIssuerIsOpen, setCalendarIssuerIsOpen] = useState(false);
  const [couponType, setCouponType] = useState(
    orgsStore.currentSecurity.couponType || 'fixed',
  );
  const [dates, setDates] = useState({
    commencingOn: stringToDateFormat(orgsStore.currentSecurity?.commencingOn),
    maturityDate: stringToDateFormat(orgsStore.currentSecurity?.maturityDate),
    issueDate: stringToDateFormat(orgsStore.currentSecurity?.issueDate),
  });

  const rankingValue = orgsStore.currentSecurity?.ranking;
  const dayCountValue = orgsStore.currentSecurity?.dayCountConvention;
  const formatValue = orgsStore.currentSecurity?.format;

  const handleToggleCalendar = (type) => {
    if (type === 'maturity') {
      calendarMaturityRef.current.setOpen(!calendarMaturityIsOpen);
      setCalendarMaturityIsOpen(!calendarMaturityIsOpen);
    } else if (type === 'commence') {
      calendarCommenceRef.current.setOpen(!calendarCommerceIsOpen);
      setCalendarCommerceIsOpen(!calendarCommerceIsOpen);
    } else {
      calendarIssDateRef.current.setOpen(!calendarIssuerIsOpen);
      setCalendarIssuerIsOpen(!calendarIssuerIsOpen);
    }
  };

  const handleToggleModal = () => {
    orgsStore.resetCurrentSecurity();
    toggle();
  };

  const handleChangeRanking = ({ value }) => {
    orgsStore.setSecurityRanking(value);
    if (orgsStore.errors['ranking']) {
      orgsStore.removeError('ranking');
    }
  };

  const handleChangeDayCount = ({ value }) => {
    orgsStore.setSecurityDayCount(value);
    if (orgsStore.errors['dayCountConvention']) {
      orgsStore.removeError('dayCountConvention');
    }
  };

  const handleChangeFormat = ({ value }) => {
    orgsStore.setSecurityFormat(value);
    if (orgsStore.errors['format']) {
      orgsStore.removeError('format');
    }
  };

  const handleCheckListing = (e) => {
    if (orgsStore.currentSecurity?.listing) {
      orgsStore.handleSecurityInput(e.target.name, false);
    } else {
      orgsStore.handleSecurityInput(e.target.name, true);
    }
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    orgsStore.handleSecurityInput(name, value);
  }, []);

  const handleIntegerChange = useCallback((name, value) => {
    orgsStore.handleSecurityInput(name, value);
  }, []);

  const handleMaturityDate = (date) => {
    orgsStore.setDateSecurity(date, 'maturityDate');
    setDates({ ...dates, maturityDate: date });
  };

  const handleCommercingOnDate = (date) => {
    orgsStore.setDateSecurity(date, 'commencingOn');
    setDates({ ...dates, commencingOn: date });
  };

  const handleIssuerDate = (date) => {
    orgsStore.setDateSecurity(date, 'issueDate');
    setDates({ ...dates, issueDate: date });
  };

  const handleSubmitData = async () => {
    const securityName = createSecurity(
      orgsStore.currentSecurity.coupon,
      orgsStore.currentSecurity.maturityDate,
      couponType,
    );
    orgsStore.handleSecurityInput('securities', securityName);
    orgsStore.handleSecurityInput('couponType', couponType);
    if (orgsStore.currentSecurity.id) {
      await orgsStore.updateSecurity();
    } else {
      await orgsStore.addSecurity();
    }
    if (isEmpty(orgsStore.errors)) {
      handleToggleModal();
    }
  };

  const handleCouponType = (name) => {
    setCouponType(name);
  };

  return (
    <Modal style={modalStyle} fade={false} isOpen={isOpen}>
      <div className="px-3 py-2 modal-header d-flex align-items-center justify-content-between">
        <h6 className="mb-0">Existing Securities</h6>
        <i
          className="fas fa-times p-2 cursor-pointer"
          onClick={handleToggleModal}
        />
      </div>
      <ModalBody className="m-3">
        {orgsStore.loading && <LoadingOverlay />}
        {orgsStore.currentSecurity.id && (
          <FormGroup row className="justify-content-between">
            <div className="font-weight-bold text-primary d-flex align-items-center d-flex align-items-center">
              Security Name
            </div>
            <Input
              value={orgsStore.currentSecurity?.securities || ''}
              name="securities"
              invalid={!!orgsStore.errors.securities}
              type="text"
              disabled
              style={customSecurityStyle}
            />
            <FormFeedback>{orgsStore.errors.securities}</FormFeedback>
          </FormGroup>
        )}

        <FormGroup row className="justify-content-between">
          <div className="font-weight-bold text-primary d-flex align-items-center d-flex align-items-center">
            Coupon Type
          </div>
          <div className="d-flex justify-content-between w-25 ">
            {COUPON_TYPE.map((el) => (
              <div
                key={el.label}
                className="radio-wrapper d-flex align-items-center"
              >
                <label htmlFor="html" className="mb-0">
                  {el.label}
                </label>
                <RadioButton
                  className="ml-1"
                  onChange={handleCouponType}
                  checked={el.name === couponType}
                  name={el.name}
                />
              </div>
            ))}
          </div>
          <FormFeedback>{orgsStore.errors.guarantors}</FormFeedback>
        </FormGroup>

        <FormGroup row className="justify-content-between position-relative">
          <div className="font-weight-bold text-primary d-flex align-items-center d-flex align-items-center">
            Coupon
          </div>
          <div className="w-25 d-flex justify-content-end">
            <AddInputSymbol symbol="%" />
            <DecimalInput
              className={classNames({
                'is-invalid': orgsStore.errors.coupon,
              })}
              name="coupon"
              value={orgsStore.currentSecurity?.coupon}
              onChange={handleIntegerChange}
              min={percentValuesRange.MIN}
              max={percentValuesRange.MAX}
              numeralDecimalScale={numeralDecimalScaleForRate}
            />
          </div>
          {orgsStore.errors.coupon && (
            <FormError
              className="w-100"
              errorText={textContent.errors.REQUIRED}
            />
          )}
        </FormGroup>

        <FormGroup row className="justify-content-between">
          <div className="font-weight-bold text-primary d-flex align-items-center d-flex align-items-center">
            Maturity Date
          </div>
          <div
            className={`w-25 datepicker-wrapper height-md ${
              orgsStore.errors?.maturityDate ? 'is-invalid' : ''
            }`}
          >
            <DatePicker
              ref={calendarMaturityRef}
              pastDates={false}
              className="form-control width-md"
              selected={dates.maturityDate ? dates.maturityDate : null}
              times={false}
              dateFormat="MM/dd/yyyy"
              onChange={handleMaturityDate}
            />
            <i
              className="fas fa-calendar-alt"
              onClick={() => handleToggleCalendar('maturity')}
            />
          </div>
          <FormFeedback>{orgsStore.errors.maturityDate}</FormFeedback>
        </FormGroup>
        <FormGroup row className="justify-content-between">
          <div className="font-weight-bold text-primary d-flex align-items-center d-flex align-items-center">
            Issue Date
          </div>
          <div
            className={`w-25 datepicker-wrapper height-md ${
              orgsStore.errors?.issueDate ? 'is-invalid' : ''
            }`}
          >
            <DatePicker
              ref={calendarIssDateRef}
              pastDates={false}
              className="form-control width-md"
              selected={dates.issueDate ? dates.issueDate : null}
              times={false}
              dateFormat="MM/dd/yyyy"
              onChange={handleIssuerDate}
            />
            <i
              className="fas fa-calendar-alt"
              onClick={() => handleToggleCalendar('issuer')}
            />
          </div>
          <FormFeedback>{orgsStore.errors.issueDate}</FormFeedback>
        </FormGroup>
        <FormGroup row className="justify-content-between">
          <div className="font-weight-bold text-primary d-flex align-items-center d-flex align-items-center">
            CUSIP / ISIN
          </div>
          <div className="w-50 d-flex justify-content-end">
            <Input
              onChange={handleChange}
              value={orgsStore.currentSecurity?.cusip || ''}
              name="cusip"
              type="text"
              invalid={!!orgsStore.errors.cusip}
              autoComplete="off"
              className="w-25 mr-2"
              maxLength={maxLengthCusip}
            />
            <span className="d-flex align-items-center">{'/'}</span>
            <Input
              onChange={handleChange}
              value={orgsStore.currentSecurity?.isin || ''}
              name="isin"
              type="text"
              invalid={!!orgsStore.errors.isin}
              autoComplete="off"
              className="w-50 ml-2"
              maxLength={maxLengthIsin}
            />
          </div>
          {(orgsStore.errors.cusip || orgsStore.errors.isin) && (
            <FormError
              className="w-100"
              errorText={textContent.errors.REQUIRED}
            />
          )}
        </FormGroup>
        <FormGroup row className="justify-content-between">
          <div className="font-weight-bold text-primary d-flex align-items-center d-flex align-items-center">
            Guarantors
          </div>
          <Input
            onChange={handleChange}
            value={orgsStore.currentSecurity?.guarantors || ''}
            name="guarantors"
            invalid={!!orgsStore.errors.guarantors}
            type="text"
            className="w-25"
          />
          <FormFeedback>{orgsStore.errors.guarantors}</FormFeedback>
        </FormGroup>
        <FormGroup row className="justify-content-between">
          <div className="font-weight-bold text-primary d-flex align-items-center d-flex align-items-center">
            Form and Denomination
          </div>
          <Input
            onChange={handleChange}
            value={orgsStore.currentSecurity?.form || ''}
            name="form"
            invalid={!!orgsStore.errors.form}
            type="text"
            className="w-25"
          />
          <FormFeedback>{orgsStore.errors.form}</FormFeedback>
        </FormGroup>

        <FormGroup row className="justify-content-between position-relative">
          <div className="font-weight-bold text-primary d-flex align-items-center d-flex align-items-center">
            Aggregate Principal Outstanding
          </div>
          <div className="w-25 d-flex justify-content-end">
            <AddInputSymbol symbol="$" />
            <IntegerInput
              className={classNames({
                'is-invalid': orgsStore.errors.principalAmount,
              })}
              name="principalAmount"
              value={orgsStore.currentSecurity?.principalAmount || ''}
              onChange={handleIntegerChange}
              invalid={!!orgsStore.errors.principalAmount}
            />
          </div>
          {orgsStore.errors.principalAmount && (
            <FormError
              className="w-100"
              errorText={textContent.errors.REQUIRED}
            />
          )}
        </FormGroup>

        <FormGroup row className="justify-content-between">
          <div className="font-weight-bold text-primary d-flex align-items-center d-flex align-items-center">
            Ranking
          </div>
          <ReactSelectComponent
            className="w-25"
            placeholder="Select"
            onChange={handleChangeRanking}
            value={
              rankingValue ? { value: rankingValue, label: rankingValue } : null
            }
            options={rankingOptions}
          />
          {orgsStore.errors.ranking && (
            <FormError
              className="w-100"
              errorText={textContent.errors.REQUIRED}
            />
          )}
        </FormGroup>
        <FormGroup row className="justify-content-between mb-4 mt-4">
          <div className="font-weight-bold text-primary d-flex align-items-center d-flex align-items-center">
            Listing
          </div>
          <Checkbox
            handleCheck={handleCheckListing}
            value={orgsStore.currentSecurity?.listing || false}
            id="listing"
            name="listing"
            checked={orgsStore.currentSecurity?.listing || false}
          />
        </FormGroup>
        <FormGroup row className="justify-content-between">
          <div className="font-weight-bold text-primary d-flex align-items-center d-flex align-items-center">
            Format
          </div>
          <ReactSelectComponent
            className="w-25"
            placeholder="Select"
            onChange={handleChangeFormat}
            value={
              formatValue ? { value: formatValue, label: formatValue } : null
            }
            options={formatOptions}
          />
          {orgsStore.errors.format && (
            <FormError
              className="w-100"
              errorText={textContent.errors.REQUIRED}
            />
          )}
        </FormGroup>
        <FormGroup row className="justify-content-between position-relative">
          <div className="font-weight-bold text-primary d-flex align-items-center d-flex align-items-center">
            Denomination Miniumum
          </div>
          <div className="w-25 d-flex justify-content-end">
            <AddInputSymbol symbol="$" />
            <IntegerInput
              className={classNames({
                'is-invalid': orgsStore.errors.denominationMinimum,
              })}
              name="denominationMinimum"
              value={orgsStore.currentSecurity?.denominationMinimum}
              onChange={handleIntegerChange}
              invalid={!!orgsStore.errors.denominationMinimum}
              min={denomValuesRange.MIN}
              max={denomValuesRange.MAX}
            />
          </div>
          {orgsStore.errors.denominationMinimum && (
            <FormError
              className="w-100"
              errorText={textContent.errors.REQUIRED}
            />
          )}
        </FormGroup>
        <FormGroup row className="justify-content-between position-relative">
          <div className="font-weight-bold text-primary d-flex align-items-center d-flex align-items-center">
            Denomination Increment
          </div>
          <div className="w-25 d-flex justify-content-end">
            <AddInputSymbol symbol="$" />
            <IntegerInput
              className={classNames({
                'is-invalid': orgsStore.errors.denominationIncrement,
              })}
              name="denominationIncrement"
              value={orgsStore.currentSecurity?.denominationIncrement}
              onChange={handleIntegerChange}
              invalid={!!orgsStore.errors.denominationIncrement}
              min={denomValuesRange.MIN}
              max={denomValuesRange.MAX}
            />
          </div>
          {orgsStore.errors.denominationIncrement && (
            <FormError
              className="w-100"
              errorText={textContent.errors.REQUIRED}
            />
          )}
        </FormGroup>
        <FormGroup row className="justify-content-between">
          <div className="font-weight-bold text-primary d-flex align-items-center d-flex align-items-center">
            Day Count Convention
          </div>
          <ReactSelectComponent
            className="w-25"
            placeholder="Select"
            value={
              dayCountValue
                ? { value: dayCountValue, label: dayCountValue }
                : null
            }
            onChange={handleChangeDayCount}
            options={dayCountConventionOptions}
          />
          {orgsStore.errors.dayCountConvention && (
            <FormError
              className="w-100"
              errorText={textContent.errors.REQUIRED}
            />
          )}
        </FormGroup>
        <FormGroup row className="justify-content-between">
          <div className="font-weight-bold text-primary d-flex align-items-center d-flex align-items-center">
            Interest Payment Dates
          </div>
          <MultipleDates
            firstDate={
              orgsStore.currentSecurity.interestPaymentDates
                ? orgsStore.currentSecurity?.interestPaymentDates[0]
                : null
            }
            secondDate={
              orgsStore.currentSecurity.interestPaymentDates
                ? orgsStore.currentSecurity?.interestPaymentDates[1]
                : null
            }
            type="interestPaymentDates"
          />
          {orgsStore.errors.interestPaymentDates && (
            <FormError
              className="w-100"
              errorText={orgsStore.errors.interestPaymentDates}
            />
          )}
        </FormGroup>
        <FormGroup row className="justify-content-between">
          <div className="font-weight-bold text-primary d-flex align-items-center d-flex align-items-center">
            Commencing On
          </div>
          <div
            className={`w-25 datepicker-wrapper height-md ${
              orgsStore.errors?.commencingOn ? 'is-invalid' : ''
            }`}
          >
            <DatePicker
              ref={calendarCommenceRef}
              pastDates={true}
              className="form-control width-md"
              selected={dates.commencingOn ? dates.commencingOn : null}
              times={false}
              dateFormat="MM/dd/yyyy"
              onChange={handleCommercingOnDate}
              utcOffset={0}
            />
            <i
              className="fas fa-calendar-alt"
              onClick={() => handleToggleCalendar('commence')}
            />
          </div>
          <FormFeedback>{orgsStore.errors.commencingOn}</FormFeedback>
        </FormGroup>
        <FormGroup row className="justify-content-between">
          <div className="font-weight-bold text-primary d-flex align-items-center d-flex align-items-center">
            Interest Record Dates
          </div>
          <MultipleDates
            firstDate={
              orgsStore.currentSecurity?.interestRecordDates
                ? orgsStore.currentSecurity?.interestRecordDates[0]
                : null
            }
            secondDate={
              orgsStore.currentSecurity?.interestRecordDates
                ? orgsStore.currentSecurity?.interestRecordDates[1]
                : null
            }
            type="interestRecordDates"
          />
          {orgsStore.errors.interestRecordDates && (
            <FormError
              className="w-100"
              errorText={textContent.errors.REQUIRED}
            />
          )}
        </FormGroup>
        <FormGroup row className="justify-content-between">
          <div className="font-weight-bold text-primary d-flex align-items-center d-flex align-items-center">
            Optional Redemption
          </div>
          <Input
            onChange={handleChange}
            value={orgsStore.currentSecurity?.redemption || ''}
            name="redemption"
            type="text"
            autoComplete="off"
            className="w-25"
          />
        </FormGroup>
        <FormGroup className="d-flex align-items-center justify-content-end mb-0">
          <Button
            className="btn-xs mr-1"
            color="link"
            onClick={handleToggleModal}
          >
            Cancel
          </Button>
          <LaddaButton
            loading={orgsStore.loading}
            onClick={handleSubmitData}
            data-size={SM}
            data-style={SLIDE_RIGHT}
            data-spinner-size={18}
            data-spinner-color="#fff"
            data-spinner-lines={12}
            className="btn btn-primary btn-xs"
          >
            Save
          </LaddaButton>
        </FormGroup>
      </ModalBody>
    </Modal>
  );
});

export default SecurityModal;
