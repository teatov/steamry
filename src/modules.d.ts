declare module 'humanhash' {
  export = HumanHasher;
  declare class HumanHasher {
    /**
     * Transforms hex digests to human-readable strings.
     *
     * The format of these strings will look something like:
     * `victor-bacon-zulu-lima`. The output is obtained by compressing the input
     * digest to a fixed number of bytes, then mapping those bytes to one of 256
     * words. A default wordlist is provided, but you can override this if you
     * prefer.
     * As long as you use the same wordlist, the output will be consistent (i.e.
     * the same digest will always render the same representation).
     *
     * @param {Array} wordlist A list of exactly 256 words to choose from
     */
    constructor(wordlist?: string[]);
    wordlist: string[];
    /**
     * Humanize a given hexadecimal digest.
     *
     * Change the number of words output by specifying `words`. Change the
     * word separator with `separator`.
     *
     * @param {String} hexdigest A string of hexadecimal characters to humanize
     * @param {Number} words How many words to output (more = safer)
     * @param {String} separator The string used to seperate the words
     */
    humanize(hexdigest: string, words?: number, separator?: string): string;
    /**
     * Generate a UUID with a human-readable representation.
     *
     * @param words How many words to output (more = safer)
     * @param seperator The string used to seperate the words
     * @param {Number} version What uuid version to use. 4 = random, 1 = timestamp based (not secure but guaranteed uniqueness)
     */
    uuid(
      words?: number,
      seperator?: string,
      version?: number,
    ): {
      humanhash: string;
      uuid: string;
    };
    /**
     * Compress a list of byte values to a fixed target length.
     *
     * @param {Array} bytes A list of bytes (numbers from 0-254)
     * @param {Number} target The number of bytes to return / compress to
     */
    _compress(bytes: number[], target: number): number[];
  }
}
