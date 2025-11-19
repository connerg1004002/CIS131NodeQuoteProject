const fs = require('node:fs');
const axios = require('axios');


const quoteCacheLoc = './cachedQuotes.json';
const quoteLink = 'https://zenquotes.io/api/random';
const lineLength = 50;
const authorOffsetBegin = Math.floor(lineLength / 4);
const lineVert = '\u2575';
const lineHori = '\u2576';
const lineTopRight = '\u256e';
const lineBottomRight = '\u256f';
const lineTopLeft = '\u256d';
const lineBottomLeft = '\u2570';





function getCachedRandomQuote() {
  if (fs.existsSync(quoteCacheLoc) == false)
    return null;

  let quoteStrBlock = null;
  let quoteObj = null;

  try {
    quoteStrBlock = fs.readFileSync(quoteCacheLoc).toString();
  } catch (ex) {
    console.error(ex);
    return null;
  }
  quoteObj = JSON.parse(quoteStrBlock);

  return quoteObj.quoteArray[Math.floor(Math.random() * quoteObj.quoteArray.length)];
}



function updateCache(responseData) {
  if (fs.existsSync(quoteCacheLoc) == false)
    return null;

  let quoteStrBlock = null;
  let quoteObj = null;
  let file = null;

  try {

    quoteObj = JSON.parse(fs.readFileSync(quoteCacheLoc).toString());

    if (quoteObj.updateIndex >= 50)
      quoteObj.updateIndex = 0;
    quoteObj.quoteArray[quoteObj.updateIndex] = responseData;
    quoteObj.updateIndex++;

    quoteStrBlock = JSON.stringify(quoteObj, null, '  ');
    file = fs.openSync(quoteCacheLoc, 'w+');
    fs.writeFileSync(file, quoteStrBlock);
    fs.closeSync(file);

  } catch (ex) {
    console.error(ex);
  }

  return;
}



function splitSpacingIntoQuote(quote, lineBegin, lineEnd) {
  let words = quote.split(' ');
  let str = lineBegin;
  let curLineLength = 0;

  for (word of words) {
    if (curLineLength + word.length >= lineLength) {
      str += (' ').repeat(lineLength - curLineLength) + lineEnd + lineBegin;
      curLineLength = 0;
    }
    str += word;
    curLineLength += word.length;
    if (curLineLength < lineLength) {
      str += ' ';
      curLineLength++;
    }
  }

  str += (' ').repeat(lineLength - curLineLength) + lineEnd;
  return str;
}



function fancyPrintQuote(data) {
  let quote = splitSpacingIntoQuote(data.q, '\u2575 ', '\u2575\n');
  quote = lineTopLeft + lineHori.repeat(lineLength + 1) + lineTopRight + '\n' + quote + lineBottomLeft + lineHori.repeat(lineLength + 1) + lineBottomRight;
  console.log('\n\n\n' + quote);


  console.log(lineHori.repeat(authorOffsetBegin) + ' ' + data.a + ' ' + lineHori.repeat(lineLength - data.a.length - authorOffsetBegin) + '\n');
}



function getQuote() {
  let data = null;

  axios.get(quoteLink).then(response => {
    data = response.data[0];
    updateCache(data);
  }).catch(() => {
    data = getCachedRandomQuote();
  }).finally(() => {
    fancyPrintQuote(data);
  });
}




getQuote();