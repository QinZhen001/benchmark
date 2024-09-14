import { apiGetOSSToken } from "./request"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { message } from 'antd'
import { Engine } from "../types";
// import { apiGetAutoLanguages } from "./request";
// import CryptoJSMd5 from 'crypto-js/md5';

let s3Client: any
let globalBucketName: string = ""
let globalRegion: string = ""
let createTime: number = 0

const duration = 10 * 60 * 1000

export const initS3Client = async () => {
  if (createTime) {
    const now = Date.now()
    if (now - createTime < duration) {
      if (s3Client) {
        return s3Client
      }
    }
  }
  createTime = Date.now()
  const data = await apiGetOSSToken()
  const { accessKeyId, bucketName, expiration, region, secret, sessionToken } = data

  s3Client = new S3Client({
    region: region,
    credentials: {
      accessKeyId: accessKeyId,
      secretAccessKey: secret,
      sessionToken: sessionToken
    },
  });

  globalBucketName = bucketName
  globalRegion = region

  return s3Client
}


export const uploadFile = async (file: File) => {
  try {
    if (!s3Client) {
      await initS3Client()
    }
    const fileKey = `${Date.now()}_${file.name}`; // 生成唯一的文件名
    const uploadParams = {
      Bucket: globalBucketName, // 你的 S3 存储桶名称
      Key: fileKey, // 上传到 S3 的文件键（名称）
      Body: file, // 文件内容
    };
    const command = new PutObjectCommand(uploadParams);
    const response = await s3Client.send(command);

    const fileUrl = `https://${globalBucketName}.s3.${globalRegion}.amazonaws.com/${fileKey}`;
    console.log('文件url', fileUrl);

    return fileUrl;
  } catch (err) {
    message.error(`${file.name} 上传失败`);
    console.error('上传文件时出错', err);
  }
}


export const getCurrentDate = () => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // getMonth() 返回 0-11, 需要 +1
  const day = String(now.getDate()).padStart(2, '0'); // getDate() 返回 1-31

  return {
    year: year,
    month: month,
    day: day
  };
}


export const langToEngineList = async (lang: string): Promise<Engine[]> => {
  if (lang == "auto") {
    return [
      // Engine.SuntownEnhance
    ]
  } else if (lang == "en-US" || lang == "ko-KR" || lang == "zh-CN" || lang == "es-ES"
    || lang == "fr-FR" || lang == "it-IT" || lang == "pt-PT") {
    return [
      Engine.SuntownEnhance,
      Engine.SuntownStandard,
      Engine.Azure,
      // Engine.Sonix
    ]
  } else {
    return [
      Engine.SuntownEnhance,
      Engine.SuntownStandard,
      Engine.Azure,
    ]
  }
  // return []
}


export const downloadText = async (content: string, fileName: string = "file.txt"): Promise<void> => {
  // 创建一个 Blob 对象
  const blob = new Blob([content], { type: 'text/plain' });

  // 创建一个下载链接
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = fileName;

  // 触发下载
  document.body.appendChild(downloadLink);
  downloadLink.click();

  // 释放 URL 对象
  URL.revokeObjectURL(downloadLink.href);

  // 移除下载链接
  document.body.removeChild(downloadLink);
}
