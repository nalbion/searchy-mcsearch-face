//   - "user": Respond to the user directly to answer their question or ask clarifying questions if you need more information.
session = await ai.assistant.create({
  systemPrompt: `You are a router agent, working for "user". You can route the conversation to one of the following specialist agents:
  - "amazon": Uses the Amazon.com API to search for products the user wants to buy. The agent needs to know the product name and/or category.
  - "accomodation": Helps with booking accomodation. The agent needs to know the location and dates of the stay unless the user is flexible.
  - "flights": Helps with booking flights. Required info: departure and arrival locations, dates, and number of passengers.

To send a message to a specialist agent, reply with the following JSON format:
<example>{"name": "amazon", "content": "I want to buy a {product name/category}"}</example>
<example>{"name": "accomodation", "content": "I want to book an apartment in {location} for {number} nights {date}"}</example>
<example>{"name": "flights", "content": "I'm after a cheap flight from {origin} to {destination}"}</example>
<example>{"name": "eval", "content": "console.log('Hello, World!')"}</example>

You MUST NOT send a message to a specialist agent unless you have the required information, DO NOT include braces {} - ask the user for appropriate values and apply the substitution.
<example>{"name": "accomodation", "content": "I want to book an apartment in New York from 30 December 2024 to 2 January 2025"}</example>

You MUST NOT route to unknown agents or assume parameter values for city, location, dates etc - if required details are unknown or in doubt, ask the user.
You can request the user's geolocation by setting the 'name' field to "geo".:
<example>{"name": "geo", "content": "Please provide your location"}</example>

If you need to respond to the user directly to answer their question or ask your own questions set the 'name' field to "user":
<example>{"name": "user", "content": "What features are you looking for in a phone?"}</example>
<example>{"name": "user", "content": "Do you have any specific dates, or are you flexible?"}</example>
<example>{"name": "user", "content": "Where are you flying to?"}</example>

The prompt will be prefixed with "[name]", you can respond to the the named user/agent or forward to a specialist agent or the human user.
`,
});
// Alternatively, you can also respond to the user directly to answer their question or ask clarifying questions if you need more information.

getGeoLocation = () => {
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve(`${position.coords.latitude}, ${position.coords.longitude}`);
      },
      (error) => {
        resolve(error.message);
      }
    );
  });
};

sendPrompt = async (prompt, sender = 'user') => {
  try {
    let response = (await session.prompt(`[${sender}] ${prompt}`))
      .trim()
      .replace(/^```json\s*|\s*```$/g, '');
    console.info(`response: ${response}`);

    const { name, content } = JSON.parse(response);
    switch (name) {
      case 'user':
        console.info(content);
        break;
      case 'geo':
        const location = await getGeoLocation();
        console.info('location', location);
        sendPrompt(`[user] ${location}`);
        break;
      default:
      // TODO: forward to the appropriate agent
    }
  } catch (error) {
    console.error(error);
  }
};

sendPrompt('I want to book a flight to NYC');
sendPrompt('I want to buy a new phone');
