/* eslint-disable complexity */

const wrap = require('word-wrap');

const MAX_LINE_WIDTH = 72;

/**
 * Join affect packages
 * @param {object} state.answers
 * @returns string.
 */
const makeAffectsLine = function ({packages: selectedPackages}) {
  if (selectedPackages && selectedPackages.length) {
    return `\naffects: ${selectedPackages.join(', ')}`;
  }

  return '';
};

const makeAffectsLineStr = function ({packages: selectedPackages}) {
  if (selectedPackages && selectedPackages.length) {
    return `${selectedPackages.join(', ')}`;
  }
  return '';
};

const formatCommitMessage = (state) => {
  const {config, answers} = state;
  const wrapOptions = {
    indent: '',
    trim: true,
    width: MAX_LINE_WIDTH
  };

  const emoji = config.types[answers.type].emoji;
  const scope = answers.scope ? '(' + answers.scope.trim() + ')' : '';
  const subject = answers.subject.trim();
  const type = answers.type;

  const format = config.format;

  const affectsLine = makeAffectsLine(answers);
  let packages = makeAffectsLineStr(answers);
  packages = packages ? '(' + packages.trim() + ')' : '';

  // Wrap these lines at MAX_LINE_WIDTH character
  const body = wrap((answers.body || '') + affectsLine, wrapOptions);
  const breaking = wrap(answers.breaking, wrapOptions);
  const issues = wrap(answers.issues, wrapOptions);

  // @note(emoji) Add space after emoji (breakingChangePrefix/closedIssueEmoji)
  const head = format
    .replace(/\{emoji\}/g, config.disableEmoji ? '' : emoji + ' ')
    .replace(/\{packages\}/g, packages)
    .replace(/\{scope\}/g, scope)
    .replace(/\{subject\}/g, subject)
    .replace(/\{type\}/g, type);

  let msg = head;

  if (body) {
    msg += '\n\n' + body;
  }

  if (breaking) {
    const breakingEmoji = config.disableEmoji ? '' : config.breakingChangePrefix;

    msg += '\n\nBREAKING CHANGE: ' + breakingEmoji + breaking;
  }

  if (issues) {
    const closedIssueEmoji = config.disableEmoji ? '' : config.closedIssuePrefix;

    msg += '\n\n' + closedIssueEmoji + config.closedIssueMessage + issues;
  }

  return msg;
};

module.exports = formatCommitMessage;
