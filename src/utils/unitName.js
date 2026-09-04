const UNIT_NAME_KEY = "unitName";

export function getUnitName() {
  return localStorage.getItem(UNIT_NAME_KEY) || "";
}

export function setUnitName(name) {
  localStorage.setItem(UNIT_NAME_KEY, name);
}
