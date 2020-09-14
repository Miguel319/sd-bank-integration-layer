export const validarMontoPrestamo = (
  montoNumber: number,
  prestamo: any
): string | undefined => {
  const cantidadTotalExcedida: boolean = montoNumber >= prestamo.total;
  const cantidadRestanteExcedida: boolean =
    montoNumber > prestamo.cantidad_restante;

  if (cantidadTotalExcedida || cantidadRestanteExcedida) {
    const customOp: string = cantidadTotalExcedida
      ? "cantidad total"
      : "cantidad restante";

    return `No puede exceder la ${customOp} del préstamo.`;
  }
};

export const realizarCalculosPrestamos = (
  montoNumber: number,
  prestamo: any
): void => {
  const updatePaid = prestamo.cantidad_saldada + montoNumber;
  const updateRemaining = prestamo.cantidad_total - updatePaid;

  prestamo.cantidad_saldada = updatePaid;
  prestamo.cantidad_restante = updateRemaining;
};


