import { JestAssertionError, MatcherContext } from 'expect'

/**
 * @returns
 *   - if the value is a callback that throws -> the value that was thrown by the callback
 *   - if the value is a callback that returns a rejected promise -> the value from that promise
 *   - if the value is a promise -> the value from that promise
 *
 * @throws JestAssertionError
 *   - if the callback didn't throw
 *   - if the value is not a callback and the expectation is not that of a rejected promise
 */
export async function getError(this: MatcherContext, value: unknown): Promise<unknown> {
  if (typeof value === 'function') {
    try {
      await value()
    } catch (error) {
      // return the error thrown by the callback
      return error
    }

    throw new JestAssertionError(`Callback did not throw.`)
  }

  if (this.promise !== 'rejects') {
    throw new JestAssertionError(
      'This matcher can only be used to test callbacks ' +
      'and promises that are expected to be rejected.',
    )
  }

  // return the value from the rejected promise
  return value
}
