/*:
	@module-license:
		The MIT License (MIT)

		Copyright (c) 2014 Richeve Siodina Bebedor

		Permission is hereby granted, free of charge, to any person obtaining a copy
		of this software and associated documentation files (the "Software"), to deal
		in the Software without restriction, including without limitation the rights
		to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		copies of the Software, and to permit persons to whom the Software is
		furnished to do so, subject to the following conditions:

		The above copyright notice and this permission notice shall be included in all
		copies or substantial portions of the Software.

		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		SOFTWARE.
	@end-module-license

	@module-configuration:
		{
			"packageName": "decode-passphrase",
			"fileName": "decode-passphrase.js",
			"moduleName": "decodePassphrase",
			"authorName": "Richeve S. Bebedor",
			"authorEMail": "richeve.bebedor@gmail.com",
			"repository": "git@github.com:volkovasystems/decode-passphrase.git",
			"testCase": "decode-passphrase-test.js",
			"isGlobal": true
		}
	@end-module-configuration

	@module-documentation:
		Decoding the passphrase is an internal function to the user-login.

		We don't expose this capability as user method.

		It will simply decode the passphrase array based on Shamir's Secret Sharing Algorithm.

		We will use the string factor to derive the sharing partition and threshold.

		Throw an error if there's a slight error in the process.
	@end-module-documentation
*/

var _ = require( "lodash" );
var secrets = require( "secrets.js" );
var XXH = require( "xxhashjs" );

const PASSPHRASE_SEED = global.PASSPHRASE_SEED || 0xDEADDEAF;

var decodePassphrase = function decodePassphrase( passphrase, stringFactor ){
	var hashFactor = XXH( stringFactor, PASSPHRASE_SEED ).toString( 10 );

	var shareCount = Math.floor( Math.sqrt( Math.sqrt( Math.sqrt( parseInt( hashFactor ) ) ) ) ) || 5;

	var threshold = Math.floor( Math.sqrt( shareCount ) ) || 2;

	var medianThreshold = Math.ceil( ( shareCount + threshold ) / 2 );

	var phrases = _( passphrase ).shuffle( ).take( medianThreshold ).value( );

	return secrets.hex2str( secrets.combine( phrases ) );
};

module.exports = decodePassphrase;