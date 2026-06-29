export const getEntityId = (value) =>
  value?.touristId ||
  value?.centreId ||
  value?.centerId ||
  value?.id ||
  value?._id ||
  value?.tourist?.id ||
  value?.tourist?._id ||
  value?.touristCentre?.id ||
  value?.touristCentre?._id ||
  value?.data?.touristId ||
  value?.data?.id ||
  value?.data?._id ||
  null;

const centreStorageKeys = [
  "latestTouristId",
  "selectedCentreId",
  "centreId",
  "touristId",
];

export const getStoredCentreId = () =>
  centreStorageKeys.map((key) => localStorage.getItem(key)).find(Boolean) ||
  null;

export const persistCentreId = (centreId) => {
  if (!centreId) return;

  centreStorageKeys.forEach((key) => localStorage.setItem(key, centreId));
  localStorage.setItem("vendorHasCentre", "true");
};

export const clearPersistedCentreId = () => {
  centreStorageKeys.forEach((key) => localStorage.removeItem(key));
  localStorage.removeItem("vendorHasCentre");
};

export const resolveCentreId = (...sources) => {
  for (const source of sources) {
    if (Array.isArray(source)) {
      const id = resolveCentreId(...source);
      if (id) return id;
      continue;
    }

    const id = getEntityId(source);
    if (id) return id;
  }

  return getStoredCentreId();
};

export const resolveCentreIdFromSources = (...sources) => {
  for (const source of sources) {
    if (Array.isArray(source)) {
      const id = resolveCentreIdFromSources(...source);
      if (id) return id;
      continue;
    }

    const id = getEntityId(source);
    if (id) return id;
  }

  return null;
};

export const resolveCentreIdsFromSources = (...sources) => {
  const ids = [];

  const addId = (id) => {
    if (id && !ids.includes(id)) ids.push(id);
  };

  const visit = (source) => {
    if (!source) return;

    if (Array.isArray(source)) {
      source.forEach(visit);
      return;
    }

    addId(getEntityId(source));
  };

  sources.forEach(visit);

  return ids;
};

export const resolveCentreIds = (...sources) => {
  const ids = resolveCentreIdsFromSources(...sources);
  const storedId = getStoredCentreId();
  if (storedId && !ids.includes(storedId)) ids.push(storedId);

  return ids;
};