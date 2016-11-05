export default class {
  constructor(name_) {
    this.name = name_;
  }

  version() {
    return `v:${this.name}`;
  }
}
