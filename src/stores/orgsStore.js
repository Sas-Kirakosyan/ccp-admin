import { makeAutoObservable } from 'mobx';
import moment from 'moment';
import isEmpty from 'is-empty';
import { getRatingsWithNames } from '../helpers/functions';
import applicationStore from './applicationStore';
import ErrorModal from '../components/Common/ErrorModal';

import { groupBy } from '../helpers/common';
import { formatDateToString } from '../helpers/date';
import textContent from '../data/const/textContent';
import {
  toMillion,
  isMatchDateAndDay,
  validateEmail,
  validateDTC,
} from '../helpers/common';
import { initialMultipleDates } from '../data/const/constants';
import {
  all,
  org,
  add,
  types,
  update,
  rating,
  allCountries,
  investorCategories,
  existingSecurities,
  addExistingSecurity,
  deleteExistingSecurity,
  updateExistingSecurity,
} from '../services/orgsService';

class OrgsStore {
  allOrgs = [];
  orgs = [];
  investorOrgCategory = null;
  existingSecurities = null;
  currentSecurity = {};
  currentOrg = {
    name: '',
    shortName: '',
    ticker: '',
    code: '',
    type: null,
    creditLimitVolume: null,
    buyingPower: null,
    investorCategoryId: null,
  };
  contactInfo = {};
  countries = [];
  loading = false;
  searchInputVal = '';
  errors = {};
  orgTypes = undefined;
  isEditing = false;
  sortBy = [];
  status = undefined;

  constructor() {
    makeAutoObservable(this);
  }

  inputChange(name, value) {
    this.currentOrg[name] = value;
    this.errors[name] && delete this.errors[name];
  }

  handleContactInfo(name, value) {
    if (name === 'dtcNumber') {
      if (validateDTC(value)) {
        this.contactInfo[name] = value;
        this.errors[name] && delete this.errors[name];
      }
    } else {
      this.contactInfo[name] = value;
      this.errors[name] && delete this.errors[name];
    }
  }

  resetContactInfo(onlyAddress) {
    if (onlyAddress) {
      this.contactInfo = {
        ...this.contactInfo,
        street: '',
        city: '',
        stateShortName: '',
        zip: '',
      };
    } else {
      this.contactInfo = {};
    }
  }

  handleSecurityInput(name, value) {
    this.currentSecurity[name] = value;
    this.errors[name] && delete this.errors[name];
  }

  handleMultipleMonth(type, name, value) {
    if (name === 'firstMonth') {
      this.currentSecurity[type][0].month = value;
    } else {
      this.currentSecurity[type][1].month = value;
    }
    this.errors[type] && delete this.errors[type];
  }

  handleMultipleDay(type, name, value) {
    if (name === 'firstMonthDays') {
      this.currentSecurity[type][0].day = value;
    } else {
      this.currentSecurity[type][1].day = value;
    }

    this.errors[type] && delete this.errors[type];
  }

  removeError(type) {
    this.errors[type] && delete this.errors[type];
  }

  setInitialSecurity() {
    this.currentSecurity.orgCode = this.currentOrg.code;
    this.currentSecurity.interestPaymentDates = initialMultipleDates;
    this.currentSecurity.interestRecordDates = initialMultipleDates;
    this.currentSecurity.redemption = '';
    this.currentSecurity.listing = false;
  }

  async validateSecurity() {
    const errors = {};
    if (
      this.currentSecurity.interestPaymentDates.some(
        (el) => el.month === null || el.day === null,
      )
    ) {
      errors.interestPaymentDates = textContent.errors.REQUIRED;
    }
    if (
      this.currentSecurity.interestRecordDates.some(
        (el) => el.month === null || el.day === null,
      )
    ) {
      errors.interestRecordDates = textContent.errors.REQUIRED;
    }
    if (isEmpty(this.currentSecurity.coupon)) {
      errors.coupon = textContent.errors.REQUIRED;
    }
    if (isEmpty(this.currentSecurity.cusip)) {
      errors.cusip = textContent.errors.REQUIRED;
    }
    if (isEmpty(this.currentSecurity.isin)) {
      errors.isin = textContent.errors.REQUIRED;
    }
    if (isEmpty(this.currentSecurity.principalAmount)) {
      errors.principalAmount = textContent.errors.REQUIRED;
    }
    if (isEmpty(this.currentSecurity.ranking)) {
      errors.ranking = textContent.errors.REQUIRED;
    }
    if (isEmpty(this.currentSecurity.denominationIncrement)) {
      errors.denominationIncrement = textContent.errors.REQUIRED;
    }
    if (isEmpty(this.currentSecurity.denominationMinimum)) {
      errors.denominationMinimum = textContent.errors.REQUIRED;
    }
    if (isEmpty(this.currentSecurity.format)) {
      errors.format = textContent.errors.REQUIRED;
    }
    if (isEmpty(this.currentSecurity.form)) {
      errors.form = textContent.errors.REQUIRED;
    }
    if (isEmpty(this.currentSecurity.dayCountConvention)) {
      errors.dayCountConvention = textContent.errors.REQUIRED;
    }
    if (isEmpty(this.currentSecurity.maturityDate)) {
      errors.maturityDate = textContent.errors.REQUIRED;
    }
    if (isEmpty(this.currentSecurity.issueDate)) {
      errors.issueDate = textContent.errors.REQUIRED;
    }
    if (isEmpty(this.currentSecurity.commencingOn)) {
      errors.commencingOn = textContent.errors.REQUIRED;
    }
    if (isEmpty(this.currentSecurity.guarantors)) {
      errors.guarantors = textContent.errors.REQUIRED;
    }
    if (isEmpty(this.currentSecurity.guarantors)) {
      errors.guarantors = textContent.errors.REQUIRED;
    }
    if (isEmpty(this.currentSecurity.securities)) {
      errors.securities = textContent.errors.REQUIRED;
    }

    if (
      !isMatchDateAndDay(
        formatDateToString(this.currentSecurity.commencingOn),
        this.currentSecurity.interestPaymentDates,
      )
    ) {
      errors.interestPaymentDates = textContent.errors.IS_MATCH_COMMENCING_ON;
    }
    if (isEmpty(errors)) {
      return 'ok';
    } else {
      this.errors = { ...errors };
      return { errors: errors };
    }
  }

  setDateSecurity(date, type) {
    this.currentSecurity[type] = date;
    if (type === 'commencingOn') {
      delete this.errors['interestPaymentDates'];
    }
    if (this.errors[type]) {
      delete this.errors[type];
    }
  }

  inputMillionChange(name, value) {
    if (value === '') {
      this.currentOrg[name] = '';
    } else {
      this.currentOrg[name] = toMillion(+value);
    }

    this.errors[name] && delete this.errors[name];
  }

  resetCurrentSecurity() {
    this.currentSecurity = {};
    this.errors = {};
  }

  resetOrgFields() {
    this.isEditing = false;
    this.currentOrg = {
      name: '',
      shortName: '',
      ticker: '',
      type: null,
      code: '',
      creditLimitVolume: null,
      buyingPower: null,
      investorCategoryId: null,
    };
    this.errors = {};
  }

  resetSearchInputField() {
    this.searchInputVal = '';
  }

  setOrgType(s) {
    this.currentOrg.type = s;
    if (s.value !== 'Issuer') this.currentOrg.ticker = null;
    this.errors.type && delete this.errors.type;
  }

  setIsEditing() {
    this.isEditing = !this.isEditing;
  }

  setSortBy(sortBy) {
    this.sortBy = sortBy;
  }

  istTypeInvestor() {
    return this.currentOrg.type?.value === textContent.ORG_TYPE.INVESTOR
      ? true
      : false;
  }

  async validateOrg() {
    const errors = {};
    if (this.istTypeInvestor()) {
      if (
        isEmpty(this.currentOrg.creditLimitVolume) ||
        isNaN(this.currentOrg.creditLimitVolume)
      )
        errors.creditLimitVolume = true;
      if (
        isEmpty(this.currentOrg.buyingPower) ||
        isNaN(this.currentOrg.buyingPower)
      )
        errors.buyingPower = textContent.errors.REQUIRED;
      if (isEmpty(this.currentOrg.investorCategoryId))
        errors.investorCategoryId = textContent.errors.REQUIRED;

      if (
        isEmpty(this.contactInfo.city) ||
        isEmpty(this.contactInfo.street) ||
        isEmpty(this.contactInfo.zip)
      ) {
        errors.address = textContent.errors.REQUIRED;
      }
      if (this.errors.address) {
        errors.address = textContent.errors.ADDRESS_NOT_VALID;
      }
      if (
        this.contactInfo.dtcEmail &&
        !validateEmail(this.contactInfo.dtcEmail)
      ) {
        errors.dtcEmail = textContent.errors.EMAIL_NOT_VALID;
      }

      if (isEmpty(this.contactInfo.dtcName)) {
        errors.dtcName = textContent.errors.REQUIRED;
      }
      if (isEmpty(this.contactInfo.dtcPhone)) {
        errors.dtcPhone = textContent.errors.REQUIRED;
      }
      if (isEmpty(this.contactInfo.dtcPhone)) {
        errors.dtcPhone = textContent.errors.REQUIRED;
      }
      if (this.errors.dtcPhone) {
        errors.dtcPhone = textContent.errors.PHONE_NOT_VALID;
      }
      if (isEmpty(this.contactInfo.purchaserName)) {
        errors.purchaserName = textContent.errors.REQUIRED;
      }
      if (isEmpty(this.contactInfo.dtcEmail)) {
        errors.dtcEmail = textContent.errors.REQUIRED;
      }
      if (isEmpty(this.contactInfo.dtcNumber)) {
        errors.dtcNumber = textContent.errors.REQUIRED;
      }
      if (this.currentOrg.contactInfo < 1000) {
        errors.dtcNumber = textContent.errors.DTC_NUMBER_MIN;
      }
    }

    if (isEmpty(this.currentOrg.name))
      errors.name = textContent.errors.REQUIRED;
    if (isEmpty(this.currentOrg.shortName))
      errors.shortName = textContent.errors.REQUIRED;
    if (isEmpty(this.currentOrg.code))
      errors.code = textContent.errors.REQUIRED;
    if (!this.currentOrg.type) {
      errors.type = textContent.errors.REQUIRED;
    } else {
      if (this.currentOrg.type.code === textContent.ORG_TYPE.ISSUER) {
        if (isEmpty(this.currentOrg.ticker))
          errors.ticker = textContent.errors.REQUIRED;
      }
    }

    if (isEmpty(errors)) {
      return 'ok';
    } else {
      this.errors = { ...errors };
      return { errors: errors };
    }
  }

  setInvestorCategoryId(id) {
    this.currentOrg.investorCategoryId = id;
    if (this.errors.investorCategoryId) {
      delete this.errors.investorCategoryId;
    }
  }

  async addNewOrg() {
    if (applicationStore.permissions.organization?.create) {
      this.loading = true;
      const result = await this.validateOrg();
      if (result === 'ok') {
        try {
          await add({
            name: this.currentOrg.name,
            shortName: this.currentOrg.shortName,
            code: this.currentOrg.code,
            ticker: this.currentOrg.ticker,
            type: this.currentOrg.type?.value || null,
            buyingPower: this.currentOrg.buyingPower
              ? +this.currentOrg.buyingPower
              : null,
            creditLimitVolume: this.currentOrg.creditLimitVolume
              ? +this.currentOrg.creditLimitVolume
              : null,
            investorCategoryId: this.istTypeInvestor()
              ? this.currentOrg.investorCategoryId
              : null,
            contactInfo: this.istTypeInvestor() ? this.contactInfo : null,
          });
          this.resetSearchInputField();
          this.resetOrgFields();
          return 'ok';
        } finally {
          this.loading = false;
        }
      } else {
        this.loading = false;
      }
    }
  }

  async getInvestorCategory() {
    this.loading = true;
    try {
      const result = await investorCategories();
      this.investorOrgCategory = result;
    } finally {
      this.loading = false;
    }
  }

  async getCountries() {
    this.loading = true;
    try {
      const result = await allCountries();
      this.countries = result;
    } finally {
      this.loading = false;
    }
  }

  get defaultCountry() {
    return this.countries.find((country) => country.name2L === 'US');
  }

  getExactCountry(id) {
    return this.countries.find((country) => country.id === id);
  }

  get currentInvestorCategoryName() {
    if (this.investorOrgCategory && this.currentOrg.investorCategoryId) {
      const { categoryName } = this.investorOrgCategory.find(
        (el) => el.id === this.currentOrg.investorCategoryId,
      );
      return categoryName;
    }
    return '';
  }

  async updateOrg() {
    if (applicationStore.permissions.organization?.modify) {
      this.loading = true;
      const result = await this.validateOrg();
      if (result === 'ok') {
        try {
          await update(this.currentOrg.code, {
            name: this.currentOrg.name,
            shortName: this.currentOrg.shortName,
            ticker: this.currentOrg.ticker,
            type: this.currentOrg.type?.value || null,
            buyingPower: this.currentOrg.buyingPower
              ? +this.currentOrg.buyingPower
              : null,
            creditLimitVolume: this.currentOrg.creditLimitVolume
              ? +this.currentOrg.creditLimitVolume
              : null,
            investorCategoryId: this.istTypeInvestor()
              ? this.currentOrg.investorCategoryId
              : null,
            contactInfo: this.istTypeInvestor() ? this.contactInfo : null,
          });
          this.resetSearchInputField();
          this.resetOrgFields();
          return 'ok';
        } finally {
          this.loading = false;
        }
      } else {
        this.loading = false;
      }
    }
  }

  async getAllOrgs() {
    if (applicationStore.permissions.organization?.view) {
      this.loading = true;

      try {
        const orgs = await all();
        this.allOrgs = orgs;
        if (this.searchInputVal) {
          this.orgs = orgs.filter((user) =>
            user.name.toLowerCase().includes(this.searchInputVal.toLowerCase()),
          );
        } else {
          this.orgs = orgs;
        }
      } finally {
        this.loading = false;
      }
    }
  }

  search(value, searchBy) {
    this.searchInputVal = value;
    this.orgs = this.allOrgs.filter(
      (user) =>
        user[searchBy] &&
        user[searchBy].toLowerCase().includes(value.toLowerCase()),
    );
  }

  async getOrg(code) {
    if (applicationStore.permissions.organization?.modify) {
      this.loading = true;

      try {
        const response = await org(code);
        this.contactInfo = response.contactInfo || {};
        this.contactInfo.stateId = null;
        if (!this.orgTypes) await this.getOrgTypes();

        const findType = this.orgTypes.find(
          (type) => type.code === response.type,
        );

        this.currentOrg = {
          ...this.currentOrg,
          name: response.name,
          shortName: response.shortName,
          code: response.code,
          ticker: response.ticker,
          creditLimitVolume: response.creditLimitVolume,
          investorCategoryId: response.investorCategoryId,
          buyingPower: response.buyingPower,
          sector: response.sector,
          industry: response.industry,
          type: {
            label: findType.label,
            value: findType.code,
            ...findType,
          },
        };

        if (response.ratings.length > 0) {
          this.currentOrg.ratings = await getRatingsWithNames(response.ratings);
        } else {
          this.currentOrg.ratings = [];
        }

        return 'ok';
      } finally {
        this.loading = false;
      }
    }
  }

  async getOrgTypes() {
    if (applicationStore.permissions.organization?.view) {
      this.loading = true;
      try {
        const orgTypes = await types();
        this.orgTypes = orgTypes.filter(
          (orgType) => orgType.codeType === 'ORG_TYPE',
        );
      } finally {
        this.loading = false;
      }
    }
  }

  async setOrgRating(ratingIds) {
    if (applicationStore.permissions.organization?.modify) {
      this.status = 'Changing rating';
      try {
        const data = {
          ratingIds: Object.values(ratingIds),
          ratingDate: new Date(),
        };
        const response = await rating(this.currentOrg.code, data);
        this.currentOrg.ratings = response;
        if (response.length > 0) {
          this.currentOrg.ratings = await getRatingsWithNames(response);
        } else {
          this.currentOrg.ratings = [];
        }
      } catch (err) {
        ErrorModal(err?.response?.message);
      } finally {
        this.status = undefined;
      }
    }
  }

  get currentRatings() {
    return this.currentOrg.ratings?.map((rating) => ({
      ...rating,
      date: moment(rating.ratingDate).date(),
    }));
  }

  get ratingDateForTable() {
    const groupByDate = groupBy(this.currentRatings, 'date');
    const dateForTable = [];
    for (const key in groupByDate) {
      const currentObj = {};
      const el = groupByDate[key];
      el.forEach((rating) => {
        currentObj[rating['providerName']] = rating['ratingName'];
        currentObj.ratingDate = rating.ratingDate;
        currentObj.id = rating.id;
      });
      dateForTable.push(currentObj);
    }
    return dateForTable;
  }

  getLastValueRate(type) {
    return this.ratingDateForTable
      .sort((a, b) =>
        new Date(a.ratingDate) - new Date(b.ratingDate) > 0 ? -1 : 1,
      )
      .find((el) => el[type]);
  }

  async getSecurities(code) {
    this.loading = true;
    try {
      this.existingSecurities = await existingSecurities(code);
      this.loading = false;
    } catch (err) {
      ErrorModal(err?.response?.message);
    } finally {
      this.status = undefined;
      this.loading = false;
    }
  }

  resetError(name) {
    delete this.errors[name];
  }

  setError(name, value) {
    this.errors[name] = value;
  }

  async updateSecurity() {
    this.loading = true;
    const result = await this.validateSecurity();
    if (result === 'ok') {
      this.convertDateToStringSecurity();
      try {
        await updateExistingSecurity(
          this.currentSecurity?.id,
          this.currentSecurity,
        );
        await this.getSecurities(this.currentOrg.code);
        this.loading = false;
      } catch (err) {
        ErrorModal(err?.response?.message);
      } finally {
        this.status = undefined;
        this.loading = false;
      }
    } else {
      this.loading = false;
    }
  }

  async addSecurity() {
    this.loading = true;
    const result = await this.validateSecurity();
    if (result === 'ok') {
      this.convertDateToStringSecurity();
      try {
        await addExistingSecurity(this.currentSecurity);
        await this.getSecurities(this.currentOrg.code);
        this.loading = false;
        this.resetCurrentSecurity();
      } catch (err) {
        this.loading = false;
        ErrorModal(err?.response?.message);
      } finally {
        this.status = undefined;
        this.loading = false;
      }
    } else {
      this.loading = false;
    }
  }

  async deleteSecurity(id) {
    this.loading = true;
    try {
      await deleteExistingSecurity(id);
      await this.getSecurities(this.currentOrg.code);
      this.loading = false;
    } catch (err) {
      ErrorModal(err?.response?.message);
    } finally {
      this.status = undefined;
      this.loading = false;
    }
  }

  setCurrentSecurity(id) {
    if (this.existingSecurities) {
      this.currentSecurity = this.existingSecurities.find(
        (sec) => sec.id === id,
      );
    } else {
      this.currentSecurity = {};
    }
  }

  convertDateToStringSecurity() {
    this.currentSecurity.commencingOn = formatDateToString(
      this.currentSecurity?.commencingOn,
    );
    this.currentSecurity.maturityDate = formatDateToString(
      this.currentSecurity?.maturityDate,
    );
    this.currentSecurity.issueDate = formatDateToString(
      this.currentSecurity?.issueDate,
    );
  }

  setSecurityRanking(value) {
    this.currentSecurity.ranking = value;
  }

  setSecurityDayCount(value) {
    this.currentSecurity.dayCountConvention = value;
  }

  setSecurityFormat(value) {
    this.currentSecurity.format = value;
  }

  async setOrgSector(sector) {
    this.currentOrg.sector = sector;
    try {
      this.status = 'Setting sector';
      const org = {
        type: this.currentOrg.type.code,
        name: this.currentOrg.name,
        shortName: this.currentOrg.shortName,
        ticker: this.currentOrg.ticker,
        industryId: this.currentOrg.industry?.id || null,
        sectorId: sector.id,
      };
      const response = await update(this.currentOrg.code, org);
      this.currentOrg.sector = response.sector;
      if (response.industryId) this.currentOrg.industryId = response.industryId;
    } catch (err) {
      ErrorModal(err?.response?.message);
    } finally {
      this.status = undefined;
    }
  }

  async setOrgIndustry(industry) {
    this.currentOrg.industry = industry;
    try {
      this.status = 'Setting industry';

      const org = {
        type: this.currentOrg.type.code,
        name: this.currentOrg.name,
        shortName: this.currentOrg.shortName,
        ticker: this.currentOrg.ticker,
        industryId: industry.id,
        sectorId: this.currentOrg.sector.id || null,
      };

      const response = await update(this.currentOrg.code, org);

      this.currentOrg.industry = response.industry;

      if (response.sectorId) this.currentOrg.sectorId = response.sectorId;
    } catch (err) {
      ErrorModal(err?.response?.message);
    } finally {
      this.status = undefined;
    }
  }

  get orgsLength() {
    return this.orgs.length;
  }

  get orgsData() {
    return this.orgs.map((org) => ({
      type: org.type,
      ticker: org.ticker,
      sector: org.sector,
      industry: org.industry,
      name: org.name,
      code: org.code,
      buyingPower: org.buyingPower,
      creditLimitVolume: org.creditLimitVolume,
      creditLimitLastUpdatedDate: org.creditLimitLastUpdatedDate,
      investorCategory: this.investorOrgCategory
        ? this.investorOrgCategory.find(
            (el) => el.id === org.investorCategoryId,
          )?.categoryName
        : null,
    }));
  }
}

export default new OrgsStore();
