
// `any` because Jest's `expect` does not work well with TypeScript. For example,
// `expect(error).toBeInstanceOf(Error)` does not inform TS that `error` is an instance of `Error`,
// so TS still sees it as type `unknown` and doesn't allow you to e.g. access `error.message`.
import { ExpectationResult } from 'expect'

export type AssertionCallback = (error: any) => AssertionCallbackResult | Promise<AssertionCallbackResult>
export type AssertionCallbackResult = ExpectationResult | boolean | void

interface ToThrowErrorWhich<R> {
  /**
   * Allows you to perform any number of any kind of assertions on a thrown error / value from a rejected promise.
   *
   * @param {AssertionCallback} assertionCallback - you can perform assertions inside this function
   * or return a boolean or ExpectationResult saying if the error is as expected
   *
   * @example
   * expect(() => crashTheUniverse()).toThrowErrorWhich(error => {
   *     expect(error).toBeInstanceOf(UnsufficientForceError)
   *     expect(error).toHaveProperty('appliedForce', '100 N')
   * })
   *
   * @example
   * expect(crashTheUniverseAsync()).rejects.toThrowErrorWhich(error => ({
   *     pass: isAxiosError(error) && error.response?.status === 400,
   *     message: () => `Expected an error caused by the 400 response code, got ${error}.`,
   * })
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
