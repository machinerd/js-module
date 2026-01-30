export function formatBytes(bytes: number, decimals = 0) {
  if (bytes == 0) return '0 Bytes';
  const k = 1024,
    dm = decimals,
    sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export const getFilename = (s: string) => {
  return s.split('.').slice(0, -1).join('.');
};

export const getFileExtension = (s: string) => {
  return s.split('.').pop();
};

interface PathInfo {
  directory: string;
  filename: string;
  extension: string;
  filenameWithoutExtension: string;
}

export const parsePath = (filepath: string, folder?: string): PathInfo => {
  const result = {
    directory: '',
    filename: '',
    extension: '',
    filenameWithoutExtension: '',
  };

  const lastSlashIndex = filepath.lastIndexOf('/');
  const filename =
    lastSlashIndex >= 0 ? filepath.substring(lastSlashIndex + 1) : filepath;

  const lastDotIndex = filename.lastIndexOf('.');
  const extension =
    lastDotIndex > 0 ? filename.substring(lastDotIndex + 1) : '';
  const filenameWithoutExtension =
    lastDotIndex > 0 ? filename.substring(0, lastDotIndex) : filename;

  result.filename = filename;
  result.extension = extension;
  result.filenameWithoutExtension = filenameWithoutExtension;

  if (filepath.startsWith('http')) {
    const cdnPath = folder ? `/${folder}/` : '/';
    const cdnIndex = filepath.indexOf(cdnPath);
    if (cdnIndex !== -1) {
      const afterCdn = filepath.substring(cdnIndex + cdnPath.length);
      const lastSlashIndex = afterCdn.lastIndexOf('/');

      result.directory =
        lastSlashIndex !== -1 ? afterCdn.substring(0, lastSlashIndex) : '';

      return result;
    }
  }

  result.directory =
    lastSlashIndex !== -1 ? filepath.substring(0, lastSlashIndex) : '';
  return result;
};
