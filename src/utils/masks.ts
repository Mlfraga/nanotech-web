export function currencyMasker(e: React.FormEvent<HTMLInputElement>) {
  let { value } = e.currentTarget;

  value = value.replace(/\D/g, '');
  value = value.replace(/(\d)(\d{2})$/, '$1.$2');
  value = value.replace(/(\d)(\d{2})$/, '$1.$2');
  value = value.replace(/(?=(\d{3})+(\D))\B/g, '');

  e.currentTarget.value = value;
  return e;
}

export function documentMask(value: string) {
  try {
    if (value && value.length) {
      const docValue = value.replace(/[/,.,-]/g, '');
      // MASK CPF / CNPJ
      if (docValue.length <= 14) {
        if (docValue.length > 12) {
          // cnpj  `##.###.###/####-##`
          const cnpj = /^([\d]{2})\.*([\d]{3})\.*([\d]{3})\/*([\d]{4})\.*([\d]{2})/;
          return docValue.replace(cnpj, '$1.$2.$3/$4-$5');
        }
        // cpf `###.###.###-##`
        const cpf = /([\d]{3})\.*([\d]{3})\.*([\d]{3})-*([\d]{2})/;

        return docValue.replace(cpf, '$1.$2.$3-$4');
      }

      return value;
    }

    return value;
  } catch {
    return value;
  }
}
