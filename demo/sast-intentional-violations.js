/**
 * Frogbot / SAST demo only — deliberately insecure patterns.
 * Do not copy; not used by the app at runtime.
 */

const { exec } = require('child_process');

/** Violation 1: OS command injection (user input concatenated into shell command). */
function demoRunUserPing(userHost) {
  const cmd = 'ping -c 1 ' + userHost;
  exec(cmd, () => {});
}

/** Violation 2: Code injection (eval on user-controlled string). */
function demoEvalUserExpression(expression) {
  return eval(expression);
}

module.exports = { demoRunUserPing, demoEvalUserExpression };
