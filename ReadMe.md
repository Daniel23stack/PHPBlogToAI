PHP Blog to AI Scrapper.


To set up this software to scrape your PHP blog for conversion, simply change the url and classes in the globalParams. 
The application is best used if you understand HTML. as it hunts for HTML information and scrapes it into both a text file and a globalsParams json.

This program is run by using the console command 'npm start'.

Explaining global parameters:

url: This is the URL of the website where the content is hosted. If you were scraping articles, the URL would be https://test.foobar/articles.

linkClass: This is the class that contains the link to the articles on the page, therefore it is most likely ".articlesTitle a" that targets the link element.

phpNavigator: This is notable because it controls how many pages are displayed and can be sorted through multiple links, allowing the program to capture all of the article links. Here's an example: 'https://text.forbar/articles&article=0'. The '&article=0' represents our navigation.

phpNavIncrement: Suppose the number of articles presented to a user is 5 every navigator page. To match the amount increased by clicking the next button on the web page, adjust the phpNavIncrement value accordingly. So we'd set it at 5.

idContainingContent: Because this is designed to pull the page's content, it will pull everything under the main area. In this example, it would be the base of "article".

chapterSelector: Many PHP article sites have numerous chapters that can be navigated to; in this case, it would be "select[name='chapter']".

chapterOffset: Many php article sites offer a URL parameter for managing the site's chapters, which is appended to the end. An example is https://test.foobar/articles?article=1&chapter=5. We would be concerned with the &chapter in this case because the link class would have obtained the article numbers.

ins: This is the instruction you want the material to include when it is written in alpaca form.
