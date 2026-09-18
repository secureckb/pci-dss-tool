import express from 'express';

const METHODS = ['get', 'post', 'put', 'patch', 'delete', 'use'];

/**
 * An Express 4 router whose handlers may be async.
 *
 * Express 4 does not await handler return values, so a rejected promise (a
 * database outage, for example) becomes an unhandled rejection and the request
 * hangs until the client times out. This forwards rejections to next(err) so
 * they reach the error handler and return a response.
 *
 * Handlers with four parameters are error handlers and are left alone.
 */
export function asyncRouter() {
  const router = express.Router();

  for (const method of METHODS) {
    const original = router[method].bind(router);
    router[method] = (...args) =>
      original(
        ...args.map((arg) =>
          typeof arg === 'function' && arg.length < 4
            ? (req, res, next) => Promise.resolve(arg(req, res, next)).catch(next)
            : arg
        )
      );
  }

  return router;
}
