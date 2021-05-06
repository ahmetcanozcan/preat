import Variable, { OnChangeEvent } from "./variable";

export default function bind(variable: Variable<any>, element: string | any) {
  if (typeof element == "string")
    element = document.querySelector(element) as any;

  let elemEvent = (e: any) => {
    variable.set(e.target.value);
  };
  element.addEventListener("keyup", elemEvent);

  let varEvent = new OnChangeEvent((n) => {
    element.value = variable.get().toString();
  });
  variable.addOnChangeEvent(varEvent);
  element.value = variable.get().toString();

  return function () {
    variable.removeOnChangeEvent(varEvent);
    element.removeEventListener("keyup", elemEvent);
  };
}
