export default function formatMoney(value: number) {
  try {
    return Number(value).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  } catch (e) {
    return value.toString();
  }
}
