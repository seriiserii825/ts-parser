import { TLorem } from "../types/TLorem.js";

export class LoremIpsum {
  private lorem: TLorem[];

  constructor(lorem: TLorem[]) {
    this.lorem = lorem;
  }

  public all() {
    if (this.lorem.length === 0) {
      console.log("No Lorem Ipsum found.");
      return;
    }

    console.log("Lorem Ipsum:");
    this.lorem.forEach((item, index) => {
      const words =
        item.words.trim().length > 50 ? item.words.trim().slice(0, 50) + "..." : item.words.trim();
      console.log(`${index + 1}. class: ${item.element}, text: "${words}"`);
    });
  }
}
