const {getAllPackages, getChangedPackages, isMonorepo} = require('../util/monorepo');

exports.createQuestion = (state) => {
  if (!isMonorepo(state)) {
    return null;
  }

  const changedPackages = getChangedPackages(state);
  const allPackages = getAllPackages(state);

  const question = {
    choices: allPackages,
    default: changedPackages,
    message: `The packages that this commit has affected (${changedPackages.length} detected)\n`,
    name: 'packages',
    type: 'checkbox'
  };

  return question;
};
