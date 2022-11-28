const MICROP = window.MICROP;
const styles = {
  table: {border: "1px solid black"},
  thead: {background: "#333", color: "white"},
  th: {padding: "5px"},
  td: {border: "1px solid black", padding: "5px"}
}
const tests = {
  isDebugLogActivated: assert(MICROP.isDebugLogActivated, true),
  debugLog: assert(MICROP.debugLog("Testing"), undefined),
  lookbehindWorkaround: assert(MICROP.lookbehindWorkaround("[abc]", "[", "]")[0], "abc"),
  getDynamicUrl: assert(MICROP.getDynamicUrl("https://movableink.com/[test_dynamic_field]"), "https://movableink.com/de"),
  getDynamicPath: assert(MICROP.getDynamicPath("a.b.c.[test_dynamic_field]"), "a.b.c.de"),
  evaluateCondition: assert(MICROP.evaluateCondition("[VAL] === true", true, "[VAL]"), true),
  evaluateNegation: assert(MICROP.evaluateNegation("true", true), false)
}
return html`
	<div style=${{fontSize: "16px"}}>
	  <table style=${styles.table}>
	    <thead style=${styles.thead}>
	      <tr>
	        <th style=${styles.th}>FunctionName</th>
	        <th style=${styles.th}>Accepted</th>
        </tr>
      </thead>
      <tbody>
        <tr style=${assertStyle(tests.isDebugLogActivated)}>
          <td style=${styles.td}>isDebugLogActivated</td>
          <td style=${styles.td}>${tests.isDebugLogActivated.toString()}</td>
        </tr>
        <tr style=${assertStyle(tests.debugLog)}>
          <td style=${styles.td}>debugLog</td>
          <td style=${styles.td}>${tests.debugLog.toString()}</td>
        </tr>
        <tr style=${assertStyle(tests.lookbehindWorkaround)}>
          <td style=${styles.td}>lookbehindWorkaround</td>
          <td style=${styles.td}>${tests.lookbehindWorkaround.toString()}</td>
        </tr>
        <tr style=${assertStyle(tests.getDynamicUrl)}>
          <td style=${styles.td}>getDynamicUrl</td>
          <td style=${styles.td}>${tests.getDynamicUrl.toString()}</td>
        </tr>
        <tr style=${assertStyle(tests.getDynamicPath)}>
          <td style=${styles.td}>getDynamicPath</td>
          <td style=${styles.td}>${tests.getDynamicPath.toString()}</td>
        </tr>
        <tr style=${assertStyle(tests.evaluateCondition)}>
          <td style=${styles.td}>evaluateCondition</td>
          <td style=${styles.td}>${tests.evaluateCondition.toString()}</td>
        </tr>
        <tr style=${assertStyle(tests.evaluateNegation)}>
          <td style=${styles.td}>evaluateNegation</td>
          <td style=${styles.td}>${tests.evaluateNegation.toString()}</td>
        </tr>
      </tbody>
    </table>
  </div>
`;

function assert(value, toBe){
  return value === toBe;
}
function assertStyle(assertion){
  if(assertion) return {color: "green"}
  return {color: "red"};
}