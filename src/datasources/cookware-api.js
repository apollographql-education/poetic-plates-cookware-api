const cookwareData = require("./cookware.json"); // from Airtable, exported as JSON using their API
const utils = require("./cookware-utils");

class CookwareAPI {
  // Returns the full list of Cookware objects
  getAllCookware() {
    return cookwareData.map((c) => utils.formattedCookware(c));
  }

  // Returns a Cookware object using the given name
  getCookwareByName(name) {
    const cookware = cookwareData.find((c) => name === c.fields.name);

    if (!cookware) return null;

    return utils.formattedCookware(cookware);
  }

  // Returns a list of Strings - cleaning instructions for a specific cookware
  getInstructionsForCookware(name) {
    const cookware = cookwareData.find((c) => name === c.fields.name);

    if (!cookware) return null;

    return utils.transformInstructions(cookware.fields.cleaningInstructions);
  }
}

module.exports = CookwareAPI;
