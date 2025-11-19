const fs = require('node:fs');
const axios = require('axios');


const quoteCacheLoc = './cachedQuotes.json';
const quoteLink = 'https://zenquotes.io/api/random';
const maxCacheUsage = 5;
const blockWord = '\u2575\n\u2575';





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



function addEveryNumOfWords(quote, spacing, addition) {
  let words = quote.split(' ');
  let str = '';
  let i = 1;

  for (word of words) {
    str += word;
    if ((i % spacing) === 0)
      str += addition;
    else
      str += ' ';
    i++;
  }
  return str.trim();
}



function fancyPrintQuote(data) {
  data.q = '\u2575' + data.q;
  let quote = addEveryNumOfWords(data.q, 10, blockWord);
  quote
  console.log(quote, '\n');
  console.log(data.a);
}



function getQuote() {
  let data = null;

  // axios.get(quoteLink).then(response => {
  //   let data = response.data[0];
  //   updateCache(data);

  //   console.log(data);
  // }).catch(() => {
  data = getCachedRandomQuote();
  //}).finally(()=> {
  fancyPrintQuote(data);
  //}
}




getQuote();