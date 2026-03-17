import { AirLearnAPIClient } from "../api-client/api-client.js";

// fetch learned lexemes data
let apiClient: AirLearnAPIClient = new AirLearnAPIClient();
apiClient.fetchAndSaveWords();
