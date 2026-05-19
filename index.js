const App = require("./app");
const appConfig = require("./config/appConfig");

// Start the server
App.listen(appConfig.port, () => {
  console.log(`Server is running on http://localhost:${appConfig.port}`);
});