// export const PREF_REASON = 'Preference Allocation defines issuer\'s ability to influence early and strong bids by offering the investor an additional allocation based on how close their bid is to the target price.';

export const PRINCIPAL_VOLUME_INFO =
  'The proceeds issuer is targeting to raise for a given maturity. The principal amount is typically represented as a range between minimum and maximum amounts. In some instances, the issuer could elect not to disclose the maximum amount.';
export const MIN_BID_INFO =
  'Minimum amount below which there will be no allocation for the qualified bid.';
export const MIN_BID_INCREMENT_INFO = 'Minimum amount of allocation increment.';
export const TOP_1_MAX_INFO =
  'Maximum allocation for a given maturity a single investor is eligible for. This value can change during the auction.';
export const TOP_N_MAX_INFO =
  'Maximum allocation for a given maturity top %N investors are eligible for. This value can change during the auction.';
export const PREF_ALLOC_INFO =
  "The issuer set a preference allotment for the bidders who within the eligibility window. The preference amount allocated to the bidder depends on the bid amount and bid spread. The tighter the bid spread is, the larger preference allocation is. The preference allocation is not guaranteed if the investor's bid spread is outside of the tranche's clearing spread.";
export const PREF_ALLOC_EARLY_END_TRIGGER_INFO =
  'The issuer elected to close the preference window early if a certain coverage amount is reached.';
export const MAX_PRINCIPAL_AMT_INFO =
  'Maximum principal amount offered across all maturity tranches.';
export const YOUR_BEST_BID_SPREAD_INFO =
  'The tightest bid spread you submitted to qualify for an allocation.';
export const YOUR_BID_AMT_INFO = 'Your qualifying bid amount.';
export const YOUR_AT_ALLOC_BID_SPREAD_INFO =
  'The spread used to calculate your allocation. This value would be worse than or equal to your tightest bid spread.';
export const YOUR_FINAL_PREF_ALLOC_AMT_INFO =
  'The final amount allocated to you due to bidding within the preference eligibility window.';
export const YOUR_FINAL_LIMIT_ADJ_AMT_INFO =
  'The final amount of allocation adjustment due to the imposition of the issuer specified concentration limits.';
export const YOUR_FINAL_TOTAL_ALLOC_AMT_INFO =
  'The final amount of your total allocation. This amount includes the preference allocation and adjusted for concentration limit.';
export const TOTAL_PROCEEDS_INFO =
  'The total amount issuer raised for a given maturity tranche.';
export const COUPON_RATE_INFO1 =
  'Rate of interest paid by the issuer to the allocated investors.';
export const COUPON_RATE_INFO2 =
  'Coupon Rate = Benchmark Fix Rate + Clearing Spread';
export const CLEARING_SPREAD_INFO =
  'Worst bid level at which an investor is allocated (fully or partially).';
export const BENCHMARK_FIX_RATE_INFO =
  "Rate of the tranche's benchmark instrument captured during the spotting process.";
export const TOTAL_BID_VOLUME_INFO =
  'Total investor bid amount at any spread level for a given maturity tranche.';
export const BID_RANGE_INFO =
  'The summary spread range between the 2nd and 4th quintile (20-80%), based on the empirical weighted cumulative distribution of all bids.';
export const YOUR_AT_ALLOC_BID_SPREAD_ROUND_1_INFO =
  'The spread used to calculate your allocation.';
export const YOUR_AT_ALLOC_BID_SPREAD_ROUND_2_INFO =
  'The spread used to calculate your allocation. This value would be worse than or equal to your tightest bid spread.';
export const YOUR_BID_AMT_ROUND_1_INFO =
  'The amount used to calculate your allocation.';
export const YOUR_BID_AMT_ROUND_2_INFO =
  'The amount used to calculate your allocation.';
export const YOUR_PROJECTED_PREF_ALLOC_AMT_INFO =
  "The projected amount to be allocated to you due to bidding within the preference eligibility window. The preference allocation is not guaranteed if the your bid spread is outside of the tranche's clearing spread.";
export const YOUR_PROJECTED_LIMIT_ADJ_AMT_INFO =
  'The projected amount of allocation adjustment due to the imposition of the issuer specified concentration limits.';
export const YOUR_PROJECTED_TOTAL_ALLOC_AMT_INFO =
  'The projected amount of your total allocation. This amount includes the preference allocation and adjusted for concentration limit.';
export const BID_SPREAD_ROUND_1_INFO =
  'Spread in bps over the treasury benchmark instrument investor is willing to bid to qualify to the final round of the auction. The investor has only two attempts to qualify for the final round. The bid spread can only tighten throughout the auction.';
export const BID_SPREAD_ROUND_2_INFO =
  'The tightest spread in bps over the treasury benchmark instrument investor is willing to bid to qualify for an allocation. The bid spread will not be revealed to the issuer and used by the CapConnect+ algorithms to automatically allocate the investor.';
export const BID_AMT_ROUND_INFO =
  'The amount of bonds of a particular maturity investor is looking to buy. The bid amount can only increase throughout the auction.';
export const GUIDANCE_PRICE_INFO =
  'Initial guidance spread over the benchmark to the investors. Equivalent to Bloomberg® Initial Price Talk (IPT).';
export const BENCHMARK_INFO =
  'An instrument that provides a standard against which the pricing and coupon fixing is communicated and calculated.';
export const SINGLE_BID =
  'Bidder bids a single amount regardless of what the running spread of maturity tranche ends up at. Once a bid is submitted, the amount can only be increased throughout the duration of the auction.';
export const LADDER_BID =
  'Bidder specifies multiple amounts at various maturity tranche spread levels as part of the bid. For example, the bidder can specify an amount of $50 mil if the tranche spread is at 105 bps or $30 mil if it improves to 102 bps. The system will automatically adjust the bid amount to $30 mil if the tranche spread hits 102 bps or below.';
export const TIGHTEST_SPREAD = 'tightestSpread desc';
export const LADDER_BID_AMOUNT =
  "An amount that will be used to calculate your allocation if the tranche's clearing price is wider than the spread for a particular level.";
export const LADDER_TRIGGER_SPREAD =
  "A spread that will be activated for a particular ladder level if the tranche's clearing price is wider.";

export const PREF_REASON =
  "Preference Allocation defines issuer's ability to influence early and strong bids by offering the investor an additional allocation based on how close their bid is to the target price.";

export const COUPON_TYPE_INFO =
  'Fixed coupon is for a fixed rate US corporate bond and floating coupon is for a floating rate US corporate bond based on an index';
export const TARGET_VOLUME_INFO =
  'The target proceeds for the given maturity tranche. Target principal amount is not communicated to the investors and can be increased up to the maximum principal amount while the auction is in progress.';
export const MIN_VOLUME_INFO =
  'The minimum proceeds for the given maturity tranche. Minimum principal amount is communicated to the investors and cannot be modified after the auction start.';
export const MAX_VOLUME_INFO =
  'The maximum proceeds for the given maturity tranche. Maximum principal amount is communicated to the investors and cannot be modified after the auction start.';
export const TARGET_PRICE_INFO =
  'Spread over the benchmark issuer is targeting for the given maturity tranche. This value drives the features of allocation model. Target spread is not communicated to the investors.';
export const RESERVE_PRICE_INFO =
  'The maximum spread over the benchmark the issuer will consider as qualifying. Investor bids above the reserve spread will not qualify for the second round. Reserve spread is not communicated to the investors.';
export const ISSUE_DATE_INFO = 'The date on which issue will be priced.';
export const ISSUE_CURRENCY_INFO =
  'Issuance currency of the maturity tranches.';
export const ISSUE_MAX_VOLUME_INFO =
  'Maximum principal amount offered across all maturity tranches.';
export const BENCHMARK_SPOTTING_START_INFO =
  'Start of benchmark spotting window relative to the end of the final allocation in minutes. Final allocation is computed immediately after the end of the final round.';
export const BENCHMARK_SPOTTING_WINDOW_INFO =
  'A time span in minutes during which the coupon fixing will occur.';
export const BENCHMARK_PROVIDER_INFO =
  'Provider of the real-time benchmark curve used for coupon fixing.';
export const IS_ALLOW_HEDGE_FUNDS_INFO =
  'Indicates if hedge funds are allowed to participate in the pricing of the given issuance maturity tranche. This setting is not communicated to the investors.';
export const IS_ALLOW_CANCEL_TRANCHE_INFO =
  'Indicates if the issuer can cancel the maturity tranche if the minimum principal amount is not satisfied.';
export const MIN_ALLOC_INFO =
  'Minimum amount below which there will be no allocation for the qualified bid.';
export const MIN_ALLOC_DEFAULT_INFO = 'Default value is $1 mil.';
export const MIN_ALLOC_INCREMENT_INFO =
  'Minimum amount of allocation increment, i.e. round lot.';
export const MIN_ALLOC_INCREMENT_DEFAULT_INFO = 'Default value is $0.1 mil.';
export const MAX_PREF_ALLOWANCE_INFO =
  "Specifies the maximum percentage of tranche's target principal amount allocated for the preference pool to the bidders who bid within the eligibility window. The investors will see the absolute value of the preference pool.";
export const MAX_PREF_ALLOWANCE_EXAMPLE_INFO =
  'For example, if the maximum preference allowance is 30% of a $ 1 billion tranche, the investors will see the preference pool of $300 mil.';
export const PREF_WINDOW_INFO =
  'Eligibility window defines a period during which investor bids are preference allocation eligible. Early-end trigger would close the preference eligibility window if the specified coverage was reached. If the early end coverage is specified, it will not be communicated to the investor.';
export const VOLUME_INCREASE_THRESHOLD_SPREAD_INFO =
  'Threshold spread defines a spread level at which each bps improvement will result in the target principal amount increase. The target principal amount does not increase if the tranche spread equals the threshold spread. Threshold spread is not communicated to the investors.';
export const VOLUME_INCREASE_FACTOR_INFO =
  'Increase factor defines a percentage increase of the target principal amount for each bps spread improvement under the threshold spread. Increase factor is not communicated to the investors.';
export const QUALIFIED_BID_VOLUME_INFO =
  "Total investor bid amount at or tighter the tranche's reserve spread";
export const QUALIFIED_COVERAGE_INFO1 = 'Tranche coverage.';
export const QUALIFIED_COVERAGE_INFO2 =
  'Tranche Coverage = Qualified Bids / Target Principal Amount';
export const SPREAD_INFO =
  'Worst bid level at which an investor is allocated (fully or partially).';
export const PREF_ALLOCATION_INFO =
  'Total amount of allocation attributed to the investors eligible for the preference.';
export const BID_ALLOCATION_INFO =
  'Total amount of allocation attributed to the investors with a competitive bid.';
export const LIMIT_ADJUSTMENT_INFO =
  'Total amount of allocation reduction due to concentration limits imposition.';
export const ROUNDING_ADJUSTMENT_INFO = 'Total rounding adjustment.';
export const TOTAL_ALLOCATION_INFO1 =
  'Total amount of allocation to the qualified bidders.';
export const TOTAL_ALLOCATION_INFO2 =
  'Total Allocation = Bid Allocation + Preference Allocation - Limit Adjustment. The value is rounding adjusted.';
export const PREF_WINDOW_COUNTER_INFO =
  'Time span during which a qualified bid is eligible for the preference allocation.';
export const PREF_WINDOW_VOLUME_INFO =
  'Total qualified bids submitted while the preference window is open.';
export const TOP_1_ALLOCATION_PERCENT_INFO =
  'Total allocation percentage of an investor with the highest stake in the tranche.';
export const TOP_N_ALLOCATION_PERCENT_INFO =
  'Total allocation percentage of top %N investors in the tranche';
