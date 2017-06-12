'use strict'

import MoviesInCity from './MoviesInCity'

async function getMoviesInCity(cityId: string): Promise<MoviesInCity> {

  const moviesInCity = new MoviesInCity(cityId)
  await moviesInCity.fetch()
  return moviesInCity
}

export async function getAllMovies(cityId: string, limit = 20) {

  const moviesInCity = await getMoviesInCity(cityId)

  return {
    nowShowing: moviesInCity.getNowShowing().slice(0, limit),
    comingSoon: moviesInCity.getComingSoon().slice(0, limit)
  }
}

export async function getNowShowingInCity(cityId: string, limit = 20) {

  const moviesInCity = new MoviesInCity(cityId)
  await moviesInCity.fetchNowShowing()

  return moviesInCity.getNowShowing().slice(0, limit)
}

export async function getComingSoon(cityId: string, limit = 20) {

  const moviesInCity = new MoviesInCity(cityId)
  await moviesInCity.fetchComingSoon()

  return moviesInCity.getComingSoon().slice(0, limit)
}
