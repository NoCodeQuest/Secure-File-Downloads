// ----------------------------------------
// ~ NoCodeQuest.com ~
// "Add some muscle to your Webflow site."
// ----------------------------------------
'use strict';
const jsonwebtoken = require('jsonwebtoken');
const fetch = require('node-fetch');

module.exports.handler = (event, context, callback) => {
	(async () => {

		// get the JSON posted in the request body
		let requestBody = JSON.parse(event.body);

		// get specific values passed into the request body
		const jwt = requestBody.jwt;
		const publicKeyUrl = requestBody.url;

		// decode the jwt passed in
		let decodedJwt = jsonwebtoken.decode(jwt, {complete: true});

		// fetch the public key and parse the JSON
		const publicKeyResponse = await fetch(publicKeyUrl);
		const publicKeyJson = await publicKeyResponse.json();
		const publicKey = publicKeyJson[decodedJwt.header.kid];

		// verify the jwt signature against the public key just fetched
		let verifiedJwt = jsonwebtoken.verify(jwt, publicKey);

		// compile a response
		const response = {
			statusCode: 200,
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
			body: JSON.stringify({
				user: {
						id: verifiedJwt.id,
						email: verifiedJwt.email,
						site: verifiedJwt.site
					},
			}),
		};

		// log the success
		console.log('Successful download. Member ID: ' + decodedJwt.payload.id + ' with Site ID: ' + decodedJwt.payload.site);

		// respond
		callback(null, response);

	})().catch(console.error);
};
