import { makeAutoObservable } from 'mobx';

import { init } from '../services/applicationService';

import { consent } from '../services/applicationService';

const { REACT_APP_CCP_API } = process.env;

const API_ROOT = REACT_APP_CCP_API;

class ApplicationStore {
  application = {};
  codeMetadata = [];
  documents = [];
  user = undefined;

  unconsentedDocuments = [];
  hasFullyConsented = false;

  termsDocument = {};
  privacyDocument = {};
  ruleBookDocument = {};

  loading = true;
  isConsentingDocument = false;

  constructor() {
    makeAutoObservable(this);
  }

  stopLoading() {
    this.loading = false;
  }

  async consentDocument(id) {
    this.isConsentingDocument = true;
    try {
      this.unconsentedDocuments = await consent(id, this.application.code);
    } catch (e) {
      console.log(e);
    } finally {
      this.isConsentingDocument = false;
    }
  }

  async appInit() {
    this.loading = true;

    try {
      const response = await init();

      this.application = response.application;
      this.codeMetadata = response.codeMetadata;
      this.documents = response.documents;
      this.user = response.user;

      this.unconsentedDocuments = response.user.unconsentedDocuments;

      const termsDocument = response.user.unconsentedDocuments.find(
        (doc) => doc.name === 'Terms Of Use',
      );
      if (termsDocument) {
        this.termsDocument = termsDocument;
        this.termsDocument.url = `${API_ROOT}${termsDocument.url}`;
      }

      const privacyDocument = response.user.unconsentedDocuments.find(
        (doc) => doc.name === 'Privacy Statement',
      );
      if (privacyDocument) {
        this.privacyDocument = privacyDocument;
        this.privacyDocument.url = `${API_ROOT}${privacyDocument.url}`;
      }

      const ruleBookDocument = response.user.unconsentedDocuments.find(
        (doc) => doc.name === 'Rule Book',
      );
      if (ruleBookDocument) {
        this.ruleBookDocument = ruleBookDocument;
        this.ruleBookDocument.url = `${API_ROOT}${ruleBookDocument.url}`;
      }

      return response;
    } catch (err) {
      return err.response;
    }
  }

  get hasConsentedTerms() {
    return !this.unconsentedDocuments?.find(
      (doc) => doc.name === 'Terms Of Use',
    );
  }

  get hasConsentedPrivacy() {
    return !this.unconsentedDocuments?.find(
      (doc) => doc.name === 'Privacy Statement',
    );
  }

  get hasConsentedRuleBook() {
    return !this.unconsentedDocuments?.find((doc) => doc.name === 'Rule Book');
  }

  get hasUnconsentedDocument() {
    return this.unconsentedDocuments.length > 0;
  }

  get permissions() {
    const permissions = {};

    if (this.user) {
      this.user.effectivePermissions.forEach((p) => {
        permissions[p.resource.toLowerCase()] = {
          ...permissions[p.resource.toLowerCase()],
          [p.action.toLowerCase()]: p.action,
        };
      });
    }

    return permissions;
  }
}

export default new ApplicationStore();
