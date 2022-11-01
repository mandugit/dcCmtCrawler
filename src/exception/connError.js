//통신 Error
class ConnError extends Error {
    constructor(message) {
      super(message);
      this.name = "ConnError";
    }  
  }

module.exports = ConnError;