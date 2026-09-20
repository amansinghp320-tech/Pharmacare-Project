document.addEventListener("DOMContentLoaded", function () {
  const profileForm = document.getElementById("profile-form");
  const appSettingsForm = document.getElementById("app-settings-form");

  profileForm.addEventListener("submit", function (event) {
    event.preventDefault();
    // In a real app, you would send this data to a server
    alert("Profile settings saved successfully!");
  });

  appSettingsForm.addEventListener("submit", function (event) {
    event.preventDefault();
    // In a real app, you would save these settings locally or on a server
    alert("Application settings saved successfully!");
  });
});
