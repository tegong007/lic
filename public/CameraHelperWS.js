// eslint-disable-next-line no-unused-vars, unused-imports/no-unused-vars
const CameraHelperWS = (function () {
  let socket;
  let host;
  let paramsInner;

  const sendMsg = function (msg) {
    if (socket) socket.send(msg);
    else console.error('failed to connect the websocket server');
  };
  const EcFaceWS = {
    callback: {
      openCam: [],
      faceCheck: [],
      closeCam: [],
      cropImage: [],
      cropImageAdvance: [],
      snapFrame: [],
      faceCheckAdvance: [],
      enumAllCameras: [],
      startFaceInfoMonitor: [],
      stopFaceInfoMonitor: [],
      showDialog: [],
      hideDialog: [],
      checkLicense: [],
      generateRequest: [],
      activateLicense: [],
      getSn: [],
      startCaptureDialog: [],
      stopCaptureDialog: [],
    },

    initParam(paramsObj) {
      if (paramsObj) {
        host = paramsObj.host;
        paramsInner = paramsObj;
      }
    },
    getSocketStatus() {
      if (socket) return socket.readyState;
    },
    connect(onSucc, onErr) {
      if (typeof socket === 'object' && socket !== null) {
        if (onSucc) {
          onSucc();
        }
        return;
      }
      const that = this;
      onSucc = onSucc || function () {};
      onErr = onErr || function () {};

      socket = new WebSocket(host);
      // CONNECTING:0
      // OPEN:1
      // CLOSING:2
      // CLOSED:3
      socket.onopen = function (_msg) {
        if (socket.readyState === WebSocket.OPEN) {
          if (onSucc) {
            onSucc();
          }
        } else {
          if (onErr) onErr();
        }
      };
      socket.onclose = function (_msg) {
        // console.log("onclose:"+msg);
      };
      socket.onerror = function (_msg) {
        onErr(10001, 'failed to connect the websocket server');
      };
      socket.onmessage = function (msg) {
        if (typeof msg.data !== 'string') return;
        const arrayMsg = msg.data.split('$&');
        // console.log("length="+arrayMsg.length);
        // console.log(msg.data);
        if (arrayMsg.length < 2) return;
        const cmd = arrayMsg[0];
        const ret = arrayMsg[1];
        switch (cmd) {
          case '203': // open camera
            if (ret === '0' || ret === '-11') {
              that.callback.openCam[0]();
            } else {
              that.callback.openCam[1](ret, 'failed');
            }
            break;

          case '204': // close camera
            that.callback.closeCam[0]();
            break;

          case '205': // live result
            if (ret === '0') {
              // start success
            } else if (ret === '100') {
              // live success
              that.callback.faceCheck[0](`${arrayMsg[2]}$&${arrayMsg[3]}$&${arrayMsg[4]}`);
            } // live failed
            else {
              if (ret !== '104') {
                //
                that.callback.faceCheck[1](ret, 'failed');
              }
            }

            break;

          case '207':
            if (ret === '0') {
              that.callback.cropImage[0](arrayMsg[2]);
            } else {
              that.callback.cropImage[1](ret, 'failed');
            }
            break;

          case '209':
            if (ret === '0') {
              that.callback.cropImageAdvance[0](arrayMsg[2]);
            } else {
              that.callback.cropImageAdvance[1](ret, 'failed');
            }
            break;

          case '208':
            if (ret === '0') {
              that.callback.snapFrame[0](`${arrayMsg[2]}$&${arrayMsg[3]}`);
            } else {
              that.callback.snapFrame[1](ret, 'failed');
            }
            break;

          case '210': // live result
            if (ret === '0') {
              // start success
            } else if (ret === '100') {
              // live success
              that.callback.faceCheckAdvance[0](`${arrayMsg[2]}$&${arrayMsg[3]}`);
            } // live failed
            else {
              if (ret !== '104') {
                //
                that.callback.faceCheckAdvance[1](ret, 'failed');
              }
            }
            break;

          case '211':
            that.callback.enumAllCameras[0](arrayMsg[2]);
            break;

          case '212':
            if (ret === '0') {
              if (arrayMsg.length > 2) {
                const state = Number.parseInt(arrayMsg[2]);
                if (!Number.isNaN(state)) {
                  const faceCount = Number.parseInt(arrayMsg[3]);
                  const result = {
                    state: Number.parseInt(arrayMsg[2]),
                    faceCount,
                  };
                  if (state === 0 && faceCount === 1) {
                    result.info = JSON.parse(arrayMsg[4]);
                  }
                  if (that.callback.startFaceInfoMonitor[0]) {
                    that.callback.startFaceInfoMonitor[0](result);
                  }
                }
              }
            }
            break;

          case '213':
            if (that.callback.stopFaceInfoMonitor[0]) {
              that.callback.stopFaceInfoMonitor[0]();
            }
            break;

          case '214':
            if (that.callback.checkLicense[0]) {
              that.callback.checkLicense[0](ret);
            }
            break;

          case '215':
            if (that.callback.generateRequest[0]) {
              that.callback.generateRequest[0](ret, arrayMsg[2]);
            }
            break;

          case '216':
            if (that.callback.activateLicense[0]) {
              that.callback.activateLicense[0](ret);
            }
            break;

          case '217':
            if (that.callback.getSn[0]) {
              if (ret === '0') {
                that.callback.getSn[0](`${ret}$&${arrayMsg[2]}`);
              } else {
                that.callback.getSn[0](ret);
              }
            }
            break;

          case '218':
            if (that.callback.getFrimVer[0]) {
              if (ret === '0') {
                that.callback.getFrimVer[0](`${ret}$&${arrayMsg[2]}`);
              } else {
                that.callback.getFrimVer[0](ret);
              }
            }
            break;

          case '298':
            if (that.callback.showDialog[0]) {
              that.callback.showDialog[0](ret);
            }
            break;
          case '299':
            if (that.callback.hideDialog[0]) {
              that.callback.hideDialog[0](ret);
            }
            break;

          case '300': // preview data
            if (that.callback.openCam[2]) {
              that.callback.openCam[2](arrayMsg[2]);
            }
            break;

          case '301': // process events
            that.callback.faceCheck[2](Number.parseInt(arrayMsg[1]));
            break;

          case '230':
            that.callback.startCaptureDialog[0](`${arrayMsg[2]}$&${arrayMsg[3]}$&${arrayMsg[4]}`);
            break;

          case '231':
            that.callback.stopCaptureDialog[0](arrayMsg[1]);
            break;
        }
      };
    },

    disconnect(onSucc, _onErr) {
      onSucc = onSucc || function () {};
      _onErr = _onErr || function () {};
      if (typeof socket === 'object' && socket !== null) {
        socket.onclose = function () {};
        socket.close();
        socket = null;
      }
      onSucc();
    },

    startCaptureDialog(_OnResult) {
      _OnResult = _OnResult || function () {};
      sendMsg(`230$&${JSON.stringify(paramsInner)}`);
    },

    stopCaptureDialog(_OnResult) {
      _OnResult = _OnResult || function () {};
      this.callback.stopCaptureDialog[0] = _OnResult;
      sendMsg('231');
    },

    openCam(onSucc, onErr, onPreview) {
      onSucc = onSucc || function () {};
      onErr = onErr || function (_msg) {};
      onPreview = onPreview || function (_data) {};
      this.callback.openCam[0] = onSucc;
      this.callback.openCam[1] = onErr;
      this.callback.openCam[2] = onPreview;
      sendMsg(`203$&${JSON.stringify(paramsInner)}`);
    },

    faceCheck(onSucc, onErr, onProcessState) {
      onSucc = onSucc || function () {};
      onErr = onErr || function (_msg) {};
      this.callback.faceCheck[0] = onSucc;
      this.callback.faceCheck[1] = onErr;
      let needProcess = 0;
      if (onProcessState) {
        this.callback.faceCheck[2] = onProcessState;
        needProcess = 1;
      }
      sendMsg(`205$&${needProcess}`);
    },

    closeCam(onSucc, onErr) {
      onSucc = onSucc || function () {};
      onErr = onErr || function (_msg) {};
      this.callback.closeCam[0] = onSucc;
      this.callback.closeCam[1] = onErr;
      sendMsg('204');
    },

    cropImage(imgWhole, faceRc, maxSize, onSucc, onErr) {
      onSucc = onSucc || function () {};
      onErr = onErr || function (_msg) {};
      this.callback.cropImage[0] = onSucc;
      this.callback.cropImage[1] = onErr;
      sendMsg(`207$&${imgWhole}$&${faceRc}$&${maxSize}`);
    },

    cropImageAdvance(imgWhole, faceRc, dstWide, dstHigh, maxSize, onSucc, onErr) {
      onSucc = onSucc || function () {};
      onErr = onErr || function (_msg) {};
      this.callback.cropImageAdvance[0] = onSucc;
      this.callback.cropImageAdvance[1] = onErr;
      sendMsg(`209$&${imgWhole}$&${faceRc}$&${dstWide}$&${dstHigh}$&${maxSize}`);
    },

    snapFrame(mode, onSucc, onErr) {
      onSucc = onSucc || function () {};
      onErr = onErr || function (_msg) {};
      this.callback.snapFrame[0] = onSucc;
      this.callback.snapFrame[1] = onErr;
      sendMsg(`208$&${mode}`);
    },

    faceCheckAdvance(key, needCrop, cropWidth, cropHeight, cropMaxSize, onSucc, onErr) {
      onSucc =
        onSucc ||
        function () {
          console.log('succ');
        };
      onErr =
        onErr ||
        function (msg) {
          console.log(`fail:${msg}`);
        };
      this.callback.faceCheckAdvance[0] = onSucc;
      this.callback.faceCheckAdvance[1] = onErr;
      sendMsg(`210$&${key}$&${needCrop}$&${cropWidth}$&${cropHeight}$&${cropMaxSize}`);
    },

    enumAllCameras(onResult) {
      onResult =
        onResult ||
        function (devList) {
          console.log(`devlists=${devList}`);
        };
      this.callback.enumAllCameras[0] = onResult;
      sendMsg('211');
    },

    startFaceInfoMonitor(params, onResult) {
      onResult =
        onResult ||
        function (result) {
          console.log(`faceInfo=${result}`);
        };
      this.callback.startFaceInfoMonitor[0] = onResult;
      sendMsg(`212$&${JSON.stringify(params)}`);
    },

    stopFaceInfoMonitor(onResult) {
      onResult = onResult || function () {};
      this.callback.stopFaceInfoMonitor[0] = onResult;
      sendMsg('213');
    },

    showDialog(params, OnResult) {
      this.callback.showDialog[0] = OnResult;
      sendMsg(`298$&${JSON.stringify(params)}`);
    },

    hideDialog(type, OnResult) {
      this.callback.hideDialog[0] = OnResult;
      sendMsg(`299$&${type}`);
    },

    checkLicense(idPro, OnResult) {
      this.callback.checkLicense[0] = OnResult;
      sendMsg(`214$&${idPro}`);
    },

    generateRequest(sn, OnResult) {
      this.callback.generateRequest[0] = OnResult;
      sendMsg(`215$&${sn}`);
    },

    activateLicense(lic, OnResult) {
      this.callback.activateLicense[0] = OnResult;
      sendMsg(`216$&${lic}`);
    },

    getSn(OnResult) {
      this.callback.getSn[0] = OnResult;
      sendMsg('217');
    },

    getFirmVer(OnResult) {
      this.callback.getFirmVer[0] = OnResult;
      sendMsg('218');
    },
  };
  return EcFaceWS;
})();
