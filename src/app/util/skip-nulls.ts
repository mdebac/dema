export class Util{

  static skipNulls(obj:any):any{
    return Object.keys(obj).forEach(key => {
      if (obj[key] === undefined || obj[key]===null) {
        delete obj[key];
      }
    });
  }
}
