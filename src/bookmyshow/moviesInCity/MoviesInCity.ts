'use strict'

import * as cheerio from 'cheerio'
import * as request from 'request-promise'
import * as _s from 'underscore.string'

import { strEnum } from 'utility'

export const MovieAvailability = strEnum([`now_showing`, `coming_soon`])
export type MovieAvailability = keyof typeof MovieAvailability

export interface MovieDetail {
  id: string,
  name: string,
  posterUrl: string,
  languages: string[],
  genres: string[]
}

export default class MoviesInCity {

  cityId: string

  nowShowingStatic: CheerioStatic
  nowShowingMovieCards: Cheerio

  comingSoonStatic: CheerioStatic
  comingSoonMovieCards: Cheerio

  constructor(cityId: string) {

    const self = this
    self.cityId = cityId


  }

  async fetch() {

    const self = this

    await Promise.all([ self.fetchNowShowing(), self.fetchComingSoon() ])

    return self
  }

  async fetchComingSoon() {

    const self = this

    const comingSoonPageResponse = await request(`https://in.bookmyshow.com/${self.cityId}/movies/comingsoon`)

    self.comingSoonStatic = cheerio.load(comingSoonPageResponse)
    self.comingSoonMovieCards = self.comingSoonStatic(`div.__col-now-showing`)
      .find(`.movie-card-container`)

    return self
  }

  async fetchNowShowing() {

    const self = this

    const nowShowingPageResponse = await request(`https://in.bookmyshow.com/${self.cityId}/movies`)

    self.nowShowingStatic = cheerio.load(nowShowingPageResponse)
    self.nowShowingMovieCards = self.nowShowingStatic(`div.__col-now-showing`)
      .find(`.movie-card-container`)

    return self
  }

  _getSectionDetails(sectionStatic: CheerioStatic, movieCards: Cheerio): MovieDetail[] {

    const self = this
    const all: MovieDetail[] = []

    movieCards.each(function (this: CheerioElement) {

      const movieCard = sectionStatic(this)

      const movieDetail: MovieDetail = {
        id: MoviesInCity._getMovieId(movieCard),
        posterUrl: MoviesInCity._getPosterUrl(movieCard),
        name: MoviesInCity._getName(movieCard),
        languages: self._getLanguages(sectionStatic, movieCard),
        genres: self._getGenres(sectionStatic, movieCard)
      }

      all.push(movieDetail)
    })

    return all
  }

  getNowShowing(): MovieDetail[] {
    return this._getSectionDetails(this.nowShowingStatic, this.nowShowingMovieCards)
  }

  getComingSoon(): MovieDetail[] {
    return this._getSectionDetails(this.comingSoonStatic, this.comingSoonMovieCards)
  }

  static _getPosterUrl(movieCard: Cheerio): string {

    const protocolAgnosticUrl = movieCard.find(`.poster-container-img > img`).data(`src`)
    /*
     The src is a protocol agnostic url with `//` as the leading characters. Let's remove those, add http and make this
     a proper http url.
     */
    return `http://${_s.ltrim(protocolAgnosticUrl, `//`)}`
  }

  static _getName(movieCard: Cheerio): string {
    return movieCard.find(`.detail > .__name.overflowEllipses > a`).attr(`title`)
  }

  static _getMovieId(movieCard: Cheerio): string {

    const movieUrl =  movieCard.find(`.detail > .__name.overflowEllipses > a`).attr(`href`)
    return _s.strRightBack(movieUrl, `/`)
  }

  _getLanguages(sectionStatic: CheerioStatic, movieCard: Cheerio): string[] {

    const languageList = movieCard.find(`.detail > .languages > .language-list > li`)
    const languages: string[] = []

    languageList.each(function (this: CheerioElement) {
      const languageElement = sectionStatic(this)
      languages.push(languageElement.text())
    })

    return languages
  }

  _getGenres(sectionStatic: CheerioStatic, movieCard: Cheerio): string[] {

    const genreList = movieCard.find(`.detail > .genre-list > a > div`)
    const genres: string[] = []

    genreList.each(function (this: CheerioElement) {
      const genreElement = sectionStatic(this)
      genres.push(genreElement.text())
    })

    return genres
  }
}
