import { JestAssertionError, MatcherFunction } from 'expect'
import { AssertionCallback } from './types'
import { getError } from './getError'
import { evaluate } from './evaluate'

export const toThrowErrorWhich = function (value, assertionCallback) {
  if (this.isNot) {
    throw new JestAssertionError(
      'Negated `toThrowErrorWhich` not supported. Instead of using `.not`, ' +
      'perform the negation in your assertion callback.',
    )
  }

  const error = getError.call(this, value)

  return evaluate(error, assertionCallback)
} satisfies MatcherFunction<[AssertionCallback]>
