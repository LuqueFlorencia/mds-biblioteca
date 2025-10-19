export class AppError extends Error {
    constructor(message, { status = 500, code = 'INTERNAL_ERROR', details, cause } = {}) {
        super(message, { cause });
        this.name = this.constructor.name;
        this.status = status;
        this.code = code;
        this.details = details;
        Error.captureStackTrace?.(this, this.constructor);
    }
};


export class BadRequestError extends AppError {
    constructor(message = 'Bad Request', opts = {}) { 
        super(message, { status: 400, code: 'BAD_REQUEST', ...opts }); 
    }
};

export class ValidationError extends AppError {
    constructor(message = 'Validation Error', opts = {}) { 
        super(message, { status: 400, code: 'VALIDATION_ERROR', ...opts }); 
    }
};

export class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized', opts = {}) { 
        super(message, { status: 401, code: 'UNAUTHORIZED', ...opts }); 
    }
};

export class ForbiddenError extends AppError {
    constructor(message = 'Forbidden', opts = {}) { 
        super(message, { status: 403, code: 'FORBIDDEN', ...opts }); 
    }
};

export class NotFoundError extends AppError {
    constructor(message = 'Not Found', opts = {}) { 
        super(message, { status: 404, code: 'NOT_FOUND', ...opts }); 
    }
};

export class ConflictError extends AppError {
    constructor(message = 'Conflict', opts = {}) { 
        super(message, { status: 409, code: 'CONFLICT', ...opts }); 
    }
};
