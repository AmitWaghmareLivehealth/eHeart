
export function getFileExtFromMIME (mime):string {
  switch (mime) {
    case 'application/pdf':
      return '.pdf'
    case 'image/jpeg':
    case 'image/png':
    case 'image/jpg':
      return '.jpg'
    default:
      return '.tmp'
  }
}
