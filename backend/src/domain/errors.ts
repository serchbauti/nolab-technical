export class BadRequestError extends Error {
    status = 400 as const;
    constructor(message: string) { super(message); this.name = 'BadRequestError'; }
  }
  export class ConflictError extends Error {
    status = 409 as const;
    constructor(message: string, public payload?: unknown) { super(message); this.name = 'ConflictError'; }
  }
  