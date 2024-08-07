export type Authority = (requiredScope: string) => boolean

export const instantiate = (context: string | undefined): Authority => () => (
  context !== undefined
  && context !== ''
)

