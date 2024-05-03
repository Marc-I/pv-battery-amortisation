
export interface iResponse<T, U> {
  request: T|null|undefined;
  response: U;
  frontendStart: number;
  backendStart: number;
  backendEnd: number;
  frontendEnd: number;
}
