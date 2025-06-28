import { defineMock } from 'vite-plugin-mock-dev-server'
import { createReadStream } from 'node:fs'

export default [
  defineMock({
    url: '/static',
    status: 500,
  }),
  defineMock({
    url: '/static/secret/json/xflsCurriculumVitaeData.json',
    type: 'xflsCurriculumVitaeData.json',
    body: () => createReadStream('mock/assets/json/xflsCurriculumVitaeData.json'),
  }),
  defineMock({
    url: '/static/public/json/xflsCurriculumVitaeData.json',
    type: 'xflsCurriculumVitaeData.json',
    body: () => createReadStream('mock/assets/json/xflsCurriculumVitaeData.json'),
  }),
  defineMock({
    url: '/static/font/FZKTK.TTF',
    type: 'FZKTK.TTF',
    body: () => createReadStream('public/static/font/FZKTK.TTF'),
  }),
  defineMock({
    url: '/static/font/FZ_KAITI_ZH_HANS.woff2',
    type: 'FZ_KAITI_ZH_HANS.woff2',
    body: () => createReadStream('public/static/font/FZ_KAITI_ZH_HANS.woff2'),
  }),
  defineMock({
    url: '/static/json/publicWebUiData.json',
    type: 'publicWebUiData.json',
    body: () => createReadStream('mock/assets/json/publicWebUiData.json'),
  }),
]
