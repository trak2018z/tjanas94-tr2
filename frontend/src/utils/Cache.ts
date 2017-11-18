import hash from "object-hash"
import idb from "idb-keyval"
import stores from "stores"

export default class Cache {
  public static save(model: string, query: any, data: any) {
    return idb.set(this.getHash(model, query), data)
  }

  public static get(model: string, query: any) {
    return idb.get(this.getHash(model, query))
  }

  private static getHash(model: string, query: any) {
    return `${hash(stores.userStore.user.email)}:${model}:${hash(query)}`
  }
}
