// Helper Class For All The Utility Functions

export default class Helper {
  static async handle(func) {
    let out = null;
    try {
      const res = await func();
      out = {
        status: "SUCCESS",
        result: res,
      };
    } catch (error) {
      out = {
        status: "ERROR",
        result: error,
      };
    }
    return out;
  }

  static getPurgedData(schema, data) {
    let out = {};
    Object.keys(schema).forEach((k) => {
      if (data.hasOwnProperty(k)) {
        out[k] = data[k];
      }
    });
    return out;
  }
}
