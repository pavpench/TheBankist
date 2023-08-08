"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// Currencies

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

/////////////////////////////////////////////////
const displayMovements = function (movements) {
  containerMovements.innerHTML = "";

  movements.forEach((movement, index) => {
    const type = movement > 0 ? "deposit" : "withdrawal";

    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type} </div>
    <div class="movements__value">${movement}€</div>
                  </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${account.balance} EUR`;
};

const calcDisplaySummary = function (account) {
  let interestRate = account.interestRate;
  let movements = account.movements;
  //Calculation of deposits
  const incomes = movements
    .filter((mov) => mov > 0)
    .reduce((acc, move) => acc + move, 0);
  labelSumIn.textContent = `${incomes}€`;

  //Calculation and display withdraws
  const outcomes = movements
    .filter((mov) => mov < 0)
    .reduce((acc, move) => acc + move, 0);
  labelSumOut.textContent = `${Math.abs(outcomes)}€`;

  //Calculating interest based on deposit and rendering
  //Extra rule added for interest above 1 euro

  const interest = movements
    .filter((move) => move > 0)
    .map((deposit) => (deposit * interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, interest) => acc + interest, 0);
  labelSumInterest.textContent = `${interest}€`;
};

// Create a short version of the user name based on regular name
// const user = "Steven Thomas Williams"; //stw
// to be reworked as a method for user

const createUsernames = function (accounts) {
  accounts.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};

const updateUI = function (account) {
  //Display Movements
  displayMovements(account.movements);
  //Display balance
  calcDisplayBalance(account);

  //Display summary
  calcDisplaySummary(account);
};

//Login handler
let currentAccount;

//Login based on userName and pin
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.userName === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    console.log("Login");
    //Display UI and message
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;
    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";

    //Lose focus from input field
    inputLoginPin.blur();
    // Update UI
    updateUI(currentAccount);
  } else {
    console.log(`Invalid userName or password`);
  }
});

//Transfer from currentAccount --> receiverAccount
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(
    (acc) => acc.userName === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = "";

  if (
    amount > 0 &&
    receiverAccount &&
    currentAccount.balance >= amount &&
    receiverAccount?.userName !== currentAccount.userName
  ) {
    //Doing transfer
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);

    //Update UI
    updateUI(currentAccount);
    console.log(`transfer valid`);
  }
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.userName === inputCloseUsername.value
      //accounts.indexOf(inputCloseUsername.value)
    );
    //Delete account
    accounts.splice(index, 1);
    //Hide UI
    containerApp.style.opacity = 0;
    console.log(
      `The account has been removed from the current instance: `,
      accounts
    );
  } else {
    console.log("You don't own this account");
  }
  inputCloseUsername.value = inputClosePin.value = "";
});

createUsernames(accounts);
console.log(accounts);

//Request loan with coverage at least 10% of highest deposit
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some((move) => move >= amount * 0.1)
  ) {
    //Add movement
    currentAccount.movements.push(amount);
    //Update UI
    updateUI(currentAccount);
  } else {
    alert(
      "Amount is too high! Your loan has to be covered at least for 10% of your biggest deposit"
    );
  }
});
