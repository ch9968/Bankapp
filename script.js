'use strict';

const account1 = {
  owner: '이찬희',
  username: 'chanhee',
  movements: [20000, 45000, -40000, 3000, -6500, -13000, 70000, 1300],
  interestRate: 1.2,
  pin: 1111,
};

const account2 = {
  owner: '김찰리',
  username: 'charlie',
  movements: [50000, 3400, -15000, -79000, -32100, -1000, 85000, -3000],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: '스티브',
  username: 'steve3333',
  movements: [21000, -20000, 34000, -3000, -20000, 55000, 4400, -4600],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: '김사라',
  username: 'sara2222',
  movements: [43000, 10000, -7000, 50000, -9800],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

/////////////////////////////////////////////////

const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${
      type === 'deposit' ? '입금' : '출금'
    }</div>
        <div class="movements__value">${mov}₩</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}₩`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}₩`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}₩`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}₩`;
};

const updateUI = function (acc) {
  // 내역 보기
  displayMovements(acc.movements);

  // 잔고 보기
  calcDisplayBalance(acc);

  // 요약화면 보기
  calcDisplaySummary(acc);
};

// 이벤트 핸들러
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // 자동 들어가기 방지
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `환영합니다, ${currentAccount.owner}님`;
    containerApp.style.opacity = 100;

    // 인풋필드 비우기
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // UI업데이트
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // 송금
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // UI업데이트
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // 내역 추가
    currentAccount.movements.push(amount);

    // UI업데이트
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);

    // 계정 삭제
    accounts.splice(index, 1);

    // UI감추
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
