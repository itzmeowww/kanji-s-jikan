const isKanji = (text: string): Boolean => {
  //   console.log(`checking kanji ${text}`);
  for (let i = 0; i < text.length; i++) {
    let ch = text[i];
    if (
      (ch >= "\u4e00" && ch <= "\u9faf") ||
      (ch >= "\u3400" && ch <= "\u4dbf")
    ) {
    } else {
      return false;
    }
  }

  return true;
};

export { isKanji };
