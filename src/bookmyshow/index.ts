'use strict'

import {getComingSoon, getNowShowingInCity} from 'bookmyshow/moviesInCity'
import {getShowtimings} from 'bookmyshow/movieTimings'

export async function getMoviesInCity(cityId: string, limit: number) {
  return {
    nowShowing: (await getNowShowingInCity(cityId)).slice(0, limit),
    comingSoon: (await getComingSoon(cityId)).slice(0, limit)
  }
}

export function getShowtimesForMovie(cityId: string, movieId: string) {
  return getShowtimings(cityId, movieId)
}
