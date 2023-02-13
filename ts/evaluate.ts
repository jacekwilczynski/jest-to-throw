import { AssertionCallback } from './types'
import { AsyncExpectationResult } from 'expect'

/**
 * @param error the thing that was thrown / the value from a rejected promise
 * @param assertionCallback a function that will check if the error matches expectations
 */
export async function evaluate(error: unknown, assertionCallback: AssertionCallback): AsyncExpectationResult {
  try {
    const result = await assertionCallback(error)

    if (typeof result === 'object') {
      // assertion callback returned whole ExpectationResult -> return it
      return result
    }

    // assertion callback returned boolean or undefined -> prepare an ExpectationResult
    return {
      pass: result ?? true,
      message: () => 'The error did not match the provided condition.',
    }
  } catch (error: any) {
    // assertion callback threw an error -> convert it to an ExpectationResult
    const message = error?.matcherResult?.message

    return {
      pass: false,
      message: () => message ?? `Unexpected error from assertion callback: ${error}.`,
    }
  }
}
