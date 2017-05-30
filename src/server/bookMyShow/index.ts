'use strict'

import * as express from 'express'
const router = express.Router({mergeParams: true})

import { MovieAvailability } from 'bookmyshow/moviesInCity/MoviesInCity'
import { getComingSoon, getNowShowingInCity } from 'bookmyshow/moviesInCity'

router.get('/movie/:city_id/:movie_availabilty', (req, res) => {
  (async function () {

    const cityId = req.params.city_id
    const movieAvailability: MovieAvailability = req.params.movie_availabilty

    if (movieAvailability === MovieAvailability.now_showing) {
      return getNowShowingInCity(cityId)
    }

    if (movieAvailability === MovieAvailability.coming_soon) {
      return getComingSoon(cityId)
    }
  })()
    .then(result => res.json(result))
})

export default router
