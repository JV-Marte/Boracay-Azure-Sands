/** Error with an HTTP status, thrown by services and mapped in API routes. */
export class ServiceError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "ServiceError";
    this.status = status;
  }
}

export function toErrorResponse(error: unknown): { message: string; status: number } {
  if (error instanceof ServiceError) {
    return { message: error.message, status: error.status };
  }
  console.error("Unexpected service error:", error);
  return {
    message: "Something went wrong on our end. Please try again in a moment.",
    status: 500,
  };
}
