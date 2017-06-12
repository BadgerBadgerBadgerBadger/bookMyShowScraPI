'use strict'

import * as express from 'express'
const router = express.Router({mergeParams: true})

import { getShowTimings, getComingSoon, getNowShowingInCity } from 'bookmyshow'

/**
 * Get movies currently playing in the target city.
 */
router.get(`/movie/:city_id/now_showing`, (req, res) => {
  (async function () {

    const cityId = req.params.city_id
    return getNowShowingInCity(cityId)
  })()
    .then(result => res.json(result))
})

/**
 * Get movies coming soon to the target city.
 */
router.get(`/movie/:city_id/coming_soon`, (req, res) => {
  (async function () {

    const cityId = req.params.city_id
    return getComingSoon(cityId)
  })()
    .then(result => res.json(result))
})

/**
 * Get the show timings for a given movie in a given city.
 */
router.get(`/movie/:city_id/:movie_id`, (req, res) => {
  (async function () {

    const cityId = req.params.city_id
    const movieId = req.params.movie_id

    return getShowTimings(cityId, movieId)
  })()
    .then(result => res.json(result))
})

export default router
