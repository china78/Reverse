const fetchVersion = async () => {
  try {
    const response = await fetch("/version.json");
    const { version } = await response.json();
    const localStorageVersion = localStorage.getItem("version");

    if (version !== localStorageVersion) {
      const timestamp = Date.now();
      const queryParams = `?version=${version}&timestamp=${timestamp}`;

      window.location.search = queryParams;
      localStorage.setItem("version", version);
    }
  } catch (error) {
    console.error("Error fetching version:", error);
  }
};

fetchVersion();