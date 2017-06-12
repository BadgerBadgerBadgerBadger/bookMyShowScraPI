'use strict'

import * as moment from 'moment'

import { MovieTimings } from './MovieTimings'

export async function getShowTimings(cityId: string, movieId: string) {

  const movieTimings = new MovieTimings(cityId, movieId)
  await movieTimings.fetch(moment())

  return movieTimings.getShowTimings()
}
