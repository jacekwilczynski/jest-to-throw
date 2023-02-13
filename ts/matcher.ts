import { JestAssertionError, MatcherFunction } from 'expect'
import { AssertionCallback } from './types'
import { getError } from './getError'
import { evaluate } from './evaluate'

export const toThrowErrorWhich = async function (value, assertionCallback) {
  if (this.isNot) {
    throw new JestAssertionError(
      'Negated `toThrowErrorWhich` not supported. Instead of using `.not`, ' +
      'perform the negation in your assertion callback.',
    )
  }

  const error = await getError.call(this, value)

  return await evaluate(error, assertionCallback)
} satisfies MatcherFunction<[AssertionCallback]>
