export function errorHandler(err, req, res, next) {
    const status = Number(err?.status) || 500;
    const payload = {
        error: err?.message ?? 'Error interno del servidor.',
        code: err?.code || 'INTERNAL_ERROR',
    };

    if (err?.code) payload.code = err.code;
    if (err?.details) payload.details = err.details;

    //if (process.env.NODE_ENV !== 'production') payload.stack = err?.stack;

    return res.status(status).json(payload);
};