import { MoodyRatings } from './ratings';

const RatingRangeOptions = [
  ...MoodyRatings.map((r) => ({ ...r, label: r.rating, value: r.rank })),
];

export default RatingRangeOptions;
