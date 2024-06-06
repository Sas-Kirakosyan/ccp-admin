import referenceStore from '../stores/referenceStore';

export async function getRatingsWithNames(ratingsArray) {
  const ratings = await Promise.all(
    ratingsArray.map(async (rating) => {
      const findRating = await referenceStore.findRating(rating.ratingId);
      if (findRating) {
        return { ratingName: findRating.ratingName, ...rating };
      } else {
        return rating;
      }
    }),
  );

  ratings.sort((a, b) => b.ratingDate - a.ratingDate);

  return ratings;
}
