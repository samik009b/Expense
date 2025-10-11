import { Response } from "express";

class ApiResponse {
  statusCode: number;
  data: unknown;
  message: string;
  success: boolean;

  constructor(statusCode: number, data: unknown, message: string = "success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }

  send(res: Response) {
    return res.status(this.statusCode).json({
      success: this.success,
      message: this.message,
      data: this.data
    });
  }
}

export default ApiResponse;
