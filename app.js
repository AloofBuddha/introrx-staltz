// -- click (startWith) -- click -->
var refreshButton = Rx.Observable
  .fromEvent($('.refresh'), 'click')
	.startWith('click');

// -- click -->		=>		-- url -->
var usersRequest = refreshButton.map(() => 
	'https://api.github.com/users?since=' + Math.floor(Math.random()*500));

// -- url --->		=>		-- JSON result (or error) -->
var usersResponse = usersRequest.flatMap(url => 
	Rx.Observable.fromPromise($.getJSON(url)));

// -- refresh click -->		=>		-- null -->
var nullOnRefresh = refreshButton.map(() => null);

// -- JSON response -->		=> 		-- user suggestion -->
var suggestion1response = usersResponse.map(userList => 
	userList[Math.floor(Math.random()*userList.length)]);

// -- refresh -->		=> -- null -- user suggestion -->
var suggestion1 = nullOnRefresh.merge(suggestion1response);

// respond to suggestion value by updating DOM
suggestion1.subscribe(suggestedUser => {
	var suggestionEl = $('.suggestion1')[0];
	// waiting state
	if (suggestedUser === null) {
		suggestionEl.style.visibility = 'hidden';
	}
	// response state 
	else {
		var usernameEl = $(suggestionEl).find('.username')[0],
		    userImgEl  = $(suggestionEl).find('img')[0];

		usernameEl.href        = suggestedUser.html_url;
    usernameEl.textContent = suggestedUser.login;
    userImgEl.src 				 = suggestedUser.avatar_url;

		suggestionEl.style.visibility = 'visible';
	}
});

// just to test for now
refreshButton.subscribe(x => console.log('refresh clicked'));
usersRequest.subscribe(x => console.log('request for %s', x));
usersResponse.subscribe(x => console.log('got response from request'));
suggestion1.subscribe(x => console.log('suggestion1:\n%s', JSON.stringify(x,null,2)));

