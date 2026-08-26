import { useState, useMemo, useEffect } from 'react';
import { TaskDetailData, getTaskById, getTaskVideos, getVideoUrl, getVideoTitle, taskDetails } from '../data/taskVideos';

interface TaskDetailProps {
  taskId: number;
  onNavigate: (path: string) => void;
}

export default function TaskDetail({ taskId, onNavigate }: TaskDetailProps) {
  const task = getTaskById(taskId);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [videoError, setVideoError] = useState<string>('');
  const [blobUrl, setBlobUrl] = useState<string>('');
  const [isBlobLoading, setIsBlobLoading] = useState(false);
  const [blobRetried, setBlobRetried] = useState(false);

  const videos = useMemo(() => {
    if (!task) return [];
    return getTaskVideos(task);
  }, [task]);

  // 切换任务时重置
  useEffect(() => {
    setCurrentVideoIndex(0);
    setCopied(false);
    setVideoError('');
    if (blobUrl) { URL.revokeObjectURL(blobUrl); setBlobUrl(''); }
    setBlobRetried(false);
    setIsBlobLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  // 切换当前视频时回收旧 blob
  useEffect(() => {
    if (blobUrl) { URL.revokeObjectURL(blobUrl); setBlobUrl(''); }
    setBlobRetried(false);
    setIsBlobLoading(false);
    setVideoError('');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentVideoIndex]);

  if (!task) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">未找到该任务</h2>
        <p className="text-gray-500 mb-4">任务可能已下架</p>
        <button
          onClick={() => onNavigate('/tasksquare')}
          className="rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
        >
          返回任务广场
        </button>
      </div>
    );
  }

  const currentVideo = videos[currentVideoIndex];
  const videoUrl = currentVideo ? getVideoUrl(currentVideo.folder, currentVideo.index) : '';
  const effectiveSrc = blobUrl || videoUrl;

  // GitHub Release 返回 Content-Disposition: attachment + 无 CORS 头，导致 <video> ERR_ABORTED
  // 方案：onerror 时走公共 CORS 代理（corsproxy.io / allorigins），代理会返回 inline + CORS
  //        再 fetch + Blob URL 内联播放（<400MB 直接播放；>400MB 提示切局域网或新标签页打开）
  const MAX_BLOB_BYTES = 400 * 1024 * 1024;
  const CORS_PROXIES = [
    (u: string) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
    (u: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
    (u: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`,
  ];

  async function handleFallbackBlob(src: string) {
    if (blobRetried || !src) return;
    setBlobRetried(true);
    setIsBlobLoading(true);
    setVideoError('⚙️  正在通过 CORS 备用通道加载视频（公网模式）...');
    let lastError = '未知错误';
    for (let pi = 0; pi < CORS_PROXIES.length; pi++) {
      try {
        const proxyUrl = CORS_PROXIES[pi](src);
        if (pi > 0) setVideoError(`⚙️  通道 ${pi} 失败，切换备用通道 ${pi + 1}/${CORS_PROXIES.length} ...`);
        // HEAD 检查大小 (通过代理)
        let size = -1;
        try {
          const hr = await fetch(proxyUrl, { method: 'HEAD' });
          const cl = hr.headers.get('Content-Length');
          if (cl) size = parseInt(cl, 10);
        } catch { /* 代理不支持 HEAD 也没关系 */ }
        if (size > MAX_BLOB_BYTES) {
          const mb = Math.round(size / 1024 / 1024);
          setVideoError(`⚠️  该视频较大（${mb}MB），为避免浏览器内存占用过高：
① 切换到【局域网模式】可流畅播放超大视频（首页有"start.bat"一键启动脚本）；
② 或右键点击下方链接 → 新标签页打开，浏览器下载后直接播放；
③ 或使用 Chrome/Safari 桌面浏览器复制链接直接打开。
原视频链接：${src}`);
          setIsBlobLoading(false);
          return;
        }
        // Fetch 完整数据 → Blob URL
        const r = await fetch(proxyUrl, { cache: 'force-cache' });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const blob = await r.blob();
        const typeFix = /video\//i.test(blob.type) ? blob.type : 'video/mp4';
        const realBlob = /video\//i.test(blob.type) ? blob : new Blob([blob], { type: typeFix });
        if (realBlob.size < 1024 * 50) throw new Error('代理返回空内容（大小<50KB）');
        const objectUrl = URL.createObjectURL(realBlob);
        setBlobUrl(objectUrl);
        setVideoError('');
        return; // 成功
      } catch (err: any) {
        lastError = (err && err.message) ? err.message : String(err);
      }
    }
    // 所有通道失败
    setVideoError(`❌ 3 条备用通道均失败：${lastError.substring(0, 150)}
建议：
① 本地运行 start.bat → 用局域网地址打开视频（无任何限制，支持2GB+视频拖动进度条）；
② 或【直接打开视频链接】用浏览器单独播放（右键复制下面链接到新标签页）：
${src}`);
    setIsBlobLoading(false);
  }

  // 同一分类下的其他任务
  const relatedTasks = taskDetails.filter(
    (t) => t.categoryId === task.categoryId && t.id !== task.id
  );

  const handleCopyTaskName = () => {
    const text = `${task.categoryName}-${task.name}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSelectVideo = (idx: number) => {
    setCurrentVideoIndex(idx);
  };

  const handleNextTask = () => {
    const currentIdx = taskDetails.findIndex((t) => t.id === task.id);
    if (currentIdx < taskDetails.length - 1) {
      onNavigate(`/task/${taskDetails[currentIdx + 1].id}`);
    }
  };

  const handlePrevTask = () => {
    const currentIdx = taskDetails.findIndex((t) => t.id === task.id);
    if (currentIdx > 0) {
      onNavigate(`/task/${taskDetails[currentIdx - 1].id}`);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ===== 顶部返回栏 ===== */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => onNavigate('/tasksquare')}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-green-600 transition"
          >
            ← 返回找任务
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevTask}
              className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 hover:border-green-300 hover:text-green-600 transition"
            >
              上一个
            </button>
            <button
              onClick={handleNextTask}
              className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 hover:border-green-300 hover:text-green-600 transition"
            >
              下一个
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 md:px-4 py-4 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4 md:gap-6">
          {/* ===== 左侧：视频 + 任务信息 ===== */}
          <div>
            {/* 视频播放器 */}
            <div className="bg-black rounded-xl md:rounded-2xl overflow-hidden shadow-lg">
              {currentVideo ? (
                <>
                  <video
                    key={effectiveSrc + String(currentVideoIndex)}
                    controls
                    controlsList="nodownload"
                    autoPlay
                    muted={false}
                    playsInline
                    webkit-playsinline="true"
                    x5-playsinline="true"
                    x5-video-player-type="h5-page"
                    x5-video-player-fullscreen="false"
                    preload="auto"
                    className="w-full aspect-video object-contain bg-black"
                    onError={(e) => {
                      const target = e.currentTarget;
                      const code = target?.error?.code;
                      // 公网 CDN (attachment 或 CORS) 出错 → fallback 到 fetch+blob 内联模式
                      if (!blobRetried) {
                        handleFallbackBlob(videoUrl);
                        return;
                      }
                      const msg =
                        code === 1
                          ? '视频加载被中断，请检查网络或刷新重试'
                          : code === 2
                          ? '视频文件无法读取，请确认文件存在'
                          : code === 3
                          ? '视频解码失败：格式/编码不被当前浏览器支持'
                          : code === 4
                          ? '视频格式不受支持或文件路径错误'
                          : '视频播放异常';
                      setVideoError(`${msg}（错误码 ${code || '未知'}）
URL: ${videoUrl}`);
                    }}
                    onLoadStart={() => { if (!blobRetried) setVideoError(''); }}
                  >
                    <source src={effectiveSrc} type="video/mp4" />
                    您的浏览器不支持视频播放。请尝试：① 用 Chrome / Safari / Edge 现代浏览器 ② 不要使用 IE 或老旧微信 WebView
                  </video>
                  {isBlobLoading && (
                    <div className="mx-3 mt-2 mb-3 rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs md:text-sm text-blue-700">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                        <div className="font-medium">{videoError || '备用通道加载中...请稍候'}</div>
                      </div>
                    </div>
                  )}
                  {videoError && !isBlobLoading && (
                    <div className="mx-3 mt-3 mb-4 rounded-xl border border-red-200 bg-red-50 p-3 md:p-4 text-xs md:text-sm text-red-700">
                      <div className="font-bold mb-1">⚠️ 视频播放失败</div>
                      <div className="break-all whitespace-pre-wrap">{videoError}</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <button
                          onClick={() => {
                            setBlobRetried(false);
                            if (blobUrl) { URL.revokeObjectURL(blobUrl); setBlobUrl(''); }
                            handleFallbackBlob(videoUrl);
                          }}
                          className="rounded-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 text-xs font-medium"
                        >
                          🔁 用备用通道重试
                        </button>
                        {videoUrl.startsWith('http') && (
                          <a
                            href={videoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-full bg-green-500 hover:bg-green-600 text-white px-3 py-1 text-xs font-medium no-underline"
                          >
                            ⬇️ 新标签页下载/打开
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="aspect-video flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <div className="text-5xl mb-2">🎬</div>
                    <p>暂无示例视频</p>
                  </div>
                </div>
              )}
            </div>

            {/* 当前视频信息 */}
            {currentVideo && (
              <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-600">
                  示范 {currentVideo.index}
                </span>
                <span>{currentVideo.title}</span>
              </div>
            )}

            {/* 任务信息 */}
            <div className="mt-4 md:mt-6 bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm ring-1 ring-gray-100">
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <div className={`flex h-8 w-8 md:h-12 md:w-12 items-center justify-center rounded-lg md:rounded-xl bg-gradient-to-br ${getCategoryGradient(task.categoryId)} text-lg md:text-2xl shadow-sm`}>
                  {task.categoryEmoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-lg md:text-2xl font-bold text-gray-800 truncate">
                    {task.name}
                  </h1>
                  <p className="text-xs md:text-sm text-gray-500">
                    {task.categoryName}类 · 共 {videos.length} 个示范视频
                  </p>
                </div>
              </div>

              {/* 所需物料 */}
              <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-2.5 md:p-4">
                <span className="mt-0.5 text-base md:text-lg">📦</span>
                <div>
                  <div className="text-[10px] md:text-xs font-semibold text-amber-700 uppercase tracking-wide">
                    所需物料
                  </div>
                  <div className="mt-0.5 text-sm md:text-base font-medium text-amber-900">
                    {task.materials}
                  </div>
                </div>
              </div>

              {/* 复制任务名 */}
              <div className="mt-3 md:mt-4 flex items-center justify-between rounded-lg bg-green-50 px-3 md:px-4 py-2.5 md:py-3">
                <div>
                  <div className="text-[10px] md:text-xs text-green-600">提交时这样填写</div>
                  <div className="text-sm md:text-base font-semibold text-green-700">
                    {task.categoryName}-{task.name}
                  </div>
                </div>
                <button
                  onClick={handleCopyTaskName}
                  className="rounded-lg bg-green-500 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium text-white hover:bg-green-600 transition active:scale-95"
                >
                  {copied ? '✓ 已复制' : '复制任务名'}
                </button>
              </div>

              {/* 拍摄步骤 */}
              <div className="mt-4 md:mt-6">
                <h3 className="text-sm md:text-base font-bold text-gray-800 mb-2 md:mb-3">
                  📸 拍摄步骤
                </h3>
                <div className="space-y-2">
                  {task.steps.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2 md:gap-3 rounded-lg bg-gray-50 p-2 md:p-3">
                      <div className="flex h-6 w-6 md:h-7 md:w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-500 text-[10px] md:text-xs font-bold text-white">
                        {idx + 1}
                      </div>
                      <p className="text-xs md:text-sm text-gray-700">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 开拍前检查 */}
              <div className="mt-4 md:mt-6 rounded-lg bg-blue-50 p-3 md:p-4 border border-blue-100">
                <div className="text-xs md:text-sm text-blue-800">
                  <span className="font-semibold">开拍前检查：</span>{' '}
                  画面清楚、动作完整、双手无遮挡，任务名和实际动作一致。请以平台审核规则为准。
                </div>
              </div>
            </div>

            {/* 同分类其他任务 */}
            {relatedTasks.length > 0 && (
              <div className="mt-4 md:mt-6">
                <h3 className="text-sm md:text-base font-bold text-gray-800 mb-2 md:mb-3">
                  🔗 同类任务
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                  {relatedTasks.map((rt) => (
                    <button
                      key={rt.id}
                      onClick={() => onNavigate(`/task/${rt.id}`)}
                      className="rounded-lg bg-white p-2 md:p-3 text-left shadow-sm ring-1 ring-gray-100 hover:shadow-md hover:-translate-y-0.5 transition"
                    >
                      <div className="text-xs md:text-sm font-medium text-gray-800 truncate">
                        {rt.name}
                      </div>
                      <div className="mt-0.5 text-[10px] md:text-xs text-gray-400 truncate">
                        {rt.materials}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ===== 右侧：示例视频列表 ===== */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-5 shadow-sm ring-1 ring-gray-100">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <h3 className="text-sm md:text-base font-bold text-gray-800">
                  🎬 {videos.length} 个示范视频
                </h3>
                <span className="text-[10px] md:text-xs text-gray-400">
                  看 2~3 个，马上照着拍
                </span>
              </div>

              <div className="grid grid-cols-3 lg:grid-cols-3 gap-2 max-h-[500px] overflow-y-auto pr-1">
                {videos.map((v, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectVideo(idx)}
                    className={`group relative aspect-video rounded-lg overflow-hidden transition ${
                      idx === currentVideoIndex
                        ? 'ring-2 ring-green-500 ring-offset-1'
                        : 'ring-1 ring-gray-200 hover:ring-green-300'
                    }`}
                  >
                    {/* 视频缩略图占位（使用 video 元素获取封面） */}
                    <video
                      src={getVideoUrl(v.folder, v.index)}
                      className="absolute inset-0 w-full h-full object-cover"
                      muted
                      playsInline
                      preload="metadata"
                      onLoadedData={(e) => {
                        const t = e.currentTarget;
                        try { t.currentTime = 0.5; } catch (_) { /* noop */ }
                      }}
                    />
                    {/* 遮罩层 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    {/* 编号 */}
                    <div className="absolute top-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
                      {v.index}
                    </div>
                    {/* 播放按钮 */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center">
                        <div className="w-0 h-0 border-l-[6px] border-l-green-600 border-y-[4px] border-y-transparent ml-0.5" />
                      </div>
                    </div>
                    {/* 标题 */}
                    <div className="absolute bottom-0 left-0 right-0 p-1">
                      <div className="text-[9px] md:text-[10px] text-white font-medium truncate">
                        {v.title}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 移动端底部操作栏 */}
            <div className="mt-4 grid grid-cols-2 gap-2 md:hidden">
              <button className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-gray-100 text-center">
                <div className="text-lg mb-0.5">📋</div>
                <div className="text-xs font-medium text-gray-700">找任务</div>
              </button>
              <button className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-gray-100 text-center">
                <div className="text-lg mb-0.5">✅</div>
                <div className="text-xs font-medium text-gray-700">待拍清单</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 分类颜色映射
function getCategoryGradient(categoryId: string): string {
  const map: Record<string, string> = {
    packaging: 'from-amber-500 to-orange-500',
    retail: 'from-blue-500 to-indigo-500',
    vegetables: 'from-green-500 to-emerald-500',
    cleaning: 'from-cyan-500 to-teal-500',
    clothing: 'from-pink-500 to-rose-500',
    earphone: 'from-sky-500 to-blue-500',
    toy: 'from-yellow-500 to-amber-500',
    handcraft: 'from-fuchsia-500 to-pink-500',
    jewelry: 'from-rose-500 to-pink-500',
    lotus: 'from-purple-500 to-fuchsia-500',
    stand: 'from-indigo-500 to-violet-500',
    assembly: 'from-slate-500 to-gray-600',
  };
  return map[categoryId] || 'from-green-500 to-emerald-500';
}
