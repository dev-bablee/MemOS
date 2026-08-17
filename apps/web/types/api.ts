export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: unknown;
    correlationId?: string;
    timestamp?: string;
  };
  pagination?: {
    total: number;
    limit: number;
    offset: number;
  };
}
