const STORAGE_KEY = 'kakeibo-records';

const form = document.querySelector('.form-grid');
const tbody = document.querySelector('.data-table tbody');
const totalAmount = document.querySelector('.summary strong');

function readRecords() {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (!savedData) {
      return [];
    }

    const parsed = JSON.parse(savedData);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('データの読み込みに失敗しました:', error);
    return [];
  }
}

function saveRecords(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function formatCurrency(value) {
  return `${Number(value).toLocaleString()}円`;
}

function renderSummary(records) {
  const total = records.reduce((sum, record) => {
    const amount = Number(record.amount) || 0;
    return record.type === 'income' ? sum + amount : sum - amount;
  }, 0);

  totalAmount.textContent = formatCurrency(total);
}

function renderTable(records) {
  if (!records.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4">データがありません</td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = records
    .map((record) => {
      const typeLabel = record.type === 'income' ? '収入' : '支出';
      return `
        <tr>
          <td>${record.date}</td>
          <td>${record.item}</td>
          <td>${typeLabel}</td>
          <td>${formatCurrency(record.amount)}</td>
        </tr>
      `;
    })
    .join('');
}

function renderApp() {
  const records = readRecords();
  renderTable(records);
  renderSummary(records);
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const date = formData.get('date');
  const item = formData.get('item').toString().trim();
  const type = formData.get('type');
  const amount = Number(formData.get('amount'));

  if (!date || !item || !type || Number.isNaN(amount) || amount <= 0) {
    alert('日付・品目・金額を正しく入力してください。');
    return;
  }

  const records = readRecords();
  records.push({
    date,
    item,
    type,
    amount,
  });

  saveRecords(records);
  renderApp();
  form.reset();
});

window.addEventListener('DOMContentLoaded', () => {
  renderApp();
});
