// Toast
const toast = document.querySelector("[data-toast]");
let toastTimeout;

toast.addEventListener("click", e => {
  if (e.target.closest(".toast__close")) hideToast();
});

function displayToast(text) {
  toast.querySelector(".toast__message").textContent = text;
  toast.classList.remove("hidden");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(hideToast, 5000);
}
function hideToast() {
  clearTimeout(toastTimeout);
  toast.classList.add("hidden");
}

// Form / validation
const form = document.getElementById("form");

form.addEventListener("submit", e => {
  e.preventDefault();
  if (e.target.classList.contains("form--continue")) {
    displayToast("Continue to somewhere else which I do not know the destination of...");
    return;
  }

  const error = validate(e.target);
  const errArray = Object.keys(error);
  if (!errArray.length) {
    validationPassed(e.target);
    return;
  }
  errArray.forEach(prop => {
    const errElement = document.querySelector(`[data-error="${prop}"]`)
    if (!errElement) return;
    errElement.classList.remove("hidden");
    e.target[prop].classList.add("error");
    errElement.textContent = error[prop] === "empty"
      ? "Can't be blank"
      : "Wrong format, numbers only"
  });
});

form.addEventListener("input", e => {
  const {src, pattern, initial} = e.target.dataset;
  if (!src) return;

  const target = document.querySelector(`[data-target="${src}"]`);
  const errElement = document.querySelector(`[data-error="${e.target.name}"]`);
  errElement?.classList.add("hidden")
  e.target.classList.remove("error");

  if (e.target.value.length === 0) {
    target.textContent = pattern || initial || "N/A";
    return;
  }

  if (pattern) {
    const maxLength = pattern.length;
    if (e.target.value.length > maxLength) e.target.value = e.target.value.substring(0, maxLength);
    e.target.value = patternConvert(e.target.value, pattern);
  }
  target.textContent = e.target.value;
});

function validationPassed(form) {
  form.classList.add("form--continue");
}

function patternConvert(str, pattern) {
  const patternArray = pattern.split("");
  let index = 0;
  const newStr = patternArray
    .map(item => {
      if (str.length <= index) return null;
      if (str[index] === " ") return str[index++];
      if (item === " ") return " ";
      return str[index++];
    })
    .filter(item => item !== null)
    .join("")

  return newStr;
}

function validate({name, number, month, year, cvc}) {
  const error = {}

  if (!validatePattern(number)) error.number = "pattern";
  if (!validatePattern(month)) error.month = "pattern";
  if (!validatePattern(year)) error.year = "pattern";
  if (!validatePattern(cvc)) error.cvc = "pattern";
  
  if (!name.value) error.name = "empty";
  if (!number.value) error.number = "empty";
  if (!month.value) error.month = "empty";
  if (!year.value) error.year = "empty";
  if (!cvc.value) error.cvc = "empty";

  return error;
}

function validatePattern(item) {
  let str = item.value;
  let pattern = item.dataset.pattern;
  if (str.length !== pattern.length) return false;
  str = str.split(" ");
  pattern = pattern.split(" ");
  for (let i = 0; i < pattern.length; i++) {
    if (isNaN(Number(str[i]))) return false;
  }
  return true;
}
