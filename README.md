# Set up the Example Project
- Clone the repo
- run `npm install` to install dependencies to run the https server
- Open your terminal and type `sudo nano /etc/hosts`
- EWC requires an aliased URL to connect to sessionm endpoints. This URL is determined by the cors policy in your environment.
- For the purposes of this example project, we will use the example URL: `EXAMPLE_URL`
- This will open your macbook's hosts file in a terminal file editor nano
- Add the following line to the file:
`127.0.0.1       EXAMPLE_URL`
    * This allows the example project to pass the QA1 cors policy and hit the API endpoints.
- Press `Control+O` to write the file, press enter to confirm
- Press `Control+X` to exit nano
- `cd` into the cloned repo
- create a `cert.pem` file:
- `openssl req -new -x509 -keyout cert.pem -out cert.pem -days 365 -nodes`
- use that `cert.pem` file to generate a `key.pem` file:
- `openssl rsa -in cert.pem -out key.pem`
- run the server with `sudo node server.js` or `npm run server`
- this will create a local web server and host the content from the repo
	- <span style="color:red">this method now requires HTTPS to work, because all our api's now only give responses to browsers over https. You can use any method of serving local content from over HTTPS. Remember to generate a self-signed certificate and trust it.</span>
- Open your browser and go to `EXAMPLE_URL`
	- <span style="color:red">this method now requires mapping the local server output to port 443, the SSL port. Afterwards, you can access the domain from `https://EXAMPLE_URL.com`. The server.js file provided already does this.</span>
- The library is loyaltyjs.js, and it is included via script tag and initialized with JS.
- The accompanying styles are in styles.css, these styles are explicitly namespaced and can easily be overwritten and modified by including or declaring css after this file is loaded.

---
# Include appropriate files
Open the Directory in an IDE (Atom or Sublime are nice)
- The `loyalty.js` library is included with script src
- The `loyalty.css` library is included with link tag
- Inlcude your own styles after importing the sessionm specific styles so you can override them explicitly
- set viewport device width to enable responsive design
- sessionm components are auto-responsive inside their parent container using `element queries`
```html
<head>
    <meta charset="utf-8">
    <title>Test</title>
    <script src="loyalty.js"></script>
    <link rel="stylesheet" type="text/css" href="loyalty.css">
    <link rel="stylesheet" type="text/css" href="custom-styles.css">
    <meta name="viewport" content="width=device-width" />
</head>
```
---
# Set up widget containers
- the page body contains some divs with #id's that will allow you to spawn sessionM components inside them
- div's with `#balanceBar`, `#rewardStore`, and `#earnFeed` are created to give the JS a place to spawn the components
```html
<body>
    <div class="wrap">
        <div class="navwrap">
            <img class="nav" src="./header.png" />
        </div>
        <div id="balanceBar"></div>
        <div id="rewardStore"></div>
        <div id="earnFeed"></div>
    </div>
</body>
```
---
# Initialize the loyalty.js library
- js is contained in the script tag at the bottom of the page
- you can move this out to its own .js file, and you can embed it in your own js code
```javascript
var loyaltyjs = new LoyaltyJS({
    "authToken" : "USER_AUTH_TOKEN",
    "anonToken" : "USER_AUTH_TOKEN",
    "apiKey" : "API_KEY",
    "baseUrl": "API_ENDPOINT_URL"
}, function() { // this callback() is invoked when the library is done loading all configs and fetches })

loyaltyjs.createLoginButton({
    "id": "oAuth",
    "config": {
        "loginUrl": "API_LOGIN_ENDPOINT_URL",
        "clientId": "OAUTH_CLIENT_ID",
        "callbackUrl": "EXAMPLE_URL:8080"
    }
});
loyaltyjs.createBalanceBar({
    "id": "balanceBar"
});
loyaltyjs.createEarnFeed({
    "id": "earnFeed"
});
loyaltyjs.createRewardStore({
    "id": "rewardStore",
    "config": {
        "maxOffers": 3,
        "showMoreIncrement": 3,
    }
});
loyaltyjs.createInboxNotifier({
    "id": "inboxNav"
});
loyaltyjs.createInbox({
    "id": "inbox"
});
loyaltyjs.createOrderFeed({
    "id": "orders"
});
loyaltyjs.createAccount({
    "id": "account-settings"
});
loyaltyjs.getUserInfo().then((info) => {
    $('#greeting').text(`Welcome, ${info.firstName}!`);
});
loyaltyjs.createReferral({
    "id": "referral-input"
});
loyaltyjs.createReferralList({
    "id": "referral-list"
});
```
- Call `SessionM.init(args);` with the appropriate parameters

---
#### `new LoyaltyJS([Object],[Function]);`
- Initializes the SessionM.js library and allows you create components
```javascript
var loyaltyjs = new LoyaltyJS({
    "authToken" : "USER_AUTH_TOKEN",
    "anonToken" : "USER_AUTH_TOKEN",
    "apiKey" : "API_KEY",
    "baseUrl": "API_ENDPOINT_URL"
}, function() { ... });
```
`@param {Object}`
- `{String} authToken` is the user auth token generated by [this route in the s2s API](https://mmc.sessionm.com/docs/server2server/#authorization-tokens-api)
- `{String} anonToken` just like the authToken, but used as a backup to show content on the page, even when the user is not logged in. This user should have no points so nothing can be redeemed.
- `{String} apiKey` is the public key that you get when you create a new App within the `SMP`
- `{String} baseUrl` is the api endpoint for your `SMP` app, where all information for the widgets is kept

`@param {Function}` callback a callback function that is called when promise completes. **`this will be deprecated soon`**

---
#### `loyaltyjs.onError([Function]);`
- Executes a callback function when an error occurs with the loyalty.js library
```javascript
loyaltyjs.onError(function(error) {
    console.log(error);
});
```
`@param {Function}` callback function that executes when an error occurs.
- the callback takes an argument `error` that contains the error message for handling

---
#### `loyaltyjs.createLoginButton([Object]);`
- Creates a login button, on click will redirect to a new page that will ask the user to oAuth into the sessionm platform.
- This option requires your environment to be properly configured to support oAuth
- If configuration does not exist, this method will not work. Use a standard auth token on init() instead
```javascript
loyaltyjs.createLoginButton({
    "id": "oAuth",
    "config": {
        "loginUrl": "API_LOGIN_ENDPOINT_URL",
        "clientId": "OAUTH_CLIENT_ID",
        "callbackUrl": "EXAMPLE_URL:8080"
    }
});
```
`@param {Object}`
- `{String} id` this is the id of the `div` element that will contain this widget when you call this method
- `{Object} config` config parameters for this widget
    - `{String} loginUrl` This is the url that the login button redirects to, prompts the user to use oAuth
    - `{String} clientId` This ID is generated by running configuring your environment
    - `{String} callbackUrl` This is the URL that oAuth will be redirected back to once the user successfully logs in
---
#### `loyaltyjs.createBalanceBar([Object]);`
- Creates a widget that shows the User's current point balance.
```javascript
loyaltyjs.createBalanceBar({
    "id": "balanceBar"
});
```
`@param {Object}`
- `{String} id` this is the id of the `div` element that will contain this widget when you call this method
- ---
#### `loyaltyjs.createEarnFeed([Object]);`
- Creates a widget that shows the Activity Feed, allowing the user to earn points and view Ads
```javascript
loyaltyjs.createEarnFeed({
   "id": "earnFeed"
});
```
`@param {Object}`
- `{String} id` this is the id of the `div` element that will contain this widget when you call this method
---
#### `loyaltyjs.createRewardStore([Object]);`
- Creates a widget that shows the reward store, which allows the user to spend points and claim rewards
```javascript
loyaltyjs.createRewardStore({
   "id": "rewardStore",
    "config": {
        "maxOffers": 1,
        "showMoreIncrement": 1,
    }
});
```
`@param {Object}`
- `{String} id` this is the id of the `div` element that will contain this widget when you call this method
- `{Object} config` config parameters for this widget
    - `{Number} maxOffers` this number limits how many offers are shown at once, as a form of pagination
    - `{Number} showMoreIncrement` this is how many more offers are show when the `show more` button is clicked, as pagination
---
#### `loyaltyjs.createInboxNotifier([Object]);`
- Creates a widget that shows whether or not there are any unread messages in your inbox
```javascript
loyaltyjs.createInboxNotifier({
    "id": "inboxNav"
});
```
`@param {Object}`
- `{String} id` this is the id of the `div` element that will contain this widget when you call this method
---
#### `loyaltyjs.createInbox([Object]);`
- Creates a widget that shows inbox messages. Messages can be read, deleted, and opened in a new tab
```javascript
loyaltyjs.createInbox({
    "id": "inbox"
});
```
`@param {Object}`
- `{String} id` this is the id of the `div` element that will contain this widget when you call this method
---
#### `loyaltyjs.createOrderFeed([Object]);`
- Creates a widget that shows the user's order history. All orders and their statuses: pending, approved,  and rejected
```javascript
loyaltyjs.createOrderFeed({
    "id": "orders"
});
```
`@param {Object}`
- `{String} id` this is the id of the `div` element that will contain this widget when you call this method
---
#### `loyaltyjs.createAccount([Object]);`
- Creates a widget that shows the user's profile as a form. Allows the user to edit the user profile fields and save them
```javascript
loyaltyjs.createAccount({
    "id": "account-settings"
});
```
`@param {Object}`
- `{String} id` this is the id of the `div` element that will contain this widget when you call this method
---
#### `loyaltyjs.getUserInfo();`
- A method that returns user profile information to be used wherever needed, such as the user's name.
```javascript
loyaltyjs.getUserInfo().then((info) => {
    $('#greeting').text(`Welcome, ${info.firstName}!`);
});
```
`@returns {Object}`
```
{
    firstName,
    lastName,
    birthdate,
    email,
    points,
    avatar,
    zip
}
```

---
#### `loyaltyjs.createReferral([Object]);`
- Creates a widget that shows an input box, which allows the user to enter an email to refer a friend. Will show an error modal if the email has already been referred.
```javascript
loyaltyjs.createReferral({
    "id": "referral-input"
});
```
`@param {Object}`
- `{String} id` this is the id of the `div` element that will contain this widget when you call this method
---
#### `loyaltyjs.createReferralList([Object]);`
- Creates a widget that shows all emails that have been referred by this user via referrals api.
```javascript
loyaltyjs.createReferralList({
    "id": "referral-list"
});
```
`@param {Object}`
- `{String} id` this is the id of the `div` element that will contain this widget when you call this method
---
#### `behavior` object
- this object is used in the following methods:
	- `loyaltyjs.createBehaviorTracker()`
	- `loyaltyjs.createBehaviorDetails()`
	- `loyaltyjs.createBehaviorCard()`
```
    behavior: {
        campaignId: 123,
        behaviorName: "name",
        title: 'Give the behavior a title here',
        description: 'Describe the behavior here',
        disabled: false,
        atomicProgress: false,
        statusText: {
            notStarted: {
                header: 'Not Started',
                subHeader: ''
            },
            started: {
                header: 'In Progress!',
                subHeader: ''
            },
            completed: {
                header: 'Completed!',
                subHeader: ''
            }
        },
        rewardText: {
            progress: "COLLECT {amount} BONUS POINTS",
            complete: "{amount} BONUS POINTS COLLECTED"
        }
    }
```
- `{Object} behavior` object that contains initialization parameters for the widget
	- `{Number} campaignId` the id of the campaign you want to target
	- `{String} behaviorName` name of the behavior in Campaigns
	- `{String} title` displayed title of the widget
	- `{String} description` displayed description of the widget
	- `{Boolean} disabled` boolean that disables the widget from showing progress
	- `{Boolean} atomicProgress` boolean that forces the widget to use 1 checkmark and rely on the behaviors overall progress to determine completion state
	- `{Object} statusText` object that contains `notStarted`, `started`, `completed` texts strings for overall progress
	- `{Object} rewardText` object that contains `progress` and `complete` interpolated string text for rewards
---
#### `loyaltyjs.createBehaviorTracker([Object]);`
- Widget thet shows a circular progress bar for how many goals in a behavior the user has completed. This lets a user know how far along they are in completing a single behavior, such as `Go to N stores and make N purchases on the same day`
```javascript
loyaltyjs.createBehaviorTracker({
    "id": "behavior-tracker",
    behavior: behavior
});
```
`@param {Object}`
- `{String} id` this is the id of the `div` element that will contain this widget when you call this method
- `{Object} behavior` uses the behavior object defined above
---
#### `loyaltyjs.createBehaviorDetails([Object]);`
- Widget thet shows checkmarks for all goals contained within a behavior. This lets a user know how far along they are in completing a single behavior, such as `Go to N stores and make N purchases on the same day`
```javascript
loyaltyjs.createBehaviorDetails({
    "id": "behavior-details",
    behavior: behavior
});
```
`@param {Object}`
- `{String} id` this is the id of the `div` element that will contain this widget when you call this method
- `{Object} behavior` uses the behavior object defined above
---
#### `loyaltyjs.createBehaviorCard([Object]);`
- Widget the combines the behavior circular progress visualization with the checkmarks and progress text to create a full card that has all behavior data for the user
```javascript
loyaltyjs.createBehaviorCard({
    "id": "behavior-card",
    behavior: behavior
});
```
`@param {Object}`
- `{String} id` this is the id of the `div` element that will contain this widget when you call this method
- `{Object} behavior` uses the behavior object defined above
---
#### `loyaltyjs.getAllCampaignBehaviors({Number} campaignId);`
- Returns an array of behaviors associated with a campaign. This data can be iterated over and used to create the behavior widgets above
```javascript
loyaltyjs.getAllCampaignBehaviors(campaignId);
```
- `param {Number} campaignId` id of the campaign you are targeting
- `returns {Array}` of :
  ```
    {
      id {Number}
      name {String}
      points {Number}
      achieved {Boolean}
    }
  ```

---
#### `loyaltyjs.getAllCampaignBehaviorsUncached({Number} campaignId);`
- The same as the method above, but does not memoize the fetched campaign data for reuse. This method will make a request to the campaigns API everytime it is called, so only use it when you are sure you need absolute new data.
```javascript
loyaltyjs.getAllCampaignBehaviorsUncached(campaignId);
```
- `param {Number} campaignId` id of the campaign you are targeting
---
#### `loyaltyjs.trackCampaign({Number} campaignId);`
- Makes a request to the campaign that tracks the user visit
```javascript
loyaltyjs.trackCampaign(campaignId);
```
- `param {Number} campaignId` id of the campaign you are targeting
---
#### `loyaltyjs.optInCampaign({Number} campaignId);`
- Calling this method will opt in the currently auth'd user into this campaign
```javascript
loyaltyjs.optInCampaign(campaignId);
```
- `param {Number} campaignId` id of the campaign you are targeting
---
#### `loyaltyjs.getCampaignProgress({Number} campaignId);`
- Returns only relevant progress information about a campaign, lets you know whether or not a campaign is active,has an opt in period, and if the user has opted and if the user is qualified for this campaign.
```javascript
loyaltyjs.getCampaignProgress(campaignId);
```
- `param {Number} campaignId` id of the campaign you are targeting
