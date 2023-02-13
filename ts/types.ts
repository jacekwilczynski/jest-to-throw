import { ExpectationResult } from 'expect'

// `any` because Jest's `expect` does not work well with TypeScript. For example,
// `expect(error).toBeInstanceOf(Error)` does not inform TS that `error` is an instance of `Error`,
// so TS still sees it as type `unknown` and doesn't allow you to e.g. access `error.message`.
export type AssertionCallback = (error: any) => AssertionCallbackResult | Promise<AssertionCallbackResult>
export type AssertionCallbackResult = ExpectationResult | boolean | void

interface ToThrowErrorWhich<R> {
  /**
   * Allows you to perform any number of any kind of assertions on a thrown error / value from a rejected promise.
   *
   * @param {AssertionCallback} assertionCallback - you can perform assertions inside this function
   * or return a boolean or ExpectationResult (or a Promise resolving to boolean or ExpectationResult)
   * saying if the error is as expected
   *
   * @example - expecting an error to be thrown; assertion callback contains standalone assertions
   * expect(() => crashTheUniverse()).toThrowErrorWhich(error => {
   *     expect(error).toBeInstanceOf(InsufficientForceError)
   *     expect(error).toHaveProperty('appliedForce', '100 N')
   * })
   *
   * @example - expecting promise rejection; assertion callback returns ExpectationResult
   * expect(crashTheUniverseAsync()).rejects.toThrowErrorWhich(error => ({
   *     pass: isAxiosError(error) && error.response.status === 400,
   *     message: () => `Expected an error caused by the 400 response code, got ${error}.`,
   * })
   *
   * @example - expecting promise rejection; assertion callback returns boolean (default message will be used)
   * expect(crashTheUniverseAsync()).rejects.toThrowErrorWhich(
   *     error => isAxiosError(error) && error.response.status === 400
   * )
   */
  toThrowErrorWhich(assertionCallback: AssertionCallback): R
}

// for @jest/globals
declare module 'expect' {
  interface AsymmetricMatchers extends ToThrowErrorWhich<void> {
  }

  interface Matchers<R> extends ToThrowErrorWhich<R> {
  }
}

// for @types/jest
declare global {
  namespace jest {
    interface Matchers<R> extends ToThrowErrorWhich<R> {
    }

    interface Expect extends ToThrowErrorWhich<unknown> {
    }
  }
}
