import fs from 'fs';

abstract class FileSystemObject {
    entry: fs.Dirent;
}

export class Directory extends FileSystemObject {
    files: File[];
    subdirectories: Directory[];
    basePath: string;
    relativePath: string;
}

export class File extends FileSystemObject {

}

export class SiteEntry {
    baseDirectory: Directory;
}