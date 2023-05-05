module.exports = {
  Cookware: {
    cleaningInstructions(cookware, _, { dataSources }) {
      return dataSources.cookwareAPI.getInstructionsForCookware(cookware.name);
    },
    __resolveReference(cookwareRepresentation, { dataSources }) {
      const { name } = cookwareRepresentation;
      try {
        const cookware = dataSources.cookwareAPI.getCookwareByName(name);
        return cookware;
      } catch (e) {
        return new Error(e);
      }
    },
  },
};
