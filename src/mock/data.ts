/** Mock 数据 - 模拟后端返回 */

/** 摄像头占位图：一张简单的人物剪影 + 提示文字的 SVG，模拟视频流画面 */
// prettier-ignore
export const MOCK_CAMERA_PLACEHOLDER = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480">
    <defs>
      <radialGradient id="g" cx="50%" cy="40%" r="50%">
        <stop offset="0%" stop-color="#2a3a5c"/>
        <stop offset="100%" stop-color="#0a1020"/>
      </radialGradient>
    </defs>
    <rect width="640" height="480" fill="url(#g)"/>
    <!-- 扫描线 -->
    <line x1="0" y1="230" x2="640" y2="230" stroke="#1aff1a" stroke-opacity="0.15" stroke-width="1"/>
    <line x1="0" y1="250" x2="640" y2="250" stroke="#1aff1a" stroke-opacity="0.15" stroke-width="1"/>
    <!-- 人体剪影 -->
    <ellipse cx="320" cy="140" rx="50" ry="55" fill="none" stroke="#4a6a9c" stroke-width="2" opacity="0.6"/>
    <path d="M220,280 Q320,230 420,280 L440,430 Q320,450 200,430 Z" fill="none" stroke="#4a6a9c" stroke-width="2" opacity="0.5"/>
    <!-- 四角瞄框 -->
    <path d="M120,80 L200,80 L200,100" fill="none" stroke="#1aff1a" stroke-width="2" opacity="0.5"/>
    <path d="M440,80 L520,80 L520,100" fill="none" stroke="#1aff1a" stroke-width="2" opacity="0.5"/>
    <path d="M120,400 L200,400 L200,380" fill="none" stroke="#1aff1a" stroke-width="2" opacity="0.5"/>
    <path d="M440,400 L520,400 L520,380" fill="none" stroke="#1aff1a" stroke-width="2" opacity="0.5"/>
    <ellipse cx="320" cy="240" rx="210" ry="175" fill="none" stroke="#1aff1a" stroke-width="1" stroke-dasharray="8,6" opacity="0.3"/>
    <!-- 提示文字 -->
    <text x="320" y="440" text-anchor="middle" fill="#4a6a9c" font-size="16" font-family="sans-serif" opacity="0.7">Mock 摄像头画面 - 请靠近摄像头</text>
    <text x="320" y="460" text-anchor="middle" fill="#2a4a7c" font-size="12" font-family="sans-serif" opacity="0.5">视频流已由本地 Mock 数据替代</text>
  </svg>`,
)}`;

/** 虚拟人脸图片 base64（1x1 白色 JPEG），Mock 模式下 3 秒后自动发送给识别接口 */
export const MOCK_FACE_DUMMY_BASE64 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYI3Y9QoSF0zNTZGSVF/E/8QANREAAhEDEQA/APn+iiigD//2Q==';

// ── 生物识别接口 (loginApi) ──

const biometricMock: Record<string, (params?: any) => any> = {
  '/at/check-pressed': () => ({ isPressed: 1 }),
  '/at/template-match': () => ({ isSame: 1, account: 'admin' }),
  '/at/id-card-read': () => ({
    sName: '张三',
    sSex: '男',
    sNation: '汉',
    sBirthday: '1990-01-01',
    sAddress: '北京市朝阳区某某街道100号',
    sIDNumber: '110101199001011234',
    sValidFromDate: '2020.01.01',
    sValidExpiryDate: '2040.01.01',
    sPhoto:
      `data:image/svg+xml,${
        encodeURIComponent(
          '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="240" viewBox="0 0 200 240">' +
          '<rect width="200" height="240" fill="#e8f0fe"/>' +
          '<circle cx="100" cy="90" r="55" fill="#4a90d9" opacity="0.3"/>' +
          '<ellipse cx="100" cy="195" rx="65" ry="40" fill="#4a90d9" opacity="0.25"/>' +
          '<circle cx="100" cy="85" r="40" fill="#2c5aa0"/>' +
          '<ellipse cx="100" cy="200" rx="55" ry="38" fill="#2c5aa0"/>' +
          '<text x="100" y="30" text-anchor="middle" fill="#999" font-size="12" font-family="sans-serif">Mock 身份证照片</text>' +
          '</svg>',
        )}`,
  }),
  '/at/get-version': (params?: any) => ({
    name: params?.type === 1 ? 'DS-LIC' : '全部模块',
    version: '1.0.13.14',
  }),
  '/at/get-config': () => ({ language: 'zh_CN', ccEmails: 'admin@test.com' }),
  '/at/set-config': () => true,
  '/at/do-feature': () => ({ success: true }),
  '/at/composite-template': () => ({ success: true }),
  '/at/face-identify-result': () => ({ isAlive: 1, isSamePerson: 1, account: 'admin' }),
  '/fc/face-identify-result': () => ({ isAlive: 1, isSamePerson: 1 }),
};

// ── 生产服务接口 (proApi) ──

const tssMock: Record<string, (params?: any) => any> = {
  '/tss/produce-status': () => ({
    entire: {
      beltStatusDetail: 111,
      machineTotalDoc: 500,
      machineHandledDoc: 234,
      machineRemainDoc: 266,
      taskStatus: 0,
      modules: [
        { uid: 'm1', code: 3, name: '进本模块', status: 3, msg: '进本模块卡本，请检查进本通道' },
        { uid: 'm2', code: 3, name: '激光模块', status: 3, msg: '激光模块故障' },
        { uid: 'm3', code: 2, name: '喷墨模块', status: 2, msg: '喷墨模块墨水余量低' },
        { uid: 'm4', code: 3, name: '翻本模块', status: 3, msg: '翻本模块异常' },
        { uid: 'm5', code: 3, name: '打印机模块', status: 3, msg: '打印机模块异常' },
        { uid: 'm8', code: 3, name: '喷墨模块2', status: 3, msg: '喷墨模块2 喷头异常' },
        { uid: 'm6', code: 3, name: '翻本模块2', status: 3, msg: '翻本模块2 异常' },
        { uid: 'm7', code: 3, name: '出本模块', status: 3, msg: '出本模块卡本' },
      ],
      uvStatus: [{ status: 0, msg: '', uid: 'UV-001' }],
      errorInfo: { isShow: false, type: 0, position: 0, title: '', msg: '' },
    },
    additionPrint: { status: 0, items: [] },
    mainPrint: { status: 0, items: [] },
    blankCheck: { status: 0, items: [] },
    finishedProduct: {
      items: [
        { item: '良本数', value: '452' },
        { item: '废本数', value: '18' },
        { item: '良本率', value: '96.2%' },
      ],
    },
  }),
  '/tss/get-doc-num-produce': () => ({ docNum: 266 }),
  '/tss/machine-control': () => ({ success: true }),
  '/tss/doc-machine/init': () => ({ success: true }),
  '/tss/position-status': () => ({
    modules: [
      { code: 0, name: '进本模块', status: 0 },
      { code: 0, name: '激光模块', status: 0 },
      { code: 0, name: '喷墨模块', status: 0 },
    ],
    uvStatus: [{ status: 0, msg: '', uid: 'UV-001' }],
  }),
  '/tss/print-obsv': () => ({ success: true }),
  '/tss/uv/clear-log': () => ({ success: true }),
  '/tss/error-handle': () => ({ success: true }),

  // 智能质检
  '/tss/quality-check-last': () => ({
    totalCheck: 100,
    qualifiedCount: 96,
    unqualifiedCount: 4,
    passRate: '96%',
  }),
  '/tss/mv-para-get': () => ({}),
  '/tss/mv-para-set': () => ({ success: true }),
  '/tss/quality-check-history': () => ({ list: [], total: 0 }),

  // 设备维护
  '/tss/get-device': () => ({ list: [], total: 0 }),
  '/tss/api-transfer': () => ({ success: true }),
  '/tss/get-version': () => ({ list: [] }),
  '/tss/demo/add-task': () => ({ batchID: 'BATCH-001', taskID: 'TASK-001', totalPeopleNum: 100 }),

  // 设备维护 - 模块状态 & 错误处理
  '/tss/doc-machine/module-status': (params?: any) => {
    // adapter 阶段 config.data 已被 axios 序列化成 JSON 字符串，需兼容字符串与对象两种形态
    let moduleUid = 'm1';
    if (typeof params === 'string') {
      try {
        moduleUid = JSON.parse(params)?.moduleUid || 'm1';
      }
      catch {
        moduleUid = 'm1';
      }
    } else if (params?.moduleUid) {
      moduleUid = params.moduleUid;
    }
    const moduleMock: Record<string, any[]> = {
      // 每个模块只返回一条工位记录；uid 含 _SLEW_JOB → 左侧显示 bottom 图，否则 top 图
      m1: [
        {
          uid: 'M1_FEED_JOB',
          code: 3,
          msg: '卡本',
          mainCode: 1,
          subCode: 1,
          exDoc: [
            { fwBookSn: 20260821001, fwDocSn: 202608211510, docID: '12345678987654321' },
            { fwBookSn: 20260821002, fwDocSn: 202608211511, docID: '12345678987654322' },
            { fwBookSn: 20260821003, fwDocSn: 202608211512, docID: '12345678987654323' },
          ],
        },
      ],
      m2: [
        {
          uid: 'M2_LASER_JOB',
          code: 3,
          msg: '激光故障',
          mainCode: 2,
          subCode: 1,
          exDoc: [
            { fwBookSn: 20260822001, fwDocSn: 202608221510, docID: '22345678987654321' },
            { fwBookSn: 20260822002, fwDocSn: 202608221511, docID: '22345678987654322' },
            { fwBookSn: 20260822003, fwDocSn: 202608221512, docID: '22345678987654323' },
          ],
        },
      ],
      m3: [
        {
          uid: 'M3_SLEW_JOB',
          code: 2,
          msg: '墨水余量低',
          mainCode: 3,
          subCode: 1,
          exDoc: [
            { fwBookSn: 20260823001, fwDocSn: 202608231510, docID: '32345678987654321' },
            { fwBookSn: 20260823002, fwDocSn: 202608231511, docID: '32345678987654322' },
            { fwBookSn: 20260823003, fwDocSn: 202608231512, docID: '32345678987654323' },
          ],
        },
      ],
      m4: [
        {
          uid: 'M4_FEED_JOB',
          code: 3,
          msg: '翻本异常',
          mainCode: 4,
          subCode: 1,
          exDoc: [
            { fwBookSn: 20260824001, fwDocSn: 202608241510, docID: '42345678987654321' },
            { fwBookSn: 20260824002, fwDocSn: 202608241511, docID: '42345678987654322' },
            { fwBookSn: 20260824003, fwDocSn: 202608241512, docID: '42345678987654323' },
          ],
        },
      ],
      m6: [
        {
          uid: 'M6_SLEW_JOB',
          code: 3,
          msg: '翻本异常',
          mainCode: 6,
          subCode: 1,
          exDoc: [
            { fwBookSn: 20260826001, fwDocSn: 202608261510, docID: '62345678987654321' },
            { fwBookSn: 20260826002, fwDocSn: 202608261511, docID: '62345678987654322' },
            { fwBookSn: 20260826003, fwDocSn: 202608261512, docID: '62345678987654323' },
          ],
        },
      ],
      m7: [
        {
          uid: 'M7_OUT_JOB',
          code: 3,
          msg: '出本卡本',
          mainCode: 7,
          subCode: 1,
          exDoc: [
            { fwBookSn: 20260827001, fwDocSn: 202608271510, docID: '72345678987654321' },
            { fwBookSn: 20260827002, fwDocSn: 202608271511, docID: '72345678987654322' },
            { fwBookSn: 20260827003, fwDocSn: 202608271512, docID: '72345678987654323' },
          ],
        },
      ],
    };
    // 直接返回数组即可，findMockResponse 会统一包一层 { code, respData, msg }
    return moduleMock[moduleUid] || [];
  },
  '/tss/error-handle/send-cmd': () => ({ success: true }),
  '/tss/error-handle/remove-doc': () => ({ success: true }),
  '/tss/error-handle/done': () => ({ success: true }),
  '/tss/error-handle/submit': () => ({ success: true, msg: '提交成功' }),
  '/tss/deal-err-command': (params?: any) => {
    // adapter 阶段 config.data 为 JSON 字符串，解析出 jobUid + motion 原样回显
    let jobUid = '';
    let motion = 0;
    if (typeof params === 'string') {
      try {
        const p = JSON.parse(params);
        jobUid = p?.jobUid || '';
        motion = p?.motion ?? 0;
      } catch {
        /* ignore */
      }
    } else if (params) {
      jobUid = params.jobUid || '';
      motion = params.motion ?? 0;
    }
    return { success: true, jobUid, motion, msg: '指令已下发' };
  },
  '/tss/print-self-test': () => ({ success: true }),

  // 设备设置
  '/tss/set-system-para': () => ({ success: true }),
  '/tss/get-system-para': () => ({}),
  '/tss/get-uv-platform-config': () => ({}),
  '/tss/set-uv-platform-config': () => ({ success: true }),
  '/tss/get-uv-location-base': () => ({}),
  '/tss/set-uv-location-base': () => ({ success: true }),
  '/tss/get-load-slot-enable': () => ({ list: [] }),
  '/tss/set-load-slot-enable': () => ({ success: true }),
  '/tss/get-collection-slot-enable': () => ({ list: [] }),
  '/tss/set-collection-slot-enable': () => ({ success: true }),

  // 查询
  '/tss/get-task': () => ({ list: [], total: 0 }),
  '/tss/task-operate': () => ({ success: true }),
  '/tss/doc-data': () => ({ list: [], total: 0 }),
  '/tss/doc-operate': () => ({ success: true }),
  '/tss/physical-doc': () => ({ list: [], total: 0 }),
  '/tss/physical-doc-operate': () => ({ success: true }),
  '/tss/doc-detail': () => ({}),
  '/tss/doc-statistics': () => ({}),
  '/tss/doc-allStatistics': () => ({}),

  // 油墨余量
  '/tss/get-ink-remainder': () => ({ ink1: 80, ink2: 75 }),

  // 密码
  '/tss/password': () => ({ success: true }),

  // 用户录入
  '/tss/record-user-info': () => ({ success: true }),
};

// ── 合并 mock 映射 ──

const allMocks: Record<string, (params?: any) => any> = {};

for (const [path, handler] of Object.entries(biometricMock)) {
  allMocks[path] = handler;
}
for (const [path, handler] of Object.entries(tssMock)) {
  allMocks[path] = handler;
}

/**
 * 根据 URL 查找 mock 数据
 * 支持模糊匹配：/at/check-pressed 可匹配 http://localhost:6130/at/check-pressed
 */
export function findMockResponse(url: string, data?: any) {
  for (const [path, handler] of Object.entries(allMocks)) {
    if (url.includes(path)) {
      const respData = handler(data);
      return { code: 0, respData, msg: 'ok' };
    }
  }
  return null;
}
