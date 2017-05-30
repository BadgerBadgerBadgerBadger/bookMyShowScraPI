'use strict'

import MoviesInCity from './MoviesInCity'

export async function getNowShowingInCity(cityId: string) {
  return (await getMoviesInCity(cityId)).getNowShowing()
}

export async function getComingSoon(cityId: string) {
  return (await getMoviesInCity(cityId)).getComingSoon()
}

async function getMoviesInCity(cityId: string): Promise<MoviesInCity> {

  const moviesInCity = new MoviesInCity(cityId)
  await moviesInCity.fetch()
  return moviesInCity
}
