import { makeAutoObservable } from 'mobx';

import {
  getSectors,
  getRating,
  getIndustry,
} from '../services/referenceService';

import { all } from '../services/applicationService';

class ReferenceStore {
  apps = undefined;
  sectors = undefined;
  industries = undefined;
  ratings = undefined;
  roles = undefined;

  status = undefined;

  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  async getApps() {
    this.loading = true;
    try {
      this.apps = await all();
    } finally {
      this.loading = false;
    }
  }

  async getSectors() {
    this.loading = true;
    try {
      this.sectors = await getSectors();
    } finally {
      this.loading = false;
    }
  }

  async getRatings() {
    this.loading = true;
    try {
      this.ratings = await getRating();
    } finally {
      this.loading = false;
    }
  }

  async getIndustries() {
    this.loading = true;
    try {
      this.industries = await getIndustry();
    } finally {
      this.loading = false;
    }
  }

  async findIndustry(id) {
    if (!this.industries) {
      await this.getIndustries();
    }
    if (this.industries) {
      return await this.industries.find((i) => +i.id === +id);
    }
  }

  async findRating(id) {
    if (!this.ratings) {
      await this.getRatings();
    }
    if (this.ratings) {
      return await this.ratings.find((i) => +i.id === +id);
    }
  }

  async findSector(id) {
    if (!this.sectors) {
      await this.getSectors();
    }
    if (this.sectors) {
      return await this.sectors.find((s) => +s.id === +id);
    }
  }
}

export default new ReferenceStore();
