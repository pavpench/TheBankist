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
  movementsDates: [
    "2022-11-18T21:31:17.178Z",
    "2022-12-23T07:42:02.383Z",
    "2023-01-28T09:15:04.904Z",
    "2023-04-01T10:17:24.185Z",
    "2023-05-08T14:11:59.604Z",
    "2023-05-27T17:01:17.194Z",
    "2023-08-05T23:36:17.929Z",
    "2023-08-11T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    "2022-11-01T13:15:33.035Z",
    "2022-11-30T09:48:16.867Z",
    "2022-12-25T06:04:23.907Z",
    "2023-01-25T14:18:46.235Z",
    "2023-02-05T16:33:06.386Z",
    "2023-04-10T14:43:26.374Z",
    "2023-06-25T18:49:59.371Z",
    "2023-09-11T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};
//movements : 200, -200, 340, -300, -20, 50, 400, -460
const account3 = {
  owner: "Steven Thomas Williams",
  movements: [],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    "2022-11-01T13:15:33.035Z",
    "2022-11-30T09:48:16.867Z",
    "2022-12-25T06:04:23.907Z",
    "2023-01-25T14:18:46.235Z",
    "2023-02-05T16:33:06.386Z",
    "2023-04-10T14:43:26.374Z",
    "2023-06-25T18:49:59.371Z",
    "2023-09-11T12:01:20.894Z",
  ],
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    "2022-11-01T13:15:33.035Z",
    "2022-11-30T09:48:16.867Z",
    "2022-12-25T06:04:23.907Z",
    "2023-01-25T14:18:46.235Z",
    "2023-02-05T16:33:06.386Z",
    "2023-04-10T14:43:26.374Z",
    "2023-06-25T18:49:59.371Z",
    "2023-09-11T12:01:20.894Z",
  ],
  currency: "EUR",
  locale: "pt-PT",
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

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) => {
    return Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  };
  const daysPassed = calcDaysPassed(new Date(), date);
  if (daysPassed === 0) {
    return "Today";
  }
  if (daysPassed === 1) {
    return Yesterday;
  }
  if (daysPassed <= 7) {
    return `${daysPassed} days ago`;
  } else {
    // const now = new Date();
    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const year = date.getFullYear();
    // return `${day}/${month}/${year}`;
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

/**
 * Currency formating
 */
const formatCurrency = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};
/** */
const displayMovements = function (account, sort = false) {
  containerMovements.innerHTML = "";

  //account.movements.slice() to create a shallow copy of the variable and not mutate original one
  const movs =
    (sort && account.movements?.slice().sort((a, b) => a - b)) ||
    account.movements;

  !!movs.length &&
    movs.forEach((movement, index) => {
      const type = movement > 0 ? "deposit" : "withdrawal";
      let date = new Date(account.movementsDates[index]);
      let displayDate = formatMovementDate(date, account.locale);
      const formattedMovement = formatCurrency(
        movement,
        account.locale,
        account.currency
      );
      const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${
        index + 1
      } ${type} </div>
    <div class="movements__date">${displayDate}</div>
    
    <div class="movements__value">${formattedMovement}</div>
                  </div>`;
      containerMovements.insertAdjacentHTML("afterbegin", html);
    });
};
/** */
const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCurrency(
    account.balance,
    account.locale,
    account.currency
  );
};
/** */
const calcDisplaySummary = function (account) {
  let interestRate = account.interestRate;
  let movements = account.movements;

  //Calculation of deposits
  const incomes = movements
    .filter((mov) => mov > 0)
    .reduce((acc, move) => acc + move, 0);
  labelSumIn.textContent = formatCurrency(
    incomes,
    account.locale,
    account.currency
  );

  //Calculation and display withdraws
  const outcomes = movements
    .filter((mov) => mov < 0)
    .reduce((acc, move) => acc + move, 0);
  labelSumOut.textContent = formatCurrency(
    outcomes,
    account.locale,
    account.currency
  );

  //Calculating interest based on deposit and rendering
  //Extra rule added for interest above 1 euro

  const interest = movements
    .filter((move) => move > 0)
    .map((deposit) => (deposit * interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, interest) => acc + interest, 0);
  labelSumInterest.textContent = formatCurrency(
    interest,
    account.locale,
    account.currency
  );
};

/**
 * Logout timer
 */
const startLogOutTimer = function () {
  //set time to 5 minutes
  let time = 120;
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    //In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    //Then 0 seconds, stop timer and logout user
    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent =
        "You were logged out, please log in again to get started";
    }
    //Decrease 1s
    time--;
  };

  //call the timer every second
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

/** 
  Create a short version of the user name based on regular name
  const user = "Steven Thomas Williams"; //stw
  possible rework as a method for user
 */

const createUsernames = function (accounts) {
  accounts.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};

/**
 * User Interface Update upon difference situations
 */
const updateUI = function (account) {
  //Display Movements
  displayMovements(account);
  //Display balance
  calcDisplayBalance(account);

  //Display summary
  calcDisplaySummary(account);
};

//Variables
let currentAccount, timer;

//Fake always logged in
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

/**
 *Login based on userName and pin
 */
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.userName === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    console.log("Login successful");
    //Display UI and message
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;

    const now = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
      weekday: "long",
    };

    const locale = currentAccount?.locale ?? navigator.language;
    labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(
      now
    );

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    //Start logout timer
    if (timer) clearInterval(timer);

    timer = startLogOutTimer();
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
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAccount.movementsDates.push(new Date().toISOString());

    //Update UI
    updateUI(currentAccount);
    console.log(`transfer valid`);

    //Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

/**
 *Close/Delete account button
 */
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

//Request loan with coverage at least 10% of  deposit
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some((move) => move >= amount * 0.1)
  ) {
    inputLoanAmount.value = "";

    setTimeout(function () {
      //Add movement
      currentAccount.movements.push(amount);
      //Add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      //Update UI
      updateUI(currentAccount);
    }, 3000);
  } else {
    alert(
      "Amount is too high! Your loan has to be covered at least for 10% of a deposit"
    );
  }
  //Reset timer
  clearInterval(timer);
  timer = startLogOutTimer();
});

/**
 * Movements sort
 */

let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  sorted = !sorted;
  displayMovements(currentAccount, sorted);
});
