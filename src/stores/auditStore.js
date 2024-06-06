import { makeAutoObservable, action } from 'mobx';
import { v4 as uuidv4 } from 'uuid';

import applicationStore from './applicationStore';

import { all } from '../services/auditService';

class AuditStore {
  events = {
    items: [],
    total: undefined,
    take: 15,
    skip: 0,
    withTotal: true,
  };

  loading = false;

  filters = {
    organization: null,
    dateFrom: undefined,
    dateTo: undefined,
    requestId: undefined,
    requestIP: undefined,
    userId: undefined,
    event: undefined,
    entityName: undefined,
    entityId: undefined,
    entityValue: undefined,
    source: undefined,
  };

  errors = {};

  appliedFilters = {};

  constructor() {
    makeAutoObservable(this, {
      pageChange: action.bound,
    });
  }

  setOrg(org) {
    this.filters.organization = org;
  }

  setDate(date, type) {
    this.filters[type] = date;
    if (this.errors.dateRange) {
      delete this.errors.dateRange;
    }
  }

  resetAllFilters() {
    this.filters = {
      organization: null,
      dateFrom: undefined,
      dateTo: undefined,
      requestId: undefined,
      requestIP: undefined,
      userId: undefined,
      event: undefined,
      entityName: undefined,
      entityId: undefined,
      entityValue: undefined,
      source: undefined,
    };
    this.appliedFilters = {};
    this.getAllStats();
  }

  pageChange(take, skip) {
    this.events.take = take;
    this.events.skip = skip;

    this.getAllStats();
  }

  setFilter(name, value) {
    this.filters[name] = value;
  }

  removeFilter(name) {
    if (name === 'organization') {
      this.filters[name] = null;
    } else {
      this.filters[name] = undefined;
    }
    this.getAllStats();
    delete this.appliedFilters[name];
  }

  async validateDates() {
    const errors = {};
    if (this.filters.dateFrom && this.filters.dateTo) {
      const dateFrom = new Date(this.filters.dateFrom);
      const dateTo = new Date(this.filters.dateTo);

      if (dateFrom.getTime() === dateTo.getTime()) {
        errors.dateRange = 'Incorrect date range';
        return errors;
      } else {
        return false;
      }
    }
    return false;
  }

  async applyFilters() {
    const errors = await this.validateDates();
    if (errors) {
      this.errors = errors;
      return { errors };
    }
    this.events.skip = 0;
    await this.getAllStats();
  }

  addUniqId(data) {
    return data.map((el) => ({ ...el, id: uuidv4() }));
  }

  async getAllStats() {
    if (applicationStore.permissions.audit?.view) {
      this.loading = true;
      try {
        const queries = {
          skip: this.events.skip,
          take: this.events.take,
          withTotal: true,
        };

        for (const [key, value] of Object.entries(this.filters)) {
          if (value) {
            this.appliedFilters[key] = true;
            if (key === 'organization') {
              queries.orgCode = this.filters.organization.code;
            } else {
              queries[key] = value;
            }
          }
        }

        const response = await all(queries);

        this.events.items = this.addUniqId(response.items);
        this.events.total = response.total;
      } finally {
        this.loading = false;
      }
    }
  }
}

export default new AuditStore();
