import { characters } from "./data";

export function getCharacterName(id: number) {
  return characters.find((char) => char.char_id === id)?.name_ko;
}
