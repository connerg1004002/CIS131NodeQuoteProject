# Node quote project for CIS131
### In this project I have a quote generator that pulls from the ZenQuotesAPI
 
## Pulling
* First an attempt is made to get a single random quote from the API 
* There is a cached block of 50 quotes that does a rolling update loop as successful quotes are pulled from the API.
* If a pull is not successful a random quote is taken from the cache.


## Formatting
* When a quote has been found, line breaks and UTF8 light lines are added as a border.
* For the author light horizontal lines are first added to a 1/4th the length of the line length.
* The author name and spacing around is then added
* Remaining lines are added to fill remaining space