/**
 * inspect-value
 *
 * Web Component wrapper for svelte-inspect-value.
 * Works in React, Vue, Angular, or plain HTML.
 *
 * Usage (HTML):
 *   <script src="inspect-value.js"></script>
 *   <inspect-value></inspect-value>
 *   <script>
 *     document.querySelector('inspect-value').value = { hello: 'world' };
 *   </script>
 *
 * Usage (React):
 *   import 'inspect-value';
 *   const ref = useRef();
 *   useEffect(() => { ref.current.value = data; }, [data]);
 *   <inspect-value ref={ref} theme="dark" />
 *
 * Usage (Vue):
 *   import 'inspect-value';
 *   <inspect-value :value.prop="data" theme="dark" />
 */

// Importing the .svelte files triggers customElements.define() automatically
// because they have <svelte:options customElement="..."> tags
import './InspectValue.svelte';
import './InspectPanel.svelte';
