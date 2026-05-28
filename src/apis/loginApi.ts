import request from '@/plugins/request';

const v1 = window.videoIP ?? 'http://localhost:6130/';

const loginModule = {
  faceRecognition: () => request.post(`${v1}/fc/face-identify-result`),
};

export { loginModule };
