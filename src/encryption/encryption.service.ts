import { Injectable } from '@nestjs/common';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class EncryptionService {
  encrypt(arg0: string): any {
    throw new Error('Method not implemented.');
  }
  private readonly secretKey = process.env.ENCRYPTION_SECRET || 'chave-secreta';

  encryptAES(text: string): string {
    return CryptoJS.AES.encrypt(text, this.secretKey).toString();
  }

  decryptAES(ciphertext: string): string {
    const bytes = CryptoJS.AES.decrypt(ciphertext, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
