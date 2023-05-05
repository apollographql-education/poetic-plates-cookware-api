module.exports = {
  Query: {
    allCookware(_, __, { dataSources }) {
      return dataSources.cookwareAPI.getAllCookware();
    },
    cookware(_, { name }, { dataSources }) {
      try {
        const cookware = dataSources.cookwareAPI.getCookwareByName(name);
        return cookware;
      } catch (e) {
        return new Error(e);
      }
    },
  },
};
