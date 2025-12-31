/* eslint-disable @typescript-eslint/require-await */
import { Uploader, UploadParams } from '@/domain/application/storage/uploader';
import { randomUUID } from 'node:crypto';

interface Upload {
  fileName: string;
  url: string;
}

export class FakeUploader implements Uploader {
  public uploads: Upload[] = [];

  async upload({ fileName }: UploadParams): Promise<{ url: string }> {
    const url = `http://fake-storage-bucket.com/${randomUUID()}-${fileName}`;

    this.uploads.push({
      fileName,
      url,
    });

    return { url };
  }
}
