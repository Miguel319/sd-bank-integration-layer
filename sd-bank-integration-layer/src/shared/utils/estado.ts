export class Estado {
  private static instance: Estado;
  private arriba: boolean;

  private constructor() {
    this.arriba = true;
  }

  public static getInstance(): Estado {
    if (!Estado.instance) Estado.instance = new Estado();

    return Estado.instance;
  }

  public setArriba(arriba: boolean): void {
    this.arriba = arriba;
  }

  public getArriba(): boolean {
    return this.arriba;
  }
}
