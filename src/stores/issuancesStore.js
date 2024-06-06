import { makeAutoObservable, toJS } from 'mobx';
import applicationStore from './applicationStore';
import { VERIFYING_ISSUANCE } from '../data/const/processStatus';
import { reject } from '../services/applicationService';
import { IssuanceStatus } from '../data/enums/issuanceStatus';
import {
  all,
  issuanceById,
  verify,
  lastBidData,
  deleteLastBid,
  adjustLastBid,
  removeBidder,
  issuanceTermSheet,
  generateSettlementFile,
  generateIssuanceReport,
  cancelOrTerminateIssuance,
} from '../services/issuanceService';
import ErrorModal from '../components/Common/ErrorModal';

class IssuancesStore {
  allIssuances = [];
  issuances = [];
  currentIssuance = undefined;
  status = undefined;
  loading = false;
  searchInputVal = '';
  errors = {};
  termSheet = null;
  issuanceReportLink = '';
  lastBidData = null;
  currentLastBid = null;
  lastBidLoading = false;
  currentTrancheId = null;

  constructor() {
    makeAutoObservable(this);
  }

  get isCancelVisible() {
    if (!this.currentIssuance) {
      return false;
    }

    return (
      this.currentIssuance.status !== IssuanceStatus.CANCELED &&
      this.currentIssuance.status !== IssuanceStatus.TERMINATED &&
      this.currentIssuance.status !== IssuanceStatus.PRICING_COMPLETE
    );
  }

  resetSearchInputField() {
    this.searchInputVal = '';
  }

  sort(data, sortBy) {
    this.issuances = data;
    this.sortBy = sortBy;
  }

  changeStatus(id) {
    const findIssuance = this.issuances.find((el) => el.id === id);
    findIssuance.status = this.currentIssuance.status;
  }

  get currentLastBidData() {
    return this.currentLastBid;
  }

  set currentLastBidData(id) {
    this.currentLastBid = this.lastBidData.find((el) => el.bidId === id);
  }

  async adjustLastBid(id, data) {
    if (applicationStore.permissions.issuance?.view) {
      this.loading = true;
      try {
        await adjustLastBid(id, data);
      } finally {
        this.loading = false;
      }
    }
  }

  async deleteLastBid(id, reason) {
    if (applicationStore.permissions.issuance?.view) {
      this.loading = true;
      try {
        await deleteLastBid(id, { reason });
      } finally {
        this.loading = false;
      }
    }
  }

  async removeBidder(id, data) {
    if (applicationStore.permissions.issuance?.view) {
      this.loading = true;
      try {
        await removeBidder(id, data);
      } finally {
        this.loading = false;
      }
    }
  }

  changeStatusForClient(data) {
    data.forEach((el) => {
      switch (el.status) {
        case IssuanceStatus.REJECTED:
          el.status =
            el.history[el.history.length - 1].prevAction ===
            IssuanceStatus.REVIEWED
              ? 'Rejected by Verifier '
              : 'Rejected by Reviewer';
          break;
        case IssuanceStatus.PRICING_COMPLETE:
          el.status = 'Pricing completed';
          break;
        case IssuanceStatus.PRICING_FINALIZED:
          el.status = 'Pricing finalized';
          break;
        case IssuanceStatus.BENCHMARK_SPOTTING_START:
          el.status = 'Benchmark spotting start';
          break;
        default:
      }
    });
  }

  async getAllIssuances(queries) {
    if (applicationStore.permissions.issuance?.view) {
      this.loading = true;
      try {
        const issuances = await all(queries);
        this.changeStatusForClient(issuances);
        this.issuances = issuances;
        this.allIssuances = issuances;
      } finally {
        this.loading = false;
      }
    }
  }

  async search(value) {
    this.searchInputVal = value;
    value === ''
      ? await this.getAllIssuances()
      : await this.getAllIssuances({ text: value });
  }

  async getIssuance(id) {
    if (applicationStore.permissions.issuance?.view) {
      this.loading = true;
      try {
        const issuance = await issuanceById(id);

        issuance.tranches.forEach((tranche) => {
          let numberOfRules = 0;
          if (tranche.minAllocation !== 0 && tranche.minIncrement !== 0) {
            numberOfRules++;
          }
          tranche.preferenceConfig && numberOfRules++;
          tranche.concentrationConfig && numberOfRules++;
          tranche.volumeIncreaseConfig && numberOfRules++;
          tranche.numberOfRules = numberOfRules;
        });

        this.currentIssuance = issuance;
      } finally {
        this.loading = false;
      }
    }
  }

  async getLastBid(id) {
    if (applicationStore.permissions.issuance?.view) {
      this.lastBidLoading = true;
      try {
        const result = await lastBidData(id);
        this.lastBidData = result;
      } finally {
        this.lastBidLoading = false;
      }
    }
  }

  get currentTrancheIdParam() {
    return this.currentTrancheId;
  }

  set currentTrancheIdParam(id) {
    this.currentTrancheId = id;
  }

  async verifyIssuance(id) {
    if (applicationStore.permissions.issuance?.verify) {
      this.loading = true;
      this.status = VERIFYING_ISSUANCE;
      try {
        await verify(id);
        this.currentIssuance.status = IssuanceStatus.VERIFIED;
        this.changeStatus(id);
      } finally {
        this.loading = false;
        this.status = undefined;
      }
    }
  }

  async rejectIssuance(id, data) {
    if (applicationStore.permissions.issuance?.verify) {
      this.loading = true;
      try {
        await reject(id, data);
        this.currentIssuance.status = IssuanceStatus.REJECTED;
        this.changeStatus(id);
      } finally {
        this.loading = false;
        this.status = undefined;
      }
    }
  }

  async cancelOrTerminate(data) {
    try {
      const { status } = await cancelOrTerminateIssuance(
        this.currentIssuance.id,
        data,
      );
      this.currentIssuance.status = status;

      const mutableIssuances = [...toJS(this.issuances)];
      const issuance = mutableIssuances.find(
        (issuance) => issuance.id === this.currentIssuance.id,
      );

      if (issuance) {
        issuance.status = status;
        this.issuances = mutableIssuances;
      }
    } catch (error) {
      throw error;
    }
  }

  async getTermSheetData(issuanceId, trancheId) {
    this.loading = true;
    try {
      this.termSheet = await issuanceTermSheet(issuanceId, trancheId);
    } finally {
      this.loading = false;
    }
  }

  async getIssuanceReport(issuanceId) {
    if (applicationStore.permissions.issuance?.view) {
      this.loading = true;
      try {
        const issuanceReport = await generateIssuanceReport(issuanceId);
        const url = URL.createObjectURL(new Blob([issuanceReport]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `issuanceReport_${issuanceId}.xlsx`);
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(url);
        return issuanceReport;
      } catch (e) {
        ErrorModal('The report is not currently available');
      } finally {
        this.loading = false;
      }
    }
  }

  async getSettlementFile(issuanceId) {
    if (applicationStore.permissions.issuance?.view) {
      this.loading = true;
      try {
        const settlemenFile = await generateSettlementFile(issuanceId);
        const url = URL.createObjectURL(new Blob([settlemenFile]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `settlemenFile_${issuanceId}.xlsx`);
        link.click();
        URL.revokeObjectURL(url);
      } catch (e) {
        ErrorModal('The report is not currently available');
      } finally {
        this.loading = false;
      }
    }
  }

  get issuancesLength() {
    return this.issuances.length;
  }

  get tranchesLength() {
    return this.currentIssuance?.tranches?.length;
  }
}

export default new IssuancesStore();
