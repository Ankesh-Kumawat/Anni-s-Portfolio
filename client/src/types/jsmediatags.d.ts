declare module 'jsmediatags' {
    interface Picture {
        format: string;
        type: string;
        description: string;
        data: Uint8Array;
    }

    interface Tags {
        title?: string;
        artist?: string;
        album?: string;
        year?: string;
        genre?: string;
        picture?: Picture;
        track?: string;
        [key: string]: any;
    }

    interface TagResult {
        type: string;
        tags: Tags;
    }

    interface ReadOptions {
        onSuccess: (tag: TagResult) => void;
        onError: (error: Error) => void;
    }

    export function read(file: string | File | Blob, options: ReadOptions): void;
}
