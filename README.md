# sec3-homework-1
First homework assignment for Section 3: Hello World.

This first homework assignment will accept requests on the route /hello and provide a welcome message via a JSONifed response. The JSON object returned is defined as:

{
    "name": "Hello friend",
    "welcomeMessage": "Thank you for using my homework assignment"
}

A request to any other route, or an unspecifed route, will return a 404 status code and an empty JSON object.

A query string can be included in the form of
  name=userName
where userName is the actual user's name. If the query key is missing, is not "name", or the valus is not provided, a "friend" string is used in lieu of the userName value.
