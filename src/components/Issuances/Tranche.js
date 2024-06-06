import React, { useState } from 'react';
import PropTypes from 'prop-types';

import LaddaButton from 'react-ladda';

import { observer } from 'mobx-react';
import {
  BENCHMARK_INFO,
  GUIDANCE_PRICE_INFO,
  MAX_VOLUME_INFO,
  MIN_VOLUME_INFO,
  RESERVE_PRICE_INFO,
  TARGET_PRICE_INFO,
  COUPON_TYPE_INFO,
  TARGET_VOLUME_INFO,
  VOLUME_INCREASE_THRESHOLD_SPREAD_INFO,
  VOLUME_INCREASE_FACTOR_INFO,
  MAX_PREF_ALLOWANCE_INFO,
  MAX_PREF_ALLOWANCE_EXAMPLE_INFO,
  PREF_WINDOW_INFO,
  TOP_1_MAX_INFO,
  TOP_N_MAX_INFO,
  MIN_ALLOC_INFO,
  MIN_ALLOC_DEFAULT_INFO,
  MIN_ALLOC_INCREMENT_INFO,
  MIN_ALLOC_INCREMENT_DEFAULT_INFO,
} from '../../data/const/infoStrings';

import { IssuanceStatus } from '../../data/enums/issuanceStatus';

import textContent from 'data/const/textContent';

import { transformMillion } from '../../helpers/common';
import InfoPopover from '../Common/InfoPopover';
import { Button, Card, CardBody, CardHeader, Collapse } from 'reactstrap';
import TooltipItem from '../Common/TooltipItem';
import issuancesStore from '../../stores/issuancesStore';
import uiStore from '../../stores/uiStore';
import ErrorModal from '../Common/ErrorModal';

const Tranche = observer(({ tranche, className }) => {
  const [rulesCollapsed, setRulesCollapsed] = useState(false);
  const collapseRules = () => setRulesCollapsed(!rulesCollapsed);

  const openTermSheetModal = (issuanceId, trancheId) => {
    try {
      uiStore.toggleModal('termsheet');
      issuancesStore.getTermSheetData(issuanceId, trancheId);
    } catch (e) {
      ErrorModal(e?.response?.message);
    }
  };

  const handlePopupLastBid = async () => {
    try {
      uiStore.toggleModal('lastBidTable');
      await issuancesStore.getLastBid(tranche.id);
      issuancesStore.currentTrancheIdParam = tranche.id;
    } catch (e) {
      ErrorModal(e?.response?.message);
    }
  };

  const handlePopupRemoveBidder = async () => {
    try {
      uiStore.toggleModal('removeBidderTable');
      await issuancesStore.getLastBid(tranche.id);
      issuancesStore.currentTrancheIdParam = tranche.id;
    } catch (e) {
      ErrorModal(e?.response?.message);
    }
  };

  function allowAdjust(status = '') {
    switch (status) {
      case IssuanceStatus.IN_PRICING:
        return true;
      case IssuanceStatus.AWAITING_PRICING:
        return true;
      default:
        return false;
    }
  }

  return (
    <div className={`p-2 ${className}`}>
      <Card>
        <CardHeader className="bg-white d-flex justify-content-between align-items-center p-2">
          {tranche?.termSheet?.name}
          {tranche?.maturityInMonths && (
            <span>{tranche?.maturityInMonths} Months</span>
          )}
          {allowAdjust(issuancesStore.currentIssuance?.status) && (
            <Button
              color="info"
              size="sm"
              onClick={handlePopupRemoveBidder}
              className="mx-1"
            >
              {textContent.issuances.REMOVE_BIDDER}
            </Button>
          )}
          {allowAdjust(issuancesStore.currentIssuance?.status) && (
            <Button
              color="info"
              size="sm"
              onClick={handlePopupLastBid}
              className="mx-1"
            >
              {textContent.issuances.ADJUST_BID}
            </Button>
          )}
          <LaddaButton
            onClick={() => openTermSheetModal(tranche.issuanceId, tranche.id)}
            className="btn btn-sm btn-primary mx-1"
          >
            Term Sheet
          </LaddaButton>
        </CardHeader>

        <CardBody className="p-2">
          <div className="text-sm-larger">
            <div className="d-flex justify-content-between">
              <Button
                id="targetCouponLabelId"
                color="link"
                className="p-0 text-bold text-sm-larger mr-2"
              >
                Coupon Type
                <InfoPopover
                  targetId="targetCouponLabelId"
                  placement="bottom"
                  title="Coupon Type"
                  desc={COUPON_TYPE_INFO}
                />
              </Button>
              <div className="font-weight-bold text-capitalize">
                {tranche?.couponTypeCode}
              </div>
            </div>

            <div className="d-flex justify-content-between mt-1">
              <Button
                id="targetVolumeLabelId"
                color="link"
                className="text-nowrap p-0 text-bold text-sm-larger mr-2"
              >
                Target Principal Amount
                <TooltipItem
                  placement="top"
                  content="Hidden from the investors"
                >
                  <i className="text-xs ml-2 fa fa-key text-dark" />
                </TooltipItem>
                <InfoPopover
                  targetId="targetVolumeLabelId"
                  placement="bottom"
                  title="Target Principal Amount"
                  desc={TARGET_VOLUME_INFO}
                />
              </Button>
              <div className="font-weight-bold text-nowrap">
                {transformMillion(+tranche?.targetVolume)}
              </div>
            </div>

            <div className="d-flex justify-content-between  mt-1">
              <Button
                id="minVolumeLabelId"
                color="link"
                className="text-nowrap p-0 text-bold text-sm-larger mr-2"
              >
                Min Principal Amount
                <InfoPopover
                  targetId="minVolumeLabelId"
                  placement="bottom"
                  title="Min Principal Amount"
                  desc={MIN_VOLUME_INFO}
                />
              </Button>
              <div className="text-nowrap font-weight-bold">
                {transformMillion(+tranche?.minVolume)}
              </div>
            </div>

            <div className="d-flex justify-content-between mt-1">
              <Button
                id="maxVolumeLabelId"
                color="link"
                className="text-nowrap p-0 text-bold text-sm-larger mr-2"
              >
                Max Principal Amount
                <InfoPopover
                  targetId="maxVolumeLabelId"
                  placement="bottom"
                  title="Max Principal Amount"
                  desc={MAX_VOLUME_INFO}
                />
              </Button>
              <div className="text-nowrap font-weight-bold">
                {transformMillion(+tranche?.maxVolume)}
              </div>
            </div>

            <div className="d-flex justify-content-between mt-1">
              <Button
                id="targetPriceLabelId"
                color="link"
                className="text-nowrap p-0 text-bold text-sm-larger mr-2"
              >
                Target Spread
                <TooltipItem
                  placement="top"
                  content="Hidden from the investors"
                >
                  <i className="text-xs ml-2 fa fa-key text-dark" />
                </TooltipItem>
                <InfoPopover
                  targetId="targetPriceLabelId"
                  placement="bottom"
                  title="Target Spread"
                  desc={TARGET_PRICE_INFO}
                />
              </Button>
              <div className="text-nowrap font-weight-bold">
                {`${tranche?.targetPriceBps} bps`}
              </div>
            </div>

            <div className="d-flex justify-content-between mt-1">
              <Button
                id="reservePriceLabelId"
                color="link"
                className="text-nowrap p-0 text-bold text-sm-larger mr-2"
              >
                Reserve Spread
                <TooltipItem
                  placement="top"
                  content="Hidden from the investors"
                >
                  <i className="text-xs ml-2 fa fa-key text-dark" />
                </TooltipItem>
                <InfoPopover
                  targetId="reservePriceLabelId"
                  placement="bottom"
                  title="Reserve Spread"
                  desc={RESERVE_PRICE_INFO}
                />
              </Button>
              <div className="text-nowrap font-weight-bold">
                {`${tranche?.reservePriceBps} bps`}
              </div>
            </div>

            <div className="d-flex justify-content-between mt-1">
              <Button
                id="guidancePriceLabelId"
                color="link"
                className="text-nowrap p-0 text-bold text-sm-larger mr-2"
              >
                Guidance Spread
                <InfoPopover
                  targetId="guidancePriceLabelId"
                  placement="bottom"
                  title="Guidance Spread"
                  desc={GUIDANCE_PRICE_INFO}
                />
              </Button>
              <div className="text-nowrap font-weight-bold">
                {`${tranche?.guidancePriceBps} bps`}
              </div>
            </div>

            <div className="d-flex justify-content-between mt-1">
              <Button
                id="bmLabelId"
                color="link"
                className="text-nowrap p-0 text-bold text-sm-larger mr-2"
              >
                Benchmark
                <InfoPopover
                  targetId="bmLabelId"
                  placement="bottom"
                  title="Benchmark"
                  desc={BENCHMARK_INFO}
                />
              </Button>
              <div className="text-nowrap font-weight-bold"></div>
            </div>

            <div className="d-flex flex-column mt-2 pt-1 border-top">
              <div
                className="w-100 d-flex justify-content-between align-items-center cursor-pointer"
                onClick={collapseRules}
              >
                <h6 className="text-sm-larger mb-0">
                  {tranche.numberOfRules} rule
                  {tranche.numberOfRules > 1 ? 's' : ''} out of 4
                  {tranche.numberOfRules > 1 ? ' are' : ' is'} defined
                </h6>

                {rulesCollapsed ? (
                  <i className="fas fa-angle-up pt-1"></i>
                ) : (
                  <i className="fas fa-angle-down pt-1"></i>
                )}
              </div>

              <Collapse isOpen={rulesCollapsed}>
                {/*min allocation*/}
                <div className="mt-1 pt-1">
                  <div className="d-flex justify-content-between">
                    <div className="text-nowrap text-bold mb-0">
                      Min Allocation Rule
                    </div>
                  </div>

                  {tranche.minAllocation !== 0 && tranche.minIncrement !== 0 ? (
                    <div className="mt-1">
                      <div className="d-flex justify-content-between">
                        <Button
                          id="minAllocLblId"
                          color="link"
                          className="text-nowrap p-0 text-bold text-sm-larger mr-2"
                        >
                          Min Allocation
                          <InfoPopover
                            targetId="minAllocLblId"
                            placement="bottom"
                            title="Min Allocation"
                            desc={MIN_ALLOC_INFO}
                            text={MIN_ALLOC_DEFAULT_INFO}
                          />
                        </Button>
                        <div className="text-nowrap font-weight-bold">
                          {transformMillion(+tranche.minAllocation)}
                        </div>
                      </div>
                      <div className="d-flex justify-content-between">
                        <Button
                          id="minAllocIncrLblId"
                          color="link"
                          className="text-nowrap p-0 text-bold text-sm-larger mr-2"
                        >
                          Min Increment
                          <InfoPopover
                            targetId="minAllocIncrLblId"
                            placement="bottom"
                            title="Min Increment"
                            desc={MIN_ALLOC_INCREMENT_INFO}
                            text={MIN_ALLOC_INCREMENT_DEFAULT_INFO}
                          />
                        </Button>
                        <div className="text-nowrap font-weight-bold">
                          {transformMillion(+tranche.minIncrement)}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-muted text-nowrap">Not specified</div>
                  )}
                </div>

                {/*preference allocation*/}
                <div className="mt-1 pt-1 border-top">
                  <div className="d-flex justify-content-between">
                    <div className="text-nowrap text-bold mb-0">
                      Preference Allocation Rule
                    </div>
                  </div>

                  {!tranche.preferenceConfig ? (
                    <div className="text-nowrap text-muted">Not specified</div>
                  ) : (
                    <div className="mt-1">
                      <div className="d-flex justify-content-between">
                        <Button
                          id="maxPreferenceAllowanceLbl"
                          color="link"
                          className="text-nowrap p-0 text-bold text-sm-larger mr-2"
                        >
                          Max Preference Allowance
                          <TooltipItem
                            placement="top"
                            content="Hidden from the investors"
                          >
                            <i className="text-xs ml-2 fa fa-key text-dark" />
                          </TooltipItem>
                          <InfoPopover
                            targetId="maxPreferenceAllowanceLbl"
                            placement="bottom"
                            title="Max Preference Allowance"
                            desc={MAX_PREF_ALLOWANCE_INFO}
                            text={MAX_PREF_ALLOWANCE_EXAMPLE_INFO}
                          />
                        </Button>
                        <div className="text-nowrap font-weight-bold">
                          {(
                            +tranche?.preferenceConfig
                              ?.overallocationAllowance / 100
                          ).toLocaleString(navigator.language, {
                            style: 'percent',
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </div>
                      </div>
                      <div className="d-flex justify-content-between">
                        <Button
                          id="preferenceWindowLbl"
                          color="link"
                          className="text-nowrap p-0 text-bold text-sm-larger mr-2"
                        >
                          Eligibility Window
                          <InfoPopover
                            targetId="preferenceWindowLbl"
                            placement="bottom"
                            title="Preference Eligibility Window"
                            desc={PREF_WINDOW_INFO}
                          />
                        </Button>
                        <div className="font-weight-bold text-nowrap">
                          {tranche?.preferenceConfig?.windowDurationInMins && (
                            <span className="d-inline-block ">
                              {tranche.preferenceConfig?.windowDurationInMins}{' '}
                              min
                            </span>
                          )}

                          {tranche?.preferenceConfig?.windowDurationInMins &&
                            tranche.preferenceConfig
                              ?.earlyEndTriggerCoverage && <span> or </span>}

                          {tranche?.preferenceConfig
                            ?.earlyEndTriggerCoverage && (
                            <span className="d-inline-block">
                              {
                                tranche.preferenceConfig
                                  ?.earlyEndTriggerCoverage
                              }
                              x coverage
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/*concentration limits*/}
                <div className="mt-1 pt-1 border-top">
                  <div className="d-flex justify-content-between">
                    <div className="mb-0 text-bold text-nowrap">
                      Concentration Limit Rules
                    </div>
                  </div>

                  {!tranche.concentrationConfig && (
                    <div className="text-muted text-nowrap">Not specified</div>
                  )}

                  {tranche?.concentrationConfig && (
                    <div className="mt-1">
                      <div className="d-flex justify-content-between">
                        <Button
                          id="singleInvestorLimitLbl"
                          color="link"
                          className="text-nowrap p-0 text-bold text-sm-larger mr-2"
                        >
                          Single Investor Max Allocation
                          <InfoPopover
                            targetId="singleInvestorLimitLbl"
                            placement="top"
                            title="Single Investor Max Allocation"
                            desc={TOP_1_MAX_INFO}
                          />
                        </Button>
                        <div className="text-nowrap font-weight-bold">
                          {(
                            +tranche?.concentrationConfig?.topOneAllocationMax /
                            100
                          ).toLocaleString(navigator.language, {
                            style: 'percent',
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </div>
                      </div>

                      {tranche?.concentrationConfig?.topNAllocationMax && (
                        <div className="d-flex justify-content-between">
                          <Button
                            id="topNInvestorLimitLbl"
                            color="link"
                            className="text-nowrap p-0 text-bold text-sm-larger mr-2"
                          >
                            Top {tranche?.concentrationConfig?.topNQualifier}{' '}
                            Investors Max Allocation
                            <InfoPopover
                              targetId="topNInvestorLimitLbl"
                              placement="top"
                              title={
                                'Top ' +
                                tranche?.concentrationConfig
                                  ?.topNAllocationMax +
                                ' Investors Max Allocation'
                              }
                              desc={TOP_N_MAX_INFO.replace(
                                '%N',
                                tranche?.concentrationConfig?.topNAllocationMax,
                              )}
                            />
                          </Button>
                          <div className="text-nowrap font-weight-bold">
                            {(
                              +tranche?.concentrationConfig?.topNAllocationMax /
                              100
                            ).toLocaleString(navigator.language, {
                              style: 'percent',
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/*volume increase*/}
                <div className="mt-1 pt-1 border-top">
                  <div className="d-flex justify-content-between">
                    <div className="text-nowrap mb-0 text-bold">
                      Principal Amount Increase Rules
                    </div>
                  </div>

                  {!tranche.volumeIncreaseConfig && (
                    <div className="text-muted">Not specified</div>
                  )}

                  {tranche?.volumeIncreaseConfig && (
                    <div className="mt-1">
                      <div className="d-flex justify-content-between">
                        <Button
                          id="thresholdSpreadLbl"
                          color="link"
                          className="text-nowrap p-0 text-bold text-sm-larger mr-2"
                        >
                          Threshold Spread
                          <TooltipItem
                            placement="top"
                            content="Hidden from the investors"
                          >
                            <i className="text-xs ml-2 fa fa-key text-dark" />
                          </TooltipItem>
                          <InfoPopover
                            targetId="thresholdSpreadLbl"
                            placement="bottom"
                            title="Threshold Spread"
                            desc={VOLUME_INCREASE_THRESHOLD_SPREAD_INFO}
                          />
                        </Button>
                        <div className="text-nowrap font-weight-bold">
                          {(+tranche?.volumeIncreaseConfig
                            ?.thresholdInBps).toLocaleString(
                            navigator.language,
                          )}{' '}
                          bps
                        </div>
                      </div>

                      <div className="d-flex justify-content-between">
                        <Button
                          id="increaseFactorLbl"
                          color="link"
                          className="text-nowrap p-0 text-bold text-sm-larger mr-2"
                        >
                          Increase Factor
                          <TooltipItem
                            placement="top"
                            content="Hidden from the investors"
                          >
                            <i className="text-xs ml-2 fa fa-key text-dark" />
                          </TooltipItem>
                          <InfoPopover
                            targetId="increaseFactorLbl"
                            placement="bottom"
                            title="Increase Factor"
                            desc={VOLUME_INCREASE_FACTOR_INFO}
                          />
                        </Button>
                        <div className="text-nowrap font-weight-bold">
                          {(
                            +tranche?.volumeIncreaseConfig?.increase / 100
                          ).toLocaleString(navigator.language, {
                            style: 'percent',
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Collapse>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
});

export default Tranche;

Tranche.propTypes = {
  tranche: PropTypes.instanceOf(Object),
  className: PropTypes.string,
};
