export declare const checkType: (filename: string, ext: string) => boolean;
export declare const isMD: (filename: string) => boolean;
export declare const isSFC: (filename: string) => boolean;
export declare const isJsx: (filename: string) => boolean;
export declare const isTsx: (filename: string) => boolean;
export declare const isJs: (filename: string) => boolean;
export declare const isLess: (filename: string) => boolean;
export declare const isDir: (filename: string) => boolean;
export declare const isFile: (filename: string) => boolean;
export declare const replaceExt: (filename: string, ext: string) => string;
export declare const removeDirs: (dirs: Array<string>) => Promise<any[]>;
export declare const easyReadFileSync: (filename: string) => any;
export declare const easyAppendFileSync: (filename: string, content: string) => void;
