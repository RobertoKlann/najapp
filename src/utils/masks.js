export function applyCpfMask(text) {
  let newText = text.replace(/(\d{3})(\d)/, '$1.$2');

  newText = newText.replace(/(\d{3})(\d)/, '$1.$2');

  newText = newText.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

  return newText;
}

export function applyMoneyMask(value) {
  return `R$ ${applyNumberMask(value)}`;
}

export function applyNumberMask(value) {
  let newText = String(parseFloat(value).toFixed(2)).replace('.', ',');

  newText = newText.replace(/\d(?=(\d{3})+,)/g, '$&.');

  return newText;
}
