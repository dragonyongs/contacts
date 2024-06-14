export function setupUI() {
  const appModalInput = document.querySelector("app-modal-input");
  const appModalButtons = document.querySelectorAll("app-button");
  const importFileInput =
    appModalInput.shadowRoot.getElementById("import_file");

  let importButton;
  let exportButton;
  let applyButton;

  appModalButtons.forEach((button) => {
    if (button.id === "export_button") {
      exportButton = button;
    } else if (button.id === "import_button") {
      importButton = button;
    } else if (button.id === "apply_button") {
      applyButton = button;
    }
  });

  importButton.addEventListener("click", () => importFileInput.click());

}
