import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import { pipe } from 'fp-ts/function'
import * as t from 'io-ts'
import * as tt from 'io-ts-types'
import { Domain, Work } from '../../domain/index.open'
import { renderWork } from '../json-api/render-work'
import { Service } from '../service'
import { validateInput } from '../validate-input'

const paramsCodec = t.type({
  'filter[crossrefStatus]': tt.optionFromNullable(t.string),
})

type Params = t.TypeOf<typeof paramsCodec>

const by = (statusParam: Params['filter[crossrefStatus]']) => (work: Work) => pipe(
  statusParam,
  O.match(
    () => true,
    (filter) => work.frontMatter.crossrefStatus === filter,
  ),
)

const ignoreInvalidCrossrefResponse = (work: Work) => (
  !(work.frontMatter.crossrefStatus === 'not-determined' && work.frontMatter.reason === 'response-invalid')
)

const selectWorks = (queries: Domain) => (params: Params) => pipe(
  queries.allWorks(),
  RA.filter(by(params['filter[crossrefStatus]'])),
  RA.filter(ignoreInvalidCrossrefResponse),
)

const renderResults = (works: ReadonlyArray<Work>) => pipe(
  works,
  RA.map(renderWork),
  (resources) => ({ data: resources }),
)

export const getWorks = (queries: Domain): Service => (input) => pipe(
  input,
  validateInput(paramsCodec),
  E.map(selectWorks(queries)),
  E.map(renderResults),
)

