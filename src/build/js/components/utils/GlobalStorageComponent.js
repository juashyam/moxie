import Alpine from "alpinejs";

export const name = "globals";

const globals = () => {
  return Alpine.store('globals')
}
export default globals;