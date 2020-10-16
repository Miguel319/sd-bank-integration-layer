export class Estado {
  private static instance: Estado;
  private arriba: boolean;
  private tellerArriba: boolean;
  private ibArriba: boolean;

  private constructor() {
    this.arriba = true;
    this.tellerArriba = true;
    this.ibArriba = true;
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

  public setTellerArriba(tellerArriba: boolean): void {
    this.tellerArriba = tellerArriba;
  }

  public getTellerArriba(): boolean {
    return this.tellerArriba;
  }

  public setIbArriba(ibArriba: boolean): void {
    this.ibArriba = ibArriba;
  }

  public getIbArriba(): boolean {
    return this.ibArriba;
  }
}
