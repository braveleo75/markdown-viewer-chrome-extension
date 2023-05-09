
document.getElementById("saveSettings").addEventListener("click", async () => {
    const plantUmlServerUrl = document.getElementById("plantUmlServerUrl").value;

    const currentServerURL = await getPlantUMLServerUrl();
    await setPlantUmlServerUrl(plantUmlServerUrl || currentServerURL);
});

document.addEventListener('DOMContentLoaded', async () => {
  const plantUmlServerUrlInput = document.getElementById('plantUmlServerUrl');
  const saveSettingsButton = document.getElementById('saveSettings');

  plantUmlServerUrlInput.value = await getPlantUMLServerUrl();

  saveSettingsButton.addEventListener('click', async () => {
    const plantUmlServerUrl = plantUmlServerUrlInput.value.trim();

    if (plantUmlServerUrl) {
      await setPlantUmlServerUrl(plantUmlServerUrl);
      window.close();
    }
  });
});


