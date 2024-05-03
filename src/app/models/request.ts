
export class Request<T> {
  request: T;
  frontendStart: number;
  backendStart: number;
  backendEnd: number;
  frontendEnd: number;

  constructor(request: T) {
    this.frontendStart = Date.now();
    this.request = request;
  }
}
