/*
* SHA-256 (FIPS 180-4) implementation in Javascript
* copied from www.moveable-type.co.uk/script/sha256.html
* and annotated by Jeff for self-study purposes
*/



function hash(msg, options) {
    const defaults = {
        msgFormat: 'string',
        outFormat: 'hex'
    }
    const opt = Object.assign(defaults, options);

    // ------- Encoding functions ----

    switch (opt.msgFormat) {
        default: // neat trick for default assigning to a particular case, default to string case
        case 'string':
            msg = utf8Encode(msg);
            break;
        case 'hex-bytes':
            msg = hexBytesToString(msg);
            break;
    }

    function utf8Encode(str) {
        try {
            return new TextEncoder().encode(str, 'utf-8').reduce((prev, curr) => prev + String.fromCharCode(curr), '');
            // TextEncoder() converts a string into bytes, more specifically in our case, utf-8 (unicode transformation format 8 bit)

            // .encode(str,'utf-8') returns a Uint8array: 
            // Object {"0": str.charCodeAt(0), "1":str.charCodeAt(1)... str.Length-1.toString():byteRerepresentation}

            // .reduce(previousVal,currentVal) => function() executes a user-defined reducer callback function, or arrow function on each element of the array (or in this case, the Uint8Array)
            // essentially returns the 'original' string, parsed through utf-8 encoding
        } catch (e) {
            return unescape(encodeURIComponent(str));
            // encodeURIComponent() returns a percent-encoded string (converts special/reserved characters into '%__', ie ':' becomes '%3A')

            // unescape retursn the character without any interpretation
            // as opposed to decodeURIComponent, which interprets it with UTF-8
        }
    }
    function hexBytesToString(hexStr) {
        // converts string of hex numbers to string of chars
        const str = hexStr.replace(' ', ''); // allow for space-separated groups
        return str == '' ? '' : str.match(/.{2}/g).map(byte => String.fromCharCode(parseInt(byte, 16))).join('');
        // if str=='', return '', else

        // string.match(regex) searches a string for a match against a regular expression and returns an array
        // /.{2}/g      . any character except newline \n           {2} of length 2         / /g global match ALL, instead of first match

        // .map(val=> {function(val)}) does exactly what it sound like - creates a new array populated with the results of calling a provided function on every element
    }

    /*
    *
    *       initialize hash values (h) and round constants (k)
    * 
    */

    const H = [
        0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
    // hardcoded constants that represent the first 32bits of the fractional parts of the square roots of the first 8 primes
    // 2 => 1.4142135623730950488016887242097 => 0.4142135623730950488016887242097 => 0.6A09E667F3BCC908AB02
    // 3 => 1.7320508076 => 0.7320508076 => 0.BB67AE85A702EA9453A2
    // 5 => 2.2360679775 => 0.2360679775 => 0.3C6EF372FED02A246BC5
    // etc.

    const K = [
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];
    // hardcoded constants that represent the first 32bits of the fractional parts of hte cube roots of the first 64 primes (2-311)
    // 2 => 1.2599210498949 => 0.2599210498949 => 0.428A2F98D7303BD0E9BD
    // etc.

    // why these particular sets of numbers? 'Nothing up my sleeve' numbers, easily verifiable and chosen as a way of proving the 
    // constants are not specially chosen, ie, such to provide a backdoor to the algorithm - if you don't trust the copy/paste, you could algorithmically figure it all out

    /*
    *
    *           PRE PROCESSING
    *
    */
    let prelength = "";
    for (let i = 0; i < msg.length; i++) {
        prelength += ("00000000" + msg[i].charCodeAt(0).toString(2)).slice(-8) + " ";
    }
    document.getElementById('pre-length').innerHTML = "<h3>Stage 1</h3><p><i>Text length after encoding to UTF-8</i></p><p>" + msg + " >> text length: " + msg.length // returns length 5 for 'hello'
        + "</p><p><i>Binary representation:</i> " + prelength + "</p>";
    msg += String.fromCharCode(0x80); // add trailing '1', 0x80 in hexadecimal is 128 in decimal, which is 10000000 in binary

    let postlength = "";
    for (let i = 0; i < msg.length; i++) {
        postlength += ("00000000" + msg[i].charCodeAt(0).toString(2)).slice(-8) + " ";
    }
    document.getElementById('post-length').innerHTML = "<p><i>Text length after adding a trailing '1', or 128 in hexadecimal, or 10000000 in binary (happens to represent the Euro sign in HTML utf-8)</i></p><p>" + msg + " >> text length: " + msg.length // returns length 6 for 'hello'
        + "</p><p><i>Binary representation:</i> " + postlength + "</p>";

    // convert string msg into 512-bit blocks
    const len = msg.length / 4 + 2; // length (in 32bit integers) of msg + '1' + appended length
    const N = Math.ceil(len / 16); // number of 16-integer (512-bit) blocks required to hold 'length' ints
    // console.log(N);
    const message = new Array(N); // message is Nx16 array of 32bit integers

    document.getElementById('array').innerHTML = "<h3>Stage 2</h3><p><i>Convert the string into 512-bit blocks</i></p>"
    let printMessage = "";
    for (let i = 0; i < N; i++) {
        message[i] = new Array(16);
        for (let j = 0; j < 16; j++) {
            // encode 4 chars per integer (64per block)
            // | bitwise or, returns 1 in each bit position fo rwhich the corresponding bits of either or both operands are 1
            message[i][j] = (msg.charCodeAt(i * 64 + j * 4) << 24) // << left shift operator, shifts the first operatand the specifed number of bits to the left
                | (msg.charCodeAt(i * 64 + j * 4 + 1) << 16)
                | (msg.charCodeAt(i * 64 + j * 4 + 2) << 8)
                | (msg.charCodeAt(i * 64 + j * 4 + 3) << 0);
            // ie a = 5, 0101
            // b = 3;    0011
            // a | b = 7 0111
            if (message[i][j] != 0) {
                printMessage += ("00000000000000000000000000000000" + message[i][j].toString(2)).slice(-32);
            } else {
                printMessage += "00000000000000000000000000000000";
            }
        }
        document.getElementById('array').innerHTML += "<p class='menlo'>" + printMessage.replace(/(.{8})/g, "$& ") + "</p>"
    }
    document.getElementById('array').innerHTML += "<p><i>Add length as a checksum into the final pair of 32bit integers (ie last 64bits)</i></p>"
    // add length (in bits) into the final pair of 32bit integers (big-endian, endianness is the order of bytes of a word in computer memory)
    const lenHi = ((msg.length - 1) * 8) / Math.pow(2, 32);
    const lenLo = ((msg.length - 1) * 8) >>> 0; // bitwise zero fill right shift, shifts right by pushing zeros in from the left and let rightmost bits fall off
    // ie 5 >>> 1 = 2 0101 >>> 0001 = 0010
    message[N - 1][14] = Math.floor(lenHi);
    message[N - 1][15] = lenLo;
    // printing 2
    let printMessage2 = "";
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < 16; j++) {
            if (message[i][j] != 0) {
                printMessage2 += ("00000000000000000000000000000000" + message[i][j].toString(2)).slice(-32);
            } else {
                printMessage2 += '00000000000000000000000000000000';
            }
        }
        document.getElementById('array').innerHTML += "<p class='menlo'>" + printMessage2.replace(/(.{8})/g, "$& ") + "</p>"
    }
    document.getElementById('array').innerHTML += "<p><i>Remembering, text length: " + (msg.length - 1) + ", length of binary representation: " + ((msg.length - 1) * 8).toString(10) + ", binary representation of this (big-endian): " + ((msg.length - 1) * 8).toString(2) + "</i></p>"

    /*
    *
    *       HASH COMPUTATION
    * 
    */
    document.getElementById('hash').innerHTML = "<h3>Hashing computation</h3>";
    for (let i = 0; i < N; i++) {
        const W = new Array(64);

        document.getElementById('hash').innerHTML += "<p><i>Initalise the message schedule</i></p>";
        let printMessage3 = ""
        // 1 - prepare message schedule 'W'
        for (let t = 0; t < 16; t++) {
            W[t] = message[i][t];
            let popup = document.createElement('div');
            popup.setAttribute('id', 'W' + t);
            popup.setAttribute('class', 'popup');
            document.getElementById('hash').appendChild(popup);
            if (W[t] != 0) {
                popup.innerHTML += "<a class='menlo'>" + (("00000000000000000000000000000000" + W[t].toString(2)).slice(-32)) + " </a>";
            } else {
                popup.innerHTML += "<a class='menlo'>00000000000000000000000000000000 </a>"
            }
            let popuptext = document.createElement('span');
            popuptext.setAttribute('class', 'popuptext');
            popuptext.setAttribute('id', 'popupW' + t);
            popuptext.innerHTML = "W[" + t + "]";
            popup.appendChild(popuptext);
            popup.setAttribute('onmouseenter', 'toggleshow(popupW' + t + ')');
            popup.setAttribute('onmouseleave', 'toggleshow(popupW' + t + ')');
        }

        for (let t = 16; t < 64; t++) {
            W[t] = (σ1(W[t - 2]) + W[t - 7] + σ0(W[t - 15]) + W[t - 16]) >>> 0;
            let popup = document.createElement('div');
            popup.setAttribute('id', 'W' + t);
            popup.setAttribute('class', 'popup');
            document.getElementById('hash').appendChild(popup);
            if (W[t] != 0) {
                popup.innerHTML += "<div id=W" + t + " class='popup'><a class='menlo'>" + (("00000000000000000000000000000000" + W[t].toString(2)).slice(-32)) + " </a></div>";
            } else {
                popup.innerHTML += "<div id=W" + t + " class='popup'><a class='menlo'>00000000000000000000000000000000 </a></div>"
            }
            let popuptext = document.createElement('span');
            popuptext.setAttribute('class', 'popuptext');
            popuptext.setAttribute('id', 'popupW' + t);
            popuptext.innerHTML = "W[" + t + "]:</br> W[" + (t - 15) + "] rightrotate 7: " + ("00000000000000000000000000000000" + (ROTR(7, W[t - 15]).toString(2))).slice(-32)
                + "</br> W[" + (t - 15) + "] rightrotate 18: " + ("00000000000000000000000000000000" + (ROTR(18, W[t - 15]).toString(2))).slice(-32)
                + "</br> W[" + (t - 15) + "] rightshift 3: " + (("00000000000000000000000000000000" + (W[t - 15] >>> 3).toString(2)).slice(-32))
                + "</br>s[0] = W[" + (t - 15) + "] rightrotate 7 XOR W[" + (t - 15) + "] rightrotate 18 XOR W[" + (t - 15) + "] rightshift 3 "
                + "</br> s[0] = " + (("00000000000000000000000000000000" + (σ0(W[t - 15]).toString(2))).slice(-32))
                + "</br> W[" + (t - 2) + "] rightrotate 17: " + ("00000000000000000000000000000000" + (ROTR(17, W[t - 2]).toString(2))).slice(-32)
                + "</br> W[" + (t - 2) + "] rightrotate 19: " + ("00000000000000000000000000000000" + (ROTR(19, W[t - 2]).toString(2))).slice(-32)
                + "</br> W[" + (t - 2) + "] rightshift 10: " + (("00000000000000000000000000000000" + (W[t - 2] >>> 10).toString(2)).slice(-32))
                + "</br>s[1] = W[" + (t - 2) + "] rightrotate 17 XOR W[" + (t - 2) + "] rightrotate 19 XOR W[" + (t - 2) + "] rightshift 10 "
                + "</br> s[1] = " + (("00000000000000000000000000000000" + (σ1(W[t - 2]).toString(2))).slice(-32))
                + "</br> W[" + t + "] = W[" + (t - 16) + "] + s[0] + W[" + (t - 7) + "]+ s[1]";
            popup.appendChild(popuptext);
            popup.setAttribute('onmouseenter', 'toggleshow(popupW' + t + ')');
            popup.setAttribute('onmouseleave', 'toggleshow(popupW' + t + ')');
        }

        document.getElementById('hash').innerHTML += "<div id='tempExpl' class='popup'><a><h3>Main loop</h3></a></div>";
        let popuptext = document.createElement('span');
        popuptext.setAttribute('class', 'popuptext');
        popuptext.setAttribute('id', 'popupExpl');
        popuptext.innerHTML = "<i>start with 8 prime roots, represented by a - h</i></br>For each compression loop from 0 to 63:</br>"
            + "s1 = (e rightrotate 6) xor (e rightrotate 11) xor (e rightrotate 25)</br>"
            + "choice = (e and f) xor ((not e) and g)</br>"
            + "temp1 = h + S1 + choice + K[i] + W[i]<br><i> where K is the array of 64 prime roots and W is our message schedule</i></br>"
            + "s0 = (a rightrotate 2) xor (a rightrotate 13) xor (a rightrotate 22)</br>"
            + "majority = (a and b) xor (a and c) xor (b and c)</br>"
            + "temp2 = s0 + majority</br></br>"
            + "&nbsp;&nbsp;h = g;</br>"
            + "&nbsp;&nbsp;g = f;</br>"
            + "&nbsp;&nbsp;f = e;</br>"
            + "&nbsp;&nbsp;e = d + temp1;</br>"
            + "&nbsp;&nbsp;d = c;</br>"
            + "&nbsp;&nbsp;c = b;</br>"
            + "&nbsp;&nbsp;b = a;</br>"
            + "&nbsp;&nbsp;a = temp1+temp2";
        document.getElementById('tempExpl').appendChild(popuptext);
        document.getElementById('tempExpl').setAttribute('onmouseenter', 'toggleshow(popupExpl)');
        document.getElementById('tempExpl').setAttribute('onmouseleave', 'toggleshow(popupExpl)');


        // 2 - initialise working variables a, b, c, d, e, f, g, h with previous hash value
        let a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];

        // 3 - main loop (note '>>> 0' for 'addition modulo 2^32')
        for (let t = 0; t < 64; t++) {
            const T1 = h + Σ1(e) + Ch(e, f, g) + K[t] + W[t];
            const T2 = Σ0(a) + Maj(a, b, c);
            h = g;
            g = f;
            f = e;
            e = (d + T1) >>> 0;
            d = c;
            c = b;
            b = a;
            a = (T1 + T2) >>> 0;
            document.getElementById('hash').innerHTML += "<p><i>Compression loop " + t + "</i>:</p><p class='menlo'> a:" + ("00000000000000000000000000000000" + a.toString(2)).slice(-32) + " b:" + ("00000000000000000000000000000000" + b.toString(2)).slice(-32) + " c:" + ("00000000000000000000000000000000" + c.toString(2)).slice(-32) + " d:" + ("00000000000000000000000000000000" + d.toString(2)).slice(-32) + " e:" + ("00000000000000000000000000000000" + e.toString(2)).slice(-32) + " f:" + ("00000000000000000000000000000000" + f.toString(2)).slice(-32) + " g:" + ("00000000000000000000000000000000" + g.toString(2)).slice(-32) + " h:" + ("00000000000000000000000000000000" + h.toString(2)).slice(-32) + "</p>";
        }

        // 4 - compute the new intermediate hash value (note '>>> 0' for 'addition modulo 2^32')
        H[0] = (H[0] + a) >>> 0;
        H[1] = (H[1] + b) >>> 0;
        H[2] = (H[2] + c) >>> 0;
        H[3] = (H[3] + d) >>> 0;
        H[4] = (H[4] + e) >>> 0;
        H[5] = (H[5] + f) >>> 0;
        H[6] = (H[6] + g) >>> 0;
        H[7] = (H[7] + h) >>> 0;
        document.getElementById('hash').innerHTML += "<p><i>Intermediate hash (add final compression loop to original 8 prime root constants)</i>:</p><p class='menlo'> " + ("00000000000000000000000000000000" + H[0].toString(2)).slice(-32) + " " + ("00000000000000000000000000000000" + H[1].toString(2)).slice(-32) + " " + ("00000000000000000000000000000000" + H[2].toString(2)).slice(-32) + " " + ("00000000000000000000000000000000" + H[3].toString(2)).slice(-32) + " " + ("00000000000000000000000000000000" + H[4].toString(2)).slice(-32) + " " + ("00000000000000000000000000000000" + H[5].toString(2)).slice(-32) + " " + ("00000000000000000000000000000000" + H[6].toString(2)).slice(-32) + " " + ("00000000000000000000000000000000" + H[7].toString(2)).slice(-32) + " " + "</p>"
    }

    // convert H0..H7 to hex strings (with leading zeros)
    for (let h = 0; h < H.length; h++) { H[h] = ('00000000' + H[h].toString(16)).slice(-8) };
    document.getElementById("hex").innerHTML = "<h3>Stage 3</h3>"
    document.getElementById("hex").innerHTML += "<p><i>Convert intermediate hash to hex</i>:</p> " + H.toString().replaceAll(',', ' ') + "</p>";

    // concatenate H0..H7, with separator if required
    const separator = opt.outFormat == 'hex-w' ? ' ' : '';

    document.getElementById("hex").innerHTML += "<h3>Final hash</h3>" + H.join(separator);
    //return H.join(separator);
};

/*
* Right-rotate (circular right shift) value x by n positions
*/
function ROTR(n, x) {
    return (x >>> n) | (x << (32 - n)); // bitwise OR super neat in this case
    // ie for 16bit binary
    // 0110011001011010, right shift 4 == 0000011001100101
    // 0110011001011010, left shift 12 == 1010000000000000
    // bitwise OR of both shifts       == 1010011001100101 
    // compare to original             ==     011001100101 1010
};

/*
* logical functions
*/
function Σ0(x) { return ROTR(2, x) ^ ROTR(13, x) ^ ROTR(22, x); }
function Σ1(x) { return ROTR(6, x) ^ ROTR(11, x) ^ ROTR(25, x); }
function σ0(x) { return ROTR(7, x) ^ ROTR(18, x) ^ (x >>> 3); }
function σ1(x) { return ROTR(17, x) ^ ROTR(19, x) ^ (x >>> 10); }
function Ch(x, y, z) { return (x & y) ^ (~x & z); }          // 'choice'
function Maj(x, y, z) { return (x & y) ^ (x & z) ^ (y & z); } // 'majority'


const input = document.getElementById("usrIn");
input.addEventListener('keyup', function () {
    hash(input.value);
});

function toggleshow(id) {
    id.classList.toggle("show");
}
