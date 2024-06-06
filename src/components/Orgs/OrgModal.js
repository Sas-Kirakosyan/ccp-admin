import React, { useEffect, useState } from 'react';

import { MIN_CREDIT_LIMIT } from '../../data/const/constants';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import IntlTelInput from 'react-intl-tel-input';
import 'react-intl-tel-input/dist/main.css';

import { FormFeedback, FormGroup, Input, Modal, ModalBody } from 'reactstrap';
import ReactSelectComponent from '../Common/ReactSelectComponent';
import LaddaButton, { SM, SLIDE_RIGHT } from 'react-ladda';
import { Button } from 'reactstrap';
import { observer } from 'mobx-react';
import { geocodeByAddress } from 'react-places-autocomplete';

import orgsStore from '../../stores/orgsStore';
import ErrorModal from '../Common/ErrorModal';
import IntegerInput from '../Common/IntegerInput';
import textContent from '../../data/const/textContent';
import FormError from '../Common/FormError';
import {
  integerToMillion,
  validateAddress,
  addCommaIfExist,
} from '../../helpers/common';

import AddressAutocomplete from '../Common/AddressAutocomplete';

const initialPhoneValue = {
  status: true,
  value: '',
};

const telInputStyle = {
  width: '100%',
};

const telInputStyleNotValid = {
  border: '1px solid #c9444d',
  width: '100%',
};

const headerStyle = {
  fontWeight: 600,
};
const underLine = {
  textDecoration: 'underline',
};

const phonePlaceholder = '(555)555-5555';

const OrgModal = observer(({ isOpen, toggle }) => {
  const [category, setCategory] = useState(null);
  const [address, setAddress] = useState('');
  const [foolAddress, setFoolAddress] = useState(null);
  const [phoneValues, setPhoneValues] = useState(initialPhoneValue);
  const [country, setCountry] = useState(null);
  const [isNotValidAddress, setIsNotValidAddress] = useState(false);

  const currentOrg = orgsStore.currentOrg;
  const creditLimitVolume = orgsStore.currentOrg?.creditLimitVolume;
  const buyingPower = orgsStore.currentOrg?.buyingPower;
  const isTypeSelected = orgsStore.currentOrg?.type;
  const categoryName = orgsStore.currentInvestorCategoryName;
  const exactCountry = country ? orgsStore.getExactCountry(country?.id) : null;

  useEffect(() => {
    try {
      if (!orgsStore.investorOrgCategory) {
        orgsStore.getInvestorCategory();
      }
    } catch (e) {
      ErrorModal(e?.response?.data?.message);
    }

    return () => {
      orgsStore.resetContactInfo();
    };
  }, []);

  useEffect(() => {
    if (currentOrg && orgsStore.istTypeInvestor()) {
      setCategory({
        value: categoryName,
        label: categoryName,
      });
      if (orgsStore.contactInfo && Object.keys(orgsStore.contactInfo)?.length) {
        setPhoneValues({
          status: true,
          value: orgsStore.contactInfo?.dtcPhone || '',
        });

        setFoolAddress({
          address_1: `${orgsStore.contactInfo?.street} ${orgsStore.contactInfo?.city}`,
          street: orgsStore.contactInfo?.street,
          city: orgsStore.contactInfo?.city,
          country: exactCountry?.name3L || 'USA',
          zip: orgsStore.contactInfo?.zip,
          stateShortName:
            exactCountry?.name3L === 'USA'
              ? orgsStore.contactInfo?.stateShortName
              : null,
        });
      }
    } else {
      setCategory(null);
    }
  }, [currentOrg, isOpen, categoryName, exactCountry]);

  useEffect(() => {
    if (foolAddress && Object.values(foolAddress)?.every((el) => !!el)) {
      setAddress(
        `${addCommaIfExist(foolAddress?.street)}${addCommaIfExist(
          foolAddress?.city,
        )}${addCommaIfExist(foolAddress?.stateShortName)}${addCommaIfExist(
          foolAddress?.zip,
        )}${exactCountry?.name3L}`,
      );
    }
  }, [exactCountry?.name3L, foolAddress]);

  useEffect(() => {
    (async () => {
      if (currentOrg && orgsStore.istTypeInvestor()) {
        await orgsStore.getCountries();
        if (exactCountry && orgsStore.isEditing) {
          setCountry({
            id: exactCountry.id,
            value: exactCountry.name,
            countryCode: exactCountry.name2L,
            label: exactCountry.name,
          });
        } else {
          const country = orgsStore.defaultCountry;
          const { id, name2L, name } = country;
          setCountry({
            id,
            value: name,
            countryCode: name2L,
            label: name,
          });
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentOrg, isTypeSelected]);

  const handleSubmitData = async () => {
    if (orgsStore.istTypeInvestor()) {
      if (!phoneValues.status) {
        orgsStore.setError('dtcPhone', textContent.errors.PHONE_NOT_VALID);
        return;
      }

      if (isNotValidAddress) {
        orgsStore.setError('address', true);
      }

      orgsStore.handleContactInfo('contactInfo', phoneValues.fullValue);
      orgsStore.handleContactInfo('countryId', country.id);
    }
    let response;
    if (orgsStore.isEditing) {
      response = await orgsStore
        .updateOrg()
        .catch((e) => ErrorModal(e?.response?.message));
    } else {
      response = await orgsStore
        .addNewOrg()
        .catch((e) => ErrorModal(e?.response?.message));
    }
    if (response === 'ok') {
      toggle();
      await orgsStore.getAllOrgs();
    }
  };

  const handleToggleModal = () => {
    orgsStore.resetOrgFields();
    toggle();
  };

  const handleChange = (e) => {
    orgsStore.inputChange(e.target.name, e.target.value);
  };

  const handleChangeContact = (e) => {
    orgsStore.handleContactInfo(e.target.name, e.target.value);
  };

  const handleIntegerChange = (name, value) => {
    orgsStore.inputMillionChange(name, value);
  };

  const handleOrgType = (s) => {
    orgsStore.setOrgType(s);
    setCategory(null);
  };

  const handleSelectCategory = (category) => {
    const { categoryName, id, label } = category;
    setCategory({ value: categoryName, label });
    orgsStore.setInvestorCategoryId(id);
  };

  const handleSelectCountry = (country) => {
    orgsStore.resetContactInfo(true);
    setFoolAddress(null);
    const { id, label, value } = country;
    setCountry({
      id,
      value: label,
      countryCode: value,
      label,
    });
    setAddress('');
  };

  const handleChangeAddress = (address) => {
    if (!foolAddress) {
      setIsNotValidAddress(true);
    }
    setAddress(address);
    orgsStore.resetError('address');
    setFoolAddress(null);
  };

  const handleSelect = async (address) => {
    const obj = {};
    obj['address_1'] = address;
    const res = await geocodeByAddress(address);
    res[0].address_components.forEach((resObj) => {
      setAddress(res[0]?.formatted_address || address);
      switch (resObj.types[0]) {
        case 'postal_code':
          obj['zip'] = resObj.short_name;
          break;
        case 'route':
          obj['street'] = resObj.short_name;
          break;
        case 'postal_code_suffix':
          obj['zip_suffix'] = resObj.short_name;
          break;
        case 'street_number':
          obj['street_number'] = resObj.short_name;
          break;
        case 'country':
          obj['country'] = resObj.short_name;
          break;
        case 'administrative_area_level_1':
          obj['state'] = resObj.short_name;
          break;
        case 'administrative_area_level_2':
          obj['city1'] = resObj.short_name;
          break;
        case 'postal_town':
          obj['city0'] = resObj.short_name;
          break;
        case 'locality':
          obj['city'] = resObj.long_name;
          break;
        default:
          break;
      }
    });

    if (obj.street_number) {
      obj.street = `${obj.street_number} ${obj.street}`;
      delete obj.street_number;
    }
    if (obj.zip_suffix) {
      obj.zip = `${obj.zip}-${obj.zip_suffix}`;
    }
    if (obj['city']) {
      delete obj['city0'];
      delete obj['city1'];
    } else {
      obj['city'] = obj['city0'] || obj['city1'];
    }
    setFoolAddress(obj);
    setIsNotValidAddress(validateAddress(obj));
    const { street, city, state, zip, country } = obj || {};
    orgsStore.handleContactInfo('street', street);
    orgsStore.handleContactInfo('city', city);
    orgsStore.handleContactInfo('zip', zip);

    if (country === 'US') {
      setFoolAddress({
        ...obj,
        stateShortName: state,
      });
      orgsStore.handleContactInfo('stateShortName', state);
    }
  };

  const changePhoneValue = (status, value, countryData) => {
    const isUs = countryData.iso2 === 'us';

    setPhoneValues({
      ...phoneValues,
      status,
      value,
      placeholder: isUs ? phonePlaceholder : null,
    });
    orgsStore.handleContactInfo('dtcPhone', `+${countryData.dialCode}${value}`);
  };

  const blurPhoneField = (status) => {
    setPhoneValues({ ...phoneValues, status });
  };

  return (
    <Modal fade={false} isOpen={isOpen}>
      <div className="px-3 py-2 modal-header d-flex align-items-center justify-content-between">
        <h6 className="mb-0">Organization Details</h6>
        <i
          className="fas fa-times p-2 cursor-pointer"
          onClick={handleToggleModal}
        ></i>
      </div>
      <ModalBody>
        <FormGroup
          className={'mb-2' + (orgsStore.errors.type ? ' is-invalid' : '')}
        >
          <label className="text-sm mb-2">
            Type<sup className="text-danger">*</sup>
          </label>
          <ReactSelectComponent
            placeholder="Select"
            value={orgsStore.currentOrg.type}
            onChange={handleOrgType}
            options={orgsStore.orgTypes?.map((type) => {
              return { label: type.label, value: type.code, ...type };
            })}
          />
          <FormFeedback>{orgsStore.errors.type}</FormFeedback>
        </FormGroup>
        {!orgsStore.isEditing && (
          <FormGroup className="mb-2">
            <label className="text-sm mb-0">
              Code<sup className="text-danger">*</sup>
            </label>
            <Input
              onChange={handleChange}
              value={orgsStore.currentOrg.code}
              name="code"
              invalid={!!orgsStore.errors.code}
              type="text"
              disabled={!isTypeSelected}
            />
            <FormFeedback>{orgsStore.errors.code}</FormFeedback>
          </FormGroup>
        )}
        <FormGroup className="mb-2">
          <label className="text-sm mb-0">
            Name<sup className="text-danger">*</sup>
          </label>
          <Input
            onChange={handleChange}
            value={orgsStore.currentOrg.name}
            name="name"
            invalid={!!orgsStore.errors.name}
            type="text"
            disabled={!isTypeSelected}
          />
          <FormFeedback>{orgsStore.errors.name}</FormFeedback>
        </FormGroup>
        <FormGroup className="mb-1">
          <label className="text-sm mb-0">
            Short Name<sup className="text-danger">*</sup>
          </label>
          <Input
            onChange={handleChange}
            value={orgsStore.currentOrg.shortName}
            name="shortName"
            invalid={!!orgsStore.errors.shortName}
            type="text"
            disabled={!isTypeSelected}
          />
          <FormFeedback>{orgsStore.errors.shortName}</FormFeedback>
        </FormGroup>
        <FormGroup className="mb-2">
          <label className="text-sm mb-1">
            Ticker
            {orgsStore.currentOrg.type?.code === 'Issuer' && (
              <sup className="text-danger">*</sup>
            )}
          </label>
          <Input
            onChange={handleChange}
            value={orgsStore.currentOrg.ticker || ''}
            name="ticker"
            invalid={!!orgsStore.errors.ticker}
            type="text"
            disabled={!isTypeSelected}
          />
          <FormFeedback>{orgsStore.errors.ticker}</FormFeedback>
        </FormGroup>
        {orgsStore.istTypeInvestor() && (
          <>
            <FormGroup
              className={'mb-2' + (orgsStore.errors.type ? ' is-invalid' : '')}
            >
              <label className="text-sm mb-0">
                Investor Category<sup className="text-danger">*</sup>
              </label>
              <ReactSelectComponent
                placeholder="Select"
                value={category}
                onChange={handleSelectCategory}
                options={orgsStore.investorOrgCategory?.map((type) => {
                  return {
                    label: type.categoryName,
                    value: type.categoryName,
                    ...type,
                  };
                })}
              />
              {orgsStore.errors.investorCategoryId && (
                <FormError errorText={textContent.errors.REQUIRED} />
              )}
            </FormGroup>
            <h6 className="mt-4 mb-1" style={headerStyle}>
              Credit Limits and Buying Power
            </h6>
            <FormGroup className="mb-2">
              <label className="text-sm mb-0">
                Credit Limit ($ Millions)<sup className="text-danger">*</sup>
              </label>
              <IntegerInput
                className={classNames({
                  'is-invalid': orgsStore.errors.creditLimitVolume,
                })}
                name="creditLimitVolume"
                value={integerToMillion(creditLimitVolume)}
                onChange={handleIntegerChange}
                min={MIN_CREDIT_LIMIT}
                invalid={!!orgsStore.errors.creditLimitVolume}
              />

              {orgsStore.errors.creditLimitVolume && (
                <FormError
                  errorText={textContent.errors.REQUIRED_CREDIT_LIMIT}
                />
              )}
            </FormGroup>

            <FormGroup className="mb-3">
              <label className="text-sm mb-0">
                Buying Power ($ Millions)<sup className="text-danger">*</sup>
              </label>
              <IntegerInput
                className={classNames({
                  'is-invalid': !!orgsStore.errors.buyingPower,
                })}
                name="buyingPower"
                value={integerToMillion(buyingPower)}
                onChange={handleIntegerChange}
                min={MIN_CREDIT_LIMIT}
              />

              {orgsStore.errors.buyingPower && (
                <FormError errorText={orgsStore.errors.buyingPower} />
              )}
            </FormGroup>

            <h6 className="mt-4 mb-1" style={headerStyle}>
              Settlement Instructions
            </h6>
            <FormGroup className="mb-3">
              <label className="text-sm mb-0">
                Purchaser Legal Name <sup className="text-danger">*</sup>
              </label>
              <Input
                onChange={handleChangeContact}
                value={orgsStore.contactInfo?.purchaserName || ''}
                name="purchaserName"
                invalid={!!orgsStore.errors.purchaserName}
                type="text"
                disabled={!isTypeSelected}
              />
              <FormFeedback>{orgsStore.errors.purchaserName}</FormFeedback>
            </FormGroup>

            <FormGroup
              className={'mb-2' + (orgsStore.errors.type ? ' is-invalid' : '')}
            >
              <label className="text-sm mb-0">
                Select Country<sup className="text-danger">*</sup>
              </label>
              <ReactSelectComponent
                placeholder="Select"
                value={country}
                onChange={handleSelectCountry}
                options={orgsStore.countries?.map((country) => {
                  return {
                    label: country.name,
                    value: country.name2L,
                    id: country.id,
                  };
                })}
              />
            </FormGroup>

            <FormGroup className="mb-3">
              <label className="text-sm mb-0">
                Purchaser Address<sup className="text-danger">*</sup>
              </label>
              <AddressAutocomplete
                handleSelect={handleSelect}
                handleChangeAddress={handleChangeAddress}
                address={address}
                countryCode={country?.countryCode}
                isNotValidAddress={isNotValidAddress}
              />
              {orgsStore.errors.address && (
                <FormError errorText={orgsStore.errors.address} />
              )}
            </FormGroup>
            <FormGroup className="mb-3">
              <div className="d-flex align-items-center justify-content-end mb-2">
                <span className="mr-1">Street address: </span>
                <Input
                  value={foolAddress?.street || ''}
                  name="purchaserName"
                  type="text"
                  disabled
                  className="w-50"
                />
              </div>
              <div className="d-flex align-items-center justify-content-end mb-2">
                <span className="mr-1">City: </span>
                <Input
                  value={foolAddress?.city || ''}
                  name="purchaserName"
                  type="text"
                  disabled
                  className="w-50"
                />
              </div>
              {foolAddress?.stateShortName && (
                <div className="d-flex align-items-center justify-content-end mb-2">
                  <span className="mr-1">State: </span>
                  <Input
                    value={foolAddress?.stateShortName || ''}
                    name="purchaserName"
                    type="text"
                    disabled
                    className="w-50"
                  />
                </div>
              )}
              <div className="d-flex align-items-center justify-content-end mb-2">
                <span className="mr-1">ZIP Code: </span>
                <Input
                  value={foolAddress?.zip || ''}
                  name="purchaserName"
                  type="text"
                  disabled
                  className="w-50"
                />
              </div>
              <div className="d-flex align-items-center justify-content-end mb-2">
                <span className="mr-1">Country: </span>
                <Input
                  value={exactCountry?.name3L || ''}
                  name="purchaserName"
                  type="text"
                  disabled
                  className="w-50"
                />
              </div>
            </FormGroup>
            <FormGroup>
              <label className="text-sm mb-0">
                DTC Participant Number<sup className="text-danger">*</sup>
              </label>
              <Input
                className={classNames({
                  'is-invalid': !!orgsStore.errors.dtcNumber,
                })}
                type="text"
                name="dtcNumber"
                value={orgsStore.contactInfo?.dtcNumber || ''}
                onChange={handleChangeContact}
                maxLength="4"
              />

              {orgsStore.errors.dtcNumber && (
                <FormError errorText={orgsStore.errors.dtcNumber} />
              )}
            </FormGroup>
            <FormGroup className="mb-3">
              <div className="d-flex align-items-center mb-2">
                <h6 className="mb-0" style={underLine}>
                  DTC Name and Contact Information
                </h6>
                <sup className="text-danger">*</sup>
              </div>
              <Input
                onChange={handleChangeContact}
                value={orgsStore.contactInfo?.dtcName || ''}
                name="dtcName"
                invalid={!!orgsStore.errors.dtcName}
                type="text"
                disabled={!isTypeSelected}
                placeholder="Name"
              />
              {orgsStore.errors.dtcName && (
                <FormError errorText={orgsStore.errors.dtcName} />
              )}
            </FormGroup>
            <FormGroup>
              <IntlTelInput
                style={
                  !phoneValues.status ? telInputStyleNotValid : telInputStyle
                }
                autoHideDialCode={true}
                containerClassName="intl-tel-input"
                inputClassName="form-control"
                useMobileFullscreenDropdown={false}
                onPhoneNumberBlur={blurPhoneField}
                onPhoneNumberChange={changePhoneValue}
                value={phoneValues.value}
                format
                formatOnDisplay
                placeholder={country?.placeholder}
                dialCode={country?.dialCode}
              />
              {orgsStore.errors.dtcPhone && (
                <FormError errorText={orgsStore.errors.dtcPhone} />
              )}
            </FormGroup>
            <FormGroup className="mb-3">
              <Input
                onChange={handleChangeContact}
                value={orgsStore.contactInfo?.dtcEmail || ''}
                name="dtcEmail"
                invalid={!!orgsStore.errors.dtcEmail}
                type="email"
                disabled={!isTypeSelected}
                placeholder="Email"
              />
              {orgsStore.errors.dtcEmail && (
                <FormError errorText={orgsStore.errors.dtcEmail} />
              )}
            </FormGroup>
          </>
        )}
        <FormGroup className="d-flex align-items-center justify-content-end mb-0">
          <Button
            size="xs"
            color="link"
            className="mr-1"
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
            className="btn btn-xs btn-primary"
          >
            {orgsStore.isEditing ? 'Save Changes' : 'Add Organization'}
          </LaddaButton>
        </FormGroup>
      </ModalBody>
    </Modal>
  );
});

export default OrgModal;

OrgModal.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
};
