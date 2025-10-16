## where are the places you could do better?

### The extendable and more features of components

If implementing a real components library, there are a few things that should be considered.

- All components should support size, like `large`, `default`, `small`.
- should support customizable styles by using CSS variables
- document support

From the components' perspective, the enhancements of them are:

- should support icons; for instance, using an icon when the switch shows/hides the status of password input instead of plain text
- Input:
  - should support prefix, suffix, loading
  - The password component should extend from basic `Input`, and apply the show/hide feature by using the suffix.
- Form:
  - The verification should support different trigger times, like on `change`, `blur` or only when `submitting`.
  - should support nested form items
  - should support item group
  - currently when the internal store (value, touched, errors) changes, it bursts force to trigger all the component rerenders, it should trigger more precisely on field level.
  - the validation should support debounce, especially for the validation that invokes an api, like email.
