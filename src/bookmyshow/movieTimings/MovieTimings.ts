'use strict'

import { Moment } from 'moment'
import * as cheerio from 'cheerio'
import * as request from 'request-promise'
import * as _s from 'underscore.string'

import Coords from 'utility/Coords'

interface Price {
  price: number,
  availability: string
}

interface ShowTiming {
  venueName: string,
  subRegionName: string,
  coords: Coords,
  hasMTicket: boolean,

  isPast: boolean,
  isSold: boolean,

  bookingPath: string,
  time: {
    code: number,
    readable: string,
    cutOff: number
  },

  prices: Price[],
  seatsPercent: number
}

export class MovieTimings {

  cityId: string
  movieId: string

  showTimingsPageStatic: CheerioStatic
  venueList: Cheerio

  constructor(cityId: string, movieId: string) {
    this.cityId = cityId
    this.movieId = movieId
  }

  async fetch(date: Moment): Promise<MovieTimings> {

    date.locale(`Asia/Kolkata`)

    const moviePage = await request(`https://in.bookmyshow.com/${this.cityId}/movies/baahubali-2-the-conclusion/${this.movieId}`)
    const moviePageStatic = cheerio.load(moviePage)

    const showTimingsUrl = moviePageStatic(`div.more-showtimes > a`).attr(`href`)
    // Strip the last part of the path (the date part) and apply the desired date formatted to the correct string.
    const dateAppliedShowTimingsUrl = `https://in.bookmyshow.com${_s.strLeftBack(showTimingsUrl, `/`)}/${date.format(`YYYYMMDD`)}`

    const showTimingsPage = await request(dateAppliedShowTimingsUrl)
    this.showTimingsPageStatic = cheerio.load(showTimingsPage)
    this.venueList = this.showTimingsPageStatic(`#venuelist > li`)

    return this
  }

  getShowTimings(): ShowTiming[] {

    const self = this

    const showTimings: ShowTiming[] = []

    this.venueList.each(function (this: CheerioElement) {

      const showTiming = self.showTimingsPageStatic(this)

      const venueName: string = showTiming.data(`name`)
      const subRegionName: string = showTiming.data(`sub-region-name`)
      const coords: Coords = new Coords(showTiming.data(`lat`), showTiming.data(`lng`))
      const hasMTicket: boolean = showTiming.data(`has-mticket`) === `true`

      const timings = showTiming.find(`div.body > div`)

      timings.each(function (this: CheerioElement) {

        const timing = self.showTimingsPageStatic(this)
        const timingDeep = timing.find(`a`)

        showTimings.push({
          venueName,
          subRegionName,
          coords,
          hasMTicket,

          isPast: timing.hasClass(`_past`),
          isSold: timing.hasClass(`_sold`),

          bookingPath: timingDeep.attr(`href`),
          time: {
            code: parseInt(timingDeep.data(`showtime-code`)),
            readable: timingDeep.data(`display-showtime`) as string,
            cutOff: parseInt(timingDeep.data(`cut-off-date-time`))
          },

          prices: MovieTimings._getPrices(timingDeep),
          seatsPercent: timingDeep.data(`seats-percent`) as number
        })
      })
    })

    return showTimings
  }

  static _getPrices(timingDeep: Cheerio): Price[] {

    const prices = timingDeep.data(`cat-popup`)

    if (!prices) {
      return []
    }

    return prices.map((price: any) => {
      return {
        price: price.price,
        availability: price.availabilityText
      }
    })
  }
}
