import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  secretKey = "YourSecretKeyForEncryption&Descryption";
  constructor() { }

  encrypt(value : string) : string{
    return CryptoJS.AES.encrypt(value, this.secretKey.trim()).toString();
  }

  encryptURL(value : string) : string{
    return encodeURIComponent(CryptoJS.AES.encrypt(value, this.secretKey.trim()).toString());
  }

  decrypt(textToDecrypt : string){
    return CryptoJS.AES.decrypt(textToDecrypt, this.secretKey.trim()).toString(CryptoJS.enc.Utf8);
  }

  decryptURL(textToDecrypt : string){
    return CryptoJS.AES.decrypt(decodeURIComponent(textToDecrypt), this.secretKey.trim()).toString(CryptoJS.enc.Utf8);
  }
}