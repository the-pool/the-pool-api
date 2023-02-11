export class CommonHelper {
  setSeparator(separator: string, ...strings: string[]): string {
    return strings.join(separator);
  }
}
