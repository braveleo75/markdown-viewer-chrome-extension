const getPlantUMLServerUrl = async () => {
  return new Promise((resolve) => {
    chrome.storage.sync.get(["plantUmlServerUrl"], function (result) {
      const serverUrl = result.plantUmlServerUrl || "http://172.17.32.209:5000";
      resolve(serverUrl);
    });
  });
};

const setPlantUmlServerUrl = async(plantUmlServerUrl) => {
    return new Promise((resolve) => {
        const serverUrl = plantUmlServerUrl || "http://172.17.32.209:5000";
        chrome.storage.sync.set({ plantUmlServerUrl: serverUrl }, () => {
            resolve();
        });
    });
};

