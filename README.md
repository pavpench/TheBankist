# TheBankist
Simulation of simple bank client, with Time and Currency Localization, Transfers display. Logout timer is set to 2 minutes and resets after a Transfer or Loan actions
###Transfer
Input on of the test accounts in `Transfer to` field(not accepting the currently logged account), and set the amount in `Amount` field.
Transfer will appear in transfers field and can be confirmed by logging in as the receiver account. 
*Currently no implementation of DataBase so expect data reset if page is reloaded. Account testing can be done without a reload atm, simply input the credentiels in
login fields.

### Request Loan
Amount can be added to current balance by adding an ammount not higher than 10% of highest deposit. (Currently known issue, the requested amount increases after each request)

### Test login accounts
UserName : `js`; n\
Password : `1111`; n\
UserName : `jd`; n\
Password : `2222`; n\
UserName : `stw`; n\
Password : `3333`; n\
UserName : `ss`; n\
Password : `4444`; n\

#### Main goals of project
To practice: javascript methods, sanitization and manipulation of data, UI interactivity, Localized Currency, Date and Time, Working with idle timers and more.
