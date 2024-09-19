import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { message, Upload } from 'antd';
import { uploadFile, useAppDispatch, useAppSelector, getFileExtension } from '../../common'
import { setFileName, setState, setFileUrl } from '../../store/reducers/global'
import { State } from '../../types';
import CryptoJS from 'crypto-js'


import './index.css';

const { Dragger } = Upload;

// 文件大小限制（单位：字节）
const maxSize = 300 * 1024 * 1024; // 300MB

const beforeUpload = (file: File) => {
  const exceed = file.size < maxSize;
  if (!exceed) {
    const msg = '文件过大!';
    throw new Error(msg);
  }
  return exceed;
}


const MyUpload = () => {
  const state = useAppSelector((state) => state.global.state)
  const fileName = useAppSelector((state) => state.global.fileName)
  const dispatch = useAppDispatch()

  const onClickNext = () => {
    if (!fileName) {
      return message.error('Please upload a file first')
    }
    dispatch(setState(State.Selecting))
  }


  const props: UploadProps = {
    name: 'file',
    maxCount: 1,
    multiple: false,
    accept: ".mp3,.wav,.flac,.aac,.pcm,.ogg,.amr,.asf",
    // directory: true, // 当网站部署时
    customRequest: async ({ file, onSuccess, onError }: any) => {
      try {
        beforeUpload(file);
        const finFileName = CryptoJS.MD5(`${Date.now()}_${file.name}`).toString() + "." + getFileExtension(file); // 生成唯一的文件名
        const response = await uploadFile(file, finFileName);
        onSuccess(response, file);
      } catch (err) {
        onError(err);
      }
    },
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        console.log("done", info)
        const fileUrl = info.file.response
        const fileName = info.file.name
        dispatch(setFileUrl(fileUrl))
        dispatch(setFileName(fileName))
        console.log("---------------------------------------")
        console.log(`fileName:${fileName}, fileUrl:${fileUrl}`,)
        console.log("---------------------------------------")
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  return <div>
    <Dragger {...props}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">Click to upload or drag the file here</p>
      <p className="ant-upload-hint">
        Supported formats: mp3,wav,flac,aac,pcm,ogg,arm,asf (The size must not exceed 300MB)
      </p>
    </Dragger>
    {fileName ? <div className='upload-button-wrapper'>
      <div className='next-button' onClick={onClickNext}>Next step</div>
    </div> : null}
  </div>
}


export default MyUpload;
